import { terminalPolicy } from "../util/terminal";
import selectable from '../util/state-policy'
import { textPolicy0 } from "../util/text-policy";
import tooltipPolicy from '../util/tooltip-policy'
const color = 'gray';
export default (function() {return {
  canDrag: true,
  linkable: $AG.ValidatorConnection,
  selectable: selectable,
  refresh() {
    if (this.model && this.figure) {
      let bounds = this.model.get('bounds')

      this.figure.setBounds({
        x: bounds[0],
        y: bounds[1],
        width: bounds[2],
        height: bounds[3]
      })

      if (this.model.get('color')) this.figure.style.fill = this.model.get('color')
      else this.figure.style.fill = color;
    }

    this.figure.paint()
  },
  type: 'rect',

  policies: {
    't': terminalPolicy({ addAnchor: data => data }),
    'tt': textPolicy0,
    'ttt': tooltipPolicy,
  },

  attr: {
    fill: color
  }
}
})