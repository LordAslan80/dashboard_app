<template>
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

        <pagination/>
    </div>
</template>


<script lang="ts">
import formatDate, { extractValues } from '@/composables/util';
import { loadOrders, editRecordInOrders, deleteRecordInOrders } from '@/api/reporting/orders';
import { computed, defineComponent, onMounted, ref, toRaw } from 'vue';
import CreateOrderModal from '../modals/CreateOrderModal.vue';
import EditOrderModal from '../modals/EditOrderModal.vue';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal.vue';
import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';
import { useStore } from 'vuex';
import router from '@/router';
import { IOrder } from '@/models/IOrder';
import { loadCountries } from '@/api/common/countries';
import { loadCities } from '@/api/common/cities';
import Pagination from '@/components/common/Pagination.vue';

export default defineComponent ({
    components: {
        CreateOrderModal,
        EditOrderModal,
        ConfirmDeleteModal,
        Edit_Icon,
        Trash_Icon,
        Plus_Icon,
        Pagination
    },

    setup() {
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

        const filterList = () => {
            updateList()
        }

        const refreshList = () => {
            filteredCity.value = ""
            filteredCountry.value = ""
            search.value = ""
            updateList()
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
            return Promise.allSettled([
                store.dispatch('orderManagement/setOrders', {
                    filteredCity: filteredCity.value,
                    filteredCountry: filteredCountry.value,
                    search: search.value
                })
            ])
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
            openEditModal,
            handleEdit,
            handleDelete,
            openCreateModal,
            openDeleteModal,
            openDetails,
            closeModal,
            formatDate,
            filterList,
            refreshList
        }
    }
})
</script>


<style lang="">
    
</style>