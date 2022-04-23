<template>
    <div>
        <b-row>
            <b-col>
                <h2>{{ category.name }}</h2>
            </b-col>
        </b-row>
        <div class="row">
            <Item v-for="product in products.items" :key="product.sku" :product="product" />
            <template v-if="isLoading">
                <blank-item v-for="i in 10" :key="i"></blank-item>
            </template>
            <div class="col-sm-12 text-center" v-if="products.total_count == 0">
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
import Item from '../components/List/Item.vue';
import BlankItem from '../components/List/BlankItem.vue';
export default {
  components: { Item, BlankItem },
    middleware: ["category"],
    name: "Category",
    data() {
        return {
            products: {},
            isLoading: true,
            currentPage: 1,
            pageSize: 10,
        };
    },
    async created() {
       this.getProducts();
    },
    methods: {
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
                    query: `
                    {
                        products(
                            pageSize: ${this.pageSize},
                            currentPage: ${this.currentPage},
                            search: "",
                            filter: {
                                category_uid: {
                                    in: ["${this.category.uid}"]
                                },
                            },
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
        }
    },
};
</script>

<style>
</style>