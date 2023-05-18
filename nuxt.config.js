import { getRoutes } from './routes';

export default {
  target: 'static',
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'magento-storefront',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/category.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://m242.local.com/graphql',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    publicPath: "/assets/"
  },
  router: {
    middleware: ['trailingSlashRedirect'],
    trailingSlash: false,
    prefetchLinks: false,
    extendRoutes(routes) {
      getRoutes()
        .forEach((route) => routes.unshift(route));
    },
    // base: '/storefront/',
    // extendRoutes(routes, resolve) {
    //   routes.push({
    //     name: "custom",
    //     path: '/test',
    //     component: resolve(__dirname, 'pages/product/_id.vue'),
    //     // redirect: '/product/18'
    //   })
    // }
  },
  loading: {
    color: 'blue',
  },
  loadingIndicator: {
    name: 'circle',
    color: '#3B8070',
    background: 'white'
  }
}
