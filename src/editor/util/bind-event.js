export const dblfPolicy = {
  config: {
    removingChild (child) {
      this.emit('vueHandler', 'nodeOfToDelete', [child])
    },
    selectionChanged (selection) {
      // TODO
      if (selection instanceof Array && selection.length === 1) selection = selection[0]
      this.emit('vueHandler', 'stepOfSelectionChange', [selection])
    }
  },
  activate () {
    this.getHost().addEditPartListener('removingChild', this.removingChild)
    this.getHost().addEditPartListener('selectionChanged', this.selectionChanged)
  },

  deactivate () {
    this.getHost().removeEditPartListener('removingChild', this.removingChild)
    this.getHost().removeEditPartListener('selectionChanged', this.selectionChanged)
  }
}