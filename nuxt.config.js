export default {
	mode: 'universal',
	/*
	** Headers of the page
	*/
	head: {
		title: process.env.npm_package_name || '',
		meta: [
			{charset: 'utf-8'},
			{name: 'viewport', content: 'width=device-width, initial-scale=1'},
			{hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
		],
		link: [
			{rel: 'icon', type: 'image/x-icon', href: '/logo.ico'}
		]
	},
	/*
	** Customize the progress-bar color
	*/
	loading: {color: '#fff'},
	/*
	** Global CSS
	*/
	css: [
		'iview/dist/styles/iview.css',
		'quill/dist/quill.snow.css',
		'quill/dist/quill.bubble.css',
		'quill/dist/quill.core.css'
	],
	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
		'@/plugins/iview'
	],
	/*
	** Nuxt.js dev-modules
	*/
	devModules: [],
	/*
	** Nuxt.js modules
	*/
	modules: [
		// Simple usage
		'cookie-universal-nuxt',

		// With options
		['cookie-universal-nuxt', { alias: 'cookiz' }],
		'@nuxtjs/axios'
	],
	axios:{
		proxy:true
	},
	proxy:{
		'/api':'http://127.0.0.1:1236'
	},
	/*
	** Build configuration
	*/
	build: {
		/*
		** You can extend webpack config here
		*/
		vendor:['external_library'],
		extend(config, ctx) {
		}
	}
}
