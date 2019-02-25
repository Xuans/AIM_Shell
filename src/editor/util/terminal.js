const Terminal = 'Terminal'
const Terminals = 'Terminals'


const LinkTool = $AG.LinkLineTool.extend({
  constructor (callback) {
    this.base($AG.Line.create({type: 0}))
    this.callback = callback
  },
  mouseUp(e, p) {
    let val = this.base(e, p)
    this.callback()

    return val
  }
})

const colorMap = {
    '-1': 'black',
    '0': 'red',
    '1': 'green',
    '2': 'yellow',
    '4': 'greenyellow',
    '5': 'orange',
    '6': 'blue',
    '7': 'purple',
    '8': 'deeppink'
}

const defaultColor = 'grey'

const PinHandle = $AG.Handle.extend($AG.CIRCLE).extend({
  // replacedByHostOnEvnet: true,
  constructor (editPart, data) {
    $AG.Handle.prototype.constructor.call(this, editPart)
    this.anchorId = getID(data)
    this.desp = getDesp(data)
    this.toolListenter = (tool) => {
      this.evetHost = (tool != null && tool.id === 'link tool')
          ? editPart
          : this
      /*this.replacedByHostOnEvnet = (tool != null && tool.id === 'link tool')
          ? true
          : false*/
    }
    editPart.editor.listenerSupport.add('tool-changed', this.toolListenter)
  },
  dispose () {
    this.editPart.editor.listenerSupport.remove('tool-changed', this.toolListenter)
    this.base()
  },
  initProp () {
    let anchor = this.editPart.getSourceAnchorByTerminal(this.anchorId)

    if (anchor) {
      this.setOpacity(1)

      const color = getColor(this.anchorId)
      this.setAttribute({
        'stroke': color,
        'stroke-width': 2,
        'fill': color,
        'fill-opacity': 0.6,
        'cursor': 'move'
      })
      // this.setStyle({'cursor': 'move'})

      this.setBounds({
        x: anchor.x,
        y: anchor.y,
        width: 10
      }, true)
      this.addToolTip(this.desp)
      this.enable = true
    }
  },
  refreshLocation (figure) {
    var anchor = figure.getSourceAnchorByTerminal(this.anchorId)
    this.setBounds({
      x: anchor.x,
      y: anchor.y,
      width: 10
    })
  },
  mouseDown (e) {
    let policy = this.editPart.getConnectionPolicy()
    let anchor = this.editPart.figure.anchorMap.get(this.anchorId)

    // validator 默认安装ValidatorConnection
    if (policy.validatorAnchor(anchor, {type: 'connection start'})) {
      let editor = this.editPart.editor
      let oldTool = editor.getActiveTool()
      let tool = new LinkTool(() => editor.setActiveTool(oldTool))

      editor.setActiveTool(tool)
      tool.mouseMove(e, this.editPart)
      tool.mouseDown(e, this.editPart)
    }
  }
})

function getTerminals (terminls) {
  return terminls[Terminal]
}

function getID (data) {
  return data.id
}

function getDesp (data) {
  return 'about : blank'
}

class AboutTerminal {
  static pool = new WeakMap();

  static memoPool = new WeakMap();

  static register (editPart, addHandle) {
    return this.pool.get(editPart.model) || new AboutTerminal(editPart, addHandle)
  }

  constructor (editPart, addHandle) {
    this.editPart = editPart
    this.handles = new Map()
    this.isListen = false
    this.memo = null
    this.toMemo = null
    this.add = addHandle
    AboutTerminal.pool.set(editPart.model, this)
  }

  _createPinHandle (data, index, length) {
    this._adjustPinHandle(data, index, length)

    let pin = new PinHandle(this.editPart, data)

    if (AboutTerminal.memoPool.has(this.toMemo)) {
      AboutTerminal.memoPool.get(this.toMemo).undo()
      this.toMemo = null
    }

    const id = getID(data)

    this.handles.set(id, pin)
    this.editPart.getRoot().getLayer('Handle_Layer').addChild(pin)
  }

  _destroyPinHandle (name) {
    let chainCmd = new $AG.ChainedCompoundCommand()

    this._findSourceLinesAtTerminal(name)
        .forEach(line =>
            chainCmd.chain(new $AG.DeleteLineCommand(this.editPart.getRoot(), this.editPart.findLineEditPart(line)))
        )

    this._findTargetLinesAtTerminal(name)
        .forEach(line =>
            chainCmd.chain(new $AG.DeleteLineCommand(this.editPart.getRoot(), this.editPart.findLineEditPart(line)))
        )
    chainCmd.execute()

    this.editPart.figure.unregistAnchor(name)
    this.editPart.getRoot().getLayer('Handle_Layer').removeChild(this.handles.get(name))
    this.handles.delete(name)

    this.memo = {}
    AboutTerminal.memoPool.set(this.memo, chainCmd)
  }

  _adjustPinHandle (data, index, length) {
    const bounds = this.editPart.model.get('bounds')
    this.editPart.figure.registAnchor(this.add(data, bounds, index, length))

    const id = getID(data)
    this._findTargetLinesAtTerminal(id)
        .forEach(line => {
          let lineEditPart = this.editPart.findLineEditPart(line)
          lineEditPart.refreshTargetAnchor()
          lineEditPart.refreshVisual()
          lineEditPart.refreshChildren()
        })

    this._findSourceLinesAtTerminal(id)
        .forEach(line => {
          let lineEditPart = this.editPart.findLineEditPart(line)
          lineEditPart.refreshSourceAnchor()
          lineEditPart.refreshVisual()
          lineEditPart.refreshChildren()
        })

    if (this.handles.has(id)) {
      this.handles.get(id).refreshLocation(this.editPart.figure)
    }
  }

  _findSourceLinesAtTerminal (id) {
    let sourceLines = this.editPart.getModelSourceLines()

    return sourceLines.filter(line => line.get('exit') === id)
  }

  _findTargetLinesAtTerminal (id) {
    let targetLines = this.editPart.getModelTargetLines()

    return targetLines.filter(line => line.get('entr') === id)
  }

  handle (key, oldValue, newValue) {
    let terminals = getTerminals(newValue)
    let destroies = new Set(this.handles.keys())
    let length = terminals.length

    terminals.forEach((data, index) => {
      const id = getID(data)
      if (this.handles.has(id)) {
        destroies.delete(id)

        this._adjustPinHandle(data, index, length)
      } else {
        this._createPinHandle(data, index, length)
      }
    })

    destroies.forEach(name => this._destroyPinHandle(name))

    return this
  }

  listen (flag) {
    if (flag ^ this.isListen) {
      flag
          ? this.editPart.model.addPropertyListener(this.listener = (...res) => this.handle(...res) || this.listener, Terminals)
          : this.editPart.model.removePropertyListener(this.listener, Terminals)
      this.isListen = flag
    }
    return this
  }

  dispose () {
    AboutTerminal.pool.delete(this.editPart.model);
    [...this.handles.entries()]
        .forEach(([index, handle]) => this.editPart.getRoot().getLayer('Handle_Layer').removeChild(handle))
    AboutTerminal.pool.delete(this.editPart.model)
    this.editPart = null
    this.handles.clear()
    this.handle = null
  }

  static cancel (editPart) {
    if (AboutTerminal.pool.has(editPart.model)) {
      AboutTerminal.pool.get(editPart.model).listen(false).dispose()
    }
  }

  static getMemo (model) {
    return AboutTerminal.pool.has(model) ? AboutTerminal.pool.get(model).memo : null
  }

  static setMemo (model, memo) {
    if (AboutTerminal.pool.has(model)) {
      AboutTerminal.pool.get(model).toMemo = memo
    }
  }
}

export const terminalCmd = {
  afterExecute () {
    this.memo = AboutTerminal.getMemo(this.model)
  },
  beforeUndo () {
    AboutTerminal.setMemo(this.model, this.memo)
  }
}

export function terminalPolicy ({isListen = false, addAnchor} = {}) {
  return {
    activate () {
      AboutTerminal
          .register(this.getHost(), addAnchor)
          .handle(Terminals, null, this.getHost().model.get(Terminals))
          .listen(isListen)
    },
    deactivate () {
      AboutTerminal.cancel(this.getHost())
    }
  }
}

export function getColor (id) {
  return colorMap[id] != null ? colorMap[id] : defaultColor
}