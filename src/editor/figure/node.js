import { terminalPolicy } from "../util/terminal";
import selectable from '../util/state-policy'
import { textPolicy0 } from "../util/text-policy";
import tooltipPolicy from '../util/tooltip-policy'
import { debugUIPolicy } from "../util/debug-policy";
import {refresh} from "../util/layout-policy";

const color = 'gray'

export function editNode () {
  return {
    canDrag: true,
    linkable: $AG.ValidatorConnection,
    selectable: selectable,
    refresh,
    type: 'rect',
    policies: {
      't': terminalPolicy,
      'tt': textPolicy0,
      'ttt': tooltipPolicy,
    },
    attr: {
      fill: color
    }
  }
}

export function noeditNode () {
  return {
    canDrag: true,
    linkable: $AG.ValidatorConnection,
    selectable: selectable,
    refresh,
    type: 'rect',
    policies: {
      't': terminalPolicy,
      'tt': textPolicy0,
      'ttt': tooltipPolicy,
      debugUI: debugUIPolicy
    },
    attr: {
      fill: color
    }
  }
}