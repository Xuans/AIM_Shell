<template>
  <div>
    <iworkbench :model="servceModel">
      <div slot="leftPage" style="position:relative;width:100%;height:100%;">
        <itree v-if="treeData" v-loading="!treeData" :model="treeData" @select="selectChanged"></itree>
      </div>
      <div slot="centerPage" style="position:relative;width:100%;height:100%;">
        <el-col :span="17" style="height:100%;">
          <iresourceManager ref='resourceManager' :model="selected"></iresourceManager>
        </el-col>
        <el-col :span="7" style="height:100%;">详情</el-col>
      </div>
    </iworkbench>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import iworkbench from "../../../components/workbench";
import itree from "../../../components/tree";
import iresourceManager from '../../../components/resourceManagent';
import api from '../../../../public/fakeSerivce/serverApi.js';

Vue.prototype.axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);

//判断是否为生成环境
const PRODUCT_ENV = !!(window.app && window.app.dispatcher);

const URL = PRODUCT_ENV
  ? {
      GET_FORM: "./fakeData/dlPoc/form.json"
    }
  : {
      GET_FORM: "../../fakeData/dlPoc/form.json"
    };

export default {
  name: "app",
  data: function() {
    return {
      servceModel: {
        name: "服务管理",
        paths:[],
      },
      selected:{
        children:[],
      },
      treeData: null,
      // {
      //   children: [
          
      //     {
      //       id: "0",
      //       name: "一级分类0",
      //       children: [
      //         {
      //           id: "012",
      //           name: "二级分类0",
      //           children: [
      //             {
      //               id: "0011",
      //               name: "1服务11x"
      //             },
      //             {
      //               id: "0012",
      //               name: "服务ac"
      //             },
      //             {
      //               id: "0a03",
      //               name: "服务vad"
      //             }
      //           ]
      //         },
      //         {
      //           id: "01",
      //           name: "二级分类1",
      //            expanded:false,
      //           children: [
      //             {
      //               id: "001",
      //               name: "服务x"
      //             },
      //             {
      //               id: "002",
      //               name: "服务c"
      //             },
      //             {
      //               id: "003",
      //               name: "服务d"
      //             }
      //           ]
      //         },

      //         {
      //           id: "02",
      //           name: "二级分类2",
      //            expanded:false,
      //           children: [
      //             {
      //               id: "021",
      //               name: "服务1"
      //             },
      //             {
      //               id: "022",
      //               name: "服务2"
      //             },
      //             {
      //               id: "023",
      //               name: "服务3"
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //      {
      //       id: "1",
      //       name: "一级分类1",
      //       expanded:false,
      //       children: [
      //         {
      //           id: "11",
      //           name: "二级分类1",
      //        expanded:false,
      //           children: [
      //             {
      //               id: "001",
      //               name: "服务1"
      //             },
      //             {
      //               id: "002",
      //               name: "服务2"
      //             },
      //             {
      //               id: "003",
      //               name: "服务3"
      //             }
      //           ]
      //         },

      //         {
      //           id: 12,
      //           name: "二级分类2",
      //           expanded:false,
      //           children: [
      //             {
      //               id: "021",
      //               name: "服务1"
      //             },
      //             {
      //               id: "022",
      //               name: "服务2"
      //             },
      //             {
      //               id: "023",
      //               name: "服务3"
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // }
    };
  },
  components: {
    iworkbench,
    itree,
    iresourceManager,
  },
  methods: {
    selectChanged(selection,type){
      this.selected=selection[0];
      this.$refs.resourceManager.setModel(this.selected);
      this.servceModel.paths=selection.reverse();
      if(type){

      }else{

      }
    }
  },
  mounted() {
    window.ss=this;
    this.axios
      .get(URL.GET_FORM)
      .then(response => {
        const input = response.data.input;
        const output = response.data.output;

        this.$data.input = input;
        this.$data.output = output;
      })
      .catch(err => {
        console.error(err);
      });
    
    api.getServiceInstanceTree().then(data=>{
      debugger;
      console.log(data);
      this.treeData=data;
    });
  }
};
</script>

<style lang="less">
.example {
  color: green;
}
</style>
