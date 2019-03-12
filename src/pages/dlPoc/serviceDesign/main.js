//import Vue from 'vue'
import App from './App.vue'
import { Target } from './Target';

(function () {
  const app = window.app
  const AppCtr = Vue.extend(App)

  if (app && app.dispatcher) {
    app.dlPoc = app.dlPoc || {}

    let isFirst = true
    const dispay = function (viewId, serviceId,item) {
      let ins = new AppCtr({
        propsData: {
          target: new Target(item)
        }
      }).$mount(`#${viewId}`)

      window.AIM_SHELL = ins

      return ins
    }

    app.dlPoc.serviceDesign = function (viewId, serviceId) {
      const item =app.domain.get('serviceItem','data');

      return dispay(viewId, serviceId,item)
    }
  } else {
    window.AIM_SHELL = new AppCtr({propsData: { target: new Target() }}).$mount('#app')
  }
}())
