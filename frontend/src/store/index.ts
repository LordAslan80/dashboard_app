import { createStore } from 'vuex'
import state from './state'
import { GlobalState } from './types'
import orderManagement from './modules/orderManagement'

const store = createStore<GlobalState>({
  state,
  modules: {
    orderManagement: orderManagement
  }
})

export default store