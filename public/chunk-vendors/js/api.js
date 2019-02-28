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
		m:'addInstance'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m:'getInstance'
	},{
		c:'tc.cama.aweb.shell.service.IShellSerInstanceService',
		m:'getSchedules'
	}].forEach(method=>{
		methods[method.m]=(function(method){
			return function(p){
				return loadData({
					data:{
						p:p,
						m:method.m,
						c:method.c
					}
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