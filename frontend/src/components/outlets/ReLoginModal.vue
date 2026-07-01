<template>
    <div class="overlay">
        <div class="relogin">
            <h3 class="title">Your Session Has Expired</h3>
            <div class="message">Please Enter Your Password To Continue Working.</div>
            <div>
                <input type="password" class="input" ref="passwordRef"
                placeholder="Enter Password" v-model="password">
            </div>
            <div class="ticking">
                <div>
                    <small>
                        You Will Be Signed Out In <strong>{{ secondsLeft }}</strong>
                    </small>
                </div>
                <div>
                    <button @click="submit" :disabled="!password">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { authenticate } from '@/api/admin/users';
import { hideOutlet } from '@/composables/outlets';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { save as saveToStore } from '@/localStorage';

export default defineComponent ({
    props: {
        id: {
            type: String,
            required: true
        },
        loginInfo: {
            type: Object,
            required: true
        },
        onSuccess: {
            type: Function,
            required: true
        },
        onTimeout: {
            type: Function,
            required: true
        },
        onError: {
            type: Function,
            required: true
        },
    },

    setup(props) {
        const secondsLeft = ref(30)
        const password = ref("")
        const passwordRef = ref<Partial<HTMLInputElement>>("passwordRef")
            
        const countDown = () => {
            secondsLeft.value === 0 ? timeout() : secondsLeft.value--
        }
        
        const intervalId = setInterval(countDown, 1000)
            
        const timeout = () => {
            hideOutlet(props.id)
            props.onTimeout()
        }

        const submit = async () => {
            const {username} = props.loginInfo

            const response = await authenticate({
                username,
                password: password.value
            })

            if (response !== undefined && response.status === 401) {
                await props.onError(`Error: ${response.data.detail}`)
            }
            else if (response !== undefined && response.status === 200) {
                await saveToStore("logged", {
                    id: response.data.id,
                    username: response.data.username,
                    isAdmin: response.data.is_admin,
                    accessToken: response.data.access,
                    requiresReset: response.data.requires_reset,
                    refresh_token: response.data.refresh_token
                })
                await props.onSuccess()
                clearInterval(intervalId)
                hideOutlet(props.id)
            }
        }

        onMounted(() => {
            passwordRef.value && passwordRef.value.focus!()
        })

        onUnmounted(() => {
            clearInterval(intervalId)
        })

        return {
            secondsLeft,
            password,
            passwordRef,
            submit
        }
    },
})
</script>

<style lang="scss" scoped>
@import "@/styles/components/_outlets.scss";
</style>