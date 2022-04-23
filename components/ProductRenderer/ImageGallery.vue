<template>
    <b-carousel
        id="carousel-fade"
        :controls="Boolean(product.media_gallery.length - 1)"
        :interval="0"
    >
        <b-carousel-slide
            v-for="image in product.media_gallery"
            :key= "image.position"
            :img-src="image.url"
            :img-alt="image.label"
        />
    </b-carousel>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
};
</script>