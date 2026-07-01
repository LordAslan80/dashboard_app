<template>
    <header>
        <span class="title">Reporting / Products</span>
        <button class="button is-primary is-on-header" @click="openCreateModal">
            <Plus_Icon class="nav_icon"/>
            New Product
        </button>
    </header>

    <div class="filters">
        <div class="filter-wrapper">
            <p>Supplier:</p>
            <select v-model="filteredSupplier">
                <option value="" disabled selected>All suppliers</option>
                <option v-for="(supplier, i) in suppliers" :key="i" :value="supplier.company_name">{{ supplier.company_name }}</option>
            </select>
        </div>

        <div class="filter-wrapper">
            <p>Unit price:</p>
            <select v-model="filteredPrice">
                <option value="" disabled selected>All unit prices</option>
                <option v-for="(price, i) in prices" :key="i" :value="price">{{ price }}</option>
            </select>
        </div>
        
        <div class="filter-wrapper">
            <p>Search:</p>
            <input v-model="search" type="text" placeholder="Search (product or category)" @keyup.enter="filterList">
        </div>

        <div class="filter-wrapper">
            <p>Filter:</p>
            <button id="filter" class="filters_button" @click="filterList">Filter</button>
        </div>

        <div class="filter-wrapper">
            <p>Refresh:</p>
            <button id="refresh" class="filters_button" @click="refreshList">Refresh</button>
        </div>
    </div>

    <create-product-modal v-if="isCreateModalVisible" @close-modal="closeModal"/>

    <edit-product-modal v-if="isEditModalVisible" :product="productToUpdate" @close-modal="closeModal" @handle-edit="handleEdit"/>

    <confirm-delete-modal v-if="isConfirmDeleteModalVisible" :entity-type="'Product'"
    :entity-id="productIdToDelete" @close-modal="closeModal" @handle-delete="handleDelete"/>

    <div>
        <table>
            <thead>
                <tr>
                    <th @click="setSortingBy(ORDER_BY_ID)">
                        ID
                        <Sorting_Icon class="sorting-icon"
                        :class="orderBy===ORDER_BY_ID ? 'active-sorting' : ''"/>
                    </th>
                    <th>Product name</th>
                    <th>Category</th>
                    <th @click="setSortingBy(ORDER_BY_UNIT_PRICE)">
                        Unit price
                        <Sorting_Icon class="sorting-icon"
                        :class="orderBy===ORDER_BY_UNIT_PRICE ? 'active-sorting' : ''"/>
                    </th>
                    <th @click="setSortingBy(ORDER_BY_UNITS_IN_STOCK)">
                        Units in stock
                        <Sorting_Icon class="sorting-icon"
                        :class="orderBy===ORDER_BY_UNITS_IN_STOCK ? 'active-sorting' : ''"/>
                    </th>
                    <th @click="setSortingBy(ORDER_BY_UNITS_ON_ORDER)">
                        Units on order
                        <Sorting_Icon class="sorting-icon"
                        :class="orderBy===ORDER_BY_UNITS_ON_ORDER ? 'active-sorting' : ''"/>
                    </th>
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

        <pagination v-if="count > 0" :current-page="currentPage" :per-page="perPage" :count="count"
            :number-of-pages="numberOfPages" @update-page="updatePage" @update-table-size="updateTableSize"/>
    </div>
</template>


<script lang="ts">
import { deleteRecordInProducts, editRecordInProducts } from '@/api/reporting/products';
import { computed, defineComponent, onMounted, ref, toRaw } from 'vue';
import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';
import Sorting_Icon from '@/assets/icons/Sorting_Icon.vue';
import CreateProductModal from '../modals/CreateProductModal.vue';
import EditProductModal from '../modals/EditProductModal.vue';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal.vue';
import { useStore } from 'vuex';
import { IProduct } from '@/models/IProduct';
import router from '@/router';
import { loadSuppliers } from '@/api/common/suppliers';
import { extractValues } from '@/composables/util';
import { loadProductPrices } from '@/api/common/productPrices';
import Pagination from '@/components/common/Pagination.vue';

export default defineComponent ({
    components: {
        Edit_Icon,
        Trash_Icon,
        Plus_Icon,
        Sorting_Icon,
        CreateProductModal,
        EditProductModal,
        ConfirmDeleteModal,
        Pagination
    },

    setup() {
        const ORDER_BY_ID = "id"
        const ORDER_BY_UNIT_PRICE = "unit_price"
        const ORDER_BY_UNITS_IN_STOCK = "units_in_stock"
        const ORDER_BY_UNITS_ON_ORDER = "units_on_order"

        const store = useStore()

        const products = computed(() => {
            let data = store.getters["productManagement/getProducts"]
            if(!data) return
            return data
        })

        const search = ref()

        const filteredSupplier = ref()
        const suppliers = ref()

        const filteredPrice = ref()
        const prices = ref()

        const isCreateModalVisible = ref(false)
        const isEditModalVisible = ref(false)
        const isConfirmDeleteModalVisible = ref(false)

        const productIdToUpdate = ref('')
        const productToUpdate = ref()
        const productIdToDelete = ref()

        const orderBy = ref('id')

        const currentPage = ref(1)
        const perPage = ref(5)

        const numberOfPages = computed(() => {
            let data = store.getters["paginationManagement/getNumberOfPages"]
            return Number(data)
        })

        const count = computed(() => {
            let data = store.getters["paginationManagement/getCount"]
            return Number(data)
        })

        const updatePage = (page: any) => {
            currentPage.value = page
            updateList()
        }

        const updateTableSize = (pageSize: any) => {
            perPage.value = pageSize.value
            currentPage.value = 1
            updateList()
        }

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

        const setSortingBy = (ordering: string) => {
            orderBy.value = ordering
            updateList()
        }

        const filterList = () => {
            currentPage.value = 1
            updateList()
        }

        const refreshList = () => {
            window.location.reload()
            // filteredSupplier.value = ""
            // filteredPrice.value = ""
            // search.value = ""
            // updateList()
        }

        const getSuppliers = async () => {
            suppliers.value = await loadSuppliers()
        }
        
        const getProductPrices = async () => {
            let data: any = await loadProductPrices()
            prices.value = extractValues(data)
        }

        const updateList = async () => {
            let data: any = await Promise.allSettled([
                store.dispatch("productManagement/setProducts", {
                    filteredSupplier: filteredSupplier.value,
                    filteredPrice: filteredPrice.value,
                    search: search.value,
                    per_page: perPage.value,
                    page: currentPage.value,
                    order_by: orderBy.value
                })
            ])

            let paginationInfo = data[0].value
            store.dispatch("paginationManagement/setNumberOfPages", paginationInfo.number_of_pages)
            store.dispatch("paginationManagement/setCount", paginationInfo.count)

            return data
        }

        const handleEdit = (editedProduct: any) => {
            isEditModalVisible.value = false

            let id = productIdToUpdate.value
            editRecordInProducts(productIdToUpdate.value, editedProduct)
            .then(() => {
                closeModal()
                store.dispatch("productManagement/updateProduct", {editedProduct, id})
                productIdToUpdate.value = ''
            })
        }

        const handleDelete = () => {
            isConfirmDeleteModalVisible.value = false

            deleteRecordInProducts(productIdToDelete.value)
            .then(() => {
                closeModal()
                return store.dispatch("productManagement/deleteProduct", productIdToDelete.value)
            })
            .catch((error) => {
                console.log(error)
            })
        }

        onMounted(() => {
            if(!products.value) updateList()
            getSuppliers()
            getProductPrices()
        })

        return {
            ORDER_BY_ID,
            ORDER_BY_UNIT_PRICE,
            ORDER_BY_UNITS_IN_STOCK,
            ORDER_BY_UNITS_ON_ORDER,
            products,
            isCreateModalVisible,
            isEditModalVisible,
            isConfirmDeleteModalVisible,
            productToUpdate,
            productIdToDelete,
            filteredSupplier,
            suppliers,
            filteredPrice,
            prices,
            search,
            orderBy,
            currentPage,
            perPage,
            numberOfPages,
            count,
            openCreateModal,
            openEditModal,
            openDeleteModal,
            openDetails,
            closeModal,
            handleEdit,
            handleDelete,
            filterList,
            refreshList,
            setSortingBy,
            updatePage,
            updateTableSize
        }
    }
})
</script>


<style lang="">
    
</style>