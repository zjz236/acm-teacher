let plugins=[]
if (process.env.PATH_TYPE==='pro'){
	plugins.push('transform-remove-console')
}
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
	env: {
		PATH_TYPE: process.env.PATH_TYPE
	},
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
	},
	/*
	** Build configuration
	*/
	build: {
		/*
		** You can extend webpack config here
		*/
		babel:{
			"plugins":plugins
		},
		vendor:['external_library'],
		extend(config, ctx) {
		}
	}
}
