import { EventEmitter } from '../components/base/events';
import { View } from '../components/base/view';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { OrderModel } from '../models/OrderModel';

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

	constructor(
		container: HTMLElement,
		protected orderModel: OrderModel,
		protected events: EventEmitter
	) {
		super(container, events);
		this._data = {
			payment: '',
			address: '',
		};
	}

	private initializeForm() {
		this.formElement = this.container.querySelector('form[name="order"]');

		if (!this.formElement) {
			console.error('Order form not found');
			return;
		}

		this.paymentButtons = Array.from(
			this.formElement.querySelectorAll('.button_alt')
		) as HTMLButtonElement[];
		this.addressInput = this.formElement.querySelector<HTMLInputElement>(
			'input[name="address"]'
		);
		this.nextButton = this.formElement.querySelector<HTMLButtonElement>(
			'.modal__actions .button'
		);
		this.errorsElement =
			this.formElement.querySelector<HTMLElement>('.form__errors')!;

		if (!this.paymentButtons.length || !this.addressInput || !this.nextButton) {
			console.error('Some form elements not found');
			return;
		}

		// Добавляем обработчики только если элементы найдены
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => this.handlePaymentSelect(button));
		});

		this.addressInput.addEventListener('input', () =>
			this.handleAddressInput()
		);

		this.nextButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.submitForm();
		});
	}

	private handlePaymentSelect(button: HTMLButtonElement) {
		this.paymentButtons.forEach((btn) =>
			btn.classList.remove('button_alt-active')
		);
		button.classList.add('button_alt-active');
		this._data = {
			...this._data,
			payment: button.name,
		};

		this.updateNextButtonState();
	}

	private handleAddressInput() {
		this._data = {
			...this._data,
			address: this.addressInput!.value,
		};

		this.updateNextButtonState();
	}

	private submitForm() {
		if (this._data?.payment && this._data?.address) {
			this.orderModel.setPaymentMethod(this._data.payment);
			this.orderModel.setAddress(this._data.address);
			this.events.emit('order:deliverySubmit', {
				payment: this._data.payment,
				address: this._data.address,
			});
		} else {
			const errors: { [key: string]: string } = {};
			if (!this._data?.payment) {
				errors.payment = 'Выберите способ оплаты.';
			}
			if (!this._data?.address) {
				errors.address = 'Укажите адрес доставки.';
			}
			this.showErrors(errors);
		}
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
		this.container.innerHTML = ''; // Очищаем контейнер
		const template = cloneTemplate<HTMLElement>('#order');
		this.container.appendChild(template);
		this.initializeForm();
		this.setupCloseButton();
		// Находим родительский элемент с классом "modal"
		const modalElement = this.container.closest('.modal') as HTMLElement;

		if (modalElement) {
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

	private updateNextButtonState() {
		if (this._data?.payment && this._data?.address) {
			this.setDisabled(this.nextButton!, false); // Снимаем disabled
		}
	}
}
