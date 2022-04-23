export default async function ({ store, route, redirect, $axios }) {
    let url = route.params.slug;
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

        let id = route.params.id;
        const product = await $axios({
            method: 'post',
            url: $axios.defaults.baseURL,
            data: {
            query: `
            {
                products(
                    filter: {
                        sku: {
                            eq: "${id}"
                        }
                    },
                ) {
                  total_count
                  items {
                    ... on ConfigurableProduct {
                      configurable_options {
                        attribute_code
                        label
                        values {
                          uid
                          label
                          swatch_data {
                            value
                          }
                        }
                      }
                      variants {
                        attributes {
                          code
                          label
                          uid
                          value_index
                        }
                        product {
                          uid
                          canonical_url
                          url_key
                          url_suffix
                          description {
                            html
                          }
                          gift_message_available
                          image {
                            disabled
                            label
                            position
                            url
                          }
                          media_gallery {
                            position
                            label
                            url
                          }
                          meta_description
                          meta_keyword
                          meta_title
                          name
                          options {
                            title
                            required
                            sort_order
                          }
                          options_container
                          price_range {
                            maximum_price {
                              regular_price {
                                currency
                                value
                              }
                              final_price {
                                currency
                                value
                              }
                              fixed_product_taxes {
                                label
                                amount {
                                  value
                                  currency
                                }
                              }
                            }
                            minimum_price {
                              regular_price {
                                currency
                                value
                              }
                              final_price {
                                currency
                                value
                              }
                              fixed_product_taxes {
                                label
                                amount {
                                  value
                                  currency
                                }
                              }
                            }
                          }
                          price_tiers {
                            discount {
                              amount_off
                              percent_off
                            }
                            final_price {
                              value
                              currency
                            }
                            quantity
                          }
                          rating_summary
                          review_count
                          sale
                          short_description {
                            html
                          }
                          size
                          sku
                          sleeve
                          small_image {
                            disabled
                            label
                            position
                            url
                          }
                          special_price
                          stock_status
                          swatch_image
                          thumbnail {
                            disabled
                            label
                            position
                            url
                          }
                        }
                      } 
                    }
                    uid
                    canonical_url
                    url_key
                    url_suffix
                    description {
                      html
                    }
                    gift_message_available
                    image {
                      disabled
                      label
                      position
                      url
                    }
                    media_gallery {
                      position
                      label
                      url
                    }
                    meta_description
                    meta_keyword
                    meta_title
                    name
                    price_range {
                      maximum_price {
                        regular_price {
                          currency
                          value
                        }
                        final_price {
                          currency
                          value
                        }
                        fixed_product_taxes {
                          label
                          amount {
                            value
                            currency
                          }
                        }
                      }
                      minimum_price {
                        regular_price {
                          currency
                          value
                        }
                        final_price {
                          currency
                          value
                        }
                        fixed_product_taxes {
                          label
                          amount {
                            value
                            currency
                          }
                        }
                      }
                    }
                    price_tiers {
                      discount {
                        amount_off
                        percent_off
                      }
                      final_price {
                        value
                        currency
                      }
                      quantity
                    }
                    rating_summary
                    review_count
                    sale
                    short_description {
                      html
                    }
                    size
                    sku
                    sleeve
                    small_image {
                      disabled
                      label
                      position
                      url
                    }
                    special_price
                    stock_status
                    swatch_image
                    thumbnail {
                      disabled
                      label
                      position
                      url
                    }
                  } 
                  page_info {
                    page_size
                    current_page
                  }
                }
                }
            `,
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