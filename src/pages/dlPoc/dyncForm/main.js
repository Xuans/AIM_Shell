import Vue from 'vue'
import App from './index.vue'


(function () {
  const app=window.app;
  if (app && app.dispatcher) {
    app.dlPoc = app.dlPoc || {};
    app.dlPoc.dyncForm = function (viewId) {
      window.AIM_SHELL = new Vue({
        render: h => h(App),
      }).$mount(`#${viewId}`);
    }
  } else {
    window.AIM_SHELL = new Vue({
      render: h => h(App),
    }).$mount('#app');
  }
}());


