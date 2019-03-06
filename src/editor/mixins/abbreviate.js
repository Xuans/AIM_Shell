import $ from 'jquery'

const AbbreviationTool = $AG.Tool.scrollByDragTool.extend({
  constructor (coverEl, first) {
    this.coverEl = coverEl
    this.target = first
  },
  doSnapshot () {
    // 数据快照
    // this.dataSnapshot = this.editor.store.node().select('id', 'bounds')

    const wrap = this.editor.element
    this.attrSnapshot = {
      scrollLeft: wrap.scrollLeft,
      scrollTop: wrap.scrollTop
    }
    this.styleSnapshot = {
      overflow: $(wrap).css('overflow')
    }

    /*this.policySnapshot = {
      'Layout Policy': this.editor.rootEditPart.getLayoutPolicy()
    }*/
  },
  recoverSnapshot () {
    let root = this.editor.rootEditPart

    /*this.dataSnapshot.forEach(([id, bounds]) => {
      let editPart = root.getEditPartById(id)

      if (editPart != null) {
        editPart.model.set('bounds', bounds)
        editPart.refresh()
      }
    })*/

    $(this.editor.element).animate(this.attrSnapshot, 500)
    $(this.editor.element).css(this.styleSnapshot)
  },
  activate () {
    this.base()
    this.doSnapshot()
    // 设置wrap
    $(this.editor.element).css('overflow', 'hidden')

    const root = this.editor.rootEditPart
    root.scale(0.8, 0.8)
    this.target = root.getEditPart(this.target) // incorrect
    this.locate(this.target)
    root.setSelection(this.target)
  },
  deactivate () {
    this.base()

    const root = this.editor.rootEditPart
    root.scale(1, 1).translate(0, 0)

    this.recoverSnapshot()
  },
  locate (editPart) {
    if (editPart == null) return

    let wrap = this.editor.element
    let wrapParent = wrap.parentNode
    let viewHalfWidth, viewHalfHeight

    viewHalfWidth = (wrapParent.clientWidth - parseFloat($(this.coverEl).width())) / 2
    viewHalfHeight = wrapParent.clientHeight / 2
    viewHalfWidth += wrap.scrollLeft
    viewHalfHeight += wrap.scrollTop

    /* scroll */
    let bounds = editPart.figure.bounds
    let center = {x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2}
    let scale = editPart.figure.svg.dispatcher.scale

    let x = Math.round((viewHalfWidth - center.x * scale[0]))
    let y = Math.round((viewHalfHeight - center.y * scale[1]))
    editPart.getRoot().translate(x, y)
  },
  mouseDown (e, p) {
    if ($AG.EditPart.isNode(p)) {
      this.locate(p)
    }
    return this.base(e, p)
  }
})


export default {
  methods: {
    abbreviateWhenOpen (editor, model, coverEl) {
      let tool = editor.getActiveTool()
      if (tool instanceof AbbreviationTool) return

      editor.setActiveTool(new AbbreviationTool(coverEl, model))
    },
    abbreviateWhenClose (editor) {
      editor.setActiveTool(editor.getDefaultTool())
    }
  }
}