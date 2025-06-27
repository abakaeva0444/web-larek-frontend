import './scss/styles.scss';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';
import { InitialPageView } from './views/InitialPageView';
import { ProductModalView } from './views/productModalView';
import { CartView } from './views/cartView';
import { IProduct } from './types';

document.addEventListener('DOMContentLoaded', () => {
    try {
        const api = new Api('https://larek-api.nomoreparties.co/api/weblarek');
        const events = new EventEmitter();

        // Модели
        const productModel = new ProductModel(api, events);
        const cartModel = new CartModel(events);
        const orderModel = new OrderModel(api, events);

        // View
        const initialPageView = new InitialPageView(document.body, events);
        const productModalView = new ProductModalView(document.body, events);
        const cartView = new CartView(document.body, events);

        // Обработчики событий
        events.on('product:select', (event: { product: IProduct }) => {
            productModalView.render(event.product);
        });

        events.on('cart:add', (event: { product: IProduct }) => {
            cartModel.addItem(event.product);
        });

        events.on('cart:remove', (event: { id: string }) => {
            cartModel.removeItem(event.id);
        });

        events.on('cart:open', () => {
            cartView.render({
                items: cartModel.items,
                total: cartModel.total
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
            console.log('Начато оформление заказа');
            // Здесь будет логика перехода к оформлению
        });

        // Загрузка товаров
        productModel.getProducts()
            .then(products => {
                initialPageView.render(products);
            })
            .catch(err => {
                console.error('Ошибка загрузки товаров:', err);
            });

    } catch (error) {
        console.error('Initialization error:', error);
    }
});