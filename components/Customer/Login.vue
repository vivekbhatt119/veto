<template>
    <b-nav-item-dropdown :text="name" right 
        v-if="isLoggedIn()">
            <b-dropdown-item to="/my-account">My Account</b-dropdown-item>
            <b-dropdown-item to="/logout">Logout</b-dropdown-item>
    </b-nav-item-dropdown>
    <b-nav-item
        v-else
        active-class="active"
        to="/login"
    >
        Login</b-nav-item
    >
</template>

<script>
export default {
    computed: {
        customer() {
            return this.$store.state.registry.currentCustomer;
        },
        name() {
            if (this.customer !== null && this.customer.hasOwnProperty('firstname') && this.customer.hasOwnProperty('lastname')) {
                return this.customer.firstname + " " + this.customer.lastname
            }
            return null;
        },
    },
    methods: {
        isLoggedIn() {
            return this.customer !== null && this.customer.hasOwnProperty('firstname');
        }
    }
}
</script>

<style>

</style>