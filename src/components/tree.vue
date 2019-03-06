<template>
<div>
  <div v-loading="loading"  v-if="model" v-loading="model&&model.length==0" >
    <ul v-for="(cat1,cat1_index) of model" :key="cat1_index">
      <li>
        <div
          class="ssm-tree-header noselect"
          data-level="0"
          :data-id="cat1[mapping['id']]"
          :title="cat1[mapping['label']]"
          @dblclick.stop="expand(cat1)"
          @click.stop="reveal(cat1)"
           :class="{selected:cat1==selectedItem}"
        >
          {{cat1[mapping['label']]}}
          <i
            data-role="expand"
            class="fa fa-caret-down"
            @click.stop="expand(cat1)"
          ></i>
           <div class="tookit">
                    <i data-role="edit" class="fa fa-edit" title="编辑" @click="edit(cat1,1)"></i>
                    <i data-role="del" class="fa fa-trash-o" title="删除" @click="del(cat1,1)"></i>
                    <i data-role="addTask" class="fa fa-plus" title="添加分类" @click="create(cat1,1)"></i>
          </div>
        </div>
        <el-collapse-transition>
          <div v-show="cat1.expanded">
            <ul v-for="(cat2,cat2_index) in cat1.children" :key="cat2_index">
              <li >
                <div
                  class="ssm-tree-header noselect"
                  :class="{selected:cat2==selectedItem}"
                  data-level="1"
                  :data-p-name="cat1[mapping['label']]"
                  :data-desc="cat2.desc"
                  :data-id="cat2[mapping['id']]"
                  :title="cat2[mapping['label']]"
                  @dblclick.stop="expand(cat2)"
                  @click.stop="reveal(cat2)"
                >
                  {{cat2[mapping['label']]}}
                  <i
                    class="fa fa-caret-down"
                    @click.stop="expand(cat2)"
                  ></i>
                  <div class="tookit">
                    <i data-role="edit" class="fa fa-edit" title="编辑" @click="edit(cat2,1)"></i>
                    <i data-role="del" class="fa fa-trash-o" title="删除" @click="del(cat2,1)"></i>
                    <i data-role="addTask" class="fa fa-plus" title="添加服务" @click="create(cat2,2)"></i>
                  </div>
                </div>
                <el-collapse-transition>
                  <div v-show="cat2.expanded">
                    <ul v-for="(item,item_index) in cat2.children" :key="item_index">
                      <li >
                        <div
                         :class="{selected:item==selectedItem}"
                          class="ssm-tree-header"
                          data-role="item"
                          data-level="2"
                          :data-p-name="cat2[mapping['label']]"
                          :data-id="item[mapping['id']]"
                          :title="item[mapping['label']]"
                          @click.stop="reveal(item)"
                        >{{item[mapping['label']]}}
                        
                                          <div class="tookit">
                        <i data-role="del" class="fa fa-trash-o" title="删除" @click="del(item,2)"></i>
                        </div>
                      </div>

                      </li>
                    </ul>
                  </div>
                </el-collapse-transition>
              </li>
            </ul>
          </div>
        </el-collapse-transition>
      </li>
      <li></li>
    </ul>
  </div>
  <div v-else class="noselect">
    没有内容
  </div>
  </div>
</template>
<script>
export default {
  props: {
    mapping:{
      default(){
        return{id:'id',
        label:'name',}
      },
    },
    model: {
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      loading:false,
      selectedItem:null,
    };
  },
  methods: {
    setLoading(loading){
        this.loading=loading;
    },
    create(item,level){
      this.$emit('create',item,level);
    },
    edit(item,level){
      this.$emit('edit',item,level);
    },
    del(item){
      this.$emit('delete',item,()=>{
              this.$forceUpdate();
            });
    },
    setModel(m){
      console.log('tree: ',m);
      this.model=m;
      this.$forceUpdate();
    },
    reveal(selection) {
      this.$emit("reveal", selection);
      this.selectedItem=selection;
    },
    expand(category){
      if(category.expanded==null){
        category.expanded=false;
      }
      category.expanded=!category.expanded;
        this.$forceUpdate();
    }
  }
};
</script>

<style >
.ssm-tree-list {
  flex: 1;
  overflow: auto;
  margin-top: 0.5em;
}

.ssm-tree-list > ul {
  padding: 0;
  margin: 0;
}

.ssm-tree-list ul {
  padding: 0;
  margin: 0 1em;
}

.ssm-tree-list .ssm-tree-header {
  line-height: 1.5;
}

.ssm-tree-list .ssm-tree-header > .fa-caret-up,
.ssm-tree-list .ssm-tree-header > .fa-caret-down {
  font-size: 1.5em;
}

.ssm-tree-list .ssm-tree-header .fa {
  padding: 0 3px;
  font-size: 1em;
}


.ssm-tree-list .ssm-tree-header:hover {
  color: #1db4f5;
}
.tookit {
  display: inline;
}
.selected{
  background:lightblue;
}
</style>