import $ from 'jquery'
import KeyManager from '../../util/keyManager'
import makeState from '../state/state'
import handleOfCreate from '../util/create-tool'
import EditorStore from '../util/editor-store'

export default {
  props: {
    target: Object,
    makeState: {
      type: Function,
      default: makeState
    }
  },

  data () {
    return {
      state: this.makeState(this.target),
      store: new EditorStore(this.target)
    }
  },

  created () {
    this.keyManagerOfFlow = new KeyManager()
    this.keyManager = new KeyManager('global')
    this.keyManager.watchPage('0', this.keyManagerOfFlow)
    this.keyManager.active('0')
  },

  beforeDestroy () {
    this.store.clear()

    this.keyManagerOfFlow.unwatchAllPage()
    this.keyManager.unwatchAllPage()
  },

  methods: {
    handleOfCreate: handleOfCreate,
    handleOfSave (editor, done) {
      const state = this.state

      state.save(editor) // update in fact

      this.$saveSerivce(this.target, state.genJson(editor))
          .then(() => state.setDirty(editor))
    },
    handleOfCommand () {
      this.state.setDirty(this.store.activeEditor)
    },
    handleOfInit (editor) {
      this.store.push(this.target.head, editor)
    },
    handleOfFlowCallback (fn, params = []) {
      if ($.isFunction(fn)) {
        fn(this)
      } else if (typeof fn === 'string') {
        if ($.isFunction(this[fn])) {
          Reflect.apply(this[fn], this, params)
        }
      }
    }
  }
}
