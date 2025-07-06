import { EventEmitter } from './events';
import { ensureElement } from '../../utils/utils';

export class View<T = {}> {
    protected _data: T | undefined;
    protected container: HTMLElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        this.container = container;
        this.events = events;
    }
 protected setupCloseButton(): void {
    const modalContainer = this.container.closest('.modal__container');
    if (modalContainer) {
        const closeButton = modalContainer.querySelector('.modal__close');
         if (closeButton) {
           closeButton.addEventListener('click', () => {
                this.close();
            });
        }
    }
}
    public close(): void { 
        const modalElement = this.container.closest('.modal') as HTMLElement;
        if (modalElement) {
            modalElement.style.display = 'none'; 
        }
    }
}