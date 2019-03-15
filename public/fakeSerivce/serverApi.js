import {
  nodes
} from './largeFlow'

const methods = global.app.shellEditorApi

export default {
  $getAgent(cb) {
    methods
      .getAgents([{}])
      .then(response => {
        const ret = response.r.ret
        const content = JSON.parse(ret.service_content || '{}')
        target.ret = ret
        content.data = content.data || []
        cb(content)
      })
      .catch(error => {

        cb({
          data: []
        })
      })
  },
  $convertTimeFormat(ms) {
    if (ms < 1000) return ms + 'ms'
    let s = ms / 1000
    if (s < 60) return s + 's'
    if (s < 3600) return s / 60 + 'min'

    var hours = parseInt(ms / 3600000)
    var minutes = parseInt((ms % 3600000) / (1000 * 60))
    var seconds = (ms % (1000 * 60)) / 1000

    return hours + 'h ' + minutes + 'min ' + seconds + 's '
  },
  $getTasks({
    service_id
  }) {
    return methods.getInstances([{
      service_id
    }]);
    // return [{
    //     name: '主机部署',
    //     time: '2018/03/12',
    //     ip: '112.1.2.41',
    //     value: '主机部署(112.1.2.41)',
    //     inputId: 0
    //   },
    //   {
    //     name: '部署流程',
    //     time: '2018/03/14',
    //     ip: '112.12.2.41',
    //     value: '拉取代码并编译部署(122.121.2.41)',
    //     inputId: 1
    //   },
    //   {
    //     name: '三方部署',
    //     time: '2018/03/14',
    //     ip: '112.12.2.41',
    //     value: 'FTP上传(122.1.2.41)',
    //     inputId: 1
    //   }
    // ]
  },
  $getShellInstance({
    shell_ename
  }) {
    return methods.getShells([{
      shell_ename
    }]);
  },
  $getScriptInstanceTree(target = {}) {
    return new Promise(resolve => {
      methods.getTreeNodeLoop([{
        'tree_class': '0001',
        'tree_node_name': ''
      }]).then(response => {
        // window.script=response;
        let result = response.r.ret

        resolve(result || [])
      }).catch(error => {
        resolve([])
      })
    })
  },

  $getServiceInstanceTree(target = {}) {
    return new Promise(resolve => {
      methods.getTreeNodeLoop([{
        'tree_class': '0002',
        'tree_node_name': ''
      }]).then(response => {
        // window.service=response;
        let result = response.r.ret

        resolve(result || [])
      }).catch(error => {
        resolve([])
      })
    })
  },
  $getServiceInstance: function (target) {
    return new Promise(resolve => {
      methods.getService([target])
        .then(response => {

          // const ret = response.r.ret;
          // let content;
          // if (ret && ret.service_content) {
            // content = JSON.parse(ret.service_content);

          //   for (let k in ret) {
          //     target[k] = ret[k];
          //   }
          //   target

          //   console.log('编辑器数据读取成功', ret);
          // } else {
          //   console.log('编辑器数据读取失败，执行初始化', response);
          //   target.isReady = false;
          // }

          // content = content || [];

          resolve(response.r.ret);
        })
        .catch((error) => {
          target.isReady = false;
          resolve({
          });
        });
    });

    // return Promise.resolve(nodes[1])
  },
  $getVersionHistory({service_id}){
    return methods.getVersionHistory([{service_id}]);
  },
  
  $getVersion({service_id}){
    return methods.getVersion([{service_id}]);
  },
  
  $publishVersion({service_id,service_version}){
    return methods.publishVersion([{service_id,service_version}]);
  },
  $getLogs() {
    return [{
        time: '2019/2/25 12:11:01',
        duration: '100',
        result: 1,
        progress: {
          1: {
            log: 'file ajz.1 compiler successed',
            result: 1,
            time: '2019/2/25 12:11:01',
            duration: '40'
          },

          2: {
            log: 'resource faz.jar ajz.1 deploy successed',
            result: 1,
            time: '2019/2/25 12:11:21',
            duration: '40'
          },
          3: {
            log: 'resource faz.jar ajz.1 deploy successed<b>asdasdad</b> <h1>adq2eqe</h1>fjoiqerqowirsdhfjaf<br>',
            result: 1,
            time: '2019/2/25 12:11:21',
            duration: '50'
          }
        }
      },
      {
        time: '2019/2/25 12:11:01',
        duration: '80',
        result: 0,
        progress: {
          1: {
            log: 'can not found file',
            result: 0,
            time: '2019/2/25 12:11:01',
            duration: '40'
          },

          4: {
            log: 'record error',
            result: 1,
            time: '2019/2/25 12:11:21',
            duration: '40'
          }
        }
      },
      {
        time: '2019/2/25 12:11:01',
        duration: '100',
        result: 0,
        progress: {
          1: {
            log: 'file ajz.1 compiler successed',
            result: 1,
            time: '2019/2/25 11:11:01',
            duration: '1330'
          },

          2: {
            log: 'timeout error',
            result: 0,
            time: '2019/2/25 12:11:21',
            duration: '7623012'
          },
          4: {
            log: 'record error',
            result: 1,
            time: '2019/2/25 12:21:21',
            duration: '1'
          }
        }
      }

    ]
  },
  $updateTreeNode(node) {
    return methods.updateTreeNode([node]);
  },
  $addTreeNode(node) {
    return methods.addTreeNode([node]);
  },
  $delTreeNode(node) {
    return methods.delTreeNode([node]);
  },
  $addServiceByTreeNode(treeNode) {
    return methods.addService([{
      "service_ename": treeNode.tree_node_name,
      "service_name": treeNode.tree_node_desc,
      "service_content": "{}",
      "service_args": "[]",
      "tree_p_node_name": treeNode.tree_p_node_name,
      "service_desc": treeNode.tree_node_desc,
      "service_doc": "",
      "create_user": treeNode.user,
    }]);
  },
  $saveSerivce(target, data,args) {
    //isReady为false表示服务需要初始化
    target.service_content = JSON.stringify(data || {});
    target.service_args = JSON.stringify(args || {});
    let r = {
      ...target
    }
    delete r.service_ename;
    // if (target.isReady)
    return  methods.updateService([r]);
    // else {
    //   //服务没有初始化时，执行初始化方法
    //   console.log('添加新服务', target);
    //   return new Promise(
    //     resolve => {
    //       methods.addService([target]).then(resp => {
    //         console.log('成功', resp)
    //         target.isReady = true;
    //         resolve(true)
    //       }).catch(resp => {
    //         console.log('失败', resp)
    //         resolve(false)
    //       })
    //     }
    //   )
    // }
  },
  $field: {
    scriptTree: {
      label: 'tree_node_desc',
      children: 'children'
    },
    serviceTree: {
      label: 'tree_node_desc',
      children: 'children'
    }
  },

  $scriptField: [{
      key: 'id',
      name: 'ID',
      exposure: false,
      writable: false
    },
    {
      key: 'author',
      name: '作者',
      exposure: false,
      writable: false,
      default () {
        return '未知'
      }
    },
    {
      key: 'createTime',
      name: '创建时间',
      writable: false,
      exposure: false,
      default () {
        return Date().toString()
      },
    },
    {
      key: 'desc',
      name: '描述',
      exposure: false,
      writable: true,
      default () {
        return '关于脚本编排'
      }
    },
    {
      key: 'agent',
      name: 'Agent',
      exposure: true,
      writable: true,
      default () {
        return ''
      }
    }
  ]
}