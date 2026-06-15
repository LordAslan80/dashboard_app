import { AxiosResponse, AxiosError } from "axios";
import api from "../api";
import { IUser } from "@/models/IUser";

const URLS = {
    users: "users/",
    add_user: "users/new",
    unblock_user: "users/admin-reset-login-attempts"
}

export const getUsers = () => {
    return new Promise((resolve, reject) => {
        api
            .get(URLS.users, {})
            .then((response: AxiosResponse) => {
                response.status === 200 ? resolve(response.data) : reject()
            })
            .catch((error: AxiosError) => {
                console.error("Error in Get Users: ", error)
            })
    })
}

export const addUser = (body: Partial<IUser>) => {
    return api
        .post(URLS.add_user, {
            username: body.username,
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            is_staff: body.is_staff,
            passwd: body.passwd
        })
        .catch((error) => {
            console.error("Error in New User: ", error)
        })
}

export const deleteUser = (id: string) => {
    return api
        .delete(`${URLS.users}${id}/`)
        .catch((error) => {
            console.error("Error in Delete User: ", error)
        })
}

export const unblockUser = (username: string) => {
    return api
        .post(URLS.unblock_user, {
            blocked_user: username
        })
        .catch((error) => {
            console.error("Error in Unblock User: ", error)
        })
}