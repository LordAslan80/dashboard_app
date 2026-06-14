import { Commit } from "vuex";
import { addUser, getUsers } from "@/api/admin/admin";
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
        },
        ADD_USER(state: GlobalState, user: IUser) {
            user.is_blocked = false
            user.is_active = true
            user.passwd = ""
            state.users.push(user)
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
        },
        addUser({commit}: any, user: Partial<IUser>) {
            return addUser(user)
            .then(() => {
                commit("ADD_USER", user)
                return true
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