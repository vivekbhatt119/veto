<template>
    <td>
        <p class="mb-1">{{item.product.name}}</p>
        <small>SKU: {{item.product.sku}}</small> <br />
    </td>
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