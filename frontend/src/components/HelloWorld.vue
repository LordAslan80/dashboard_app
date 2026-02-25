<template>
  <div>
    <ul v-for="order in orders" v-bind:key="order.id">
      <li>{{ order.amount }}</li>
      <li>{{ order.description }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { loadOrders } from "@/api/reporting";

export default defineComponent({
  setup() {
    const orders = ref();

    const addOrders = async () => {
      orders.value = await loadOrders();
    };

    onMounted(() => {
      addOrders();
    });

    return {
      orders,
    };
  },
});
</script>


<style scoped lang="scss">
</style>
