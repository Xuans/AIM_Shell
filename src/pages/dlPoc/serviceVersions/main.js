//import Vue from 'vue'
import App from './App.vue'
import {
  VersionTarget as Target
} from "../../../../public/chunk-vendors/js/Target";


(function () {
  const app = window.app
  const AppCtr = Vue.extend(App)

  if (app && app.dispatcher) {
    app.dlPoc = app.dlPoc || {}

    let isFirst = true
    /**
     * 
     * @param {*} viewId 
     * @param {*} serviceId 
     * @param {*} versions 完整版本组
     * @param {*} sv_id 当前版本ID，undefined时表示为开发版本
     */
    const dispay = function (viewId, service_id, versions, sv_id) {

      let ins = new AppCtr({
        propsData: {
          target: new Target({
            service_id,
            sv_id,
            id:service_id,
          }),
          versions,
        }
      }).$mount(`#${viewId}`)

      window.AIM_SHELL = ins

      return ins
    }

    app.dlPoc.serviceVersions = function (viewId, serviceId) {
      const versions = app.domain.get('serviceVersions', 'versions');
      const sv_id = app.domain.get('serviceVersions', 'sv_id');
      let sid = app.domain.get('serviceVersions', 'service_id');
      // console.log('app.dlpoc',{viewId,versions,sv_id,sid,serviceId});
      return dispay(viewId, sid, versions, sv_id)
    }
  } else {
    window.AIM_SHELL = new AppCtr({
      propsData: {
        target: Target.makeNull()
      }
    }).$mount('#app')
  }
}())