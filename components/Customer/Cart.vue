<template>
    <b-nav-item-dropdown :html="'<span> Cart </span> <span class=\'badge badge-primary\'>' + total_quantity + '</span>'"
        right>
        <b-dropdown-text>
            <b-row v-if="total_quantity">
                <b-col>
                    <table class="table b-table" role="table" v-for="item in cart.itemsV2.items" :key="item.uid">
                        <configurable :item="item" @removeItem="removeItem" v-if="isConfigurable(item)" />
                        <simple :item="item" @removeItem="removeItem" v-else />
                        <tr>
                            <td colspan="2"><qty-box :qty="item.quantity" :uid="item.uid" @qty-change="updateItem" />
                            </td>
                            <td class="text-right">
                                {{ item.prices.price.currency }}
                                {{ item.prices.price.value }}
                            </td>
                        </tr>
                    </table>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col>
                    <p>You have no items in your shopping cart.</p>
                </b-col>
            </b-row>
            <div class="row" v-if="total_quantity">
                <div class="col-sm-10 offset-1">
                    <b-button block variant="primary" @click="goToCart">Go To Cart</b-button>
                </div>
            </div>
        </b-dropdown-text>
    </b-nav-item-dropdown>
</template>

<script>
import Configurable from '../CartItems/Configurable.vue';
import Simple from '../CartItems/Simple.vue';
import QtyBox from '../ProductRenderer/QtyBox.vue';
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
        total_quantity() {
            return this.cart && this.cart.hasOwnProperty('total_quantity') ? this.cart.total_quantity : '';
        }
    },
    methods: {
        isConfigurable(item) {
            return item.hasOwnProperty('configurable_options');
        },
        goToCart() {
            // todo: close dropdown
            // this.$refs.dropdown.hide(true);
            this.$router.push('/cart');
        }
    }
}
</script>

<style></style>