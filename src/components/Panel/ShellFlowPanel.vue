<template>
  <el-tabs :value="activeTab" type="card" style="width: 100%;overflow:auto" class="shellFlowPanel">
    <el-tab-pane
      label="脚本入参配置"
      name="first"
      v-loading="loading"
      :element-loading-text="`加载[${shellName}]脚本定义`"
    >
      <props-card :header="`脚本[${shellName}]入参配置`" style="margin: 10px;">
        <div slot="righttoolbar">
            <i class="el-icon-question" title=" 参数填写可以是占位符。
            占位符来自于 前置节点出参\服务参数\常量表\全局变量。"></i>
        </div>
        <!-- <template slot="righttoolbar">
          <el-button @click="save" size="mini">保存</el-button>
        </template>-->
        <el-table
          v-if="store.active"
          ref="multipleTable"
          :data="tableData"
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
              <span v-if="scope.row.isExposure||!scope.row.writable">{{scope.row.value}}</span>
              <el-autocomplete
                v-else-if="scope.row.key=='agent'"
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
          <el-table-column fixed="right" label="外部填写" width="80">
            <template slot-scope="scope">
              <el-checkbox
                v-if="store.target.lastest || scope.row.exposure"
                v-model="scope.row.isExposure"
                @change="val => handleOfExposure(val, scope.row)"
              ></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </props-card>
    </el-tab-pane>
    <el-tab-pane label="脚本出参信息" name="out">
      <props-card :header="`脚本[${shellName}]入参配置`" style="margin:10px;">
     <div slot="righttoolbar">
            <i class="el-icon-question" title="点击占位符以复制内容，可以应用在脚本入参"></i>
        </div>
       
        <el-table
          v-if="store.active"
          ref="multipleTable"
          :data="outParams"
          border
          size="mini"
          stripe
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column prop="ename" label="英文名" fixed="left" width="100"></el-table-column>
          <el-table-column prop="cname" label="中文名" fixed="left" width="100"></el-table-column>
          <el-table-column fixed="right" prop="placeholder" label="占位符(点击复制)">
            <template slot-scope="scope">
              <a href="#">
                <p
                  style="color:black"
                  @click.stop="copyToClipboard(scope.row)"
                >{{scope.row.placeholder}}</p>
              </a>
            </template>
          </el-table-column>
        </el-table>
      </props-card>
    </el-tab-pane>
    <el-tab-pane label="基本信息" name="secend">
      <props-card :header="`脚本[${shellName}]基本信息`" style="margin: 10px;">
        <div
          style="position:relative;width:100%;height:100%;overflow:auto;padding:10px;"
          v-loading="loading"
          :element-loading-text="`加载[${shellName}]脚本定义`"
        >
          <el-row>
            <el-col :span="9">脚本名称</el-col>
            <el-col :span="9">{{shellName}}</el-col>
            <el-col :span="4">
              <el-button size="mini" @click="openShell">跳转</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9">脚本描述</el-col>
            <el-col :span="9">{{shellDesc}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="9">操作系统</el-col>
            <el-col :span="9">{{shellOS}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="9">脚本版本</el-col>
            <el-col :span="9">{{shellVersion}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="9">成功标识</el-col>
            <el-col :span="9">{{shellSuccFlag}}</el-col>
          </el-row>
        </div>
      </props-card>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import PropsCard from "../Util/PropsCard.vue";

export default {
  name: "ShellFlowPanel",
  props: ["store"],
  data() {
    return {
      activeTab: "first",
      loading: true
    };
  },
  mounted() {
    window.x = this;
  },
  computed: {
    shellName() {
      let v = "";
      if (this.store.active && this.store.active.props) {
        v = this.store.active.get("data.name");
      }
      return v;
    },
    shellDesc() {
      let v = "";
      if (this.store.active && this.store.active.props) {
        v = this.store.active.get("data.shell_def.shell_cname");
      }
      return v;
    },
    shellOS() {
      let v = "";
      if (this.store.active && this.store.active.props) {
        v = this.store.active.get("data.shell_def.shell_os");
      }
      return v;
    },
    shellVersion() {
      let v = "";
      if (this.store.active && this.store.active.props) {
        v = this.store.active.get("data.shell_def.shell_version");
      }
      return v;
    },
    shellSuccFlag() {
      let v = "";
      if (this.store.active && this.store.active.props) {
        v = this.store.active.get("data.shell_def.shell_success_flag");
      }
      return v;
    },
    outParams() {
      let x = this.store.active.get("data.args_out");
      return x || [];
    },
    tableData() {
      let data = [];
      let shell_def;
      if (this.store.active && this.store.active.props) {
        shell_def = this.store.active.get("data.shell_def");
        if (!shell_def) {
          this.loadShellDef();
          return data;
        }
      }
      this.loading = false;
      let input, item, id;
      input = this.store.active.get("data.params");
      if (!input) {
        this.store.active.set("data.params", (input = {}));
      }

      id = this.store.activeId;
      if (!shell_def.shell_args) return data;
      let argFields = JSON.parse(shell_def.shell_args);
      for (let option of argFields) {
        item = {
          // id: option.ename,
          // name: option.cname,
          ...option,
          writable: true,
          exposure: true,
          key: "params." + option.ename
        };

        item.value = Reflect.has(input, option.ename)
          ? input[option.ename]
          : (input[option.ename] = "");

        if (item.exposure) {
          item.isExposure = this.store.checkExposure(id, option.ename);
        }

        data.push(item);
      }
      data.splice(0, 0, {
        ename: "agent",
        cname: "脚本服务器",
        writable: true,
        exposure: true,
        key: "agent",
        value: this.store.active.get("data.agent"),
        isExposure: this.store.checkExposure(id, "agent")
      });
      return data;
    }
  },

  methods: {
    copyToClipboard(row) {
      let clipboard = document.createElement("input");
      document.body.append(clipboard);
      clipboard.value = row.placeholder;
      clipboard.select();
      document.execCommand("Copy");
      document.body.removeChild(clipboard);
      app.alert(`${row.placeholder}复制成功`);
    },
    searchAgent(queryString, cb) {
      this.$getAgent()
        .then(resp => {
          cb(resp);
        })
        .catch(e => {
          app.alert("加载代理列表失败");
          app.alert(e);
        });
    },
    openShell() {
      app.domain.exports("shell", {
        shell_ename: this.shellName
      });

      app.dispatcher.load({
        title: "脚本编排:" + this.shellName,
        moduleId: "dlPoc",
        section: "shellEditor",
        id: this.shellName
      });
    },
    handleOfValue(val, item) {
      this.store.setValueToActive(item.key, val);
      this.$forceUpdate();
    },
    handleOfExposure(value, item) {
      let id = this.store.activeId;
      if (value) {
        //生成占位符
        let data = this.store.active.get("data");
        //${节点id_节点英文名_关键字}
        let placeholder = `\${${id}_${data.tree_info.tree_node_name}_${
          item.key
        }}`;

        this.store.addServiceParams(id, item, placeholder);

        //设置占位符
        item.value = placeholder;
        this.handleOfValue(placeholder, item);
      } else {
        this.store.removeServiceParams(id, item);
      }
    },
    /**
     * 负责初始化脚本属性，维护loading状态
     */
    loadShellDef() {
      let model = this.store.active;
      this.loading = true;
      if (model)
        this.$getShellInstance({
          shell_ename: model.get("data.tree_info.tree_node_name")
        })
          .then(resp => {
            this.loading = false;
            if (resp.r.ret) {
              this.store.active.set("data.shell_def", resp.r.ret);
              this.$forceUpdate();
            }
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
    PropsCard
  }
};
</script>

<style scoped>
</style>
