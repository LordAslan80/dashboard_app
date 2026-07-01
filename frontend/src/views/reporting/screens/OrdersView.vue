<template>
    <slot name="loader" v-if="isLoading">
        <loader :message="'Loading Orders'" :size="'large'" :color="LARGE_LOADER_COLOR"/>
    </slot>

    <slot v-else>
        <header>
            <span class="title">Reporting / Orders</span>
            <button class="button is-primary is-on-header" @click="openCreateModal">
                <Plus_Icon class="nav_icon"/>
                New order
            </button>
        </header>
    
        <div class="filters">
            <div class="filter-wrapper">
                <p>Shipped country:</p>
                <select v-model="filteredCountry">
                    <option value="" disabled selected>All countries</option>
                    <option v-for="(country, i) in countries" :key="i" :value="country">{{ country }}</option>
                </select>
            </div>
    
            <div class="filter-wrapper">
                <p>Shipped city:</p>
                <select v-model="filteredCity">
                    <option value="" disabled selected>All cities</option>
                    <option v-for="(city, i) in cities" :key="i" :value="city">{{ city }}</option>
                </select>
            </div>
            
            <div class="filter-wrapper">
                <p>Search:</p>
                <input v-model="search" type="text" placeholder="Search (product or customer)" @keyup.enter="filterList">
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
    
        <create-order-modal v-if="isCreateModalVisible" @close-modal="closeModal"/>
    
        <edit-order-modal v-if="isEditModalVisible" :order="orderToUpdate" @close-modal="closeModal" @handle-edit="handleEdit"/>
    
        <confirm-delete-modal v-if="isConfirmDeleteModalVisible" :entity-type="'Order'"
        :entity-id="orderIdToDelete" @close-modal="closeModal" @handle-delete="handleDelete"/>
    
        <div>
            <table>
                <thead>
                    <tr>
                        <th @click="setSortingBy(ORDER_BY_ID)">
                            ID
                            <span class="action-icon-wrapper">
                                <Sorting_Icon :class="orderBy===ORDER_BY_ID ? 'active-sorting' : ''" class="sorting-icon"/>
                                <span class="tooltiptext" v-if="orderBy===ORDER_BY_DATE">Sort by ID</span>
                            </span>
                        </th>
                        <th @click="setSortingBy(ORDER_BY_DATE)">
                            Order date
                            <span class="action-icon-wrapper">
                                <Sorting_Icon :class="orderBy===ORDER_BY_DATE ? 'active-sorting' : ''" class="sorting-icon"/>
                                <span class="tooltiptext" v-if="orderBy===ORDER_BY_ID">Sort by Date</span>
                            </span>
                        </th>
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
                    <tr v-for="(item, index) in orders" :key="index" @click="openDetails(item)">
                        <td>{{ item.id }}</td>
                        <td>{{ formatDate(item.order_date) }}</td>
                        <td>{{ item.customer.first_name }} {{ item.customer.last_name }}</td>
                        <td>{{ item.product.product_name }}</td>
                        <td>{{ formatDate(item.required_date) }}</td>
                        <td>{{ item.shipped_name }}</td>
                        <td>{{ item.shipped_address }}</td>
                        <td>{{ item.shipped_city }}</td>
                        <td>{{ item.shipped_postal_code }}</td>
                        <td>{{ item.shipped_country }}</td>
                        <td class="table-actons">
                            <span @click.stop @click="openEditModal(item.id)" class="action-icon-wrapper">
                                <Edit_Icon class="action-icon"/>
                                <span class="tooltiptext">Edit</span>
                            </span>
                            <span @click.stop @click="openDeleteModal(item.id)" class="action-icon-wrapper">
                                <Trash_Icon class="action-icon"/>
                                <span class="tooltiptext">Delete</span>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
    
            <pagination v-if="count > 0" :current-page="currentPage" :per-page="perPage" :count="count"
                :number-of-pages="numberOfPages" @update-page="updatePage" @update-table-size="updateTableSize"/>
        </div>
    </slot>
</template>


<script lang="ts">
import formatDate, { extractValues } from '@/composables/util';
import { editRecordInOrders, deleteRecordInOrders } from '@/api/reporting/orders';
import { computed, defineComponent, onMounted, ref, toRaw } from 'vue';
import CreateOrderModal from '../modals/CreateOrderModal.vue';
import EditOrderModal from '../modals/EditOrderModal.vue';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal.vue';
import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';
import Sorting_Icon from '@/assets/icons/Sorting_Icon.vue';
import { useStore } from 'vuex';
import router from '@/router';
import { IOrder } from '@/models/IOrder';
import { loadCountries } from '@/api/common/countries';
import { loadCities } from '@/api/common/cities';
import Pagination from '@/components/common/Pagination.vue';
import Loader from '@/components/common/Loader.vue';
import { LARGE_LOADER_COLOR } from '@/constants/colors';

export default defineComponent ({
    components: {
        CreateOrderModal,
        EditOrderModal,
        ConfirmDeleteModal,
        Edit_Icon,
        Trash_Icon,
        Plus_Icon,
        Sorting_Icon,
        Pagination,
        Loader
    },

    setup() {
        const ORDER_BY_ID = "id"
        const ORDER_BY_DATE = "order_date"

        const isLoading = ref(false)

        const store = useStore()

        const orders = computed(() => {
            let data = store.getters['orderManagement/getOrders']
            if(!data) return
            return data
        })

        const search = ref()

        const countries = ref()
        const filteredCountry = ref()
        
        const cities = ref()
        const filteredCity = ref()

        const isCreateModalVisible = ref(false)
        const isEditModalVisible = ref(false)
        const isConfirmDeleteModalVisible = ref(false)

        const orderIdToUpdate = ref('')
        const orderToUpdate = ref()
        const orderIdToDelete = ref()

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

        const setDataForDetailsPage = (item: IOrder) => {
            return store.dispatch("orderManagement/setOrderDetails", {
                ...item
            })
        }

        const openCreateModal = () => {
            isCreateModalVisible.value = true
        }

        const openEditModal = (id: string) => {
            orderIdToUpdate.value = id
            orderToUpdate.value = toRaw(orders.value).find((x: any) => x.id === id)
            isEditModalVisible.value = true
        }

        const openDeleteModal = (id: string) => {
            orderIdToDelete.value = id
            isConfirmDeleteModalVisible.value = true
        }

        const openDetails = (item: IOrder) => {
            let id = item.id

            setDataForDetailsPage(item)
            
            router.push({
                name: "order-details",
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
            // filteredCity.value = ""
            // filteredCountry.value = ""
            // search.value = ""
            // updateList()
        }

        const getCountries = async () => {
            let data: any = await loadCountries()
            countries.value = extractValues(data)
        }
        
        const getCities = async () => {
            let data: any = await loadCities()
            cities.value = extractValues(data)
        }

        const updateList = async () => {
            isLoading.value = true
            
            let data: any = await Promise.allSettled([
                store.dispatch('orderManagement/setOrders', {
                    filteredCity: filteredCity.value,
                    filteredCountry: filteredCountry.value,
                    search: search.value,
                    per_page: perPage.value,
                    page: currentPage.value,
                    order_by: orderBy.value
                })
            ])

            let paginationInfo = data[0].value
            await store.dispatch("paginationManagement/setNumberOfPages", paginationInfo.number_of_pages)
            await store.dispatch("paginationManagement/setCount", paginationInfo.count)

            isLoading.value = false
            return data
        }

        const handleEdit = (editedOrder: any) => {
            isEditModalVisible.value = false

            let id = orderIdToUpdate.value
            editRecordInOrders(orderIdToUpdate.value, editedOrder)
            .then(() => {
                closeModal()
                store.dispatch("orderManagement/updateOrder", {editedOrder, id})
                orderIdToUpdate.value = ''
            })
        }

        const handleDelete = () => {
            isConfirmDeleteModalVisible.value = false

            deleteRecordInOrders(orderIdToDelete.value)
            .then(() => {
                closeModal()
                return store.dispatch("orderManagement/deleteOrder", orderIdToDelete.value)
            })
            .catch((error) => {
                console.log(error)
            })
        }

        onMounted(() => {
            if(!orders.value) updateList()
            getCountries()
            getCities()
        })

        return {
            ORDER_BY_ID,
            ORDER_BY_DATE,
            orders,
            isCreateModalVisible,
            isEditModalVisible,
            isConfirmDeleteModalVisible,
            orderToUpdate,
            orderIdToDelete,
            countries,
            filteredCountry,
            cities,
            filteredCity,
            search,
            currentPage,
            perPage,
            numberOfPages,
            count,
            orderBy,
            isLoading,
            LARGE_LOADER_COLOR,
            openEditModal,
            handleEdit,
            handleDelete,
            openCreateModal,
            openDeleteModal,
            openDetails,
            closeModal,
            formatDate,
            filterList,
            refreshList,
            updatePage,
            updateTableSize,
            setSortingBy
        }
    }
})
</script>


<style lang="">
    
</style>