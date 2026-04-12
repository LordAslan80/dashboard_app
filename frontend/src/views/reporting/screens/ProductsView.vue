<template>
    <header>
        <span class="title">Reporting / Products</span>
        <button class="button is-primary is-on-header" @click="openCreateModal">
            <Plus_Icon class="nav_icon"/>
            New Product
        </button>
    </header>

    <create-product-modal v-if="isCreateModalVisible" @close-modal="closeModal" @update-list="updateList"/>

    <edit-product-modal v-if="isEditModalVisible" :product="productToUpdate" @close-modal="closeModal" @handle-edit="handleEdit"/>

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
                        <span @click="openEditModal(item.id)">
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
import { editRecordInProducts, loadProducts } from '@/api/reporting/products';
import { defineComponent, onMounted, ref, toRaw } from 'vue';
import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';
import CreateProductModal from '../modals/CreateProductModal.vue';
import EditProductModal from '../modals/EditProductModal.vue';

export default defineComponent ({
    components: {
        Edit_Icon,
        Trash_Icon,
        Plus_Icon,
        CreateProductModal,
        EditProductModal
    },

    setup() {
        const products = ref()
        const isCreateModalVisible = ref(false)
        const isEditModalVisible = ref(false)

        const productIdToUpdate = ref('')
        const productToUpdate = ref()

        const openCreateModal = () => {
            isCreateModalVisible.value = true
        }

        const openEditModal = (id: string) => {
            productIdToUpdate.value = id
            productToUpdate.value = toRaw(products.value).find((x: any) => x.id === id)
            isEditModalVisible.value = true
        }

        const closeModal = () => {
            isCreateModalVisible.value = false
            isEditModalVisible.value = false
        }

        const updateList = async () => {
            products.value = await loadProducts()
        }

        const handleEdit = (editedProduct: any) => {
            isEditModalVisible.value = false

            editRecordInProducts(productIdToUpdate.value, editedProduct)
            .then(() => {
                closeModal()
                updateList()
                productIdToUpdate.value = ''
            })
        }

        onMounted(() => {
            updateList()
        })

        return {
            products,
            isCreateModalVisible,
            isEditModalVisible,
            productToUpdate,
            openCreateModal,
            openEditModal,
            closeModal,
            updateList,
            handleEdit
        }
    }
})
</script>


<style lang="">
    
</style>