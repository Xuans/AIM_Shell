
class GridTool {
  constructor (width = 1, height = 1) {
    this.width = width
    this.height = height
    this.halfWidth = width / 2
    this.halfHeight = height / 2
  }

  computeX (x) {
    return ~~(x / this.width) * this.width
  }

  computeY (y) {
    return ~~(y / this.height) * this.height
  }

  trimWidth (width) {
    const i = width % this.width
    return width - i + (i <= this.halfWidth ? 0 : this.width)
  }

  trimHeight (height) {
    const i = height % this.height
    return height - i + (i <= this.halfHeight ? 0 : this.height)
  }
}

const Grid = new GridTool(10, 10)




class ScaleValue {
  constructor (val) {
    this.value = val
    this.conut = 0
    this.mid = 0
  }

  add (isMid = false) {
    this.conut++
    if (isMid) this.mid++

    return this
  }

  delete (isMid = false) {
    this.conut--
    if (isMid) this.mid--

    return this
  }

  get hasMid () {
    return this.mid > 0
  }

  get hasNotMid () {
    return this.conut > this.mid
  }

  get isEmpty () {
    return this.conut <= 0
  }

  static handleOfAdd (base, offset, map) {
    ScaleValue.push(base, map).add()
    ScaleValue.push(base + offset, map).add()
    ScaleValue.push(base + offset / 2, map).add(true)
  }

  static handleOfDelete (base, offset, map) {
    const start = ScaleValue.push(base, map)
    const end = ScaleValue.push(base + offset, map)
    const mid = ScaleValue.push(base + offset / 2, map)

    if (start.delete().isEmpty) map.delete(start.value)
    if (end.delete().isEmpty) map.delete(end.value)
    if (mid.delete(true).isEmpty) map.delete(mid.value)
  }

  static push (val, map) {
    let scaleValue = map.get(val)

    if (scaleValue == null) {
      scaleValue = new ScaleValue(val)
      map.set(val, scaleValue)
    }

    return scaleValue
  }

  static find (base, offset, map) {
    let val = base + offset / 2
    if (ScaleValue._findMid(val, map)) return val
    val = base
    if (ScaleValue._findNotMid(val, map)) return val
    val = val + offset
    if (ScaleValue._findNotMid(val, map)) return val

    return NaN
  }

  static _findMid (val, map) {
    return map.has(val) && map.get(val).hasMid
  }

  static _findNotMid (val, map) {
    return map.has(val) && map.get(val).hasNotMid
  }
}

const Listener = $AG.Listener.EditPartListener.extend({
  partActivated (editPart) {
    const xMap = new Map()
    const yMap = new Map()
    this.boundsChange = function (key, oldValue, newValue) {
      ScaleValue.handleOfDelete(oldValue[0], oldValue[2], xMap)
      ScaleValue.handleOfDelete(oldValue[1], oldValue[3], yMap)
      ScaleValue.handleOfAdd(newValue[0], newValue[2], xMap)
      ScaleValue.handleOfAdd(newValue[1], newValue[3], yMap)
    }
    this.xMap = xMap
    this.yMap = yMap

    if (editPart.children != null) {
      editPart.children.forEach(child => this.childAdded(child))
    }
  },
  partDeactivated () {
    this.xMap.clear()
    this.yMap.clear()
  },
  childAdded (child) {
    if (child instanceof $AG.EditPart.NodeEditPart) {
      this.on(child.model)
    }
  },
  removingChild (child) {
    if (child instanceof $AG.EditPart.NodeEditPart) {
      this.off(child.model)
    }
  },
  on (model) {
    const bounds = model.get('bounds')
    ScaleValue.handleOfAdd(bounds[0], bounds[2], this.xMap)
    ScaleValue.handleOfAdd(bounds[1], bounds[3], this.yMap)
    model.addPropertyListener(this.boundsChange, 'bounds')
  },
  off (model) {
    const bounds = model.get('bounds')
    ScaleValue.handleOfDelete(bounds[0], bounds[2], this.xMap)
    ScaleValue.handleOfDelete(bounds[1], bounds[3], this.yMap)
    model.removePropertyListener(this.boundsChange, 'bounds')
  }
})

const guided = {
  activate () {
    this.base()
    this.CoordinateListener = new Listener()
    this.getHost().addEditPartListener(this.CoordinateListener)
    this.xGuide = new GuidedLine()
    this.yGuide = new GuidedLine()
    this.addFeedback(this.xGuide)
    this.addFeedback(this.yGuide)
  },
  deactivate () {
    this.base()
    this.getHost().removeEditPartListener(this.CoordinateListener)
    this.removeFeedback(this.xGuide)
    this.removeFeedback(this.yGuide)
  },
  refreshFeedback (feedback, request, offsetX = 0, offsetY = 0) {
    this.base(feedback, request, offsetX, offsetY)
    if (!(this.editParts instanceof Array) && feedback != null) {
      const bounds = feedback.getBounds()
      const x = ScaleValue.find(bounds.x, bounds.width, this.CoordinateListener.xMap)
      const y = ScaleValue.find(bounds.y, bounds.height, this.CoordinateListener.yMap)

      if (!isNaN(x)) {
        this.xGuide.setLocation({x: x, y: -1000}, {x: x, y: 2000})
        this.xGuide.setVisible(true)
      } else {
        this.xGuide.setVisible(false)
      }

      if (!isNaN(y)) {
        this.yGuide.setLocation({x: -1000, y: y}, {x: 2000, y: y})
        this.yGuide.setVisible(true)
      } else {
        this.yGuide.setVisible(false)
      }
    }
  },
  eraseLayoutTargetFeedback (request) {
    this.base(request)
    this.xGuide.setVisible(false)
    this.yGuide.setVisible(false)
  }
}

const GuidedLine = $AG.Control.extend({
  tagName: 'path',
  init () {
    this.setAttribute({
      'fill': 'none'
    })
    this.setStyle({
      'stroke': 'blue',
      'stroke-width': 1
    })
    this.setOpacity(0.5)
    this.setVisible(false)
    this.disableEvent()
  },
  setLocation (start, end) {
    this.setAttribute('d', `M ${start.x} ${start.y} L ${end.x} ${end.y}`)
  }
})


const layout = {
  refreshFeedback (feedback, request, offsetX = 0, offsetY = 0) {
    if (feedback != null) {
      const origin = feedback.getBounds()
      const bounds = {
        x: Grid.computeX(offsetX + request.event.x),
        y: Grid.computeY(offsetY + request.event.y),
        width: Grid.trimWidth(origin.width),
        height: Grid.trimHeight(origin.height)
      }
      feedback.setBounds(bounds)
    }
  },
  /* 为了移动准确 */
  movecmd (target, request, offx, offy) {
    const feedback = this.getFeedback(target)
    if (feedback != null) {
      const origin = target.getFigure().getBounds()
      const dest = feedback.getBounds()
      return new $AG.Command.RelocalCommand(target, {
        x: origin.x,
        y: origin.y
      }, {
        x: dest.x,
        y: dest.y
      })
    }
  }
}

export default $AG.Policy.LayoutPolicy.extend(layout).extend(guided)

export function refresh () {
  if (this.model != null && this.figure != null) {
    let bounds = this.model.get('bounds')
    let gridBounds = [
      Grid.computeX(bounds[0]),
      Grid.computeY(bounds[1]),
      Grid.trimWidth(bounds[2]),
      Grid.trimHeight(bounds[3])
    ]

    for (let [index, val] of bounds.entries()) {
      if (val !== gridBounds[index]) {
        this.model.set('bounds', gridBounds)
        break
      }
    }

    this.figure.setBounds({
      x: gridBounds[0],
      y: gridBounds[1],
      width: gridBounds[2],
      height: gridBounds[3]
    })

    this.figure.style.fill = this.model.get('color') || 'grey'
  }
  this.figure.paint()
}