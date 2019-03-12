import {
  nodes
} from './largeFlow'

const methods = global.app.shellEditorApi

export default {
  $getAgent(cb) {
    methods
      .getAgents([{}])
      .then(response => {
        const ret = response.content.result.data.r.ret
        const content = JSON.parse(ret.service_content || '{}')
        target.ret = ret
        content.data = content.data || []
        cb(content)
      })
      .fail(error => {
        console.log(error)
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
  $getTasks() {
    return [{
        name: '主机部署',
        time: '2018/03/12',
        ip: '112.1.2.41',
        value: '主机部署(112.1.2.41)',
        inputId: 0
      },
      {
        name: '部署流程',
        time: '2018/03/14',
        ip: '112.12.2.41',
        value: '拉取代码并编译部署(122.121.2.41)',
        inputId: 1
      },
      {
        name: '三方部署',
        time: '2018/03/14',
        ip: '112.12.2.41',
        value: 'FTP上传(122.1.2.41)',
        inputId: 1
      }
    ]
  },
  $getScriptInstanceTree(target = {}) {
    return new Promise(resolve => {
      methods.getTreeNodeLoop([{
        'tree_class': '0001',
        'tree_node_name': ''
      }]).then(response => {
        console.log('getScriptInstanceTree', target);
        // window.script=response;
        let result = response.content.result.data.r.ret

        resolve(result || [])
      }).fail(error => {
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
        console.log('getServiceInstanceTree', target);
        // window.service=response;
        let result = response.content.result.data.r.ret

        resolve(result || [])
      }).fail(error => {
        resolve([])
      })
    })
  },
  $getServiceInstance: function (target) {
    return new Promise(resolve => {
      methods.getService([target])
        .then(response => {

          const ret = response.content.result.data.r.ret;
          if (ret && ret.service_content) {
            target.service_content = ret.service_content;
            console.log('编辑器数据读取成功',ret);
            target.isReady = true;
          } else {
            console.log('编辑器数据读取失败，执行初始化',response.content.result);
            target.isReady = false;
          }
          // const content=ret?ret.service_content?JSON.parse(ret.service_content||"{}"):{}:{};
         
          // target.ret=ret;
          target.service_content.data = target.service_content.data || [];

          resolve(target.service_content);
        })
        .fail((error) => {
          console.log(error);
          resolve({
            data: []
          });
        });
    });

    // return Promise.resolve(nodes[1])
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
  $saveSerivce(target, data) {
    console.log('保存编辑器内容', target,data);
    //isReady为false表示服务需要初始化
    target.service_content=JSON.stringify(data||{});
    if (target.isReady)
      return new Promise(resolve => {
        methods.updateService([
          target
          //   {
          //   'service_ename': target.inputId,
          //   'service_name': target.name,
          //   'service_content': JSON.stringify(data),
          //   'service_args': JSON.stringify([]),
          //   'tree_p_node_name': target.parent,
          //   'service_id': target.ret.service_id
          // }
        ]).then(response => {
          debugger
          console.log('成功')
          resolve(true)
        }).fail(response => {
          debugger
          console.log('失败')
          resolve(false)
        })
      })
    else {
      //服务没有初始化时，执行初始化方法
      console.log('添加新服务',target);
      return new Promise(
        resolve=>{
          methods.addService([target]).then(resp=>{
            console.log('成功')
            target.isReady=true;
            resolve(true)
          }).fail(resp=>{
            console.log('失败')
            resolve(false)
          })
        }
      )
    }
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