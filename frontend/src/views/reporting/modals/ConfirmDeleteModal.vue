<template>
    <modal @close="closeModal">
        <div class="modal-content">
            <div class="header">
                <div class="content">
                    <span class="title">Order properties</span>
                    <Close_Icon class="icon" @click="closeModal()"/>
                </div>
            </div>
            
            <div>
                <p class="text">Are you sure you want to delete {{ entityType }} with ID <strong>{{ entityId }} ?</strong></p>
            </div>
    
            <div class="footer">
                <div class="content">
                    <button class="cancel" @click="closeModal()">CANCEL</button>
                    <button class="danger" @click="handleDelete()">DELETE</button>
                </div>
            </div>
        </div>
    </modal>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import Modal from '@/components/common/Modal.vue';
import Close_Icon from '@/assets/icons/Close_Icon.vue';

export default defineComponent({
    components: {
        Close_Icon,
        Modal
    },
    props: {
        entityType: {
            type: String
        },
        entityId: {
            type: Number
        }
    },
    emits: ['close-modal', 'handle-delete'],

    setup(props, context) {
        const entityType = ref(props.entityType)
        const entityId = ref(props.entityId)
        
        const closeModal = () => {
            context.emit('close-modal')
        }

        const handleDelete = () => {
            context.emit("handle-delete")
        }

        return {
            entityType,
            entityId,
            closeModal,
            handleDelete
        }
    },
})
</script>


<style lang="scss">
.text {
    font-size: larger;
    margin-bottom: 15px;
}
</style>