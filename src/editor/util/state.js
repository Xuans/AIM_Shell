import ___ from "../../anrajs/index";
import $ from 'jquery'
import {terminalPolicy} from './terminal'
import line from '../figure/line'

// import {textPolicy0} from "./text-policy";

import {ReaderListener} from "./manhattan-router";

const fakeNode = {
  canDrag: true,
  linkable: $AG.ValidatorConnection, //$AG.ValidatorConnection,
  selectable: true,
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
  type: 'secondaryNode1',

  policies: {
    't': terminalPolicy({addAnchor: data => data}),
    // 'tt': textPolicy0
  }
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
        types: {
          secondaryNode1: {
            id: 'secondaryNode1',
            useHTMLString: `
    <path d="M1024 1024H64a64 64 0 0 1-64-64V64a64 64 0 0 1 64-64H1024z"/>
    <path transform="translate(1024 0)" d="M32 992V32h4403.52a32 32 0 0 1 32 32v896a32 32 0 0 1-32 32z" fill="#ffffff" />
    <path transform="translate(1024 0)" d="M4435.52 64v896H64V64h4371.52m0-64H0v1024h4435.52a64 64 0 0 0 64-64V64a64 64 0 0 0-64-64z" />
    `,
            attr: {
              'viewBox': '0 0 5523 1024'
            }
          }

        },
        lines: { '0': line },
        data: [
          {
            id: 1,
            type: 'fakeNode',
            color: 'red',
            bounds: [50, 50, 150, 50],
            Terminals: {
              Terminal: [
                {id: 'success', dir: 's', offset: 10},
                {id: 'failure', dir: 's', offset: -10},
                {id: 'n', dir: 'n', offset: 0}
              ]
            }
          }
        ],
        palette: [
          {
            "tree_p_node_name": "",
            "tree_node_type": "1",
            "tree_class": "1",
            "tree_node_table": "",
            "tree_node_desc": "321321321",
            "tree_node_name": "321",
            "children": [{
              "tree_p_node_name": "321",
              "tree_node_type": "2",
              "tree_class": "1",
              "tree_node_table": "",
              "tree_node_desc": "脚本名称1",
              "tree_node_name": "脚本名称1"
            }],
          },
          {
            "tree_p_node_name": "",
            "tree_node_type": "1",
            "tree_class": "1",
            "tree_node_table": "",
            "tree_node_desc": "这是分类测试",
            "tree_node_name": "分类测试",
            "children": [
              {
                "tree_p_node_name": "分类测试",
                "tree_node_type": "2",
                "tree_class": "1",
                "tree_node_table": "",
                "tree_node_desc": "test",
                "tree_node_name": "test"
              },
              {
                "tree_p_node_name": "分类测试",
                "tree_node_type": "2",
                "tree_class": "1",
                "tree_node_table": "",
                "tree_node_desc": "test2",
                "tree_node_name": "test2"
              }],
          }],
        onHooks: [ReaderListener]
      }
    },

    save () {

    },


    update: $.noop,
    setInput: $.noop
  }
}