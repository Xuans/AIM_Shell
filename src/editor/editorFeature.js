import $ from 'jquery'

const Configuration=()=>{};

import KeyManager from './keyManager'
// import validate from '../resolve/validate'
// import editor from 'ide/mixins/editor'

export default {
  props: ['file'],

  // extends: editor,

  data () {
  },

  computed: {
    cfgByResId () {
      return Configuration(this.file)
    }
  },

  created () {
    this.keyManagerOfFlow = new KeyManager()
    this.keyManager = new KeyManager()
    this.keyManager.watchPage('0', this.keyManagerOfFlow)
    this.keyManager.active('0')

    // this.cfgByResId.editorActions().forEach(action => this.editorActions.push(action))
    // this.cfgByResId.editorActions && this.cfgByResId.editorActions().forEach(action => this.editorActions.push(action))
  },

  beforeDestroy () {
    this.keyManagerOfFlow.unwatchAllPage()
    this.keyManager.unwatchAllPage()
  },

  methods: {
    /* editor hooks */
    getPartName () {
      return this.cfgByResId.getDisplayName(this.file.path)
    },

    updateInput (editor) {
      this.cfgByResId.update(editor)
      this.cfgByResId.setInput(this.input, this.cfgByResId.genInput(editor))
    },

    /* about flow */
    propsOfFlow (type, input) {
      let config = this.cfgByResId.input2Config(type, input)
      let evnet = { vueHandler: this.handleOfFlowCallback }

      return {config, eventsOnEditor: evnet, keyManager: this.keyManagerOfFlow}
    },
    saveOfFlow (editor) {
      this.cfgByResId.save(editor)
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
    handleOfCreate: $.noop,
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
  },
  // components: {switchTool, toolbar}
}
