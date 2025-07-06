import { EventEmitter } from "../components/base/events";
import { View } from "../components/base/view";
import { ensureElement, cloneTemplate } from "../utils/utils";

interface IContactsForm {
    email: string;
    phone: string;
}

export class OrderPaymentView extends View<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected formElement: HTMLFormElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
    }
    private setupEventListeners() {
        this.emailInput.addEventListener('input', () => {
            this.validateForm();
        });

        this.phoneInput.addEventListener('input', () => {
            this.validateForm();
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.events.emit('order:paymentSubmit', {
                    email: this.emailInput.value,
                    phone: this.phoneInput.value
                });
            }
        });
    }

    private validateForm(): boolean {
        const emailValue = this.emailInput.value;
        const phoneValue = this.phoneInput.value;

        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
        const phoneValid = /^\+?[\d\s\-\(\)]{7,}$/.test(phoneValue);
        const isValid = emailValid && phoneValid;

        this.setDisabled(this.submitButton, !isValid);

        if (!emailValid) {
            this.errorsElement.textContent = 'Введите корректный email';
        } else if (!phoneValid) {
            this.errorsElement.textContent = 'Введите корректный номер телефона';
        } else {
            this.errorsElement.textContent = ''; 
        }

        return isValid;
    }
    render(): HTMLElement {
        console.log('OrderPaymentView render() called');
        this.container.innerHTML = '';
        const template = cloneTemplate<HTMLElement>('#contacts');
        this.container.appendChild(template);
         this.formElement = this.container.querySelector('form[name="contacts"]')!;
        this.emailInput = this.formElement.querySelector<HTMLInputElement>('input[name="email"]')!;
        this.phoneInput = this.formElement.querySelector<HTMLInputElement>('input[name="phone"]')!;
        this.submitButton = this.formElement.querySelector<HTMLButtonElement>('button[type="submit"]')!;
        this.errorsElement = this.formElement.querySelector<HTMLElement>('.form__errors')!;
        this.setupEventListeners();
        console.log(this.container);
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