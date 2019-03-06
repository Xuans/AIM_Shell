import editorFeature from './editorFeature'

export default {
  extends: editorFeature,

  methods: {
    /* editor hooks */
    save() {
      this.saveOfFlow(this.store.activeEditor)
    },

    // node pool manage
    nodeOfToDelete(model) { // 准备进行删除
      this.nodeOfBeforeDelete && this.nodeOfBeforeDelete(model)
    },

    /* helper function */
    activeOrNot(model) {
      return this.store.active === model
    },
    nodeOrNot(selection) {
      return $AG.EditPart.isNode(selection)
    },

    setStoreActive(selection) {
      this.store.active = this.nodeOrNot(selection) ? selection.model : null
    }
  }
}
