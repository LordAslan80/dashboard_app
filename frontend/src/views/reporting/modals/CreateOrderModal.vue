<template @close="closeModal">
    <modal>
        <div class="modal-content">
            <div class="header">
                <div class="content">
                    <span class="title">Order properties</span>
                    <Close_Icon class="icon" @click="closeModal()"/>
                </div>
            </div>
            
            <label>
                <strong>
                    <small>
                        Product
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <select>
                <option value="" disabled selected>Select product</option>
            </select>
    
            <label>
                <strong>
                    <small>
                        Customer
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <select>
                <option value="" disabled selected>Select customer</option>
            </select>
    
            <label>
                <strong>
                    <small>
                        Required date
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="date">
    
            <label>
                <strong>
                    <small>
                        Shipped name
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="text" v-model="shippedName">
    
            <label>
                <strong>
                    <small>
                        Shipped address
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="text" v-model="shippedAddress">
    
            <label>
                <strong>
                    <small>
                        Shipped city
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="text" v-model="shippedCity">
    
            <label>
                <strong>
                    <small>
                        Shipped country
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="text" v-model="shippedCountry">
    
            <label>
                <strong>
                    <small>
                        Shipped postal code
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="text" v-model="shippedPostalCode">
    
            <div class="footer">
                <div class="content">
                    <button @click="closeModal()">CANCEL</button>
                    <button @click="addNewRecord()">CONFIRM</button>
                </div>
            </div>
        </div>
    </modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Modal from '@/components/common/Modal.vue';
import Close_Icon from '@/assets/icons/Close_Icon.vue';

export default defineComponent ({
    components: {
        Modal,
        Close_Icon
    },

    emits: ['close-modal'],

    setup(_, context) {
        const buttonEnable = ref(false)
        const productId = ref(false)
        const customerId = ref(false)
        const requiredDate = ref(false)
        const shippedName = ref(false)
        const shippedAddress = ref(false)
        const shippedCity = ref(false)
        const shippedCountry = ref(false)
        const shippedPostalCode = ref(false)

        const addNewRecord = () => {
            closeModal()
        }

        const closeModal = () => {
            context.emit('close-modal')
        }

        return {
            productId,
            customerId,
            requiredDate,
            shippedName,
            shippedAddress,
            shippedCity,
            shippedCountry,
            shippedPostalCode,
            closeModal,
            addNewRecord
        }
    }
})
</script>