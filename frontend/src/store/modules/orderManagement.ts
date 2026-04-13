import { loadOrders } from "@/api/reporting/orders";
import { GlobalState } from "../types";
import { Commit } from "vuex";


export default {
    namespaced: true,

    mutations: {
        SET_ORDERS(state: GlobalState, context: any) {
            state.orders = context
        }
    },
    actions: {
        async setOrders({commit}: {commit: Commit}) {
            let data = await loadOrders()
            commit("SET_ORDERS", data)
            return data
        }
    },
    getters: {
        getOrders(state: GlobalState) {
            return state.orders
        }
    }
}