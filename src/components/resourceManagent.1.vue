<template>
  <div style="position:relative;width:100%;height:100%;">
    <div style="position:relative;width:100%;height:100%;border:1px solid lightgrey;">
      <el-row :gutter="20" v-for="i of rowNum" :key="i" style="height:10rem">
        <el-col :span="24/colNum" v-for="j of colNum" :key="j" v-if="cal(i-1,j-1)" style="height:100%;">
          <iresource :mapping="mapping" :model="model.children[(i-1)*colNum+(j-1)]"></iresource>
        </el-col>
      </el-row>
    </div>
    
     <el-collapse-transition>
        <div v-if="showDetail">
        <slot name="detail"></slot>
        </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import iresource from "./resource";
export default {
  components: {
    iresource
  },
  props: {
    model: {
      default() {
        return {
          name: "资源名称",
          children: []
        };
      }
    },
    mapping:{
      default(){
        return {
          id:'id',
          label:'name',
        }
      }
    }
  },
  watch: {
        'model'(v){
            console.log(v);
            this.$forceUpdate();
        },  
  },
  methods:{
      setModel(m){
          this.model=m;
      },
      cal(i,j){
          return this.model.children[i*this.colNum+j]!=null;
      }
  },
  computed: {
    rowNum() {
      let rowNum = 0;
      if (this.model&& this.model.children) {
        let len=this.model.children.length;
         rowNum= Math.ceil(len/this.colNum)+1;
      }
      return rowNum;
    }
  },
  data() {
    return {
      colNum: 8,
      showDetail: true
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