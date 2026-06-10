<template>
    <div class="admin-action">
        <div class="admin-action__title">
            <h3><b>New user</b></h3>
        </div>

        <div class="admin-action__content">
            <form>
                <div>
                    <label for="username">Username</label>
                    <input type="text" name="username" required>
                </div>
                <div>
                    <label for="firstName">First name</label>
                    <input type="text" name="firstName" required>
                </div>
                <div>
                    <label for="lastName">Last name</label>
                    <input type="text" name="lastName" required>
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" name="email" required>
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" name="password" required>
                </div>
                <div>
                    <label for="isAdmin">Is Admin</label>
                    <select name="isAdmin" id="" required>
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
import { defineComponent } from 'vue';

export default defineComponent ({
    components: {},

    setup() {

        return {}
    },
})
</script>

<style lang="scss" scoped>
@import "@/styles/components/_administration.scss"
</style>