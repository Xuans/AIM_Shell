<template>
  <div>
    <iworkbench :model="servceModel">
      <div slot="leftPage" style="position:relative;width:100%;height:100%;">
        <itree :model="treeData"></itree>
      </div>
      <div slot="rightPage" style="position:relative;width:100%;height:100%;">
        <el-col :span="17">文件管理器</el-col>
        <el-col :span="7">详情</el-col>
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
        name: "服务管理"
      },
      treeData: {
        children: [
          {
            id: 0,
            name: "一级分类0",
            children: [
              {
                id: 01,
                name: "二级分类1",
                children: [
                  {
                    id: 001,
                    name: "服务1"
                  },
                  {
                    id: 002,
                    name: "服务2"
                  },
                  {
                    id: 003,
                    name: "服务3"
                  }
                ]
              },

              {
                id: 02,
                name: "二级分类2",
                children: [
                  {
                    id: 021,
                    name: "服务1"
                  },
                  {
                    id: 022,
                    name: "服务2"
                  },
                  {
                    id: 023,
                    name: "服务3"
                  }
                ]
              }
            ]
          },
           {
            id: 1,
            name: "一级分类0",
            children: [
              {
                id: 11,
                name: "二级分类1",
                children: [
                  {
                    id: 001,
                    name: "服务1"
                  },
                  {
                    id: 002,
                    name: "服务2"
                  },
                  {
                    id: 003,
                    name: "服务3"
                  }
                ]
              },

              {
                id: 12,
                name: "二级分类2",
                children: [
                  {
                    id: 021,
                    name: "服务1"
                  },
                  {
                    id: 022,
                    name: "服务2"
                  },
                  {
                    id: 023,
                    name: "服务3"
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  },
  components: {
    iworkbench,
    itree
  },
  methods: {},
  mounted() {
    this.axios
      .get(URL.GET_FORM)
      .then(response => {
        const input = response.data.input;
        const output = response.data.output;

        this.$data.input = input;
        this.$data.output = output;
      })
      .catch(err => {
        debugger;
      });
  }
};
</script>

<style lang="less">
.example {
  color: green;
}
</style>
