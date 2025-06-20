// src/presenters/appPresenter.ts (Главный презентер)

import { EventEmitter } from '../components/base/events';
import { Api } from '../components/base/api';
import { ProductModel } from '../models/ProductModel';
import { CartModel } from '../models/CartModel';
import { OrderModel } from '../models/OrderModel';
import { CatalogView } from '../views/catalogView';
import { CartView } from '../views/cartView';
import { OrderView } from '../views/orderView';
import { ProductModalView } from '../views/productModalView'; 
import { ModalView } from '../views/ModalView';

export class AppPresenter {
    constructor(
        private events: EventEmitter,
        private api: Api,
        private productModel: ProductModel,
        private cartModel: CartModel,
        private orderModel: OrderModel,
        private catalogView: CatalogView,
        private cartView: CartView,
        private orderView: OrderView,
        private productModalView: ProductModalView,
        private modalView: ModalView
    ) {
        this.setupEventListeners();
        this.initialize();
    }

    private setupEventListeners() {
        this.events.on('products:changed', () => this.renderCatalog());
        this.events.on('cart:updated', () => this.renderCart());
        this.events.on('product:select', (data: { id: string }) => this.showProductModal(data.id));
        this.events.on('order:open', () => this.openOrderForm());
        this.events.on('order:submit', () => this.submitOrder());
    }

    private async initialize() {
        try {
            await this.productModel.fetchProducts();
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    }

    private renderCatalog() {
        this.catalogView.render(this.productModel.getProducts());
    }

    private renderCart() {
        this.cartView.render({
            items: this.cartModel.getItems(),
            total: this.cartModel.getTotal()
        });
    }

   private showProductModal(id: string) {
    const product = this.productModel.getProductById(id);
    if (product) {
        const modalContent = this.productModalView.render(product);
        this.modalView.open(modalContent);
    }
    }

    private openOrderForm() {
        this.orderView.render({});
        this.modalView.open();
    }

    private async submitOrder() {
        try {
            await this.orderModel.submitOrder(this.cartModel.getItems());
            this.cartModel.clearCart();
            this.events.emit('order:success');
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
        }
    }
}