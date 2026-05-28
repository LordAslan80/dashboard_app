import { reactive } from "vue"
import { ILocalStorage } from "@/models/ILocalStorage"

const store = reactive<ILocalStorage>({
    logged: null
})

export const save = (key: string, update: object) => {
    new Promise((resolve: Function): void => {
        localStorage.setItem(key, JSON.stringify({[key]: update}))
        set(key, update)
        resolve()
    })
}

export const remove = (key: any) => {
    new Promise((resolve: Function): void => {
        localStorage.removeItem(key)
        unset(key)
        resolve()
    })
}

export const set = (key: string, update: any) => {
    // @ts-ignore
    store[key] = {...store[key], ...update}
}

export const unset = (key: string) => {
    // @ts-ignore
    store[key] = null
}