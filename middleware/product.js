import payload from "../payload";

export default async function ({ store, route, redirect, $axios }) {
    let url = route.params.slug;
    let token = store.state.registry.customerToken;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
        let params = new URLSearchParams({
            query: payload.urlResolver(url)
        }).toString();

        let response = await $axios.get(`${$axios.defaults.baseURL}?${params}`, {
            headers: headers,
        });
        if (response.data.errors) {
            store.commit("addErrorMessage", response.data.errors[0]['message']);
            return redirect('/');
        }
        if (!response.data.data.urlResolver) {
            store.commit("addErrorMessage", "URL was not found.");
            return redirect('/');
        }

        let id = route.params.id;

        params = new URLSearchParams({
            query: payload.products(id)
        }).toString();

        const product = await $axios.get(`${$axios.defaults.baseURL}?${params}`, {
            headers: headers,
        });

        if (product.data.errors) {
            console.log(product.data.errors);
            return redirect('/');
        }
        if (!product.data.data.products) {
            return redirect('/');
        }
        if (!product.data.data.products.total_count) {
            return redirect('/');
        }

        store.commit("setCurrentProduct", product.data.data.products.items[0]);
    } catch (exception) {
        console.log(exception);
        return redirect('/');
    }
}