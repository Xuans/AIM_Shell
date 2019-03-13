const isCN = /[^\x00-\xff]/g
const spacing = 3

function splitStr (str, limit) {
  let count = 0
  let i = 0
  let prefix = ''
  let char

  for (; i < str.length; i++) {
    char = str[i]

    if (char.match(isCN) == null) {
      count++
      prefix += char
    } else {
      if (count + 1 < limit) {
        count += 2
        prefix += char
      } else {
        /* 补全 */
        prefix += ' '
        break
      }
    }

    if (count >= limit) break
  }
  return [prefix, str.substr(++i)]
}

function toString (text) {
  return text || ''
}

const DuplicateText = $AG.Control.extend($AG.svg.Text).extend({
  limit: 1,
  text: '',
  setLimit (limit) {
    this.limit = limit
  },
  setText (text) {
    const str = splitStr(text, this.limit)

    if (str[1].length > 0) {
      let index = str[0].length - 1
      let count = 1

      text = str[0]
      while (count > 0) {
        count -= text[index--].match(isCN) == null ? 1 : 2
      }
      text = text.slice(0, index + 1) + '...'
    }

    this.base(text)
  },
  initProp () {
    this.base()
    this.disableEvent()
    this.setVisible(false)
    this.setAttribute({'text-anchor': 'middle'})
    this.ready = true
  }
})

/* 一级节点 */
export const textPolicy0 = $AG.Policy.extend({
  limit: 22,
  activate () {
    const host = this.getHost()
    this.fontHeight = $AG.Util.fontHeight(host.editor.canvas.owner) / 2
    // const idPolicy = this.createIdPolicy()
    const despPolicy = this.createDespPolicy()
    // host.installPolicies({idPolicy, despPolicy})
    host.installPolicies({despPolicy})
  },
  deactivate () {
    if (this.handles != null) {
      for (let handle of this.handles) {
        this.getHandleLayer().removeChild(handle)
        this.getHostFigure().off('handler', handle.hook)
        handle.dispose()
      }
    }
    /* TODO 全选 */
    // this.getHost().policies.get('idPolicy').deactivate()
    this.getHost().policies.get('despPolicy').deactivate()
    // this.getHost().removeEditPolicy('idPolicy')
    this.getHost().removeEditPolicy('despPolicy')
  },
  computeCenter (f) {
    return {x: f.bounds.x + f.bounds.width * 0.1, y: f.bounds.y + f.bounds.height / 2}
  },
  computeDespCenter (f) {
    return {x: f.bounds.x + f.bounds.width * 0.6, y: f.bounds.y + f.bounds.height * 0.5}
  },
  createDuplicate () {
    if (this.handles == null) this.handles = []

    const handle = new DuplicateText()
    handle.setLimit(this.limit)
    this.handles.push(handle)
    this.getHandleLayer().addChild(handle)

    handle.hook = (fn) => fn(handle)
    this.getHostFigure().on('handler', handle.hook)

    return handle
  },
  createIdPolicy () {
    const fontHeight = this.fontHeight
    const computer = this.computeCenter
    const options = {
      attribute: {'text-anchor': 'middle'},
      style: {'fill': '#ffffff'}
    }
    function locator (f) {
      const location = computer(f)
      location.y += fontHeight
      this.setBounds(location)
    }

    return $AG.Policy.TextPolicy('data.id', locator, options)
  },
  createDespPolicy () {
    let duplicate = false
    let model = this.getHost().model
    // let limit = this.limit
    const fontHeight = this.fontHeight
    const handle = this.createDuplicate()
    const computer = this.computeDespCenter
    const options = {
      isListen: true,
      attribute: {'text-anchor': 'middle'},
      formatter (text) {
        if (duplicate) {
          handle.setText(`${toString(text)}:${toString(model.get('data.port'))}`)
          handle.setVisible(true)
          return toString(model.get('data.name'))
        } else {
          handle.setVisible(false)
          return toString(model.get('data.name'))
        }
      }
    }

    function locator (f) {
      const location = computer(f)
      const bounds = f.getBounds()
      let offset = 0

      this.setBounds(location)

      if (duplicate) {
        let ajust = (bounds.height / 2 - 2 * fontHeight - spacing) / 2
        offset = bounds.height * 0.25 - ajust
        handle.setBounds(location)
        handle.setAttribute({'dy': fontHeight + offset})
      }

      this.setAttribute({'dy': fontHeight - offset})
    }

    return $AG.Policy.TextPolicy('data.name', locator, options)
  }
})

/* 二级节点 */
export const textPolicy1 = textPolicy0.extend({
  computeCenter (f) {
    return { x: f.bounds.x + f.bounds.width * 0.1, y: f.bounds.y + f.bounds.height / 2 }
  },
  createIdPolicy () {
    const fontHeight = this.fontHeight
    const computer = this.computeCenter
    const options = {
      attribute: {'text-anchor': 'middle'},
      style: {'fill': '#ffffff'}
    }
    function locator (f) {
      const location = computer(f)
      location.y += fontHeight
      this.setBounds(location)
    }

    return $AG.Policy.TextPolicy('id', locator, options)
  }
})

/* 开始节点 */
export const textPolicy2 = textPolicy0.extend({
  limit: 8,
  computeCenter (f) {
    return {x: f.bounds.x + f.bounds.width / 2, y: f.bounds.y + f.bounds.height / 6}
  },
  computeDespCenter (f) {
    return {x: f.bounds.x + f.bounds.width / 2, y: f.bounds.y + f.bounds.height * 7 / 12}
  }
})

/* 并行节点 */
export const textPolicy3 = textPolicy0.extend({
  computeCenter (f) {
    return {x: f.bounds.x + f.bounds.width / 2, y: f.bounds.y + f.bounds.height * 0.1}
  },
  computeDespCenter (f) {
    return {x: f.bounds.x + f.bounds.width / 2, y: f.bounds.y + f.bounds.height * 0.6}
  },
  createDespPolicy () {
    const computer = this.computeDespCenter
    const fontHeight = this.fontHeight * 2

    /*  */
    const limit = this.limit
    const options = {
      isListen: true,
      formatter (text) {
        const iterator = text[Symbol.iterator]()
        let count = 2
        let index = 0
        let texts = []
        let next = iterator.next()

        if (!next.done) {
          while (index < limit) {
            // not CN
            if (next.value.match(isCN) == null) {
              texts[index] = (texts[index] || '') + next.value.match
              count--
            } else {
              if (count === 2) {
                texts[index] = (texts[index] || '') + next.value
                count = 0
              } else {
                if (++index < limit) {
                  texts[index] += next.value
                  count = 0
                } else {
                  break
                }
              }
            }

            if (count < 1) {
              next = iterator.next()
              if (next.done) break

              index++
              count = 2
            }
          }
        }

        // duplicate
        if (index >= limit && next.value !== undefined) {
          texts[limit - 1] = '..'
        }

        return texts
      },
      handle (editPart) {
        let handle = new $AG.Handle.TextArea(editPart)

        handle.setTextAttribute({
          'text-anchor': 'middle',
          'dominant-baseline': 'middle'
        })
        return handle
      }
    }

    function locator (f) {
      const location = computer(f)
      location.y -= 1.5 * (fontHeight + this.lineSpacing)
      this.setBounds(location)
    }

    return $AG.Policy.TextPolicy('Desp', locator, options)
  }
})
