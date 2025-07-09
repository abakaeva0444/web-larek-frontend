// CartItemView.ts
import { ensureElement } from '../utils/utils';
import { ICartItem, IProduct } from '../types';
import { EventEmitter } from '../components/base/events';
import { ProductModel } from '../models/ProductModel';
export class CartItemView {
	protected _element: HTMLLIElement;
	protected _titleElement: HTMLElement;
	protected _quantityElement: HTMLElement;
	protected _priceElement: HTMLElement;
	protected _removeButton: HTMLElement;
	private product: IProduct | undefined;
	constructor(
		protected cartItem: ICartItem,
		protected events: EventEmitter,
		private productModel: ProductModel
	) {
		this._element = document.createElement('li'); //  Создаем li элемент
		this._element.classList.add('basket__item', 'card', 'card_compact'); // Добавляем классы
		this._element.dataset.id = cartItem.productId; //  Устанавливаем data-id
		// Создаем внутреннюю разметку
		this._element.innerHTML = `
            <span class="basket__item-index"></span>
            <span class="card__title"></span>
            <span class="card__price"></span>
            <button class="basket__item-delete" aria-label="удалить"></button>
        `;
		this._titleElement = ensureElement<HTMLElement>(
			'.card__title',
			this._element
		);
		this._quantityElement = ensureElement<HTMLElement>(
			'.basket__item-index',
			this._element
		);
		this._priceElement = ensureElement<HTMLElement>(
			'.card__price',
			this._element
		);
		this._removeButton = ensureElement<HTMLElement>(
			'.basket__item-delete',
			this._element
		);
		this.productModel.getProduct(cartItem.productId).then((product) => {
			if (product) {
				this.product = product;
				this.render();
			}
		});

		this._removeButton.addEventListener('click', (e) => {
			events.emit('cart:remove', { id: cartItem.productId });
			e.stopPropagation(); // Предотвращаем всплытие события
		});
	}

	async render(): Promise<HTMLLIElement> {
		if (!this.product) {
			return this._element;
		}
		this._titleElement.textContent = this.product.title;
		this._quantityElement.textContent = String(this.cartItem.quantity);
		this._priceElement.textContent = `${this.product.price} синапсов`;
		return this._element;
	}
}
