export default {
    urlResolver(url) {
        return `
        {
            urlResolver(url: "${url}") {
                entity_uid
                relative_url
                redirectCode
                type
            }
        }
        `;
    },
    categoryList() {
        return `
        {
            categoryList(
                filters: {
                parent_id: {eq: "2"},
                }
            ) {
                children_count
                uid
                level
                name
                url_key
                url_path
                url_suffix
                include_in_menu
                position
                children {
                    uid
                    level
                    name
                    url_key
                    url_path
                    url_suffix
                    include_in_menu
                    position
                    children_count
                    children {
                        uid
                        level
                        name
                        url_key
                        url_path
                        url_suffix
                        include_in_menu
                        position
                        children_count
                    }
                }
            }
        }
        `;
    },
    categories(uid) {
        return `
        {
            categories(
                filters: {
                    category_uid: {eq: "${uid}"}
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
                        url_path
                        url_suffix
                    }
                }
            }
        }
        `;
    },
    products(id) {
        return `
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
                                ${this.configProduct()}
                            }
                        }
                    }
                    ${this.simpleProduct()}
                } 
                page_info {
                    page_size
                    current_page
                }
            }
        }
        `;
    },
    simpleProduct() {
        return `
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
        `;
    },
    configProduct() {
        return this.simpleProduct() + `
            options {
                title
                required
                sort_order
            }
            options_container
        `;
    },
    commonCart() {
        return `
            applied_coupons {
                code
            }
            available_payment_methods {
                code
                title
            }
            billing_address {
                city
                company
                country {
                    code
                    label
                }
                firstname
                lastname
                postcode
                region {
                    code
                    label
                    region_id
                }
                street
                telephone
            }
            email
            gift_message {
                from
                message
                to
            }
            id
            is_virtual
            items {
                uid
                quantity
                ... on ConfigurableCartItem {
                    configurable_options {
                        value_label
                        option_label
                        configurable_product_option_value_uid
                        configurable_product_option_uid
                    }
                }
                prices {
                    total_item_discount {
                        value
                    }
                    price {
                        value
                        currency
                    }
                    discounts {
                        label
                        amount {
                            value
                        }
                    }
                }
                product {
                    name
                    sku
                    thumbnail {
                        label
                        url
                    }
                    ... on ConfigurableProduct {
                        variants {
                            attributes {
                                code
                                label
                                uid
                                value_index
                            }
                            product {
                                thumbnail {
                                    url
                                    label
                                }
                            }
                        }
                    }
                }
            }
            prices {
                applied_taxes {
                    amount {
                        value
                        currency
                    }
                    label
                }
                discounts {
                    amount {
                        value
                        currency
                    }
                    label
                }
                grand_total {
                    currency
                    value
                }
                subtotal_excluding_tax {
                    currency
                    value
                }
                subtotal_including_tax {
                    currency
                    value
                }
                subtotal_with_discount_excluding_tax {
                    currency
                    value
                }
            }
            selected_payment_method {
                code
                purchase_order_number
                title
            }
            shipping_addresses {
                available_shipping_methods {
                    amount {
                        value
                        currency
                    }
                    available
                    carrier_code
                    carrier_title
                    error_message
                    method_code
                    method_title
                    price_excl_tax {
                        value
                        currency
                    }
                    price_incl_tax {
                        value
                        currency
                    }
                }
                city
                company
                country {
                    code
                    label
                }
                customer_notes
                firstname
                lastname
                pickup_location_code
                postcode
                region {
                    code
                    label
                    region_id
                }
                selected_shipping_method {
                    amount {
                        value
                        currency
                    }
                    carrier_code
                    carrier_title
                    method_code
                    method_title
                }
                street
                telephone
            }
            total_quantity
        `;
    },
    getCart(cartId) {
        return `
            {
                cart(cart_id: "${cartId}") {
                    ${this.commonCart()}
                }
            }
        `;
    },
    customerCart() {
        return `
            {
                customerCart {
                    ${this.commonCart()}
                }
            }
        `;
    },
    addProductsToCart() {
        return `
        `;
    }
};
