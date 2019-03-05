import {createData, createLine} from "./create-tool";
import {editNode, noeditNode} from "../figure/node";
import line, {lineOfUnselectable} from "../figure/line";
import types from "../figure/types";
import {ReaderListener} from "../util/manhattan-router";
import {dblfPolicy} from "../util/bind-event";
import update from "../util/update";
import layoutPolicy from '../util/layout-policy'
import {debugRootPolicy} from "./debug-policy";

function addDataAndLine(config, dataOfService) {
  let data = []
  let line = []

  for (let [id, dataOfModel] of Object.entries(dataOfService)) {
    data.push(createData({ id }, dataOfModel))

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


export class EditorConfig {
  constructor (target, json) {
    this.id = target.id;
    this.children = { node: editNode() }
    this.lines = { '0': line }
    this.types = types
    this.layoutPolicy = layoutPolicy
    this.onHooks = Array.of(ReaderListener)
    this.policies = {
      dblfPolicy
    }

    this.operations = Array.of(
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
            this.editor.rootEditPart.$emit('vueHandler', vue => vue.state.turnToDebug())
          }
        })

    addDataAndLine(this, json.data)
  }
}

class DebugEditorConfig {
  constructor (target, json) {
    this.id = target.id
    this.children = { node: noeditNode() }
    this.lines = { '0': lineOfUnselectable }
    this.types = types
    this.onHooks = Array.of(ReaderListener)
    this.policies = { dblfPolicy, debugRootPolicy }
    this.operations = Array.of(
        {
          id: 'edit',
          name: '编辑模式',
          type: 2,
          run() {
            this.editor.rootEditPart.$emit('vueHandler', vue => vue.state.turnToEdit())
          }
        },
        {
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


    addDataAndLine(this, json.data)
  }
}

export default function getEditorConfig (mode, target, json) {
  switch (mode) {
    case 0:
      return new EditorConfig(target, json)
    case 1:
      return new DebugEditorConfig(target, json)
    default:
      return null
  }
}