// SuccessOrderView.ts
import { View } from '../components/base/view';
import { EventEmitter } from '../components/base/events';
import { ensureElement, cloneTemplate } from '../utils/utils';

export class SuccessOrderView extends View<{ orderId: string }> {
    protected closeButton: HTMLElement;
    protected descriptionElement: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        console.log('Я Payment!!!')
        // Клонируем шаблон
    }
    render(data: { orderId: string }): HTMLElement {
    this.container.innerHTML = '';
    const template = document.getElementById('success') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as HTMLElement;

    // Ищем элемент с классом order-success__description
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', content);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', content);

    this.descriptionElement.textContent = `Заказ оформлен № ${data.orderId}`;

    this.closeButton.addEventListener('click', () => {
        this.close();
    });
    // Находим родительский элемент с классом "modal"
    //const modalContent = this.container.querySelector('.modal__content') as HTMLElement;
    //if (modalContent) {
        //modalContent.appendChild(content);
    //} else {
        //console.error('Modal content not found!');
    //}
    this.container.appendChild(content);
    const modalElement = this.container.closest('.modal') as HTMLElement;

    if (modalElement) {
        console.log('Modal element found:', modalElement);
        modalElement.style.display = 'block'; // Отображаем модальное окно
    } else {
        console.error('Modal element not found!');
    }
    return this.container;
}

    close(): void {
        const modalElement = this.container.closest('.modal') as HTMLElement;
        if (modalElement) {
            modalElement.style.display = 'none'; // Отображаем модальное окно
        }
    }
}