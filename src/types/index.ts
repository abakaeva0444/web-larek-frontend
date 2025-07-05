export interface IProduct {
    id: string;
    title: string;
    description: string;
    price: number; // Изменено: price: number
    category: string;
    image: string;
}

export interface ICartItem {
    product: IProduct;
    quantity: number;
}

export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: ICartItem[]; // Изменено: items: ICartItem[];
    total: number;
}

export type ApiListResponse<T> = {
    total: number;
    items: T[];
};