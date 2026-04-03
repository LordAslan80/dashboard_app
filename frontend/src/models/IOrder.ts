import { ICustomer } from "./ICustomer"
import { IProduct } from "./IProduct"

export interface IOrder {
    orderDate: Date
    requiredDate: Date
    shippedName: string
    shippedCity: string
    shippedAddress: string
    shippedPostalCode: string
    shippedCountry: string
    customer: ICustomer
    product: IProduct
}