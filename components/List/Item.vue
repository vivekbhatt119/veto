<template>
  <div class="col-sm-3">
    <b-card no-body
      img-top
    >
      <nuxt-link :to="'/p/' + product.sku + '/' + product.url_key + product.url_suffix" class="text-reset">
        <b-card-img-lazy :src="product.thumbnail.url"></b-card-img-lazy>
      </nuxt-link>
      <b-card-body>
        <b-card-text>
          <p>{{ product.name }}</p>
          <price :product="product"/>
        </b-card-text>
        <b-button :to="'/p/' + product.sku + '/' + product.url_key + product.url_suffix" variant="primary">Add To Cart</b-button>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import Price from '../ProductRenderer/Price.vue'
export default {
  components: { Price },
  props: {
    product: {
      type: Object,
      required: true,
    },
  }
};
</script>