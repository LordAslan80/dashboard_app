import axios from "axios";
import { ILoginCredentials } from "@/models/ILoginCredentials";
import api from "../api";
import { AxiosResponse, AxiosError } from "axios";

const BASE_URL = "users/"
const URLS = {
    user_reset_password: `${BASE_URL}user-reset-password`,
    user_deactivate: `${BASE_URL}deactivate`
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

export const deactivate = (username: string) => {
    return api
        .post(URLS.user_deactivate, {username})
        .catch((error) => {
            console.log("caught error in deactivateOwnProfile: ", error)
        })
}