import { IOrder } from "@/models/IOrder";
import api from "../api";
import { AxiosResponse, AxiosError } from "axios";


const URLS = {
    orders: "orders/"
}

export const loadOrders = () => {
    return new Promise((resolve, reject) => {
        api.get(URLS.orders)
        .then((response: AxiosResponse) => {
            if(response.status === 200) {
                resolve(response.data)
            } else {
                reject()
            }
        })
        .catch((error: AxiosError) => {
            console.log('caught error in load orders ===> ', error);
        })
    })
}

export const addNewOrder = (newOrderRecord: Partial<IOrder>) => {
    return new Promise((resolve, reject) => {
        api
        .post(URLS.orders,
        {
            customer: newOrderRecord.customerId,
            product: newOrderRecord.productId,
            order_date: new Date(),
            required_date: newOrderRecord.requiredDate,
            shipped_name: newOrderRecord.shippedName,
            shipped_address: newOrderRecord.shippedAddress,
            shipped_city: newOrderRecord.shippedCity,
            shipped_postal_code: newOrderRecord.shippedPostalCode,
            shipped_country: newOrderRecord.shippedCountry,
        })
        .then((response: AxiosResponse) => {
            if(response.status === 201) {
                resolve(response.data)
            } else {
                reject()
            }
        })
        .catch((error: AxiosError) => {
            console.log('caught error in add new order record ===> ', error);
        })
    })
}