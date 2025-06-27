import { ensureElement } from '../utils/utils';
import { ICartItem } from '../types';
import { EventEmitter } from '../components/base/events';

export class CartItemView {
    protected _element: HTMLElement;
    protected _titleElement: HTMLElement;
    protected _quantityElement: HTMLElement;
    protected _priceElement: HTMLElement;
    protected _removeButton: HTMLElement;

    constructor(
        element: HTMLElement,
        protected cartItem: ICartItem,
        protected events: EventEmitter
    ) {
        this._element = element;
        this._titleElement = ensureElement<HTMLElement>('.card__title', element);
        this._quantityElement = ensureElement<HTMLElement>('.basket__item-index', element);
        this._priceElement = ensureElement<HTMLElement>('.card__price', element);
        this._removeButton = ensureElement<HTMLElement>('.basket__item-delete', element);

        this._removeButton.addEventListener('click', () => {
            events.emit('cart:remove', { productId: cartItem.product.id });
        });
    }

    render(cartItem: ICartItem): HTMLElement {
        this._titleElement.textContent = cartItem.product.title;
        this._quantityElement.textContent = String(cartItem.quantity);
        this._priceElement.textContent = `${cartItem.product.price} синапсов`;
        return this._element;
    }
}