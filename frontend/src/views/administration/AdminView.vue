<template>
    <tabs>
        <tab title="Add new user">
            <add-user-action/>
        </tab>
        
        <tab title="Delete a user">
            <delete-user-action/>
        </tab>
        
        <tab title="Unblock a user">
            <unblock-user-action/>
        </tab>
        
        <tab title="Update user status">
            <update-user-status-action/>
        </tab>
        
        <tab title="Update a user password">
            <update-user-password-action/>
        </tab>
    </tabs>

    <div>
        <users-overview class="users"/>
    </div>
</template>


<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import UsersOverview from './screens/UsersOverview.vue';
import Tab from '@/components/common/Tab.vue';
import Tabs from '@/components/common/Tabs.vue';
import AddUserAction from './actions/AddUserAction.vue';
import DeleteUserAction from './actions/DeleteUserAction.vue';
import UnblockUserAction from './actions/UnblockUserAction.vue';
import UpdateUserPasswordAction from './actions/UpdateUserPasswordAction.vue';
import UpdateUserStatusAction from './actions/UpdateUserStatusAction.vue';
import { useStore } from 'vuex';

export default defineComponent ({
    components: {
        UsersOverview,
        Tab,
        Tabs,
        AddUserAction,
        DeleteUserAction,
        UnblockUserAction,
        UpdateUserPasswordAction,
        UpdateUserStatusAction
    },

    setup() {
        const store = useStore()

        const updateList = async () => {
            return Promise.allSettled([
                store.dispatch("administrationManagement/setUsers")
            ])
        }

        onMounted(() => {
            updateList()
        })

        return {
        }
    },
})
</script>


<style lang="scss">
@import "@/styles/components/_administration.scss";
</style>