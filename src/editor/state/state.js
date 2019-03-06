import getEditorConfig from '../util/editor-config'

const defaults = {
  render: false,
  palette: true,
  mode: 0,
  dirty: false,
  config: null,
  version: null
}

class State {
  constructor (target, options = defaults) {
    for (let [key, value] of Object.entries(options)) {
      this[key] = value
    }

    this.target = target

    this.refresh()
  }

  refresh () {
    const {getServiceInstance, getScriptInstanceTree, getServiceInstanceTree} = Vue

    Promise.all(Array.of(getServiceInstance(this.target, this.version), getScriptInstanceTree(this.target), getServiceInstanceTree(this.target)))
        .then(([json, scriptTree, serviceTree]) => {
          this.config = getEditorConfig(this.mode, this.target, json)

          this.config.scriptTree = scriptTree
          this.config.serviceTree = serviceTree

          this.render = true
        })
  }

  turnToDebug () {
    this.mode = 1
  }

  turnToEdit () {
    this.mode = 0
  }

  setDirty (editor) {
    editor && (this.dirty = editor.isDirty())
  }
}

export default function makeState (target) {
  return new State(target)
}
