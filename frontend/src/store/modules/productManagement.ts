import { loadProducts } from "@/api/reporting/products";
import { GlobalState } from "../types";
import { Commit } from "vuex";
import { IProduct } from "@/models/IProduct";


export default {
    namespaced: true,

    mutations: {
        SET_PRODUCTS(state: GlobalState, context: any) {
            state.products = context
        },
        SET_PRODUCT_DETAILS(state: GlobalState, context: IProduct) {
            state.productDetails = context
        }
    },
    actions: {
        async setProducts({commit}: {commit: Commit}) {
            let data = await loadProducts()
            commit("SET_PRODUCTS", data)
            return data
        },
        async setProductDetails({commit}: {commit: Commit}, payload: IProduct) {
            commit("SET_PRODUCT_DETAILS", payload)
        }
    },
    getters: {
        getProducts(state: GlobalState) {
            return state.products
        },
        getProductDetails(state: GlobalState) {
            return state.productDetails
        }
    }
}