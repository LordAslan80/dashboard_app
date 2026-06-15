<template>
    <div class="admin-action admin-action__small">
        <div class="admin-action__title">
            <h3><b>Delete user</b></h3>
        </div>

        <div class="admin-action__content">
            <div class="single-select">
                <label>Please select a user to delete</label>
                <select v-model="userId">
                    <option v-for="(user, index) in filteredUsers" :key="index" :value="user.id">
                        {{ user.username }}
                    </option>
                </select>
            </div>

            <button class="button is-primary" :disabled="!buttonEnable"
            @click="deleteUser">Delete</button>
        </div>
    </div>
</template>

<script lang="ts">
import { get as getFromStore } from '@/localStorage';
import { IUser } from '@/models/IUser';
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent ({
    components: {},

    setup() {
        const store = useStore()
        const buttonEnable = ref(false)
        const userId = ref(null)

        const users = computed(() => {
            let data = store.getters["administrationManagement/getUsers"]
            if (!data) return
            return data
        })

        const loggedUser = computed(() => getFromStore("logged.username"))

        const filteredUsers = computed(() => {
            let filteredData = users.value.filter((user: IUser) => user.username !== loggedUser.value)
            return filteredData
        })

        const deleteUser = async () => {
            await store.dispatch("administrationManagement/deleteUser", {id: userId.value})
            resetDropdown()
        }

        const resetDropdown = () => {
            userId.value = null
        }

        watch(
            () => [userId.value],
            () => {
                userId.value !== null ? buttonEnable.value = true : buttonEnable.value = false
            }
        )

        return {
            userId,
            filteredUsers,
            buttonEnable,
            deleteUser,
        }
    },
})
</script>

<style lang="scss"></style>