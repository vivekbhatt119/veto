export const state = () => ({
    registry: {
        currentCategory: null,
        currentProduct: null,
        currentCustomer: null,
        customerToken: null,
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
    logout(state) {
        state.registry.currentCustomer = null;
        state.registry.customerToken = null;
    }
}