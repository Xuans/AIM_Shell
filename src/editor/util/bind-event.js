export const dblfPolicy = {
  config: {
    removingChild (child) {
      this.emit('vueHandler', 'removing', [child])
    },
    selectionChanged (selection) {
      this.emit('vueHandler', 'selectionChange', [selection])
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