// src/components/Page.ts (Главная страница)

import { Component } from './base/Component';
import { EventEmitter } from './base/events';

interface PageData {
	catalog: HTMLElement[];
	counter: number;
}

export class Page extends Component<PageData> {
	setCounter(arg0: number) {
		throw new Error('Method not implemented.');
	}
	render(data?: Partial<PageData>): HTMLElement {
		throw new Error('Method not implemented.');
	}
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _basket: HTMLElement;
	protected _pageWrapper: HTMLElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		this._counter = this.container.querySelector('.header__basket-counter');
		this._catalog = this.container.querySelector('.gallery');
		this._basket = this.container.querySelector('.header__basket');
		this._pageWrapper = this.container.querySelector('.page__wrapper');

		if (this._basket) {
			this._basket.addEventListener('click', () => {
				this.events.emit('cart:open');
			});
		}
	}

	set catalog(items: HTMLElement[]) {
		if (this._catalog) {
			this._catalog.replaceChildren(...items);
		}
	}

	set counter(value: number) {
		if (this._counter) {
			this.setText(this._counter, String(value));
		}
	}

	lockPage(): void {
		if (this._pageWrapper) {
			this._pageWrapper.classList.add('page__wrapper_locked');
		}
	}

	unlockPage(): void {
		if (this._pageWrapper) {
			this._pageWrapper.classList.remove('page__wrapper_locked');
		}
	}
}
