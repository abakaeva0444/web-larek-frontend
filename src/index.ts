// src/index.ts

import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';
import { AppData } from './AppData';
import { API_URL } from './utils/constants';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { ProductCard } from './components/ProductCard';
import { ProductModalView } from './components/ProductModalView';
import { Cart } from './components/Cart';
import { Product, ProductFormatted } from './types';

// Инициализация
const events = new EventEmitter();
const api = new Api(API_URL);

// Проверка и получение DOM элементов
const pageElement = document.querySelector('.page');
const modalContainer = document.querySelector('#modal-container');
const cardPreviewTemplate = document.querySelector('#card-preview');
const basketElement = document.querySelector('#basket');
const cardCatalogTemplate = document.querySelector('#card-catalog');
const galleryElement = document.querySelector('.gallery');
const modalCloseButton = document.querySelector('.modal__close');

if (
	!pageElement ||
	!modalContainer ||
	!cardPreviewTemplate ||
	!basketElement ||
	!cardCatalogTemplate ||
	!galleryElement ||
	!modalCloseButton
) {
	throw new Error('Не найдены необходимые DOM элементы');
}

// Инициализация моделей
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);

// Инициализация AppData
const appData = new AppData(events, productModel, cartModel, orderModel);

// Инициализация UI компонентов
const page = new Page(pageElement as HTMLElement, events);
const modal = new Modal(modalContainer as HTMLElement, events);

// Создание экземпляра ProductModalView из шаблона
const productModalContent = (
	cardPreviewTemplate as HTMLTemplateElement
).content.cloneNode(true) as DocumentFragment;
const productModal = new ProductModalView(
	productModalContent.firstElementChild as HTMLElement,
	events
);

const cart = new Cart(basketElement as HTMLElement, events);

// Обработчик закрытия модального окна
(modalCloseButton as HTMLElement).addEventListener('click', () => {
	events.emit('modal:close');
});

// Загрузка товаров
appData
	.loadProducts()
	.then(() => {
		const products = productModel.getProducts();
		updateProductList(products);
	})
	.catch((error) => {
		console.error('Ошибка загрузки товаров:', error);
	});

// Функция обновления списка товаров
function updateProductList(products: ProductFormatted[]) {
	(galleryElement as HTMLElement).innerHTML = '';

	products.forEach((product) => {
		const cardElement = (
			cardCatalogTemplate as HTMLTemplateElement
		).content.cloneNode(true) as DocumentFragment;
		const card = new ProductCard(
			cardElement.firstElementChild as HTMLElement,
			events
		);
		const renderedCard = card.render(product);
		(galleryElement as HTMLElement).appendChild(renderedCard);
	});
}

// Обработчики событий
events.on('products:changed', (data: { products: ProductFormatted[] }) => {
	updateProductList(data.products);
});

events.on('cart:changed', () => {
	page.setCounter(cartModel.getTotal());
});

events.on('product:select', (data: { id: string }) => {
	const product = productModel.getProductById(data.id);
	if (product) {
		const inCart = cartModel
			.getItems()
			.some((item) => item.product.id === data.id);
		const modalContent = modalContainer.querySelector(
			'.modal__content'
		) as HTMLElement;
		modalContent.innerHTML = '';
		modalContent.appendChild(
			productModal.render({
				product,
				inCart,
				open: function (product: Product, inCart: boolean): void {
					throw new Error('Function not implemented.');
				},
			})
		);
		modal.open();
	}
});

events.on('cart:open', () => {
	const modalContent = modalContainer.querySelector(
		'.modal__content'
	) as HTMLElement;
	modalContent.innerHTML = '';
	modalContent.appendChild(
		cart.render({
			items: cartModel.getItems(),
			total: cartModel.getTotal(),
		})
	);
	modal.open();
});

events.on('modal:close', () => {
	modal.close();
});
