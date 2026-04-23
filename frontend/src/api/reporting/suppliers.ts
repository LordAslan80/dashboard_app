import { AxiosResponse, AxiosError } from "axios";
import api from "../api";


const URLS = {
    suppliers: "suppliers/"
}

export const loadSuppliers = () => {
    return new Promise((resolve, reject) => {
        api
            .get(URLS.suppliers)
            .then((response: AxiosResponse) => {
                if(response.status === 200){
                    resolve(response.data.results)
                } else {
                    reject()
                }
            })
            .catch((error: AxiosError) => {
                console.log("caught error in load suppliers ===> ", error)
            })
    })
}