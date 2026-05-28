<template>
    <div class="login">
        <form @submit.prevent="login" autocomplete="off">
            <p class="login-title">Login</p>
            <div class="input">
                <label for="login_username">Username</label>
                <input type="text" placeholder="Username"/>
            </div>
            <div class="input">
                <label for="login_password">Password</label>
                <input type="password" placeholder="Password"/>
            </div>
            <button class="button is-primary">Login</button>
        </form>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { authenticate } from '@/api/admin/users';
import { ILoginCredentials } from '@/models/ILoginCredentials';
import { save as saveToStore } from '@/localStorage';

export default defineComponent ({
    components: {
    },

    setup() {
        const login = async () => {
            const body: ILoginCredentials = {
                username: "admin",
                password: "1234"
            }

            let response = await authenticate(body)

            if (response !== undefined && response.status === 401) {
                console.warn("error logging", response)
            } else if (response !== undefined && response.status === 200) {
                console.info("login seccessfull", response.data)
                saveToStore("logged", {
                    username: response.data.username,
                    isAdmin: response.data.is_admin,
                    accessToken: response.data.access_token,
                    requiresReset: response.data.requires_reset
                })
            }
        }

        return {
            login
        }
    },
})
</script>


<style lang="scss">
    .login {
        background-image: url("../../assets/login_background.jpg");
        background-size: cover;
        height: 100vh;
        width: 100%;
        overflow-y: scroll;
        display: flex;
        align-items: center;

        @include flex-v;
        min-height: 100vh;
        justify-content: center;
        align-items: center;

        >form {
            margin: 0 10%;
            padding: 30px 60px 80px;
            min-width: 480px;
            max-width: 480px;
            background-color: transparent;
            border: 1px solid #fff;
            border-radius: 20px;

            .login-title {
                margin: 10px auto 20px;
                color: #fff;
                font-size: 26px;
                font-weight: bold;
            }

            .input {
                @include flex-v;

                >label {
                    margin-bottom: 8px;
                    font-size: 22px;
                    color: #fff;
                }

                >input {
                    border-radius: 8px;
                    max-width: 440px;
                    border: 1px solid #ffff;
                    color: gray;
                    width: 100%;
                    padding: 16px;
                }
            }
            
            @include flex-v;
            
            @include not-last-child {
                margin-bottom: 24px
            }

            >.button {
                padding: 16px 24px;
                border-radius: 8px;
            }
        }
    }
</style>