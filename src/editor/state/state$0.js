import State from './state'
import Serivces from "../../../public/fakeSerivce";
import node from "../figure/node";
import line from "../figure/line";
import types from "../figure/types";
import {ReaderListener} from "../util/manhattan-router";
import {dblfPolicy} from "../util/bind-event";
import update from "../util/update";

const BaseConfig = {
  children: { node },
  lines: { '0': line },
  types,
  onHooks: [ReaderListener],
  policies: { dblfPolicy },
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

  input2Config (target) {
    const serviceInstance = Serivces.getServiceInstance(target)
    const config = {}

    config.id = target.id
    config.palette = Serivces.getScriptInstanceTree(target)

    State.addDataAndLine(config, serviceInstance.data)
    registerOperations(config)

    return Object.assign(config, BaseConfig)
  }

  save (editor, target) {
    if (editor.isDirty() && this.validate(editor)) {

      update(editor)

      Serivces
          .save(target, this.getData(editor))
          .then(() => editor.doSave())
    }
  }


  validate () {
    return true
  }
}