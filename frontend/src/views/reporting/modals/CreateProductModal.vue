<template>
    <modal @close="closeModal">
        <div class="modal-content">
            <div class="header">
                <div class="content">
                    <span class="title">Product properties</span>
                    <Close_Icon class="icon" @click="closeModal()"/>
                </div>
            </div>
            
            <label>
                <strong>
                    <small>
                        Supplier
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <select v-model="supplierId">
                <option value="" disabled selected>Select supplier</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                    {{ supplier.company_name }}
                </option>
            </select>
    
            <label>
                <strong>
                    <small>
                        Category
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <select v-model="categoryId">
                <option value="" disabled selected>Select category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
    
            <label>
                <strong>
                    <small>
                        Product name
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="text" v-model="productName">
    
            <label>
                <strong>
                    <small>
                        Unit price
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="number" v-model="unitPrice">
    
            <label>
                <strong>
                    <small>
                        Units on order
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="number" v-model="unitsOnOrder">
    
            <label>
                <strong>
                    <small>
                        Units in stock
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="number" v-model="unitsInStock">
    
            <div class="footer">
                <div class="content">
                    <button class="cancel" @click="closeModal()">CANCEL</button>
                    <button class="confirm" @click="addNewRecord()">CONFIRM</button>
                </div>
            </div>
        </div>
    </modal>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import Modal from '@/components/common/Modal.vue';
import Close_Icon from '@/assets/icons/Close_Icon.vue';
import { loadSuppliers } from '@/api/reporting/suppliers';
import { loadCategories } from '@/api/common/categories';
import { IProduct } from '@/models/IProduct';
import { addNewProduct } from '@/api/reporting/products';

export default defineComponent ({
    components: {
        Modal,
        Close_Icon
    },

    emits: ['close-modal', 'update-list'],

    setup(_, context) {
        const buttonEnable = ref(false)
        
        const supplierId = ref('')
        const categoryId = ref('')
        const productName = ref('')
        const unitPrice = ref('')
        const unitsOnOrder = ref('')
        const unitsInStock = ref('')

        const suppliers = ref()
        const categories = ref()

        const getSuppliers = async () => {
            suppliers.value = await loadSuppliers()
        }

        const getCategories = async () => {
            categories.value = await loadCategories()
        }

        const addNewRecord = () => {
            let newProductRecord: Partial<IProduct> = {}
                newProductRecord.supplierId = supplierId.value
                newProductRecord.categoryId = categoryId.value
                newProductRecord.productName = productName.value
                newProductRecord.unitPrice = Number.parseInt(unitPrice.value)
                newProductRecord.unitsOnOrder = Number.parseInt(unitsOnOrder.value)
                newProductRecord.unitsInStock = Number.parseInt(unitsInStock.value)

                addNewProduct(newProductRecord).then(() => {
                    updateList()
                    closeModal()
                })
        }

        const closeModal = () => {
            context.emit('close-modal')
        }

        const updateList = () => {
            context.emit('update-list')
        }

        onBeforeMount(() => {
            getSuppliers()
            getCategories()
        })

        return {
            supplierId,
            categoryId,
            productName,
            unitPrice,
            unitsOnOrder,
            unitsInStock,
            closeModal,
            addNewRecord,
            suppliers,
            categories
        }
    }
})
</script>