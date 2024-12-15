export class Checkout {
  constructor(graphqlClient, token = null) {
    this.graphqlClient = graphqlClient;
    this.token = token;
    this.commonCart = `
          id
          available_payment_methods {
              code
              title
          }
          shipping_addresses {
            available_shipping_methods {
              available
              carrier_code
              carrier_title
              method_code
              method_title
              price_incl_tax {
                currency
                value
              }
            }
            selected_shipping_method {
              carrier_code
              method_code
            }
          }
        selected_payment_method {
          code
        }
        `;
  }

  async graphqlCall(query, variables = {}) {
    try {
      const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
      const response = await this.graphqlClient.post('', { query, variables }, { headers });
      return response;
    } catch (error) {
      console.error("GraphQL call error:", error);
      throw error;
    }
  }

  async fetchCart(cartId) {
    const query = `{
      cart(cart_id: "${cartId}") {
          ${this.commonCart}
      }
    }`;

    return await this.graphqlCall(query);
  }

  async setShippingAddress(cartId, address) {
    const mutation = `mutation ($cartId: String!, $address: ShippingAddressInput!) {
        setShippingAddressesOnCart(
          input: {
            cart_id: $cartId
            shipping_addresses: [
              $address
            ]
          }
        ) {
          cart {
            ${this.commonCart}
          }
        }
      }`;

    return await this.graphqlCall(mutation, { cartId, address });
  }

  async setBillingAddress(cartId, address) {
    const mutation = `mutation ($cartId: String!, $address: BillingAddressInput!) {
        setBillingAddressOnCart(
          input: {
            cart_id: $cartId
            billing_address: {
              address: $address
            }
          }
        ) {
          cart {
            ${this.commonCart}
          }
        }
      }`;

    return await this.graphqlCall(mutation, { cartId, address });
  }

  async setShippingMethod(cartId, method) {
    const mutation = `mutation ($cartId: String!, $method: ShippingMethodInput!) {
        setShippingMethodsOnCart(
          input: {
            cart_id: $cartId
            shipping_methods: [
              $method
            ]
          }
        ) {
          cart {
            ${this.commonCart}
          }
        }
      }`;

    return await this.graphqlCall(mutation, { cartId, method });
  }

  async setPaymentMethod(cartId, method) {
    const mutation = `mutation ($cartId: String!, $method: PaymentMethodInput!) {
        setPaymentMethodOnCart(
          input: {
            cart_id: $cartId
            payment_method: $method
          }
        ) {
          cart {
            ${this.commonCart}
          }
        }
      }`;

    return await this.graphqlCall(mutation, { cartId, method });
  }

  async placeOrder(cartId) {
    const mutation = `mutation ($cartId: String!) {
        placeOrder(input: { cart_id: $cartId }) {
          order {
            order_number
          }
        }
      }`;

    return await this.graphqlCall(mutation, { cartId });
  }
}
