module.exports = {
	/*
  ** Headers of the page
  */
	head: {
		title: '回覆平台',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				hid: 'description',
				name: 'description',
				content: 'Nuxt.js project',
			},
		],
		script: [
			{
				src:
					'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js',
			},
		],

		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},
	/*
  ** Global CSS
  */
	css: [
		'element-ui/lib/theme-chalk/reset.css',
		'element-ui/lib/theme-chalk/index.css',
	],
	/*
  ** Customize the progress bar color
  */
	loading: { color: '#3B8070' },
	/*
  ** Build configuration
  */
	build: {
		/*
    ** Run ESLint on save
    */
		extend(config, { isDev, isClient }) {
			if (isDev && isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/,
				});
			}
		},
	},
	modules: [
		// "bootstrap-vue/nuxt",
		// // Or if you have custom bootstrap CSS...
		// ["bootstrap-vue/nuxt", { css: false }]
	],
	plugins: [
		{ src: '~/plugins/FacebookSDK', ssr: false },
		'~/plugins/element-ui',
	],
};
