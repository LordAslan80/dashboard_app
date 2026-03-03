import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import OrdersView from '@/views/reporting/screens/OrdersView.vue'
import ProductsView from '@/views/reporting/screens/ProductsView.vue'
import SuppliersView from '@/views/reporting/screens/SuppliersView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CustomersView from '@/views/relations/screens/CustomersView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,

    children: [
      {
        path: '/orders',
        name: 'orders',
        component: OrdersView
      },
      {
        path: '/products',
        name: 'products',
        component: ProductsView
      },
      {
        path: '/suppliers',
        name: 'suppliers',
        component: SuppliersView
      },
      {
        path: '/customers',
        name: 'customers',
        component: CustomersView,
        meta: { screen: 'customers' }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
