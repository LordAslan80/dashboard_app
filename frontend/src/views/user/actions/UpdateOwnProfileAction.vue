<template>
    <div class="admin-action">
        <div class="admin-action__title">
            <h3>
                <b>Update your profile</b>
            </h3>
        </div>

        <div class="admin-action__content">
            <form @submit.prevent="submitForm">
                <div>
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" required v-model.trim="username">
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" required v-model.trim="email">
                </div>
                <div>
                    <label for="firstName">First Name</label>
                    <input type="text" name="firstName" id="firstName" required v-model.trim="firstName">
                </div>
                <div>
                    <label for="lastName">Last Name</label>
                    <input type="text" name="lastName" id="lastName" required v-model.trim="lastName">
                </div>

                <button type="submit" class="button is-primary">
                    <slot name="loader" v-if="isSubmitting">
                        <loader :size="'small'" :color="SMALL_LOADER_COLOR"/>
                    </slot>
                    
                    <slot v-else>Save</slot>
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { load as loadFromStore, get as getFromStore, save as saveToStore } from '@/localStorage';
import { showNotification } from '@/composables/outlets';
import Loader from '@/components/common/Loader.vue';
import { SMALL_LOADER_COLOR } from '@/constants/colors';

export default defineComponent ({
    components: {
        Loader
    },
    props: {
        user: {
            type: Object,
            required: true
        }
    },

    setup(props) {
        const store = useStore()

        const username = ref(props.user.username)
        const _username = ref(props.user.username)
        const email = ref(props.user.email)
        const firstName = ref(props.user.first_name)
        const lastName = ref(props.user.last_name)

        const isSubmitting = ref(false)

        const submitForm = async () => {
            isSubmitting.value = true

            let response = await store.dispatch("administrationManagement/updateOwnProfile", {
                username: username.value,
                email: email.value,
                first_name: firstName.value,
                last_name: lastName.value,
                _username: _username.value
            })

            if (response && response.status && response.status === 200) {
                showNotification({
                    props: {
                        type: "success",
                        duration: 5000,
                        message: `The user ${username.value} seccessfully updated`
                    }
                })
                updateUI(username.value)
                resetForm()
            }
            else if (response.response.status === 406) {
                showNotification({
                    props: {
                        type: "error",
                        duration: 5000,
                        message: `The user ${username.value} profile connot be 
                        updated. ${response.response.data.error}`
                    }
                })
            }

            isSubmitting.value = false
        }

        const updateUI = (username: string) => {
            loadFromStore("logged")
            const {is_admin, access_token, refresh_token, requiresReset, id} = getFromStore("logged")
            saveToStore("logged", {
                username: username,
                id: id,
                isAdmin: is_admin,
                access_token: access_token,
                refresh_token: refresh_token,
                requiresReset: requiresReset
            })
        }

        const resetForm = () => {
            username.value = ""
            email.value = ""
            firstName.value = ""
            lastName.value = ""
        }

        return {
            username,
            email,
            firstName,
            lastName,
            isSubmitting,
            SMALL_LOADER_COLOR,
            submitForm
        }
    },
})
</script>

<style lang="scss"></style>