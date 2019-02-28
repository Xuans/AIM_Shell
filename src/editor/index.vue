<template>
  <div class="aim-shell-content">
    <div class="aim-shell-header">
      <span>任务编排</span>
      <div class="tookit">
        <span
          data-role="btn"
          title="查看日志"
          v-show="showLogBtn"
          @click="((showLogPanel=true) && (showLogBtn=false))"
        >
          <i class="fa fa-file-text"></i>
          查看日志
        </span>
      </div>
    </div>
    <flow-editor
      ref="stepEditor"
      v-if="state != null&&stepCfg!=null"
      v-bind="stepCfg"
      :maximize="maximize"
      @init="handleOfStepInit"
      @save="handleOfSave"
      @command="handleOfCommand"
    >
      <palette
        v-if="state.hasPalette"
        slot="palette"
        @load="handleOfLoadBcpt"
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
    <transition name="el-fade-in-linear">
      <div
        v-show="showLogPanel"
        ref="logPanel"
        class="ui-widget-content"
        style="position:fixed;bottom:0;right:0;width:80%;height:200px;box-shadow:0 0 5px gray;"
      >
        <div style="position:relative;height:20px;width:100%;">
          <span
            style="position:absolute;right:5px;top:-2px;"
            @click="((showLogBtn=true) && (showLogPanel=false))"
          >x</span>
        </div>
        <el-table
          :data="logs"
          @row-click="handleSelect"
          height="calc(100% - 20px)"
          style="width:40%;float:left;"
        >
          <el-table-column prop="time" label="日期" width="180"></el-table-column>
          <el-table-column prop="duration" label="耗时(ms)" width="180"></el-table-column>
          <el-table-column prop="result" label="结果"></el-table-column>
        </el-table>
        <div
          style="width:60%;height:calc(100% - 20px);float:right;background:black;color:white;font-size:.8rem;overflow-y:scroll;"
        >
          <div :key="i" v-for="(node,i) in currentLog.progress" style="padding:4px 4px;">
            >节点: {{i}} 耗时:
            <span
              :style="{color:node.duration>36000?'red':node.duration>10000?'yellow':'green'}"
            >{{convertTimeFormat(node.duration)}}</span>
            <br>
            <span :style="{color: node.result?'green':'red'}">{{node.log}}</span>
          </div>
        </div>
      </div>
    </transition>
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
  </div>
</template>
<script type="text/javascript">
import palette from "../flowEditor/palette.vue";
import flowEditor from "../flowEditor/flowEditor.vue";
import dblfTransition from "./transition.vue";

import editorFeature from "./mixins/dblfFeature";
import contextmenu from "./mixins/contextmenu";
import abbreviate from "./mixins/abbreviate";

import Service from "./../../public/fakeSerivce/index.js";
import debuggerRunner from "../util/scriptDebugger.js";

export default {
  name: "dblf-editor",

  mixins: [editorFeature, contextmenu, abbreviate],

  data() {
    let logs = Service.getLogs();
    return {
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
      stepCfg:null,
    };
  },

  computed: {
    dirty: {
      get() {
        if (this.store) this._dirty = this.store.step.isDirty();
        return this._dirty;
      },
      set(v) {
        this._dirty = v;
      }
    },
    // stepCfg() {
    //   return this.propsOfFlow();
    // },
    maximize() {
      return this.state.hasPalette ? this.stepOpts.maximize : true;
    }
  },
  watch: {
    target:{
      handler(v){
      },
      deep:true,
    },
    editMode() {
      this.store.step.rootEditPart.$emit("vueHandler", vue => {
        vue.target.type = this.editMode ? 0 : 1;
      });
    }
  },
  mounted() {
    $(this.$refs.logPanel).draggable();
    $(this.$refs.logPanel).resizable({
      handles: "w,e,s,n,se,ne,sw,nw"
    });

    this.setServiceId(1)
  },
  created() {
    // 设置快键键
    this.keyManagerOfFlow.bind("tab", e => {
      if (e.type === "keydown") {
        this.nodeOfSwitch();
        return false;
      }
    });
  },

  beforeDestroy() {
    this.keyManagerOfFlow.unbind("tab");
  },

  methods: {
    setServiceId(id){
        this.propsOfFlow(id);
    },
    doSave() {
      this.saving=true;
      Service.doSave(this.store.step,()=>{
        this.saving=false;
      });
    },
    querySearchAsync(queryString, cb) {
      var restaurants = Service.getTasks();
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
    taskChanged(item) {
      // console.log(item);
      this.target.inputId = item.inputId;
      this.propsOfFlow();
    },

    setServiceId(id){
     setTimeout(()=>{
       debugger;
       this.target.inputId=id;
     });
    },
    convertTimeFormat(ms) {
      if (ms < 1000) return ms + "ms";
      let s = ms / 1000;
      if (s < 60) return s + "s";
      if (s < 3600) return s / 60 + "min";

      var hours = parseInt(ms / 3600000);
      var minutes = parseInt((ms % 3600000) / (1000 * 60));
      var seconds = (ms % (1000 * 60)) / 1000;

      return hours + "h " + minutes + "min " + seconds + "s ";
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
    },
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
    nodeOfCreateOrReload(model) {
      if (this.store.containByModel(model)) {
        if (this.activeOrNot(model)) {
          this.nodeOfDetach();
        }
        this.nodeOfDeleting(model);
      }

      this.nodeOfOpen(model);
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
      this.abbreviateWhenClose(this.flowOfStep);
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
      this.abbreviateWhenOpen(this.flowOfStep, this.store.active, el);
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

