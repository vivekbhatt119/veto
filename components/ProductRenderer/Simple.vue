<template>
<b-row>
    <b-col md="6">
        <image-gallery :product="simpleProduct"/>
    </b-col>
    <b-col class="p-5" md="6">
        <b-row>
            <b-col>
                <h2>{{product.name}}</h2>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <price :product="simpleProduct" />
            </b-col>
            <b-col class="text-right">
                <b-row>
                    <b-col>
                        <strong>{{ simpleProduct.stock_status }}</strong>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <p>SKU#: {{product.sku}}</p>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-if="isConfigurable">
            <b-col>
                <configuration :product="product" @config-change="configChange"/>
            </b-col>
        </b-row>
        <b-row class="mt-5">
            <b-col lg="4" cols="6">
                <qty-box :qty="qty" @qty-change="updateQty"/>
            </b-col>
            <b-col lg="8">
                <add-to-cart :qty="qty" :product="product" :selectedConfig="selectedConfig" :forceStop="forceStop"/>
            </b-col>
        </b-row>
    </b-col>
</b-row>
</template>

<script>
import Price from './Price.vue'
import ImageGallery from './ImageGallery.vue'
import Configuration from './Configuration.vue'
import QtyBox from './QtyBox.vue'
import AddToCart from '../AddToCart.vue'
export default {
  components: { Price, ImageGallery, Configuration, QtyBox, AddToCart },
    data() {
        return {
            variant: {},
            qty: 1,
            selectedConfig: []
        }
    },
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    computed: {
        forceStop() {
            if (this.isConfigurable) {
                return !(this.product.configurable_options.length == this.selectedConfig.length);
            }
            return false;
        },
        isConfigurable() {
            return this.product.hasOwnProperty("configurable_options");
        },
        simpleProduct() {
            if (this.variant.hasOwnProperty('product')) {
                return this.variant.product;
            }
            return this.product;
        }
    },
    methods: {
        configChange(data) {
            this.selectedConfig = Object.values(data);
            this.product.variants.forEach(element => {
                let total = 0
                let selected = 0;
                element.attributes.forEach(attribute => {
                    if (data.hasOwnProperty(attribute.code)) {
                        total++;
                        if (data[attribute.code] == attribute.uid) {
                            selected++;
                        }
                    }
                });
                if (selected == total) {
                    this.variant = JSON.parse(JSON.stringify(element));
                    this.loading = false;
                    return false;
                }
            });
        },
        updateQty(qty) {
            this.qty = qty
        }
    },
}
</script>
<style>
.carousel-control-prev-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath d='M5.25 0l-4 4 4 4 1.5-1.5L4.25 4l2.5-2.5L5.25 0z'/%3e%3c/svg%3e") !important;
}
.carousel-control-next-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath d='M2.75 0l-1.5 1.5L3.75 4l-2.5 2.5L2.75 8l4-4-4-4z'/%3e%3c/svg%3e") !important;
}
</style>