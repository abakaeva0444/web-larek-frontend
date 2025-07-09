import { Api } from '../components/base/api';
import { IOrder, ICartItem, IProduct } from '../types';
import { EventEmitter } from '../components/base/events';
import { ProductModel } from './ProductModel';

export class OrderModel {
	private _order: Partial<IOrder> = {};
	private productModel: ProductModel;
	private _validationErrors: { [key: string]: string } = {};

	constructor(
		protected api: Api,
		protected events: EventEmitter,
		productModel: ProductModel
	) {
		this.productModel = productModel;
	}

	setPaymentMethod(method: string): void {
		this._order.payment = method;
	}

	setAddress(address: string): void {
		this._order.address = address;
	}

	setContacts(email: string, phone: string): void {
		this._order.email = email;
		this._order.phone = phone;
	}

	// Валидация данных заказа
	validateOrder(): boolean {
		this._validationErrors = {};

		if (!this._order.payment) {
			this._validationErrors.payment = 'Не указан способ оплаты.';
		}
		if (!this._order.address) {
			this._validationErrors.address = 'Не указан адрес доставки.';
		}

		const isValid = Object.keys(this._validationErrors).length === 0;

		this.events.emit('order:validation', {
			isValid,
			errors: this._validationErrors,
		});
		return isValid;
	}

	private isValidEmail(email: string | undefined): boolean {
		if (!email) return false;
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	private isValidPhone(phone: string | undefined): boolean {
		if (!phone) return false;
		return /^\+?\d{10,12}$/.test(phone);
	}

	// Получение ошибок валидации
	getValidationErrors(): { [key: string]: string } {
		return this._validationErrors;
	}

	async submitOrder(
		productIds: string[],
		total: number
	): Promise<{ id: string } | undefined> {
		if (!this.validateOrder()) {
			console.error('Order is not valid, cannot submit.');
			return undefined; //  не отправляем заказ, если он не прошел валидацию.
		}

		try {
			const cartItems = await Promise.all(
				productIds.map(async (productId) => {
					const product = await this.productModel.getProduct(productId);
					if (!product) {
						console.error(`Product with id ${productId} not found`);
						return null;
					}
					return { productId: product.id, quantity: 1 };
				})
			);

			const validCartItems = cartItems.filter(
				(item): item is ICartItem => item !== null
			);

			this._order.items = validCartItems;
			this._order.total = total;

			const response = (await this.api.post(
				'/order',
				this._order as IOrder
			)) as { id: string };

			return response;
		} catch (error) {
			console.error('Error submitting order:', error);
			this.events.emit('order:submitError', { error });
			return undefined; //  возвращаем undefined в случае ошибки
		}
	}
}
