import { Commit } from "vuex";
import { getUsers } from "@/api/admin/admin";
import { IUser } from "@/models/IUser";
import { GlobalState } from "../types";

export default {
    namespaced: true,
    state: {
        users: []
    },
    mutations: {
        SET_USERS(state: GlobalState, context: IUser[]) {
            state.users = context
        }
    },
    actions: {
        setUsers({commit}: {commit: Commit}) {
            getUsers()
                .then((data) => {
                    commit("SET_USERS", data)
                })
                .catch(() => {
                    return false
                })
        }
    },
    getters: {
        getUsers(state: GlobalState){
            return state.users
        }
    }
}