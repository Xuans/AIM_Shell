import {EditorConfig, DebugEditorConfig} from '../util/editor-config'

const defaults = {
  render: false,
  palette: true,
  dirty: false,
  config: null
}

export class State {
  constructor (target, options = defaults) {
    for (let [key, value] of Object.entries(options)) {
      this[key] = value
    }

    this.target = target

    this.refresh()
  }

  refresh () {
    const {getServiceInstance, getScriptInstanceTree, getServiceInstanceTree} = Vue

    Promise.all(Array.of(getServiceInstance(this.target), getScriptInstanceTree(this.target), getServiceInstanceTree(this.target)))
        .then(([json, scriptTree, serviceTree]) => {
          this.config = this.createEditorConfig(json)

          if (this.target.lastest) {
            this.config.scriptTree = scriptTree
            this.config.serviceTree = serviceTree
            this.palette = true
          }

          this.render = true
        })
  }

  setDirty (editor) {
    editor && (this.dirty = editor.isDirty())
  }

  createEditorConfig (json) {
    return this.target.lastest ? new EditorConfig(this.target, json) : new DebugEditorConfig(this.target, json)
  }
}

export default function makeState (target) {
  return new State(target)
}
