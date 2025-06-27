import { View } from "../components/base/view";
import { ICartItem } from "../types";
import { EventEmitter } from "../components/base/events";

export class CartView extends View<{items: ICartItem[], total: number}> {
    protected modal: HTMLElement;
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected checkoutButton: HTMLElement;
    protected closeButton: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        
        // Находим модальное окно корзины (3-е по порядку)
        this.modal = document.querySelectorAll('.modal')[2] as HTMLElement;
        this.list = this.modal.querySelector('.basket__list')!;
        this.total = this.modal.querySelector('.basket__price')!;
        this.checkoutButton = this.modal.querySelector('.button')!;
        this.closeButton = this.modal.querySelector('.modal__close')!;

        // Сразу скрываем окно
        this.modal.classList.remove('modal_active');

        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Обработчик кнопки "Оформить"
        this.checkoutButton.addEventListener('click', () => {
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
    }

    render(data: {items: ICartItem[], total: number}): HTMLElement {
        this._data = data;
        this.list.innerHTML = '';
        
        // Заполняем список товаров
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        data.items.forEach((item, index) => {
            const card = template.content.cloneNode(true) as HTMLElement;
            const li = card.querySelector('li')!;
            
            li.querySelector('.card__title')!.textContent = item.product.title;
            li.querySelector('.card__price')!.textContent = `${item.product.price} синапсов`;
            li.querySelector('.basket__item-index')!.textContent = String(index + 1);
            
            // Обработчик кнопки удаления
            li.querySelector('.basket__item-delete')!.addEventListener('click', () => {
                this.events.emit('cart:remove', { id: item.product.id });
            });

            this.list.appendChild(card);
        });

        // Обновляем общую сумму
        this.total.textContent = `${data.total} синапсов`;
        
        return this.container;
    }

    open(): void {
        this.modal.classList.add('modal_active');
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }
}