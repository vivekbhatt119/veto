<template>
  <div>
        <b-alert :variant="msg.type" v-for="msg in message" :key="msg.msg" show>
            {{ msg.msg }}
        </b-alert>
  </div>
</template>

<script>
export default {
    computed: {
        message() {
            return this.$store.state.registry.message;
        },
    },
    watch: {
      message() {
        if (this.message.length) {
          setTimeout(() => {
              this.$store.commit("renderedMessage");
          }, 5000);
        }
      }
    },
}
</script>

<style>

</style>