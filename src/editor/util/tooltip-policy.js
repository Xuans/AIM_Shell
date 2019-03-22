export default {
  config: {
    handleOfUpdateTooltip () {
      const model = this.getHost().model
      const figure = this.getHostFigure()
      let text = `英文名：${model.get('data.shell_def.shell_ename') || ''}
名称：${model.get('data.name') || ''}
代理：${model.get('data.agent')|| '' }
创建人：${model.get('data.shell_def.create_user')|| '' }`

      figure.addToolTip(text)
    }
  },
  activate () {
    const model = this.getHost().model

    model.addPropertyListener(this.handleOfUpdateTooltip, 'data.agent')

    this.handleOfUpdateTooltip()
  },
  deactivate() {
    const model = this.getHost().model

    model.removePropertyListener(this.handleOfUpdateTooltip, 'data.agent')
  }
}