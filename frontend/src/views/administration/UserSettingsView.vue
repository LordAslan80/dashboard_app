<template>
    <header>
        <span class="title">User Settings</span>
    </header>

    <tabs>
        <tab title="Reset Password">
            <reset-own-password-action/>
        </tab>
        <tab title="Update Profile">
            <span v-if="user">
                <update-own-profile-action :user="user" v-if="!requiresReset"/>
                <h3 v-else>{{ NOT_AUTHORIZED }}</h3>
            </span>
        </tab>
        <tab title="Deactivate">
            <deactivate-self-action v-if="!requiresReset"/>
            <h3 v-else>{{ NOT_AUTHORIZED }}</h3>
        </tab>
    </tabs>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import Tab from '@/components/common/Tab.vue';
import Tabs from '@/components/common/Tabs.vue';
import ResetOwnPasswordAction from '../user/actions/ResetOwnPasswordAction.vue';
import UpdateOwnProfileAction from '../user/actions/UpdateOwnProfileAction.vue';
import DeactivateSelfAction from '../user/actions/DeactivateSelfAction.vue';
import { get as getFromStore } from '@/localStorage'
import { useStore } from 'vuex';

export default defineComponent ({
    components: {
        Tab,
        Tabs,
        ResetOwnPasswordAction,
        UpdateOwnProfileAction,
        DeactivateSelfAction
    },

    setup() {
        const NOT_AUTHORIZED = "You are not authorized to see this section, you have to update your password first!"
        const requiresReset = computed(() => getFromStore("logged.requiresReset"))

        const store = useStore()
        const userId = computed(() => getFromStore("logged.id"))

        const user = computed(() => {
            let user = store.getters["administrationManagement/getUser"]
            return user
        })

        const setUser = async () => {
            return Promise.allSettled([
                store.dispatch("administrationManagement/setUser", userId.value)
            ])
        }

        onMounted(() => {
            setUser()
        })

        return {
            NOT_AUTHORIZED,
            requiresReset,
            user
        }
    },
})
</script>

<style lang="scss">
@import "@/styles/components/_administration.scss";
</style>