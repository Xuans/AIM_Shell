import {nodes} from './largeFlow'

export default {
  getAgent (cb) {
  },
  convertTimeFormat (ms) {
    if (ms < 1000) return ms + 'ms'
    let s = ms / 1000
    if (s < 60) return s + 's'
    if (s < 3600) return s / 60 + 'min'

    var hours = parseInt(ms / 3600000)
    var minutes = parseInt((ms % 3600000) / (1000 * 60))
    var seconds = (ms % (1000 * 60)) / 1000

    return hours + 'h ' + minutes + 'min ' + seconds + 's '
  },
  getTasks () {
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
  getScriptInstanceTree (target = {}) {
    return Promise.resolve([
      {
        'tree_p_node_name': '文件脚本集',
        'tree_node_type': '1',
        'tree_class': '1',
        'tree_node_table': '',
        'tree_node_desc': '文件脚本集',
        'tree_node_name': 'fileOpSet',
        'children': [{
          'tree_p_node_name': 'FTP上传',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': 'FTP上传',
          'tree_node_name': 'FTP上传'
        },
        {
          'tree_p_node_name': '文件编译',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '文件编译',
          'tree_node_name': '文件编译'
        },
        {
          'tree_p_node_name': '文件部署',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '文件部署',
          'tree_node_name': '文件部署'
        },
        {
          'tree_p_node_name': '文件下载',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '文件下载',
          'tree_node_name': '文件下载'
        }]
      },
      {
        'tree_p_node_name': '',
        'tree_node_type': '1',
        'tree_class': '1',
        'tree_node_table': '',
        'tree_node_desc': '数据库脚本集',
        'tree_node_name': 'dbOpSet',
        'children': [{
          'tree_p_node_name': '创建表',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '创建表',
          'tree_node_name': '创建表'
        },
        {
          'tree_p_node_name': '删除表',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '删除表',
          'tree_node_name': '删除表'
        },
        {
          'tree_p_node_name': '执行SQL',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '执行SQL',
          'tree_node_name': '执行SQL'
        },
        {
          'tree_p_node_name': '增加字段',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '增加字段',
          'tree_node_name': '增加字段'
        }
        ]
      },
      {
        'tree_p_node_name': '',
        'tree_node_type': '1',
        'tree_class': '1',
        'tree_node_table': '',
        'tree_node_desc': '代码同步工具脚本',
        'tree_node_name': 'codeSyncToolSet',
        'children': [{
          'tree_p_node_name': 'Git提交',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': 'Git提交',
          'tree_node_name': 'Git提交'
        },
        {
          'tree_p_node_name': 'Git拉取',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': 'Git拉取',
          'tree_node_name': 'Git拉取'
        },
        {
          'tree_p_node_name': 'SVN提交',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': 'SVN提交',
          'tree_node_name': 'SVN提交'
        },
        {
          'tree_p_node_name': 'CVS提交',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': 'CVS提交',
          'tree_node_name': 'CVS提交'
        }
        ]
      },

      {

        'tree_p_node_name': '',
        'tree_node_type': '1',
        'tree_class': '1',
        'tree_node_table': '',
        'tree_node_desc': '错误处理脚本',
        'tree_node_name': 'errorSyncToolSet',
        'children': [{
          'tree_p_node_name': '通知管理员',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '通知管理员',
          'tree_node_name': '通知管理员'
        },
        {
          'tree_p_node_name': '回滚数据库',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '回滚数据库',
          'tree_node_name': '回滚数据库'
        },
        {
          'tree_p_node_name': '生成日志',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '生成日志',
          'tree_node_name': '生成日志'
        },
        {
          'tree_p_node_name': '上报异常',
          'tree_node_type': '2',
          'tree_class': '1',
          'tree_node_table': '',
          'tree_node_desc': '上报异常',
          'tree_node_name': '上报异常'
        }
        ]

      }

    ])
  },

  getServiceInstanceTree () {
    return Promise.resolve([{
      type: '1',
      service_id: 'start',
      serivce_name: '测试服务',
      inputId: 0
    },
    {
      type: '1',
      service_id: 'close',
      serivce_name: '编译并部署',
      inputId: 1
    },
    {
      type: '1',
      service_id: 'close',
      serivce_name: '服务端文件分布管理',
      inputId: 2
    },
      {
        type: '1',
        service_id: 'close',
        serivce_name: 'ssss',
        inputId: 2
      }
    ])
  },
  getServiceInstance: function (target, version) {
    return version ? Promise.resolve(nodes[version]) : Promise.resolve(nodes[0])
  },
  getLogs () {
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
  getServiceCtr () {},
  createSerivceCtr () {
    return {
      id: 'a service ctr',
      type: 0,
      inputId: -1
    }
  },
  save (target, data) {
    return new Promise(resolve => {
      methods.updateService([{
        'service_ename': target.ret.service_ename,
        'service_name': target.ret.service_name,
        'service_content': JSON.stringify(data),
        'service_args': JSON.stringify([]),
        'tree_p_node_name': target.ret.tree_p_node_name,
        'service_id': target.ret.service_id
      }]).then(response => {
        debugger
        resolve(true)
      }).fail(response => {
        debugger
        resolve(false)
      })
    })
  },
  field: {
    scriptTree: {
      label: 'tree_node_desc',
      children: 'children'
    },
    serviceTree: {
      label: 'serivce_name',
      children: 'children'
    }
  },

  scriptField: [
    {
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
      default() {
        return '关于脚本编排'
      }
    },
    {
      key: 'agent',
      name: 'Agent',
      exposure: true,
      writable: true,
      default() {
        return ''
      }
    }
  ],

  shellPaneAtBottom: [
    {
      name: '任务参数',
      component: 'ElInput',
    },
    {
      name: '日志',
      component: 'ElInput'
    },
    {
      name: '任务列表',
      component: 'ElInput'
    }
  ],

  getNode () {
    return {
      'id': '1',
      'name': '编译交易脚本',
      'scriptId': 'caf41eaf',
      'ip': '192.168.1.2',
      'port': '22',

      bounds: [120, 40, 180, 40],
      'target': {
        '0': '4',
        '1': '2'
      }
    }
  }
}
