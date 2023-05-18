import payload from '../payload';
export default async function ({ $axios, store }) {
    if(!store.state.registry.currentStore) {
        const stores = await $axios({
            method: "post",
            url: $axios.defaults.baseURL,
            data: {
                query: payload.availableStores(),
            },
            headers: {
                Authorization: `Bearer 2ic383bgxtr97q8s0y0bq99q55vaelg4`,
            },
        });
        let currentStore = '';
        stores.data.data.availableStores.forEach(element => {
            if (element.is_default_store) {
                currentStore = element;
            }
        });
        console.log(currentStore);
        store.commit("setAvailableStores", stores.data.data.availableStores);
        store.commit("setCurrentStore", currentStore);
    }
    $axios.onRequest(config => {
        let currentStore = store.state.registry.currentStore;
        config.headers['Store'] = currentStore.store_code;
    })
}