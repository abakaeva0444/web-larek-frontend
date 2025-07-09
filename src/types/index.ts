export interface IProduct {
	id: string;
	title: string;
	description: string;
	price: number;
	category: string;
	image: string;
}

export interface ICartItem {
	productId: string;
	quantity: number;
}

export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: ICartItem[];
	total: number;
}

export type ApiListResponse<T> = {
	total: number;
	items: T[];
};
