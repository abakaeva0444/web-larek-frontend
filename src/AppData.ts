import { EventEmitter } from './components/base/events';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';
import { ProductFormatted, CartItem, Order } from './types';

export class AppData {
    public products: ProductFormatted[] = [];
    public cart: CartItem[] = [];
    public order: Partial<Order> = {};

    constructor(
        public events: EventEmitter,
        public productModel: ProductModel,
        public cartModel: CartModel,
        public orderModel: OrderModel
    ) {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.events.on('products:changed', (data: { products: ProductFormatted[] }) => {
            this.products = data.products;
        });

        this.events.on('cart:updated', (data: { items: CartItem[]; total: number }) => {
            this.cart = data.items;
        });
    }

    async loadProducts(): Promise<void> {
        await this.productModel.fetchProducts();
    }

    addToCart(product: ProductFormatted): void {
        this.cartModel.addItem(product);
    }

    removeFromCart(productId: string): void {
        this.cartModel.removeItem(productId);
    }

    clearCart(): void {
        this.cartModel.clearCart();
    }

    async submitOrder(): Promise<void> {
        await this.orderModel.submitOrder(this.cartModel.getItems());
    }
}