//import Vue from 'vue'
import App from './App.vue'

class Target {
  constructor ({serviceId} = {serviceId: 0}) {
    this.inputId = this.id = serviceId
    this.type = 0
    this.versions = Array.of({name: 0}, {name: 1}, {name: 2})
    this.head = 2
  }

  get lastest () {
    return this.head === this.versions[this.versions.length - 1].name
  }
}

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

    app.dlPoc.serviceDesign = function (viewId, serviceId) {
      return dispay(viewId, serviceId)
    }
  } else {
    window.AIM_SHELL = new AppCtr({propsData: { target: new Target() }}).$mount('#app')
  }
}())
