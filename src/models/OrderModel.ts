import { Api } from "../components/base/api";
import { IOrder } from "../types";
import { EventEmitter } from "../components/base/events";

export class OrderModel {
    private _order: Partial<IOrder> = {};

    constructor(protected api: Api, protected events: EventEmitter) {}

    setPaymentMethod(method: string): void {
        this._order.payment = method;
        this.validateOrder();
    }

    setAddress(address: string): void {
        this._order.address = address;
        this.validateOrder();
    }

    setContacts(email: string, phone: string): void {
        this._order.email = email;
        this._order.phone = phone;
        this.validateOrder();
    }

    private validateOrder(): void {
        const isValid = !!this._order.payment && !!this._order.address && 
                       !!this._order.email && !!this._order.phone;
        this.events.emit('order:ready', { isValid });
    }

    async submitOrder(items: string[], total: number): Promise<{ id: string }> {
        this._order.items = items;
        this._order.total = total;
        return await this.api.post('/order', this._order as IOrder) as { id: string };
    }
}