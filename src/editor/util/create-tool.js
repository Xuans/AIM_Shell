export function checkType(item) {
  debugger;
  return item.tree_node_type === '2'
}

function checkType$0(item) {
  debugger;
  return item.type === '1'
}

function findDesc(sorted, start) {
  let expect

  start = Number(start)
  while ((expect = start + 1) <= sorted.length && expect === Number(sorted[start++]));

  return expect.toString()
}

function descId(arr) {
  for (let [index, id] of arr.entries()) {
    if (id === index + 1) continue
    return index + 1
  }
  return arr.length + 1
}

function createID(editor) {
  let arr = Object.keys(editor.rootModel.children)
    .map((item) => parseInt(item))
    .sort((pre, next) => pre - next)
  return descId(arr) + ''
}

export function createData({ id }, data = {}) {
  return {
    id: id,
    type: 'node',
    bounds: data.bounds || [50, 50, 180, 40],
    Terminals: {
      Terminal: [
        { id: '1', dir: 's', offset: 30, max: 1, linkmyself: false, type: 'out' },
        { id: '0', dir: 's', offset: -30, max: 1, linkmyself: false, type: 'out' },
        { id: 'n', dir: 'n', offset: 0, max: 1, linkmyself: false, type: 'in' }
      ]
    },
    data: data
  }
}

export function createLine({ sourceId, targetId, exit, entr }) {
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
  constructor(item) {
    this.item = item
  },
  activate() {
    const item = this.item

    let id = createID(this.editor)
    const data = createData({ id }, { id: id, name: item.tree_node_desc, tree_info: {...item} ,params:{},})

    this.model = $AG.Node.create(data)
    this.base()
  }
})

const Tool$0 = $AG.Tool.CreationTool.extend({
  constructor(item) {
    this.item = item
    //考虑缓存、懒加载、loading
    console.log('创建服务节点:',item);
    // const item = this.item
    Vue.$buildTarget(item).then(data => {
      const nodes = Object.values(data)

      console.log('数据读取成功',data);

      let left, right, top, bottom

      left = top = Number.MAX_VALUE
      right = bottom = Number.MIN_VALUE

      let offset = Array.of()

      this.models = nodes.map(node => {
        let data = createData(node, node)
        let model = $AG.Node.create(data)
        let bounds = model.get('bounds')

        offset.push(bounds)

        left = Math.min(bounds[0], left)
        top = Math.min(bounds[1], top)

        right = Math.max(bounds[0] + bounds[2], right)
        bottom = Math.max(bounds[1] + bounds[3], bottom)

        return model
      })

      let centerX = (right + left) >>> 1
      let centerY = (top + bottom) >>> 1

      for (let i = 0; i < offset.length; i++) {
        let bounds = offset[i]

        offset[i] = {
          x: bounds[0] - centerX,
          y: bounds[1] - centerY
        }
      }

      this.offset = offset
    })
  },

  show(policy, req) {
    for (let index of this.models.keys()) {
      this.index = index

      req.event.offsetX = this.offset[index].x
      req.event.offsetY = this.offset[index].y

      policy.showTargetFeedback(req)
    }
  },

  erase(policy, req) {
    for (let index of this.models.keys()) {
      this.index = index
      policy.eraseTargetFeedback(req)
    }
  },

  createLineCommand(soruceID, targetID, exit) {
    return new $AG.CreateLineCommand(
      this.editor.rootEditPart,
      $AG.Line.create(createLine({ sourceId: soruceID, targetId: targetID, exit: exit, entr: 'n' })),
      soruceID,
      targetID
    )
  },

  command(policy, req) {
    let command, newID, oldID
    let oldEvent = req.event
    let sortedIdList = this.editor.store.node().order("id logicaladesc").select('id')
    let idMap = new Map()

    newID = '0'

    for (let index of this.models.keys()) {
      let model = this.models[index]

      newID = findDesc(sortedIdList, newID)
      oldID = model.get('id')

      idMap.set(oldID, newID)
      model.set('id', newID)
      model.set('data.id', newID)

      req.event = {
        prop: {
          drag: {
            model: this.models[index]
          }
        },
        x: oldEvent.x + this.offset[index].x,
        y: oldEvent.y + this.offset[index].y
      }
      let cmd = policy.getCommand(req)

      command = command ? command.chain(cmd) : cmd
    }

    this.models.forEach(model => {
      let target = model.get('data.target')
      if (target) {
        for (let [terminalId, targetId] of Object.entries(target)) {
          command = command.chain(this.createLineCommand(model.get('id'), idMap.get(targetId), terminalId))
        }
      }
    })

    req.event = oldEvent

    return command
  },

  getEditPart(parent) {
    if (!this.editParts) {
      this.editParts = Array.of()
    }

    if (!this.editParts[this.index]) {
      this.editParts[this.index] = parent.createChild(this.models[this.index])
    }

    return this.editParts[this.index]
  },

  mouseDrag(e, p) {
    let policy = this.getLayoutPolicy(e, p);
    if (this.policy == null) {
      this.policy = policy;
    }
    if (policy == null) return false;
    let req = {
      editPart: p,
      target: this,
      event: e,
      type: 'create child'
    }
    if (this.policy != policy) {
      this.erase(policy, req)
      this.policy = policy;
    }

    this.show(policy, req)

    return true;
  },
  dragEnd(me, editPart) {
    if (editPart == null) return false;
    var policy = this.getLayoutPolicy(me, editPart);
    if (policy == null) return false;
    var req = {
      editPart: editPart,
      target: this,
      event: me,
      type: 'create child'
    };
    this.erase(policy, req)

    if (me.button === 0) { // 右键取消
      let cmd = this.command(policy, req)
      if (cmd != null && cmd.canExecute()) {
        editPart.getRoot().editor.execute(cmd);
      } else {
        return this.dragEnd(me, editPart.parent)
      }
    }
    return true;
  }
})

export default function handleOfCreate(item, editor) {
  if (editor != null) {
    let tool = editor.getDefaultTool()

    if (checkType(item)) {
      tool = new Tool(item)
    } else if (checkType$0(item)) {
      tool = new Tool$0(item)
    }

    editor.setActiveTool(tool)
  }
}
