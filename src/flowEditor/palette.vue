<template>
    <el-container direction="vertical" class="palette_container">
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
    </el-container>
</template>

<style>
    .palette_container {
        transition: 1s;
        padding: 5px;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
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
          // this.handleOfHideMenu()
          this.$emit('create', item, this.editor)
        }
      }
    }
</script>
