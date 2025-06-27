import { Api } from "../components/base/api";
import { EventEmitter } from "../components/base/events";
import { IProduct, ApiListResponse } from "../types";

export class ProductModel {
    constructor(protected api: Api, protected events: EventEmitter) {}

async getProducts(): Promise<IProduct[]> {
    const response = await this.api.get('/product');
    return (response as ApiListResponse<IProduct>).items;
}
}