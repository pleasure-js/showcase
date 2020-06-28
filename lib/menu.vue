<template>
  <div class="sc-menu">
    <div
      :class="{ 'item-container': true, expanded }"
    >
      <a
        :class="{
          item: true,
          multiple,
          on: selected === 0 && !multiple,
        }"
        @click="multiple ? toggle() : $emit('click', 0)"
      >
        {{ component.tag }}
        <retractable
          v-if="multiple"
          v-model="expanded"
          state-a="sort-down"
          state-b="caret-down"
          @click.native.stop
        />
      </a>
      <div
        v-if="multiple && expanded"
        class="children"
      >
        <a
          v-for="(example, id) in component.examples"
          :key="`${ component.tag }-${ id }`"
          :class="{
            item: true,
            on: selected === id
          }"
          @click="$emit('click', id)"
        >{{ example.name }}</a>
      </div>
    </div>
  </div>
</template>
<script>
import retractable from './retractable.vue'

export default {
  components: {
    retractable
  },
  props: {
    selected: {
      type: Number,
      default: null
    },
    component: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      expanded: false
    }
  },
  computed: {
    multiple () {
      return this.component.examples.length > 1
    },
    type () {
      return this.multiple ? 'div' : 'a'
    }
  },
  methods: {
    toggle () {
      this.expanded = !this.expanded
    }
  }
}
</script>
<style lang="postcss">
  .noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .sc-menu {
    @extend .noselect;
    a.item, div.item {
      display: block;
      position: relative;
      padding: 15px;
      background: var(--component-link-background);
      cursor: pointer;
    }
    a.item:not(.multiple) {
      &:hover, &.on {
        &:after {
          content: '';
          background: var(--component-link-bar-color);
          display: block;
          position: absolute;
          width: 3px;
          left: 0;
          top: 5px;
          bottom: 5px;
        }
      }
    }
    .item-container {
      position: relative;
    }
    .expanded {
      > a:after {
        display: block;
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        border-top: 1px solid #000;
        width: 100%;
      }
    }
  }
</style>
