<template>
    <header>
        <span class="title">Reporting / Orders</span>
        <button class="button is-primary">New order</button>
    </header>

    <div class="body">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Order date</th>
                    <th>Customer name</th>
                    <th>Product name</th>
                    <th>Required date</th>
                    <th>Shipped name</th>
                    <th>Shipped address</th>
                    <th>Shipped city</th>
                    <th>Shipped postal code</th>
                    <th>Shipped country</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in orders" :key="index">
                    <td>{{ item.id }}</td>
                    <td>{{ item.order_date }}</td>
                    <td>{{ item.customer.first_name }} {{ item.customer.last_name }}</td>
                    <td>{{ item.product.product_name }}</td>
                    <td>{{ item.required_date }}</td>
                    <td>{{ item.shipped_name }}</td>
                    <td>{{ item.shipped_address }}</td>
                    <td>{{ item.shipped_city }}</td>
                    <td>{{ item.shipped_postal_code }}</td>
                    <td>{{ item.shipped_country }}</td>
                    <td>
                        <p>placeholder</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script lang="ts">
import { loadOrders } from '@/api/reporting';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent ({
    setup() {
        const orders = ref()
        const getOrders = async () => {
            orders.value = await loadOrders()
        }

        onMounted(() => {
            getOrders()
        })

        return {
            orders
        }
    }
})
</script>


<style lang="">
    
</style>