import payload from '../payload';
export default async function ({ $axios, store }) {
    if(!store.state.registry.currentStore) {
        const params = new URLSearchParams({
            query: payload.availableStores()
          }).toString();
        const stores = await $axios({
            method: "get",
            url: `${$axios.defaults.baseURL}?${params}`
        });
        let currentStore = '';
        stores.data.data.availableStores.forEach(element => {
            if (element.is_default_store) {
                currentStore = element;
            }
        });
        store.commit("setAvailableStores", stores.data.data.availableStores);
        store.commit("setCurrentStore", currentStore);
    }
    $axios.onRequest(config => {
        let currentStore = store.state.registry.currentStore;
        let token = store.state.registry.customerToken;
        config.headers['Store'] = currentStore.store_code;
        config.headers['Authorization'] = `Bearer ${token}`;
    })
}