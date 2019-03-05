function getUUID (model) {
  let uuid = model.get('UUID')
  if (uuid == null || uuid === '') {
    throw new Error('类型为' + model.get('Type') + '没有UUID')
  }
  return uuid
}

export default class EditorStore {
  constructor (step) {
    this.step = step
    this.pool = new Map()
  }

  push (mode, editor) {
    editor && this.pool.set(mode, editor)
  }

  reset(data){
    this.step.rootEditPart.model.removeAllChildren();
    this.step.cmdStack.dispose();
    this.step.rootEditPart.refresh();

  }

  clear () {
    this.step && this.step.dispose()
    this.step = null

    this.pool.forEach(editor => editor.dispose())
    this.pool.clear()
  }

  has (mode) {
    return this.pool.has(mode)
  }

  get (mode) {
    return this.pool.get(mode)
  }

  get size () {
    return this.pool.size
  }

  get nodes () {
    return [...this.pool.values()]
  }
}
