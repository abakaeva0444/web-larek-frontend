import { Api } from '../components/base/api';
import { EventEmitter } from '../components/base/events';
import { IProduct, ApiListResponse } from '../types';

export class ProductModel {
	constructor(protected api: Api, protected events: EventEmitter) {}

	async getProducts(): Promise<IProduct[]> {
		try {
			const response = await this.api.get('/product');
			return (response as ApiListResponse<IProduct>).items;
		} catch (error) {
			console.error('Error fetching products:', error);
			this.events.emit('product:fetchError', { error });
			return [];
		}
	}

	// Реализация метода getProduct
	async getProduct(id: string): Promise<IProduct | undefined> {
		try {
			const response = await this.api.get(`/product/${id}`);
			return response as IProduct;
		} catch (error) {
			console.error(`Error fetching product with id ${id}:`, error);
			this.events.emit('product:fetchError', { error });
			return undefined;
		}
	}
}
