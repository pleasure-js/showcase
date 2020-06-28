<template>
  <!-- second column (examples / code) -->
  <el-col
    class="example-code-container"
    :span="12"
  >
    <div class="showcase-head example-head">
      <h2 v-if="example">
        {{ example.name }}
      </h2>
    </div>
    <div
      :class="{
        'example-code': true,
        'with-example': !!exampleTag,
        'with-code': codeViewOpened,
      }"
    >
      <div
        :class="{
          example: true,
          padded: !exampleTag,
          transparent: exampleTag
        }"
      >
        <div
          v-if="exampleTag"
          class="example-container"
        >
          <iframe
            :src="componentUrl"
            frameborder="0"
          />
          <!--<component :is="exampleTag" />-->
        </div>
        <p
          v-else
          class="no-examples"
        >
          No example found ):
        </p>
      </div>
      <div class="code">
        <retractable v-model="codeViewOpened" />
        <el-tabs
          v-model="activeCodeTab"
          class="tabs"
          @tab-click="codeViewOpened = true"
        >
          <el-tab-pane
            label="template"
            name="template"
          >
            <prism
              v-if="template"
              :code="template"
            />
            <p v-else>
              No template found
            </p>
          </el-tab-pane>
          <el-tab-pane
            label="script"
            name="script"
          >
            <prism
              v-if="script"
              language="js"
              :code="script"
            />
            <p v-else>
              No script found
            </p>
          </el-tab-pane>
          <el-tab-pane
            label="style"
            name="style"
          >
            <prism
              v-if="style"
              language="css"
              :code="style"
            />
            <p v-else>
              No style found
            </p>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-col>
</template>
<script>
import showcase from './showcase.js'
import retractable from './retractable'
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import Prism from 'vue-prism-component'

export default {
  components: {
    retractable,
    Prism
  },
  mixins: [showcase],
  props: {
    example: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      codeViewOpened: true,
      activeCodeTab: 'template'
    }
  },
  computed: {
    componentUrl () {
      return `${this.config.previewUrl}/${this.exampleTag}`
    },
    exampleTag () {
      if (!this.example) {
        return
      }
      return this.example.tagName
    },
    template () {
      if (!this.example) {
        return
      }

      return this.example.vueCode
    },
    script () {
      if (!this.example) {
        return
      }
      return this.example.scriptCode
    },
    style () {
      if (!this.example) {
        return
      }
      return this.example.styleCode
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

    .example-code {
        .example, .code {
            box-sizing: border-box;
            padding: 20px;
            width: 100%;
            position: absolute;
            left: 0;
            overflow: auto;
        }
        .example {
            top: 0;
            bottom: 50%;
            padding: 0;

            .no-examples {
                padding: 5px;
                background: var(--primary-color);
                color: var(--secondary-color)
            }

            &.transparent {
                background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsSAAALEgHS3X78AAAAKUlEQVQYlWM8c+YMAxIwNjZG5jIx4AU0lWb8//8/Mv/s2bODwmkMDAwAsTkIdMgxhkUAAAAASUVORK5CYII=') left top repeat;
            }

          &.padded {
            padding: 20px;
          }
        }
        .code {
            padding-top: 0;
            background: #e7e7e7;
            bottom: 0;
            height: 50px;
            border-top: 1px solid var(--sep-border-color);

          @media screen and (max-width: 1024px) {
            position: fixed;
          }

            .el-tabs {
                height: 100%;
                .el-tabs__item {
                    @extend .noselect;
                }
                .el-tabs__header {
                    margin-bottom: 10px;
                }
                .el-tabs__content {
                    max-height: calc(100% - 50px);
                    overflow: auto;
                }
            }

            pre {
                border-radius: 5px;
                margin: 0;
            }
        }

        &.with-code {
            .code {
                top: 50%;
                height: auto;
            }
        }
        &:not(.with-code) {
            .example {
                bottom: 50px;
            }
        }

      iframe {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: none;
        padding: 0;
      }
    }
</style>
