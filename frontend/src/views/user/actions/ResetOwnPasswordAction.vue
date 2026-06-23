<template>
    <div class="admin-action admin-action__small">
        <div class="admin-action__title">
            <h3>
                <b>Update user's password</b>
            </h3>
        </div>

        <div class="admin-action__content">
            <input type="password" v-model.trim="password" placeholder="New Password" @blur="validate()">
            <input type="password" v-model.trim="passwordRepeat" placeholder="Repeat Password">

            <div>
                <button class="button is-primary" :disabled="!buttonEnable"
                @click="updateUserPassword">Update</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { resetOwnPassword } from '@/api/admin/users';
import router from '@/router';
import { get as getFromStore, remove as removeFromStore } from '@/localStorage';
import { showNotification } from '@/composables/outlets';

export default defineComponent ({
    setup() {
        const ERROR_MESSAGE = "error"
        const SUCCESS_MESSAGE = "success"

        const password = ref("")
        const passwordRepeat = ref("")
        const buttonEnable = ref(false)

        const requirmentsPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W)")
        const charRepeatPattern = new RegExp("(.)\\1\\1")

        const logout = () => {
            removeFromStore("logged")
        }

        const notify = (message: string, type: string) => {
            showNotification({
                props: { type, duration: 5000, message }
            })
        }

        const validate = () => {
            if (!requirmentsPattern.test(password.value)) {
                notify(`You need at least 1 uppercase and 1 lowercase letter, 
                1 number, 1 special character!`, ERROR_MESSAGE)
            }
            if (charRepeatPattern.test(password.value)) {
                notify("You cannot repeat 1 character more then 2 times!", ERROR_MESSAGE)
            }
            if (password.value.length < 8) {
                notify("Password needs to be at least 8 characters long!", ERROR_MESSAGE)
            }
        }

        const updateUserPassword = async () => {
            if (password.value !== passwordRepeat.value) {
                notify("Passwords hav to match", ERROR_MESSAGE)
                return
            }

            const response = await resetOwnPassword({
                new_passwd: password.value,
                confirm_passwd: passwordRepeat.value
            })

            if (response && response.status && response.status === 200) {
                notify(response.data.response, SUCCESS_MESSAGE)
                logout()
                router.push({name: "dashboard"})
            }
            else if (response.response.status === 403) {
                response.response.data.errors.forEach((error: string) => {
                    notify(error.toString().replace("[", ""), ERROR_MESSAGE)
                })
            }
        }

        watch(
            () => [password.value, passwordRepeat.value],
            () => {
                password.value === "" || passwordRepeat.value === ""
                ? buttonEnable.value = false
                : buttonEnable.value = true
            }
        )

        return {
            password,
            passwordRepeat,
            buttonEnable,
            updateUserPassword,
            validate
        }
    },
})
</script>

<style lang="scss">
@import "@/styles/components/_administration.scss";
</style>