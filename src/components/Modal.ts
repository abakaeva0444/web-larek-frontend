// Модальное окно (src/components/Modal.ts)

import { Component } from './base/Component';
import { EventEmitter } from './base/events';

export class Modal extends Component<{ content: HTMLElement }> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		this._closeButton = container.querySelector('.modal__close');
		this._content = container.querySelector('.modal__content');

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	render(data: { content: HTMLElement }): HTMLElement {
		this._content.replaceChildren(data.content);
		return this.container;
	}

	open(): void {
		this.container.classList.add('modal_active');
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
	}

	close(): void {
		this.container.classList.remove('modal_active');
		document.removeEventListener('keydown', this.handleKeyDown.bind(this));
		this.events.emit('modal:close');
	}

	private handleKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			this.close();
		}
	}
}
