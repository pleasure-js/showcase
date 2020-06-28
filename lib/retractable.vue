<template>
  <span
    :class="{
      retractable: true,
      on: value
    }"
    @click="toggle"
  >
    <i class="el-icon-caret-bottom" />
  </span>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    toggle () {
      this.$emit('input', !this.value)
    }
  }
}
</script>
<style lang="postcss">
  span.retractable {
    display: block;
    position: absolute;
    padding: 15px;
    right: 0;
    top: 0;
    z-index: 100;
    cursor: pointer;

    &:not(.on) {
      i {
        transform: rotateZ(180deg);
      }
    }
  }
</style>
