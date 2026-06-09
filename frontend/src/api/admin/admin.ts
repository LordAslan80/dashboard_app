import { AxiosResponse, AxiosError } from "axios";
import api from "../api";

const URLS = {
    users: "users/"
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