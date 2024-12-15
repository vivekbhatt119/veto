<template>
    <b-form-group v-slot="{ ariaDescribedby }">
        <b-form-radio
            v-for="method in methods"
            :key="method.carrier_code"
            v-model="selected"
            :aria-describedby="ariaDescribedby"
            name="some-radios"
            :value="method.code">
            {{method.method_title}}
        </b-form-radio>
    </b-form-group>
</template>

<script>
export default {
    props: {
        methods: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            selected: ""
        }
    }
}
</script>