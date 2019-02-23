import $ from 'jquery'
import KeyManager from '../../util/keyManager'
import makeState from '../util/state'
import handleOfCreate from "../util/create-tool";

export default {
  props: ['file'],

  data () {
  },

  computed: {
    state () {
      return makeState(this.file)
    }
  },

  created () {
    this.keyManagerOfFlow = new KeyManager()
    this.keyManager = new KeyManager()
    this.keyManager.watchPage('0', this.keyManagerOfFlow)
    this.keyManager.active('0')
  },

  beforeDestroy () {
    this.keyManagerOfFlow.unwatchAllPage()
    this.keyManager.unwatchAllPage()
  },

  methods: {
    updateInput (editor) {
      /*this.state.update(editor)
      this.state.setInput(this.input, this.state.genInput(editor))*/
    },

    /* about flow */
    propsOfFlow (someParams) {
      let config = this.state.input2Config(someParams)
      let evnet = { vueHandler: this.handleOfFlowCallback }

      return {config, eventsOnEditor: evnet, keyManager: this.keyManagerOfFlow}
    },
    saveOfFlow (editor) {
      this.state.save(editor)
    },
    dirtyOfFlow (editor) {
      return editor == null ? false : editor.isDirty()
    },
    validateOfFlow (type, editor) {
      /*return new Promise(resolve => {
        validate(type, editor).then(resolve).catch(error => {
          this.$alert(error.toString(), '保存错误', {
            confirmButtonText: 'OK',
            type: 'error',
            dangerouslyUseHTMLString: true
          })
        })
      })*/
    },
    inputOfFlow (input) {
      return $.extend(true, {}, input)
    },

    /* handlers */
    handleOfCreate: handleOfCreate,
    handleOfSave: $.noop,
    handleOfLoad:  $.noop,
    handleOfCommand () {
      this.dirty = this.isDirty()
    },
    handleOfFlowCallback (fn, params) {
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
