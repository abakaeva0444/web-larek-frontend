// Импортируем типы из base/api.ts
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

// Product (Товар)
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    // Другие свойства товара
}

// CartItem (Элемент корзины)
export interface CartItem {
    productId: string;
    quantity: number;
}

// Order (Заказ)
export interface Order {
    cartItems: CartItem[];
    shippingAddress: string;
    paymentMethod: string;
    email: string;
    phone: string;
}

// Events (События)
export type AppEvent = 'addToCart' | 'cartUpdated' | 'submitOrder' | 'orderSuccess' | 'orderError';

export interface AddToCartEvent {
    productId: string;
}

export interface SubmitOrderEvent {
    order: Order;
}

export interface AppEvents {
    addToCart: AddToCartEvent;
    submitOrder: SubmitOrderEvent;
    cartUpdated: void; // Событие cartUpdated не передает данных
    orderSuccess: void; // Событие orderSuccess не передает данных
    orderError: string; // Событие orderError передает сообщение об ошибке
}

// apiClient.ts
export interface GetProductsParams { //параметры для запроса товаров
    limit?: number;
    offset?: number;
}

export interface ApiClient {
    getProducts(params?: GetProductsParams): Promise<ApiListResponse<Product>>;
    // Другие методы API (например, для оформления заказа)
}
