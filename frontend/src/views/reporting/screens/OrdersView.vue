<template>
    <header>
        <span class="title">Reporting / Orders</span>
        <button class="button is-primary is-on-header" @click="openCreateModal">
            <Plus_Icon class="nav_icon"/>
            New order
        </button>
    </header>

    <create-order-modal v-if="isCreateModalVisible" @close-modal="closeModal" @update-list="updateList"/>

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
                <tr v-for="(item, index) in orders" :key="index">
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
                        <span @click="openEditModal(item.id)">
                            <Edit_Icon class="table_icon"/>
                        </span>
                        <span @click="openDeleteModal(item.id)">
                            <Trash_Icon class="table_icon__left"/>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script lang="ts">
import formatDate from '@/composables/util';
import { loadOrders, editRecordInOrders, deleteRecordInOrders } from '@/api/reporting/orders';
import { defineComponent, onMounted, ref, toRaw } from 'vue';
import CreateOrderModal from '../modals/CreateOrderModal.vue';
import EditOrderModal from '../modals/EditOrderModal.vue';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal.vue';
import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';

export default defineComponent ({
    components: {
        CreateOrderModal,
        EditOrderModal,
        ConfirmDeleteModal,
        Edit_Icon,
        Trash_Icon,
        Plus_Icon
    },

    setup() {
        const orders = ref()
        const isCreateModalVisible = ref(false)
        const isEditModalVisible = ref(false)
        const isConfirmDeleteModalVisible = ref(false)

        const orderIdToUpdate = ref('')
        const orderToUpdate = ref()
        const orderIdToDelete = ref()

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
        
        const closeModal = () => {
            isCreateModalVisible.value = false
            isEditModalVisible.value = false
            isConfirmDeleteModalVisible.value = false
        }

        const updateList = async () => {
            orders.value = await loadOrders()
        }

        const handleEdit = (editedOrder: any) => {
            isEditModalVisible.value = false

            editRecordInOrders(orderIdToUpdate.value, editedOrder)
            .then(() => {
                closeModal()
                updateList()
                orderIdToUpdate.value = ''
            })
        }

        const handleDelete = () => {
            isConfirmDeleteModalVisible.value = false

            deleteRecordInOrders(orderIdToDelete.value)
            .then(() => {
                closeModal()
                updateList()
                orderIdToDelete.value = ''
            })
        }

        onMounted(() => {
            updateList()
        })

        return {
            orders,
            isCreateModalVisible,
            isEditModalVisible,
            isConfirmDeleteModalVisible,
            orderToUpdate,
            orderIdToDelete,
            openEditModal,
            handleEdit,
            handleDelete,
            openCreateModal,
            openDeleteModal,
            closeModal,
            formatDate,
            updateList
        }
    }
})
</script>


<style lang="">
    
</style>