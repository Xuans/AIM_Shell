<template>
    <el-container direction="vertical" class="palette_container">
        <div class="el-transfer-panel" style="width: auto;height: 50%">
            <p class="el-transfer-panel__header">
                <span>脚本</span>
            </p>

            <div class="el-transfer-panel__body">
                <el-input prefix-icon="el-icon-search"
                          size="mini"
                          clearable
                          @input="handleOfFilterChange"></el-input>
                <el-tree ref="tree"
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
            </div>
        </div>

        <div class="el-transfer-panel" style="width: auto; margin-top: 10px; height: 50%">
            <p class="el-transfer-panel__header">
                <span>服务</span>
            </p>

            <div class="el-transfer-panel__body">
                <el-input prefix-icon="el-icon-search"
                          size="mini"
                          clearable
                          @input="handleOfFilterChange"></el-input>
                <el-tree ref="tree1"
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
        return {
          expandKeys: [1],
          treeProps: {
            children: 'children',
            label: 'tree_node_desc',
            /*isLeaf (data) {
              return data.$type != null
            }*/
          },
          serviceTreeProps: {
            children: 'children',
            label: 'serivce_name',
          }
        }
      },

      computed: {
        editor () {
          return this.flowEditor.editor
        },
        treeData () {
          let result
          try {
            result = this.editor.config.palette
          } catch (e) {
            result = []
          }

          return result
        },
        serviceTreeData () {
          let result
          try {
            result = this.editor.config.palette$0
          } catch (e) {
            result = []
          }

          return result
        }
      },

      methods: {
        filter (value, data) {
          return value == null || value === ''
              ? true
              : data.label.toLowerCase().match(value.toLowerCase()) != null
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
          this.$refs.tree.filter(val)
        },
        handleOfContextmenu () {
          this.handleOfShowMenu([
            {
              name: '刷新',
              type: 'item',
              handler: () => this.$emit('load', this.editor)
            }
          ])
        },
        handleOfNodeClick (item) {
          this.$emit('create', item, this.editor)
        }
      }
    }
</script>
