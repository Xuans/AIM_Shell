import ___ from "../../anrajs/index";

const fakeNode = {
  canDrag: false,
  linkable: false,
  selectable: false,
  refresh () {
    if (this.model && this.figure) {
      let bounds = this.model.get('bounds')

      this.figure.setBounds({
        x: bounds[0],
        y: bounds[1],
        width: bounds[2],
        height: bounds[3]
      })

      if (this.model.get('color')) this.figure.style.fill = this.model.get('color')
    }

    this.figure.paint()
  },
  type: $AG.Node.RECT
}


export default function makeState () {
  // TODO

  return {
    /* 输入数据 -> 编辑器数据 */
    input2Config () {
      return {
        id: 'asdas', // 挂在dom节点Id,
        children: {
          fakeNode
        },
        data: [
          {id: 1, type: 'fakeNode', color: 'red', bounds: [50, 50, 50, 50]}
        ]
      }
    },

    save () {

    },


    update () {},
    setInput () {}
  }
}