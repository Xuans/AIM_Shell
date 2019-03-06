<template>
  <div class="aim-shell-content">
    <div class="aim-shell-header">
      <span :style="{color:state.dirty?'red':'black'}">脚本编排</span>
      <!--<div class="tookit">
        &lt;!&ndash; <span
                  data-role="btn"
                  title="打开日志面板"
                  v-show="showLogBtn&&!editMode"
                  @click="((showLogPanel=true) && (showLogBtn=false))"
                >
                  <i class="fa fa-file-text"></i>
                  打开日志面板
        </span>&ndash;&gt;
        <span
          data-role="btn"
          title="保存编排"
          v-show="editMode"
          @click="save"
          v-loading="saving"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(22, 22, 22, 0.8)"
        >
          <i class="fa fa-file-text"></i>
          保存{{ state.dirty?'*':''}}
        </span>
        <span data-role="btn" title="切换模式" @click="editMode=!editMode">
          <i class="fa fa-file-text"></i>
          {{editMode?'查看日志':'编排脚本'}}
        </span>
      </div>-->
    </div>
    <flow-editor
      ref="stepEditor"
      v-if="state.render"
      :config="state.config"
      :eventsOnEditor="{vueHandler: handleOfFlowCallback}"
      :maximize="maximize"
      @init="handleOfInit"
      @save="handleOfSave"
      @command="handleOfCommand"
    >
      <palette
        v-if="state.palette"
        slot="palette"
        @create="handleOfCreate"
      ></palette>
    </flow-editor>

    <dblf-transition
      ref="transition"
      :visible="nodeOpts.visible"
      :expand.sync="nodeOpts.expand"
      :desp="nodeOpts.desp"
      @click-control="nodeOfOpen"
      @click-back="nodeOfCollapse"
      @editor-open="nodeOfOpening"
    >
      <slot name="form" :input="nodeOpts.input"></slot>
    </dblf-transition>
    <!--<transition name="el-fade-in-linear">
      <div
        v-show="!editMode"
        ref="logPanel"
        class="ui-widget-content"
        style="position:fixed;bottom:5%;right:5%;width:80%;height:300px;box-shadow:0 0 5px gray;"
      >
        <div style="position:relative;height:20px;width:100%;">
          &lt;!&ndash; <span
                      style="position:absolute;right:5px;top:-2px;"
                      @click="((showLogBtn=true) && (showLogPanel=false))"
          >x</span>&ndash;&gt;
        </div>
        <div style="width:40%;float:left;height:calc(100% - 20px)">
          <div style="padding:0 10px 0 10px;height:50px;width:100%;">
            <span style="font-size:.8rem">选择任务：</span>
            <el-autocomplete
              v-model="task"
              :fetch-suggestions="querySearchAsync"
              placeholder="查看任务日志"
              @select="taskChanged"
              size="mini"
              value="name"
            ></el-autocomplete>
          </div>
          <el-table :data="logs" @row-click="handleSelect" height="calc(100% - 50px)">
            <el-table-column prop="time" label="日期" width="180"></el-table-column>
            <el-table-column prop="duration" label="耗时(ms)" width="180"></el-table-column>
            <el-table-column prop="result" label="结果"></el-table-column>
          </el-table>
        </div>
        <div
          style="width:60%;height:calc(100% - 20px);float:right;background:black;color:white;font-size:.8rem;overflow-y:scroll;"
        >
          <div :key="i" v-for="(node,i) in currentLog.progress" style="padding:4px 4px;">
            >节点: {{i}} 耗时:
            <span
              :style="{color:node.duration>36000?'red':node.duration>10000?'yellow':'green'}"
            >{{timeFormat(node)}}</span>
            <br>
            <span :style="{color: node.result?'green':'red'}">{{node.log}}</span>
          </div>
        </div>
      </div>
    </transition>-->
  </div>
</template>
<script type="text/javascript">
import palette from "../flowEditor/palette.vue";
import flowEditor from "../flowEditor/flowEditor.vue";
import dblfTransition from "./transition.vue";

import editorFeature from "./mixins/dblfFeature";
import contextmenu from "./mixins/contextmenu";
import abbreviate from "./mixins/abbreviate";

import debuggerRunner from "../util/scriptDebugger.js";

export default {
  name: "dblf-editor",

  mixins: [editorFeature, contextmenu, abbreviate],

  data() {
    let logs = this.getLogs();
    return {
      task: "",
      editMode: true,
      logs,
      showLogPanel: false,
      showLogBtn: true,
      currentLog: {},
      nodeOpts: {
        desp: "",
        input: null,
        editable: true,
        expand: false,
        visible: false
      },
      stepOpts: {
        maximize: false,
        disable: false
      },
    };
  },

  computed: {
    maximize() {
      return this.state.palette ? this.stepOpts.maximize : true;
    }
  },
  watch: {
/*    editMode() {
      this.store.step.rootEditPart.$emit("vueHandler", vue => {
        vue.target.type = this.editMode ? 0 : 1;
      });
    },*/
    'state.mode' (mode) {
      this.store.has(mode) ? this.$refs.stepEditor.replaceEditor(this.store.get(mode)) : this.state.input2Config()
    }
  },
  mounted() {
    $(this.$refs.logPanel).draggable();
    $(this.$refs.logPanel).resizable({
      handles: "w,e,s,n,se,ne,sw,nw",
      minHeight: 150,
      minWidth: 250
    });
  },
  created() {
    // 设置快键键
    this.keyManagerOfFlow.bind("escape", e => {
      if (e.type === "keydown") {
        this.nodeOfSwitch();
        return false;
      }
    });
  },

  beforeDestroy() {
    this.keyManagerOfFlow.unbind("escape");
  },

  methods: {
    timeFormat(node) {
      return this.convertTimeFormat(node.duration);
    },
    setServiceId(id = 1) {
      this.target.inputId = id;
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.getTasks();
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return ({ value, inputId }) => {
        return (
          value.toLowerCase().indexOf(queryString.toLowerCase()) === 0 &&
          inputId != this.target.inputId
        );
      };
    },
    /*taskChanged(item) {
      this.target.inputId = item.inputId;
    },
    handleSelect(row, event, column) {
      console.log(this.$refs.stepEditor.editor.rootEditPart);
      let root = this.$refs.stepEditor.editor.rootEditPart;
      this.currentLog = row;
      const json = { data: {}, start: 1 };
      this.$refs.stepEditor.editor.store.node().each(record => {
        json.data[record.id] = record.data;
      });
      debuggerRunner.start(root, json, row);
    },*/
    /* about step editor */
    stepOfSelectionChange(selection) {
      this.setStoreActive(selection);
      this.nodeOpts.visible = this.nodeOpts.expand || this.store.active != null;
      if (this.nodeOpts.expand) {
        this.nodeOfOpen();
      }
    },

    /* about node editor */
    nodeOfBeforeDelete(model, done) {
      if (!this.activeOrNot(model)) return done();
      this.nodeOfCollapse();
      this.$refs.transition.$once("editor-closed", () => {
        this.nodeOfDetach();
        done();
      });
    },
    nodeOfCreateOrReplace(model) {
      model && (this.nodeOpts.input = model.get("data"));
    },
    nodeOfExpand(model) {
      if (model != null) {
        this.nodeOpts.desp = model.get("Desp") || "";
        this.nodeOpts.expand = this.nodeOpts.visible = true;
        this.nodeOpts.editable = this.editableOrNot(model);
        this.stepOpts.maximize = true;
        this.stepOpts.disable = true;
      }
    },
    nodeOfCollapse() {
      this.nodeOpts.expand = false;
      this.nodeOpts.visible = this.store.active != null;
      this.stepOpts.maximize = false;
      this.stepOpts.disable = false;
      this.abbreviateWhenClose(this.store.step);
    },
    nodeOfOpen(model = this.store.active) {
      this.nodeOfCreateOrReplace(model);
      this.nodeOfExpand(model);
    },
    nodeOfDetach() {
      this.$refs["nodeEditor"].detachEditor();
    },
    nodeOfSwitch() {
      if (this.nodeOpts.visible) {
        this.nodeOpts.expand ? this.nodeOfCollapse() : this.nodeOfOpen();
      }
    },
    nodeOfOpening(el) {
      this.abbreviateWhenOpen(this.store.step, this.store.active, el);
    }
  },

  components: {
    palette,
    flowEditor,
    dblfTransition
  }
};
</script>
<style lang="less">
.aim-shell-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100% !important;
  width: 100% !important;
  overflow: auto;
  display: flex;
  flex-direction: column;

  > .aim-shell-header {
    background-color: #fafafa;
    border-bottom: 1px solid #e5e5e5;
    height: 44px;
    line-height: 44px;
    padding-left: 20px;
    font-size: 14px;
    margin: 0;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;

    > .tookit {
      float: right;

      > [data-role="btn"] {
        background-color: #13b1f5;
        color: #fff;
        margin: 0 5px;
        cursor: pointer;
        padding: 0.25em 0.5em;

        > i {
          font-size: 12px;
          margin-right: 5px;
        }
      }
    }
  }
}

.aim-shell-content .el-aside .el-transfer-panel {
  border: none;
}
.aim-shell-content .el-aside .el-input {
  height: 28px;
  align-items: center;
  border: 1px solid #dadada;
  border-radius: 4px;
  margin: 5px auto;
  display: flex;
  flex-direction: row;
  width: calc(100% - 2px);
}
.aim-shell-content .el-aside .el-input input {
  border: none;
  box-shadow: none;
  font-size: 12px;
  margin: 0;
  flex: 1;
  height: 100%;
}
.aim-shell-content .el-aside .el-input span {
  font-size: 14px;
  margin-right: 10px;
  color: #9b9b9b;
  position: relative;
  top: -6px;
}
.aim-shell-content .el-transfer-panel + .el-transfer-panel {
  border-top: 1px solid #e5e5e5;
  border-radius: 0;
  margin-top: -5px;
  padding-top: 5px;
}
</style>

