<template>
  <workbench :model="workbenchConfig">

    <el-row slot="mainPage" class="sv-ctn">
      <shell-debug ref="editor" :target="target"></shell-debug>

    </el-row>
  </workbench>
</template>


<script>
//import Vue from 'vue'
import ShellDebug from "../../../editor/shell-debug.vue";
import "element-ui/lib/theme-chalk/index.css";
import "../../../assets/flow-style.css";
import "../../../assets/flow1/iconfont.css";
import ElementUi from "element-ui";
import ExternalApi from "../../../plugin/externalApi";
import workbench from "../../../components/workbench.vue";


Vue.config.productionTip = false;
Vue.use(ElementUi);
Vue.use(ExternalApi);

export default {
  name: "app",
  props: ["target"],
  provide: {
    parent: this
  },
  data() {
    return {
      workbenchConfig:{
        name:'服务追踪',
      },
      selection: null,
      compareVersions: Array.of()
    };
  },
  mounted() {
    window.svs=this;
  },
  components: {
    ShellDebug,
    workbench
  }
};
</script>

<style>
.aim-shell-editor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 15px;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #efefef;
}
.aim-shell-editor section {
  border: none;
  margin: 0;
}
.sv-ctn {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex: 1;
}
.sv-ctn > .aim-shell-content {
  flex: 1;
}
</style>
