<template>
    <div class="catalog-product-view">
        <simple :product="product"/>
        <pre>{{ product }} </pre>
    </div>
</template>

<script>
import Simple from '../components/ProductRenderer/Simple.vue';
export default {
  components: { Simple },
    middleware: ["product"],
    name: "Product",
    computed: {
        product() {
            return this.$store.state.registry.currentProduct;
        },
    },
    head() {
        return {
            title: this.product.name,
            meta: [
                {
                    name: this.product.meta_title,
                    content: this.product.meta_description,
                },
            ],
        };
  },
};
</script>

<style>
.catalog-product-view .price-to-show {
    font-size: 2em;
}
.catalog-product-view .configurable .as-low-as::after {
    white-space: pre;
    content: "\A";
}
</style>
