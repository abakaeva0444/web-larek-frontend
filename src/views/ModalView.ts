// Модальное окно (src/components/Modal.ts)

import { EventEmitter } from '../components/base/events';
import { View } from '../components/base/view';
import { ensureElement } from '../utils/utils';

interface ModalData {
    content?: HTMLElement;
}

export class ModalView extends View<ModalData> {
    protected closeButton: HTMLButtonElement;
    protected content: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.content = ensureElement<HTMLElement>('.modal__content', container);
        
        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e: MouseEvent) => {
            if (e.target === this.container) this.close();
        });

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape') this.close();
        });
    }

    open(content?: HTMLElement): void {
        if (content) {
            this.content.replaceChildren(content);
        }
        this.container.classList.remove('hidden');
    }

    close(): void {
        this.container.classList.add('hidden');
        this.events.emit('modal:close');
    }

    render(data?: ModalData): HTMLElement {
        if (data?.content) {
            this.content.replaceChildren(data.content);
        }
        return this.container;
    }
}