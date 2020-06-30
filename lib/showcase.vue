<template>
  <div id="main-showcase">
    <el-row
      class="showcase"
      :gutter="0"
    >
      <menu-bar
        ref="hamburger"
        class="hamburger-menu"
        @click="$refs['showcase-component'].toggle()"
      />
      <icon-button
        v-model="docsOpened"
        class="toggle-docs"
        icon-a="el-icon-info"
        icon-b="el-icon-error"
      />
      <!-- first column (components) -->
      <showcase-components
        ref="showcase-component"
        :selected-example="selectedExample"
        :selected-component="selectedComponent"
        @opened="$refs.hamburger.setState('close')"
        @closed="$refs.hamburger.setState('open')"
        @select-example="select"
      />

      <!-- second column (examples / code) -->
      <example-component
        :example="example"
      />

      <!-- third column (props / docs) -->
      <docs-component
        :docs="docs"
        :class="{
          opened: docsOpened
        }"
      />
      <div
        :class="{
          'modal-overlay': true,
          on: modalShow
        }"
        @click="hideDocsAndMenu()"
      />
    </el-row>
  </div>
</template>
<script>
import './style.pcss'
import marked from 'marked'
import ShowcaseComponents from './showcase-components.vue'
import showcase from './showcase.js'
import MenuBar from './menu-bar.vue'
import ExampleComponent from './example-component'
import DocsComponent from './docs-component'
import IconButton from './icon-button.vue'

export default {
  components: {
    ExampleComponent,
    IconButton,
    MenuBar,
    ShowcaseComponents,
    DocsComponent
  },
  mixins: [showcase],
  data () {
    return {
      selectedExample: 0,
      selectedComponent: null,
      selected: null,
      mounted: false,
      docsOpened: false
    }
  },
  computed: {
    showcaseComponentOpened () {
      return this.mounted && this.$refs['showcase-component'].opened
    },
    modalShow () {
      return this.showcaseComponentOpened || this.docsOpened
    },
    docs () {
      if (this.selectedComponent === null || !this.components[this.selectedComponent].component.script || this.components[this.selectedComponent].component.script.jsdocMd === '') {
        return '<p>No docs found</p>'
      }

      return marked(this.components[this.selectedComponent].component.script.jsdocMd)
    },
    example () {
      if (this.selectedComponent === null || this.components[this.selectedComponent].examples.length === 0) {
        return
      }
      return this.components[this.selectedComponent].examples[this.selectedExample]
    }
  },
  watch: {
    selectedComponent (v) {
      if (!isNaN(v) && v >= 0) {
        this.$router.push(`./${this.components[v].tag}`)
      }
    },
    docsOpened (v) {
      if (v) {
        this.$refs['showcase-component'].toggle(false)
      }
    },
    showcaseComponentOpened (v) {
      if (v) {
        this.docsOpened = false
      }
    }
  },
  mounted () {
    this.mounted = true
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    if (isSafari) {
      document.querySelector('html').classList.add('safari')
    }

    if (this.$route.params.component) {
      const component = this.components.map(({ tag }) => tag).indexOf(this.$route.params.component)
      if (component >= 0) {
        this.selectedComponent = component
      }
    }
  },
  methods: {
    select ({ component, example }) {
      this.$refs['showcase-component'].toggle(false)
      this.selectedComponent = component
      this.selectedExample = example
    },
    hideDocsAndMenu () {
      this.$refs['showcase-component'].toggle(false)
      this.docsOpened = false
    }
  },
  head: {
    title: 'Showcase'
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

  .toggle-docs {
    position: fixed;
    right: 0;
    top: 0;
    color: white;
    z-index: 100001;
    display: none;

    @media screen and (max-width: 1024px) {
      display: block;
    }
  }

  .showcase {
    .menu-bars {
      position: fixed;
      display: none;
      z-index: 10010;
    }

    @media screen and (max-width: 1024px) {
      .menu-bars {
        display: block;
      }

      .showcase-components-container, .docs-container {
        max-width: 480px;
        width: calc(100% - 70px)!important;
      }
    }

    a {
      @extend .noselect;
      cursor: pointer;
      color: var(--component-link-color);
    }

    > .el-col {
      position: relative;
      min-height: 100vh;

      html.safari & {
        /* mobile viewport bug fix */
        min-height: -webkit-fill-available;
      }
    }

    .example-code-container {
      width: calc(100% - var(--components-width) - var(--docs-width));

      @media screen and (max-width: 1024px) {
        width: 100%;
      }
    }

    .docs-container {
      width: var(--docs-width);
    }

    .components, .example-code, .docs {
      position: absolute;
      left: 0;
      top: 60px;
      width: 100%;
      bottom: 0;
      box-sizing: border-box;
      overflow: auto;
    }

    .components, .docs {
      background: #f7f7f7;
      padding: 20px;
    }

    .components {
      border-right: 1px solid var(--sep-border-color);
    }

    .docs {
      line-height: 1.3em;
      text-align: left;
      border-left: 1px solid var(--sep-border-color);

      table {
        border-collapse: collapse;
      }

      table, th, td {
        border: 1px solid black;
      }

      th, td {
        padding: 10px;
      }

      h1, h2 {
        color: var(--primary-color);
      }

      strong, th {
        color: #666;
      }
    }

    .modal-overlay {
      position: fixed;
      width: 100vw;
      height: 100vh;

      html.safari & {
        /* mobile viewport bug fix */
        height: -webkit-fill-available;
      }

      left: 0;
      top: 0;
      background: rgba(0,0,0, .8);
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity .15s ease-in;
      display: none;

      @media screen and (max-width: 1024px) {
        display: block;
      }

      &.on {
        pointer-events: all;
        opacity: 1;
      }
    }
  }
</style>
