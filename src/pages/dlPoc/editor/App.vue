<template>
  <div id="app">
    <Editor v-bind:target="target">

      <!-- 表单凹槽 -->
      <template slot="form" slot-scope="input">
        <iform></iform>
      </template>
    </Editor>
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

import Serivce from '../../../../public/fakeSerivce/index'
import iform from '../dyncForm/index.vue'

export default {
  name: 'app',
  data:function(){
    return {
      target: Serivce.createSerivceCtr() || Serivce.getServiceCtr()
    };
  },
  components:{
    Editor,
    iform
  }
}
</script>

<style>
</style>
