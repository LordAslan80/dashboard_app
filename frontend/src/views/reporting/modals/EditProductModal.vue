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
                    <button :disabled="!buttonEnable" class="confirm" @click="handleUpdateProduct()">CONFIRM</button>
                </div>
            </div>
        </div>
    </modal>
</template>


<script lang="ts">
import { defineComponent, onBeforeMount, reactive, ref, watch } from 'vue';
import Modal from '@/components/common/Modal.vue';
import Close_Icon from '@/assets/icons/Close_Icon.vue';
import { IProduct } from '@/models/IProduct';
import { loadSuppliers } from '@/api/reporting/suppliers';
import { loadCategories } from '@/api/common/categories';

export default defineComponent({
    components: {
        Close_Icon,
        Modal
    },
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    emits: ['close-modal', 'handle-edit'],

    setup(props, context) {
        const buttonEnable = ref(false)

        const product = reactive(props.product)

        const supplierId = ref(product.supplier.id)
        const categoryId = ref(product.category.id)
        const productName = ref(product.product_name)
        const unitPrice = ref(product.unit_price)
        const unitsOnOrder = ref(product.units_on_order)
        const unitsInStock = ref(product.units_in_stock)

        const suppliers = ref()
        const categories = ref()

        const closeModal = () => {
            context.emit("close-modal")
        }

        const editProduct = (editedProduct: Partial<IProduct>) => {
            context.emit("handle-edit", editedProduct)
        }

        const getSuppliers = async () => {
            suppliers.value = await loadSuppliers()
        }

        const getCategories = async () => {
            categories.value = await loadCategories()
        }

        watch(() => [supplierId.value, categoryId.value, productName.value,
                    unitPrice.value, unitsOnOrder.value, unitsInStock.value],
        () => {
            if((productName.value !== '' && unitPrice.value !== '' &&
                unitsOnOrder.value !== '' && unitsInStock.value !== '')
                &&
                (supplierId.value !== product.supplier.id ||
                categoryId.value !== product.category.id ||
                productName.value !== product.product_name ||
                unitPrice.value !== product.unit_price ||
                unitsOnOrder.value !== product.units_on_order ||
                unitsInStock.value !== product.units_in_stock))
            {
                buttonEnable.value = true
            } else {
                buttonEnable.value = false
            }
        })

        const handleUpdateProduct = () => {
            let editedProduct: Partial<IProduct> = {
                supplier: suppliers.value.find((x:any) => x.id === supplierId.value),
                category: categories.value.find((x:any) => x.id === categoryId.value),
                productName: productName.value,
                unitPrice: unitPrice.value,
                unitsOnOrder: unitsOnOrder.value,
                unitsInStock: unitsInStock.value
            }

            editProduct(editedProduct)
        }

        onBeforeMount(() => {
            getSuppliers()
            getCategories()
        })

        return {
            buttonEnable,
            supplierId,
            categoryId,
            productName,
            unitPrice,
            unitsOnOrder,
            unitsInStock,
            suppliers,
            categories,
            closeModal,
            handleUpdateProduct
        }
    },
})
</script>


<style lang="scss"></style>