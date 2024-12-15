<template>
    <b-row>
        <b-col :md="isEmpty ? 12 : 8">
            <b-card title="My Cart" no-body>
                <b-card-header>
                    <h3 class="mb-0 d-inline-block">My Cart</h3>
                    <!-- <b-button variant="danger" @click="$router.back()" class="float-right">X</b-button> -->
                </b-card-header>
                <b-card-body>
                    <b-card-text v-if="isEmpty">
                        <b-row>
                            <b-col class="text-center">
                                <p>There is no item in the cart.</p>
                            </b-col>
                        </b-row>
                    </b-card-text>
                    <b-card-text v-else>
                        <b-row>
                            <b-col>
                                <table class="table b-table table-striped table-hover" role="table">
                                    <tr>
                                        <td>
                                            <table class="table b-table table-borderless" role="table"
                                                v-for="item in cart.itemsV2.items" :key="item.uid">
                                                <configurable :item="item" @removeItem="removeItem"
                                                    v-if="isConfigurable(item)" />
                                                <simple :item="item" @removeItem="removeItem" v-else />
                                                <tr v-if="item.product.u_fit && item.product.arb_fit">
                                                    <td colspan="2">
                                                        <p> Difficulty: {{ item.fitting_difficulty }}</p>
                                                        <p>Fit myself</p>
                                                    </td>
                                                    <td class="text-right">
                                                        <b-button variant="outline-secondary">Change</b-button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="3">
                                                        <b-form-checkbox id="checkbox-1"
                                                            name="checkbox-1" value="1"
                                                            unchecked-value="0"
                                                            @change="switchConsent(item, $event)"
                                                            :checked="item.consent ? 1 : 0"
                                                        >
                                                            I accept the consent
                                                        </b-form-checkbox>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <qty-box :qty="item.quantity" :uid="item.uid"
                                                            @qty-change="updateItem" />
                                                    </td>
                                                    <td class="text-right" colspan="2">
                                                        <h5>
                                                            {{item.prices.price_including_tax.currency}}
                                                            {{item.prices.price_including_tax.value}}
                                                        </h5>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </b-col>
                        </b-row>
                        <!-- <b-row>
                            <b-col>
                                <pre> {{ cart }}</pre>
                            </b-col>
                        </b-row> -->
                    </b-card-text>
                </b-card-body>
                <b-card-footer v-if="!isEmpty">
                    <b-row>
                        <b-col md="6"></b-col>
                        <b-col md="6">
                            <nuxt-link to="/checkout" class="btn btn-lg btn-outline-primary btn-block">
                                <span>Proceed To Checkout</span>
                            </nuxt-link>
                        </b-col>
                    </b-row>
                </b-card-footer>
            </b-card>
        </b-col>
        <b-col v-if="!isEmpty" md="4">
            <b-card no-body>
                <b-card-header>
                    <h4>Price Details</h4>
                </b-card-header>
                <b-card-body>
                    <b-row>
                        <b-col>Price</b-col>
                        <b-col class="text-right">
                            {{cart.prices.subtotal_including_tax.currency}}
                            {{cart.prices.subtotal_including_tax.value}}
                        </b-col>
                    </b-row>
                    <template v-if="cart.prices.discounts">
                        <b-row v-for="discount in cart.prices.discounts" :key="discount.label">
                            <b-col>{{ discount.label }}</b-col>
                            <b-col class="text-right">
                                {{discount.amount.currency}}
                                {{discount.amount.value}}
                            </b-col>
                        </b-row>
                    </template>
                    <b-row>
                        <b-col>
                            <strong>Total Amount</strong>
                        </b-col>
                        <b-col class="text-right">
                            {{cart.prices.grand_total.currency}}
                            {{cart.prices.grand_total.value}}
                        </b-col>
                    </b-row>
                </b-card-body>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import Configurable from '../components/CartItems/Configurable.vue';
import Simple from '../components/CartItems/Simple.vue';
import QtyBox from '../components/ProductRenderer/QtyBox.vue';
import cartMethods from '~/mixins/cartHelper';

export default {
  mixins: [cartMethods],
  components: { Simple, Configurable, QtyBox },
    computed: {
        cart() {
            return this.$store.state.registry.cart;
        },
        cartId() {
            return this.$store.state.registry.cartId;
        },
        isEmpty() {
            return !(this.cart !== null &&
            this.cart.hasOwnProperty("itemsV2") && 
            this.cart.itemsV2.total_count)
        }
    },
    methods: {
        isConfigurable(item) {
            return item.hasOwnProperty('configurable_options');
        },
        async switchConsent(item, value) {
            this.updateItem(item.quantity, item.uid, Boolean(value));
        }
    }
}
</script>

<style>

</style>