<template>
    <tr>
        <td width="30%">
            <img height="100" :src="item.product.thumbnail.url"/>
        </td>
        <td>
            <p class="mb-1">{{item.product.name}}</p>
            <small>SKU: {{item.product.sku}}</small> <br />
        </td>
        <td class="text-right">
            <b-button @click="$emit('removeItem', item.uid)" variant="outline-danger" size="sm">X</b-button>
        </td>
    </tr>
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