<template>
    <div class="default-layout">
        <aside>
            <header>
                <img class="logo" src="@/assets/logo.png">
                <h2>Reports</h2>
            </header>
            <nav>
                <section class="nav-section">
                    <div class="section-title">DASHBOARDS</div>
                    <section :class="{'is-toggled': toggledViews.includes('reporting')}">
                        <a href="#" @click.prevent="toggleViews('reporting')">
                            <Home_Icon class="nav_icon" :color="colorKey === 'reporting' ? activeColor : baseColor"/>
                            <span>Reporting</span>
                            <MenuToggle_Icon class="menuToggle"/>
                        </a>
                        <div class="subs">
                            <router-link :to="{name: 'orders'}" class="each">Orders</router-link>
                            <router-link :to="{name: 'products'}" class="each">Products</router-link>
                            <router-link :to="{name: 'suppliers'}" class="each">Suppliers</router-link>
                        </div>
                    </section>
                    <section :class="{'is-toggled': toggledViews.includes('relations')}">
                        <a href="#" @click.prevent="toggleViews('relations')">
                            <Customers_Icon class="nav_icon" :color="colorKey === 'relations' ? activeColor : baseColor"/>
                            <span>Relations</span>
                            <MenuToggle_Icon class="menuToggle"/>
                        </a>
                        <div class="subs">
                            <router-link :to="{name: 'customers'}" class="each">Customers</router-link>
                        </div>
                    </section>
                    <section :class="{'is-toggled': toggledViews.includes('administration')}">
                        <a href="#" @click.prevent="toggleViews('administration')">
                            <Config_Icon class="nav_icon" :color="colorKey === 'administration' ? activeColor : baseColor"/>
                            <span>Administration</span>
                            <MenuToggle_Icon class="menuToggle"/>
                        </a>
                        <div class="subs">
                            <router-link v-if="isAdmin" :to="{name: 'administration'}" class="each">Admin area</router-link>
                            <router-link :to="{name: 'user-settings'}" class="each">User settings</router-link>
                        </div>
                    </section>
                </section>
                <section class="nav-section bottom-nav">
                    <a @click.prevent="logout">
                        <Logout_Icon class="nav-icon"/>
                        <span>Logout {{ loggedUser[0].toUpperCase() + loggedUser.slice(1) }}</span>
                    </a>
                </section>
            </nav>
        </aside>

        <main class="body">
            <router-view :key="route.path"></router-view>
        </main>
    </div>
</template>


<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { get as getFromStore, remove as removeFromStore } from '@/localStorage';

// Icons
import Home_Icon from '@/assets/icons/Home_Icon.vue';
import Customers_Icon from '@/assets/icons/Customers_Icon.vue';
import MenuToggle_Icon from '@/assets/icons/MenuToggle_Icon.vue';
import Config_Icon from '@/assets/icons/Config_Icon.vue';
import Logout_Icon from '@/assets/icons/Logout_Icon.vue';

export default defineComponent ({
    components: {
        Home_Icon,
        Customers_Icon,
        MenuToggle_Icon,
        Config_Icon,
        Logout_Icon
    },

    setup() {
        const route = useRoute()
        const isAdmin = computed(() => getFromStore("logged.isAdmin"))
        const loggedUser = computed(() => getFromStore("logged.username") || "Not logged")
        const activeColor = ref('#0fadd4')
        const baseColor = ref('white')
        const colorKey = ref('')
        const toggledViews = ref(
            [router.currentRoute.value.meta.screen].filter(Boolean)
        )
        const toggleViews = (key: string) => {
            if (toggledViews.value[0] === key) {
                toggledViews.value = ['']
                colorKey.value = ''
            } else {
                toggledViews.value = [key]
                colorKey.value = key
            }
        }
        const logout = () => {
            removeFromStore("logged")
            router.push({ name: "dashboard" })
        }

        return {
            isAdmin,
            activeColor,
            baseColor,
            colorKey,
            route,
            toggledViews,
            loggedUser,
            logout,
            toggleViews
        }
    },
})
</script>


<style lang="">
    
</style>