<template>
    <b-row v-if="customer">
        <b-col>
            <b-row>
                <b-col>
                    <h1 class="mb-4">My Account</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <h5>Account Information</h5>
                    <hr/>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="6">
                    <p><strong>Contact Information</strong></p>
                    <p class="mb-0"> {{ name }} </p>
                    <p> {{ customer.email }} </p>
                </b-col>
                <b-col sm="6">
                    <p><strong>Newsletters</strong></p>
                    <p v-if="customer.is_subscribed"> You aren't subscribed to our newsletter. </p>
                    <p v-else> You are subscribed to "General Subscription". </p>
                </b-col>
            </b-row>
            <b-row class="mt-2">
                <b-col>
                    <h5>Address Book 
                        <small>
                            <nuxt-link to="/my-account/address">Manage Addresses</nuxt-link>
                        </small>
                    </h5>
                    <hr/>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="6">
                    <p><strong>Default Billing Address</strong></p>
                    <address-renderer v-if="billingAddress" :address="billingAddress"/>
                    <p v-else> You have not set a default billing address. </p>
                </b-col>
                <b-col sm="6">
                    <p><strong>Default Shipping Address</strong></p>
                    <address-renderer v-if="shippingAddress" :address="shippingAddress"/>
                    <p v-else> You have not set a default shipping address. </p>
                </b-col>
            </b-row>

            <b-row class="mt-2">
                <b-col>
                    <h5>Last Order</h5>
                    <hr/>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col" class="id">Order #</th>
                                <th scope="col" class="date">Date</th>
                                <th scope="col" class="shipping">Ship To</th>
                                <th scope="col" class="total">Order Total</th>
                                <th scope="col" class="status">Status</th>
                                <th scope="col" class="actions">Action</th>
                            </tr>
                        </thead>
                    </table>
                    </div>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
import AddressRenderer from './AddressRenderer.vue';
export default {
  components: { AddressRenderer },
    computed: {
        customer() {
            return this.$store.state.registry.currentCustomer;
        },
        name() {
            if (this.customer !== null && this.customer.hasOwnProperty('firstname') && this.customer.hasOwnProperty('lastname')) {
                return this.customer.firstname + " " + this.customer.lastname
            }
            return null;
        },
        shippingAddress() {
            if (this.customer !== null && this.customer.addresses.length) {
                return this.customer.addresses.filter(function(address){
                    return address.default_shipping == true
                })[0];
            }
            return null;
        },
        billingAddress() {
            if (this.customer !== null && this.customer.addresses.length) {
                return this.customer.addresses.filter(function(address){
                    return address.default_billing == true
                })[0];
            }
            return null;
        },
    },
}
</script>

<style>

</style>