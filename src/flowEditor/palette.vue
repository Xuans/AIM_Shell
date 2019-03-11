<template>
  <el-tabs type="card" value="first">
    <el-tab-pane label="脚本" name="first">
      <el-input prefix-icon="el-icon-search"
                v-model="input"
                size="mini"
                clearable
                @input="handleOfFilterChange"></el-input>

      <el-tree ref="script"
               v-show="!searching"
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
               @node-click="handleOfNodeClick"></el-tree>

      <el-tree v-show="searching"
               style="margin-top: 0.5rem"
               draggable
               :data="searchResult"
               :props="searchTreeProps"
               :render-content="renderContent"
               :allow-drag="(node) => node.data != null"
               :allow-drop="() => false"
               @node-expand="data => data.expand = true"
               @node-collapse="data => data.expand = false"
               @node-click="handleOfClickInSearch"></el-tree>

    </el-tab-pane>
    <el-tab-pane label="服务" name="second">
      <el-input prefix-icon="el-icon-search"
                size="mini"
                v-model="input"
                clearable
                @input="handleOfFilterChange"></el-input>
      <el-tree ref="service"
               v-show="!searching"
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
               @node-click="handleOfNodeClick"></el-tree>

      <el-tree v-show="searching"
               style="margin-top: 0.5rem"
               draggable
               :data="searchResult"
               :props="searchTreeProps"
               :render-content="renderContent"
               :allow-drag="(node) => node.data != null"
               :allow-drop="() => false"
               @node-expand="data => data.expand = true"
               @node-collapse="data => data.expand = false"
               @node-click="handleOfClickInSearch"></el-tree>
    </el-tab-pane>
  </el-tabs>
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

  .custom-translater .el-input__inner{
    height:32px;
    width:100%;
    font-size:12px;
    display:inline-block;
    -webkit-box-sizing:border-box;
    box-sizing: border-box;
    border-radius:16px;
    padding-right:10px;
    padding-left:30px
  }

  .custom-translater .el-input__icon{
    margin-left:5px
  }

  .custom-translater .el-icon-circle-close{
    cursor:pointer
  }

  .el-tree-node__expand-icon.custom_expanded{
    -webkit-transform:rotate(-90deg);
    transform:rotate(-90deg)
  }
</style>

<script>
  import $ from 'jquery'

  export default {

    inject: ['flowEditor'],

    props: {},

    data () {
      console.log('palette data');
      return {
        searchResult: [],
        input: '',
        expandKeys: [1],
        treeProps: {
          children: this.$field.scriptTree.children,
          label: this.$field.scriptTree.label
        },
        serviceTreeProps: {
          children: this.$field.serviceTree.children,
          label: this.$field.serviceTree.label
        },
        searchTreeProps: {
          label: 'label'
        }
      }
    },

    computed: {
      searching () {
        return this.input !== ''
      },
      editor () {
        return this.flowEditor.editor
      },
      treeData () {
        return this.editor ? this.editor.config.scriptTree : Array.of()
      },
      serviceTreeData () {
        let result
        try {
          result = this.editor.config.serviceTree
        } catch (e) {
          result = []
        }

        return result
      }
    },

    methods: {
      filter (value, data, node) {
        if (value == null || value === '') {
          return true
        }

        if (node.label.toLowerCase().match(value.toLowerCase()) != null) {
          this.searchResult.push({
            label: node.label,
            data: data
          })
          return true
        }

        return false
      },
      renderContent (h, { node, data }) {
        if (data.expand === true) {
          node.expanded = true
        }
        const content = (
                <span class="custom-tree-node">
                  <span>
                      <i class={'el-icon-flow-twofirstlevel1'}
                         style={`cursor: pointer;padding: 0.6rem;color: #466183`}>
                      </i>
                      <span class="el-tree-node__label">{node.label}</span>
                  </span>
                <span class={{
                  'el-tree-node__expand-icon': true,
                  'el-icon-caret-left': true,
                  'is-leaf': node.isLeaf,
                  'custom_expanded': !node.isLeaf && node.expanded
                }}>
                </span>
              </span>
        )
        this.$nextTick(() => {
          $(content.elm).prev('.el-icon-caret-right').css('display', 'none')
        })
        return content
      },
      handleOfFilterChange (val) {
        this.searchResult = []

        this.$refs.script.filter(val)
        this.$refs.service.filter(val)
      },
      handleOfNodeClick (item) {
        this.$emit('create', item, this.editor)
      },
      handleOfClickInSearch (item) {
        this.$emit('create', item.data, this.editor)
      }
    }
  }
</script>

