import { View } from "../components/base/view";
import { IProduct } from "../types";
import { EventEmitter } from "../components/base/events";
import { CDN_URL } from '../utils/constants'; // <-- Импортируем CDN_URL

export class ProductModalView extends View<IProduct> {
    protected modal: HTMLElement;
    protected closeButton: HTMLElement;
    protected contentContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        
        // Находим модальное окно по ID
        this.modal = document.getElementById('modal-container')!;
        this.closeButton = this.modal.querySelector('.modal__close')!;
        this.contentContainer = this.modal.querySelector('.modal__content')!;

        // Закрываем изначально открытое окно
        this.modal.classList.remove('modal_active');

        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Обработчик закрытия по крестику
        this.closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.close();
        });

        // Обработчик закрытия по клику вне окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    render(data: IProduct): HTMLElement {
        this._data = data;
        
        // Заполняем контент из шаблона
        const template = document.getElementById('card-preview') as HTMLTemplateElement;
        const content = template.content.cloneNode(true) as HTMLElement;
        
        // Заполняем данные
        content.querySelector('.card__title')!.textContent = data.title;
        content.querySelector('.card__text')!.textContent = data.description;
        content.querySelector('.card__price')!.textContent = `${data.price} синапсов`;

        // --- Исправленная строчка для src изображения ---
        const imageUrl = `${CDN_URL}/${data.image}`;
        (content.querySelector('.card__image') as HTMLImageElement).src = imageUrl;
        // ----------------------------------------------

        // Обработчик кнопки "В корзину"
        const addButton = content.querySelector('.card__button')!;
        addButton.addEventListener('click', () => {
            this.events.emit('cart:add', { product: data });
            this.close();
        });

        // Очищаем и добавляем новый контент
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(content);
        
        // Показываем модальное окно
        this.modal.classList.add('modal_active');
        
        return this.container;
    }

    close(): void {
        this.modal.classList.remove('modal_active');
    }
}