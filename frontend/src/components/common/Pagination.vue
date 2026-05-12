<template>
    <div class="pagination">
        <div class="container">
            <div class="triple row">
                <div>
                    <span v-if="count > 0">
                        Showing {{ (currentPage - 1) * perPage + 1 }}
                        to {{ currentPage * perPage < count ? currentPage * perPage : count }}
                        out of {{ count }}
                    </span>
                    <span v-else>No results</span>
                </div>

                <div>
                    <span v-if="currentPage - 1 > 0" @click="updatePage(1), calculateDistances('first')"
                        class="pageList">First</span>
                    <span v-for="(i) in leftDistance" :key="i" class="pageList"
                        @click="updatePage(currentPage - (leftDistance - (i - 1))), calculateDistances('left')">
                        {{ currentPage - (leftDistance - (i - 1)) }}
                    </span>
                    <span class="currentPage selectedPage">Page {{ currentPage }}</span>
                    <span v-for="i in rightDistance" :key="i" class="pageList"
                        @click="updatePage(currentPage + i), calculateDistances('right')">{{ i }}</span>
                    <span v-if="currentPage != numberOfPages" class="pageList"
                        @click="updatePage(numberOfPages), calculateDistances('last')">Last</span>
                </div>

                <div>
                    <span class="tiny">Items per page</span>
                    <select v-model="perPage" @change="updateTableSize" :disabled="!perPageEnable">
                        <option :value="5">5</option>
                        <option :value="10">10</option>
                        <option :value="15">15</option>
                        <option :value="30">30</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUpdated, ref, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
        numberOfPages: {
            type: Number,
            required: true
        },
        perPage: {
            type: Number,
            required: true
        }
    },
    emits: ["update-page", "update-table-size"],
    setup(props, {emit}) {
        const store = useStore()

        const numberOfPages = ref(props.numberOfPages)
        const count = ref(props.count)
        const leftDistance = ref(0)
        const rightDistance = ref(numberOfPages.value - 2)
        const perPage = ref(props.perPage)
        const perPageEnable = ref(true)

        let currentPage = computed(() => {
            return props.currentPage
        })

        const updatedNumberOfPages = computed(() => {
            let data = store.getters["orderManagement/getNumberOfPages"]
            return data
        })

        const updatedCount = computed(() => {
            let data = store.getters["orderManagement/getCount"]
            return data
        })

        const calculateDistances = (position: string) => {
            let current = Number(currentPage)

            if(numberOfPages.value === current){
                rightDistance.value = 0
                leftDistance.value = numberOfPages.value - 2
            } else {
                rightDistance.value = (numberOfPages.value -1) - current

                if(position === "right") leftDistance.value = current - 2
                else if(position === "left") leftDistance.value = current - 2
                else if(position === "first") leftDistance.value = 0
            }
        }

        const updatePage = (page: any) => {
            if(page <= 0 || page > numberOfPages.value) return
            emit("update-page", page)
            currentPage = page
        }

        const updateTableSize = async () => {
            if(count.value < perPage.value) alert("Not a permited operation")
            else {
                numberOfPages.value = Math.ceil(count.value / perPage.value)
                leftDistance.value = 0
                rightDistance.value = numberOfPages.value - 2

                await store.dispatch("orderManagement/setNumberOfPages", count.value)
                emit("update-table-size", perPage)
                updatePage(1)
            }
        }

        watch(() => [numberOfPages.value, perPage.value, count.value],
            () => {
                rightDistance.value = numberOfPages.value === 1 ? (numberOfPages.value - 1) : (numberOfPages.value - 2)
                leftDistance.value = 0

                if(perPage.value >= count.value) perPageEnable.value = false
                else perPageEnable.value = true
            }
        )

        onUpdated(() => {
            numberOfPages.value = updatedNumberOfPages.value
            count.value = updatedCount.value
        })

        return {
            numberOfPages,
            count,
            leftDistance,
            rightDistance,
            perPage,
            perPageEnable,
            currentPage,
            calculateDistances,
            updatePage,
            updateTableSize
        }
    }
})
</script>

<style lang="scss" scoped>
.pagination {
    .container {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-gap: 24px;

        .triple {
            grid-column: span 3;
        }

        .row {
            margin: 40px 50px 0 30px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-family: "TBM Plex Sans", sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 16px;
            color: $color-brand-2;

            select {
                margin-top: -10px;
                margin-left: 10px;
                padding: 10px;
            }

            .pageList, .currentPage {
                border: 1px solid $color-brand-2;
                padding: 5px 10px;
                user-select: none;
            }

            .pageList {
                cursor: pointer;
            }

            .selectedPage {
                opacity: 1;
                pointer-events: none;
                background-color: $color-1;
                color: $color-white;
            }

            .tiny {
                font-size: 12px;
            }
        }
    }
}
</style>