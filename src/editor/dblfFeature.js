import editorFeature from './editorFeature'
import NodePool from './nodePool'

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
    save (resolve, reject) {
      this.validateOfDblf().then(() => {
        this.updateInput()
        this.saveEditorFile(resolve, reject).then(this.saveOfDblf)
      })
    },

    inputOfNode (model) {
      return this.inputOfFlow({Node: model.props})
    },

    // @override
    updateInput () {
      /* TODO fix */
      this.cfgByResId.update(this.flowOfStep, this.store.nodes)
      this.cfgByResId.setInput(this.input, this.cfgByResId.genInput(this.flowOfStep, this.store.pool))
    },

    /* about dblf */
    validateOfDblf () {
      let store = this.store
      if (this.store.size === 0) {
        return this.validateOfFlow('step', this.flowOfStep)
      }

      let nodeIterator = store.nodes[Symbol.iterator]()
      let item = nodeIterator.next()
      let resolve = () => (item = nodeIterator.next()).done
          ? this.validateOfFlow('step', this.flowOfStep)
          : this.validateOfFlow('node', item.value).then(resolve)
      return this.validateOfFlow('node', item.value).then(resolve)
    },
    saveOfDblf () {
      Reflect.apply(this.cfgByResId.save, this.cfgByResId, this.getAllEditors(false))
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
      return true
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
      this.store = NodePool.create(editor)
      this.handleOfLoadBcpt(editor)
    },
    handleOfNodeInit (editor) {
      this.store.add(editor)
      this.handleOfLoadTcpt(editor)
    }
  },

  beforeDestroy () {
    this.store.nodes.forEach(node => node.dispose())
    this.store.clear()
  }
}
