import { IOrder } from "@/models/IOrder";
import { IProduct } from "@/models/IProduct";

export interface GlobalState {
    orders: IOrder[],
    orderDetails: IOrder,
    products: IProduct[],
}