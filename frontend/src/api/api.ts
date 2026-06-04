import axios, {Axios} from "axios";
import { authorize } from "@/localStorage";
import { ILoginData } from "@/models/ILoginData";


axios.defaults.headers.common["Content-Type"] = "application/json"

const axiosInstance = axios.create()

const baseUrl = process.env.VUE_APP_BASE_URL

const api = (axios: Axios) => {
    authorize("logged", (loginData: ILoginData) => {
        if (loginData) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${loginData.accessToken}`
            axios.defaults.baseURL = `${baseUrl}/api`
        }
    })

    return {
        get: <T>(url: string, config: any) => axios.get<T>(url, {...config}),
        post: <T>(url: string, body: object) => axios.post<T>(url, body),
        put: <T>(url: string, body: object) => axios.put<T>(url, body),
        patch: <T>(url: string, body: object) => axios.patch<T>(url, body),
        delete: <T>(url: string) => axios.delete<T>(url)
    }
}

export default api(axiosInstance)