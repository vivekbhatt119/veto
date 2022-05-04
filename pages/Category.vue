<template>
    <div>
        <b-row>
            <b-col>
                <h2>{{ category.name }}</h2>
            </b-col>
        </b-row>
        <b-row>
            <b-col v-if="products.hasOwnProperty('aggregations')">
                <b-navbar toggleable="lg" type="dark" variant="info">
                    <b-navbar-brand href="#">Filter</b-navbar-brand>

                    <b-navbar-toggle target="filter-collapse"></b-navbar-toggle>

                    <b-collapse id="filter-collapse" is-nav>
                        <b-navbar-nav v-if="category.children_count != 0">
                            <b-nav-item
                                v-for="child in category.children"
                                :to="'/c/' + child.url_path + child.url_suffix"
                                :key="child.uid"
                                >
                                {{ child.name }}
                            </b-nav-item>
                        </b-navbar-nav>

                        <!-- Right aligned nav items -->
                        <b-navbar-nav class="ml-auto">
                            <b-nav-form v-if="aggregations.length">
                                <b-button size="sm" variant="dark" v-b-modal.my-modal>More</b-button>
                            </b-nav-form>
                        </b-navbar-nav>
                    </b-collapse>
                </b-navbar>
                
                <b-modal size="xl" id="my-modal" hide-footer scrollable title="Filter" v-if="aggregations.length">
                    <filter-renderer
                        :aggregations="aggregations"
                        :eqFilter="eqFilter"
                        :inFilter="inFilter"
                        :rangeFilter="rangeFilter"
                        @apply-filter="applyFilter" />
                </b-modal>
            </b-col>
        </b-row>
        <div class="row mt-2">
            <Item v-for="product in products.items" :key="product.sku" :product="product" />
            <template v-if="isLoading">
                <blank-item v-for="i in 10" :key="i"></blank-item>
            </template>
            <div class="col-sm-12 text-center" v-if="products.total_count == 0 && !isLoading">
                No products found
            </div>
        </div>
        <b-row v-if="products.total_count > 0">
            <b-col>
                <b-pagination
                v-model="currentPage"
                :total-rows="products.total_count"
                :per-page="pageSize"
                first-text="First"
                prev-text="Prev"
                next-text="Next"
                last-text="Last"
                ></b-pagination>
            </b-col>
        </b-row>
    </div>
</template>

<script>
let globalEq = {};
let globalIn = {};
let globalRange = {};
import Item from '../components/List/Item.vue';
import BlankItem from '../components/List/BlankItem.vue';
import FilterRenderer from '../components/List/FilterRenderer.vue';
export default {
  components: { Item, BlankItem, FilterRenderer },
    middleware: ["category"],
    name: "Category",
    data() {
        return {
            products: {},
            isLoading: true,
            currentPage: 1,
            pageSize: 10,
            filter: {
                "category_uid": {
                    "in": [this.$store.state.registry.currentCategory.uid]
                }
            },
            eqFilter: globalEq,
            inFilter: globalIn,
            rangeFilter: globalRange,
        };
    },
    async created() {
        globalEq = {};
        globalIn = {};
        globalRange = {};
        this.getProducts();
    },
    methods: {
        applyFilter(filter) {
            if (filter.hasOwnProperty('category_uid')) {
                filter.category_uid.in.push(this.$store.state.registry.currentCategory.uid);
            } else {
                filter.category_uid = {"in": [this.$store.state.registry.currentCategory.uid]};
            }
            this.filter = filter;
        },
        async getProducts() {
            this.products = {
                total_count: 0,
                page_info: {
                    page_size: 10,
                    current_page: 1,
                    total_pages: 1,
                },
                items: []
            };
            this.isLoading = true;
            const products = await this.$axios({
                method: "post",
                url: this.$axios.defaults.baseURL,
                data: {
                    query: `query($filter: ProductAttributeFilterInput!, $pageSize: Int!, $currentPage: Int!)
                    {
                        products(
                            pageSize: $pageSize,
                            currentPage: $currentPage,
                            search: "",
                            filter: $filter,
                            sort: {},
                        ) {
                            aggregations {
                                    label
                                    attribute_code
                                    count
                                    options {
                                        label
                                        value
                                        count
                                    }
                                }
                                total_count
                                items {
                                    ... on ConfigurableProduct {
                                        configurable_options {
                                            attribute_code
                                            label
                                            values {
                                                uid
                                                label
                                                swatch_data {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                    name
                                    sku
                                    url_key
                                    url_suffix
                                    thumbnail {
                                        url
                                        label
                                    }
                                    price_range {
                                        minimum_price {
                                            final_price {
                                                value
                                                currency
                                            }
                                            regular_price {
                                                value
                                                currency
                                            }
                                        }
                                    }
                                }
                                page_info {
                                    page_size
                                    current_page
                                    total_pages
                                }
                            }
                        }
                    `,
                    variables: {
                        "filter": this.filter,
                        "pageSize": this.pageSize,
                        "currentPage": this.currentPage
                    }
                },
            });
            this.products = products.data.data.products;
            this.isLoading = false;
        }
    },
    computed: {
        category() {
            return this.$store.state.registry.currentCategory;
        },
        aggregations() {
            if (this.products.hasOwnProperty('aggregations')) {
                return this.products.aggregations.filter(x=>(x.attribute_code != 'category_id'))
            }
        }
    },
    head() {
        return {
            title: this.category.name,
            meta: [
                {
                    name: this.category.meta_title,
                    content: this.category.meta_description,
                },
            ],
        };
    },
    watch: {
        currentPage() {
            window.scrollTo(0,0);
            this.getProducts()
        },
        filter() {
            window.scrollTo(0,0);
            this.getProducts()
        }
    },
};
</script>

<style>
</style>