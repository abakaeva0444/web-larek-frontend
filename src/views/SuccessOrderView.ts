import { View } from '../components/base/view';
import { EventEmitter } from '../components/base/events';
import { ensureElement } from '../utils/utils';

export class SuccessOrderView extends View<{ orderId: string }> {
    protected closeButton: HTMLElement;
    protected descriptionElement: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);
        
        try {
            this.closeButton = ensureElement<HTMLElement>('.order-success__close', container);
            this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);
            
            this.closeButton.addEventListener('click', () => {
                this.close();
            });
        } catch (error) {
            console.error('SuccessOrderView initialization error:', error);
            throw error;
        }
    }

    render(data: { orderId: string }): HTMLElement {
        this.descriptionElement.textContent = `Order #${data.orderId} completed`;
        this.container.classList.add('modal_active');
        return this.container;
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }
}