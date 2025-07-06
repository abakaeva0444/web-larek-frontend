import { View } from "../components/base/view";
import { ICartItem } from "../types";
import { EventEmitter } from "../components/base/events";
import { ensureElement } from "../utils/utils";

export class CartView extends View<{ items: ICartItem[]; total: number }> {
    protected modal: HTMLElement;
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected checkoutButton: HTMLButtonElement;
    protected closeButton: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);

        this.modal = document.querySelectorAll('.modal')[2] as HTMLElement;
        this.list = ensureElement<HTMLElement>('.basket__list', this.modal);
        this.total = ensureElement<HTMLElement>('.basket__price', this.modal);
        this.checkoutButton = ensureElement<HTMLButtonElement>('.button', this.modal); 
        this.closeButton = ensureElement<HTMLElement>('.modal__close', this.modal);

        console.log('CartView checkoutButton:', this.checkoutButton);

       
        this.modal.style.display = 'none'; 

        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Обработчик кнопки "Оформить"
        this.checkoutButton.addEventListener('click', () => {
            console.log('emitting order:start event');
            this.events.emit('order:start');
        });

        // Обработчик закрытия по крестику
        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        // Обработчик закрытия по клику вне окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Обработчик события для кнопок “Удалить”
this.list.addEventListener('click', (e) => {
    const target = e.target as HTMLElement; 
    const id = (target.closest('.basket__item') as HTMLLIElement)?.dataset.id; 
    if (!id) {
        return;
    }
    this.events.emit('cart:remove', { id });
});
    }


    render(data: { items: ICartItem[]; total: number }): HTMLElement {
        this._data = data;
        this.list.innerHTML = '';

        if (!data.items.length) {
            this.list.innerHTML = 'Корзина пуста';
            return this.container;
        }
        // Заполняем список товаров
        data.items.forEach((item, index) => {
            this.list.innerHTML += `
            <li class="basket__item card card_compact" data-id="${item.product.id}">
                <span class="basket__item-index">${index + 1}</span>
                <span class="card__title">${item.product.title}</span>
                <span class="card__price">${item.product.price} синапсов</span>
                <button class="basket__item-delete" aria-label="удалить"></button>
            </li>
            `;
        });

        // Обновляем общую сумму
        this.total.textContent = `${data.total} синапсов`;

        return this.container;
    }

    open(): void {
        this.modal.style.display = 'block'; 
    }

    close(): void {
        this.modal.style.display = 'none'; 
    }
}