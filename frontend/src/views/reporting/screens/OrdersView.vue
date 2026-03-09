<template>
    <header>
        <span class="title">Reporting / Orders</span>
        <button class="button is-primary is-on-header">New order</button>
    </header>

    <div>
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
                        <span>
                            <Edit_Icon class="table_icon"/>
                        </span>
                        <span>
                            <Trash_Icon class="table_icon__left"/>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script lang="ts">
import { loadOrders } from '@/api/reporting';
import { defineComponent, onMounted, ref } from 'vue';
import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';

export default defineComponent ({
    components: {
        Edit_Icon,
        Trash_Icon
    },

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