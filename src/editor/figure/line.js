import ___ from "../../anrajs/index";
import {getColor} from '../util/terminal'
import router from '../util/manhattan-router'

const ButtLine = $AG.Handle.extend($AG.POLY_LINE).extend({
  // replacedByHostOnEvnet: true,
  constructor (editPart) {
    if (editPart instanceof $AG.LineEditPart) $AG.Handle.prototype.constructor.call(this, editPart)
    else throw new Error('not line')
    this.evetHost = editPart
  },
  initProp () {
    this.addClass('connection-wrap')
  },
  refreshLocation (figure) {
    this.enable = this.editPart.figure.enable
    this.setAttribute('d', figure.getAttr('d'))
  }
})

export default {
  createFigure (model) {
    this.config.style.stroke = getColor(model.get('exit'))
    return $AG.Figure.init(this.config)
  },
  style: {
    'stroke': '#323232',
    'stroke-width': 3,
    'cursor': 'move'
  },
  type: $AG.CURVE_LINE,
  endMarker: {
    type: $AG.TRIANGLE,
    size: 3
  },
  selectable: {
    selected: {
      'stroke-width': 6
    }
  },
  router,
  policies: {
    't': {
      config: {
        exitChange () {
          this.getHostFigure().setStyle('stroke', getColor(arguments[2]))
        }
      },
      activate () {
        this.handle = new ButtLine(this.getHost())
        this.getLineLayer().addChild(this.handle)

        this.getHost().model.addPropertyListener(this.exitChange, 'exit')
      },
      deactivate () {
        this.getLineLayer().removeChild(this.handle)
        this.getHost().model.removePropertyListener(this.exitChange, 'exit')
      }
    }
  }
}
