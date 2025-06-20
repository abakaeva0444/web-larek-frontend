// src/views/orderView.ts (Форма заказа)

import { View } from '../components/base/view';
import { cloneTemplate, ensureAllElements, ensureElement } from '../utils/utils';
import { Order, PaymentMethod } from '../types';
import { EventEmitter } from '../components/base/events';

export class OrderView extends View<Order> {
 protected form: HTMLFormElement;
 protected paymentButtons: HTMLButtonElement[];
 protected addressInput: HTMLInputElement;
 protected nextButton: HTMLButtonElement;
 protected errors: HTMLElement;
    currentStep: number;


    constructor(container: HTMLElement, events: EventEmitter) {
        // 1. Находим и клонируем шаблон
        const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
        if (!orderTemplate) throw new Error('Order template (#order) not found');
        
        const orderElement = cloneTemplate<HTMLDivElement>(orderTemplate);
        container.appendChild(orderElement);

        // 2. Вызываем super() перед использованием this
        super(orderElement, events);

        // 3. Инициализируем элементы (только те, что есть в шаблоне)
        this.form = ensureElement<HTMLFormElement>('.form', this.container);
        this.paymentButtons = Array.from(
            this.form.querySelectorAll<HTMLButtonElement>('.button_alt')
        );
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);
        this.nextButton = ensureElement<HTMLButtonElement>('.order__button', this.form);
        this.errors = ensureElement<HTMLElement>('.form__errors', this.form);

        this.setupEventListeners();
    }

 private setupEventListeners() {
 this.paymentButtons.forEach(button => {
 button.addEventListener('click', () => {
 this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
 button.classList.add('button_alt-active');
 this.events.emit('order.payment:change', { payment: button.name as PaymentMethod });
 });
 });

 this.nextButton.addEventListener('click', () => {
 if (this.validateStep1()) {
 this.currentStep = 2;
 this.updateForm();
 }
 });

 this.addressInput.addEventListener('input', () => this.validateStep1());
 }

 render(data: Partial<Order>): HTMLElement {
 if (data.payment) {
 const button = this.paymentButtons.find(b => b.name === data.payment);
 if (button) button.classList.add('button_alt-active');
 }
 if (data.address) this.addressInput.value = data.address;

 this.updateForm();
 return this.container;
 }

 private updateForm() {
 this.nextButton.classList.toggle('disabled', !this.validateStep1());
 }

 validateStep1(): boolean {
 const errors: string[] = [];
 if (!this.addressInput.value.trim()) {
 errors.push('Укажите адрес доставки');
 }
 if (!this.paymentButtons.some(btn => btn.classList.contains('button_alt-active'))) {
 errors.push('Выберите способ оплаты');
 }

 this.showErrors(errors);
 return errors.length === 0;
 }

 private showErrors(errors: string[]) {
 this.errors.innerHTML = errors.map(error => 
 `<p class="form__error">${error}</p>`
 ).join('');
 }

 get values(): Order {
 return {
 payment: this.paymentButtons.find(b => 
 b.classList.contains('button_alt-active')
 )?.name as PaymentMethod || 'online',
 address: this.addressInput.value,
 email: '', // В HTML нет поля email
 phone: '', // В HTML нет поля phone
 items: [],
 total: 0
 };
 }
}
