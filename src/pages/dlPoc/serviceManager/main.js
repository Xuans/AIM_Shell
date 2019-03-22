//import Vue from 'vue'
import App from './index.vue'

(function () {
  const app=window.app;
  const AppCtr = Vue.extend(App)
  if (app && app.dispatcher) {
    app.dlPoc = app.dlPoc || {};
    app.dlPoc.serviceManager = function (viewId) {
      // window.AIM_SHELL = new Vue({
      //   render: h => h(App),
      // }).$mount(`#${viewId}`);
      //跳转到服务时聚焦操作
      const selection =app.domain.get('serviceManager','selection')||{};
      window.serviceManage=new AppCtr({
        propsData: {
          selection,
        }
      }).$mount(`#${viewId}`)


    }
  } else {
    window.AIM_SHELL = new Vue({
      render: h => h(App),
    }).$mount('#app');
  }
}());


