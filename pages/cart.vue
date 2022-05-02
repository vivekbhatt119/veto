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
                        <b-col><p>There is no item in the cart.</p></b-col>
                    </b-row>
                </b-card-text>
                <b-card-text v-else>
                    <b-row>
                        <b-col>
                            <table class="table b-table" role="table">
                                <tr v-for="item in cart.items" :key="item.uid" >
                                    <configurable :item="item" v-if="isConfigurable(item)"/>
                                    <simple :item="item" v-else/>
                                    <td>
                                        <qty-box :qty="item.quantity" :uid="item.uid" @qty-change="updateItem" />
                                    </td>
                                    <td>
                                        {{item.prices.price.currency}}
                                        {{item.prices.price.value}}
                                    </td>
                                    <td>
                                        <b-button @click="removeItem(item.uid)" variant="outline-danger" size="sm">X</b-button>
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
            <b-card-footer>
                <b-row>
                    <b-col md="6"></b-col>
                    <b-col md="6">
                        <b-button size="lg" squared variant="outline-primary" block>Place Order</b-button>
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
import payload from '../payload';
export default {
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
            this.cart.hasOwnProperty("items") && 
            this.cart.items.length)
        }
    },
    methods: {
        isConfigurable(item) {
            return item.hasOwnProperty('configurable_options');
        },
        async removeItem(key) {
            if (!confirm("Are you sure?")) {
                return;
            }
            this.$store.commit("loadingStart");
            await this.$axios({
                method: 'post',
                url: this.$axios.defaults.baseURL,
                data: {
                    query: `
                        mutation {
                            removeItemFromCart(
                                input: {
                                    cart_id: "${this.cartId}",
                                    cart_item_uid: "${key}"
                                }
                            )
                            {
                                cart {
                                    ${payload.commonCart()}
                                }
                            }
                        }
                    `
                },
                headers: {
                    Authorization: `Bearer ${this.$store.state.registry.customerToken}`,
                }
            }).then((res) => {
                if (res.data.hasOwnProperty('errors')) {
                    if(this.cartId && !this.cart) {
                        this.getCart();
                    }
                    this.$store.commit("addErrorMessage", res.data.errors[0]['message']);
                    return;
                }
                this.$store.commit("setCart", res.data.data.removeItemFromCart.cart);
            })
            .catch(err => {
                if(this.cartId && !this.cart) {
                    this.getCart();
                }
                this.$store.commit("addErrorMessage", err.message);
            }).finally(() => {
                this.$store.commit("loadingStop");
            });
        },
        async updateItem(qty, uid) {
            this.$store.commit("loadingStart");
            await this.$axios({
                method: 'post',
                url: this.$axios.defaults.baseURL,
                data: {
                    query: `
                        mutation {
                            updateCartItems(
                                input: {
                                    cart_id: "${this.cartId}",
                                    cart_items: [
                                        {
                                            cart_item_uid: "${uid}"
                                            quantity: ${qty}
                                        }
                                    ]
                                }
                            )
                            {
                                cart {
                                    ${payload.commonCart()}
                                }
                            }
                        }
                    `
                },
                headers: {
                    Authorization: `Bearer ${this.$store.state.registry.customerToken}`,
                }
            }).then((res) => {
                if (res.data.hasOwnProperty('errors')) {
                    if(this.cartId && !this.cart) {
                        this.getCart();
                    }
                    this.$store.commit("addErrorMessage", res.data.errors[0]['message']);
                    return;
                }
                this.$store.commit("setCart", res.data.data.updateCartItems.cart);
            })
            .catch(err => {
                if(this.cartId && !this.cart) {
                    this.getCart();
                }
                this.$store.commit("addErrorMessage", err.message);
            }).finally(() => {
                this.$store.commit("loadingStop");
            });
        }
    }
}
</script>

<style>

</style>