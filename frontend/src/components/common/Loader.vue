<template>
    <div class="loader">
        <spinner :height="spinnerSize!" :width="spinnerSize!" :color="color"/>
        <span v-if="message !== null">{{ message }}</span>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Spinner from '@/assets/icons/Spinner.vue';

export default defineComponent({
    components: {
        Spinner
    },
    props: {
        message: {
            type: String,
            default: "",
            required: false
        },
        size: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    },

    setup(props) {
        const color = ref(props.color)
        const spinnerSize = computed(() => ({
            small: 30,
            large: 100
        }[props.size]))
        
        return {
            color,
            spinnerSize
        }
    }
})
</script>

<style lang="scss" scoped>
.loader {
    text-align: center;
    margin: auto;
}
</style>