function getUUID (model) {
  let uuid = model.get('UUID')
  if (uuid == null || uuid === '') {
    throw new Error('类型为' + model.get('Type') + '没有UUID')
  }
  return uuid
}

export default class NodePool {
  constructor (step) {
    this.step = step
    this.pool = new Map()
  }

  add (editor) {
    if (editor) {
      this.pool.set(editor.storeId, editor)
    }
  }

  getByModel (model) {
    return model != null ? this.pool.get(getUUID(model)) : null
  }

  containByModel (model) {
    return model != null ? this.pool.has(getUUID(model)) : false
  }

  deleteByModel (model) {
    if (model != null) {
      let uuid = getUUID(model)
      let node = this.pool.get(uuid)

      this.pool.delete(uuid)
      if (node === this.active) this.active = null

      return node
    }
  }

  clear () {
    this.step && this.step.dispose()
    this.step = null
    this.pool.clear()
  }

  get size () {
    return this.pool.size
  }

  get nodes () {
    return [...this.pool.values()]
  }

  static create (step) {
    if (step != null) {
      return new NodePool(step)
    }
  }
}
