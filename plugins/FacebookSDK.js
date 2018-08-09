// window.fbAsyncInit = function() {
//   console.log(object);
//   // FB.init({
//   //   appId: "2072626629656965",
//   //   xfbml: true,
//   //   version: "v3.1"
//   // });
//  // FB.AppEvents.logPageView();
// };

// (function(d, s, id) {
//   var js,
//     fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) {
//     return;
//   }
//   js = d.createElement(s);
//   js.id = id;
//   js.src = "https://connect.facebook.net/en_US/sdk.js";
//   fjs.parentNode.insertBefore(js, fjs);
// })(document, "script", "facebook-jssdk");

// import Vue from "vue";
// Vue.prototype.$fb = () => {
//   FB.init({
//     appId: "2072626629656965",
//     xfbml: true,
//     version: "v3.1"
//   });
// };

const vue_fb = {};
vue_fb.install = function install(Vue, options) {
	(function(d, s, id) {
		var js,
			fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = '//connect.facebook.net/en_US/sdk.js';
		fjs.parentNode.insertBefore(js, fjs);
		console.log('setting fb sdk');
	})(document, 'script', 'facebook-jssdk');

	window.fbAsyncInit = function onSDKInit() {
		FB.init(options);
		FB.AppEvents.logPageView();

		window.dispatchEvent(new Event('fb-sdk-ready'));
		Vue.prototype.FB = FB;
	};
	Vue.FB = undefined;
};

import Vue from 'vue';

Vue.use(vue_fb, {
	appId: '1096985323792603',
	autoLogAppEvents: true,
	xfbml: true,
	version: 'v3.1',
});
