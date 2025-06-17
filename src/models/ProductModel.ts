// src/models/ProductModel.ts

import { Api, ApiListResponse } from '../components/base/api';
import { EventEmitter } from '../components/base/events';
import { API_URL, CDN_URL } from '../utils/constants';
import { Product, ProductFormatted } from '../types';

export class ProductModel {
	private api: Api;
	private eventEmitter: EventEmitter;
	private products: Product[] = [];

	constructor(eventEmitter: EventEmitter) {
		this.api = new Api(API_URL);
		this.eventEmitter = eventEmitter;
	}

	async fetchProducts(): Promise<ProductFormatted[]> {
		try {
			const response = (await this.api.get(
				'/product'
			)) as ApiListResponse<Product>;
			this.products = response.items;
			const formattedProducts = this.formatProducts(this.products);
			this.eventEmitter.emit('products:changed', {
				products: formattedProducts,
			});
			return formattedProducts;
		} catch (error) {
			this.eventEmitter.emit('products:error', { error });
			throw error;
		}
	}

	private formatProducts(products: Product[]): ProductFormatted[] {
		return products.map((product) => ({
			id: product.id,
			title: product.title, // Исправлено на title вместо name
			description: product.description,
			price: product.price,
			image: product.image,
			imageUrl: `${CDN_URL}/${product.image}`,
			priceFormatted: product.price ? `${product.price} ₽` : 'Бесценно',
			category: product.category,
		}));
	}

	getProductById(id: string): ProductFormatted | undefined {
		const product = this.products.find((p) => p.id === id);
		if (!product) return undefined;

		return {
			id: product.id,
			title: product.title, // Исправлено на title вместо name
			description: product.description,
			price: product.price,
			image: product.image,
			imageUrl: `${CDN_URL}/${product.image}`,
			priceFormatted: product.price ? `${product.price} ₽` : 'Бесценно',
			category: product.category,
		};
	}

	getProducts(): ProductFormatted[] {
		return this.formatProducts(this.products);
	}
}
