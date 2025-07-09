import { View } from '../components/base/view';
import { ICartItem } from '../types';
import { EventEmitter } from '../components/base/events';
import { ensureElement } from '../utils/utils';
import { CartItemView } from './CartItemView';
import { ProductModel } from '../models/ProductModel';

export class CartView extends View<{ items: ICartItem[]; total: number }> {
	protected modal: HTMLElement;
	protected list: HTMLElement;
	protected total: HTMLElement;
	protected checkoutButton: HTMLButtonElement;
	protected closeButton: HTMLElement;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter,
		protected productModel: ProductModel
	) {
		super(container, events);

		this.modal = document.querySelectorAll('.modal')[2] as HTMLElement;
		this.list = ensureElement<HTMLElement>('.basket__list', this.modal);
		this.total = ensureElement<HTMLElement>('.basket__price', this.modal);
		this.checkoutButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.modal
		);
		this.closeButton = ensureElement<HTMLElement>('.modal__close', this.modal);
		this.modal.style.display = 'none';

		this.setupEventListeners();
	}

	private setupEventListeners() {
		this.checkoutButton.addEventListener('click', () => {
			this.events.emit('order:start');
		});

		this.closeButton.addEventListener('click', () => {
			this.close();
		});

		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) {
				this.close();
			}
		});

		// Обработчик события для кнопок “Удалить”
		this.list.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;

			if (target.classList.contains('basket__item-delete')) {
				const basketItem = target.closest('.basket__item');

				if (basketItem) {
					const id = (basketItem as HTMLElement).dataset.id;

					if (id) {
						this.events.emit('cart:remove', { id });
					}
				}
			}
		});
	}

	async render(data: {
		items: ICartItem[];
		total: number;
	}): Promise<HTMLElement> {
		this._data = data;
		this.list.innerHTML = '';

		if (!data.items.length) {
			this.list.innerHTML = 'Корзина пуста';
			return this.container;
		}

		for (const item of data.items) {
			const itemView = new CartItemView(item, this.events, this.productModel);
			const element = await itemView.render();
			this.list.appendChild(element);
		}

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
