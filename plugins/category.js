import payload from '../payload';
export default async function ({ $axios, store }) {
    if(!store.state.registry.categoryTree) {
        const categories = await $axios({
            method: "post",
            url: $axios.defaults.baseURL,
            data: {
                query: payload.categoryList(),
            },
        });
        store.commit("setCategoryTree", categories.data.data.categoryList);
    }
}