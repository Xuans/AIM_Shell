import {State} from './state'
import {VersionsEditorConfig} from '../util/editor-config'
import genJson from "../util/gen-json";
import update from '../util/update'

class VersionsState extends State {
  constructor (target) {
    super(target, {
      render: false,
      palette: false,
      dirty: false,
      config: null
    })
  }

  refresh () {
    const {$buildTarget} = Vue

    $buildTarget(this.target).then(json => {
      this.config = this.createEditorConfig(json)
      this.render = true
    })
  }

  createEditorConfig (json) {
    return new VersionsEditorConfig(this.target, json)
  }

  save = update

  genJson = genJson
}

export default function makeState (target) {
  return new VersionsState(target)
}
