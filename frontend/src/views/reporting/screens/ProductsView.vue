<template>
    <header>
        <span class="title">Reporting / Products</span>
        <button class="button is-primary is-on-header" @click="openCreateModal">
            <Plus_Icon class="nav_icon"/>
            New Product
        </button>
    </header>

    <create-product-modal v-if="isCreateModalVisible" @close-modal="closeModal"/>

    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Product name</th>
                    <th>Category</th>
                    <th>Unit price</th>
                    <th>Units in stock</th>
                    <th>Units on order</th>
                    <th>Supplier</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in products" :key="index">
                    <td>{{ item.id }}</td>
                    <td>{{ item.product_name }}</td>
                    <td>{{ item.category.name }}</td>
                    <td>{{ item.unit_price }}</td>
                    <td>{{ item.units_in_stock }}</td>
                    <td>{{ item.units_on_order }}</td>
                    <td>{{ item.supplier.company_name }}</td>
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
import { loadProducts } from '@/api/reporting/products';
import { defineComponent, onMounted, ref } from 'vue';
import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';
import CreateProductModal from '../modals/CreateProductModal.vue';

export default defineComponent ({
    components: {
        Edit_Icon,
        Trash_Icon,
        Plus_Icon,
        CreateProductModal
    },

    setup() {
        const products = ref()
        const isCreateModalVisible = ref(false)

        const openCreateModal = () => {
            isCreateModalVisible.value = true
        }

        const closeModal = () => {
            isCreateModalVisible.value = false
        }

        const getProducts = async () => {
            products.value = await loadProducts()
        }

        onMounted(() => {
            getProducts()
        })

        return {
            products,
            isCreateModalVisible,
            openCreateModal,
            closeModal
        }
    }
})
</script>


<style lang="">
    
</style>