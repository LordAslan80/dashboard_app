<template>
    <header>
        <div class="title">Reporting / Products / Details</div>

        <button class="button is-cancel" style="margin-right: 2.8rem" @click="$router.go(-1)">
            <Back_Icon class="nav_icon" />
            Go back
        </button>
    </header>

    <div class="details-body">
        <div class="details-content">
            <h4 class="details-label">Product:</h4>
            <p class="details-input-desc">{{ productName }}</p>
            <hr>
        </div>

        <div class="details-content">
            <h4 class="details-label">Category info:</h4>
            <p class="details-input-desc">{{ categoryInfo }}</p>
            <hr>
        </div>
        
        <div class="details-content">
            <h4 class="details-label">Supplier contact person:</h4>
            <p class="details-input-desc">{{ supplierInfo }}</p>
            <hr>
        </div>

        <div class="details-content">
            <h4 class="details-label">Supplier company:</h4>
            <p class="details-input-desc">{{ supplierCompanyInfo }}</p>
            <hr>
        </div>

        <div class="details-content">
            <h4 class="details-label">Price:</h4>
            <p class="details-input-desc">{{ unitPrice }}</p>
            <hr>
        </div>

        <div class="details-content">
            <h4 class="details-label">In stock:</h4>
            <p class="details-input-desc">{{ unitsInStock }}</p>
            <hr>
        </div>

        <div class="details-content">
            <h4 class="details-label">On order:</h4>
            <p class="details-input-desc">{{ unitsOnOrder }}</p>
            <hr>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import { getProductDetails } from '@/api/reporting/products'

import Back_Icon from '@/assets/icons/Back_Icon.vue'
import formatDate from '@/composables/util'

import { useStore } from 'vuex'

export default defineComponent({
    components: {
        Back_Icon
    },
    setup() {
        const route = useRoute()
        const store = useStore()

        const productName = ref('')
        const supplierInfo = ref('')
        const categoryInfo = ref('')
        const supplierCompanyInfo = ref('')
        const unitPrice = ref('')
        const unitsInStock = ref('')
        const unitsOnOrder = ref('')

        const passedID = computed(() => {
            return route.params.id ? route.params.id as string : ''
        })

        const getDetails = async () => {
            let details = store.getters["productManagement/getProductDetails"]

            if(!details) {
                details = await getProductDetails(passedID.value)
            }
            
            productName.value = details.product_name
            supplierInfo.value = `${details.supplier.contact_name}, ${details.supplier.contact_title}, Phone: ${details.supplier.phone}, Email: ${details.supplier.email}`
            categoryInfo.value = `In: ${details.category.name}, Description: ${details.category.discription}`
            supplierCompanyInfo.value = `${details.supplier.company_name}, ${details.supplier.address} - ${details.supplier.city} - ${details.supplier.postal_code}`
            unitPrice.value = details.unit_price
            unitsInStock.value = details.units_in_stock
            unitsOnOrder.value = details.units_on_order
        }

        onBeforeMount(() => {
            getDetails()
        })

        return {
            productName,
            supplierInfo,
            categoryInfo,
            supplierCompanyInfo,
            unitPrice,
            unitsInStock,
            unitsOnOrder
        }
    }
})
</script>