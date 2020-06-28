<template>
  <!-- first column (components) -->
  <el-col
    :class="{
      'showcase-components-container': true,
      opened
    }"
    :span="4"
  >
    <div class="showcase-head project-head">
      <h2 v-if="!config.logoUrl">
        {{ projectName }}
      </h2>
      <img
        v-else
        :src="config.logoUrl"
        :alt="projectName"
        class="logo"
      >
    </div>
    <div class="components">
      <sc-menu
        v-for="(component, id) in components"
        :key="component.file"
        :component="component"
        :selected="selectedComponent === id ? selectedExample : null"
        @click="$emit('select-example', { component: id, example: $event })"
      />
    </div>
  </el-col>
</template>
<script>
import ScMenu from './menu'
import showcase from './showcase.js'

export default {
  components: {
    ScMenu
  },
  mixins: [showcase],
  props: {
    selectedExample: {
      type: Number,
      default: 0
    },
    selectedComponent: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      opened: false
    }
  },
  methods: {
    toggle (force) {
      this.opened = force !== undefined ? force : !this.opened
      this.$emit(this.opened ? 'opened' : 'closed')
    }
  }
}
</script>
<style lang="postcss">
  .showcase-components-container {
    width: var(--components-width);

    @media screen and (max-width: 1024px) {
      left: 0;
      top: 0;
      position: fixed!important;
      z-index: 10000;
      transition: all .15s ease-out;
      transform: translateX(-100%);

      &.opened {
        transform: translateX(0);
      }
    }
  }
</style>
