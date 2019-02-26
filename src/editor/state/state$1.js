import State from "./state";
import node from "../figure/node";
import {lineOfUnselectable} from "../figure/line";
import types from "../figure/types"
import {ReaderListener} from "../util/manhattan-router";
import {dblfPolicy} from "../util/bind-event";
import Serivces from "../../../public/fakeSerivce";
import { debugRootPolicy } from "../util/debug-policy";

const BaseConfig = {
  children: { node },
  lines: { '0': lineOfUnselectable },
  types,
  onHooks: [ReaderListener],
  policies: { dblfPolicy, debugRootPolicy }
}

function registerOperations (config, state) {
  (config.operations || (config.operations = [])).push({
    id: 'edit',
    name: '编辑模式',
    type: 2,
    run () {
      this.editor.rootEditPart.$emit('vueHandler', vue => vue.target.type = 0)
    }
  }, {
    id: 'debugger',
    name: '执行流程',
    type: 2,
    key: 'f11',
    check() {
      return true
    },
    run() {
      debuggerRunner.start(this.editor.rootEditPart, state.getData(this.edtior));
    }
  })
}

export default class State$1 extends State {
  input2Config(target) {
    const serviceInstance = Serivces.getServiceInstance(target)
    const config = {}

    config.id = target.id
    State.addDataAndLine(config, serviceInstance.data)
    registerOperations(config)

    return Object.assign(config, BaseConfig)
  }
}