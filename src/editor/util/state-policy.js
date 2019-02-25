
const StateHandle = $AG.Handle.extend({
  constructor (editPart) {
    this.base(editPart)
  },
  initProp () {
    this.setAttribute({
      'stroke-width': '1',
      'stroke': '#466183',
      'fill': 'none'
    })
    this.defaultEvent = {'pointer-events': 'none'}
  },
  refreshLocation (figure) {
    let bounds = figure.getBounds()
    this.setBounds({
      x: bounds.x - 2,
      y: bounds.y - 2,
      width: bounds.width + 4,
      height: bounds.height + 4
    })
  }
})


export default $AG.TransitionPolicy.extend({
  states: {
    selected: '#466183',
    hover: '#00afa4',
    linked: '#e38661'
  },
  getHandle () {
    if (this.handle) return this.handle

    this.handle = new StateHandle(this.getHost())
    this.getHandle = () => this.handle
    return this.handle
  },
  changeOfSelected () {
    this.setState('selected')
    // this.selected()
    this.show()
  },
  changeOfnoSelected () {
    this.hide()
  },
  enterOfnoSelected ({tool}) {
    if (tool === 'selection tool') {
      this.show()
      this.setState('hover')
      // this.hover()
    }
    if (tool === 'link tool') {
      this.show()
      this.setState('linked')
    }
  },
  leaveOfnoSelected ({tool}) {
    if (tool === 'selection tool' || tool === 'link tool') this.hide()
  },
  show () {
    this.getHandleLayer().addChild(this.getHandle())
  },
  hide () {
    this.getHandleLayer().removeChild(this.getHandle())
  },
  setState (state) {
    this.getHandle().setAttribute('stroke', this.states[state])
  },
  deactivate () {
    this.hide()
    this.base()
  }
})