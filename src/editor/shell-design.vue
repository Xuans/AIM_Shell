<template>
  <div style="flex:1">
    <keep-alive>
      <shell-flow
        ref="shell-flow"
        :target="target"
        :maximize="target.lastest ? maximize : true"
        @selection-change="handleOfSelectionChange"
        @selection-remove="handleOfSelectionRemove"
        @onswitch="handleOfSwitch"
      >
        <mutil-panel slot="panels" :store="store"></mutil-panel>

        <dblf-transition
          slot="canvass"
          ref="transition"
          :visible="visible"
          :expand.sync="expand"
          @click-control="handleOfExpand"
          @click-back="handleOfCollapse"
          @editor-open="handleOfOpening"
        >
          <slot name="form" :store="store"></slot>
        </dblf-transition>
      </shell-flow>
    </keep-alive>
    <el-dialog
      ref="publishDialog"
      slot="canvasUnder"
      :title="`发布服务版本`"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="versionModel">
        <el-form-item label="服务名称" :label-width="formLabelWidth">{{versionModel.service_name}}</el-form-item>
        <el-form-item label="版本号" :label-width="formLabelWidth">
          <el-autocomplete
            v-model="newVersion"
            :fetch-suggestions="searchVersions"
            placeholder="请输入内容"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="publishVersion">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import dblfTransition from "./transition.vue";
import shellFlow from "./shell-flow.vue";
import mutilPanel from "../components/Panel/MutilPanel.vue";

import abbreviate from "./mixins/abbreviate";

export default {
  name: "shell-design",

  props: ["target"],

  mixins: [abbreviate],

  mounted() {
    this.store = this.$refs["shell-flow"].store;
  },
  computed: {
    versionModel() {
      let v = {};
      if (this.store) {
        v = this.store.target;
      }
      return v;
    }
  },

  data() {
    return {
      store: null,
      expand: false,
      visible: false,
      maximize: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      newVersion: "",
      versionHistory: null
    };
  },

  methods: {
    handleOfSelectionChange() {
      this.visible = this.expand || this.store.active != null;
      this.expand && this.handleOfExpand();
    },

    handleOfSelectionRemove() {
      this.$refs.transition.$once("editor-closed", () => {
        // this.store.active = null
        if (!this.store.active) throw Error();
      });
    },

    handleOfExpand() {
      if (this.store.active) {
        this.expand = this.visible = true;
        this.maximize = true;
      }
    },

    handleOfCollapse() {
      this.expand = false;
      this.visible = this.store.active != null;
      this.maximize = false;
      this.abbreviateWhenClose(this.store.activeEditor);
    },
    handleOfSwitch() {
      if (this.visible) {
        this.expand ? this.handleOfCollapse() : this.handleOfExpand();
      }
    },
    handleOfOpening(el) {
      this.abbreviateWhenOpen(this.store.activeEditor, this.store.active, el);
    },
    request(action) {
      this.store[action](this);
    },
    upload() {
      this.versionHistory = null;
      this.dialogFormVisible = true;
      window.sd = this;
    },
    versionFilter(query, arr) {
      let r = [];
      for (let item of arr) {
        if (
          query == null ||
          item.value.toLowerCase().indexOf(query.toLowerCase()) > -1
        )
          r.push(item);
      }
      return r;
    },
    searchVersions(query, cb) {
      if (this.versionHistory) {
        cb(this.versionFilter(query, this.versionHistory));
        return;
      }
      this.$getVersionHistory({ service_id: this.store.target.service_id })
        .then(resp => {
          this.versionHistory = [];
          if (resp.r.ret) {
            for (let item of resp.r.ret) {
              this.versionHistory.push({
                ...item,
                value: item.service_version
              });
            }
          }
          cb(this.versionFilter(query, this.versionHistory));
        })
        .catch(e => {
          console.error(e);
          app.alert("错误提示", (e && e.message) || e, app.alertShowType.ERROR);
          cb([]);
        });
    },
    publishVersion() {
      this.dialogFormVisible = false;
      if (this.newVersion)
        this.$publishVersion({
          service_id: this.store.target.service_id,
          service_version: this.newVersion
        })
          .then(resp => {
            app.alert("发布成功", "发布成功", app.alertShowType.SUCCESS);
            this.newVersion = null;
          })
          .catch(e => {
            app.alert(
              "错误提示",
              (e && e.message) || e,
              app.alertShowType.ERROR
            );
          });
    }
  },

  components: {
    shellFlow,
    mutilPanel,
    dblfTransition
  }
};
</script>
<style lang="less">
.aim-shell-content {
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

