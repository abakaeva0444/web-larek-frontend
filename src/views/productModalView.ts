// src/views/productModalView.ts ()

import { View } from '../components/base/view';
import { ensureElement } from '../utils/utils';
import { ProductFormatted } from '../types';
import { EventEmitter } from '../components/base/events';

export class ProductModalView extends View<ProductFormatted> {
    protected image: HTMLImageElement;
    protected title: HTMLElement;
    protected description: HTMLElement;
    protected price: HTMLElement;
    protected addButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);
        
        this.image = ensureElement<HTMLImageElement>('.card__image', container);
        this.title = ensureElement<HTMLElement>('.card__title', container);
        this.description = ensureElement<HTMLElement>('.card__text', container);
        this.price = ensureElement<HTMLElement>('.card__price', container);
        this.addButton = ensureElement<HTMLButtonElement>('.card__button', container);

        this.addButton.addEventListener('click', () => {
            if (this.container.dataset.id) {
                events.emit('cart:add', { id: this.container.dataset.id });
            }
        });
    }

    render(data: ProductFormatted): HTMLElement {
        this.container.dataset.id = data.id;
        this.image.src = data.imageUrl;
        this.image.alt = data.title;
        this.title.textContent = data.title;
        this.description.textContent = data.description;
        this.price.textContent = data.priceFormatted;

        return this.container;
    }
}