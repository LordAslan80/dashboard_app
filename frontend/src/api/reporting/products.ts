import { IProduct } from "@/models/IProduct";
import api from "../api";
import { AxiosResponse, AxiosError } from "axios";


const URLS = {
    products: "products/"
}

export const loadProducts = (
    supplier__company_name: string,
    unit_price: string,
    search: string,
    order_by: string
) => {
    return new Promise((resolve, reject) => {
        api.get(URLS.products, {params: {supplier__company_name, unit_price, search, order_by}})
        .then((response: AxiosResponse) => {
            if(response.status === 200) {
                resolve(response.data.results)
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
                    return resolve(response.data)
                } else {
                    reject()
                }
            })
            .catch((error: AxiosError) => {
                console.log("caught error in add new product record ===> ", error);
            })
    })
}

export const editRecordInProducts = (id: string, editedProduct: IProduct) => {
    return new Promise((resolve, reject) => {
        api
            .patch(`${URLS.products}${id}/`, {
                supplier: editedProduct.supplier!.id,
                category: editedProduct.category!.id,
                product_name: editedProduct.productName,
                unit_price: editedProduct.unitPrice,
                units_on_order: editedProduct.unitsOnOrder,
                units_in_stock: editedProduct.unitsInStock
            })
            .then((response: AxiosResponse) => {
                if(response.status === 200) {
                    resolve(response.data)
                } else {
                    reject()
                }
            })
            .catch((error: AxiosError) => {
                console.log("caught error in edit record in products ===> ", error)
            })
    })
}

export const deleteRecordInProducts = (id: string) => {
    return new Promise((resolve, reject) => {
        api
            .delete(`${URLS.products}${id}/`)
            .then((response: AxiosResponse) => {
                if(response.status === 204) {
                    resolve(response.data)
                } else {
                    reject()
                }
            })
            .catch((error: AxiosError) => {
                console.log("caught error in delete record in products ===> ", error)
            })
    })
}

export const getProductDetails = (productId: string) => {
    return new Promise((resolve, reject) => {
        api
            .get(`${URLS.products}${productId}/`, {})
            .then((response: AxiosResponse) => {
                response.status === 200 ? resolve(response.data) : reject()
            })
            .catch((error: AxiosError) => {
                console.log("caught error in product details ===> ", error)
            })
    })
}