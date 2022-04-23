export default async function ({ store, route, redirect, $axios }) {
    let url = route.fullPath;
    url = url.replace('/c/', '');
    try {
        const response = await $axios({
            method: 'post',
            url: $axios.defaults.baseURL,
            data: {
            query: `
            {
                urlResolver(url: "${url}") {
                entity_uid
                relative_url
                redirectCode
                type
                }
            }
            `,
            },
        });
        if (response.data.errors) {
            console.log(response.data.errors);
            return redirect('/');
        }
        if (!response.data.data.urlResolver) {
            return redirect('/');
        }

        let id = response.data.data.urlResolver.entity_uid;
        const category = await $axios({
            method: 'post',
            url: $axios.defaults.baseURL,
            data: {
            query: `
            {
                categories(
                  filters: {
                    category_uid: {eq: "${id}"}
                  }
                ) {
                    total_count
                    items {
                        uid
                        level
                        name
                        meta_title
                        meta_keywords
                        meta_description
                        children_count
                        children {
                            uid
                            level
                            name
                            path
                        }
                    }
                }
            }
            `,
            },
        });

        if (category.data.errors) {
            console.log(category.data.errors);
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
        return redirect('/');
    }
}