import $ from 'jquery'

const AbbreviationTool = $AG.Tool.scrollByDragTool.extend({
  constructor (coverEl, first) {
    this.coverEl = coverEl
    this.target = first
  },
  doSnapshot () {
    const wrap = this.editor.element
    this.attrSnapshot = {
      scrollLeft: wrap.scrollLeft,
      scrollTop: wrap.scrollTop
    }
    this.styleSnapshot = {
      overflow: $(wrap).css('overflow')
    }
  },
  recoverSnapshot () {
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
    root.setSelection(root.getEditPart(this.target))

    this.locate(this.target)
  },
  deactivate () {
    this.base()

    this.editor.rootEditPart.scale(1, 1).translate(0, 0)
    this.recoverSnapshot()
  },
  locate (target) {
    this.editor.locate(target, {x:  parseFloat($(this.coverEl).width()), y: 0})
  },
  mouseDown (e, p) {
    this.locate(p)
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