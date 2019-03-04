import $ from 'jquery'
import KeyManager from '../../util/keyManager'
import makeState from '../state'
import handleOfCreate from "../util/create-tool";

export default {
  props: ['target'],

  data() {},

  computed: {
    state() {
      return makeState(this.target)
    }
  },

  created() {
    this.keyManagerOfFlow = new KeyManager()
    this.keyManager = new KeyManager('global')
    this.keyManager.watchPage('0', this.keyManagerOfFlow)
    this.keyManager.active('0')
  },

  beforeDestroy() {
    this.keyManagerOfFlow.unwatchAllPage()
    this.keyManager.unwatchAllPage()
  },

  methods: {
    /* about flow */
    propsOfFlow() {
      this.state.input2Config((config) => {
        let event = {
          vueHandler: this.handleOfFlowCallback
        }
        this.stepCfg = {
          config,
          eventsOnEditor: event,
          keyManager: this.keyManagerOfFlow
        };
      })
    },
    saveOfFlow(editor) {
      this.state.save(editor, this.target);
    },
    dirtyOfFlow(editor) {
      return editor == null ? false : editor.isDirty()
    },
    inputOfFlow(input) {
      return $.extend(true, {}, input)
    },

    /* handlers */
    handleOfCreate: handleOfCreate,
    handleOfSave(editor,done) {
      done();
      this.handleOfCommand();
    },
    handleOfLoad: $.noop,
    handleOfCommand() {
      this.dirty = this.isDirty()
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