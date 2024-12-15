<template>
    <b-row>
        <b-col sm="4">
            <b-card
                v-for="address in addresses" :key="address.id" 
                :border-variant="isSelected(address) ? 'primary' : 'success'" 
                @click="$emit('setShippingAddress', address)"
                align="left" >
                <b-card-text>
                    <div v-html="addressHtml(address)" />
                </b-card-text>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
export default {
    props: {
        addresses: {
            type: Array,
            required: true,
        }
    },
    methods: {
        isSelected(address) {
            return true;
        },
        addressHtml(address) {
            console.log(address);
            let tmp = [];
            tmp.push(address.firstname + ' ' + address.lastname);
            if (address.company) tmp.push(address.company);
            if (address.street.length) address.street.forEach(st => { tmp.push(st) });
            
            let nextLine = [];
            if (address.city) nextLine.push(address.city);
            if (address.region.region) nextLine.push(address.region.region);
            if (address.postcode) nextLine.push(address.postcode);
            
            if (nextLine.length) tmp.push(nextLine.join(', '));
            if (address.country_code) tmp.push(address.country_code);
            if (address.telephone) {
                tmp.push(`
                    T: <a href="tel:${address.telephone}"> ${address.telephone} </a>
                `);
            }
            return tmp.join('<br>');
        }
    }
}
</script>

<style>

</style>