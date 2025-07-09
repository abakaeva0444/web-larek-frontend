import './scss/styles.scss';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';
import { InitialPageView } from './views/InitialPageView';
import { ProductModalView } from './views/productModalView';
import { CartView } from './views/cartView';
import { IProduct } from './types';
import { OrderDeliveryView } from './views/OrderDeliveryView';
import { OrderPaymentView } from './views/OrderPaymentView';
import { SuccessOrderView } from './views/SuccessOrderView';
import { OrderModel } from './models/OrderModel';

document.addEventListener('DOMContentLoaded', () => {
	try {
		const api = new Api('https://larek-api.nomoreparties.co/api/weblarek');
		const events = new EventEmitter();

		// Модели
		const productModel = new ProductModel(api, events);
		const cartModel = new CartModel(events, productModel);
		const orderModel = new OrderModel(api, events, productModel);

		// Получаем все элементы с классом modal__content
		const modalContents = document.querySelectorAll('.modal__content');

		// View
		const initialPageView = new InitialPageView(document.body, events);
		const productModalView = new ProductModalView(document.body, events);
		const cartView = new CartView(document.body, events, productModel);
		const orderDeliveryView = new OrderDeliveryView(
			modalContents[3] as HTMLElement,
			orderModel,
			events
		);
		const orderPaymentView = new OrderPaymentView(
			modalContents[4] as HTMLElement,
			orderModel,
			events
		);
		const successOrderView = new SuccessOrderView(
			modalContents[5] as HTMLElement,
			events
		);

		// Обработчики событий
		events.on('product:select', (event: { product: IProduct }) => {
			productModalView.render(event.product);
		});

		events.on('cart:add', (event: { product: IProduct }) => {
			cartModel.addItem(event.product);
			productModalView.setInCart(true);
			productModalView.render(event.product);
		});

		events.on('cart:remove', (event: { id: string }) => {
			cartModel.removeItem(event.id);

			if (event.id) {
				productModel.getProduct(event.id).then((product) => {
					if (product) {
						productModalView.setInCart(false);
						productModalView.render(product);
					}
				});
			}
		});
		events.on('cart:open', () => {
			cartView.render({
				items: cartModel.items,
				total: cartModel.total,
			});
			cartView.open();
		});

		events.on('cart:changed', () => {
			// Обновляем счетчик в хедере
			const counter = document.querySelector('.header__basket-counter');
			if (counter) {
				counter.textContent = String(cartModel.items.length);
			}
		});

		// Обработчик кнопки корзины в хедере
		document.querySelector('.header__basket')?.addEventListener('click', () => {
			events.emit('cart:open');
		});

		events.on('order:start', () => {
			cartView.close(); // Закрываем корзину
			orderDeliveryView.render(); // Показываем форму доставки, которая теперь показывает модальное окно
		});

		events.on(
			'order:deliverySubmit',
			(data: { payment: string; address: string }) => {
				orderModel.setPaymentMethod(data.payment);
				orderModel.setAddress(data.address);

				if (orderModel.validateOrder()) {
					orderDeliveryView.close();
					orderPaymentView.render();
				} else {
					// Отображаем ошибки доставки
					const errors = orderModel.getValidationErrors();

					orderDeliveryView.showErrors(errors);
				}
			}
		);

		events.on(
			'order:paymentSubmit',
			(data: { email: string; phone: string }) => {
				orderModel.setContacts(data.email, data.phone);
				orderPaymentView.close(); // Закрываем форму оплаты

				// Отправка заказа
				orderModel
					.submitOrder(
						cartModel.items.map((item) => item.productId),
						cartModel.total
					)
					.then((order) => {
						cartModel.clearCart(); // Очищаем корзину
						if (order && order.id) {
							successOrderView.render({ orderId: order.id }); // Показываем сообщение об успехе
						} else {
							console.error('Ошибка: Не удалось получить ID заказа.');
							// Показать сообщение об ошибке пользователю
						}
					})
					.catch((error) => {
						console.error('Ошибка при отправке заказа:', error);
						// Показать сообщение об ошибке пользователю
					});
			}
		);

		// Загрузка товаров
		productModel
			.getProducts()
			.then((products) => {
				initialPageView.render(products);
			})
			.catch((err) => {
				console.error('Ошибка загрузки товаров:', err);
			});
	} catch (error) {
		console.error('Initialization error:', error);
	}
});
