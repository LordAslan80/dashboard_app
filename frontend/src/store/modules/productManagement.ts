import { loadProducts } from "@/api/reporting/products";
import { GlobalState } from "../types";
import { Commit } from "vuex";


export default {
    namespaced: true,

    mutations: {
        SET_PRODUCTS(state: GlobalState, context: any) {
            state.products = context
        }
    },
    actions: {
        async setProducts({commit}: {commit: Commit}) {
            let data = await loadProducts()
            commit("SET_PRODUCTS", data)
            return data
        }
    },
    getters: {
        getProducts(state: GlobalState) {
            return state.products
        }
    }
}