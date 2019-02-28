import large from "./largeFlow"
export default {
  getTasks() {
    return [
      {
        name: '主机部署',
        time: '2018/03/12',
        ip: '112.1.2.41',
        value: '主机部署(112.1.2.41)',
        inputId: 0,
      },
      {
        name: '三方部署',
        time: '2018/03/14',
        ip: '112.12.2.41',
        value: 'FTP上传(122.1.2.41)',
        inputId: 1,
      },
    ]
  },
  doSave(editor,callback){

      setTimeout(callback,1000);
  },
  getScriptInstanceTree() {
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

  getServiceInstanceTree() {
    return [
      {
        type: '1',
        service_id: 'start',
        serivce_name: '启动服务',
      },
      {
        type: '1',
        service_id: 'close',
        serivce_name: '关闭服务'
      }
    ]
  },
  getServiceInstance(target) {
    switch (target.inputId) {
      case 0: return large
      default: return {
        "start": "1",
        "data": {
          "1": {
            "id": "1",
            "name": "编译交易脚本",
            "scriptId": "caf41eaf",
            "ip": "192.168.1.2",
            "port": "22",
            "params": {
              "output": "f:/log/script.log"
            },
            bounds: [120, 40, 180, 40],
            "target": {
              "0": "4",
              "1": "2"
            }
          },
          "2": {
            "id": "2",
            "name": "打包项目",
            "scriptId": "ahawerw",
            "ip": "192.168.1.2",
            "port": "22",
            bounds: [20, 120, 180, 40],
            "params": {
              "output": "f:/log/script.log"
            },
            "target": {
              "0": "4",
              "1": "3"
            }
          },
          "3": {
            "id": "3",
            "name": "部署项目",
            "scriptId": "afagaf",
            "ip": "192.168.1.122",
            "port": "22",
            bounds: [320, 250, 180, 40],
            "params": {
              "output": "f:/log/script.log"
            },
            "target": {
            }
          },
          "4": {
            "id": "4",
            "name": "脚本执行出错",
            "scriptId": "dsaf123sd",
            "ip": "192.168.1.3",
            "port": "2212",
            bounds: [20, 250, 180, 40],
            "params": {
              "output": "f:/log/script.log",
              "type": "1"
            }
          }
        }
      };
    }
  },
  getLogs() {

    return [
      {
        time: "2019/2/25 12:11:01",
        duration: '100',
        result: 1,
        progress: {
          1: {
            log: 'file ajz.1 compiler successed',
            result: 1,
            time: "2019/2/25 12:11:01",
            duration: '40',
          },

          2: {
            log: 'resource faz.jar ajz.1 deploy successed',
            result: 1,
            time: "2019/2/25 12:11:21",
            duration: '40',
          },
          3: {
            log: 'resource faz.jar ajz.1 deploy successed<b>asdasdad</b> <h1>adq2eqe</h1>fjoiqerqowirsdhfjaf<br>',
            result: 1,
            time: "2019/2/25 12:11:21",
            duration: '50',
          },
        }
      },
      {
        time: "2019/2/25 12:11:01",
        duration: '80',
        result: 0,
        progress: {
          1: {
            log: 'can not found file',
            result: 0,
            time: "2019/2/25 12:11:01",
            duration: '40',
          },

          4: {
            log: 'record error',
            result: 1,
            time: "2019/2/25 12:11:21",
            duration: '40',
          }
        }
      },
      {
        time: "2019/2/25 12:11:01",
        duration: '100',
        result: 0,
        progress: {
          1: {
            log: 'file ajz.1 compiler successed',
            result: 1,
            time: "2019/2/25 11:11:01",
            duration: '1330',
          },

          2: {
            log: 'timeout error',
            result: 0,
            time: "2019/2/25 12:11:21",
            duration: '7623012',
          },
          4: {
            log: 'record error',
            result: 1,
            time: "2019/2/25 12:21:21",
            duration: '1',
          }
        }
      },

    ]
  },
  getServiceCtr() { },
  createSerivceCtr() {
    return {
      id: 'a service ctr',
      type: 0,
      inputId: 1,
    }
  },
  save(target, data) {
    console.log(data)
    return Promise.reject()
  }
}