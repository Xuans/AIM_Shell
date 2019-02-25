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
    save (resolve, reject) {
      this.validateOfDblf().then(() => {
        this.updateInput()
        // this.saveEditorFile(resolve, reject).then(this.saveOfDblf)
      })
    },

    inputOfNode (model) {
      return this.inputOfFlow({Node: model.props})
    },

    /*// @override
    updateInput () {
      /!* TODO fix *!/
      this.state.update(this.flowOfStep, this.store.nodes)
      this.state.setInput(this.input, this.state.genInput(this.flowOfStep, this.store.pool))
    },*/

    /* about dblf */
    validateOfDblf () {
      /*let store = this.store
      if (this.store.size === 0) {
        return this.validateOfFlow('step', this.flowOfStep)
      }

      let nodeIterator = store.nodes[Symbol.iterator]()
      let item = nodeIterator.next()
      let resolve = () => (item = nodeIterator.next()).done
          ? this.validateOfFlow('step', this.flowOfStep)
          : this.validateOfFlow('node', item.value).then(resolve)
      return this.validateOfFlow('node', item.value).then(resolve)*/

      // TODO 验证是否可保存
      return Promise.resolve()
    },
    saveOfDblf () {
      Reflect.apply(this.state.save, this.state, this.getAllEditors(false))
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
