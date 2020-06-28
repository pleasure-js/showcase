<template>
  <div
    class="icon-button"
    @click="toggle()"
  >
    <i :class="!value ? iconA : iconB" />
  </div>
</template>
<script>
export default {
  props: {
    iconA: {
      type: [String, Object],
      required: true
    },
    iconB: {
      type: [String, Object],
      required: true
    },
    value: {
      type: Boolean,
      default: false
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
    :root {
        --box: var(--menu-box, 30px);
    }

    .icon-button {
      display: flex;
      width: var(--box);
      height: var(--box);
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 15px;
      font-size: 25px;
    }
</style>
