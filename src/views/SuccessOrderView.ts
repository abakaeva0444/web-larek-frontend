import { View } from '../components/base/view';
import { EventEmitter } from '../components/base/events';
import { ensureElement, cloneTemplate } from '../utils/utils';

export class SuccessOrderView extends View<{ orderId: string }> {
	protected closeButton: HTMLElement;
	protected descriptionElement: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container, events);
	}
	render(data: { orderId: string }): HTMLElement {
		this.container.innerHTML = '';
		const template = document.getElementById('success') as HTMLTemplateElement;
		const content = template.content.cloneNode(true) as HTMLElement;

		this.descriptionElement = ensureElement<HTMLElement>(
			'.order-success__description',
			content
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			content
		);

		this.descriptionElement.textContent = `Заказ оформлен № ${data.orderId}`;

		this.closeButton.addEventListener('click', () => {
			this.close();
		});

		this.container.appendChild(content);
		const modalElement = this.container.closest('.modal') as HTMLElement;

		if (modalElement) {
			modalElement.style.display = 'block';
		} else {
			console.error('Modal element not found!');
		}
		return this.container;
	}

	close(): void {
		const modalElement = this.container.closest('.modal') as HTMLElement;
		if (modalElement) {
			modalElement.style.display = 'none';
		}
	}
}
