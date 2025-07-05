// OrderModel.ts
import { Api } from "../components/base/api";
import { IOrder, ICartItem, IProduct } from "../types"; // Импортируем IProduct
import { EventEmitter } from "../components/base/events";
import { ProductModel } from "./ProductModel"; // Импортируем ProductModel

export class OrderModel {
    private _order: Partial<IOrder> = {};
    private productModel: ProductModel; // Добавляем свойство

    constructor(protected api: Api, protected events: EventEmitter, productModel: ProductModel) { // Добавляем ProductModel в конструктор
        this.productModel = productModel; // Инициализируем productModel
    }

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

    async submitOrder(productIds: string[], total: number): Promise<{ id: string }> {
                const cartItems: ICartItem[] = productIds.map(productId => {
                    const product = this.productModel.getProduct(productId); // Получаем продукт по id
                    if (!product) { //  <---  Проблема здесь
                        // Обработка ошибки, если продукт не найден
                        console.error(`Product with id ${productId} not found`);
                        return { product: { id: productId } as IProduct, quantity: 1 }; // Или выбросить ошибку
                    }
                    return { product, quantity: 1 }; // Возвращаем ICartItem
                });

        this._order.items = cartItems;
        this._order.total = total;
        return await this.api.post('/order', this._order as IOrder) as { id: string };
    }
}