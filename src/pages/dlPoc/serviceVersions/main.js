//import Vue from 'vue'
import App from './App.vue'
import { VersionTarget as Target } from "../../../../public/chunk-vendors/js/Target";


(function () {
  const app = window.app
  const AppCtr = Vue.extend(App)

  if (app && app.dispatcher) {
    app.dlPoc = app.dlPoc || {}

    let isFirst = true
    const dispay = function (viewId, serviceId) {
      let ins = new AppCtr({
        propsData: {
          target: new Target({serviceId})
        }
      }).$mount(`#${viewId}`)

      window.AIM_SHELL = ins

      return ins
    }

    app.dlPoc.serviceVersions = function (viewId, serviceId) {
      return dispay(viewId, serviceId)
    }
  } else {
    window.AIM_SHELL = new AppCtr({propsData: { target: Target.makeNull() }}).$mount('#app')
  }
}())
