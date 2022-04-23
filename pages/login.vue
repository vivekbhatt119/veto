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
                },
                headers: {
                    Authorization: `Bearer 2ic383bgxtr97q8s0y0bq99q55vaelg4`,
                },
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
                console.log(err.message);
            });
            return;
        },
        async getCustomer(token) {
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
            });

            this.$store.commit("setCurrentCustomer", customer.data.data.customer);
            this.$router.push({ name: 'home', query: { redirect: '/' } });
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
