import payload from "../payload";

export default async function ({ store, route, redirect, $axios }) {
    let url = route.fullPath;
    url = url.replace('/c/', '');
    try {
        const response = await $axios({
            method: 'post',
            url: $axios.defaults.baseURL,
            data: {
            query: payload.urlResolver(url),
            },
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
        const category = await $axios({
            method: 'post',
            url: $axios.defaults.baseURL,
            data: {
            query: payload.categories(id),
            },
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