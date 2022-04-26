<template>
    <td>
        <p>{{item.product.name}}</p>
        <small>SKU: {{item.product.sku}}</small> <br />
        <template v-for="config in item.configurable_options">
            <small :key="config.option_label"> {{ config.option_label }}: {{ config.value_label }} </small> <br :key="config.value_label"/>
        </template>
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