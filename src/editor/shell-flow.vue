<template>
  <div class="aim-shell-content">
    <flow-editor
            ref="editor"
            v-if="state.render"
            :config="state.config"
            :eventsOnEditor="{vueHandler: handleOfFlowCallback}"
            :maximize="maximize"
            @init="handleOfInit"
            @save="handleOfSave"
            @command="handleOfCommand"
    >
      <palette v-if="state.palette" slot="palette" @create="handleOfCreate"></palette>
      <mutil-panel slot="canvasUnder" :store="store"></mutil-panel>
    </flow-editor>

    <dblf-transition
            ref="transition"
            :visible="nodeOpts.visible"
            :expand.sync="nodeOpts.expand"
            @click-control="nodeOfOpen"
            @click-back="nodeOfCollapse"
            @editor-open="nodeOfOpening">
      <slot name="form" :store="store"></slot>
    </dblf-transition>

  </div>
</template>
<script type="text/javascript">
import palette from '../flowEditor/palette.vue'
import flowEditor from '../flowEditor/flowEditor.vue'
import dblfTransition from './transition.vue'
import mutilPanel from '../components/Panel/MutilPanel.vue'

import editorFeature from './mixins/dblfFeature'
import contextmenu from './mixins/contextmenu'
import abbreviate from './mixins/abbreviate'

export default {
  name: 'dblf-editor',

  mixins: [editorFeature, contextmenu, abbreviate],

  data () {
    return {
      nodeOpts: {
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
    maximize () {
      return this.state.palette ? this.stepOpts.maximize : true
    }
  },
  watch: {
    'target.head'(vision) {
      if (this.store.has(vision)) {
        this.$refs.editor.replaceEditor(this.store.getAndApplyCurrent(vision))
        this.state.palette = false
      } else {
        this.state.refresh()
      }
    }
  },

  methods: {
    /* about step editor */
    stepOfSelectionChange (selection) {
      this.setStoreActive(selection)
      this.nodeOpts.visible = this.nodeOpts.expand || this.store.active != null
      if (this.nodeOpts.expand) {
        this.nodeOfOpen()
      }
    },

    /* about node editor */
    nodeOfBeforeDelete (model) {
      if (this.activeOrNot(model)) {
        this.$refs.transition.$once('editor-closed', () => {
          this.nodeOfDetach()
          this.store.active = null
        })
      }

    },
    nodeOfExpand (model) {
      if (model != null) {
        this.nodeOpts.desp = model.get('Desp') || ''
        this.nodeOpts.expand = this.nodeOpts.visible = true
        this.stepOpts.maximize = true
        this.stepOpts.disable = true
      }
    },
    nodeOfCollapse () {
      this.nodeOpts.expand = false
      this.nodeOpts.visible = this.store.active != null
      this.stepOpts.maximize = false
      this.stepOpts.disable = false
      this.abbreviateWhenClose(this.store.activeEditor)
    },
    nodeOfOpen (model = this.store.active) {
      this.nodeOfExpand(model)
    },
    nodeOfDetach () {
      // this.$refs['nodeEditor'].detachEditor()
    },
    nodeOfSwitch () {
      if (this.nodeOpts.visible) {
        this.nodeOpts.expand ? this.nodeOfCollapse() : this.nodeOfOpen()
      }
    },
    nodeOfOpening (el) {
      this.abbreviateWhenOpen(this.store.activeEditor, this.store.active, el)
    }
  },

  components: {
    palette,
    flowEditor,
    dblfTransition,
    mutilPanel
  }
}
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

