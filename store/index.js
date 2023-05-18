export const state = () => ({
    registry: {
        categoryTree: null,
        currentCategory: null,
        currentProduct: null,
        currentCustomer: null,
        customerToken: null,
        message: [],
        cartId: null,
        cart: null,
        fullScreenLoading: false,
        currentStore: null,
        availableStores: [],
    }
})

export const mutations = {
    setCurrentStore(state, store) {
        state.registry.currentStore = store
    },
    setCategoryTree(state, categoryTree) {
        state.registry.categoryTree = categoryTree
    },
    setAvailableStores(state, availableStores) {
        state.registry.availableStores = availableStores
    },
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
    loadingStart(state) {
        state.registry.fullScreenLoading = true;
    },
    loadingStop(state) {
        state.registry.fullScreenLoading = false;
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