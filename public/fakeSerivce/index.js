export default {
  getScriptInstanceTree () {
    return [
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
      }]
  },
  getServiceInstance () {
    return {
      "start":"1",
      "data":{
        "1":{
          "id":"1",
          "name":"编译交易脚本",
          "scriptId":"caf41eaf",
          "ip":"192.168.1.2",
          "port":"22",
          "params":{
          },
          bounds:[120,40,180,40],
          "target":{
            "0":"2",
            "1":"4"
          }
        },
        "2":{
          "id":"2",
          "name":"打包项目",
          "scriptId":"ahawerw",
          "ip":"192.168.1.2",
          "port":"22",
          bounds:[20,120,180,40],
          "params":{
          },
          "target":{
            "0":"3",
            "1":"4"
          }
        },
        "3":{
          "id":"3",
          "name":"部署项目",
          "scriptId":"afagaf",
          "ip":"192.168.1.122",
          "port":"22",
          bounds:[320,250,180,40],
          "params":{
          },
          "target":{
          }
        },
        "4":{
          "id":"4",
          "name":"脚本执行出错",
          "scriptId":"dsaf123sd",
          "ip":"192.168.1.3",
          "port":"2212",
          bounds:[20,250,180,40],
          "params":{
            "output":"f:/log/script.log",
            "type":"1"
          }
        }
      }
    }
  },
  getServiceCtr () {},
  createSerivceCtr () {
    return {
      id: 'a service ctr'
    }
  }
}