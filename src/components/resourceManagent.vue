<template>
<div style="position:relative;width:100%;height:100%;">
  <div class="data-base-operate-btn" ref="test">
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
			<span @click.stop="$emit('create',list.length==1?list[0]:null,1)">新增目录</span>
		</div>
		<div class="right-bottom-btn" data-id="refreshModal">
			<i class="fa fa-refresh"></i>
			<span>刷新</span>
		</div>
		<div class="right-bottom-btn right-absolute" data-id="searchModal" @click.stop="showSearchPanel=!showSearchPanel">
			<i class="fa fa-search" ></i>
		</div>
	</div>
	<div class="data-file-search active animated fadeIn" v-show="showSearchPanel">
		<div class="search-input-content">
			<i class="fa fa-search"></i>
			<input type="text" id="searchInfoModal" v-model="queryString" placeholder="请输入关键字进行搜索" />
		</div>
		<div class="data-file-content" ref="fileContent">
      <div @dblclick.stop="reveal(item)" v-show="filter(item)" v-for='(item,index) in searchable' :key='index'   class="search-list" :data-type="item.tree_node_type" :data-name="item.tree_node_desc" :data-id="item.tree_node_name">
                      <i :class="item.tree_node_type==='1' ? 'fa fa-briefcase':'icon icon-LC_icon_file_line1'"></i>
                      <span>{{item.tree_node_desc}}</span>
                  </div>
		</div>
	</div>
	<div class="data-file-list">
		<div class="bi-button-group bi-card bi-vertical-layout bi-computer" v-for="(item,index) of list" :key="index">
			<div class="bi-pane bi-computer-list" :data-id="item.tree_node_name">
				<div class="bi-computer-title-content">
					<div class="bi-computer-list-title-icon">
						<i class="fa fa-caret-down"></i>
					</div>
					<div class="bi-computer-list-title" data-parent="0" :data-id="item.tree_node_name">
						<div class="title-name-computer"><span class="file-name">{{item.tree_node_desc}}</span></div>
					</div>
				</div>
				<div class="bi-computer-card-content">
					<div class="bi-computer-card-item"  @click.stop="$emit('create',item,1)" data-id="addcate1" :data-operate="id">
						<div class="card-content-text">新增{{id === "0" ? '文件夹':"业务模型"}}</div>
						<div class="card-content-icon">
							<i class="icon icon-file-add" style="color:#2ad285"></i>
						</div>
					</div>
					<div @dblclick.stop="reveal(child)" v-for="(child,ind) of item.children" :class="{'bi-computer-card-item': child.tree_node_type === '1' ? 'cate-file':'file'}" :data-parent="item.tree_node_name" :data-id="child.tree_node_name">
						<div class="card-content-text"><span class="file-name">{{child.tree_node_desc}}</span></div>
						<div class="card-content-icon">
							<i :class="child.tree_node_type === '1' ? 'fa fa-briefcase':'icon icon-LC_icon_file_line1'"></i>
						</div>
						<div class="card-content-number">
							{{child.children&&child.children.length}}
						</div>
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
    setModel(model){
      this.list=model;
    },
    setSearchable(searchable){
      this.searchable=searchable;
    },
    filter(item){
      if(!this.queryString||this.queryString.length==0)
        return true;
      if(!item||!item.tree_node_desc)
        return true;
      return item.tree_node_desc.toLowerCase().match(this.queryString.toLowerCase()) != null;
    },
    reveal(item){
      this.selected=item;
      this.$emit('reveal',item)
    }
  },
  computed: {
  },
  mounted(){
    window.resMgr=this;
  },
  data() {
    
    return {
      id: '0',
      list:[],
      searchable:[],
      showSearchPanel:false,
      queryString:null,
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
    position: relative;
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