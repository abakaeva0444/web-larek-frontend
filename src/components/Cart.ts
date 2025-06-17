// Компонент корзины (src/components/Cart.ts)

import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { CartItem } from '../types';

interface CartData {
	items: CartItem[];
	total: number;
}

export class Cart extends Component<CartData> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		this._list = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('order:submit');
			});
		}
	}

	render(data: CartData): HTMLElement {
		if (this._list && this._total) {
			this._list.innerHTML = '';
			data.items.forEach((item, index) => {
				const itemElement = document.createElement('li');
				itemElement.classList.add('basket__item', 'card', 'card_compact');
				itemElement.innerHTML = `
                    <span class="basket__item-index">${index + 1}</span>
                    <span class="card__title">${item.product.title}</span>
                    <span class="card__price">${
											item.product.price * item.quantity
										} синапсов</span>
                    <button class="basket__item-delete" aria-label="удалить"></button>
                `;

				const deleteButton = itemElement.querySelector('.basket__item-delete');
				if (deleteButton) {
					deleteButton.addEventListener('click', () => {
						this.events.emit('cart:remove', { id: item.product.id });
					});
				}

				this._list.appendChild(itemElement);
			});

			this.setText(this._total, `${data.total} синапсов`);
		}
		return this.container;
	}
}
