import { EventEmitter } from "../components/base/events";
import { ICartItem, IProduct } from "../types";

export class CartModel {
    private _items: ICartItem[] = [];
    private _total: number = 0;

    constructor(protected events: EventEmitter) {}

    get items(): ICartItem[] {
        return this._items;
    }

    get total(): number {
        return this._total;
    }

    addItem(product: IProduct): void {
        const existingItem = this._items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this._items.push({
                product,
                quantity: 1
            });
        }
        this.updateTotal();
        this.events.emit('cart:changed');
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.product.id !== id);
        this.updateTotal();
        this.events.emit('cart:changed');
    }

    clearCart(): void {
        this._items = [];
        this._total = 0;
        this.events.emit('cart:changed');
    }

    private updateTotal(): void {
        this._total = this._items.reduce(
            (sum, item) => sum + (item.product.price * item.quantity),
            0
        );
    }
}