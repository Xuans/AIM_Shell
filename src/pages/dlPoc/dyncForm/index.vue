<template>
  <div class="dync-form-ctn-aim-shell">
    <el-row :gutter="8">
      <el-col :span="12">
        <el-container>
          <el-header>
            <span>[{{input.name}}]配置</span>
            <!-- <div style="float:right">
               <el-button size="mini" icon="el-icon-edit-outline" circle v-on:click="preview"></el-button>
            </div>-->
          </el-header>
          <el-main>
            <el-row style="height:20%">
              <el-form :label-position="labelPosition" label-width="80px" :model="model">
                <el-form-item label="描述">
                  <el-input v-model="model.desc" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="代理">
                  <el-autocomplete
                    v-model="model.agent"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入代理名称/IP"
                  ></el-autocomplete>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
              <ConfigForm v-bind:data="inputArr"></ConfigForm>
            </el-row>
          </el-main>
        </el-container>
      </el-col>
      <el-col :span="12">
        <el-container>
          <el-header>
            <span>预览</span>
            <div style="float:right">
              <el-button size="mini" icon="el-icon-check" circle v-on:click="save"></el-button>
            </div>
          </el-header>
          <el-main>
            <Preview v-bind:data="output"></Preview>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import Preview from "../../../components/Preview/Preview";

import ConfigForm from "../../../components/Forms/ConfigForm";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { debug } from "util";

Vue.prototype.axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(ConfigForm);
Vue.use(Preview);

const PRODUCT_ENV = !!(window.app && window.app.dispatcher);

const URL = PRODUCT_ENV
  ? {
      GET_FORM: "./fakeData/dlPoc/form.json"
    }
  : {
      GET_FORM: "../../fakeData/dlPoc/form.json"
    };

const empty = {
  input: []
};
Object.freeze(empty);

export default {
  name: "app",
  props: ["input"],

  // propsData: {
  //   input: {
  // 			"id": "1",
  // 			"name": "编译交易脚本",
  // 			"scriptId": "caf41eaf",
  // 			"agent":
  // 			bounds: [120, 40, 180, 40],
  // 			"target": {
  // 				"0": "4",
  // 				"1": "2"
  // 			}
  // 		}
  // },

  data: function() {
    return {
      // input: {
      //   id: "1",
      //   name: "编译交易脚本",
      //   scriptId: "caf41eaf",
      //   ip: "192.168.1.2",
      //   port: "22",
      //   bounds: [120, 40, 180, 40],
      //   target: {
      //     "0": "4",
      //     "1": "2"
      //   },
      //   input: []
      // }
    };
  },
  computed: {
    inputArr() {
      console.log(this.input);
      if (!this.input) {
        return empty.input;
      } else if (!this.input.args) {
        this.$set(this.input, "args", []);
      }

      return this.input.args;
    },
    model() {
      return this.input || thie.empty;
    },
    output() {
      return this.inputArr.map(e => {
        return e;
        //debugger;
      });
    }
  },
  components: {},
  methods: {
    querySearchAsync(queryString, cb) {
      Service.getAgent(queryString,cb);
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

    // preview(){
    //   console.log(JSON.stringify(this.$data));
    // },
    save() {
      console.log(JSON.stringify(this.$data));
    }
  },
  mounted() {
    // this.$data.input = {
    //   id: "1",
    //   name: "编译交易脚本",
    //   scriptId: "caf41eaf",
    //   ip: "192.168.1.2",
    //   port: "22",
    //   bounds: [120, 40, 180, 40],
    //   target: {
    //     "0": "4",
    //     "1": "2"
    //   },
    //   input:[]
    // };
    // if (!PRODUCT_ENV) {
    //   this.axios
    //     .get(URL.GET_FORM)
    //     .then(response => {
    //       const input = response.data.input;
    //       const output = response.data.output;
    //       this.$data.output = output;
    //     })
    //     .catch(err => {
    //       debugger;
    //     });
    // }
  }
};
</script>

<style lang="less">
@borderColor: #efefef;
.dync-form-ctn-aim-shell {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;

  > .el-row {
    height: 100%;
    margin: 0 !important;
    overflow: hidden;

    > .el-col {
      height: 100%;

      + .el-col {
        border-left: 1px solid @borderColor;
        margin-left: -1px;
      }

      > .el-container {
        height: 100%;

        > .el-header {
          line-height: 60px;
          border-bottom: 1px solid @borderColor;
        }
        > .el-main {
          padding: 5px;

          > .el-collapse {
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
