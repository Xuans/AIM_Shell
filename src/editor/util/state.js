import $ from 'jquery'
import line from '../figure/line'
import {ReaderListener} from "./manhattan-router"
import types from '../figure/types'
import node from '../figure/node'
import Serivces from '../../../public/fakeSerivce/index'
import {dblfPolicy} from "./bind-event";
import {createData, createLine} from "./create-tool";

const BaseConfig = {
  children: { node },
  lines: { '0': line },
  types,
  onHooks: [ReaderListener],
  policies: {dblfPolicy},
}

function addDataAndLine (config, dataOfService) {
  let data = []
  let line = []

  for (let [id, dataOfModel] of Object.entries(dataOfService)) {
    data.push(createData({id}, dataOfModel))

    if (dataOfModel.target) {
      for (let [terminalId, targetId] of Object.entries(dataOfModel.target)) {
        line.push(createLine({
          sourceId: id,
          targetId: targetId,
          exit: terminalId,
          entr: 'n'
        }))
      }
    }
  }

  config.data = data
  config.line = line
}

export default function makeState () {
  return {
    input2Config (target) {
      const serviceInstance = Serivces.getServiceInstance(target)
      const config = {}

      config.id = target.id
      config.palette = Serivces.getScriptInstanceTree(target)

      addDataAndLine(config, serviceInstance.data)

      return Object.assign(config, BaseConfig)
    },

    save (editor, target) {
      if (editor.isDirty() && this.validate(editor)) {

        this.update(editor)

        Serivces
            .save(target, this.getData(editor))
            .then(() => editor.doSave())
      }
    },

    getData (editor) {

    },

    update (editor) {
      let nodeStore = editor.store.node
      let lineStore = editor.store.line
    },

    validate () {
      return true
    }
  }
}