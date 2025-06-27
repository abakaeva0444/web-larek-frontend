import { EventEmitter } from '../components/base/events';
import { View } from '../components/base/view';
import { ensureElement } from '../utils/utils';

interface IDeliveryForm {
    payment: string;
    address: string;
}

export class OrderDeliveryView extends View<IDeliveryForm> {
    close() {
        throw new Error('Method not implemented.');
    }
    protected paymentButtons: HTMLButtonElement[] = [];
    protected addressInput: HTMLInputElement | null = null;
    protected nextButton: HTMLButtonElement | null = null;
    protected formElement: HTMLElement | null = null;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        // Находим модальное окно с формой доставки
        const deliveryModal = document.querySelector('.modal .order')?.closest('.modal') as HTMLElement;
        super(deliveryModal || container, events);
        
        this.initializeForm();
    }

    private initializeForm() {
        // Находим форму доставки
        this.formElement = this.container.querySelector('.order');
        
        if (!this.formElement) {
            console.error('Order form not found');
            return;
        }

        // Инициализируем элементы формы с проверкой
        this.paymentButtons = Array.from(this.formElement.querySelectorAll('.button_alt')) as HTMLButtonElement[];
        this.addressInput = this.formElement.querySelector('input[name="address"]');
        this.nextButton = this.formElement.querySelector('.order__button');

        if (!this.paymentButtons.length || !this.addressInput || !this.nextButton) {
            console.error('Some form elements not found');
            return;
        }

        // Добавляем обработчики только если элементы найдены
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => this.handlePaymentSelect(button));
        });

        this.addressInput.addEventListener('input', () => this.handleAddressInput());
    }

    private handlePaymentSelect(button: HTMLButtonElement) {
        this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this._data.payment = button.name;
        this.validateForm();
    }

    private handleAddressInput() {
        if (this.addressInput) {
            this._data.address = this.addressInput.value;
            this.validateForm();
        }
    }

    private validateForm() {
        if (this.nextButton) {
            const isValid = !!this._data.payment && !!this._data.address?.trim();
            this.setDisabled(this.nextButton, !isValid);
        }
    }

    render(): HTMLElement {
        this.container.classList.add('modal_active');
        return this.container;
    }

    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }
}