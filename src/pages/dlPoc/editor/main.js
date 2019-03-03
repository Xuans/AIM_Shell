import Vue from 'vue'
import App from './App.vue'


(function () {
  const app=window.app;
  if (app && app.dispatcher) {
    app.dlPoc = app.dlPoc || {};

    let isFirst=true;
    const dispay=function(viewId,serviceId){
      
      
      let ins=new Vue({
        render () {
          return <App target={
            {
              type:0,
              inputId:serviceId,
              id:serviceId,
            }
          }></App>
        },
      }).$mount(`#${viewId}`);
      

      // ins.$children[0].$children[0].setServiceId(serviceId);

      //ins.setTarget()

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