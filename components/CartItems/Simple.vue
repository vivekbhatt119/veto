<template>
    <div style="display: contents">
        <td>
            <img height="100" :src="item.product.thumbnail.url"/>
        </td>
        <td>
            <p class="mb-1">{{item.product.name}}</p>
            <small>SKU: {{item.product.sku}}</small> <br />
        </td>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    }
}
</script>

<style>

</style>