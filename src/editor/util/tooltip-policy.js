export default {
  config: {
    handleOfUpdateTooltip () {
      const model = this.getHost().model
      const figure = this.getHostFigure()

      let text = `名称：${model.get('data.name')}
地址：${model.get('data.ip')}:${model.get('data.port')}
参数：${model.get('data.params.output')}`

      figure.addToolTip(text)
    }
  },
  activate () {
    const model = this.getHost().model

    model.addPropertyListener(this.handleOfUpdateTooltip, 'data.ip')
    model.addPropertyListener(this.handleOfUpdateTooltip, 'data.port')

    this.handleOfUpdateTooltip()
  },
  deactivate() {
    const model = this.getHost().model

    model.removePropertyListener(this.handleOfUpdateTooltip, 'data.ip')
    model.removePropertyListener(this.handleOfUpdateTooltip, 'data.port')
  }
}