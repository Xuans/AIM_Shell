const TextPolicy = {
  config: {
    refreshVisible(value) {
      this.textWidget && (this.textWidget.setOpacity(value))
    }
  },
  activate: function () {

    this.listener = () => {
      this.setText(this.getHost().model.get('data.name'));
    };
    this.getHost().model.addPropertyListener(this.listener, 'data.name');

    this.listener();

    // this.getHostFigure().on('opacity:change', this.refreshVisible)
  },
  deactivate() {
    this.getHost().model.removePropertyListener(this.listener, 'data.name');
    // this.getHostFigure().off('opacity:change', this.refreshVisible)
  },
  setText(text) {

    if (!this.textWidget) {
      let Text = $AG.svg.Control.extend($AG.svg.Text);
      this.textWidget = new Text();
      this.textWidget.bounds.x = 110;
      this.textWidget.bounds.y = 15;
      this.textWidget.setAttribute('text-anchor', 'middle');
      this.textWidget.setAttribute('dy', $AG.Util.fontHeight(this.getHost().editor.canvas.owner));
      this.getHost().getFigure().addChild(this.textWidget);
      // debugger
    }
    this.textWidget.setText(text);
    // $('text',this.getHost().getFigure().domContainer()).text(text);
  }
};

export default TextPolicy