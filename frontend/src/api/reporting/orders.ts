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