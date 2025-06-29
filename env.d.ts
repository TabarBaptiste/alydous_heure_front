/// <reference types="vite/client" />

// Pour que TS sache importer les .vue
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// Pour que TS trouve le flat config d’Eslint (même si tu le désactives pour le build)
declare module 'eslint/config'
declare module '@vue/eslint-config-typescript'
declare module '@vitest/eslint-plugin'
declare module 'eslint-plugin-vue'