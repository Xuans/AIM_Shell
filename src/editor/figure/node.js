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
      'tttt': {
        config: {
          switch () {
            this.emit('vueHandler', vue => vue.handleOfSwitch())
          }
        },
        activate () {
          this.getHostFigure().on('dblclick', this.switch)
        },
        deactivate () {
          this.getHostFigure().off('dblclick', this.switch)
        }
      }
    },
    attr: {
      fill: color
    }
  }
}

export function noeditNode () {
  return {
    canDrag: true,
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

export function versionNode () {
  return {
    canDrag: false,
    // linkable: $AG.ValidatorConnection,
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