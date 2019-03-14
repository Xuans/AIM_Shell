<template>
  <workbench :model="model">
    <div slot="centerTool" style="display:flex;">
      <div>
        <el-tooltip effect="light" content="删除节点" placement="bottom"> 
          <el-button size='mini'
            icon="el-icon-delete"
            :disabled="!target.lastest"
            @click="editorHandle('delete')"
          ></el-button>
        </el-tooltip>
      </div>
      <span>|</span>
      <div>
        <el-button size='mini'
          icon="el-icon-edit-outline"
          :disabled="!target.lastest"
          @click="editorHandle('save')"
        >保存</el-button>
        <el-button size='mini'
          icon="el-icon-upload2"
          :disabled="!target.lastest"
          @click="editorHandle('upload')"
        >发布</el-button>
      </div>
    </div>

    <version-select slot="rightTool" v-model="target.head" :versions="target.versions"></version-select>

    <shell-design ref="editor" slot="mainPage" :target="target">
      <template slot="form" slot-scope="{store}">
        <shell-flow-panel :store="store"></shell-flow-panel>
      </template>
    </shell-design>
  </workbench>
</template>


<script>
//import Vue from 'vue'
import ShellDesign from "../../../editor/shell-design.vue";
import ShellFlowPanel from "../../../components/Panel/ShellFlowPanel.vue";
import "element-ui/lib/theme-chalk/index.css";
import "../../../assets/flow-style.css";
import "../../../assets/flow1/iconfont.css";
import ElementUi from "element-ui";
import ExternalApi from "../../../plugin/externalApi";

import VersionSelect from "../../../components/Tool/VersionSelect.vue";

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
  data: function() {
    return {
      cache: null,
      selection: null,
      model: {
        name: "服务编排",
        paths: [{ name: "path" }, { to: "to" }, { me: "me" }]
      }
    };
  },

  methods: {
    editorHandle(action) {
      this.$refs.editor.request(action);
    }
  },

  components: {
    VersionSelect,
    ShellDesign,
    ShellFlowPanel,
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
</style>
