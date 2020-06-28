<template>
  <el-col
    :span="8"
  >
    <div class="showcase-head docs-head">
      <h2><slot name="head" /></h2>
    </div>
    <slot name="default" />
  </el-col>
</template>
<script>
export default {
  props: {
    docs: {
      type: String,
      default: null
    }
  }
}
</script>
<style lang="postcss">
    .docs-container {
        @media screen and (max-width: 1024px) {
            right: 0;
            top: 0;
            position: fixed!important;
            z-index: 10000;
            transition: all .15s ease-out;
            transform: translateX(100%);

            &.opened {
                transform: translateX(0);
            }
        }
    }
</style>
