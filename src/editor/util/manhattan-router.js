/**
 * tips:
 * 1. No angle compution, the default is perpendicular
 * 2. Unable to guarantee accurate loss due to decimal point
 */


const defaults = {
  padding: 10,
  obstacleSize: 100,
  obstacleCost: 200,
  maximumLoops: 2000,
  algorithm: searchInDouble, // search
  dynamicTargetCount: 2, // use in double
  includeClasses: [$AG.EditPart.NodeEditPart],
  penalties (angle, gird) {
    return angle > 0 ? 40 * gird.size : 0
  },
  allowAngle (angle) {
    return angle === 0 || angle === 90
  },
  failureRoute () {
    return [this.getStartPoint(), this.getEndPoint()]
  },
  directionMap: {
    'left': { x: -1, y: 0, intersections: intersections },
    'top': { x: 0, y: -1, intersections: intersections },
    'bottom': { x: 0, y: 1, intersections: intersections },
    'right': { x: 1, y: 0, intersections: intersections }
  },
  directionList (point, bbox) {
    let right = getRight(bbox)
    let bottom = getBottom(bbox)
    let directions = ['left']
    let directionMap = Array.of('top', 'bottom', 'right')

    Array.of(bbox.y - point.y, point.y - bottom, point.x - right)
        .reduce((min, val, index) => {
          val = Math.abs(val)
          if (val < min) {
            directions = [directionMap[index]]
            return val
          }

          if (val === min) {
            directions.push(directionMap[index])
          }

          return min
        }, Math.abs(bbox.x - point.x))

    return directions
  },
  directions ({padding, angle}, {x, y}) {
    return [
      {x: x, y: 0},
      {x: 0, y: y},
      {x: -x, y: 0},
      {x: 0, y: -y}
    ].map(direction => {
      direction.angle = angle(direction)
      direction.cost = padding
      return direction
    })
  },
  angle ({x, y}) {
    if (x === 0) {
      if (y > 0) return 90
      if (y < 0) return 270
      debugger
    }

    if (y === 0) {
      if (x > 0) return 0
      if (x < 0) return 180
      debugger
    }
    return 45
  }
}

const Util = $AG.Util

/* Helper Classes */

// 与每个editPart相对应, ObstacleMap helper class
// 1.用于记录图形位置栈 2.与其对应的监听bounds的function
function ObstacleItem () {
  let addition = []
  let removing = []

  this.handler = function (key, oldValue, newValue) {
    let removeBounds = getBounds(oldValue)
    let addBounds = getBounds(newValue)

    let last = Util.last(addition)
    if (last != null) { // 上一次位置和此次的删除位置可能是一样的
      let isEquals = ['x', 'y', 'width', 'height'].reduce((flag, key) => {
        return flag && (removeBounds[key] === last[key])
      }, true)

      if (isEquals) {
        return Object.assign(last, addBounds)
      }
    }

    addition.push(addBounds)
    removing.push(removeBounds)
  }

  this.addition = addition
  this.removing = removing
}

class ObstacleMap {

  // key: svg node
  // value: ObstacleMap instance
  static POOL = new WeakMap()

  static find (line) {
    try {
      return this.POOL.get(line.svg)
    } catch (e) {
    }
    return false
  }

  constructor (editPart, opt) {
    // To find instance, in public function
    let canvas = editPart.editor.canvas
    ObstacleMap.POOL.set(canvas, this)

    this.cache = new Map() // bounds changed stack
    this.map = {}          // cell map
    this.option = opt      // router option
  }

  // what figures are recorded in one cell
  _addObstacle (bounds, editPart) {
    let map = this.map
    let key
    this._traverseObstacle(bounds, (x, y) => {
      key = getKey(x, y)
      map[key] = map[key] || []
      map[key].push(editPart.figure)
    })
  }

  _removeObstacle (bounds, editPart) {
    let map = this.map
    let key, index
    this._traverseObstacle(bounds, (x, y) => {
      key = getKey(x, y)
      if (map[key] != null) {
        index = map[key].indexOf(editPart.figure)
        if (index > -1) {
          map[key].splice(index, 1)
        }
      }
    })
  }

  _traverseObstacle (bounds, fn) {
    let bbox = expandByPadding(bounds, this.option)
    let size = this.option.obstacleSize

    let left = snap(getLeft(bbox), size, Math.floor)
    let right = snap(getRight(bbox), size, Math.ceil)
    let top = snap(getTop(bbox), size, Math.floor)
    let bottom = snap(getBottom(bbox), size, Math.ceil)

    // [left, right] [top, bottom]
    // 是因为尽可能包裹范围，就算只有一条线
    for (let x = left; x <= right; x += size) {
      for (let y = top; y <= bottom; y += size) {
        fn(x, y)
      }
    }
  }

  build () {
    for (let [editPart, {addition, removing}] of this.cache) {
      addition.forEach(bounds => this._addObstacle(bounds, editPart))
      removing.forEach(bounds => this._removeObstacle(bounds, editPart))
      addition.length = 0
      removing.length = 0
    }
  }

  push (editPart) {
    let cache = this.cache
    let item = cache.get(editPart)

    if (item == null) {
      item = new ObstacleItem()
      cache.set(editPart, item)
      this._addObstacle(getBounds(editPart), editPart)
    }

    return item
  }

  pop (editPart) {
    let cache = this.cache
    let item = cache.get(editPart)

    if (item != null) {
      let remove = item.removing.length > 0 ? item.removing[0] : getBounds(editPart)
      this._removeObstacle(remove, editPart)
      cache.delete(editPart)
    }

    return item
  }

  isObstacle (point) {
    let key = point.clone().align({x: this.option.obstacleSize, y: this.option.obstacleSize}).key
    let idList = this.map[key]

    if (idList == null || idList.length === 0) {
      return false
    }

    // 遍历此细胞的所有图像
    return idList.some(figure => $AG.Rectangle.containsWithBorder(figure.bounds, point.x, point.y))
  }

  clear () {
    let remaining = this.cache.keys()
    for (let editPart of remaining) {
      this.pop(editPart)
    }
  }
}

class Point {
  static center ({x, y, width, height}) {
    return new Point(x + width / 2, y + height / 2)
  }

  /**
   * @param x (Object|String|Number)
   * @param y (Number)
   */
  constructor (x, y) {
    if (typeof x === 'object') {
      this.x = x.x
      this.y = x.y
    } else if (typeof x === 'string') {
      let spilt = x.split('_')

      this.x = parseFloat(spilt[0])
      this.y = parseFloat(spilt[1])
    } else {
      this.x = x
      this.y = y
    }
  }

  different ({x, y}) { // in perpendicular case
    let dx = this.x - x
    let dy = this.y - y

    return new Point(dx, dy)
  }

  normalize () {
    this.x = normalize(this.x)
    this.y = normalize(this.y)

    return this
  }

  sqrtDistance (p, isSqrt = true) {
    let val = Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2)

    return isSqrt ? Math.sqrt(val) : val
  }

  manhattanDistanceIgnoreCorner (p) {
    return Math.abs(this.x - p.x) + Math.abs(this.y - p.y)
  }

  // if it has corner, cause penalties
  manhattanDistanceWithPenalties (p, opt) {
    let dx = Math.abs(this.x - p.x)
    let dy = Math.abs(this.y - p.y)
    return dx & dy ? dx + dy + opt.padding : dx + dy
  }

  toOthersMinDstance (points, fn) {
    return points.reduce((val, point) => Math.min(fn.call(this, point), val), Infinity)
  }

  align ({x, y}) {
    this.x = round(this.x, x)
    this.y = round(this.y, y)

    return this
  }

  offset (dx, dy) {
    if (typeof dx === 'object') {
      dy = dx.y
      dx = dx.x
    }
    this.x += dx || 0
    this.y += dy || 0

    return this
  }

  clone () {
    return new Point(this.x, this.y)
  }

  equal ({x, y}) {
    return x === this.x && y === this.y
  }

  get key () {
    return getKey(this.x, this.y)
  }
}

class SortedSet {
  static OPEN = 1
  static CLOSE = 2

  constructor () {
    this.items = []
    this.hash = {}
    this.values = {}
  }

  add (item, value) {
    if (this.hash[item]) {
      // item removal
      Util.removeObject(this.items, item)
    } else {
      this.hash[item] = SortedSet.OPEN
    }

    this.values[item] = value

    // sort
    Util.insert(this.items, item, Util.indexOfSorted(this.items, item, (val) => this.values[val] < value))
  }

  remove (item) {
    this.hash[item] = SortedSet.CLOSE
  }

  isOpen (item) {
    return this.hash[item] === SortedSet.OPEN
  }

  isClose (item) {
    return this.hash[item] === SortedSet.CLOSE
  }

  pop () {
    let item = this.items.shift()
    this.remove(item)
    return item
  }

  get isEmpty () {
    return this.items.length === 0
  }
}

// if store's length > queue's length, shift first
class Queue {
  constructor (length) {
    this.length = length
    this.store = []
  }

  push (item) {
    this.store.push(item)
    if (this.store.length > this.length) {
      this.store.shift()
    }
  }

  findMin (fn) {
    return Reflect.apply(Math.min, Math, this.store.map(item => fn(item)))
  }
}

// store using varaible in search
class Search {
  constructor (source, targetList) {
    this.openSet = new SortedSet()
    this.points = {}
    this.parents = {}
    this.cost = {}
    this.source = source
    this.targetList = targetList

    this.points[source.key] = source
    this.cost[source.key] = 0
  }

  push (point, parent, cost) {
    let distance = this.computeDistance(point)
    let key = point.key

    this.openSet.add(key, distance + cost)
    this.points[key] = point
    this.parents[key] = parent
    this.cost[key] = cost
  }

  pop () {
    return this.points[this.openSet.pop()]
  }

  isEnd (point) {
    return this.endFn(point)
  }

  isEndAccessible (angle, point) {
    return this.endAccessibleFn(angle, point)
  }

  getParent (point) {
    return this.parents[point.key]
  }

  getCost (point) {
    return this.cost[point.key]
  }

  isRouted (point) {
    return this.openSet.isOpen(point.key) || this.openSet.isClose(point.key)
  }

  isClose (point) {
    return this.openSet.isClose(point.key)
  }

  isOpen (point) {
    return this.openSet.isOpen(point.key)
  }

  setEndFn (fn) {
    this.endFn = fn
  }

  setEndAccessibleFn (fn) {
    this.endAccessibleFn = fn
  }

  computeDistance (point) {
    return point.toOthersMinDstance(this.targetList, Point.prototype.manhattanDistanceIgnoreCorner)
  }

  // no start and end
  getPath (point, end) {
    let path = []
    let diff = end.different(point).normalize()

    let currentDiff, parent, current

    parent = this.parents[point.key]
    current = point
    while (parent != null) {
      currentDiff = current.different(parent).normalize()
      if (!currentDiff.equal(diff)) {
        path.unshift(current)
        diff = currentDiff
      }

      current = parent
      parent = this.parents[current.key]
    }

    currentDiff = current.different(this.source).normalize()
    if (!currentDiff.equal(diff)) {
      path.unshift(current)
    }

    return path
  }
}

/* Helper Functions */

// only use perpendicular
function intersections (start, end, bbox) {
  let result = []

  if (this.y === 0 && start.y - end.y === 0) { // horizontal
    let left = getLeft(bbox)
    if (between(left, start.x, end.x)) {
      result.push(new Point(left, start.y))
    }

    let right = getRight(bbox)
    if (between(right, start.x, end.x)) {
      result.push(new Point(right, start.y))
    }
  } else if (this.x === 0 && start.x - end.x === 0) { // not horizontal
    let top = getTop(bbox)
    if (between(top, start.y, end.y)) {
      result.push(new Point(start.x, top))
    }

    let bottom = getBottom(bbox)
    if (between(bottom, start.y, end.y)) {
      result.push(new Point(start.x, bottom))
    }
  } else {
    console.warn('intersections')
  }

  return result
}

function between (val, min, max) {
  return (val - min) * (val - max) <= 0
}

// 1 or -1 or 0
function normalize (val) {
  return val ? val / Math.abs(val) : 0
}

function cantLink ({points}) {
  return points === null || points === undefined || points.length < 2
}

function getBounds (val) {
  if (val instanceof Array) {
    return {
      x: val[0],
      y: val[1],
      width: val[2],
      height: val[3]
    }
  }

  if (val instanceof $AG.EditPart) {
    return getBounds(val.model.get('bounds'))
  }

  if (val instanceof $AG.Node) {
    return getBounds(val.get('bounds'))
  }

  return false
}

function round (val, size = 1) {
  return size * Math.round(val / size)
}

function snap (val, size, fn) {
  return size * fn(val / size)
}

function align (point, gird) {
  return point.different(gird.source).align(gird).offset(gird.source)
}

function getLeft ({x}) {
  return x
}

function getRight ({x, width}) {
  return x + width
}

function getTop ({y}) {
  return y
}

function getBottom ({y, height}) {
  return y + height
}

function getKey (x, y) {
  return `${x}_${y}`
}

function getDirectionChange (angle1, angle2) {
  let val = Math.abs(angle1 - angle2)
  return val > 180 ? 360 - val : val
}

function expandByPadding (bounds, opt) {
  let padding = opt.padding

  return {
    x: bounds.x - padding,
    y: bounds.y - padding,
    width: bounds.width + 2 * padding,
    height: bounds.height + 2 * padding
  }
}

function getGird (source, target, size) {
  let diffX = Math.abs(target.x - source.x)
  let diffY = Math.abs(target.y - source.y)
  let stepX = Math.round(diffX / size)
  let stepY = Math.round(diffY / size)

  return {
    source: source.clone(),
    x: getGridSize(diffX, size, stepX),
    y: getGridSize(diffY, size, stepY),
    sizeX: stepX,
    sizeY: stepY,
    size: Math.round(Math.max(Math.log2(Math.max(stepY, stepX)), 0))
}
}

//
function getGridSize (diff, step, steps) {
  // return step if diff = 0
  if (!diff) return step

  let absDiff = diff
  let numSteps = steps

  // return absDiff if less than one step apart
  if (!numSteps) return absDiff

  // otherwise, return corrected step
  let roundedDiff = numSteps * step
  let remainder = absDiff - roundedDiff
  let stepCorrection = remainder / numSteps

  return step + stepCorrection
}

// Make a map and return a function for checking if a key is in that map.
function makeMap (points) {
  let map = {}
  for (let point of points) {
    map[point.key] = true
  }

  return function (key) { return !!map[key] }
}

function similarity (point, bbox, gird, opt) {
  if (bbox == null) { // drag or other
    return Array.of()
  }

  let directionList = opt.directionList(point, bbox)
  let directionMap = opt.directionMap
  let center = Point.center(bbox)

  let points = directionList.reduce((list, key) => {
    let direction = directionMap[key]
    if (direction == null) return list

    let end = {
      x: point.x + direction.x * (Math.abs(point.x - center.x) + bbox.width),
      y: point.y + direction.y * (Math.abs(point.y - center.y) + bbox.height)
    }

    // find farthest intersection
    let intersections = direction.intersections(point, end, bbox)
    let farthest
    if (intersections.length > 0) {
      farthest = intersections.reduce((p1, p2) => point.sqrtDistance(p1) > point.sqrtDistance(p2) ? p1 : p2)
    }

    if (farthest != null) {
      farthest = align(farthest, gird)

      if ($AG.Rectangle.contains(bbox, farthest.x, farthest.y)) {
        // offset one padding, then align
        farthest = align(farthest.offset(direction.x * opt.padding, direction.y * opt.padding), gird)
      }
      list.push(farthest)
    }

    return list
  }, [])

  if (!$AG.Rectangle.containsWithBorder(bbox, point.x, point.y)) {
    points.push(align(point, gird))
  }

  return points
}

// find neighborPoint
function find (directions, search, current, gird, map, opt) {
  let angleFn = opt.angle
  let allowAngleFn = opt.allowAngle
  let penaltieFn = opt.penalties

  let parent = search.getParent(current)
  let currentAngle, nextAngle

  let isStart = current.equal(search.source)

  if (!isStart) {
    currentAngle = angleFn(current.different(parent || search.source).normalize())
  }

  for (let direction of directions) {
    nextAngle = getDirectionChange(currentAngle, direction.angle)
    if (!(isStart || allowAngleFn(nextAngle))) { continue }

    let neighborPoint = align(current.clone().offset(direction), gird)

    if (search.isClose(neighborPoint)) { continue }

    if (search.isEnd(neighborPoint) && !search.isEndAccessible(direction.angle, neighborPoint)) { continue }

    let cost = direction.cost + penaltieFn(nextAngle, gird) + search.getCost(current)
    if (map.isObstacle(neighborPoint)) {
      cost += opt.obstacleCost
    }

    if (!search.isOpen(neighborPoint) || cost < search.getCost(neighborPoint)) {
      search.push(neighborPoint, current, cost)
    }
  }
}

function buildUpPathInSolo (point, search, start, end) {
  let path = search.getPath(point, end)
  if (path.length === 0 || !path[0].equal(start)) {
    path.unshift(start)
  }
  if (!Util.last(path).equal(end)) {
    path.push(end)
  }
  return path
}

// route algorithm
function search (line, sourceAnchor, targetAnchor, source, target, map, opt) {
  // compute adp grid by padding
  let gird = getGird(sourceAnchor, targetAnchor, opt.padding)

  let start, startPoints
  start = sourceAnchor
  startPoints = similarity(sourceAnchor, source, gird, opt)

  let end, endPoints
  end = targetAnchor
  endPoints = similarity(targetAnchor, target, gird, opt)

  /* TODO need to align */
  if (startPoints.length & endPoints.length === 0) { // change point to point
    startPoints = Array.of(sourceAnchor)
    endPoints = Array.of(targetAnchor)
  }

  if (startPoints.length * endPoints.length > 0) {
    let searchVar = new Search(start, endPoints)

    // add to openSet
    for (let point of startPoints) {
      searchVar.push(point, null, 0)
    }

    let angleFn = opt.angle
    let endKeyMap = makeMap(endPoints) // map end key fn
    searchVar.setEndFn(point => endKeyMap(point.key))
    searchVar.setEndAccessibleFn((angle, point) => {
      if (!point.equal(end)) {
        let endAngle = angleFn(end.different(point).normalize())
        return opt.allowAngle(getDirectionChange(angle, endAngle))
      }
      return true
    })

    let directions = opt.directions(opt, gird) // actual direction data
    let loops = opt.maximumLoops

    while (!searchVar.isEmpty && loops > 0) {

      let currentPoint = searchVar.pop()
      if (searchVar.isEnd(currentPoint)) {
        return buildUpPathInSolo(currentPoint, searchVar, start, end)
      }

      find(directions, searchVar, currentPoint, gird, map, opt)

      loops--
    }
  }

  return opt.failureRoute.call(line)
}

function buildUpPathInDouble (point, positive, negative) {
  let positivePath = positive.getPath(point, negative.getParent(point) || negative.source)
  let negativePath = negative.getPath(point, positive.getParent(point) || positive.source)

  if (positivePath.length === 0 || !positivePath[0].equal(positive.source)) {
    positivePath.unshift(positive.source)
  }
  if (negativePath.length === 0 || !negativePath[0].equal(negative.source)) {
    negativePath.unshift(negative.source)
  }
  if (Util.last(positivePath).equal(Util.last(negativePath))) {
    negativePath.pop()
  }

  return positivePath.concat(negativePath.reverse())
}

/**
 * double search, search result more symmetryer than solo
 * @param line
 * @param sourceAnchor
 * @param targetAnchor
 * @param source
 * @param target
 * @param map
 * @param opt
 * @returns {*}
 */
function searchInDouble (line, sourceAnchor, targetAnchor, source, target, map, opt) {
  // compute adp grid by padding
  let gird = getGird(sourceAnchor, targetAnchor, opt.padding)

  let start, startPoints
  start = sourceAnchor
  startPoints = similarity(sourceAnchor, source, gird, opt)

  let end, endPoints
  end = targetAnchor
  endPoints = similarity(targetAnchor, target, gird, opt)

  if (startPoints.length & endPoints.length === 0) { // change point to point
    startPoints = Array.of(sourceAnchor)
    endPoints = Array.of(targetAnchor)
  }

  if (startPoints.length * endPoints.length > 0) {
    // Positive and negative
    let Positive = new Search(start, endPoints) // positive variable
    let Negative = new Search(end, startPoints) // negative variable

    for (let point of startPoints) {
      Positive.push(point, null, 0)
    }

    for (let point of endPoints) {
      Negative.push(point, null, 0)
    }

    // Positive.setEndFn(point => Negative.isRouted(point))
    // Negative.setEndFn(point => Positive.isRouted(point))
    // choose closed point
    // closed point was routed by openSet, close better than open
    Positive.setEndFn(point => Negative.isClose(point) || point.equal(Negative.source))
    Negative.setEndFn(point => Positive.isClose(point) || point.equal(Positive.source))

    Positive.setEndAccessibleFn((angle, point) => {
      if (!point.equal(end)) {
        let parent = Negative.getParent(point) || Negative.source
        let endAngle = opt.angle(parent.different(point).normalize())
        // let endAngle = opt.angle(Negative.getParent(point).different(point).normalize())

        // use in computeDistance
        // maybe has corner in junction
        Positive.endAngle = getDirectionChange(angle, endAngle)
        return opt.allowAngle(Positive.endAngle)
      }
      Positive.endAngle = 0
      return true
    })

    Negative.setEndAccessibleFn((angle, point) => {
      if (!point.equal(start)) {
        let parent = Positive.getParent(point) || Positive.source
        let endAngle = opt.angle(parent.different(point).normalize())
        Negative.endAngle = getDirectionChange(angle, endAngle)
        return opt.allowAngle(Negative.endAngle)
      }
      Negative.endAngle = 0
      return true
    })

    // if manhattanDistanc has corner, will has corner
    // so add penalties
    Positive.computeDistance = function (point) {
      return Positive.isEnd(point)
          ? Negative.getCost(point) + opt.penalties(Positive.endAngle, gird)
          // : point.manhattanDistance(Negative.current) + Negative.getCost(Negative.current)
          : Negative.current.findMin(target => point.manhattanDistanceWithPenalties(target, opt) + Negative.getCost(target))
    }

    Negative.computeDistance = function (point) {
      return Negative.isEnd(point)
          ? Positive.getCost(point) + opt.penalties(Negative.endAngle, gird)
          // : point.manhattanDistance(Positive.current) + Positive.getCost(Positive.current)
          : Positive.current.findMin(target => point.manhattanDistanceWithPenalties(target, opt) + Positive.getCost(target))
    }

    // add other target to improve accuracy
    // more target, more accuracy
    Positive.current = new Queue(opt.dynamicTargetCount)
    Negative.current = new Queue(opt.dynamicTargetCount)

    let directions = opt.directions(opt, gird) // actual direction data
    let loops = opt.maximumLoops

    while (!Positive.openSet.isEmpty && !Negative.openSet.isEmpty && loops > 0) {
      let positiveCurrent = Positive.pop()
      let negativeCurrent = Negative.pop()

      if (Positive.isEnd(positiveCurrent)) {
      // if (Negative.isClose(positiveCurrent)) {
        return buildUpPathInDouble(positiveCurrent, Positive, Negative)
      }

      if (Negative.isEnd(negativeCurrent)) {
      // if (Positive.isClose(negativeCurrent)) {
        return buildUpPathInDouble(negativeCurrent, Positive, Negative)
      }

      Negative.current.push(negativeCurrent)
      Positive.current.push(positiveCurrent)

      find(directions, Positive, positiveCurrent, gird, map, opt)
      find(directions, Negative, negativeCurrent, gird, map, opt)

      loops--
    }
  }

  return opt.failureRoute.call(line)
}

// route enter
function route (map, opt) {
  let source = getBounds(this.model.sourceNode)
  let target = getBounds(this.model.targetNode)

  let sourceBBox = source ? expandByPadding(source, opt) : undefined
  let targetBBox = target ? expandByPadding(target, opt) : undefined

  let sourceAnchor = new Point(this.getStartPoint())
  let targetAnchor = new Point(this.getEndPoint())

  map.build() // compute map obsta

  return opt.algorithm(this, sourceAnchor, targetAnchor, sourceBBox, targetBBox, map, opt)
}

// public function
export default function (line) {
  let map = ObstacleMap.find(line)
  try {
    return cantLink(line) || !map
        ? line.points
        : route.call(line, map, map.option)
  } catch (e) {
    console.error(e)
    return map.option.failureRoute.call(line)
  }
}

/* 监听器部分 */
export const ReaderListener = {
  partActivated (editPart) {
    let options = {...defaults}

    this.map = new ObstacleMap(editPart, options)
    if (editPart.children instanceof Array) {
      for (let child of editPart.children) {
        this.childAdded(child)
      }
    }
  },

  partDeactivated () {
    this.map.clear()
  },

  childAdded (child) {
    if (this.include(child)) {
      child.model.addPropertyListener(this.map.push(child).handler, 'bounds')
    }
  },

  removingChild (child) {
    if (this.include(child)) {
      let item = this.map.pop(child)

      if (child != null) {
        child.model.removePropertyListener(item.handler, 'bounds')
      }
    }
  },

  include (editPart) {
    let classes = this.map.option.includeClasses
    return classes.some(Constructor => editPart instanceof Constructor)
  }
}
