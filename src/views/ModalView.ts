import { ensureElement } from '../utils/utils';
export class ModalView {
    protected container: HTMLElement;
    protected contentContainer: HTMLElement;
    protected closeButton: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);
        this.closeButton = ensureElement<HTMLElement>('.modal__close', container);

        // Навешиваем обработчики закрытия
        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', (e: MouseEvent) => {
            if (e.target === this.container) this.close();
        });
    }

    open(content?: HTMLElement): void {
        if (content) {
            this.contentContainer.innerHTML = '';
            this.contentContainer.append(content);
        }
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }
}