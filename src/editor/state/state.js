import getEditorConfig from "../util/editor-config";

import Serivces from "../../../public/fakeSerivce"

const defaults = {
  render: false,
  palette: false,
  mode: 0,
  dirty: false
}


class State {
  constructor (target, options = defaults) {

    for (let [key, value] of Object.entries(options)) {
      this[key] = value
    }

    this.target = target
    this.config = null

    this.input2Config()
  }

  input2Config () {
    Serivces.getServiceInstance(this.target)
        .then(json => {
          this.config = getEditorConfig(this.mode, this.target, json) // select it by mode
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