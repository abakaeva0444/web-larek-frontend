//  Элемент корзины (src/components/CartItem.ts)

import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { CartItem as CartItemType } from '../types';

export class CartItem extends Component<CartItemType> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		this._index = container.querySelector('.basket__item-index');
		this._title = container.querySelector('.card__title');
		this._price = container.querySelector('.card__price');
		this._button = container.querySelector('.card__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('cart:remove', { id: this.container.dataset.id });
			});
		}
	}

	render(data: CartItemType): HTMLElement {
		this.setText(this._index, (data.quantity || 1).toString());
		this.setText(this._title, data.product.title);
		this.setText(this._price, `${data.product.price * data.quantity} синапсов`);
		this.container.dataset.id = data.product.id;
		return this.container;
	}
}
