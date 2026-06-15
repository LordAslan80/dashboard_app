<template>
    <div class="body">
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Last Login</th>
                    <th>Is Admin</th>
                    <th>Is Active</th>
                    <th>Required Password Change</th>
                    <th>Password Changed Date</th>
                    <th>Blocked</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in users" :key="index">
                    <td>{{ item.username }}</td>
                    <td>{{ item.first_name }}</td>
                    <td>{{ item.last_name }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ formatDate(item.last_login) }}</td>
                    <td>{{ item.is_staff ? "Yes" : "No" }}</td>
                    <td>{{ item.is_active ? "Yes" : "No" }}</td>
                    <td>{{ item.required_password_change ? "Yes" : "No" }}</td>
                    <td>{{ formatDate(item.password_change_date) }}</td>
                    <td>{{ item.is_blocked ? "Yes" : "No" }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import formatDate from '@/composables/util';

export default defineComponent({
    setup() {
        const store = useStore()

        const users = computed(() => {
            let data = store.getters["administrationManagement/getUsers"]
            if (!data) return
            return data
        })

        return {
            users,
            formatDate
        }
    }
})
</script>

<style lang="scss" scoped></style>