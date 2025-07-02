import { View } from "../components/base/view";
import { IProduct } from "../types"; // Убедитесь, что путь к IProduct верный
import { EventEmitter } from "../components/base/events";
import { CDN_URL } from '../utils/constants'; // <-- Импортируем CDN_URL

export class InitialPageView extends View<IProduct[]> {
    protected gallery: HTMLElement;
    protected cartCounter: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        this.gallery = document.querySelector('.gallery')!;
        this.cartCounter = document.querySelector('.header__basket-counter')!;

        // Обработчик клика по корзине в хедере
        document.querySelector('.header__basket')?.addEventListener('click', () => {
            events.emit('cart:open');
        });
    }

    render(products: IProduct[]): HTMLElement {
        this.gallery.innerHTML = '';
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;

        products.forEach(product => {
            const card = template.content.cloneNode(true) as HTMLElement;
            const cardElement = card.querySelector('.gallery__item')! as HTMLElement; // Переименовал для ясности

            // --- Исправленная строчка для src изображения ---
            const imageUrl = `${CDN_URL}/${product.image}`;
            (cardElement.querySelector('.card__image') as HTMLImageElement).src = imageUrl;
            // ----------------------------------------------

            cardElement.querySelector('.card__title')!.textContent = product.title;
            cardElement.querySelector('.card__price')!.textContent = `${product.price} синапсов`;
            cardElement.querySelector('.card__category')!.textContent = product.category;
            cardElement.querySelector('.card__category')!.className = `card__category card__category_${product.category}`;

            cardElement.addEventListener('click', () => {
                this.events.emit('product:select', { product });
            });

            this.gallery.appendChild(cardElement); // Добавляем заполненный элемент
        });

        return this.container;
    }
}