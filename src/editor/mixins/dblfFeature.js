import editorFeature from './editorFeature'
import NodePool from '../util/nodePool'

export default {
  extends: editorFeature,

  data () {
    return {
      store: null
    }
  },

  computed: {
    flowOfStep () {
      return this.store != null ? this.store.step : null
    }
  },

  methods: {
    /* editor hooks */
    isDirty () {
      if (!this.dirty) {
        this.dirty |= this.dirtyOfFlow(this.flowOfStep)

        if (!this.dirty && this.store.size > 0) {
          this.dirty = this.store.nodes
              .reduce((dirty, node) => dirty | this.dirtyOfFlow(node), this.dirty)
        }
      }
      return this.dirty
    },
    save () {
      this.saveOfFlow(this.store.step)
    },

    /* node pool manage */
    nodeOfToDelete (model) { // 准备进行删除
      if (this.store.containByModel(model)) {
        this.nodeOfBeforeDelete && this.nodeOfBeforeDelete(model, () => this.nodeOfDeleting(model))
      }
    },
    nodeOfDeleting (model) { // 正在进行删除
      this.store.deleteByModel(model).dispose()
    },

    /* helper function */
    activeOrNot (model) {
      return this.store.active === model
    },
    editableOrNot (model) {
      return true
    },
    nodeOrNot (selection) {
      return $AG.EditPart.isNode(selection)
    },

    setStoreActive (selection) {
      this.store.active = this.nodeOrNot(selection) ? selection.model : null
    },
    getAllEditors (stepFirst) { // 返回所有editor实例
      let nodes = this.store.nodes

      stepFirst ? nodes.unshift(this.store.step) : nodes.push(this.store.step)
      return nodes
    },

    /* handlers */
    handleOfLoadBcpt (editor) {
      this.handleOfLoad('step', editor)
    },
    handleOfLoadTcpt (editor) {
      this.handleOfLoad('node', editor)
    },
    handleOfStepInit (editor) {
      this.store && this.store.clear()
      this.store = NodePool.create(editor)
    },
    handleOfNodeInit () {
      this.store.add(editor)
    }
  },

  beforeDestroy () {
    this.store.nodes.forEach(node => node.dispose())
    this.store.clear()
  }
}
