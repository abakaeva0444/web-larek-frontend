// src/components/ProductModalView.ts

import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { Product, ProductFormatted } from '../types';

interface ProductModalData {
	product: ProductFormatted;
	inCart: boolean;
	open(product: Product, inCart: boolean): void;
}

export class ProductModalView extends Component<ProductModalData> {
	open(product: ProductFormatted, inCart: boolean) {
		throw new Error('Method not implemented.');
	}
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		// Обязательные элементы карточки товара
		this._title = this.ensureElement('.card__title');
		this._image = this.ensureElement('.card__image');
		this._price = this.ensureElement('.card__price');
		this._button = this.ensureElement('.card__button');
		this._category = this.ensureElement('.card__category');
		this._description = this.ensureElement('.card__text');

		this.setupEventListeners();
	}

	private ensureElement<T extends HTMLElement>(selector: string): T {
		const element = this.container.querySelector<T>(selector);
		if (!element) {
			throw new Error(
				`Не найден элемент с селектором ${selector} в шаблоне карточки`
			);
		}
		return element;
	}

	private setupEventListeners(): void {
		this._button.addEventListener('click', () => {
			const productId = this.container.dataset.id;
			if (productId) {
				this.events.emit(
					this._button.textContent === 'В корзину' ? 'cart:add' : 'cart:remove',
					{ id: productId }
				);
			}
		});
	}

	render(data: ProductModalData): HTMLElement {
		if (!data.product) return this.container;

		this.container.dataset.id = data.product.id;
		this.setText(this._title, data.product.title);
		this.setImage(this._image, data.product.imageUrl, data.product.title);
		this.setText(this._description, data.product.description || '');
		this.setText(this._price, data.product.priceFormatted);
		this.setText(this._category, data.product.category);

		// Обновляем класс категории
		const categoryClass = `card__category_${data.product.category.toLowerCase()}`;
		this._category.className = `card__category ${categoryClass}`;

		// Обновляем кнопку
		this._button.textContent = data.inCart ? 'Убрать из корзины' : 'В корзину';
		this.setDisabled(this._button, false);

		return this.container;
	}
}
