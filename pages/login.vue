<template>
    <b-container>
        <b-row>
            <b-col>
                <h1>Customer Login</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="8" offset-sm="2">
                <b-card no-body>
                    <b-tabs card>
                    <b-tab title="Sign In" active>
                        <b-card-text>
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
                                <div class="text-center">
                                    <b-button type="submit" variant="primary">Login</b-button>
                                </div>
                            </b-form>
                        </b-card-text>
                    </b-tab>
                    <b-tab title="Sign Up">
                        <b-card-text>
                            <b-form @submit.prevent="createCustomer" v-if="show">
                                <b-form-group
                                    id="firstname-group"
                                    label="First Name:"
                                    label-for="firstname"
                                >
                                    <b-form-input
                                        id="firstname"
                                        v-model="register['firstname']"
                                        type="text"
                                        placeholder="Enter First Name"
                                        :state="Boolean(register.firstname)"
                                        required
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group
                                    id="lastname-group"
                                    label="Last Name:"
                                    label-for="lastname"
                                >
                                    <b-form-input
                                        id="lastname"
                                        v-model="register['lastname']"
                                        type="text"
                                        placeholder="Enter Last Name"
                                        :state="Boolean(register.lastname)"
                                        required
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group>
                                    <b-form-checkbox
                                        id="newsletter"
                                        v-model="register.is_subscribed"
                                        name="newsletter"
                                        >
                                        Sign Up for Newsletter
                                    </b-form-checkbox>
                                </b-form-group>
                                <b-form-group
                                    id="email2-group"
                                    label="Email address:"
                                    label-for="email2"
                                >
                                    <b-form-input
                                        id="email2"
                                        v-model="register['email']"
                                        type="email"
                                        placeholder="Enter email"
                                        :state="Boolean(register.email)"
                                        required
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group
                                    id="password2-group"
                                    label="Password:"
                                    label-for="password2"
                                >
                                    <b-form-input
                                        id="password2"
                                        v-model="register['password']"
                                        type="password"
                                        placeholder="Password"
                                        :state="Boolean(register.password)"
                                        required
                                    ></b-form-input>
                                </b-form-group>
                                <b-form-group
                                    id="confirm-group"
                                    label="Confirm Password:"
                                    label-for="confirm"
                                >
                                    <b-form-input
                                        id="confirm"
                                        :state="checkPassword()"
                                        v-model="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        required
                                    ></b-form-input>
                                    <b-form-invalid-feedback :state="checkPassword()">
                                        Should match with the password.
                                    </b-form-invalid-feedback>
                                    <b-form-valid-feedback :state="checkPassword()">
                                        Looks Good.
                                    </b-form-valid-feedback>
                                </b-form-group>
                                <div class="text-center">
                                    <b-button type="submit" variant="primary">Register</b-button>
                                </div>
                            </b-form>
                        </b-card-text>
                    </b-tab>
                    </b-tabs>
                </b-card>
            </b-col>
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
            password: null,
            confirmPassword: null,
            register: {
                "firstname": null,
                "lastname": null,
                "email": null,
                "password": null,
                "is_subscribed": true,
            }
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
        checkPassword() {
            return this.confirmPassword == this.register.password ? true : false;
        },
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
                    this.$store.commit("addErrorMessage", res.data.errors[0]['message']);
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
        async createCustomer() {
            if (!this.checkPassword()) {
                return;
            }
            for(let key in this.register) {
                if (!this.register[key] && key != 'is_subscribed') {
                    return;
                }
            }
            this.$store.commit("loadingStart");
            await this.$axios({
                method: "post",
                url: this.$axios.defaults.baseURL,
                data: {
                    query: `
                        mutation ($register: CustomerInput!) {
                            createCustomer(
                                input: $register
                            ) {
                                customer {
                                    email
                                }
                            }
                        }
                    `,
                    variables: {
                        "register": this.register
                    }
                }
            }).then((res) => {
                if (res.data.hasOwnProperty('errors')) {
                    this.$store.commit("addErrorMessage", res.data.errors[0]['message']);
                    return;
                }
                this.username = this.register.email;
                this.password = this.register.password;
                this.loginCustomer();
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
                    query: payload.getCustomer()
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
                        //TODO: load cart with this.cartId
                    }
                    if (this.cart.itemsV2.length) {
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
