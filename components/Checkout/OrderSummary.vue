<template>
    <b-card header="Order Summary">
        <b-card-text>
            <b-row>
                <b-col>Price</b-col>
                <b-col class="text-right"> 
                    {{prices.subtotal_including_tax.currency}}
                    {{prices.subtotal_including_tax.value}}
                </b-col>
            </b-row>
            <template v-if="prices.discounts">
                <b-row v-for="discount in prices.discounts" :key="discount.label">
                    <b-col>{{ discount.label }}</b-col>
                    <b-col class="text-right">
                        {{discount.amount.currency}}
                        {{discount.amount.value}}
                    </b-col>
                </b-row>
            </template>
            <b-row>
                    <b-col>
                        <strong>Total Amount</strong>
                    </b-col>
                    <b-col class="text-right"> 
                        {{prices.grand_total.currency}}
                        {{prices.grand_total.value}}
                    </b-col>
                </b-row>
        </b-card-text>
    </b-card>
</template>

<script>
export default {
    props: {
        prices: {
            type: Object,
            required: true,
        },
    },
    methods: {
    }
}
</script>

<style>

</style>