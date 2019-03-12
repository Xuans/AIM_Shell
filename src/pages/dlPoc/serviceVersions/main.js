//import Vue from 'vue'
import App from './App.vue'

class Target {
  constructor ({serviceId} = {serviceId: 0}) {
    this.service_ename= this.id = item.tree_node_name||serviceId
    this.service_ename =item.tree_node_desc
    this.tree_p_node_name=item.tree_node_name
    this.service_content={}
    this.service_args=[]
    // this.name=tree_node_desc
    this.type = 0;
    this.versions = Array.of({ name: 0 }, { name: 1 }, { name: 2 });
    this.head = 0;
  }

  cloneByVersion (version) {
    let target = new Target({serviceId: this.id})

    target.head = version.name

    return target
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

    app.dlPoc.serviceVersions = function (viewId, serviceId) {
      return dispay(viewId, serviceId)
    }
  } else {
    window.AIM_SHELL = new AppCtr({propsData: { target: new Target() }}).$mount('#app')
  }
}())
