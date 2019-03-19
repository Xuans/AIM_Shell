<template>
  <iworkbench @reveal="reveal" :model="serviceConfig" :mapping="serviceMapping">
    <div slot="leftPage" class="stm-left-ctn">
      <div class="stm-header">
        <span>服务列表</span>
        <div class="stm-tookit" style="float: right">
          <span data-role="btn" @click="createItem" title="新增分类">
            <i class="fa fa-plus"></i> 新增分类
          </span>
        </div>
      </div>
      <itree
        ref="tree"
        @refresh="refreshBreadCrumb"
        @open="openFile"
        @delete="deleteItem"
        @create="createItem"
        @edit="editCategory"
        :mapping="serviceMapping"
      ></itree>
    </div>
    <div slot="centerPage" style="position:relative;width:100%;height:100%;">
      <el-col :span="24" style="height:100%;">
        <iresourceManager
          @refresh="refreshBreadCrumb"
          @open="openFile"
          @create="createItem"
          @getResourceInfo='getResourceInfo'
          ref="resourceManager"
          :mapping="serviceMapping"
        ></iresourceManager>
      </el-col>
    </div>
    <!-- <div slot="leftTool">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="createItem"></el-button>
    </div>-->
    <div v-show="showCreateDialog" class="mask"></div>
    <div
      ref="createItemDialog"
      data-role="ssmAddCatModal"
      style="z-index:1070"
      v-show="showCreateDialog"
      class="modal in fade ws-add-modal"
      aria-hidden="false"
    >
      <div class="modal-header ui-draggable-handle">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 class="ui-draggable-handle">新增/编辑服务{{newNode[serviceMapping.type]=='1'?'分类':''}}</h4>
      </div>
      <div class="modal-body ssm-modal-body">
        <div class="stm-form">
          <div>
            <span>服务{{newNode[serviceMapping.type]=='1'?'分类':''}}名称：</span>
            <input
              name="serviceCatName"
              v-model="newNode[serviceMapping.id]"
              class="ssm-modal-add-input"
              type="text"
              placeholder="此处输入服务分类名称"
              style="flex: 1; position: relative; top: -1px"
            >
          </div>
          <div>
            <span>服务{{newNode[serviceMapping.type]=='1'?'分类':''}}描述：</span>
            <textarea
              name="serviceCatDesc"
              class="ssm-modal-add-texta"
              v-model="newNode[serviceMapping.label]"
              placeholder="此处输入服务分类描述，200字以内"
              style="flex: 1; position: relative; top: -1px"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-btn gray" data-dismiss="modal" @click.stop="showCreateDialog=false">取消</button>
        <button
          data-role="smtAddCatBtn"
          class="modal-btn blue marginL15"
          @click.stop="doCreate($event)"
        >完成</button>
      </div>
    </div>
  </iworkbench>
</template>

<script>
//import Vue from "vue";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import iworkbench from "../../../components/workbench";
import itree from "../../../components/tree";
import ExternalApi from "../../../plugin/externalApi";
import iresourceManager from "../../../components/resourceManagent";

const methods = global.app.shellEditorApi;

Vue.prototype.axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(ExternalApi);

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
  provide() {
    return {
      parent: this
    };
  },
  data() {
    let _self = this;
    return {
      _ctype: 0,
      newNode: {},
      serviceConfig: {
        name: "服务管理",
        resetBreadCrumb: function(selection, callback) {
          let paths = [];
          if (selection) {
            let target = selection;
            let pNode;
            paths = [target];
            while ((pNode = _self.cache[target.tree_p_node_name])) {
              paths.push(pNode);
              target = pNode;
            }
          }
          callback(paths.reverse());
        }
      },
      cache: {},
      selection: {},
      ready: false,
      showCreateDialog: false,
      serviceMapping: {
        type: "tree_node_type",
        id: "tree_node_name",
        label: "tree_node_desc"
      },
      treeData: []
    };
  },

  components: {
    iworkbench,
    itree,
    iresourceManager
  },
  watch: {
    selection() {}
  },
  methods: {
    /**
     * 获取详情信息
     */
    getResourceInfo(item,callback){
      if(item.tree_node_type=='1'){
        callback({
          ...item
        });
      }else{
        this.$getServiceInstance({
          service_ename:item.tree_node_name
        }).then(resp=>{
          callback(resp);
        }).catch(
          e=>app.alert('错误提示',e && e.message||e,app.alertShowType.ERROR)
        );
      }
    },
    openFile(item) {
      app.domain.exports("serviceItem", {
        data: JSON.parse(JSON.stringify(item))
      });

      app.dispatcher.load({
        title: "服务-" + item[this.serviceMapping.id],
        moduleId: "dlPoc",
        section: "serviceDesign",
        id: item[this.serviceMapping.id]
      });
    },
    createItem(selection, level = "1") {
      let pName = selection ? selection[this.serviceMapping.id] : "";
      this.newNode = {
        tree_p_node_name: pName,
        tree_class: "0002",
        tree_node_desc: null,
        tree_node_name: null,
        tree_node_type: level,
        tree_node_table: "shell_conf_service"
      };
      let $el = $(this.$refs.createItemDialog);
      this._ctype = 0;
      this.showAddCatModal({ $el });
    },
    deleteItem(item) {
      let name = item[this.serviceMapping.id];
      let desc = item[this.serviceMapping.label];
      let _self = this;
      app.confirm({
        title: "删除指定元素",
        content: `删除指定元素${desc}?`,
        confirmHandler: function() {
          _self.$delTreeNode(
              {
                tree_class: "0002",
                tree_node_name: name,
                loop: true
              }
            )
            .then(response => {
              // if (response && response.content.result.data.r.ret === true) {
                app.alert('删除成功',`删除(${desc})成功！`,app.alertShowType.SUCCESS);

                _self.refreshTree(false);
            })
            .catch(e => {
              app.alert('错误提示',e && e.message||e,app.alertShowType.ERROR);
              console.error(e);
            });
          return false;
        }
      });
    },
    editCategory(selection) {
      this.newNode = JSON.parse(JSON.stringify(selection));
      this.$forceUpdate();
      let $el = $(this.$refs.createItemDialog);
      this._ctype = 1;
      this.showAddCatModal({ $el });
    },
    doCreate(event) {
      if (this._ctype) {
        //修改tree节点
        
        if(this.newNode.tree_node_type=='1'){
          this.$updateTreeNode(this.newNode)
            .then(response => {
              this.refreshTree(false);
              this.showCreateDialog = false;
            })
            .catch(e => {
              app.alert('错误提示',e && e.message||e,app.alertShowType.ERROR);
            });
        }else{

        }
      } else {
        let promise;
        if(this.newNode.tree_node_type=='1'){
          promise=this.$addTreeNode(this.newNode);
        }else
        //添加tree节点
          promise=this.$addServiceByTreeNode(this.newNode);
          promise .then(response => {
            this.refreshTree(false);
            this.showCreateDialog = false;
          })
        .catch(e => {
        app.alert('错误提示',e && e.message||e,app.alertShowType.ERROR);
        });
      }
    },

    refreshTree(forceReload = true) {
      //重新加载树结构
      this.loading = true;
      this
        .$getServiceInstanceTree()
        .then(data => {
          // this.$refs.tree.setModel(data);
          // this.$refs.resourceManager.setModel(data);
          console.log('刷新树节点',this.treeData,data);
          this.treeData = data;
          

          this.buildIndex(data);
          this.loading = false;

          if (this.selection) {
            this.selection = this.cache[this.selection[this.serviceMapping.id]];
          } else this.selection = null;
          this.$forceUpdate();
          // this.$refs.resourceManager.setSearchable(this.cache);
        })
        .catch(e => {
          console.error(e);
          app.alert('错误提示',e && e.message||e,app.alertShowType.ERROR);
          this.loading = false;
        });
    },
    /**
     * 构建索引
     */
    buildIndex(data) {
      // console.log('buildIndex',data)
      if (data)
        for (let v of data) {
          this.cache[v[this.serviceMapping.id]] = v;
          if (v.children) this.buildIndex(v.children);
        }
    },
    showAddCatModal({ $el }) {
      this.showCreateDialog = true;
      //修改模式下，名称只读,_ctype 0创建 1修改
      $('[name="serviceCatName"]', $el)[this._ctype ? "attr" : "removeAttr"](
        "disabled",
        "disabled"
      );
    }
    // reveal(target){
    //   if(target){
    //     this.selection=target;
    //     this.$refs.resourceManager.setModel([this.selection]);
    //   }else{
    //     this.selection=null;
    //      this.$refs.resourceManager.setModel(this.$refs.tree.model);
    //   }
  },
  mounted() {
    window.ss = this;
    this.axios
      .get(URL.GET_FORM)
      .then(response => {
        const input = response.data.input;
        const output = response.data.output;

        this.$data.input = input;
        this.$data.output = output;
      })
      .catch(e => {
         app.alert('错误提示',e && e.message||e,app.alertShowType.ERROR);
        console.error(e);
      });

    this.refreshTree();
  }
};
</script>

<style lang="less">
/* 容器 Start */
.stm {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 15px;
  background: white;
  overflow: auto;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}
</style>
