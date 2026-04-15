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

    <confirm-delete-modal v-if="isConfirmDeleteModalVisible" :entity-type="'Product'"
    :entity-id="productIdToDelete" @close-modal="closeModal" @handle-delete="handleDelete"/>

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
                <tr v-for="(item, index) in products" :key="index" @click="openDetails(item)">
                    <td>{{ item.id }}</td>
                    <td>{{ item.product_name }}</td>
                    <td>{{ item.category.name }}</td>
                    <td>{{ item.unit_price }}</td>
                    <td>{{ item.units_in_stock }}</td>
                    <td>{{ item.units_on_order }}</td>
                    <td>{{ item.supplier.company_name }}</td>
                    <td>
                        <span @click.stop @click="openEditModal(item.id)">
                            <Edit_Icon class="table_icon"/>
                        </span>
                        <span @click.stop @click="openDeleteModal(item.id)">
                            <Trash_Icon class="table_icon__left"/>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script lang="ts">
import { deleteRecordInProducts, editRecordInProducts, loadProducts } from '@/api/reporting/products';
import { computed, defineComponent, onMounted, ref, toRaw } from 'vue';
import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';
import CreateProductModal from '../modals/CreateProductModal.vue';
import EditProductModal from '../modals/EditProductModal.vue';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal.vue';
import { useStore } from 'vuex';
import { IProduct } from '@/models/IProduct';
import router from '@/router';

export default defineComponent ({
    components: {
        Edit_Icon,
        Trash_Icon,
        Plus_Icon,
        CreateProductModal,
        EditProductModal,
        ConfirmDeleteModal
    },

    setup() {
        const store = useStore()

        const products = computed(() => {
            let data = store.getters["productManagement/getProducts"]
            if(!data) return
            return data
        })

        const isCreateModalVisible = ref(false)
        const isEditModalVisible = ref(false)
        const isConfirmDeleteModalVisible = ref(false)

        const productIdToUpdate = ref('')
        const productToUpdate = ref()
        const productIdToDelete = ref()

        const setDataForDetailsPage = (item: IProduct) => {
            return store.dispatch("productManagement/setProductDetails", {
                ...item
            })
        }

        const openCreateModal = () => {
            isCreateModalVisible.value = true
        }

        const openEditModal = (id: string) => {
            productIdToUpdate.value = id
            productToUpdate.value = toRaw(products.value).find((x: any) => x.id === id)
            isEditModalVisible.value = true
        }

        const openDeleteModal = (id: string) => {
            productIdToDelete.value = id
            isConfirmDeleteModalVisible.value = true
        }

        const openDetails = (item: IProduct) => {
            let id = item.id
            setDataForDetailsPage(item)
            router.push({
                name: "product-details",
                params: {
                    id
                }
            })
        }

        const closeModal = () => {
            isCreateModalVisible.value = false
            isEditModalVisible.value = false
            isConfirmDeleteModalVisible.value = false
        }

        const updateList = async () => {
            return Promise.allSettled([
                store.dispatch("productManagement/setProducts", {})
            ])
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

        const handleDelete = () => {
            isConfirmDeleteModalVisible.value = false

            deleteRecordInProducts(productIdToDelete.value)
            .then(() => {
                closeModal()
                updateList()
                productIdToDelete.value = ''
            })
        }

        onMounted(() => {
            if(!products.value) updateList()
        })

        return {
            products,
            isCreateModalVisible,
            isEditModalVisible,
            isConfirmDeleteModalVisible,
            productToUpdate,
            productIdToDelete,
            openCreateModal,
            openEditModal,
            openDeleteModal,
            openDetails,
            closeModal,
            updateList,
            handleEdit,
            handleDelete
        }
    }
})
</script>


<style lang="">
    
</style>