import $ from 'jquery'

const FlowConstruction = $AG.extend({
  background: '#f1f1f4',
  createCanvas (id) {
    $(`#${id}`).css('background-color', this.background)
    return new $AG.SVG(id)
  }
})

function create (config) {
  return new FlowConstruction($.extend(true, {}, config))
}

function demount (editor) {
  if ($AG.isEditor(editor)) {
    $(editor.canvas.owner).detach()
  }
}

function bind (editor, event) {
  if (event) for (let [key, fn] of Object.entries(event)) editor.rootEditPart.$on(key, fn)
}

function mount (editor, el) {
  if ($AG.isEditor(editor)) {
    $(el).append(editor.canvas.owner)
  }
}

function init (editor, vueInstance) {
  editor.doSave = vueInstance.save
  editor.showContextMenu = vueInstance.showMenu
  editor.hideContextMenu = vueInstance.hideMenu
  editor.cmdStack.addCommandStackEventListener(new $AG.Listener(vueInstance.command))
}

export default {
  init,
  create,
  bind,
  mount,
  demount
}

