<template>
  <el-container direction="vertical" class="palette_container">
    <div class="el-transfer-panel" style="width: auto;height: 50%;">
      <div
        style="height:10%;position:relative;"
        class="el-transfer-panel__header"
        @mouseenter="showScriptSearch=true"
        @mouseleave="showScriptSearch=false"
      >
        <div
          v-show="showScriptSearch||(scriptQuery!=null&&scriptQuery!='')"
          class="animated fadeIn"
          style="border-bottom:1px solid gray;position:relative;width:80%;float:right;height:100%;"
        >
          <div
            contenteditable="true"
            style="position:relative;color:gray;height:100%;outline:none;width:90%;float:left;"
            @keydown.stop="buttonKey"
            @input="fireScriptTreeFilter($event.currentTarget.innerText)"
          ></div>
          <i class="el-icon-search"></i>
        </div>
        <span class="animated fadeIn" style="height:100%;">脚本</span>
      </div>

      <div style="width:100%;height:90%;overflow:auto;">
        <el-tree
          ref="scriptTree"
          style="margin-top: 0.5rem"
          draggable
          :filter-node-method="filter"
          
          :data="treeData"
          :props="treeProps"
          :render-content="renderContent"
          :allow-drag="(node) => node.data != null"
          :allow-drop="() => false"
          
          @node-expand="data => data.expand = true"
          @node-collapse="data => data.expand = false"
          @node-click="handleOfNodeClick"
        ></el-tree>
      </div>
    </div>

    <div class="el-transfer-panel" style="width: auto; margin-top: 10px; height: 50%">
      <div
        style="height:10%;position:relative;"
        class="el-transfer-panel__header"
        @mouseenter="showServiceSearch=true"
        @mouseleave="showServiceSearch=false"
      >
        <div
          v-show="showServiceSearch||(serviceQuery!=null&&serviceQuery!='')"
          class="animated fadeIn"
          style="border-bottom:1px solid gray;position:relative;width:80%;float:right;height:100%;"
        >
          <div
            contenteditable="true"
            style="position:relative;color:gray;height:100%;outline:none;width:90%;float:left;"
            @keydown.stop="buttonKey"
            @input="fireServiceTreeFilter($event.currentTarget.innerText)"
          ></div>
          <i class="el-icon-search"></i>
        </div>
        <span class="animated fadeIn" style="height:100%;">脚本编排</span>
      </div>

      <div class="el-transfer-panel__body">
        <el-tree
          ref="serviceTree"
          style="margin-top: 0.5rem"
          draggable
          :filter-node-method="filter"
          :data="serviceTreeData"
          :props="serviceTreeProps"
          :render-content="renderContent"
          :allow-drag="(node) => node.data != null"
          :allow-drop="() => false"
          @node-expand="data => data.expand = true"
          @node-collapse="data => data.expand = false"
          @node-click="handleOfNodeClick"
        ></el-tree>
      </div>
    </div>
  </el-container>
</template>

<style>
.palette_container {
  transition: 1s;
  padding: 5px;
  height: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.custom-translater {
  text-align: center;
  margin: 5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  width: auto;
}

.custom-translater .el-input__inner {
  height: 32px;
  width: 100%;
  font-size: 12px;
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 16px;
  padding-right: 10px;
  padding-left: 30px;
}

.custom-translater .el-input__icon {
  margin-left: 5px;
}

.custom-translater .el-icon-circle-close {
  cursor: pointer;
}

.el-tree-node__expand-icon.custom_expanded {
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
}
</style>

<script>
import $ from "jquery";
import Service from "../../public/fakeSerivce/index.js";

export default {
  inject: ["flowEditor"],

  props: {},

  data() {
    return {
      serviceQuery:'',
      scriptQuery:'',
      showScriptSearch: false,
      showServiceSearch: false,
      expandKeys: [1],
      treeProps: {
        children: "children",
        label: "tree_node_desc"
        /*isLeaf (data) {
              return data.$type != null
            }*/
      },
      serviceTreeProps: {
        children: "children",
        label: "serivce_name"
      }
    };
  },
  mounted(){
    window.tree1=this.$refs.scriptTree

    window.tree2=this.$refs.serviceTree
  },
  computed: {
    editor() {
      return this.flowEditor.editor;
    },
    treeData() {
      let result;
      try {
        result = this.editor.config.palette;
      } catch (e) {
        result = [];
      }

      return result;
    },
    serviceTreeData() {
      let result;
      try {
        result = this.editor.config.palette$0;
      } catch (e) {
        result = [];
      }

      return result;
    }
  },

  methods: {
    buttonKey(e) {
      e = e || window.event;
      if (e.keyCode === 13) {
        e.preventDefault();
      }
    },
    filter(value, data) {
      // console.log(value);
      return (
        value == null ||
        value === "" ||
        (data["tree_node_desc"].toLowerCase().match(value.toLowerCase()) ||
          data["tree_p_node_name"].toLowerCase().match(value.toLowerCase()))
      );
    },
    renderContent(h, { node, data }) {
      if (data.expand === true) {
        node.expanded = true;
      }
      const content = (
        <span class="custom-tree-node">
          <span>
            <i
              class={"el-icon-flow-twofirstlevel1"}
              style={`cursor: pointer;padding: 0.6rem;color: #466183`}
            />
            <span class="el-tree-node__label">{node.label}</span>
          </span>
          <span
            class={{
              "el-tree-node__expand-icon": true,
              "el-icon-caret-left": true,
              "is-leaf": node.isLeaf,
              custom_expanded: !node.isLeaf && node.expanded
            }}
          />
        </span>
      );
      this.$nextTick(() => {
        $(content.elm)
          .prev(".el-icon-caret-right")
          .css("display", "none");
      });
      return content;
    },
    fireScriptTreeFilter(val) {
      this.scriptQuery = val;
      this.$refs.scriptTree.filter(this.scriptQuery);
    },
    fireServiceTreeFilter(val) {
      this.serviceQuery = val;
      this.$refs.serviceTree.filter(this.serviceQuery);
    },
    handleOfContextmenu() {
      this.handleOfShowMenu([
        {
          name: "刷新",
          type: "item",
          handler: () => this.$emit("load", this.editor)
        }
      ]);
    },
    handleOfNodeClick(item) {
      this.$emit("create", item, this.editor);
    }
  }
};
</script>
