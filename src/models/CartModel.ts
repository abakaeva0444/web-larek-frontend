import { EventEmitter } from '../components/base/events';
import { ICartItem, IProduct } from '../types';
import { ProductModel } from '../models/ProductModel';

export class CartModel {
	private _items: ICartItem[] = [];
	private _total: number = 0;
	private productModel: ProductModel;

	constructor(protected events: EventEmitter, productModel: ProductModel) {
		this.productModel = productModel;
	}

	get items(): ICartItem[] {
		return this._items;
	}

	get total(): number {
		return this._total;
	}

	addItem(product: IProduct): void {
		const existingItem = this._items.find(
			(item) => item.productId === product.id
		);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			this._items.push({
				productId: product.id,
				quantity: 1,
			});
		}
		this.updateTotal();
		this.events.emit('cart:changed');
	}

	removeItem(id: string): void {
		this._items = this._items.filter((item) => item.productId !== id);
		this.updateTotal();
		this.events.emit('cart:changed');
	}

	clearCart(): void {
		this._items = [];
		this._total = 0;
		this.updateTotal();
		this.events.emit('cart:changed');
	}

	private async updateTotal(): Promise<void> {
		let total = 0;
		for (const item of this._items) {
			const product = await this.productModel.getProduct(item.productId);
			if (product) {
				total += product.price * item.quantity;
			}
		}
		this._total = total;
	}
}
