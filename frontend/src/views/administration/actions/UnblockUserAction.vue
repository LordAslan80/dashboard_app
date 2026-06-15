<template>
    <div class="admin-action admin-action__small">
        <div class="admin-action__title">
            <h3><b>Unblock user</b></h3>
        </div>

        <div class="admin-action__content">
            <div class="single-select">
                <label>Please select a user to unblock</label>
                <select v-model="username">
                    <option v-for="(user, index) in blockedUsers" :key="index" :value="user.id">
                        {{ user.username }}
                    </option>
                </select>
            </div>

            <button class="button is-primary" :disabled="!buttonEnable"
            @click="unblockUser">Unblock</button>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/models/IUser';
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent ({
    components: {},

    setup() {
        const store = useStore()
        const buttonEnable = ref(false)
        const username = ref("")

        const users = computed(() => {
            let data = store.getters["administrationManagement/getUsers"]
            if (!data) return
            return data
        })

        const blockedUsers = computed(() => {
            let data = users.value
            let blockedUsers = data.filter((user: IUser) => user.is_blocked === true)
            return blockedUsers
        })

        const unblockUser = async () => {
            await store.dispatch("administrationManagement/unblockUser", username.value)
            resetDropdown()
        }

        const resetDropdown = () => {
            username.value = ""
        }

        watch(
            () => [username.value],
            () => {
                username.value !== "" ? buttonEnable.value = true : buttonEnable.value = false
            }
        )

        return {
            username,
            blockedUsers,
            buttonEnable,
            unblockUser,
        }
    },
})
</script>

<style lang="scss"></style>