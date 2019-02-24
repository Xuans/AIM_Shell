<template>
  <div id="app" class="dync-form-ctn-aim-shell">
    <el-row :gutter="8">
      <el-col :span="8">
        <el-container>
          <el-header>
            <span>配置面板</span>
            <div style="float:right">
               <el-button size="mini" icon="el-icon-edit-outline" circle v-on:click="preview"></el-button>
            </div>
          </el-header>
          <el-main>
            <ConfigForm v-bind:data="input"></ConfigForm>
          </el-main>
        </el-container>
      </el-col>
      <el-col :span="16">
        <el-container>
          <el-header>
            <span>预览</span>
            <div style="float:right">
               <el-button size="mini" icon="el-icon-check" circle v-on:click="save"></el-button>
            </div>
          </el-header>
          <el-main>
            <Form v-bind:data="output"></Form>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import Form from "../../../components/Form.vue";

import ConfigForm from "../../../components/ConfigForm.vue";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.prototype.axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);


const PRODUCT_ENV=!!(window.app && window.app.dispatcher);

const URL=PRODUCT_ENV?{
  GET_FORM:'./fakeData/dlPoc/form.json',
}:{
  GET_FORM:"../../fakeData/dlPoc/form.json",
};


export default {
  name: "app",
  data: function() {
    return {
      input:[],
      output:[]
    };
  },
  components: {
    Form,
    ConfigForm
  },
  methods:{
    preview(){
      console.log(JSON.stringify(this.$data));
    },
    save(){
      console.log(JSON.stringify(this.$data));
    }
  },
  mounted() {
    this.axios
      .get(URL.GET_FORM)
      .then(response => {
        const input = response.data.input;
        const output=response.data.output;

        this.$data.input=input;
        this.$data.output=output;
      })
      .catch(err => {
        debugger;
      });
  }
};
</script>

<style lang="less">
@borderColor:#EFEFEF;
.dync-form-ctn-aim-shell {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 15px;
  background-color: white;

  > .el-row {
    height: 100%;
    overflow: hidden;

    > .el-col {
      height: 100%;

      +.el-col{
        border-left: 1px solid @borderColor;
        margin-left:-1px;
      }

      > .el-container {
        height: 100%;

        >.el-header{
          line-height: 60px;
          border-bottom: 1px solid @borderColor;
        }
        >.el-main{
          padding: 5px;

          >.el-collapse{
            border: none;
          }
        }
        // >.el-footer{
        //   border-top:1px solid @borderColor;
        // }
      }
    }
  }
}
</style>
