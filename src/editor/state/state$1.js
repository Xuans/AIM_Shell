import State from "./state";
import node from "../figure/node";
import { lineOfUnselectable } from "../figure/line";
import types from "../figure/types"
import { ReaderListener } from "../util/manhattan-router";
import { dblfPolicy } from "../util/bind-event";
import Serivces from "../../../public/fakeSerivce";
import { debugRootPolicy } from "../util/debug-policy";
import debuggerRunner from "../../util/scriptDebugger";

const BaseConfig = {
  children: { node },
  lines: { '0': lineOfUnselectable },
  types,
  onHooks: [ReaderListener],
  policies: { dblfPolicy, debugRootPolicy }
}

function registerOperations(config, state) {
  (config.operations || (config.operations = [])).push({
    id: 'edit',
    name: '编辑模式',
    type: 2,
    run() {
      this.editor.rootEditPart.$emit('vueHandler', vue => vue.target.type = 0)
    }
  }, {
      id: 'debugger',
      name: '关闭Log',
      type: 2,
      key: 'f11',
      check() {
        return true
      },
      run() {
        this.editor.rootEditPart.$emit('debug-stop');
      }
    })
}

export default class State$1 extends State {
  constructor (target) {
    super(target)
  }

  input2Config() {
    const target = this.target
    const serviceInstance =await Serivces.getServiceInstance(target)
    const config = {}

    config.id = target.id
    State.addDataAndLine(config, serviceInstance.data)
    registerOperations(config,this)

    return Object.assign(config, BaseConfig)
  }
}