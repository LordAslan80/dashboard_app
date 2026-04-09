import { IProduct } from "@/models/IProduct";
import api from "../api";
import { AxiosResponse, AxiosError } from "axios";


const URLS = {
    products: "products/"
}

export const loadProducts = () => {
    return new Promise((resolve, reject) => {
        api.get(URLS.products)
        .then((response: AxiosResponse) => {
            if(response.status === 200) {
                resolve(response.data)
            } else {
                reject()
            }
        })
        .catch((error: AxiosError) => {
            console.log('caught error in load products ===> ', error);
        })
    })
}

export const addNewProduct = (newProductRecord: Partial<IProduct>) => {
    return new Promise((resolve, reject) => {
        api
            .post(URLS.products, {
                product_name: newProductRecord.productName,
                supplier: newProductRecord.supplierId,
                category: newProductRecord.categoryId,
                unit_price: newProductRecord.unitPrice,
                units_in_stock: newProductRecord.unitsInStock,
                units_on_order: newProductRecord.unitsOnOrder
            })
            .then((response: AxiosResponse) => {
                if(response.status === 201) {
                    resolve(response.data)
                } else {
                    reject()
                }
            })
            .catch((error: AxiosError) => {
                console.log("caught error in add new product record ===> ", error);
            })
    })
}