<template>
  <div id="app">
    <Editor v-bind:file="file"></Editor>
  </div>
</template>


<script>
import Editor from '../../../editor/index.vue';
import "element-ui/lib/theme-chalk/index.css";
import "../../../assets/flow-style.css";
import "../../../assets/flow1/iconfont.css";

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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
