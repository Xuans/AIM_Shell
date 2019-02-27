<template>

    <div style="height: 1000px">
        <flow-editor ref="stepEditor"
                     v-if="state != null"
                     v-bind="stepCfg"
                     :maximize="maximize"
                     @init="handleOfStepInit"
                     @save="handleOfSave"
                     @command="handleOfCommand">
            <palette v-if="state.hasPalette" slot="palette" @load="handleOfLoadBcpt" @create="handleOfCreate"></palette>
        </flow-editor>

        <dblf-transition ref="transition"
                         :visible="nodeOpts.visible"
                         :expand.sync="nodeOpts.expand"
                         :desp="nodeOpts.desp"
                         @click-control="nodeOfOpen"
                         @click-back="nodeOfCollapse"
                         @editor-open="nodeOfOpening">

            <slot name="form" :input="nodeOpts.input"></slot>
        </dblf-transition>
    <div ref="logPanel" style="position:fixed;bottom:0;right:0;width:80%;height:200px;box-shadow:0 0 5px gray">
      <el-table :data="logs" @row-click="handleSelect" style="width:40%;height:100%;float:left;">
        <el-table-column prop="time" label="日期" width="180"></el-table-column>
        <el-table-column prop="duration" label="耗时(ms)" width="180"></el-table-column>
        <el-table-column prop="result" label="结果"></el-table-column>
      </el-table>
      <div style="width:60%;height:100%;float:right;background:black;color:white;font-size:.8rem;">
       
        <div :key="i" v-for="(node,i) in currentLog.progress" style="padding:4px 4px;">
            >节点: {{i}} 耗时: <span :style="{color:node.duration>36000?'red':node.duration>10000?'yellow':'green'}">{{convertTimeFormat(node.duration)}}</span><br>  
            <span :style="{color: node.result?'green':'red'}">{{node.log}}</span>
        </div>
      </div>
    </div>
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
      currentLog:{},
          nodeOpts: {
            desp: '',
            input: null,
            editable: true,
            expand: false,
            visible: false
          },
          stepOpts: {
            maximize: false,
            disable: false
          }
        }
    },

  computed: {
    stepCfg () {
      return this.propsOfFlow()
    },
    maximize () {
      return this.state.hasPalette ? this.stepOpts.maximize : true
    }
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
    convertTimeFormat(ms){
      if(ms<1000)
        return ms+'ms';
        let s=ms/1000;
      if(s<60)
      return s+'s';
      if(s<3600)
        return s/60 +'min';

    var hours = parseInt(ms  / 3600000);
    var minutes = parseInt((ms % (3600000)) / (1000 * 60));
    var seconds = (ms % (1000 * 60)) / 1000;
    
    return hours + "h " + minutes + "min " + seconds + "s ";
    },
    handleSelect(row, event, column) {
      console.log(this.$refs.stepEditor.editor.rootEditPart);
      let root = this.$refs.stepEditor.editor.rootEditPart;
      this.currentLog=row;
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
