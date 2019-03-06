<template>
  <div>
    <iworkbench :model="servceModel" :mapping="serviceMapping" >
      <div slot="leftPage" style="position:relative;width:100%;height:100%;">
        <itree ref="tree" @delete="deleteItem" @create="createItem" @edit="editCategory" :mapping="serviceMapping"  @select="selectChanged"></itree>
      </div>
      <div slot="centerPage" style="position:relative;width:100%;height:100%;">
        <el-col :span="17" style="height:100%;">
          <iresourceManager ref='resourceManager' :model="selected" :mapping="serviceMapping"></iresourceManager>
        </el-col>
        <el-col :span="7" style="height:100%;">详情</el-col>
      </div>
       <div slot="leftTool">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="createItem"></el-button>
       </div>
    </iworkbench>


  <div v-show='showCreateDialog' class="mask"></div>
	<div ref="createItemDialog" data-role="ssmAddCatModal" style="z-index:1070" v-show='showCreateDialog' class="modal in fade ws-add-modal" aria-hidden="false">
		<div class="modal-header ui-draggable-handle">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			<h4 class="ui-draggable-handle">新增/编辑服务{{newNode[serviceMapping.type]=='1'?'分类':''}}</h4>
		</div>
		<div class="modal-body ssm-modal-body">
			<div>
				<span>服务{{newNode[serviceMapping.type]=='1'?'分类':''}}名称：</span><input name="serviceCatName" v-model="newNode[serviceMapping.id]" class="ssm-modal-add-input" type="text"
					placeholder="此处输入服务分类名称" style="flex: 1; position: relative; top: -1px">
			</div>
			<div>
				<span>服务{{newNode[serviceMapping.type]=='1'?'分类':''}}描述：</span>
				<textarea name="serviceCatDesc" class="ssm-modal-add-texta" v-model="newNode[serviceMapping.label]" placeholder="此处输入服务分类描述，200字以内"
					style="flex: 1; position: relative; top: -1px"></textarea>
			</div>
		</div>
		<div class="modal-footer">
			<button class="modal-btn gray" data-dismiss="modal" @click.stop="showCreateDialog=false">取消</button>
			<button data-role="smtAddCatBtn" class="modal-btn blue marginL15" @click.stop="doCreate($event)">完成</button>
		</div>
	</div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import iworkbench from "../../../components/workbench";
import itree from "../../../components/tree";
import iresourceManager from '../../../components/resourceManagent';
import api from '../../../../public/fakeSerivce/serverApi.js';


const methods = global.app.shellEditorApi;

Vue.prototype.axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);

//判断是否为生成环境
const PRODUCT_ENV = !!(window.app && window.app.dispatcher);

const URL = PRODUCT_ENV
  ? {
      GET_FORM: "./fakeData/dlPoc/form.json"
    }
  : {
      GET_FORM: "../../fakeData/dlPoc/form.json"
    };

export default {
  name: "app",
  data: function() {
    return {
      _ctype:0,
      newNode:{},
      servceModel: {
        name: "服务管理",
        paths:[],
      },
      selected:{
        children:[],
      },
      showCreateDialog:false,
      serviceMapping:{
        type:'tree_node_type',
        id:'tree_node_name',
        label:'tree_node_desc',
      },
      treeData: null,
    };
  },
  components: {
    iworkbench,
    itree,
    iresourceManager,
  },
  methods: {
    createItem(selected,level='1'){
    let pName=selected?selected[this.serviceMapping.id]:'';
      this.newNode={
        "tree_p_node_name":pName,
        "tree_class":"0002",
         "tree_node_desc":null,
         "tree_node_name":null,
         "tree_node_type":level,
         "tree_node_table":"shell_conf_service",
      }
      let $el=$(this.$refs.createItemDialog);
      this._ctype=0;
      this.showAddCatModal({$el});
    },
    deleteItem(item){
      let name=item[this.serviceMapping.id];
      let desc=item[this.serviceMapping.label];
      let _self=this;
        	app.confirm({
							title: '删除指定元素',
							content: `删除指定元素${desc}?`,
							confirmHandler: function () {
								methods.delTreeNode([{
									"tree_class": "0002",
									"tree_node_name":name,
									"loop": true
								}])
									.then(response => {
										if (response && response.content.result.data.r.ret === true) {
											app.alert(`删除(${desc})成功！`);

											_self.refreshTree();
										} else {
											console.error(response.content.result.hdead.errorMessage);
										}
									})
									.fail(error => {
										console.error(error.message);
									});
								return false;
							}
						});
    },
    editCategory(selected){
      this.newNode=JSON.parse(JSON.stringify(selected));
      this.$forceUpdate();
      let $el=$(this.$refs.createItemDialog);
      this._ctype=1;
      this.showAddCatModal({$el});
    },
    doCreate(event){
        if(this._ctype){
          //修改tree节点
          methods.updateTreeNode([this.newNode])
					.then(response => {
            this.refreshTree();
            this.showCreateDialog=false;
					})
					.fail(error => {
            console.error(error)
					});
        }else{
          //添加tree节点
          methods.addTreeNode([this.newNode])
						.then(response => {
              console.log('创建节点成功');
               this.refreshTree();
               this.showCreateDialog=false;
						})
						.fail(error => {
            console.error(error)
						});

        }
    },
    
    refreshTree(){
      //重新加载树结构 
      this.$refs.tree.setLoading(true);
        api.getServiceInstanceTree().then(data=>{
            console.log('serivce tree',data);
            this.$refs.tree.setModel(data);
              this.$refs.tree.setLoading(false);
        }).catch(()=>{
            this.$refs.tree.setLoading(false);
        });
    },
    showAddCatModal ({$el}){
        this.showCreateDialog=true;
				//修改模式下，名称只读,_ctype 0创建 1修改
				$('[name="serviceCatName"]', $el)
        [ this._ctype ? 'attr' : 'removeAttr']('disabled', 'disabled');

			},
    selectChanged(selection,type){
      this.selected=selection[0];
      this.$refs.resourceManager.setModel(this.selected);
      this.servceModel.paths=selection.reverse();
      if(type){

      }else{

      }
    }
  },
  mounted() {
    window.ss=this;
    this.axios
      .get(URL.GET_FORM)
      .then(response => {
        const input = response.data.input;
        const output = response.data.output;

        this.$data.input = input;
        this.$data.output = output;
      })
      .catch(err => {
        console.error(err);
      });
    
    
     this.refreshTree();
  }
};
</script>

<style lang="less">
.example {
  color: green;
}
</style>
