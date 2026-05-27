<template>
  <!-- <router-view /> -->
   <login-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginView from './views/user/LoginView.vue';

export default defineComponent({
  components: {
    LoginView
  }
})
</script>

<style lang="scss">
#app {
  font-family: "IBM Plex Sans", sans-serif;
}
</style>
