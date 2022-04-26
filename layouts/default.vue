<template>
  <div>
    <b-navbar type="light" variant="light">
      <nuxt-link active-class="active" to="/" class="navbar-brand">
        IDS
      </nuxt-link>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="m-auto">
          <b-nav-form>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="Search"
            ></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit"
              >Search</b-button
            >
          </b-nav-form>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <login />
          <b-nav-item
            active-class="active"
            to="/cart"
          >Cart</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nav-tree :categories="categories"/>
    <b-container>
        <b-alert :variant="msg.type" v-for="msg in JSON.parse(JSON.stringify($store.state.registry.message))" :key="msg.msg" show="5">
            {{ msg }}
        </b-alert>
        <Nuxt />
    </b-container>
  </div>
</template>

<script>
import Cart from '../components/Customer/Cart.vue';
import Login from '../components/Customer/Login.vue';
import NavTree from '../components/NavTree.vue';
import payload from '../payload';
export default {
    components: { NavTree, Login, Cart },
    data() {
        return {
            categoryList: [],
        };
    },
    computed: {
        categories: function () {
            return this.categoryList.sort((a, b) => a.position - b.position);
        },
        message() {
            return this.$store.state.registry.message;
        },
    },
    mounted() {
        this.$store.commit("renderedMessage");
    },
    async created() {
        const categories = await this.$axios({
            method: "post",
            url: this.$axios.defaults.baseURL,
            data: {
                query: payload.categoryList(),
            },
            headers: {
                Authorization: `Bearer 2ic383bgxtr97q8s0y0bq99q55vaelg4`,
            },
        });
        this.categoryList = categories.data.data.categoryList;
    },
};
</script>

<style>
.loader {
    position: absolute;
    left: 50%;
    border: 4px solid #f3f3f3;
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 30px;
    height: 30px;
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;
}
div { position: relative; }
</style>
