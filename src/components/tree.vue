<template>
  <div>
    <ul v-for="(cat1,cat1_index) in model.children" :key="cat1_index">
      <li>
        <div class="ssm-tree-header" data-level="0" :data-id="cat1.id" :title="cat1.name">
          {{cat1.name}}
          <i data-role="expand" class="fa fa-caret-down"></i>
        </div>
        <ul v-for="(cat2,cat2_index) in cat1.children" :key="cat2_index">
          <li>
            <div
              class="ssm-tree-header"
              data-level="1"
              :data-p-name="cat1.name"
              :data-desc="cat2.desc"
              :data-id="cat2.id"
              :title="cat2.name"
            >
              {{cat2.name}}
              <i data-role="expand" class="fa fa-caret-down"></i>
              <div class="tookit">
                <i data-role="edit" class="fa fa-edit" title="编辑"></i>
                <i data-role="del" class="fa fa-trash-o" title="删除"></i>
                <i data-role="addTask" class="fa fa-plus" title="添加服务"></i>
              </div>
            </div>
            <ul v-for="(item,item_index) in cat2.children" :key="item_index">
              <li>
                <div
                  class="ssm-tree-header"
                  data-role="item"
                  data-level="2"
                  :data-p-name="cat2.name"
                  :data-id="item.id"
                  :title="item.name"
                >{{item.name}}</div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li></li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    model: {
      default() {
        return {
          children:[],
        };
      }
    }
  },
  data() {
    return {};
  },
  methods:{
      
  },
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

.ssm-tree-list .ssm-tree-header > .tookit {
  display: none;
}

.ssm-tree-list .ssm-tree-header:hover {
  color: #1db4f5;
}

.ssm-tree-list .ssm-tree-header:hover > .tookit {
  display: inline;
}
</style>