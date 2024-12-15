import payload from '../payload';
export default async function ({ $axios, store }) {
    if(!store.state.registry.categoryTree) {
        const params = new URLSearchParams(
            {
                query: payload.categoryList()
            }
        ).toString();
  
        const categories = await $axios.get(`${$axios.defaults.baseURL}?${params}`, {
            headers: {
                Authorization: `Bearer ${store.state.registry.customerToken}`,
            },
        });
        store.commit("setCategoryTree", categories.data.data.categoryList);
    }
}