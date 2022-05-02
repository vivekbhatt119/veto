<template>
    <div style="display: contents">
        <td>
            <img height="100" :src="getImageSrc()"/>
        </td>
        <td>
            <p>{{item.product.name}}</p>
            <small>SKU: {{item.product.sku}}</small> <br />
            <template v-for="config in item.configurable_options">
                <small :key="config.option_label"> {{ config.option_label }}: {{ config.value_label }} </small> <br :key="config.value_label"/>
            </template>
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