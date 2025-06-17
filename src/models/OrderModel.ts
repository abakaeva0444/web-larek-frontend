// src/models/OrderModel.ts
import { Api } from '../components/base/api';
import { EventEmitter } from '../components/base/events';
import { API_URL } from '../utils/constants';
import { Order, PaymentMethod, CartItem } from '../types';

export class OrderModel {
	private api: Api;
	private eventEmitter: EventEmitter;
	private order: Partial<Order> = {};

	constructor(eventEmitter: EventEmitter) {
		this.api = new Api(API_URL);
		this.eventEmitter = eventEmitter;
	}

	setPaymentMethod(method: PaymentMethod): void {
		this.order.payment = method;
		this.validateOrder();
	}

	setContactInfo(email: string, phone: string): void {
		this.order.email = email;
		this.order.phone = phone;
		this.validateOrder();
	}

	setDeliveryAddress(address: string): void {
		this.order.address = address;
		this.validateOrder();
	}

	async submitOrder(cartItems: CartItem[]): Promise<void> {
		if (!this.isOrderValid()) {
			throw new Error('Order is not valid');
		}

		this.order.items = cartItems.map((item) => item.product.id);
		this.order.total = this.calculateTotal(cartItems);

		try {
			const response = await this.api.post('/order', this.order);
			this.eventEmitter.emit('order:success', { order: this.order, response });
			this.resetOrder();
		} catch (error) {
			this.eventEmitter.emit('order:error', { error });
			throw error;
		}
	}

	private calculateTotal(cartItems: CartItem[]): number {
		return cartItems.reduce((sum, item) => {
			return sum + (item.product.price || 0) * item.quantity;
		}, 0);
	}

	private validateOrder(): void {
		this.eventEmitter.emit('order:ready', {
			isValid: this.isOrderValid(),
			order: this.order,
		});
	}

	private isOrderValid(): boolean {
		return (
			!!this.order.payment &&
			!!this.order.email &&
			!!this.order.phone &&
			!!this.order.address
		);
	}

	private resetOrder(): void {
		this.order = {};
	}
}
