(function (global) {

	var loadData = (param) => {
		return $.ajax({
			url: 'AFARequestAction_callAfaApp.do',
			dataType: "json",
			type: "POST",
			beforeSend: function (XMLHttpRequest) {
				XMLHttpRequest.setRequestHeader("aim_sdk", "amlog");
			},
			shelter: '正在加载数据，请稍候…',
			data: {
				appType: "aweb",
				target: "C016",
				args: function () {
					return param.data.t === false ? JSON.stringify({
						"c": param.data.c,//"tc.cama.aweb.shell.service.ITreeNodeService",
						"m": param.data.m, 	//"getTreeNode",
						"p": param.data.p   //[{'tree_class': "0001"}]
					}) : JSON.stringify({
						"c": param.data.c,//"tc.cama.aweb.shell.service.ITreeNodeService",
						"m": param.data.m, 	//"getTreeNode",
						"t": param.data.t || ["com.aim.alibaba.fastjson.JSONObject"],
						"p": param.data.p   //[{'tree_class': "0001"}]
					})
				}()
			},
			timeout: 2 * 60 * 1000,
		});
	};
	var methods = {};
	[{
		c: 'tc.cama.aweb.shell.service.ITreeNodeService',
		m: 'addTreeNode'
	}, {
		c: 'tc.cama.aweb.shell.service.ITreeNodeService',
		m: 'getTreeNodeLoop'
	}, {
		c: 'tc.cama.aweb.shell.service.ITreeNodeService',
		m: 'updateTreeNode'
	}, {
		c: 'tc.cama.aweb.shell.service.ITreeNodeService',
		m: 'delTreeNode'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellSerService',
		m: 'addService'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellSerService',
		m: 'getService'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellSerService',
		m: 'updateService'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellSerService',
		m: 'delService'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m: 'addInstance'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m: 'getInstance'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m: 'delInstance'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m: 'getInstances'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m: 'updateInstance'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m: 'getSchedules'
	}, {
		//13.查询脚本列表
		c: 'tc.cama.aweb.shell.service.IShellService',
		m: 'getShells'
	}, {
		//13.查询脚本列表
		c: 'tc.cama.aweb.shell.service.IShellService',
		m: 'getShell'
	}, {
		c: 'tc.cama.aweb.shell.service.IShellInstanceService',
		m: 'getAgents'
	}, {
		//发布接口
		c: 'tc.cama.aweb.shell.service.IShellSerVersionService',
		m: 'publishVersion'
	}, {
		//查询版本接口
		c: 'tc.cama.aweb.shell.service.IShellSerVersionService',
		m: 'getVersion'
	}, {
		//查询版本历史接口
		c: 'tc.cama.aweb.shell.service.IShellSerVersionService',
		m: 'getVersionHistory'
	}, {
		//执行脚本
		c: 'tc.cama.aweb.shell.service.IShellServiceExec',
		m: 'shellExec'
	}, {
		//发布脚本
		c: 'tc.cama.aweb.shell.service.IShellServiceExec',
		m: 'publishShell'
	}].forEach(method => {
		methods[method.m] = (function (method) {
			return function (p) {
				return new Promise((resv, rej) => {
					loadData({
						data: {
							p: p,
							m: method.m,
							c: method.c
						}
					}).then(response => {
						let result = response.content.result;
						if (result.head.errorCode == '00') {
							console.log(method.m, p, '成功', result.data);
							resv(result.data);
						} else {
							console.log(method.m, p, '失败', result);
							if (result.head)
								rej(result.head.errorMessage);
							else
								rej(result);
						}
					}).fail(response => {
						console.log(method.m, p, '错误', response);
						rej(response);
					});
				});
			};
		}(method));
	});

	[{
		//获取服务市场列表
		c: 'tc.cama.aweb.shell.service.IShellSerVersionService',
		m: 'getVersions'
	}, {
		//下载到`我的`
		c: 'tc.cama.aweb.shell.service.IShellSerVersionService',
		m: 'downloadVersion'
	}].forEach(method => {
		methods[method.m] = (function (method) {
			return function (p) {
				return new Promise((resv, rej) => {
					loadData({
						data: {
							p: p,
							m: method.m,
							c: method.c,
							t:false
						}
					}).then(response => {
						let result = response.content.result;
						if (result.head.errorCode == '00') {
							console.log(method.m, p, '成功', result.data);
							resv(result.data);
						} else {
							console.log(method.m, p, '失败', result);
							if (result.head)
								rej(result.head.errorMessage);
							else
								rej(result);
						}
					}).fail(response => {
						console.log(method.m, p, '错误', response);
						rej(response);
					});
				});
			};
		}(method));
	});

	global.app = global.app || {};
	global.app.shellEditorApi = methods;

	// example
	// methods.getTreeNodeLoop([{"tree_class":"0002","tree_node_name":节点名称}])
	// 			.then(function(response){})
	// 			.catch(function(error){});
}(this));