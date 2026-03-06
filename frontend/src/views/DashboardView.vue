<template>
    <div class="default-layout">
        <aside>
            <header class="logo">
                <img :style="{height: '40%', width:'30%'}" src="@/assets/logo.png">
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
                </section>
            </nav>
        </aside>

        <main class="body">
            <router-view :key="route.path"></router-view>
        </main>
    </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';

// Icons
import Home_Icon from '@/assets/icons/Home_Icon.vue';
import Customers_Icon from '@/assets/icons/Customers_Icon.vue';
import MenuToggle_Icon from '@/assets/icons/MenuToggle_Icon.vue';

export default defineComponent ({
    components: {
        Home_Icon,
        Customers_Icon,
        MenuToggle_Icon
    },

    setup() {
        const route = useRoute()
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

        return {
            activeColor,
            baseColor,
            colorKey,
            route,
            toggledViews,
            toggleViews
        }
    },
})
</script>


<style lang="">
    
</style>