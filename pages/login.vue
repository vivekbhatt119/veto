<template>
    <b-container>
        <b-row>
            <b-col>
                <h1>Customer Login</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="6">
                <b-row>
                    <b-col>
                        <h5>Registered Customers</h5>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col><p>If you have an account, sign in with your email address.</p>
                        <b-form @submit.prevent="loginCustomer" v-if="show">
                            <b-form-group
                                id="email-group"
                                label="Email address:"
                                label-for="email"
                            >
                                <b-form-input
                                    id="email"
                                    v-model="username"
                                    type="email"
                                    placeholder="Enter email"
                                    required
                                ></b-form-input>
                            </b-form-group>
                            <b-form-group
                                id="password-group"
                                label="Password:"
                                label-for="password"
                            >
                                <b-form-input
                                    id="password"
                                    v-model="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                ></b-form-input>
                            </b-form-group>
                            <b-button type="submit" variant="primary">Login</b-button>
                        </b-form>
                    </b-col>
                </b-row>
          </b-col>
          <b-col sm="6"> <pre>{{customer}}</pre></b-col>
      </b-row>
  </b-container>
</template>

<script>
import payload from '../payload';
export default {
    data() {
        return {
            show: true,
            username: null,
            password: null
        }
    },
    computed: {
        customer() {
            return this.$store.state.registry.currentCustomer;
        },
        cart() {
            return this.$store.state.registry.cart;
        },
        cartId() {
            return this.$store.state.registry.cartId;
        }
    },
    created() {
        if (!(null === this.customer)) {
            this.$router.push({ name: 'home', query: { redirect: '/' } });
        }
    },
    methods: {
        async loginCustomer() {
            if(!(this.username && this.password)) {
                return null;
            }
            this.$store.commit("loadingStart");
            await this.$axios({
                method: "post",
                url: this.$axios.defaults.baseURL,
                data: {
                    query: `
                        mutation {
                            generateCustomerToken(
                                email: "${this.username}"
                                password: "${this.password}"
                            ) {
                                token 
                            }
                        }
                    `
                }
            }).then((res) => {
                if (res.data.hasOwnProperty('errors')) {
                    alert (res.data.errors[0]['message']);
                    return;
                }
                const token = res.data.data.generateCustomerToken.token;
                this.$store.commit("setCustomerToken", token);
                this.getCustomer(token);
            })
            .catch(err => {
                this.$store.commit("addErrorMessage", err.message);
            }).finally(() => {
                this.$store.commit("loadingStop");
            });
            return;
        },
        async getCustomer(token) {
            this.$store.commit("loadingStart");
            const customer = await this.$axios({
                method: "post",
                url: this.$axios.defaults.baseURL,
                data: {
                    query: `
                        {
                            customer {
                                firstname
                                lastname
                                suffix
                                email
                                addresses {
                                    firstname
                                    lastname
                                    street
                                    city
                                    region {
                                        region_code
                                        region
                                    }
                                    postcode
                                    country_code
                                    telephone
                                }
                            }
                        }
                    `
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .catch(err => {
                console.log(err.message);
                return;
            }).finally(() => {
                this.$store.commit("loadingStop");
            });

            this.$store.commit("setCurrentCustomer", customer.data.data.customer);
            this.getCustomerCart();
            this.$router.push({ name: 'home', query: { redirect: '/' } });
        },
        async getCustomerCart() {
            this.$store.commit("loadingStart");
            await this.$axios({
                method: 'post',
                url: this.$axios.defaults.baseURL,
                data: {
                    query: payload.customerCart()
                },
                headers: {
                    Authorization: `Bearer ${this.$store.state.registry.customerToken}`,
                },
            }).then((res) => {
                if (res.data.hasOwnProperty('errors')) {
                    this.$store.commit("addErrorMessage", res.data.errors[0]['message']);
                    return;
                }
                // if guest cart available
                if (this.cart || this.cartId) {
                    if (!this.cart) {
                        // load cart with this.cartId
                    }
                    // if items.length then merge guest cart with customerCart
                    if (this.cart.items.length) {
                        this.mergeCart(res.data.data.customerCart.id);
                    }
                }
                if (!this.cartId) {
                    this.$store.commit("setCart", res.data.data.customerCart);
                    this.$store.commit("setCartId", res.data.data.customerCart.id);
                }
            })
            .catch(err => {
                this.$store.commit("addErrorMessage", err.message);
            }).finally(() => {
                this.$store.commit("loadingStop");
            });
            return null;
        },
        async mergeCart(destinationCartId) {
            this.$store.commit("loadingStart");
            await this.$axios({
                method: 'post',
                url: this.$axios.defaults.baseURL,
                data: {
                    query: `
                    mutation {
                        mergeCarts(
                            source_cart_id: "${this.cartId}",
                            destination_cart_id: "${destinationCartId}"
                        ) {
                            ${payload.commonCart()}
                        }
                    }
                    `
                },
                headers: {
                    Authorization: `Bearer ${this.$store.state.registry.customerToken}`,
                },
            }).then((res) => {
                if (res.data.hasOwnProperty('errors')) {
                    this.$store.commit("addErrorMessage", res.data.errors[0]['message']);
                    return;
                }
                this.$store.commit("setCart", res.data.data.mergeCarts);
                this.$store.commit("setCartId", res.data.data.mergeCarts.id);
            })
            .catch(err => {
                this.$store.commit("addErrorMessage", err.message);
            }).finally(() => {
                this.$store.commit("loadingStop");
            });
            return null;
        },
        onReset(event) {
            event.preventDefault()
            // Reset our form values
            this.form.email = ''
            this.form.name = ''
            this.form.food = null
            this.form.checked = []
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
            this.show = true
            })
        }
    }
}
</script>

<style>

</style>
