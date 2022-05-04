<template>
    <b-row>
        <b-col sm="12">
            <div>
                <b-card no-body>
                    <b-tabs pills card vertical v-if="setting.length">
                        <b-tab v-for="(layer, index) in aggregations" :key="index">
                            <template #title >
                                <p class="mb-0">{{layer.label}} </p>
                            </template>
                            <b-card-text>
                                <b-form-group label="Chose Option" v-slot="{ ariaDescribedby }">
                                    <template v-for="option in layer.options">
                                        <b-form-radio
                                            v-if="getSetting(layer.attribute_code)['input_type'] == 'select'"
                                            @change="changeFilter"
                                            :key="option.value"
                                            :aria-describedby="ariaDescribedby"
                                            :name="layer.attribute_code"
                                            v-model="eqFilter[layer.attribute_code]"
                                            :value="option.value">
                                            {{ option.label + ' (' + option.count + ')' }}
                                        </b-form-radio>
                                        <b-form-radio
                                            v-if="getSetting(layer.attribute_code)['input_type'] == 'price'"
                                            @change="changeFilter"
                                            :key="option.value"
                                            :aria-describedby="ariaDescribedby"
                                            :name="layer.attribute_code"
                                            v-model="rangeFilter[layer.attribute_code]"
                                            :value="option.value">
                                            {{ option.label + ' (' + option.count + ')' }}
                                        </b-form-radio>
                                        <b-form-radio
                                            v-if="getSetting(layer.attribute_code)['input_type'] == 'boolean'"
                                            @change="changeFilter"
                                            :key="option.value"
                                            :aria-describedby="ariaDescribedby"
                                            :name="layer.attribute_code"
                                            v-model="eqFilter[layer.attribute_code]"
                                            :value="option.value">
                                            {{ (option.label == '1' ? 'Yes' : 'No') + ' (' + option.count + ')' }}
                                        </b-form-radio>
                                        <b-form-checkbox
                                            v-if="getSetting(layer.attribute_code)['input_type'] == 'multiselect'"
                                            @change="changeFilter"
                                            :key="option.value"
                                            :aria-describedby="ariaDescribedby"
                                            :name="layer.attribute_code"
                                            v-model="inFilter[layer.attribute_code]"
                                            :value="option.value">
                                            {{ option.label + ' (' + option.count + ')' }}
                                        </b-form-checkbox>
                                    </template>
                                </b-form-group>
                            </b-card-text>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </div>
        </b-col>
        <b-col sm="12" class="mt-2">
            <b-button class="mt-2" variant="outline-info" block @click="$emit('apply-filter', filter)">Apply</b-button>
        </b-col>
    </b-row>
</template>

<script>
export default {
    data() {
        return {
            setting: [],
            filter: {},
        }
    },
    props: {
        aggregations: {
            type: Array,
            required: true,
        },
        eqFilter: {
            type: Object,
            required: true,
        },
        inFilter: {
            type: Object,
            required: true,
        },
        rangeFilter: {
            type: Object,
            required: true,
        },
    },
    async created() {
        let attributes = [];
        this.aggregations.forEach(attribute => {
            attributes.push({
                "attribute_code": attribute.attribute_code,
                "entity_type": "catalog_product"
            })
        });
        await this.$axios({
            method: "post",
            url: this.$axios.defaults.baseURL,
            data: {
                query: `query($attributes: [AttributeInput!]!)
                {
                    customAttributeMetadata(
                        attributes: $attributes
                    ) {
                        items {
                            attribute_code
                            attribute_type
                            input_type
                        }
                    }
                }
                `,
                variables: {
                    "attributes": attributes,
                }
            }
        }).then((res) => {
            if (res.data.hasOwnProperty('errors')) {
                this.$store.commit("addErrorMessage", res.data.errors[0]['message']);
                return;
            }
            this.setting = res.data.data.customAttributeMetadata.items;
        })
        .catch(err => {
            if(this.cartId && !this.cart) {
                this.getCart();
            }
            this.$store.commit("addErrorMessage", err.message);
        });
    },
    methods: {
        changeFilter() {
            let filter = {};
            for(var key in this.inFilter) {
                if (this.inFilter.hasOwnProperty(key)) {
                    filter[key] = {'in': this.inFilter[key]}
                }
            }
            for(var key in this.eqFilter) {
                if (this.eqFilter.hasOwnProperty(key)) {
                    filter[key] = {'eq': this.eqFilter[key]}
                }
            }
            for(var key in this.rangeFilter) {
                if (this.rangeFilter.hasOwnProperty(key)) {
                    let parts = this.rangeFilter[key].split('_');
                    filter[key] = {'from': parts[0], 'to': (parseFloat(parts[1]) - 0.1)}
                }
            }
            this.filter = filter;
        },
        getSetting(code) {
            return this.setting.filter(function(attr){
                return attr.attribute_code == code
            })[0];
        }
    }
}
</script>

<style>

</style>