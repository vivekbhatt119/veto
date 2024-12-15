import payload from '../payload';

export default {
    methods: {
        async createGuestCart() {
            const query = `
                mutation {
                    createEmptyCart
                }
            `;
        
            try {
                const res = await this.$graphqlCall(query);
                if (res.data.errors) {
                    this.$store.commit("addErrorMessage", res.data.errors[0].message);
                    return;
                }
        
                this.$store.commit("setCartId", res.data.data.createEmptyCart);
                await this.fetchCart();
            } catch (err) {
                this.$store.commit("addErrorMessage", err.message);
            }
        },
        async fetchCart() {
            if (!this.$store.state.registry.cartId) {
                await this.createGuestCart();
                return;
            }
        
            const query = payload.getCart(this.$store.state.registry.cartId);
        
            try {
                const res = await this.$graphqlCall(query);
        
                if (res.data.errors) {
                    this.$store.commit("addErrorMessage", res.data.errors[0].message);
                    return;
                }
        
                this.$store.commit("setCart", res.data.data.cart);
            } catch (err) {
                this.$store.commit("addErrorMessage", err.message);
            }
        }
        ,
        async addItem(input, productName) {
            const query = `
                mutation AddProductsToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
                    addProductsToCart(
                        cartId: $cartId,
                        cartItems: $cartItems
                    ) {
                        cart {
                            ${payload.commonCart()}
                        }
                        user_errors {
                            code
                            message
                        }
                    }
                }
            `;
        
            try {
                const res = await this.$graphqlCall(query, {
                    cartId: this.$store.state.registry.cartId,
                    cartItems: input,
                });
        
                if (res.data.errors) {
                    res.data.errors.forEach((error) => {
                        if (error.hasOwnProperty('extensions') && error.extensions.category === 'graphql-authorization') {
                            this.$store.commit("logout");
                        }
                    });
                    this.$store.commit("addErrorMessage", res.data.errors[0].message);
                    return;
                }
        
                if (res.data.data.addProductsToCart.user_errors.length) {
                    this.$store.commit("addErrorMessage", res.data.data.addProductsToCart.user_errors[0].message);
                    return;
                }
        
                this.$store.commit("addSuccessMessage", `${productName} has been added to the cart.`);
                this.$store.commit("setCart", res.data.data.addProductsToCart.cart);
        
            } catch (err) {
                this.$store.commit("addErrorMessage", err.message);
            }
        },
        async updateItem(qty, uid, consent = false) {
            await this.withLoading(async () => {
                const input = {
                    cart_id: this.$store.state.registry.cartId,
                    cart_items: [
                        {
                            cart_item_uid: uid,
                            quantity: `${qty}`
                        }
                    ]
                };
        
                if (consent !== null) {
                    input.cart_items[0].consent = consent;
                }
        
                const query = `
                    mutation UpdateCartItems($input: UpdateCartItemsInput) {
                        updateCartItems(input: $input) {
                            cart {
                                ${payload.commonCart()}
                            }
                        }
                    }
                `;
        
                const variables = { input };
        
                const res = await this.$graphqlCall(query, variables);
        
                if (res.data.errors) {
                    this.$store.commit("addErrorMessage", res.data.errors[0].message);
                    return;
                }
        
                this.$store.commit("setCart", res.data.data.updateCartItems.cart);
            });
        },
        async removeItem(uid) {
            if (!confirm("Are you sure?")) {
                return;
            }
        
            await this.withLoading(async () => {
                const query = `
                    mutation RemoveItemFromCart($cartId: String!, $cartItemUid: ID!) {
                        removeItemFromCart(
                            input: {
                                cart_id: $cartId,
                                cart_item_uid: $cartItemUid
                            }
                        ) {
                            cart {
                                ${payload.commonCart()}
                            }
                        }
                    }
                `;
                const variables = {
                    cartId: this.$store.state.registry.cartId,
                    cartItemUid: uid,
                };
        
                const res = await this.$graphqlCall(query, variables);
        
                if (res.data.errors) {
                    this.$store.commit("addErrorMessage", res.data.errors[0].message);
                    return;
                }
        
                this.$store.commit("setCart", res.data.data.removeItemFromCart.cart);
            });
        },
        async withLoading(callback) {
            this.$store.commit("loadingStart");
            try {
                await callback();
            } catch (error) {
                this.$store.commit("addErrorMessage", error.message);
            } finally {
                this.$store.commit("loadingStop");
            }
        }
    },
};
