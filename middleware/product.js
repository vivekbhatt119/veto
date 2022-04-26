import payload from "../payload";

export default async function ({ store, route, redirect, $axios }) {
    let url = route.params.slug;
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

        let id = route.params.id;
        const product = await $axios({
            method: 'post',
            url: $axios.defaults.baseURL,
            data: {
                query: payload.products(id),
            },
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
    } catch(exception) {
        console.log(exception);
        return redirect('/');
    }
}