// ProductModalView.ts
import { View } from "../components/base/view";
import { IProduct } from "../types";
import { EventEmitter } from "../components/base/events";
import { CDN_URL } from '../utils/constants';
import { ensureElement, cloneTemplate } from '../utils/utils'; // Импортируем cloneTemplate

export class ProductModalView extends View<IProduct> {
    protected modal: HTMLElement;
    protected closeButton: HTMLElement;
    protected contentContainer: HTMLElement;
    private button: HTMLButtonElement | null = null;
    public inCart: boolean = false;
    private product: IProduct | null = null;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);

        this.modal = document.getElementById('modal-container')!;
        this.closeButton = this.modal.querySelector('.modal__close')!;
        this.contentContainer = this.modal.querySelector('.modal__content')!;

        this.modal.style.display = 'none';

        this.setupEventListeners();
    }

    setInCart(value: boolean) {
        this.inCart = value;
        if (this.button) {
            this.button.textContent = this.inCart ? 'Убрать из корзины' : 'В корзину';
        }
    }

    private setupEventListeners() {
        this.closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.close();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    render(product: IProduct): HTMLElement {
        this.product = product;
        this.contentContainer.innerHTML = '';
        const template = document.getElementById('card-preview') as HTMLTemplateElement;
        const content = template.content.cloneNode(true) as HTMLElement;
        const imageUrl = `${CDN_URL}/${product.image}`;

        (content.querySelector('.card__image') as HTMLImageElement).src = imageUrl;
        (content.querySelector('.card__title') as HTMLElement).textContent = product.title;
        (content.querySelector('.card__text') as HTMLElement).textContent = product.description;
        (content.querySelector('.card__price') as HTMLElement).textContent = `${product.price} синапсов`;

        this.button = ensureElement<HTMLButtonElement>('.card__row .button', content); // Используем content
        this.button.textContent = this.inCart ? 'Убрать из корзины' : 'В корзину';
        this.setupButtonListener(product);

        this.contentContainer.appendChild(content);
        this.modal.style.display = 'block';
        return this.container;
    }

    private setupButtonListener(product: IProduct) {
        if (this.button) {
            this.button.addEventListener('click', () => {
                if (product) {
                  this.events.emit(this.inCart ? 'cart:remove' : 'cart:add', { product: product });
                }
            });
        }
    }

    close(): void {
        this.modal.style.display = 'none';
    }
}