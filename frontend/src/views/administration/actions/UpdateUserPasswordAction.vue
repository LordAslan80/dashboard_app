<template>
    <div class="admin-action admin-action__small">
        <div class="admin-action__title">
            <h3>
                <b>
                    Reset user's password
                </b>
            </h3>
        </div>
        <div class="admin-action__content">

            <div class="single-select">
                <label>Please select a user</label>
                <select v-model="username">
                   
                    <option v-for="user in filteredUsers" :key="user.id" :value="user.username">
                        {{ user.username }}
                    </option>
                </select>
            </div>

            <input type="password" v-model="password" placeholder="New password" class="single-input"/>
            <div>
                <button :disabled="!buttonEnable" class="button is-primary" @click="resetUserPassword">
                    Reset
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { updateUserPassword } from '@/api/admin/admin';
import { filterNoAdminUsers } from '@/composables/util';
import { get as getFromStore } from '@/localStorage';
import { IUser } from '@/models/IUser';
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent ({
    components: {},

    setup() {
        const store = useStore()
        const buttonEnable = ref(false)
        const username = ref("")
        const password = ref("")

        const users = computed(() => {
            let data = store.getters["administrationManagement/getUsers"]
            if (!data) return
            return data
        })

        const filteredUsers = computed(() => {
            let filteredData = filterNoAdminUsers(users.value)
            return filteredData
        })

        const resetUserPassword = async () => {
            let status = await updateUserPassword({
                new_passwd: password.value,
                target_user: username.value
            })

            if (status) resetDropdown()
        }

        const resetDropdown = () => {
            username.value = ""
            password.value = ""
        }

        watch(
            () => [username.value, password.value],
            () => {
                username.value !== "" && password.value !== ""
                ? buttonEnable.value = true : buttonEnable.value = false
            }
        )

        return {
            username,
            password,
            filteredUsers,
            buttonEnable,
            resetUserPassword,
        }
    },
})
</script>

<style lang="scss"></style>