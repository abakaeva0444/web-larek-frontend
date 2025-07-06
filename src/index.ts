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
        console.log('DOM loaded');
        const api = new Api('https://larek-api.nomoreparties.co/api/weblarek');
        const events = new EventEmitter();

        // Модели
       const productModel = new ProductModel(api, events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(api, events, productModel);

        // Получаем все элементы с классом modal__content
        const modalContents = document.querySelectorAll('.modal__content');

        // View
        const initialPageView = new InitialPageView(document.body, events);
        const productModalView = new ProductModalView(document.body, events);
        const cartView = new CartView(document.body, events);

        // Используем modalContents для контейнеров
        const orderDeliveryView = new OrderDeliveryView(modalContents[3] as HTMLElement, events); // 4-й модал,форма доставки
        console.log('OrderPaymentView container:', modalContents[4]);
        const orderPaymentView = new OrderPaymentView(modalContents[4] as HTMLElement, events); // 5-й модал,форма оплаты
        const successOrderView = new SuccessOrderView(modalContents[5] as HTMLElement, events); // 6-й модал,сообщение об успехе

        // Обработчики событий
        events.on('product:select', (event: { product: IProduct }) => {
            productModalView.render(event.product);
        });

        events.on('cart:add', (event: { product: IProduct }) => {
            cartModel.addItem(event.product);
            productModalView.setInCart(true);
            productModalView.render(event.product); // Перерисовка модального окна
        });

events.on('cart:remove', (event: { id: string }) => {
    cartModel.removeItem(event.id);
    const product = productModel.getProduct(event.id)
    if (product) {
        productModalView.setInCart(false);
    }
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
            cartView.close(); // Закрываем корзину
            orderDeliveryView.render(); // Показываем форму доставки, которая теперь показывает модальное окно
        });

        events.on('order:deliverySubmit', (data: { payment: string; address: string }) => {
            console.log('Событие order:deliverySubmit получено:', data); 
            orderModel.setPaymentMethod(data.payment);
            orderModel.setAddress(data.address);
           orderDeliveryView.close();
            orderPaymentView.render(); 
        });

        events.on('order:paymentSubmit', (data: { email: string; phone: string }) => {
            orderModel.setContacts(data.email, data.phone);
            orderPaymentView.close(); // Закрываем форму оплаты

            // Отправка заказа
            orderModel.submitOrder(
                cartModel.items.map(item => item.product.id),
                cartModel.total
            )
            .then(order => {
                cartModel.clearCart(); // Очищаем корзину
                successOrderView.render({ orderId: order.id }); // Показываем сообщение об успехе
            })
            .catch(error => {
                console.error('Ошибка при отправке заказа:', error);
                // Показать сообщение об ошибке пользователю
            });
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