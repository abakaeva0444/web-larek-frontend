import { View } from "../components/base/view";
import { IProduct } from "../types";
import { EventEmitter } from "../components/base/events";

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
            const button = card.querySelector('.gallery__item')! as HTMLElement;
            
            button.querySelector('.card__title')!.textContent = product.title;
            button.querySelector('.card__price')!.textContent = `${product.price} синапсов`;
            (button.querySelector('.card__image') as HTMLImageElement).src = product.image;
            button.querySelector('.card__category')!.textContent = product.category;
            button.querySelector('.card__category')!.className = `card__category card__category_${product.category}`;

            button.addEventListener('click', () => {
                this.events.emit('product:select', { product });
            });

            this.gallery.appendChild(card);
        });

        return this.container;
    }
}