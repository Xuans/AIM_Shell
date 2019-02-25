import $ from 'jquery'

const keyMananger = function (type) {
  let a
  let handles = {}
  let watchPool = new Map()

  this.accessible = true

  this.bind = (key, handle) => {
    let keys = key.toLowerCase().split('+')
    return handles[keys.sort().join('+')] = handle
  }

  this.unbind = (key) => {
    let keys = key.toLowerCase().split('+')
    handles[keys.sort().join('+')] = null
  }

  this.exec = (c, e, type = 'keyup') => {
    if (c) {
      if (typeof (c) === 'function') {
        return c(e)
      } else { return c[type] && c[type](e) }
    }
  }

  this.getHandle = function (e) {
    let keys = []
    if (e.altKey) { keys.push('alt') }
    if (e.ctrlKey) { keys.push('ctrl') }
    if (e.shiftKey) { keys.push('shift') }
    keys.push(e.key.toLowerCase())
    return handles[keys.sort().join('+')]
  }
  this.keydown = (e) => {
    if (!this.accessible || e.key == null) return
    if (this.exec(a, e, 'keydown') === false) return false
    if (this.exec(this.getHandle(e), e, 'keydown') === false) return false
  }
  this.keyup = (e) => {
    if (!this.accessible || e.key == null) return
    if (this.exec(a, e) === false) return false
    if (this.exec(this.getHandle(e), e) === false) return false
  }
  this.active = el => {
    if (el == null) {
      a = null
      return
    }
    if (watchPool.has(el)) {
      a = watchPool.get(el)
    }
  }
  this.unwatchAllPage = () => {
    for (let el of watchPool.keys()) {
      this.unwatchPage(el)
    }
    a = null
  }

  const registPage = (el, handle) => {
    watchPool.set(el, handle)
  }

  const unregistPage = (el) => {
    if (a === watchPool.get(el)) a = null
    watchPool.delete(el)
  }

  if (type === 'global') {
    this.watchPage = (el, handle) => {
      if (!watchPool.has(el)) {
        registPage(el, handle)
        $(el).on(`click.keyManager`, () => { a = handle })
      } else {
        this.active(el)
      }
    }

    this.unwatchPage = (el) => {
      if (watchPool.has(el)) {
        $(el).off(`click.keyManager`)
        unregistPage(el)
      }
    }

    $(document).keydown((e) => {
      if (this.keydown(e) === false) { return false }
      if (e.ctrlKey && (e.keyCode === 83 || e.keyCode === 65 || e.keyCode === 112)) { return false }
    })

    $(document).keyup(this.keyup)
  } else {
    this.watchPage = (key, handle) => {
      watchPool.has(key) ? this.active(key) : registPage(key, handle)
    }
    this.unwatchPage = (key) => {
      if (watchPool.has(key)) unregistPage(key)
    }
  }

  return this
}

export default keyMananger
