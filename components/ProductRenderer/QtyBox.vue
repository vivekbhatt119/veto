<template>
    <b-input-group>
        <template #prepend>
            <b-button @click="qty>1 ? $emit('qty-change', qty-1, uid) : ''" squared variant="secondary">-</b-button>
        </template>
        <b-form-input type="text" disabled v-model="qty"/>
        <template #append>
            <b-button @click="$emit('qty-change', qty+1, uid)" squared variant="secondary">+</b-button>
        </template>
    </b-input-group>
</template>

<script>
export default {
    props: {
        qty: {
            type: Number,
            required: true
        },
        uid: {
            type: String,
            required: false,
            default: null
        },
    }
}
</script>

<style>

</style>