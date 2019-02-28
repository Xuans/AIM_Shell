import Vue from 'vue'
import App from './App.vue'


(function () {
  const app=window.app;
  if (app && app.dispatcher) {
    app.dlPoc = app.dlPoc || {};

    let isFirst=true;
    const dispay=function(viewId,serviceId){
      let ins=new Vue({
        render: h => h(App),
      }).$mount(`#${viewId}`);

      ins.$children[0].$children[0].setServiceId(serviceId);

      window.AIM_SHELL=ins;
    }

    app.dlPoc.editor = function (viewId,serviceId) {

      if(isFirst){
        setTimeout(()=>{
          dispay(viewId,serviceId);
        },220);
        isFirst=false;
      }else{
        dispay(viewId,serviceId);
      }
    }
  } else {
    window.AIM_SHELL = new Vue({
      render: h => h(App),
    }).$mount('#app');
  }
}());