<template>
  <div class="example">
    {{ENV}}
    {{hello}}
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.prototype.axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);

//判断是否为生成环境
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
      hello:'hello world',
      ENV:PRODUCT_ENV?'开发环境':'生产环境'
    };
  },
  components: {
  },
  methods:{
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
.example{
  color:green;
}
</style>
