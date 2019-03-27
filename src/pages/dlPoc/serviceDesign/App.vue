<template>
  <!-- 脚本服务编排 -->
  <workbench :model="model" class="serviceDesign_app">
    <div slot="centerTool" style="display:flex;">
      <div v-if="target.lastest">
        <el-tooltip effect="light" content="删除节点" placement="bottom">
          <el-button
            size="mini"
            icon="el-icon-delete"
            :disabled="!target.lastest"
            @click="editorHandle('delete')"
          ></el-button>
        </el-tooltip>
      </div>
      <span v-if="target.lastest">|</span>
      <div>
        <el-button
          size="mini"
          v-if="target.lastest"
          icon="el-icon-edit-outline"
          :disabled="!target.lastest"
          @click="editorHandle('save')"
        >保存</el-button>
        <el-button
          size="mini"
          v-if="target.lastest"
          icon="el-icon-upload2"
          :disabled="!target.lastest"
          @click="editorHandle('upload')"
        >发布</el-button>
        <el-button
          v-loading="versionLoading"
          icon="el-icon-menu"
          size="mini"
          @click="versionCompare('upload')"
        >比对版本</el-button>
        <el-button
          v-loading="versionLoading"
          icon="el-icon-caret-right"
          size="mini"
          @click="showRunConfiguration"
        >试运行</el-button>
      </div>
    </div>

    <version-select
      slot="rightTool"
      :target="target"
      :service_id="target.service_id"
      :versions="target.versions"
    ></version-select>

    <shell-design ref="editor" slot="mainPage" :target="target">
      <template slot="form" slot-scope="{store}">
        <shell-flow-panel :store="store"></shell-flow-panel>
      </template>
    </shell-design>

    <el-dialog :title="`运行配置`" :visible.sync="runConfigurationVisiable">
      <props-card :header="`试运行参数配置`" style="margin: 10px;">
        <div>{{runMessage}}</div>
        <div style="color:red">{{runErrorMessage}}</div>
        <el-table
          ref="multipleTable"
          :data="serviceParams"
          border
          size="mini"
          stripe
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column prop="ename" label="英文名" fixed="left" width="100"></el-table-column>
          <el-table-column prop="cname" label="中文名" fixed="left" width="100"></el-table-column>
          <el-table-column prop="value" label="值">
            <template slot-scope="scope">
              <el-autocomplete
                v-if="scope.row.key=='agent'"
                v-model="scope.row.value"
                :readonly="scope.row.isExposure"
                :fetch-suggestions="searchAgent"
                placeholder="请输入代理名称/IP"
                value-key="agent_name"
                @select="item=>handleOfValue(item['agent_name'],scope.row)"
              ></el-autocomplete>
              <el-input
                v-else
                v-model="scope.row.value"
                @input="val => handleOfValue(val, scope.row)"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </props-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="runConfigurationVisiable = false">取 消</el-button>
        <el-button type="primary" @click="execute">运 行</el-button>
      </div>
    </el-dialog>
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
      runConfigurationVisiable: false,
      cache: null,
      selection: null,
      versionLoading: false,
      serviceParams: [],
      runMessage: null,
      runErrorMessage: null,
      model: {
        name: "服务编排",
        paths: [{ name: "path" }, { to: "to" }, { me: "me" }]
      }
    };
  },

  methods: {
    execute() {
      this.runMessage = "初始化执行器...";
      this.$addExecuteTask({
        service_id: this.getStore().target.service_id,
        service_content: this.getStore().target.service_content,
        service_args: this.run_service_args
      })
        .then(result => {
          this.runMessage = "执行器初始化成功，开始下发脚本";
          let instance_id = result.r.ret.instance_id;
          this.$publishShell({
            instance_id
          })
            .then(() => {
              this.$execServce({
                instance_id
              })
                .then(res => {
                  this.runMessage = "执行成功，准备打开日志...";
                  app.domain.exports("shellLogDetails", {
                    log: new Promise(res => {
                      this.$getSchedules({ instance_id }).then(data=>{
                        console.log('schedules',data)
                      });
                    }),
                    task: {
                      instance_name:
                        this.getStore().target.service_name + "试运行"
                    },
                    service: {
                      service_id: this.getStore().target.service_id,
                      service_name: this.getStore().target.service_name,
                      service_version: ""
                    }
                  });
                  //debugger;
                  app.dispatcher.load({
                    title: `运行日志详情`,
                    moduleId: "dlPoc",
                    section: "shellLogDetails",
                    id: instance_id
                  });
                  this.runConfigurationVisiable = false;
                })
                .catch(e => {
                  this.runErrorMessage = e;
                });
            })
            .catch(e => {
              this.runErrorMessage = e;
            });
        })
        .catch(e => {
          this.runErrorMessage = e;
        });
    },
    getStore() {
      return this.$refs.editor.store;
    },
    showRunConfiguration() {
      if (this.getStore().isDirty()) {
        app.alert("运行前请先保存");
        return;
      }
      //弹出一个参数配置页面，填写完参数后，转到Log页面
      this.serviceParams = this.getSerivceParams();
      this.run_service_args = JSON.parse(
        JSON.stringify(this.getStore().service_args)
      );
      this.runConfigurationVisiable = true;
    },
    handleOfValue(val, item, key) {
      this.run_service_args[item.nodeId][item.ename][key] = val;
    },
    getSerivceParams() {
      let treeData = [];

      if (!this.$refs.editor) return treeData;
      let store = this.$refs.editor.store;
      for (let nodeId in store.service_args) {
        let param;
        if ((param = store.service_args[nodeId])) {
          for (let p in param) {
            let item = {
              ...param[p],
              nodeId
            };
            treeData.push(item);
          }
        }
      }

      return treeData;
    },
    versionCompare() {
      if (this.versionLoading) {
        app.alert("正在加载版本信息");
        return;
      }
      this.versionLoading = true;
      this.$getVersionHistory({ service_id: this.target.service_id })
        .then(resp => {
          this.versionLoading = false;
          //传参给serviceVersions/main.js
          app.domain.exports("serviceVersions", {
            versions: resp.r.ret,
            sv_id: this.target.sv_id,
            service_id: this.target.service_id
          });

          app.dispatcher.load({
            title: "版本比对-" + this.target.service_name,
            moduleId: "dlPoc",
            section: "serviceVersions",
            id: this.target.service_id
          });
        })
        .catch(e => {
          app.alert("加载版本信息失败");
          app.alert(e);

          this.versionLoading = false;
        });
    },
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
