<template>
    <div class="pagination">
        <div class="container">
            <div class="triple row">
                <div>
                    <span v-if="true">Showing 00 to 10 out of 100</span>
                    <span v-else>No results</span>
                </div>

                <div>
                    <span class="pageList">First</span>
                    <span>- Left distance -</span>
                    <span class="currentPage selectedPage">Page current</span>
                    <span v-for="i in 5" :key="i" class="pageList">{{ i }}</span>
                    <span class="pageList">Last</span>
                </div>

                <div>
                    <span class="tiny">Items per page</span>
                    <select>
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
import { defineComponent } from 'vue';

export default defineComponent({
    components: {},
    props: {},
    emits: [],
    setup(props, context) {
        return {}
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