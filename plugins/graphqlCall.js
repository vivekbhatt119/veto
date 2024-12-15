export default async ({ $axios, store }, inject) => {
  const graphqlCall = async (query, variables = {}, method = 'POST') => {
    try {
      let response = '';
      if (method === "GET") {
        const params = new URLSearchParams({
          query: query,
          variables: JSON.stringify(variables),
        }).toString();

        response = await $axios.get(`${$axios.defaults.baseURL}?${params}`, {
          headers: {
            Authorization: `Bearer ${store.state.registry.customerToken}`,
          },
        });
      } else if (method === "POST") {
        response = await $axios.post(
          $axios.defaults.baseURL,
          {
            query,
            variables,
          },
          {
            headers: {
              Authorization: `Bearer ${store.state.registry.customerToken}`,
            },
          }
        );
      }
      return response;
    } catch (error) {
      console.error("GraphQL Call Error:", error);
      throw error;
    }
  };

  // Inject the function into the app
  inject('graphqlCall', graphqlCall);
};
