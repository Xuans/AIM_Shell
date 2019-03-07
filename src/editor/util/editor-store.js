export default class EditorStore {
  constructor (target) {

    this.target = target
    this.active = null
    this.activeEditor = null
    this.pool = new Map()
  }

  push (mode, editor) {
    editor && (this.pool.set(mode, editor), this.setEditor(editor))
  }

  reset (data) {
    this.activeEditor.rootEditPart.model.removeAllChildren()
    this.activeEditor.cmdStack.dispose()
    this.activeEditor.rootEditPart.refresh()
  }

  clear () {
    this.activeEditor && this.activeEditor.dispose()
    this.activeEditor = null

    this.pool.forEach(editor => editor.dispose())
    this.pool.clear()
  }

  has (mode) {
    return this.pool.has(mode)
  }

  setValueToActive (key, value) {
    this.active && this.active.set(`data.${key}`, value)
  }

  addServiceParams (id, key, alias) {
    if (this.activeEditor) {
      const taffyDb = this.activeEditor.store.node
      const props = taffyDb({id: id}).first()

      if (props) {
        const params = this.activeEditor.config.serviceParams
        for (let {pid, pkey} of params) {
          if (id === pid && pkey === key) {
            return // if added
          }
        }

        params.push({
          id, key, alias, name: props.data.name
        })
      }
    }
  }

  removeServiceParams (id, key) {
    if (this.activeEditor) {
      const params = this.activeEditor.config.serviceParams

      for (let i = 0; i < params.length; i++) {
        if (id === params[i].id && params[i].key === key) {
          params.splice(i, 1)
          return
        }
      }
    }
  }

  checkExposure (id, key) {
    if (this.activeEditor) {
      const params = this.activeEditor.config.serviceParams

      for (let i = 0; i < params.length; i++) {
        if (id === params[i].id && params[i].key === key) {
          return true
        }
      }

      return false
    }

    throw Error()
  }

  get (mode) {
    return this.pool.get(mode)
  }

  setEditor (editor) {
    if (editor !== this.activeEditor) {
      editor && editor.rootEditPart.$emit('vueHandler', 'selectionChange', [editor.rootEditPart.selection])
      this.activeEditor = editor
    }
  }

  getAndApplyCurrent (mode) {
    this.setEditor(this.get(mode))

    return this.activeEditor
  }

  get size () {
    return this.pool.size
  }

  get serviceParams () {
    return this.activeEditor ? this.activeEditor.config.serviceParams : []
  }

  get activeInput () {
    return this.active ? this.active.get('data') : null
  }

  get activeId () {
    return this.active ? this.active.get('id') : null
  }

  save () {
    alert('save')
  }

  delete () {
    this.activeEditor && this.activeEditor.removeNode(this.active)
  }

  upload () {
    alert('upload')
  }
}
