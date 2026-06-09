<template>
    <div>
        <users-overview class="users"/>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import UsersOverview from './screens/UsersOverview.vue';

export default defineComponent ({
    components: {
        UsersOverview
    },

    setup() {

        return {
        }
    },
})
</script>


<style lang="scss">
.users {
    position: absolute;
    height: 30%;
    bottom: 20px;
    width: 78%;
    margin: .5rem .5rem 1rem;
    overflow-x: scroll;
}
</style>