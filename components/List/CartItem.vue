<template>
    <div class="col-sm-12">
        <div class="row">
            <div class="col-sm-4">
                <b-card-img-lazy :src="item.product.thumbnail.url" :alt="item.product.thumbnail.label"></b-card-img-lazy>
            </div>
            <div class="col-sm-8">
                {{ item.product.name }}
                {{ item.quantity }}
            </div>
        </div>
    </div>
</template>

<script>
import Price from '../ProductRenderer/Price.vue'
export default {
    components: { Price },
    props: {
        item: {
            type: Object,
            required: true,
        },
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
};
</script>