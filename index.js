import { deepListDir } from 'deep-list-dir'
import { parseVue } from '@pleasure-js/docs'
import fs from 'fs'
import path from 'path'
import kebabCase from 'lodash/kebabCase'
import startCase from 'lodash/startCase'
import get from 'lodash/get'
import pkgUp from 'pkg-up'
import { Schema } from '@devtin/schema-validator'
import tmp from 'tmp'

const Config = new Schema({
  name: {
    type: String,
    default () {
      const { name } = require(pkgUp.sync())
      return name
    }
  },
  withElementUi: {
    type: Boolean,
    default: true
  },
  previewUrl: {
    type: String,
    default: '/showcase-preview',
    cast (v) {
      return v.replace(/\/+$/, '')
    }
  },
  url: {
    type: String,
    default: '/showcase'
  },
  componentsPath: {
    type: String,
    default: './components'
  },
  componentsExamplePath: {
    type: String,
    default: './components/examples'
  },
  componentsFindPattern: {
    type: Array,
    default () {
      return ['*.vue', '!lib', '!examples']
    }
  },
  componentsExampleFindPattern: {
    type: Array,
    default () {
      return ['*.vue']
    },
    cast (v) {
      if (typeof v === 'string') {
        return [v]
      }
      return v
    }
  },
  logoUrl: {
    type: String,
    required: false
  }
})
/*
todo:
  - read components/*.vue
  - read and match pages/showcase/examples
  - create json
*/

const loadFile = file => fs.readFileSync(file).toString()

function pluginImportStore (data) {
  return `
  if (!context.store) {
    Vue.use(Vuex)
  }
  Vue.prototype.$showcase = new Vuex.Store({
    state () {
      return ${JSON.stringify(data, null, 2)}
    }
  })`
}

function functionExport (add) {
  return ['export default function (context) {', ...add, '}'].join('\n')
}

function setupElementUi () {
  const modules = [
    'import Element from \'element-ui\'',
    'import locale from \'element-ui/lib/locale/lang/en\''
  ]

  const setup = [
    'Vue.use(Element, { locale })'
  ]
  return {
    modules,
    setup
  }
}

function composeImportComponents (componentsPlugin) {
  const imports = []
  const componentRegistration = []
  componentsPlugin.forEach((component) => {
    const { relativePath, componentVarName, tagName } = component
    imports.push(`import ${componentVarName} from '${relativePath}'`)
    componentRegistration.push(`Vue.component('${tagName}', ${componentVarName})`)
  })

  return `${imports.join('\n')}\n\n${componentRegistration.join('\n')}`
}

/**
 * @typedef {Object} VueComponentExample
 * @property {String} name - Example name
 * @property {String} vueCode - template part of the component
 * @property {String} [scriptCode] - script part of the component
 * @property {String} [styleCode] - style part of the component
 */

/**
 * @typedef {Object} VueComponent
 *
 * @property {String} name - Name of the component
 * @property {String} tagName - Tag name of the component
 * @property {String} jsdocMd - Markdown version of the component jsdoc
 * @property {VueComponentExample[]} examples
 */

/**
 * @param {Object} [moduleOptions]
 * @return {Promise<void>}
 */
export default async function (moduleOptions = {}) {
  const config = Config.parse(moduleOptions)

  if (config.withElementUi) {
    this.options.css.push('element-ui/lib/theme-chalk/reset.css')
    this.options.css.push(path.join(__dirname, 'lib/element-ui.scss'))
  }

  this.extendRoutes((routes, resolve) => {
    console.log(resolve(__dirname, 'lib/showcase.vue'))
    routes.push({
      name: 'showcase',
      path: config.url,
      component: resolve(__dirname, 'lib/showcase.vue')
    })
    routes.push({
      name: 'showcase',
      path: `${config.previewUrl}/:component`,
      component: resolve(__dirname, 'lib/showcase-iframe.vue')
    })
  })

  const componentsDir = path.resolve(this.options.srcDir, config.componentsPath)
  const componentsExampleDir = path.join(this.options.srcDir, config.componentsExamplePath)

  // todo: change for a tmp file
  // const pluginDst = `${this.options.srcDir}/plugins/components.js`
  const pluginDst = tmp.tmpNameSync() // `${this.options.srcDir}/plugins/components.js`
  console.log({ pluginDst })

  // load vue components file list
  const createdComponents = await deepListDir(componentsDir, { pattern: config.componentsFindPattern })
  // load example vue components file list
  // load example vue components file list
  const createdComponentsExamples = await deepListDir(componentsExampleDir, { pattern: config.componentsExampleFindPattern })

  const importComponents = createdComponents.map(file => {
    const tagName = kebabCase(path.basename(file, '.vue'))
    const componentVarName = startCase(tagName).replace(/[\s]+/g, '')
    return {
      relativePath: `~/components/${path.relative(componentsDir, file)}`,
      tagName,
      componentVarName
    }
  })

  importComponents.push(...createdComponentsExamples.map(file => {
    const tagName = 'showcase-' + kebabCase(path.relative(componentsExampleDir, file).replace(/\.vue$/i, ''))
    const componentVarName = startCase(tagName).replace(/[\s]+/g, '')
    return {
      relativePath: `~/components/${path.relative(componentsDir, file)}`,
      tagName,
      componentVarName
    }
  }))

  const createdComponentsJSON = createdComponents.map(file => {
    const tag = kebabCase(path.basename(file, '.vue'))
    const examples = createdComponentsExamples
      .filter(exampleFile => {
        return path.basename(path.relative(componentsExampleDir, exampleFile).split('/')[0], '.vue') === tag
      })
      .map(exampleFile => {
        const parsedExample = parseVue(fs.readFileSync(exampleFile).toString())
        const tagName = 'showcase-' + kebabCase(path.relative(componentsExampleDir, exampleFile).replace(/\.vue$/i, ''))

        return {
          name: startCase(path.basename(exampleFile, '.vue')),
          vueCode: get(parsedExample, 'template.match'),
          scriptCode: get(parsedExample, 'script.match'),
          styleCode: get(parsedExample, 'style.match'),
          tagName
        }
      })
    return {
      file,
      tag,
      component: parseVue(loadFile(file)),
      examples
    }
  })

  const { modules: elementUiModules, setup: elementUiSetup } = setupElementUi()
  const componentsPlugin = ['import Vue from \'vue\'', 'import Vuex from \'vuex\'']

  if (config.withElementUi) {
    componentsPlugin.push(...elementUiModules)
  }

  const functionExportPayload = [
    pluginImportStore({
      components: createdComponentsJSON,
      config
    })
  ]

  if (config.withElementUi) {
    functionExportPayload.push(...elementUiSetup)
  }

  componentsPlugin.push(composeImportComponents(importComponents), functionExport(functionExportPayload))

  fs.writeFileSync(pluginDst, componentsPlugin.join('\n'))
  this.addPlugin(pluginDst)
}
