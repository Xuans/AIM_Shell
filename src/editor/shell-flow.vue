<template>
  <flow-editor
          ref="editor"
          v-if="state.render"
          :config="state.config"
          :eventsOnEditor="{vueHandler: handleOfFlowCallback}"
          :maximize="maximize === undefined ? !state.palette : maximize"
          @init="handleOfInit"
          @save="handleOfSave"
          @command="handleOfCommand">

    <palette v-if="state.palette" slot="palette" @create="handleOfCreate"></palette>

    <mutil-panel slot="canvasUnder" :store="store"></mutil-panel>

  </flow-editor>
</template>
<script type="text/javascript">
  import palette from '../flowEditor/palette.vue'
  import flowEditor from '../flowEditor/flowEditor.vue'
  import mutilPanel from '../components/Panel/MutilPanel.vue'
  import editorFeature from './mixins/editorFeature'

  export default {
    extends: editorFeature,

    watch: {
      'target.head' (vision) {
        if (this.store.has(vision)) {
          this.$refs.editor.replaceEditor(this.store.getAndApplyCurrent(vision))
        } else {
          this.state.refresh()
        }
      }
    },

    props: {
      maximize: Boolean
    },

    methods: {
      nodeOrNot (selection) {
        return $AG.EditPart.isNode(selection)
      },
      activeOrNot (model) {
        return this.store.active === model
      },

      selectionChange (selection) {
        this.store.active = this.nodeOrNot(selection) ? selection.model : null
        this.$emit('selection-change', selection)
      },

      removing (model) {
        if (this.activeOrNot(model)) {
          this.store.active = null
          this.$emit('selection-remove', model)
        }
      }
    },

    components: { palette, flowEditor, mutilPanel }
  }
</script>

