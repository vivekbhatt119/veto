<template>
    <tr>
        <td width="30%">
            <img height="100" :src="getImageSrc()"/>
        </td>
        <td>
            <p class="mb-1">{{item.product.name}}</p>
            <small>SKU: {{item.product.sku}}</small> <br />
            <small v-for="config in item.configurable_options" :key="config.option_label"> {{ config.option_label }}: {{ config.value_label }} </small> <br/>
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
    },
    computed: {
        itemConig() {
            let tmp = {};
            this.item.configurable_options.forEach(element => {
                tmp[element.configurable_product_option_value_uid] = element.value_label
            });
            return tmp;
        }
    },
    methods: {
        getImageSrc() {
            let src = null;
            this.item.product.variants.forEach(element => {
                let selected = true;
                element.attributes.forEach(attribute => {
                    if (!this.itemConig.hasOwnProperty(attribute.uid)) {
                        selected = false;
                    }
                });
                if (selected == true) {
                    src = element.product.thumbnail.url;
                    return false;
                }
            });
            return src;
        }
    }
}
</script>

<style>

</style>