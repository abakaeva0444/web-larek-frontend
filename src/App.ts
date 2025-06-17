// src/App.ts
import { EventEmitter } from './components/base/events';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';
import { ProductCard } from './components/ProductCard';
import { CartItem, Product, ProductFormatted } from './types';
import { ProductModalView } from './components/ProductModalView';

export class App {
	private eventEmitter: EventEmitter;
	private productModel: ProductModel;
	private cartModel: CartModel;
	private orderModel: OrderModel;
	private productModal: ProductModalView;
	private cardTemplate: HTMLTemplateElement;

	constructor() {
		this.eventEmitter = new EventEmitter();
		this.productModel = new ProductModel(this.eventEmitter);
		this.cartModel = new CartModel(this.eventEmitter);
		this.orderModel = new OrderModel(this.eventEmitter);
		this.cardTemplate = document.querySelector(
			'#card-template'
		) as HTMLTemplateElement;

		this.setupEventListeners();
		this.initialize();
	}

	private setupEventListeners(): void {
		this.eventEmitter.on('products:loaded', this.renderProducts.bind(this));
		this.eventEmitter.on('product:select', this.showProductModal.bind(this));
		this.eventEmitter.on('cart:add', this.addToCart.bind(this));
		this.eventEmitter.on('cart:remove', this.removeFromCart.bind(this));
		this.eventEmitter.on('cart:updated', this.updateCart.bind(this));
	}

	private async initialize(): Promise<void> {
		try {
			const products = await this.productModel.fetchProducts();
			this.renderProducts(products);
		} catch (error) {
			console.error('Ошибка загрузки товаров:', error);
		}
	}

	private renderProducts(products: ProductFormatted[]): void {
		const productsContainer = document.querySelector('.products');
		if (productsContainer) {
			productsContainer.innerHTML = '';
			products.forEach((product) => {
				const cardElement = this.cardTemplate.content.cloneNode(
					true
				) as HTMLElement;
				const card = new ProductCard(cardElement, this.eventEmitter);
				productsContainer.appendChild(card.render(product));
			});
		}
	}

	private showProductModal(productId: string): void {
		const product = this.productModel.getProductById(productId);
		if (product) {
			const inCart = this.cartModel
				.getItems()
				.some((item) => item.product.id === productId);
			this.productModal.open(product, inCart);
		}
	}

	private addToCart(productId: string): void {
		const product = this.productModel.getProductById(productId);
		if (product) {
			this.cartModel.addItem(product);
		}
	}

	private removeFromCart(productId: string): void {
		this.cartModel.removeItem(productId);
	}

	private updateCart(items: CartItem[]): void {
		console.log('Cart updated:', items);
	}
}
