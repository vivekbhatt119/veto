<template>
    <address v-html="addressHtml">
    </address>
</template>

<script>
export default {
    props: {
        address: {
            type: Object,
            required: true,
        },
    },
    computed: {
        addressHtml() {
            let tmp = [];
            tmp.push(this.address.firstname + ' ' + this.address.lastname);
            if (this.address.company) tmp.push(this.address.company);
            if (this.address.street.length) this.address.street.forEach(st => { tmp.push(st) });
            
            let nextLine = [];
            if (this.address.city) nextLine.push(this.address.city);
            if (this.address.region.region) nextLine.push(this.address.region.region);
            if (this.address.postcode) nextLine.push(this.address.postcode);
            
            if (nextLine.length) tmp.push(nextLine.join(', '));
            if (this.address.country_code) tmp.push(this.address.country_code);
            if (this.address.telephone) {
                tmp.push(`
                    T: <a href="tel:${this.address.telephone}"> ${this.address.telephone} </a>
                `);
            }
            return tmp.join('<br>');
        }
    }
}
</script>

<style>

</style>