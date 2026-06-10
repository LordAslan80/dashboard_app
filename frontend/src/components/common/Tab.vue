<template>
    <div v-if="title === selectedTab">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent ({
    props: {
        title: {
            type: String,
            default: "Tab"
        }
    },

    setup() {
        const selectedTab = inject("selectedTab")

        return {
            selectedTab
        }
    },
})
</script>

<style lang="scss"></style>