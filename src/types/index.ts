// Типы товаров
export interface Product {
	id: string;
	title: string;
	description: string;
	price: number | null;
	image: string;
	category: string;
}

export interface ProductFormatted {
	name?: string;
	id: string;
	title: string;
	description: string;
	price: number | null;
	image: string;
	imageUrl: string;
	priceFormatted: string;
	category: string;
}

// Типы корзины
export interface CartItem {
	product: ProductFormatted;
	quantity: number;
}

// Типы заказа
export type PaymentMethod = 'online' | 'offline' | '';

export interface Order {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

// Типы API
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
