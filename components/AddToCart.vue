<template>
    <div>
        <b-button @click="addProduct" squared variant="outline-primary" block :disabled="adding ? true : false">
            {{ adding ? 'Adding..' : 'Add To Cart'}}
        </b-button>
    </div>
</template>

<script>
import cartHelper from '~/mixins/cartHelper';

export default {
  mixins: [cartHelper],
    data() {
        return {
            adding: false,
        }
    },
    props: {
        product: {
            type: Object,
            required: true
        },
        selectedConfig: {
            type: Array,
            default() {
                return [];
            },
            required: false
        },
        qty: {
            type: Number,
            default: 1
        },
        forceStop: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        cart() {
            return this.$store.state.registry.cart;
        },
        cartId() {
            return this.$store.state.registry.cartId;
        }
    },
    methods: {
        async addProduct() {
            if (this.forceStop) {
                return;
            }
            if (this.product.hasOwnProperty('configurable_options') && !this.selectedConfig.length) {
                return this.$router.push('/p/' + this.product.sku + '/' + this.product.url_key + this.product.url_suffix);
            }
            this.adding = true;
            if (!this.cart && !this.cartId) {
                await this.createGuestCart();
            }
            // add product to cart

            let input = [
                    {
                        "sku": this.product.sku,
                        "quantity": ""+this.qty
                    }
                ];
            if (this.selectedConfig.length) {
                input[0]['selected_options'] = '["' + this.selectedConfig.join('","') + '"]';
            }
            this.addItem(input, this.product.name);
            this.adding = false;
        }
    }
}
</script>

<style>

</style>