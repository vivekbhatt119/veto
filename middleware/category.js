import payload from "../payload";

export default async function ({ store, route, redirect, $axios }) {
    let url = route.fullPath;
    url = url.replace('/c/', '');
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

        let id = response.data.data.urlResolver.entity_uid;
        params = new URLSearchParams({
            query: payload.categories(id)
        }).toString();

        const category = await $axios.get(`${$axios.defaults.baseURL}?${params}`, {
            headers: headers,
        });

        if (category.data.errors) {
            store.commit("addErrorMessage", category.data.errors);
            return redirect('/');
        }
        if (!category.data.data.categories) {
            return redirect('/');
        }
        if (!category.data.data.categories.total_count) {
            return redirect('/');
        }

        store.commit("setCurrentCategory", category.data.data.categories.items[0]);
    } catch(exception) {
        console.log(exception);
        store.commit("addErrorMessage", "something went wrong");
        return redirect('/');
    }
}