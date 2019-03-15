import devepmentApi from "../../public/fakeSerivce/deveplmentApi"
import serverApi from '../../public/fakeSerivce/serverApi'

function isDevepment () {
  return !(app && app.dispatcher)
}

export default function (vue) {
  const api = isDevepment() ? devepmentApi : serverApi

  for (let [key, fn] of Object.entries(api)) {
    vue.prototype[key] = vue[key] = fn
  }
}