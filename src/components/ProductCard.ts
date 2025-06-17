// src/components/ProductCard.ts

import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { ProductFormatted } from '../types';

export class ProductCard extends Component<ProductFormatted> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		this._title = this.container.querySelector('.card__title');
		this._price = this.container.querySelector('.card__price');
		this._image = this.container.querySelector('.card__image');
		this._button = this.container.querySelector('.card__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('product:select', { id: this.container.dataset.id });
			});
		} else {
			this.container.addEventListener('click', () => {
				events.emit('product:select', { id: this.container.dataset.id });
			});
		}
	}

	render(data: ProductFormatted): HTMLElement {
		if (!this.container) {
			console.error('Container is undefined');
			return document.createElement('div');
		}

		this.setText(this._title, data.title);
		this.setText(this._price, data.priceFormatted || '');
		this.setImage(this._image, data.imageUrl, data.title);

		if (this._button) {
			this.setDisabled(this._button, data.price === null);
		}

		this.container.dataset.id = data.id;
		return this.container;
	}
}
