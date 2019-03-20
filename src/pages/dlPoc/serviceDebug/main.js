//import Vue from 'vue'
import App from './App.vue'
import {
  DebugTarget as Target
} from "../../../../public/chunk-vendors/js/Target";


(function () {
  const app = window.app
  const AppCtr = Vue.extend(App)

  if (app && app.dispatcher) {
    app.dlPoc = app.dlPoc || {}

    //Log 测试数据
    const log_data = [{
      "instance_id": "4575167f-7019-4388-9f82-029cdf8c42e7",
      "schedule_time": 1552923645000,
      "schedule_result": "1",
      "schedule_log": "\n脚本测试\nsucc",
      "service_id": "5fb66b72-da8f-4885-9743-a223571c51c7",
      "shell_id": "shell Echo 1-1",
      "schedule_taketime": "51",
      "context_id": "72cd113a-b781-4a05-8b4f-9fce4fbd7f85",
      "service_version": "v1.2",
      "schedule_id": "aa842ddc-89c2-4cbb-933b-4bfc5a245509",
      "schedule_order": 1,
      "node_id": "1"
    }, {
      "instance_id": "4575167f-7019-4388-9f82-029cdf8c42e7",
      "schedule_time": 1552923645000,
      "schedule_result": "1",
      "schedule_log": "BBB\n脚本测试\nsucc",
      "service_id": "5fb66b72-da8f-4885-9743-a223571c51c7",
      "shell_id": "shell Echo 1-1",
      "schedule_taketime": "59",
      "context_id": "72cd113a-b781-4a05-8b4f-9fce4fbd7f85",
      "service_version": "v1.2",
      "schedule_id": "e94cd312-02f1-45d9-ba95-fd346db05b39",
      "schedule_order": 2,
      "node_id": "2"
    }, {
      "instance_id": "4575167f-7019-4388-9f82-029cdf8c42e7",
      "schedule_time": 1552923645000,
      "schedule_result": "1",
      "schedule_log": "VAA\n脚本测试\nsucc",
      "service_id": "5fb66b72-da8f-4885-9743-a223571c51c7",
      "shell_id": "shell Echo 1-1",
      "schedule_taketime": "52",
      "context_id": "72cd113a-b781-4a05-8b4f-9fce4fbd7f85",
      "service_version": "v1.2",
      "schedule_id": "d765e76f-45d7-4d51-844d-863a818b7a0b",
      "schedule_order": 3,
      "node_id": "3"
    }, {
      "instance_id": "4575167f-7019-4388-9f82-029cdf8c42e7",
      "schedule_time": 1552923645000,
      "schedule_result": "1",
      "schedule_log": "name1 none\nsucc",
      "service_id": "5fb66b72-da8f-4885-9743-a223571c51c7",
      "shell_id": "echoInfo",
      "schedule_taketime": "51",
      "context_id": "72cd113a-b781-4a05-8b4f-9fce4fbd7f85",
      "service_version": "v1.2",
      "schedule_id": "e767c68b-677c-4734-837d-a44ddc9edce5",
      "schedule_order": 4,
      "node_id": "4"
    }]

    /**
     * 
     * @param {*} viewId 
     * @param {*} serviceId 
     * @param {*} versions 完整版本组
     * @param {*} sv_id 当前版本ID，undefined时表示为开发版本
     */
    const dispay = function (viewId, service_id, sv_id,logs=log_data) {
      let ins = new AppCtr({
        propsData: {
          target: new Target({
            service_id,
            sv_id,
            id: service_id,
            //TODO 这里传入log数据的默认值log_data为测试数据
            logs,
          }),
        }
      }).$mount(`#${viewId}`)
      window.lv=ins;
      return ins
    }

    // app.dlPoc.serviceDebug = function (viewId, serviceId) {
    //   const sv_id = app.domain.get('serviceDebug', 'sv_id');//版本id
    //   let sid = app.domain.get('serviceDebug', 'service_id')||serviceId||"5fb66b72-da8f-4885-9743-a223571c51c7";//服务id
    //   const logs = app.domain.get('serviceDebug', 'logs');//所有log
    //   // console.log('app.dlpoc',{viewId,versions,sv_id,sid,serviceId});
    //   return dispay(viewId, sid, sv_id,logs)
    // }
    app.dlPoc.serviceDebug=dispay;
  } else {
    window.AIM_SHELL = new AppCtr({
      propsData: {
        target: Target.makeNull()
      }
    }).$mount('#app')
  }
}())