// src/Views/catalogView.t (Представление каталога)

import { EventEmitter } from '../components/base/events';
import { View } from '../components/base/view';
import { ProductFormatted } from '../types';


export class CatalogView extends View<ProductFormatted[]> {
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);
        // Убираем поиск вложенного элемента, так как container - это и есть .gallery
    }

    render(items: ProductFormatted[]): HTMLElement {
        if (!items || items.length === 0) {
            this.container.innerHTML = ''; // Очищаем контейнер
            return this.container;
        }

        // Очищаем предыдущие обработчики
        this.container.querySelectorAll('.card').forEach(card => {
            card.replaceWith(card.cloneNode(true));
        });

        // Создаем HTML разметку
        this.container.innerHTML = items.map(item => `
            <button class="gallery__item card" data-id="${item.id}">
                <span class="card__category card__category_${item.category}">
                    ${item.category}
                </span>
                <h2 class="card__title">${item.title}</h2>
                <img class="card__image" src="${item.imageUrl}" alt="${item.title}" />
                <span class="card__price">${item.priceFormatted}</span>
            </button>
        `).join('');

        // Делегирование событий - более эффективный подход
        this.container.addEventListener('click', (event) => {
            const card = (event.target as HTMLElement).closest('.card');
            if (card) {
                this.events.emit('product:select', { 
                    id: card.getAttribute('data-id') as string 
                });
            }
        });

        return this.container;
    }
}

