import axios from "axios";
import { ILoginCredentials } from "@/models/ILoginCredentials";
import api from "../api";
import { AxiosResponse, AxiosError } from "axios";
import { IUser } from "@/models/IUser";

const BASE_URL = "users/"
const URLS = {
    user_reset_password: `${BASE_URL}user-reset-password`,
    user_deactivate: `${BASE_URL}deactivate`,
    user_update_profile: `${BASE_URL}update`
}

export const authenticate = (creds: ILoginCredentials) => {
    axios.defaults.headers.common["Content-Type"] = "application/json"
    const baseUrl = process.env.VUE_APP_BASE_URL

    return axios
        .post(`${baseUrl}/api/token/`, {
            username: creds.username,
            password: creds.password
        }, {})
        .then((response) => {
            return response.status === 200
            ? Promise.resolve(response)
            : Promise.reject()
        })
        .catch((error) => {
            if (error.message === "Network Error") return error.message
            return error.response
        })
}

export const resetOwnPassword = (params: any) => {
    return api
        .post(URLS.user_reset_password, {
            new_passwd: params.new_passwd,
            confirm_passwd: params.confirm_passwd
        })
        .then((response: AxiosResponse) => {
            return response.status === 200
            ? Promise.resolve(response)
            : Promise.reject()
        })
        .catch((error: AxiosError) => {
            if (error.response?.status === 403) return error.response
        })
}

export const updateOwnProfile = (params: Partial<IUser>) => {
    return new Promise((resolve, reject) => {
        api
            .post(URLS.user_update_profile, {
                username: params.username,
                email: params.email,
                first_name: params.first_name,
                last_name: params.last_name
            })
            .then((response: AxiosResponse) => {
                if (response.status === 200) resolve(response)
            })
            .catch((error: AxiosError) => {
                reject(error)
            })
    })
}

export const deactivate = (username: string) => {
    return api
        .post(URLS.user_deactivate, {username})
        .catch((error) => {
            console.log("caught error in deactivateOwnProfile: ", error)
        })
}