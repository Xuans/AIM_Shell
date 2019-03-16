import {EditorConfig, DebugEditorConfig} from '../util/editor-config'
import update from '../util/update'
import genJson from '../util/gen-json'

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

    
    const {$buildTarget, $getScriptInstanceTree, $getServiceInstanceTree} = Vue

    Promise.all(Array.of($buildTarget(this.target), $getScriptInstanceTree(this.target), $getServiceInstanceTree(this.target)))
        .then(([serviceData, scriptTree, serviceTree]) => {
          this.config = this.createEditorConfig()

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

  createEditorConfig () {
    return this.target.lastest ? new EditorConfig(this.target) : new DebugEditorConfig(this.target)
  }

  genJson = genJson

  update = update
}

export default function makeState (target) {
  return new State(target)
}
