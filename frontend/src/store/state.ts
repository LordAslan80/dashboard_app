import { GlobalState } from "./types";

const state = (): GlobalState => {
    return {
        orders: [],
        products: []
    }
}

export default state