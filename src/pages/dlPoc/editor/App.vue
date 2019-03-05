<template>
  <div class="aim-shell-editor">
    <shell-flow v-bind:target="target">
      <!-- 表单凹槽 -->
      <template slot="form" slot-scope="{input}">
        <iform :input="input"></iform>
      </template>
    </shell-flow>
  </div>
</template>


<script>
import Vue from 'vue'
import ShellFlow from '../../../editor/shell-flow.vue';
import "element-ui/lib/theme-chalk/index.css";
import "../../../assets/flow-style.css";
import "../../../assets/flow1/iconfont.css";
import ElementUi from 'element-ui'

Vue.config.productionTip = false
Vue.use(ElementUi);

import iform from '../dyncForm/index.vue'

export default {
  name: 'app',
  props:['target'],
  data:function(){
    return {};
  },
  components:{
    ShellFlow,
    iform
  },
}
</script>

<style>
.aim-shell-editor{
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom: 15px;
  overflow: hidden;
  border-radius: 6px;
  border:1px solid #efefef;
}
.aim-shell-editor section{
  border: none;
  margin:0;
}
</style>
