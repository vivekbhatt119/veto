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
          <cart />
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <nav-tree :categories="categories"/>
    <b-container>
      <Nuxt />
    </b-container>
  </div>
</template>

<script>
import Cart from '../components/Customer/Cart.vue';
import Login from '../components/Customer/Login.vue';
import NavTree from '../components/NavTree.vue';
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
  },
  async created() {
    const categories = await this.$axios({
      method: "post",
      url: this.$axios.defaults.baseURL,
      data: {
        query: `
          {
          categoryList(
            filters: {
              parent_id: {eq: "2"},
            }
          ) {
            children_count
            uid
            level
            name
            url_key
            url_path
            url_suffix
            include_in_menu
            position
            children {
              uid
              level
              name
              url_key
              url_path
              url_suffix
              include_in_menu
              position
              children_count
              children {
                uid
                level
                name
                url_key
                url_path
                url_suffix
                include_in_menu
                position
                children_count
              }
            }
          }
        }
        `,
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
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
