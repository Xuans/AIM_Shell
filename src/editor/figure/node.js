import { terminalPolicy } from "../util/terminal";
import selectable from '../util/state-policy'
import { textPolicy0 } from "../util/text-policy";
import tooltipPolicy from '../util/tooltip-policy'
import { debugUIPolicy } from "../util/debug-policy";
import {refresh} from "../util/layout-policy";

const color = 'gray';
export default (function() {return {
  canDrag: true,
  linkable: $AG.ValidatorConnection,
  selectable: selectable,
  refresh,
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