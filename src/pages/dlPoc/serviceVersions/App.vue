<template>
  <workbench :model="workbenchConfig">
    <el-row slot="rightTool">
      <!-- <version-select
        slot="rightTool"
        :target="target"
        :service_id="target.service_id"
        :versions="target.versions"
      ></version-select>-->
      当前版本:{{target.sv_id?target.service_version:'当前开发版本'}}
    </el-row>

    <version-compare-select
      slot="centerTool"
      :sv_id="target.sv_id"
      :compareVersions="compareVersions"
      :versions="versions"
    ></version-compare-select>

    <el-row slot="mainPage" class="sv-ctn">
      <shell-versions ref="editor" :target="target"></shell-versions>

      <shell-versions
        v-for="version in compareVersions"
        :key="version.sv_id"
        :target="version"
      ></shell-versions>
    </el-row>
  </workbench>
</template>


<script>
//import Vue from 'vue'
import ShellVersions from "../../../editor/shell-versions.vue";
import "element-ui/lib/theme-chalk/index.css";
import "../../../assets/flow-style.css";
import "../../../assets/flow1/iconfont.css";
import ElementUi from "element-ui";
import ExternalApi from "../../../plugin/externalApi";
import workbench from "../../../components/workbench.vue";

import VersionSelect from "../../../components/Tool/VersionSelect.vue";
import VersionCompareSelect from "../../../components/Tool/VersionCompareSelect.vue";

Vue.config.productionTip = false;
Vue.use(ElementUi);
Vue.use(ExternalApi);

export default {
  name: "app",
  props: ["target", "versions"],
  provide: {
    parent: this
  },
  data() {
    return {
      workbenchConfig:{
        name:'服务版本比对',
      },
      cache: null,
      selection: null,
      compareVersions: Array.of()
    };
  },
  mounted() {
    window.svs=this;
  },
  components: {
    VersionSelect,
    VersionCompareSelect,
    ShellVersions,
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
