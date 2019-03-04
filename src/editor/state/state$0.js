import State from './state'
import Serivces from "../../../public/fakeSerivce";
import node from "../figure/node";
import line from "../figure/line";
import types from "../figure/types";
import {ReaderListener} from "../util/manhattan-router";
import {dblfPolicy} from "../util/bind-event";
import update from "../util/update";
import layoutPolicy from '../util/layout-policy'

/**
 * 脚本编排编辑器全部写在这里
 */

const BaseConfig = {
  children: { node:node() },
  lines: { '0': line },
  types,
  onHooks: [ReaderListener],
  policies: { dblfPolicy },
  layoutable: layoutPolicy
}

function registerOperations (config) {
  (config.operations || (config.operations = [])).push(
      {
        id: 'save',
        name: '保存',
        type: 2,
        check () {
          return this.editor.isDirty()
        },
        run () {
          this.editor.rootEditPart.$emit('vueHandler', 'save')
        }
      },
      {
        id: 'selectAll',
        name: '全选',
        type: 2,
        key: 'ctrl+a',
        run () {
          this.editor.rootEditPart.setSelection(this.editor.rootEditPart.children)
        }
      },
      {
        id: 'delete',
        name: '删除',
        type: 0,
        key: 'delete',
        check () {
          return this.selection instanceof $AG.NodeEditPart ||
              this.selection instanceof $AG.LineEditPart ||
              (this.selection instanceof Array && this.selection.length > 0)
        },
        run () {
          var cmd, selection, root

          selection = this.selection
          root = selection instanceof Array ? selection[0].getRoot() : selection.getRoot()

          if (selection instanceof $AG.NodeEditPart || selection instanceof Array) {
            cmd = new $AG.DeleteNodeAndLineCommand(root, selection)
          } else {
            cmd = new $AG.DeleteLineCommand(root, selection)
          }

          if (cmd != null) {
            root.editor.execute(cmd)
          }
          root.setSelection(null)
        }
      },
      {
        id: 'undo',
        name: '撤销',
        type: 1,
        key: 'ctrl+z',
        check () {
          return this.stack.canUndo()
        },
        run () {
          this.stack.undo()
        }
      },
      {
        id: 'redo',
        name: '重做',
        type: 1,
        key: 'ctrl+y',
        check() {
          return this.stack.canRedo()
        },
        run: function () {
          this.stack.redo()
        }
      },
      {
        id: 'debugger',
        name: '调试模式',
        type: 2,
        key: 'f11',
        run () {
          this.editor.rootEditPart.$emit('vueHandler', vue => {
            vue.target.type = 1
          })
        }
      }
  )
}

export default class State$0 extends State {
  constructor (target) {
    super(target)
    this.hasPalette = true
  }

  input2Config (callback) {
    const target = this.target
    const promise = Serivces.getServiceInstance(target)


    const palPromise1 = Serivces.getScriptInstanceTree(target)
    const palPromise2 = Serivces.getServiceInstanceTree(target)

    Promise.all([promise,palPromise1,palPromise2]).then(response=>{

      debugger;
      
      const config = {}
      config.id = target.id
      config.palette=response[1];
      config.palette$0=response[2];

      State.addDataAndLine(config, response[0].data)
      registerOperations(config)
      callback(Object.assign(config, BaseConfig));
    })

  }

  save (editor, target) {
    if (editor.isDirty() && this.validate(editor)) {
      this.saving=true;
      update(editor)

      Serivces
          .save(target, this.getData(editor))
          .then(() => {editor._save(); this.saving=false;})
    }
  }

  getData (editor) {
    const json = { data: {} }
    const targetSet = new Set()

    editor.store.node().each(record => {
      json.data[record.id] = record.data

      if (record.data.target) {
        for (let target of Object.values(record.data.target)) {
          targetSet.add(target)
        }
      }
    })

    for (let id of Object.keys(json.data)) {
      if (!targetSet.has(id)) {
        json.start = id
        break
      }
    }

    return json
  }

  validate () {
    return true
  }
}