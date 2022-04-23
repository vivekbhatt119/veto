<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="m-auto">
          <template v-for="category in categories">
            <b-nav-item-dropdown
              :text="category.name"
              left
              :key="category.uid"
              v-if="category.children_count > 0"
            >
              <b-dropdown-item
                v-for="child in category.children.slice(0, 5)"
                active-class="active"
                :key="child.uid"
                :to="'/c/' + child.url_path + child.url_suffix"
                >{{ child.name }}</b-dropdown-item
              >
            </b-nav-item-dropdown>
            <b-nav-item
              v-if="category.children_count == 0"
              active-class="active"
              :to="'/c/' + category.url_path + category.url_suffix"
              :key="category.uid"
            >
              {{ category.name }}</b-nav-item
            >
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
</template>

<script>
export default {
    props: {
        categories: {
            type: Array,
            required: true
        }
    }
}
</script>