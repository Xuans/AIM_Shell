import Vue from 'vue'
import App from './App.vue'


(function () {
  const app=window.app;
  if (app && app.dispatcher) {
    app.dlPoc = app.dlPoc || {};

    let isFirst=true;
    const dispay=function(viewId){
      window.AIM_SHELL = new Vue({
        render: h => h(App),
      }).$mount(`#${viewId}`);
    }

    app.dlPoc.editor = function (viewId) {

      if(isFirst){
        setTimeout(()=>{
          dispay(viewId);
        },220);
        isFirst=false;
      }else{
        dispay(viewId);
      }
    }
  } else {
    window.AIM_SHELL = new Vue({
      render: h => h(App),
    }).$mount('#app');
  }
}());