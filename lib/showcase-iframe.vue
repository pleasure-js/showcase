<template>
  <div class="container">
    <component :is="component" />
  </div>
</template>
<script>
export default {
  computed: {
    component () {
      return this.$route.params.component
    }
  }
}
</script>
<style lang="postcss">
  html {
    background: transparent!important;
  }
  .container {
    padding: 50px;
  }
</style>
