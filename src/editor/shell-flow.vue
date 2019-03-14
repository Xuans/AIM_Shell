<template>
  <flow-editor
          ref="editor"
          v-if="state.render"
          :config="state.config"
          :eventsOnEditor="{vueHandler: handleOfFlowCallback}"
          :maximize="maximize === undefined ? !state.palette : maximize"
          autofocus
          @init="handleOfInit"
          @save="handleOfSave"
          @command="handleOfCommand">
      <palette v-if="state.palette" slot="palette" @create="handleOfCreate"></palette>

      <slot slot="canvasUnder" name="panels" :store="store"></slot>

      <slot slot="canvas" name="canvass"></slot>

  </flow-editor>
</template>
<script type="text/javascript">
  import palette from '../flowEditor/palette.vue'
  import flowEditor from '../flowEditor/flowEditor.vue'
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
    mounted(){
      console.log('编辑器成功加载:',this.target);
    },
    methods: {
      nodeOrNot (selection) {
        return $AG.EditPart.isNode(selection)
      },
      activeOrNot (model) {
        return this.store.active === model
      },
      handleOfSwitch(){
          this.$emit('onswitch');
      },
      selectionChange (selection) {
        if (selection instanceof Array && selection.length === 1) selection = selection[0]

        selection = this.nodeOrNot(selection) ? selection.model : null

        if (!this.activeOrNot(selection)) {
          this.store.active = selection
          this.$emit('selection-change', selection)
        }
      },

      removing (model) {
        if (this.activeOrNot(model)) {
          this.store.active = null
          this.$emit('selection-remove', model)
        }
      }
    },

    components: { palette, flowEditor }
  }
</script>

