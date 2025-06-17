import { EventEmitter } from '../components/base/events';
import { ProductFormatted, CartItem } from '../types';

export class CartModel {
	private eventEmitter: EventEmitter;
	private items: CartItem[] = [];

	constructor(eventEmitter: EventEmitter) {
		this.eventEmitter = eventEmitter;
	}

	addItem(product: ProductFormatted): void {
		const existingItem = this.items.find(
			(item) => item.product.id === product.id
		);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			this.items.push({
				product,
				quantity: 1,
			});
		}
		this.emitCartUpdate();
	}

	removeItem(productId: string): void {
		this.items = this.items.filter((item) => item.product.id !== productId);
		this.emitCartUpdate();
	}

	clearCart(): void {
		this.items = [];
		this.emitCartUpdate();
	}

	private emitCartUpdate(): void {
		this.eventEmitter.emit('cart:updated', {
			items: this.items,
			total: this.getTotal(),
		});
	}

	getItems(): CartItem[] {
		return this.items;
	}

	getTotal(): number {
		return this.items.reduce((sum, item) => {
			return sum + (item.product.price || 0) * item.quantity;
		}, 0);
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}
}

export { CartItem };
