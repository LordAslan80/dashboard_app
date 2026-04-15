import { loadOrders } from "@/api/reporting/orders";
import { GlobalState } from "../types";
import { Commit } from "vuex";
import { IOrder } from "@/models/IOrder";


export default {
    namespaced: true,

    mutations: {
        SET_ORDERS(state: GlobalState, context: any) {
            state.orders = context
        },
        SET_ORDER_DETAILS(state: GlobalState, context: IOrder) {
            state.orderDetails = context
        },
        DELETE_ORDER(state: GlobalState, context: string) {
            state.orders = state.orders.filter(x => x.id !== context)
        }
    },
    actions: {
        async setOrders({commit}: {commit: Commit}) {
            let data = await loadOrders()
            commit("SET_ORDERS", data)
            return data
        },
        async setOrderDetails({commit}: {commit: Commit}, payload: IOrder) {
            commit("SET_ORDER_DETAILS", payload)
        },
        async deleteOrder({commit}: {commit: Commit}, payload: string) {
            commit("DELETE_ORDER", payload)
        }
    },
    getters: {
        getOrders(state: GlobalState) {
            return state.orders
        },
        getOrderDetails(state: GlobalState) {
            return state.orderDetails
        }
    }
}