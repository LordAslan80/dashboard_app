/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// vue-router declaration
declare module 'vue-router' {
  export * from 'vue-router/dist/vue-router.mjs'
}