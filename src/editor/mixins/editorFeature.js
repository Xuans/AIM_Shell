import $ from 'jquery'
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

  beforeDestroy () {
    this.store.clear()
  },

  methods: {
    handleOfCreate: handleOfCreate,
    handleOfSave (editor) {
      const state = this.state

      let app=window.app;
      state.update(editor) // update in fact
window.editor=editor;
      this.$saveSerivce(this.target, state.genJson(editor),editor.config.service_args)
          .then(() => {
            if(app)app.alert('保存成功');
            state.setDirty(editor)
          }).catch(error=>{
            if(app)app.alert(error);
          })
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
