export const state = () => ({
    registry: {
        currentCategory: null,
        currentProduct: null,
        currentCustomer: null,
        customerToken: null,
        message: [],
        cartId: null,
        cart: null,
    }
})

export const mutations = {
    setCurrentCategory(state, category) {
        state.registry.currentCategory = category
    },
    setCurrentProduct(state, product) {
        state.registry.currentProduct = product
    },
    setCurrentCustomer(state, customer) {
        state.registry.currentCustomer = customer
    },
    setCustomerToken(state, token) {
        state.registry.customerToken = token
    },
    setCartId(state, id) {
        state.registry.cartId = id
    },
    setCart(state, cart) {
        state.registry.cart = cart
    },
    unsetCart(state, cart) {
        state.registry.cart = null
    },
    addErrorMessage(state, msg) {
        state.registry.message.push({type: 'danger', msg: msg})
    },
    addSuccessMessage(state, msg) {
        state.registry.message.push({type: 'success', msg: msg})
    },
    renderedMessage(state) {
        state.registry.message = []
    },
    logout(state) {
        state.registry.currentCustomer = null;
        state.registry.customerToken = null;
        state.registry.cartId = null;
        state.registry.cart = null;
    }
}