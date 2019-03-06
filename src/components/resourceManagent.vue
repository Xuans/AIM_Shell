<template>
  <div class="data-base-operate-btn">
		<div class="right-bottom-btn" data-id="left">
			<i class="fa fa-arrow-left"></i>
			<span>后退</span>
		</div>
		<div class="right-bottom-btn" data-id="right">
			<i class="fa fa-arrow-right"></i>
			<span>前进</span>
		</div>
		<div class="right-bottom-btn" data-id="addFile">
			<i class="icon icon-wenjian"></i>
			<span>新增目录</span>
		</div>
		<div class="right-bottom-btn" data-id="delFile">
			<i class="fa fa-trash-o"></i>
			<span>删除分类</span>
		</div>
		<div class="right-bottom-btn" data-id="delModal">
			<i class="fa fa-trash-o"></i>
			<span>删除模型</span>
		</div>
		<div class="right-bottom-btn" data-id="refreshModal">
			<i class="fa fa-refresh"></i>
			<span>刷新</span>
		</div>
		<div class="right-bottom-btn right-absolute" data-id="searchModal">
			<i class="fa fa-search"></i>
		</div>
	</div>
	<div class="data-file-search active">
		<div class="search-input-content">
			<i class="fa fa-search"></i>
			<input type="text" id="searchInfoModal" placeholder="请输入关键字进行搜索" />
		</div>
		<div class="data-file-content">
		</div>
	</div>
	<div class="data-file-list">
		<div class="bi-button-group bi-card bi-vertical-layout bi-computer" v-for="(item,index) of list" :key="index">
			<div class="bi-pane bi-computer-list" :data-id="item.cate1.id">
				<div class="bi-computer-title-content">
					<div class="bi-computer-list-title-icon">
						<i class="fa fa-caret-down"></i>
					</div>
					<div class="bi-computer-list-title" data-parent="0" :data-id="item.cate1.id">
						<div class="title-name-computer"><span class="file-name">{{item.cate1.name}}</span></div>
					</div>
				</div>
				<div class="bi-computer-card-content">
					<div class="bi-computer-card-item" data-id="addcate1" :data-operate="id">
						<div class="card-content-text">新增{{id === "0" ? '文件夹':"业务模型"}}</div>
						<div class="card-content-icon">
							<i class="icon icon-file-add" style="color:#2ad285"></i>
						</div>
					</div>
					<div v-for="(child,ind) of item.child" :class="{'bi-computer-card-item': child.tree_node_type === "1" ? 'cate-file':'file'}" :data-parent="item.cate1.id" :data-id="child.id">
						<div class="card-content-text"><span class="file-name">{{child.name}}</span></div>
						<div class="card-content-icon">
							<i :class="child.tree_node_type === "1" ? 'fa fa-briefcase':'icon icon-LC_icon_file_line1'"></i>
						</div>
						<div class="card-content-number">
							12
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import iresource from "./resource";
export default {
  props: {
    model: {

    }
  },
  methods:{
  },
  computed: {
  },
  mounted(){
    	 var treeData = JSON.parse(`[{"id":"j9qCVWgBI_Ka3bnB4Y5w","pId":"0","name":"demo数据","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"kNqDVWgBI_Ka3bnBLI54","pId":"j9qCVWgBI_Ka3bnB4Y5w","name":"用户信息","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"mjrr92cBtyHGwXGDq9Jv","pId":"0","name":"功能数据","tree_node_type":"1","tree_node_icon":"agree-icon-206","iconSkin":"fa fa-database _demo"},{"id":"14UgUWgB3oSmSUNDvRqY","pId":"mjrr92cBtyHGwXGDq9Jv","name":"新建文件夹","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"sf3PUWkB7NVTgHc7z2p0","pId":"14UgUWgB3oSmSUNDvRqY","name":"sf3PUWkB7NVTgHc7z2p0","tree_node_type":"1","iconSkin":"fa fa-database _demo"},{"id":"vjGgNWgBY4fis8O0YUun","pId":"mjrr92cBtyHGwXGDq9Jv","name":"性能统计数据","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"Wf_sNmgB4vukcqgqdaeL","pId":"mjrr92cBtyHGwXGDq9Jv","name":"报表数据","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"WP_sNmgB4vukcqgqJ6fl","pId":"mjrr92cBtyHGwXGDq9Jv","name":"基线分析数据","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"PBXPTGkBTQtL2cIOdhJl","name":"PBXPTGkBTQtL2cIOdhJl","tree_node_type":"1","iconSkin":"fa fa-database _demo"},{"id":"W__wNmgB4vukcqgqZ6es","pId":"0","name":"行业数据","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"Zf8EN2gB4vukcqgqs6fj","pId":"0","name":"广发证券","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"I6wQUGgBHb-TpZU5C_JO","pId":"Zf8EN2gB4vukcqgqs6fj","name":"个人工作台","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"OxXPTGkBTQtL2cIOVhIl","pId":"Zf8EN2gB4vukcqgqs6fj","name":"OxXPTGkBTQtL2cIOVhIl","tree_node_type":"1","iconSkin":"fa fa-database _demo"},{"id":"QGuZnWgB-ImXLiaJfowr","pId":"Zf8EN2gB4vukcqgqs6fj","name":"test","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"kdqEVWgBI_Ka3bnBO45X","pId":"kNqDVWgBI_Ka3bnBLI54","name":"用户总览信息","tree_node_type":"2","tree_node_icon":"icon-view-mode","iconSkin":"fa agree-icon-206 _demo"},{"id":"mdqFVWgBI_Ka3bnBvo7_","pId":"kNqDVWgBI_Ka3bnBLI54","name":"用户工资信息","tree_node_type":"2","tree_node_icon":"icon-view-mode","iconSkin":"fa agree-icon-206 _demo"},{"id":"ffIlJ2gBgFXXNRq-IuqM","pId":"mjrr92cBtyHGwXGDq9Jv","name":"hostinfo","tree_node_type":"2","tree_node_icon":"icon-view-mode","iconSkin":"fa agree-icon-206 _demo"},{"id":"kUb1JWgBW9007TE1-Ekh","pId":"mjrr92cBtyHGwXGDq9Jv","name":"模型-1","tree_node_type":"2","tree_node_icon":"icon-view-mode","iconSkin":"fa agree-icon-206 _demo"},{"id":"RRLyJmgB6VchtN-7tPYW","pId":"mjrr92cBtyHGwXGDq9Jv","name":"2-2","tree_node_type":"2","tree_node_icon":"icon-view-mode","iconSkin":"fa agree-icon-206 _demo"},{"id":"uzFYMWgBY4fis8O0NkvM","pId":"mjrr92cBtyHGwXGDq9Jv","name":"服务器运行情况","tree_node_type":"2","tree_node_icon":"icon-view-mode","iconSkin":"fa agree-icon-206 _demo"},{"id":"uzo_E2gBMQSfNcvDdhK6","pId":"mjrr92cBtyHGwXGDq9Jv","name":"组合模型","tree_node_type":"2","tree_node_icon":"icon-view-mode","iconSkin":"fa agree-icon-206 _demo"},{"id":"c_8NN2gB4vukcqgqa6fA","pId":"vjGgNWgBY4fis8O0YUun","name":"11111","tree_node_type":"2","tree_node_icon":"icon-view-mode","iconSkin":"fa agree-icon-206 _demo"},{"id":"ZhV_fWgBOczfmyGtSpG-","pId":"I6wQUGgBHb-TpZU5C_JO","name":"项目信息模型","tree_node_type":"2","tree_node_icon":"icon-view-mode","iconSkin":"fa agree-icon-206 _demo"}]`)
      var html = '';
      treeData.forEach(item => {
          html += `<div class="search-list" data-type="${item.tree_node_type}" data-name="${item.name}" data-id="${item.id}">
                      <i class="${item.tree_node_type==='1' ? 'fa fa-briefcase':'icon icon-LC_icon_file_line1'}"></i>
                      <span>${item.name}</span>
                  </div>`
      })
      $(".data-file-content").html(html);
  },
  data() {
    var data = JSON.parse(`[{"cate1":{"id":"j9qCVWgBI_Ka3bnB4Y5w","pId":"0","name":"demo数据","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},"child":[{"id":"kNqDVWgBI_Ka3bnBLI54","pId":"j9qCVWgBI_Ka3bnB4Y5w","name":"用户信息","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"}]},{"cate1":{"id":"mjrr92cBtyHGwXGDq9Jv","pId":"0","name":"功能数据","tree_node_type":"1","tree_node_icon":"agree-icon-206","iconSkin":"fa fa-database _demo"},"child":[{"id":"14UgUWgB3oSmSUNDvRqY","pId":"mjrr92cBtyHGwXGDq9Jv","name":"新建文件夹","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"vjGgNWgBY4fis8O0YUun","pId":"mjrr92cBtyHGwXGDq9Jv","name":"性能统计数据","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"Wf_sNmgB4vukcqgqdaeL","pId":"mjrr92cBtyHGwXGDq9Jv","name":"报表数据","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"WP_sNmgB4vukcqgqJ6fl","pId":"mjrr92cBtyHGwXGDq9Jv","name":"基线分析数据","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"}]},{"cate1":{"id":"W__wNmgB4vukcqgqZ6es","pId":"0","name":"行业数据","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},"child":[]},{"cate1":{"id":"Zf8EN2gB4vukcqgqs6fj","pId":"0","name":"广发证券","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},"child":[{"id":"I6wQUGgBHb-TpZU5C_JO","pId":"Zf8EN2gB4vukcqgqs6fj","name":"个人工作台","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"},{"id":"OxXPTGkBTQtL2cIOVhIl","pId":"Zf8EN2gB4vukcqgqs6fj","name":"OxXPTGkBTQtL2cIOVhIl","tree_node_type":"1","iconSkin":"fa fa-database _demo"},{"id":"QGuZnWgB-ImXLiaJfowr","pId":"Zf8EN2gB4vukcqgqs6fj","name":"test","tree_node_type":"1","tree_node_icon":"","iconSkin":"fa fa-database _demo"}]}]`)
     
    return {
      id: '0',
      list:data,
    };
  }
};
</script>

<style scope>
.data-base-operate-btn{
	display: flex;
    background: #EBEBEB;
    color: #767676;
    line-height: 30px;
    padding-left: 10px;
}
.data-base-operate-btn>.right-bottom-btn{
	margin-right: 16px;
    cursor: pointer;
}
.data-base-operate-btn>.right-bottom-btn.right-absolute{
	position: absolute;
	right:  0;
}
.data-base-operate-btn>.right-bottom-btn:HOVER{
	color:  #000;
}
.data-base-right-bottom .db-tab-contents{
	height: calc(100% - 70px);
}
.data-base-right-bottom .db-tab-contents .tab-content {
	
}
.data-base-right-bottom .table-content-panel, .data-base-right-bottom .db-tab-contents .tab-content {
	height:  100%;
}
.data-file-list{
	position: relative;
	height: 100%;
}
.bi-button-content{
	position: relative;
	height: 100%;
}
.bi-computer{
	overflow: hidden auto;
    left: 0px;
    right: 0px;
    top: 10px;
    bottom: 10px;
    position: absolute;
}
.bi-card {
    background-color: #fff;
}
.bi-card, .bi-card .bi-input, .bi-card .bi-textarea {
    color: #3d4d66;
}
.bi-computer-list{
	position: relative;
    margin: 0px 10px 10px;
    min-height: 25px;
}
.bi-computer-title-content{
	height: 30px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.bi-computer-title-content.active{
	background: #bbc7cc;
    color: #FFF;
}
.bi-computer-title-content:HOVER{
	background: #F2F4F7;
	cursor: pointer;
}
.bi-computer-title-content.active:HOVER{
	background: #bbc7cc;
    color: #FFF;
}
.bi-computer-title-content.active input{
	color: #000;
}
.bi-computer-title-content.active:HOVER input{
	color: #000;
}
.bi-computer-list-title-icon{
	text-align: center;
    line-height: 1;
    position: relative;
    flex-shrink: 0;
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.bi-computer-list-title-icon>i{
	position: relative;
    flex-shrink: 0;
    margin: auto;
    width: 100%;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
}
.bi-computer-list-title{
	width: 200px;
    height: 25px;
    position: relative;
    flex-shrink: 0;
    margin-left: 0px;
    margin-right: 5px;
}
.title-name-computer{
	height: 25px;
    line-height: 25px;
    padding-left: 4px;
    padding-right: 4px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    position: absolute;
    box-sizing: border-box;
    word-break: break-word;
}
.bi-computer-card-content{
	position: relative;
	color: #3d4d66;
	display: flex;
	flex-wrap: wrap;
}
.data-file-search{
	position: absolute;
    width: 300px;
    height: 100%;
    z-index: 10;
    background: #FFF;
    box-shadow: 0 2px 8px 0 rgba(61,77,102,.15);
    right: -300px;
    transition: right .5s linear;
}
.search-list{
	height: 30px;
    padding: 0 10px;
    line-height: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
}
.search-list:HOVER{
	box-shadow: 0 2px 8px 0 rgba(61,77,102,.15);
}
.search-list>.fa, .search-list>.icon {
	margin-right: 10px;
}
.search-list>.fa {
	color: #FAAA39;
}
.search-list>.icon {
	color: #3685F2;
}
.data-file-search.active{
	right: 0;
}
.data-file-search input {
	width: 85%;
    border: none;
    font-size: 12px;
    height: 22px;
    text-indent: 10px;
}
.data-file-search .search-input-content{
	border-bottom: 1px solid #ccc;
    padding: 5px 10px;
}
.data-file-search .data-file-content{
	height: calc(100% - 32px);
}
.bi-computer-card-content>.bi-computer-card-item {
	width: 150px;
    height: 130px;
    position: relative;
    margin-top: 10px;
    margin-right: 10px;
    border: 1px solid #fff;
    background: #F7F8FA;
    cursor: pointer;
    overflow: hidden;
}
.bi-computer-card-content>.bi-computer-card-item.active{
	background-color: #fff;
    -webkit-box-shadow: 0 2px 8px 0 rgba(61,77,102,.15);
    -moz-box-shadow: 0 2px 8px 0 rgba(61,77,102,.15);
    box-shadow: 0 2px 8px 0 rgba(61,77,102,.15);
}
.bi-computer-card-content>.bi-computer-card-item:HOVER{
	background-color: #fff;
    -webkit-box-shadow: 0 2px 8px 0 rgba(61,77,102,.15);
    -moz-box-shadow: 0 2px 8px 0 rgba(61,77,102,.15);
    box-shadow: 0 2px 8px 0 rgba(61,77,102,.15);
}
.card-content-text{
	height: 25px;
    line-height: 25px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    left: 5px;
    right: 5px;
    bottom: 10px;
    position: absolute;
    box-sizing: border-box;
    word-break: break-word;
    text-overflow: ellipsis;
}
.card-content-icon{
	text-align: center;
    line-height: 1;
    left: 40px;
    top: 20px;
    position: absolute;
    width: 70px;
    height: 70px;
    align-items: center;
    justify-content: center;
    display: flex;
}
.card-content-icon>i {
	color: #FAAA39;
	font-size: 58px;
	margin: auto;
    position: relative;
    flex-shrink: 0;
}
.card-content-number{
	height: 25px;
    line-height: 25px;
    padding-left: 5px;
    padding-right: 5px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    right: 50px;
    bottom: 45px;
    position: absolute;
    font-size: 12px;
    color: #EAF2FD;
    box-sizing: border-box;
    word-break: break-word;
    text-overflow: ellipsis;
    cursor: pointer;
}
</style>