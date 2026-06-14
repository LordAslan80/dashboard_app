import { AxiosResponse, AxiosError } from "axios";
import api from "../api";
import { IUser } from "@/models/IUser";

const URLS = {
    users: "users/",
    add_user: "users/new"
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