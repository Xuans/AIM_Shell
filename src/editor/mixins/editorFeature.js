import $ from 'jquery'
import KeyManager from '../../util/keyManager'
import makeState from '../state/state'
import handleOfCreate from "../util/create-tool";
import EditorStore from '../util/editor-store'

export default {
  props: ['target'],

  data () {
    return {
      state: makeState(this.target),
      store: new EditorStore()
    }
  },

  computed: {
    head () {
      return this.target.head
    }
  },

  created() {
    this.keyManagerOfFlow = new KeyManager()
    this.keyManager = new KeyManager('global')
    this.keyManager.watchPage('0', this.keyManagerOfFlow)
    this.keyManager.active('0')
  },

  beforeDestroy() {
    this.store.clear()

    this.keyManagerOfFlow.unwatchAllPage()
    this.keyManager.unwatchAllPage()
  },

  methods: {
    saveOfFlow(editor) {
      this.state.save(editor, this.target);
    },

    /* handlers */
    handleOfCreate: handleOfCreate,
    handleOfSave(editor,done) {
      done();
      this.state.setDirty(this.store.activeEditor)
    },
    handleOfCommand() {
      this.state.setDirty(this.store.activeEditor)
    },
    handleOfInit(editor) {
      this.store.push(this.head, editor)
    },
    handleOfFlowCallback(fn, params = []) {
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