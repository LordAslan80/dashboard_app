<template>
    <tabs>
        <tab title="Add new user">
            <add-user-action/>
        </tab>
        
        <tab title="Delete a user">
            <delete-user-action/>
        </tab>
    </tabs>

    <div>
        <users-overview class="users"/>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import UsersOverview from './screens/UsersOverview.vue';
import Tab from '@/components/common/Tab.vue';
import Tabs from '@/components/common/Tabs.vue';
import AddUserAction from './actions/AddUserAction.vue';
import DeleteUserAction from './actions/DeleteUserAction.vue';

export default defineComponent ({
    components: {
        UsersOverview,
        Tab,
        Tabs,
        AddUserAction,
        DeleteUserAction
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