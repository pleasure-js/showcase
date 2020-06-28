export default {
  computed: {
    components () {
      return this.$showcase.state.components
    },
    config () {
      return this.$showcase.state.config
    },
    projectName () {
      return this.$showcase.state.config.name
    }
  }
}
