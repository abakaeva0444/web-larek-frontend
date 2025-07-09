import { EventEmitter } from '../components/base/events';
import { View } from '../components/base/view';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { OrderModel } from '../models/OrderModel';

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

	constructor(
		container: HTMLElement,
		protected orderModel: OrderModel,
		protected events: EventEmitter
	) {
		super(container, events);
	}

	private setupEventListeners() {
		this.emailInput.addEventListener('input', () => this.validateForm());
		this.phoneInput.addEventListener('input', () => this.validateForm());

		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.submitForm();
		});
	}

	private submitForm() {
		const emailValue = this.emailInput.value;
		const phoneValue = this.phoneInput.value;

		let isValid = true;
		const errors: { [key: string]: string } = {};

		if (!emailValue) {
			errors.email = 'Не указан email.';
			isValid = false;
		} else if (!this.isValidEmail(emailValue)) {
			errors.email = 'Неверный формат email.';
			isValid = false;
		}

		if (!phoneValue) {
			errors.phone = 'Не указан телефон.';
			isValid = false;
		} else if (!this.isValidPhone(phoneValue)) {
			errors.phone = 'Неверный формат телефона.';
			isValid = false;
		}

		if (emailValue && phoneValue && isValid) {
			this.orderModel.setContacts(emailValue, phoneValue);
			this.events.emit('order:paymentSubmit', {
				email: emailValue,
				phone: phoneValue,
			});
		} else {
			this.showErrors(errors);
		}
	}

	private isValidEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	private isValidPhone(phone: string): boolean {
		return /^\+?\d{10,12}$/.test(phone);
	}

	public showErrors(errors: { [key: string]: string }): void {
		this.errorsElement.textContent = '';
		let message = '';
		for (const key in errors) {
			message += errors[key] + ' ';
		}
		this.errorsElement.textContent = message;
	}

	render(): HTMLElement {
		this.container.innerHTML = '';
		const template = cloneTemplate<HTMLElement>('#contacts');
		this.container.appendChild(template);
		this.formElement = this.container.querySelector('form[name="contacts"]')!;
		this.emailInput = this.formElement.querySelector<HTMLInputElement>(
			'input[name="email"]'
		)!;
		this.phoneInput = this.formElement.querySelector<HTMLInputElement>(
			'input[name="phone"]'
		)!;
		this.submitButton = this.formElement.querySelector<HTMLButtonElement>(
			'button[type="submit"]'
		)!;
		this.errorsElement =
			this.formElement.querySelector<HTMLElement>('.form__errors')!;
		this.setupEventListeners();

		this.setupCloseButton();
		// Находим родительский элемент с классом "modal"
		const modalElement = this.container.closest('.modal') as HTMLElement;

		if (modalElement) {
			modalElement.style.display = 'block';
		} else {
			console.error('Modal element not found!');
		}

		this.setDisabled(this.submitButton, true);
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

	private validateForm(): void {
		const emailValue = this.emailInput.value;
		const phoneValue = this.phoneInput.value;

		let isValid = true;
		const errors: { [key: string]: string } = {};

		if (!emailValue) {
			errors.email = 'Не указан email.';
			isValid = false;
		} else if (!this.isValidEmail(emailValue)) {
			errors.email = 'Неверный формат email.';
			isValid = false;
		}

		if (!phoneValue) {
			errors.phone = 'Не указан телефон.';
			isValid = false;
		} else if (!this.isValidPhone(phoneValue)) {
			errors.phone = 'Неверный формат телефона.';
			isValid = false;
		}

		if (emailValue && phoneValue && isValid) {
			this.setDisabled(this.submitButton, false);
		} else {
			this.setDisabled(this.submitButton, true);
			this.showErrors(errors); // Отображаем ошибки
		}
	}
}
