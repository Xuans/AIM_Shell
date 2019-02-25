<template>
  <div id="app">
    <Editor v-bind:file="file"></Editor>
  </div>
</template>


<script>
import Vue from 'vue'
import Editor from '../../../editor/index.vue';
import "element-ui/lib/theme-chalk/index.css";
import "../../../assets/flow-style.css";
import "../../../assets/flow1/iconfont.css";
import ElementUi from 'element-ui'

Vue.config.productionTip = false
Vue.use(ElementUi);

export default {
  name: 'app',
  data:function(){
    return {
      file:{
        key:'hello'
      }
    };
  },
  components:{
    Editor
  }
}
</script>

<style>
</style>
