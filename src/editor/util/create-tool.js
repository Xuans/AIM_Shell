import $ from 'jquery'

// 这里认为一个编辑器实例只会缓存一种类型的节点数据
const Cache = new WeakMap()

export function checkType (item) {
  return item.tree_node_type === '2'
}
let id = 2
const Tool = $AG.Tool.CreationTool.extend({
  constructor (item) {
    this.base($AG.Node.create({
      id: id++,
      type: 'fakeNode',
      color: 'red',
      bounds: [50, 50, 150, 50],
      Terminals: {
        Terminal: [
          {id: 'success', dir: 's', offset: 10},
          {id: 'failure', dir: 's', offset: -10},
          {id: 'n', dir: 'n', offset: 0}
        ]
      },
      data: {
        "id":"1",
        "name":"编译交易脚本",
        "scriptId":"caf41eaf",
        "ip":"192.168.1.2",
        "port":"22",
        "params":{
        },
        "target":{
          "0":"2",
          "1":"4"
        }
      }
    }))
  }
})

export default function handleOfCreate (item, editor) {
  if (editor != null) {
    editor.setActiveTool(checkType(item) ? new Tool(item) : editor.getDefaultTool())
  }
}
