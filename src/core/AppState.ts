// src/core/AppState.ts (Управление состояниями)

import { EventEmitter } from '../components/base/events';
import { ProductFormatted } from '../types';
import { CartModel } from '../models/CartModel';
import { ProductModel } from '../models/ProductModel';
import { OrderModel } from '../models/OrderModel';

export class AppState {
	constructor(
		private events: EventEmitter,
		private productModel: ProductModel,
		private cartModel: CartModel,
		private orderModel: OrderModel
	) {
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		// выбора товара
		this.events.on('product:select', (data: { id: string }) => {
			this.showProductDetails(data.id);
		});

		// добавления в корзину
		this.events.on('cart:add', (data: { id: string }) => {
			this.addToCart(data.id);
		});

		// удаления из корзины
		this.events.on('cart:remove', (data: { id: string }) => {
			this.removeFromCart(data.id);
		});

		// открытия корзины
		this.events.on('cart:open', () => {
			this.openCart();
		});

		// оформления заказа
		this.events.on('order:submit', () => {
			this.submitOrder();
		});
	}

	private showProductDetails(productId: string): void {
		const product = this.productModel.getProductById(productId);
		if (product) {
			const inCart = this.cartModel
				.getItems()
				.some((item) => item.product.id === productId);
			this.events.emit('modal:open', {
				view: 'product-details',
				product,
				inCart,
			});
		}
	}

	private addToCart(productId: string): void {
		const product = this.productModel.getProductById(productId);
		if (product) {
			this.cartModel.addItem(product);
			this.events.emit('cart:changed');
		}
	}

	private removeFromCart(productId: string): void {
		this.cartModel.removeItem(productId);
		this.events.emit('cart:changed');
	}

	private openCart(): void {
		if (this.cartModel.isEmpty()) {
			this.events.emit('notification:show', {
				message: 'Корзина пуста',
			});
			return;
		}
		this.events.emit('modal:open', {
			view: 'cart',
			items: this.cartModel.getItems(),
			total: this.cartModel.getTotal(),
		});
	}

	private submitOrder(): void {
		this.events.emit('modal:open', {
			view: 'order-form',
			total: this.cartModel.getTotal(),
		});
	}
}
