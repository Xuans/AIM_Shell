export function checkType (item) {
  return item.tree_node_type === '2'
}

export function createData ({id}, data = {}) {
  return {
    id: id,
    type: 'node',
    color: 'red',
    bounds: data.bounds,
    Terminals: {
      Terminal: [
        {id: '1', dir: 's', offset: 30},
        {id: '0', dir: 's', offset: -30},
        {id: 'n', dir: 'n', offset: 0}
      ]
    },
    data: data
  }
}

export function createLine ({sourceId, targetId, exit, entr}) {
  return {
    id: `${sourceId}.${exit} -> ${targetId}.${entr}`,
    source: sourceId,
    type: 0,
    target: targetId,
    exit,
    entr
  }
}

const Tool = $AG.Tool.CreationTool.extend({
  constructor (item) {
    const data = createData({id: item.tree_p_node_name})
    const model = $AG.Node.create(data)

    this.base(model)
  }
})

export default function handleOfCreate (item, editor) {
  if (editor != null) {
    editor.setActiveTool(checkType(item) ? new Tool(item) : editor.getDefaultTool())
  }
}
