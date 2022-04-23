<template>
    <b-input-group>
        <template #prepend>
            <b-button @click="qty>1 ? qty-- : ''" squared variant="secondary">-</b-button>
        </template>
        <b-form-input type="text" disabled v-model="qty"/>
        <template #append>
            <b-button @click="qty++" squared variant="secondary">+</b-button>
        </template>
    </b-input-group>
</template>

<script>
export default {
    props: {
        qty: {
            type: Number,
            required: true,
        },
    },
};
</script>