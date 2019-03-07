<template>
  <div style="position:relative;width:100%;height:100%;">
    <div class="data-base-operate-btn" ref="test">
      <div
        class="right-bottom-btn"
        data-id="left"
        @click.stop="moveBack()"
      >
        <i class="fa fa-arrow-left"></i>
        <span>后退</span>
      </div>
      <div
        class="right-bottom-btn"
        data-id="right"
        @click.stop="movePrev()"
      >
        <i class="fa fa-arrow-right"></i>
        <span>前进</span>
      </div>
      <div class="right-bottom-btn" data-id="addFile">
        <i class="el-icon-circle-plus"></i>
        <span
          @click.stop="$emit('create',currentNode,currentNodeType)"
        >新增{{currentNodeType==2?'文件':'目录'}}</span>
      </div>
      <div class="right-bottom-btn" data-id="refreshModal" @click.stop="refresh()">
        <i class="fa fa-refresh"></i>
        <span>刷新</span>
      </div>
      <div class="right-absolute">
        <div
          class="right-bottom-btn"
          style="margin-right:20px;"
          @click.stop="showDetailPanel=!showDetailPanel;showSearchPanel=false;"
        >
          <i class="el-icon-document"></i>
        </div>
        <div
          class="right-bottom-btn"
          data-id="searchModal"
          @click.stop="showSearchPanel=!showSearchPanel;showDetailPanel=false;"
        >
          <i class="el-icon-search"></i>
        </div>
      </div>
    </div>

    <div style="width:100%;height:calc(100% - 35px);display:flex;position:relative;">
      <div class="data-file-list">
        <div
          class="bi-button-group bi-card bi-vertical-layout bi-computer"
          v-for="(item,index) of list"
          :key="index"
        >
          <div class="bi-pane bi-computer-list" :data-id="item.tree_node_name">
            <div class="bi-computer-title-content">
              <div class="bi-computer-list-title-icon">
                <i class="fa fa-caret-down"></i>
              </div>
              <div class="bi-computer-list-title" data-parent="0" :data-id="item.tree_node_name">
                <div class="title-name-computer">
                  <span class="file-name">{{item.tree_node_desc}}</span>
                </div>
              </div>
            </div>
            <div class="bi-computer-card-content">
              <div
                class="bi-computer-card-item"
                @click.stop="$emit('create',item,currentNodeType)"
                data-id="addcate1"
                :data-operate="id"
              >
                <div class="card-content-text">新增{{currentNodeType==2?'文件':'目录'}}</div>
                <div class="card-content-icon">
                  <i class="el-icon-circle-plus-outline" style="color:#2ad285"></i>
                </div>
              </div>
              <div
                @dblclick.stop="doubleclick(child)"
                :key="ind"
                v-for="(child,ind) of item.children"
                :class="{'bi-computer-card-item': child.tree_node_type === '1' ? 'cate-file':'file'}"
                :data-parent="item.tree_node_name"
                :data-id="child.tree_node_name"
              >
                <div class="card-content-text">
                  <span class="file-name">{{child.tree_node_desc}}</span>
                </div>
                <div class="card-content-icon">
                  <i :class="child.tree_node_type === '1' ? 'fa fa-briefcase':'el-icon-document'"></i>
                </div>
                <div class="card-content-number">{{child.children&&child.children.length}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="data-file-search active animated fadeIn" v-show="showSearchPanel">
        <div class="search-input-content">
          <i class="fa fa-search"></i>
          <input type="text" id="searchInfoModal" v-model="queryString" placeholder="请输入关键字进行搜索">
        </div>
        <div class="data-file-content" ref="fileContent">
          <div
            @dblclick.stop="doubleclick(item)"
            v-show="filter(item)"
            v-for="(item,index) in parent.cache"
            :key="index"
            class="search-list"
            :data-type="item.tree_node_type"
            :data-name="item.tree_node_desc"
            :data-id="item.tree_node_name"
          >
            <i :class="item.tree_node_type==='1' ? 'fa fa-briefcase':'el-icon-tickets'"></i>
            <span>{{item.tree_node_desc}}</span>
          </div>
        </div>
      </div>

        <div class="data-file-detail animated fadeIn" v-show="showDetailPanel">
            <el-tabs v-model="activeTag">
              <el-tab-pane label="基本信息" name="info">基本信息</el-tab-pane>
              <el-tab-pane label="文档" name="document">文档</el-tab-pane>
              <el-tab-pane label="画像" name="second">配置管理</el-tab-pane>
            </el-tabs>
        </div>

    </div>
</div>
</template>
<script>
import iresource from "./resource";
export default {
  inject: ['parent'],
  watch:{
    'parent.selection'(s){
        this.expand(s);
    },
  },
  methods: {
    setModel(model) {
      this.expand(model);
    },
    refresh(){
      this.expand(this.parent.selection);
    }, 
    expand(s){
       if(!this.stacking){
         //存放旧list
         this.backStack.push(this.list);
         this.prevStack=[];
       }
       this.stacking=false;
       this.list = s?[s]:this.parent.treeData;

      if (this.list.length > 1) {
        //最外层
        this.currentNodeType = 1;
        this.currentNode = null;
      } else if (this.list.length == 1) {
        let t = this.list[0];

        // console.log('t.tree_p_node_name',t.tree_p_node_name);
        if (t.tree_p_node_name && t.tree_p_node_name != "") {
          //二级、三级菜单目录
          this.currentNodeType = 2;
          this.currentNode = t;
        } else {
          //根节点目录
          this.currentNodeType = 1;
          this.currentNode = t;
        }
        // console.log('currentNode',this.list,this.containier,this.currentNodeType)
      }
      this.$emit("refresh");
    },
    filter(item) {
      if (!this.queryString || this.queryString.length == 0) return true;
      if (!item || !item.tree_node_desc) return true;
      return (
        item.tree_node_desc
          .toLowerCase()
          .match(this.queryString.toLowerCase()) != null
      );
    },
    doubleclick(item) {
      // this.selected = item;
      if (item.tree_node_type == "1") {
        // this.$emit("reveal", item);
        this.parent.selection=this.getRealItem(item);
      } else this.$emit("open", item);
    },
    getRealItem(item){
      return this.parent.cache[item.tree_node_name];
    },
    moveBack() {
      let b = this.backStack.splice(-1);
        console.log('moveback',b)
      if (b.length) {
        this.stacking=true;
        this.prevStack.push(this.list);
        // this.expand(b[0]);

        console.log('moveback',b[0])
        let len=b[0].length;
        if(len==1)
          this.parent.selection=this.getRealItem(b[0][0]);
        else if(len>1)
          this.parent.selection=null;
      }
    },
    movePrev() {
      let b = this.prevStack.splice(-1);
       let l;
     if (b.length) {
        this.stacking=true;
        this.backStack.push(this.list);
        // this.expand(b[0]);
        let len=b[0].length;
        if(len==1)
          this.parent.selection=this.getRealItem(b[0][0]);
        else if(len>1)
          this.parent.selection=null;
      }
    }
  },
  computed: {},
  mounted() {
    window.resMgr = this;
  },
  data() {
    
    return {
      stacking:false,
      focusTarget:null,
      backStack: [],
      prevStack: [],
      currentNodeType: 0,
      activeTag: "info",
      id: "0",
      list: [],
      showDetailPanel: false,
      showSearchPanel: false,
      queryString: null
    };
  }
};
</script>

<style scope>
.data-file-list {
  flex: 2;
  height: 100%;
  position: relative;
  overflow: auto;
}

.data-file-detail {
  flex: 1;
  width: 350px;
  height: 100%;
  position: relative;
  box-shadow: 0 2px 8px 0 rgba(61, 77, 102, 0.15);
}
.data-file-search {
  width: 300px;
  background: #fff;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #eee;
}

.data-file-content {
  overflow: auto;
  flex: 1;
}
.search-input-content {
  width: 80%;
  border: 1px solid #eee;
  border-radius: 2em;
  margin: 0.5em auto;
  padding: 0 1em;
}

.data-base-operate-btn {
  display: flex;
  background: #ebebeb;
  color: #767676;
  line-height: 30px;
  padding-left: 10px;
}
.data-base-operate-btn > .right-bottom-btn {
  margin-right: 16px;
  cursor: pointer;
}
.data-base-operate-btn > .right-bottom-btn i {
  font-size: 1em;
  padding-right: 0.5em;
}
.data-base-operate-btn > .right-absolute {
  position: absolute;
  right: 0;
}
.data-base-operate-btn > .right-absolute > .right-bottom-btn {
  display: inline-block;
  margin: 0 1em;
  cursor: pointer;
}
.data-base-operate-btn > .right-absolute > .right-bottom-btn i {
  font-weight: 800;
}

.data-base-operate-btn .right-bottom-btn:hover {
  color: #000;
}
.data-base-right-bottom .db-tab-contents {
  height: calc(100% - 70px);
}
.data-base-right-bottom .db-tab-contents .tab-content {
}
.data-base-right-bottom .table-content-panel,
.data-base-right-bottom .db-tab-contents .tab-content {
  height: 100%;
}
.bi-button-content {
  position: relative;
  height: 100%;
}
.bi-computer {
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
.bi-card,
.bi-card .bi-input,
.bi-card .bi-textarea {
  color: #3d4d66;
}
.bi-computer-list {
  position: relative;
  margin: 0px 10px 10px;
  min-height: 25px;
}
.bi-computer-title-content {
  height: 30px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.bi-computer-title-content.active {
  background: #bbc7cc;
  color: #fff;
}
.bi-computer-title-content:hover {
  background: #f2f4f7;
  cursor: pointer;
}
.bi-computer-title-content.active:hover {
  background: #bbc7cc;
  color: #fff;
}
.bi-computer-title-content.active input {
  color: #000;
}
.bi-computer-title-content.active:hover input {
  color: #000;
}
.bi-computer-list-title-icon {
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
.bi-computer-list-title-icon > i {
  position: relative;
  flex-shrink: 0;
  margin: auto;
  width: 100%;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}
.bi-computer-list-title {
  width: 200px;
  height: 25px;
  position: relative;
  flex-shrink: 0;
  margin-left: 0px;
  margin-right: 5px;
}
.title-name-computer {
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
.bi-computer-card-content {
  position: relative;
  color: #3d4d66;
  display: flex;
  flex-wrap: wrap;
}

.search-list {
  height: 30px;
  padding: 0 10px;
  line-height: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.search-list:hover {
  box-shadow: 0 2px 8px 0 rgba(61, 77, 102, 0.15);
}
.search-list > .fa,
.search-list > .icon {
  margin-right: 10px;
}
.search-list > .fa {
  color: #faaa39;
}
.search-list > .icon {
  color: #3685f2;
}

.data-file-search input {
    width: 85%;
    font-size: 12px;
    height: 22px;
    text-indent: 10px;
    margin: 0;
    border: none;
    box-shadow: none;
}

.data-file-search input:active,
.data-file-search input:focus{
   border: none;
   box-shadow: none;
}

.bi-computer-card-content > .bi-computer-card-item {
  width: 150px;
  height: 130px;
  position: relative;
  margin-top: 10px;
  margin-right: 10px;
  border: 1px solid #fff;
  background: #f7f8fa;
  cursor: pointer;
  overflow: hidden;
}
.bi-computer-card-content > .bi-computer-card-item.active {
  background-color: #fff;
  -webkit-box-shadow: 0 2px 8px 0 rgba(61, 77, 102, 0.15);
  -moz-box-shadow: 0 2px 8px 0 rgba(61, 77, 102, 0.15);
  box-shadow: 0 2px 8px 0 rgba(61, 77, 102, 0.15);
}
.bi-computer-card-content > .bi-computer-card-item:hover {
  background-color: #fff;
  -webkit-box-shadow: 0 2px 8px 0 rgba(61, 77, 102, 0.15);
  -moz-box-shadow: 0 2px 8px 0 rgba(61, 77, 102, 0.15);
  box-shadow: 0 2px 8px 0 rgba(61, 77, 102, 0.15);
}
.card-content-text {
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
.card-content-icon {
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
.card-content-icon > i {
  color: #faaa39;
  font-size: 58px;
  margin: auto;
  position: relative;
  flex-shrink: 0;
}
.card-content-number {
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
  color: #eaf2fd;
  box-sizing: border-box;
  word-break: break-word;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>