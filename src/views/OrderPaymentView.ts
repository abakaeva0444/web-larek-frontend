import { EventEmitter } from "../components/base/events";
import { View } from "../components/base/view";
import { ensureElement } from "../utils/utils";

interface IContactsForm {
    email: string;
    phone: string;
}

export class OrderPaymentView extends View<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected formElement: HTMLFormElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        
        try {
            this.formElement = ensureElement<HTMLFormElement>('form[name="contacts"]', container);
            this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.formElement);
            this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.formElement);
            this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.formElement);

            this.setupEventListeners();
        } catch (error) {
            console.error('OrderPaymentView initialization error:', error);
            throw error;
        }
    }

    private setupEventListeners() {
        this.emailInput.addEventListener('input', () => {
            this._data.email = this.emailInput.value;
            this.validateForm();
        });

        this.phoneInput.addEventListener('input', () => {
            this._data.phone = this.phoneInput.value;
            this.validateForm();
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.events.emit('order:paymentSubmit');
            }
        });
    }

    private validateForm(): boolean {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._data.email || '');
        const phoneValid = /^\+?[\d\s\-\(\)]{7,}$/.test(this._data.phone || '');
        const isValid = emailValid && phoneValid;
        this.setDisabled(this.submitButton, !isValid);
        return isValid;
    }

    render(): HTMLElement {
        this.container.classList.add('modal_active');
        return this.container;
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.formElement.reset();
        this._data = { email: '', phone: '' };
    }
}