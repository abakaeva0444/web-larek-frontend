// Компонент корзины (src/components/Cart.ts)

import { View } from '../components/base/view';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { CartItem } from '../types';
import { EventEmitter } from '../components/base/events';

export class CartView extends View<{ items: CartItem[], total: number }> {
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected button: HTMLButtonElement;
    itemsList: HTMLUListElement;
    price: HTMLSpanElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
        const basketElement = cloneTemplate<HTMLDivElement>(basketTemplate);
        container.appendChild(basketElement);
        super(container, events);
        this.itemsList = ensureElement<HTMLUListElement>('.basket .basket__list', this.container);
        this.price = ensureElement<HTMLSpanElement>('.basket .basket__price', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button',container);
        
        this.button.addEventListener('click', () => {
            events.emit('order:open');
        });

        this.list.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            const deleteButton = target.closest('.basket__item-delete');
            if (deleteButton) {
                const item = deleteButton.closest<HTMLElement>('[data-id]');
                if (item && item.dataset.id) {
                    events.emit('cart:remove', { id: item.dataset.id });
                }
            }
        });
    }

    render({ items, total }: { items: CartItem[]; total: number }): HTMLElement {
        this.list.innerHTML = items.map((item, index) => `
            <li class="basket__item" data-id="${item.product.id}">
                <span class="basket__item-index">${index + 1}</span>
                <span class="card__title">${item.product.title}</span>
                <span class="card__price">${item.product.priceFormatted}</span>
                <button class="basket__item-delete" aria-label="удалить"></button>
            </li>
        `).join('');
        
        this.total.textContent = `${total} синапсов`;
        this.button.disabled = items.length === 0;
        return this.container;
    }
}
