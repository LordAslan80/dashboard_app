<template>
    <div class="admin-action admin-action__small">
        <div class="admin-action__title">
            <h3>
                <b>Update user's password</b>
            </h3>
        </div>

        <div class="admin-action__content">
            <input type="password" v-model.trim="password" placeholder="New Password">
            <input type="password" v-model.trim="passwordRepeat" placeholder="Repeat Password">

            <div>
                <button class="button is-primary" @click="updateUserPassword">Update</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { resetOwnPassword } from '@/api/admin/users';
import router from '@/router';
import { get as getFromStore, remove as removeFromStore } from '@/localStorage';

export default defineComponent ({
    setup() {
        const password = ref("")
        const passwordRepeat = ref("")

        const logout = () => {
            removeFromStore("logged")
        }

        const updateUserPassword = async () => {
            const status = await resetOwnPassword({
                new_passwd: password.value,
                confirm_passwd: passwordRepeat.value
            })

            if (status?.status === 200) {
                logout()
                router.push({name: "dashboard"})
            }
        }

        return {
            password,
            passwordRepeat,
            updateUserPassword
        }
    },
})
</script>

<style lang="scss">
@import "@/styles/components/_administration.scss";
</style>