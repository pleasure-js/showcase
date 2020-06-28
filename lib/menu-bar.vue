<template>
  <div
    ref="bars"
    :class="styleClass"
    @click="$emit('click')"
  >
    <div />
    <div />
  </div>
</template>
<style lang="postcss">
  :root {
    --box: var(--menu-box, 30px);
    --line-height: 2px;
    --space: 8px;
    --menu-bars-top-gap: 0;
    --menu-bars-color: #fff;
    --menu-bars-color-over: #e7e7e7;
  }

  ::placeholder {
    color: gray;
  }

  .menu-bars {
    transition: all .3s easeOutBack;
    transition-delay: .2s;
    display: block;
    left: 0;
    top: var(--menu-bars-top-gap);
    position: fixed;
    z-index: 110;
    width: var(--box);
    height: var(--box);
    margin: 15px 20px;
    cursor: pointer;

    &.hide {
      opacity: 0 !important;
    }

    > div {
      display: block;
      position: absolute;
      height: var(--line-height);
      width: 100%;
      opacity: 1;
      left: 0;
      transition: all .3s ease-out 0s;
      transform-origin: 50% 50%;
      transform: rotate(0deg);
      background-color: var(--menu-bars-color);
      z-index: 2000;

      &:nth-child(1) {
        top: calc(calc(var(--box) / 3) + calc(var(--line-height) / -2));
      }

      &:nth-child(2) {
        top: calc(calc(var(--box) * 2 / 3) + calc(var(--line-height) / -2));
      }
    }

    &:hover {
      > div {
        background-color: var(--menu-bars-color-over);
      }
    }

    &.state-back {
      > div {
        width: 70%;

        &:nth-child(1) {
          top: calc(var(--box) / 2);
          transform-origin: 0 0;
          transform: rotate(-45deg);
        }

        &:nth-child(2) {
          top: calc(calc(var(--box) / 2) - var(--line-height));
          transform-origin: 0 100%;
          transform: rotate(45deg);
        }
      }
    }

    &.state-close {
      > div {
        top: calc(calc(var(--box) / 2) + calc(var(--line-height) / -2));
        transform-origin: 50% 50%;

        &:nth-child(1) {
          transform: rotate(-45deg);
        }

        &:nth-child(2) {
          transform: rotate(45deg);
        }
      }
    }
  }
</style>
<script>
export default {
  props: {
    /**
     * Adds a gap between the bars and the viewport edge.
     */
    sideNavigation: {
      type: Boolean,
      default: false
    },
    state: {
      type: String,
      default: 'open'
    }
  },
  data () {
    return {
      theState: this.state,
      theSideNavigation: this.sideNavigation
    }
  },
  computed: {
    styleClass () {
      return {
        'menu-bars': true,
        [`state-${this.theState}`]: true
      }
    }
  },
  methods: {
    setState (s) {
      return this.theState = s
    }
  }
}
</script>
