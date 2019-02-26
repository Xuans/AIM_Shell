import State$0 from "./state$0";
import State$1 from './state$1'

function zeroOrOne (target) {
  return target.type === 0
}

export default function makeState (target) {
  return zeroOrOne(target) ? new State$0(target) : new State$1(target)
}