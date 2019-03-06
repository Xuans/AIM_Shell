import getEditorConfig from '../util/editor-config'

const defaults = {
  render: false,
  palette: true,
  mode: 0,
  dirty: false,
  config: null
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

    Promise.all(Array.of(getServiceInstance(this.target), getScriptInstanceTree(this.target), getServiceInstanceTree(this.target)))
        .then(([json, scriptTree, serviceTree]) => {
          this.config = getEditorConfig(this.target, json)

          this.config.scriptTree = scriptTree
          this.config.serviceTree = serviceTree

          this.render = true
          this.palette = this.target.lastest
        })
  }

  setDirty (editor) {
    editor && (this.dirty = editor.isDirty())
  }
}

export default function makeState (target) {
  return new State(target)
}
