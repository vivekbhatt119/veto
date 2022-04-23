<template>
    <div>
        <p>loging out</p>
    </div>
</template>

<script>
export default {
    created() {
        this.$store.commit("logout");
        this.$router.push({ name: 'home', query: { redirect: '/' } });
    }
}
</script>
