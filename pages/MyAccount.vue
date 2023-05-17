<template>
    <b-row>
        <b-col sm="3">
            <b-navbar toggleable type="dark" variant="dark">
                <b-navbar-brand href="#">My Account</b-navbar-brand>

                <b-navbar-toggle target="navbar-toggle-collapse"></b-navbar-toggle>

                <b-collapse :visible="!isMobile()" id="navbar-toggle-collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item
                            active-class="active"
                            :to="'/my-account/'"
                        >
                        My Account</b-nav-item
                        >
                        <b-nav-item
                            active-class="active"
                            :to="'/my-account/orders'"
                        >
                        My Orders</b-nav-item
                        >
                        <b-nav-item
                            active-class="active"
                            :to="'/my-account/downloadable'"
                        >
                        My Downloadable Products</b-nav-item>
                        <b-nav-item
                            active-class="active"
                            :to="'/my-account/whishlist'"
                        >
                        My Whish List</b-nav-item>
                        <b-nav-item
                            active-class="active"
                            :to="'/my-account/address'"
                        >
                        Address Book</b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </b-col>
        <b-col sm="9">
            <account v-if="!$route.params.pageName"/>
            {{page}}
            <pre>
                {{customer}}
            </pre>
        </b-col>
    </b-row>
</template>

<script>
import Account from '../components/Customer/Account.vue';
export default {
  components: { Account },
    data() {
        return {
            page: this.$route.params.pageName
        }
    },
    computed: {
        customer() {
            return this.$store.state.registry.currentCustomer;
        }
    },
    created() {
        if (null === this.customer) {
            this.$router.push({ name: 'login', query: { redirect: '/login' } });
        }
    },
    methods: {
        isMobile() {
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true
            } else {
                return false
            }
        }
    }
}
</script>

<style>

</style>