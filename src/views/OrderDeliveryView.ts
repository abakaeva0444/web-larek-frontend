import { EventEmitter } from '../components/base/events';
import { View } from '../components/base/view';
import { ensureElement, cloneTemplate } from '../utils/utils';

interface IDeliveryForm {
    payment: string;
    address: string;
}

export class OrderDeliveryView extends View<IDeliveryForm> {
    protected paymentButtons: HTMLButtonElement[] = [];
    protected addressInput: HTMLInputElement | null = null;
    protected nextButton: HTMLButtonElement | null = null;
    protected formElement: HTMLElement | null = null;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);

    }

    private initializeForm() {
        this.formElement = this.container.querySelector('form[name="order"]');

        if (!this.formElement) {
            console.error('Order form not found');
            return;
        }

        this.paymentButtons = Array.from(this.formElement.querySelectorAll('.button_alt')) as HTMLButtonElement[];
        this.addressInput = this.formElement.querySelector<HTMLInputElement>('input[name="address"]');
        this.nextButton = this.formElement.querySelector<HTMLButtonElement>('.modal__actions .button');
        this.errorsElement = this.formElement.querySelector<HTMLElement>('.form__errors')!;

        if (!this.paymentButtons.length || !this.addressInput || !this.nextButton) {
            console.error('Some form elements not found');
            return;
        }

        // Добавляем обработчики только если элементы найдены
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => this.handlePaymentSelect(button));
        });

        this.addressInput.addEventListener('input', () => this.handleAddressInput());

        this.nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.events.emit('order:deliverySubmit', {
                    payment: this._data.payment,
                    address: this._data.address
                });
            }
        });
    }

private handlePaymentSelect(button: HTMLButtonElement) {
    this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
    button.classList.add('button_alt-active');
    this._data = {
        ...this._data,
        payment: button.name
    };
    this.validateForm();
    console.log('Выбран способ оплаты:', button.name); 
}

private handleAddressInput() {
    this._data = {
        ...this._data,
        address: this.addressInput!.value 
    };
    this.validateForm();
}

private validateForm() {
    const paymentValid = !!this._data?.payment;
    const addressValid = !!this._data?.address?.trim();
    const isValid = paymentValid && addressValid;

    this.setDisabled(this.nextButton!, !isValid);

    if (!paymentValid) {
        this.errorsElement.textContent = 'Необходимо выбрать способ оплаты';
    } else if (!addressValid) {
        this.errorsElement.textContent = 'Необходимо указать адрес';
    } else {
        this.errorsElement.textContent = '';
    }
    return isValid;
}

    render(): HTMLElement {
        this.container.innerHTML = ''; // Очищаем контейнер
        const template = cloneTemplate<HTMLElement>('#order');
        this.container.appendChild(template);
        this.initializeForm();
        this.setupCloseButton();
        // Находим родительский элемент с классом "modal"
        const modalElement = this.container.closest('.modal') as HTMLElement;

        if (modalElement) {
            console.log('Modal element found:', modalElement);
            modalElement.style.display = 'block'; 
        } else {
            console.error('Modal element not found!');
        }

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