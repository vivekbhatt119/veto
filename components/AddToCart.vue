<template>
  <div>
      <b-button @click="addProduct" variant="primary">Add To Cart</b-button>
  </div>
</template>

<script>
import payload from '../payload';
export default {
    props: {
        product: {
            type: Object,
            required: true
        },
        parentProduct: {
            type: Object,
            required: false
        },
        qty: {
            type: Number,
            default: 1
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
        async createGuestCart() {
            const cart = await this.$axios({
                method: "post",
                url: this.$axios.defaults.baseURL,
                data: {
                    query: `
                        mutation {
                            createEmptyCart
                        }
                    `
                }
            }).then((res) => {
                if (res.data.hasOwnProperty('errors')) {
                    this.$store.commit("addErrorMessage", res.data.errors[0]['message']);
                    return;
                }
                this.$store.commit("setCartId", res.data.data.createEmptyCart);
                this.getCart()
            })
            .catch(err => {
                this.$store.commit("addErrorMessage", err.message);
            });
            return;
        },
        async getCart() {
            await this.$axios({
                method: 'post',
                url: this.$axios.defaults.baseURL,
                data: {
                    query: payload.getCart(this.$store.state.registry.cartId)
                }
            }).then((res) => {
                if (res.data.hasOwnProperty('errors')) {
                    this.$store.commit("addErrorMessage", res.data.errors[0]['message']);
                    return;
                }
                this.$store.commit("setCart", res.data.data.cart);
            })
            .catch(err => {
                this.$store.commit("addErrorMessage", err.message);
            });
            return;
        },
        async addProduct() {
            if (this.product.hasOwnProperty('configurable_options') && !this.parentProduct) {
                return this.$router.push('/p/' + this.product.sku + '/' + this.product.url_key + this.product.url_suffix);
            }
            if (!(this.cart && this.cartId)) {
                await this.createGuestCart();
            }
            // add product to cart
            const config = this.parentProduct ? 'parent_sku: ' + this.parentProduct.sku : '';
            await this.$axios({
                method: 'post',
                url: this.$axios.defaults.baseURL,
                data: {
                    query: `
                        mutation {
                            addProductsToCart(
                                cartId: "${this.cartId}"
                                cartItems: [
                                    {
                                        quantity: ${this.qty}
                                        sku: "${this.product.sku}"
                                        ${config}
                                    }
                                ]
                            ) {
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
                this.$store.commit("setCart", res.data.data.addProductsToCart.cart);
            })
            .catch(err => {
                if(this.cartId && !this.cart) {
                    this.getCart();
                }
                this.$store.commit("addErrorMessage", err.message);
            });
            return;
        }
    }
}
</script>

<style>

</style>