(function(global){

    var loadData = (param) => {
		return $.ajax({
			url: 'AFARequestAction_callAfaApp.do',
			dataType: "json",
			type: "POST",
			beforeSend: function (XMLHttpRequest) {
				XMLHttpRequest.setRequestHeader("aim_sdk", "amlog");
            },
            shelter:'正在加载数据，请稍候…',
			data: {
				appType: "aweb",
				target: "C016",
				args: JSON.stringify({
					"c": param.data.c,//"tc.cama.aweb.shell.service.ITreeNodeService",
					"m": param.data.m, 	//"getTreeNode",
					"t": param.data.t || ["com.aim.alibaba.fastjson.JSONObject"],
					"p": param.data.p   //[{'tree_class': "0001"}]
				})
			},
			timeout: 2 * 60 * 1000,
		});
	};
	var methods={};
	[{
		c:'tc.cama.aweb.shell.service.ITreeNodeService',
		m:'addTreeNode'
	},{
		c:'tc.cama.aweb.shell.service.ITreeNodeService',
		m:'getTreeNodeLoop'
	},{
        c:'tc.cama.aweb.shell.service.ITreeNodeService',
        m:'updateTreeNode'
    },{
		c:'tc.cama.aweb.shell.service.ITreeNodeService',
		m:'delTreeNode'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerService',
		m:'addService'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerService',
		m:'getService'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerService',
		m:'updateService'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerService',
		m:'delService'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m:'addInstance'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m:'getInstance'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m:'delInstance'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m:'getInstances'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m:'updateInstance'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m:'getSchedules'
	},{
		//13.查询脚本列表
		c:'tc.cama.aweb.shell.service.IShellService',
		m:'getShells'
	},{
		c:'tc.cama.aweb.shell.service.IShellInstanceService',
		m:'getAgents'
	},{
		//发布接口
		c:'tc.cama.aweb.shell.service.IShellSerVersionService',
		m:'publishVersion'
	},{
		//查询版本接口
		c:'tc.cama.aweb.shell.service.IShellSerVersionService',
		m:'getVersion'
	},{
		//查询版本历史接口
		c:'tc.cama.aweb.shell.service.IShellSerVersionService',
		m:'getVersionHistory'
	}].forEach(method=>{
		methods[method.m]=(function(method){
			return function(p){
				return new Promise((resv,rej)=>{
					loadData({
						data:{
							p:p,
							m:method.m,
							c:method.c
						}
					}).then(response=>{
						let result=response.content.result;
						if(result.head.errorCode=='00'){
							console.log(method.m,p,'成功',result.data);
							resv(result.data);
						}else{
							console.log(method.m,p,'失败',result);
							if(result.head)
								rej(result.head.errorMessage);
							else
								rej(result);
						}
					}).fail(response=>{
						console.log(method.m,p,'失败',response);
						rej(response.message);
					});
				});
			};
		}(method));
	});

    global.app=global.app||{};
    global.app.shellEditorApi=methods;

    // example
    // methods.getTreeNodeLoop([{"tree_class":"0002","tree_node_name":节点名称}])
	// 			.then(function(response){})
	// 			.fail(function(error){});



}(this));