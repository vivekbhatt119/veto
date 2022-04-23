<template>
    <div class="price-container" :class="isConfigurable ? 'configurable' : 'simple'">
        <span v-if="isConfigurable" class="as-low-as">
          As low as
        </span>
        <span class="price-to-show">
            {{ this.product.price_range.minimum_price.final_price.currency }}
            {{ this.product.price_range.minimum_price.final_price.value }}
        </span>
        <s v-if="isSpecialPrice && !isConfigurable">
            {{ this.product.price_range.minimum_price.regular_price.currency }}
            {{ this.product.price_range.minimum_price.regular_price.value }}
        </s>
    </div>
</template>

<script>
export default {
  name: "Price",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isSpecialPrice() {
      return (
        this.product.price_range.minimum_price.regular_price.value !=
        this.product.price_range.minimum_price.final_price.value
      );
    },
    isConfigurable() {
      return this.product.hasOwnProperty("configurable_options");
    },
  },
};
</script>

<style>
  .price-to-show {
    font-weight: 600;
  }
</style>