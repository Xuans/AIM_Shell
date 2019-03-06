import editorFeature from './editorFeature'

export default {
  extends: editorFeature,

  methods: {
    /* editor hooks */
    save() {
      this.saveOfFlow(this.store.activeEditor)
    },

    /* node pool manage */
/*    nodeOfToDelete(model) { // 准备进行删除
      if (this.store.containByModel(model)) {
        this.nodeOfBeforeDelete && this.nodeOfBeforeDelete(model, () => this.nodeOfDeleting(model))
      }
    },
    nodeOfDeleting(model) { // 正在进行删除
      this.store.deleteByModel(model).dispose()
    },*/

    /* helper function */
    activeOrNot(model) {
      return this.store.active === model
    },
    editableOrNot(model) {
      return true
    },
    nodeOrNot(selection) {
      return $AG.EditPart.isNode(selection)
    },

    setStoreActive(selection) {
      this.store.active = this.nodeOrNot(selection) ? selection.model : null
    }
  }
}
