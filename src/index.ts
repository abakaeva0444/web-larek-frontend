// src/index.ts
import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';
import { CatalogView } from './views/catalogView';
import { CartView } from './views/cartView';
import { OrderView } from './views/orderView';
import { ProductModalView } from './views/productModalView';
import { ModalView } from './views/ModalView';
import { AppPresenter } from './presenters/appPresenter';
import { API_URL } from './utils/constants';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Основные элементы
        const gallery = document.querySelector('.gallery');
if (!gallery) throw new Error('Gallery element not found');

       
        const basket = document.querySelector('.basket');
        const orderForm = document.querySelector('.order');
        
        const modalContainer = document.querySelector('#modal-container');

        if (!gallery || !basket || !orderForm || !modalContainer) {
            throw new Error('One or more required elements not found in DOM');
        }

        const events = new EventEmitter();
        const api = new Api(API_URL);

        // Модели
        const productModel = new ProductModel(events);
        const cartModel = new CartModel(events);
        const orderModel = new OrderModel(events);
        

        // View
        const catalogView = new CatalogView(gallery as HTMLElement, events);
        const cartView = new CartView(basket as HTMLElement, events);
        const orderView = new OrderView(orderForm as HTMLElement, events);
        const modalView = new ModalView(modalContainer as HTMLElement, events);

        // Создаем ProductModalView из шаблона
      const productModalTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
if (!productModalTemplate || !productModalTemplate.content) {
    throw new Error('Template #card-preview or its content not found');
}
const productModalView = new ProductModalView(
    productModalTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
    events
);

        // Презентер
        new AppPresenter(
            events,
            api,
            productModel,
            cartModel,
            orderModel,
            catalogView,
            cartView,
            orderView,
            productModalView,
            modalView
        );

    } catch (error) {
        console.error('Application initialization failed:', error);
        // Показать ошибку пользователю
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.padding = '20px';
        errorDiv.textContent = `Ошибка загрузки: ${(error as Error).message}`;
        document.body.prepend(errorDiv);
    }
});