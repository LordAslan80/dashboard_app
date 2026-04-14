import { IOrder } from "@/models/IOrder";
import { GlobalState } from "./types";

const state = (): GlobalState => {
    return {
        orders: [],
        orderDetails: {} as IOrder,
        products: []
    }
}

export default state