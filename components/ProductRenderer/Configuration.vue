<template>
    <div>
        <b-row v-for="configuration in product.configurable_options" :key="configuration.attribute_code">
            <b-col>
                {{ configuration.label }}
            </b-col>
            <b-col>
                <select @change="$emit('config-change', selected)" v-model="selected[configuration.attribute_code]" :name="configuration.attribute_code" class="custom-select">
                    <option v-for="value in configuration.values" :key="value.uid" :value="value.uid">
                        {{ value.label }}
                    </option>
                </select>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: {}
        }
    },
    props: {
        product: {
            type: Object,
            required: true,
        },
    },
    methods: {
        hello () {
            alert ('ecent');
            this.$emit('config-change', this.selected);
        }
    }
};
</script>