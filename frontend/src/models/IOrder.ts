import { ICustomer } from "./ICustomer"
import { IProduct } from "./IProduct"

export interface IOrder {
    id: string
    orderDate: Date
    requiredDate: string
    shippedName: string
    shippedCity: string
    shippedAddress: string
    shippedPostalCode: string
    shippedCountry: string
    customer: ICustomer
    product: IProduct

    customerId: string
    productId: string
}