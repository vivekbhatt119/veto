<template>
    <b-row>
        <b-col>
            <b-card no-body>
                <b-tabs pills card>
                    <b-tab title="Shipping" active>
                        <b-row>
                            <b-col md="8">
                                <b-row>
                                    <b-col>
                                        <h2>Shipping Address</h2>
                                        <hr />
                                        <address-list v-if="isLoggedIn" :addresses="addresses"
                                            @setShippingAddress="setShippingAddress" />
                                        <address-form v-if="!isLoggedIn" />
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col class="mt-5">
                                        <h2>Shipping Methods</h2>
                                        <hr />
                                        <shipping-methods :methods="shippingMethods" />
                                    </b-col>
                                </b-row>
                            </b-col>
                            <b-col md="4">
                                <order-summary :prices="cart.prices" />
                            </b-col>
                        </b-row>
                    </b-tab>
                    <b-tab title="Review & Payments">
                        <b-card-text>Payment
                            <pre>{{ checkoutCart }}</pre>
                        </b-card-text>
                    </b-tab>
                </b-tabs>
            </b-card>
            <pre>{{ selectedShippingAddress }}</pre>
        </b-col>
    </b-row>
</template>

<script>
import AddressForm from '../components/Checkout/AddressForm.vue';
import AddressList from '../components/Checkout/AddressList.vue';
import OrderSummary from '../components/Checkout/OrderSummary.vue';
import ShippingMethods from '../components/Checkout/ShippingMethods.vue';
import { Checkout } from '~/utils/checkout';

export default {
    layout: 'blank',
    components: { ShippingMethods, AddressList, AddressForm, OrderSummary },
    data() {
        return {
            addresses: [],
            checkoutUtils: null,
            checkoutCart: {
                available_payment_methods: []
            }
        }
    },
    computed: {
        cart() {
            return this.$store.state.registry.cart;
        },
        cartId() {
            return this.$store.state.registry.cartId;
        },
        customer() {
            return this.$store.state.registry.currentCustomer;
        },
        isEmpty() {
            return !(this.cart !== null &&
                this.cart.hasOwnProperty("itemsV2") &&
                this.cart.itemsV2.total_count)
        },
        isLoggedIn() {
            return this.customer !== null && this.customer.hasOwnProperty('firstname');
        },
        shippingMethods() {
            if (this.checkoutCart.shipping_addresses) {
                return this.checkoutCart.shipping_addresses[0].available_shipping_methods
            }
            return [];
        },
        selectedShippingAddress() {
            if (this.checkoutCart.shipping_addresses) {
                return this.checkoutCart.shipping_addresses[0]
            }
            return [];
        }
    },
    async created() {
        if (this.isEmpty) {
            this.$router.push({ name: 'cart', query: { redirect: '/cart' } });
        }
        const graphqlClient = this.$axios;
        const token = this.$store.state.registry.customerToken;
        this.checkoutUtils = new Checkout(graphqlClient, token);

        // Fetch cart data
        try {
            const response = await this.checkoutUtils.fetchCart(this.cartId);
            this.checkoutCart = response.data.data.cart;
        } catch (error) {
            console.error("Error fetching cart:", error);
        }

        if (!this.addresses.length && this.isLoggedIn) {
            this.addresses = this.customer.addresses;
        }
    },
    methods: {
        async setShippingAddress(address) {
            let shippingAddress = {};
            if (address.hasOwnProperty('id')) {
                shippingAddress.customer_address_id = address.id;
            } else {
                shippingAddress.address = address;
            }
            const response =  await this.checkoutUtils.setShippingAddress(
                this.cartId, { 'customer_address_id': address.id }
            );
            this.checkoutCart = response.data.data.setShippingAddressesOnCart.cart
        }
    }
}
</script>
