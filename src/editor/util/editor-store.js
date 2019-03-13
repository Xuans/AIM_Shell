export default class EditorStore {
  constructor(target) {

    this.target = target
    this.active = null
    this.activeEditor = null
    this.pool = new Map()
    this.modified=0;
  }

  push(mode, editor) {
    editor && (this.pool.set(mode, editor), this.setEditor(editor))
  }

  reset(data) {
    this.activeEditor.rootEditPart.model.removeAllChildren()
    this.activeEditor.cmdStack.dispose()
    this.activeEditor.rootEditPart.refresh()
  }

  clear() {
    this.activeEditor && this.activeEditor.dispose()
    this.activeEditor = null

    this.pool.forEach(editor => editor.dispose())
    this.pool.clear()
  }

  has(mode) {
    return this.pool.has(mode)
  }

  setValueToActive(key, value) {
    this.active && this.active.set(`data.${key}`, value)
    this.modified++
  }

  addServiceParams(nodeId, item, placeholder) {
    if (this.activeEditor) {
      const params = this.activeEditor.config.service_params
      if (!params)
        params = {};

      let nodeParams = params[nodeId]
      if (!nodeParams){
        Vue.set(params,nodeId,{});
        nodeParams=params[nodeId];
      }
     Vue.set(nodeParams,item.ename,{
        ...item,
        placeholder
      });
      this.activeEditor.config.service_params = params;
    }
  }

  removeServiceParams(nodeId, {
    ename
  }) {
    if (this.activeEditor) {
      const params = this.activeEditor.config.service_params
      if (params && params[nodeId]) {
        Vue.delete(params[nodeId],ename);
      }
      this.modified++
    }
  }
  /**
   * 检查该值是否已经被导出
   * @param {*} id 
   * @param {*} ename 
   */
  checkExposure(id, ename) {
    if (this.activeEditor) {
      const params = this.activeEditor.config.service_params
      if (!params)
        return false;

      if (params[id] == null)
        return false;

      if (params[id][ename] == null)
        return false;
      return false
    }

    throw Error()
  }

  get(mode) {
    return this.pool.get(mode)
  }

  setEditor(editor) {
    if (editor !== this.activeEditor) {
      editor && editor.rootEditPart.$emit('vueHandler', 'selectionChange', [editor.rootEditPart.selection])
      this.activeEditor = editor
    }
  }

  getAndApplyCurrent(mode) {
    this.setEditor(this.get(mode))

    return this.activeEditor
  }

  get size() {
    return this.pool.size
  }

  get service_params() {
    return this.activeEditor ? this.activeEditor.config.service_params : {}
  }

  get activeInput() {
    return this.active ? this.active.get('data') : null
  }

  get activeId() {
    return this.active ? this.active.get('id') : null
  }

  save() {
    this.activeEditor && this.activeEditor.save()
  }

  delete() {
    this.activeEditor && this.activeEditor.removeNode(this.active)
  }

  upload() {
    alert('upload')
  }
}