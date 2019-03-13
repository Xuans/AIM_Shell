<template>
  <div :class="'stm-left-warp'">
    <div :class="'ssm-tree-list'" v-loading="parent.loading">
      <ul v-for="(cat1,cat1_index) of model" :key="cat1_index">
        <li>
          <div
            class="ssm-tree-header noselect"
            data-level="0"
            :data-id="cat1[mapping['id']]"
            :title="cat1[mapping['label']]"
            @dblclick.stop="expand(cat1)"
            :class="{selected:cat1==selectedItem}"
          >
            <span  @click.stop="selectionChanged(cat1)">
              {{cat1[mapping['label']]}}
              <i
                data-role="expand"
                class="fa fa-caret-down"
                @click.stop="expand(cat1)"
              ></i>
            </span>
            <div class="tookit">
              <i data-role="edit" class="fa fa-edit" title="编辑" @click="edit(cat1,1)"></i>
              <i data-role="del" class="fa fa-trash-o" title="删除" @click="del(cat1,1)"></i>
              <i data-role="addTask" class="fa fa-plus" title="添加分类" @click="create(cat1,1)"></i>
            </div>
          </div>
          <el-collapse-transition>
            <div v-show="isExpand(cat1)">
              <ul v-for="(cat2,cat2_index) in cat1.children" :key="cat2_index">
                <li>
                  <div
                    class="ssm-tree-header noselect"
                    :class="{selected:cat2==selectedItem}"
                    data-level="1"
                    :data-p-name="cat1[mapping['label']]"
                    :data-desc="cat2.desc"
                    :data-id="cat2[mapping['id']]"
                    :title="cat2[mapping['label']]"
                    @dblclick.stop="expand(cat2)"
                  >
                    <span 
                    @click.stop="selectionChanged(cat2)">
                    {{cat2[mapping['label']]}}
                    <i
                      class="fa fa-caret-down"
                      @click.stop="expand(cat2)"
                    ></i>
                    </span>
                    <div class="tookit">
                      <i data-role="edit" class="fa fa-edit" title="编辑" @click="edit(cat2,1)"></i>
                      <i data-role="del" class="fa fa-trash-o" title="删除" @click="del(cat2,1)"></i>
                      <i
                        data-role="addTask"
                        class="fa fa-plus"
                        title="添加服务"
                        @click="create(cat2,2)"
                      ></i>
                    </div>
                  </div>
                  <el-collapse-transition>
                    <div v-show="isExpand(cat2)">
                      <ul v-for="(item,item_index) in cat2.children" :key="item_index">
                        <li>
                          <div
                            :class="{selected:item==selectedItem}"
                            class="ssm-tree-header"
                            data-role="item"
                            data-level="2"
                            :data-p-name="cat2[mapping['label']]"
                            :data-id="item[mapping['id']]"
                            :title="item[mapping['label']]"
                            @dblclick.stop="open(item)"
                          >
                            <span>{{item[mapping['label']]}}</span>
                            <div class="tookit">
                              <i
                                data-role="del"
                                class="fa fa-trash-o"
                                title="删除"
                                @click="del(item,2)"
                              ></i>
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
    <div v-else class="noselect">没有内容</div>
  </div>
</template>
<script>
export default {
  inject: ['parent'],
  props: {
    mapping: {
      default() {
        return { id: "id", label: "name" };
      }
    },
    model: {
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      expandList:{},
      selectedItem: null
    };
  },
  watch:{
    'parent.treeData'(data){
      console.log('tree数据发生修改',data);
      this.model=data;
    },
  },
  methods: {
    open(item){
      this.$emit('open',item);
    },
    create(item, level) {
      this.$emit("create", item, level);
    },
    edit(item, level) {
      this.$emit("edit", item, level);
    },
    del(item) {
      this.$emit("delete", item, () => {
        this.$forceUpdate();
      });
    },
    // setModel(m) {
    //   console.log("tree: ", m);
    //   this.model = m;
    //   this.$forceUpdate();
    // },
    selectionChanged(selection) {
      // this.$emit("reveal", selection);
      // this.selectedItem = selection;

      this.parent.selection=selection;
      this.$emit("refresh");
    },
    expand(category) {
      // if (category.expanded == null) {
      //   category.expanded = false;
      // }
      // category.expanded = !category.expanded;
      this.expandList[category[this.mapping.id]]=!this.expandList[category[this.mapping.id]];
      this.$forceUpdate();
    },
    isExpand(category){
      return this.expandList[category[this.mapping.id]];
    },
  }
};
</script>

<style >
</style>