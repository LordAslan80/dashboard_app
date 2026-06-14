<template>
    <div class="admin-action">
        <div class="admin-action__title">
            <h3><b>New user</b></h3>
        </div>

        <div class="admin-action__content">
            <form @submit.prevent="submitForm">
                <div>
                    <label for="username">Username</label>
                    <input type="text" name="username" required v-model.trim="username">
                </div>
                <div>
                    <label for="firstName">First name</label>
                    <input type="text" name="firstName" required v-model.trim="firstName">
                </div>
                <div>
                    <label for="lastName">Last name</label>
                    <input type="text" name="lastName" required v-model.trim="lastName">
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" name="email" required v-model.trim="email">
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" name="password" required v-model.trim="password">
                </div>
                <div>
                    <label for="isAdmin">Is Admin</label>
                    <select name="isAdmin" id="" required v-model="isAdmin">
                        <option :value="1">Yse</option>
                        <option :value="0" selected>No</option>
                    </select>
                </div>
                <button class="button is-primary">Save</button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent ({
    components: {},

    setup() {
        const store = useStore()
        const username = ref("")
        const firstName = ref("")
        const lastName = ref("")
        const email = ref("")
        const isAdmin = ref(0)
        const password = ref("")

        const submitForm = async () => {
            let status = await store.dispatch("administrationManagement/addUser", {
                username: username.value,
                first_name: firstName.value,
                last_name: lastName.value,
                email: email.value,
                is_staff: isAdmin.value,
                passwd: password.value
            })

            if (status) cleanForm()
        }

        const cleanForm = () => {
            username.value = "",
            firstName.value = "",
            lastName.value = "",
            email.value = "",
            isAdmin.value = 0,
            password.value = ""
        }

        return {
            username,
            firstName,
            lastName,
            email,
            isAdmin,
            password,
            submitForm
        }
    },
})
</script>

<style lang="scss" scoped>
@import "@/styles/components/_administration.scss"
</style>