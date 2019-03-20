import {
  createData,
  createLine
} from './create-tool'
import {
  editNode,
  noeditNode,
  versionNode
} from '../figure/node'
import line, {
  lineOfUnselectable
} from '../figure/line'
import types from '../figure/types'
import {
  ReaderListener
} from '../util/manhattan-router'
import {
  dblfPolicy
} from '../util/bind-event'
import layoutPolicy from '../util/layout-policy'
import {
  debugRootPolicy
} from './debug-policy'

function addDataAndLine(config, dataOfService) {
  let data = []
  let line = []
  if (dataOfService)
    for (let [id, dataOfModel] of Object.entries(dataOfService)) {
      data.push(createData({
        id
      }, dataOfModel))

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

function addServiceParas(config, p) {
  if(p=='')
    p={}
  if (p.constructor != Object)
    p = JSON.parse(p);
  config.service_args = p;
}

export class EditorConfig {
  constructor(target) {

    this.id = `flow-${target.id}-${target.sv_id}`
    this.children = {
      node: editNode()
    }
    this.lines = {
      '0': line
    }
    this.background="#F1F2F2";
    this.types = types
    this.layoutable = layoutPolicy
    this.onHooks = Array.of(ReaderListener)
    this.policies = {
      dblfPolicy
    }

    this.operations = Array.of({
      id: 'save',
      name: '保存',
      type: 2,
      check() {
        return this.editor.isDirty()
      },
      run() {
        this.editor.save()
      }
    }, {
      id: 'zoomIn',
      name: '放大',
      type: 2,
      run() {
        /* TODO */
        let layer = this.editor.rootEditPart.getFeedbackLayer()
        let scaleX = Math.min(layer.scaleX + 0.2, 3)
        let scaleY = Math.min(layer.scaleY + 0.2, 3)

        this.editor.rootEditPart.scale(scaleX, scaleY)
      }
    }, {
      id: 'zoomOut',
      name: '缩小',
      type: 2,
      run() {
        /* TODO */
        let layer = this.editor.rootEditPart.getFeedbackLayer()
        let scaleX = Math.max(layer.scaleX - 0.2, 0.2)
        let scaleY = Math.max(layer.scaleY - 0.2, 0.2)

        this.editor.rootEditPart.scale(scaleX, scaleY)
      }
    }, {
      id: 'selectAll',
      name: '全选',
      type: 2,
      key: 'ctrl+a',
      run() {
        this.editor.rootEditPart.setSelection(this.editor.rootEditPart.children)
      }
    }, {
      id: 'delete',
      name: '删除',
      type: 0,
      key: 'delete',
      check() {
        return this.selection instanceof $AG.NodeEditPart ||
          this.selection instanceof $AG.LineEditPart ||
          (this.selection instanceof Array && this.selection.length > 0)
      },
      run() {
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
    }, {
      id: 'undo',
      name: '撤销',
      type: 1,
      key: 'ctrl+z',
      check() {
        return this.stack.canUndo()
      },
      run() {
        this.stack.undo()
      }
    }, {
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
    })

    addDataAndLine(this, target.service_content.data)
    addServiceParas(this, target.service_args)
  }
}

export class DebugEditorConfig {
  constructor(target) {
    this.id = `debug-${target.id}-${target.sv_id}`
    this.children = {
      node: noeditNode()
    }
    this.lines = {
      '0': lineOfUnselectable
    }
    this.background ='RGB(103,190,173)'
    this.types = types
    this.onHooks = Array.of(ReaderListener)
    this.policies = {
      dblfPolicy,
      debugRootPolicy
    }

    const t=target;
    this.operations = Array.of({
      id: 'debug-stop',
      name: '关闭Log',
      type: 2,
      key: 'f11',
      check() {
        return true
      },
      run() {
        this.editor.rootEditPart.$emit('debug-stop')
      }
    },
    {
      id: 'debug-start',
      name: '查看Log',
      type: 2,
      key: 'f11',
      check() {
        return true
      },
      run() {
        this.editor.rootEditPart.$emit('debug-start',t.logs,1000)
      }
    }
    )

    addDataAndLine(this, target.service_content.data)
    addServiceParas(this, target.service_args)
  }
}

export class VersionsEditorConfig {
  constructor(target) {
    this.id = `version-${target.id}-${target.sv_id}`
    this.background = 'lightgrey'
    this.children = {
      node: versionNode()
    }
    this.lines = {
      '0': lineOfUnselectable
    }
    this.types = types
    this.onHooks = Array.of(ReaderListener)
    this.policies = {
      dblfPolicy,
      debugRootPolicy
    }
    this.operations = Array.of({
      id: 'debugger',
      name: '关闭Log',
      type: 2,
      key: 'f11',
      check() {
        return true
      },
      run() {
        this.editor.rootEditPart.$emit('debug-stop')
      }
    })

    if(target.service_content&&target.service_content.constructor == String){
      target.service_content=JSON.parse(target.service_content)
    }
    if(target.service_args&&target.service_args.constructor == String){
      target.service_args=JSON.parse(target.service_args)
    }
    addDataAndLine(this, target.service_content.data)
    addServiceParas(this, target.service_args)
  }
}

export default function getEditorConfig(target) {
  return target.lastest ? new EditorConfig(target) : new DebugEditorConfig(target)
}