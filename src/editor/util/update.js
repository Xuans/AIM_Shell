/* 将位置和连线信息更新至taffyDB中 */

/*function checkAttr (obj, key) {
  if (isNull(obj[key])) {
    throw ReferenceError(`In taffyDB updating, ${key} attr is null`)
  }
}*/

function editorMissing () {
  throw new TypeError('Missing parameter: editor')
}

function updateNodes (editor, nodeStore) {
  /* 若不正确，不做update */
  /*nodeStore(function () {
    /!*checkAttr(this, props.UUID)
    checkAttr(this, props.Type)*!/
    return false
  })*/
  // 更新节点位置
  nodeStore().update(function () {
    let data = this.data

    data.bounds = this.bounds
    data.id = this.id

    return this
  })
}

function updateLines (editor, nodeStore, lineStore) {
  /* 需要更新连线 */
  const Connections = {}

  lineStore().each(({source, target, exit, entr}) => {
    (Connections[source] || (Connections[source] = {}))[exit] = target
  })
  nodeStore().update(function () {
    this.data.target = Connections[this.id] || {}
    return this
  })
}

export default function update (editor = editorMissing()) {
  let nodeStore = editor.store.node
  let lineStore = editor.store.line

  // 更新节点位置（若update线异常，则update节点已做更新）
  updateNodes(editor, nodeStore)
  updateLines(editor, nodeStore, lineStore)
  // editor.cmdStack.markSaveLocation()
}
