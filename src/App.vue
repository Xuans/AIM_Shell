<template>
  <div id="app">
    <!--<Form v-bind:data="data"></Form>-->
    <Editor v-bind:file="file"></Editor>
  </div>
</template>

<style>
  @import "~element-ui/lib/theme-chalk/index.css";
</style>

<script>
import Form from './components/Form.vue';
import Editor from './editor/index.vue';

export default {
  name: 'app',
  data:function(){
    return {
      message:'hello world',
      data:[{
        type:'string',
        component:'input',
        length:'20',
        name:'length',
        desp:'长度',
        value:'hello world'
      }],
      file:{
        key:'hello'
      }
    };
  },
  components:{
    Form,
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
