<template>
  <el-tabs v-model="activeName" type="border-card" tab-position="bottom">
    <el-tab-pane label="服务参数" name="1">
      <mutil-content @close="handleOfClose">
        <service-params></service-params>
      </mutil-content>
    </el-tab-pane>
    <el-tab-pane label="基本信息" name="2">
      <mutil-content @close="handleOfClose">
        {{this.store.active?this.store.active.get('data'):''}}
        <props-card style="margin: 10px;">
          <div style="position:relative;width:100%;height:100%;overflow:auto;padding:10px;">
            <el-row>
              <el-col :span="9">服务名称</el-col>
              <el-col :span="9">{{this.store.target.service_name}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">服务描述</el-col>
              <el-col :span="9">{{this.store.target.service_desc}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">服务名称</el-col>
              <el-col :span="9">{{this.store.target.service_ename}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">服务父节点</el-col>
              <el-col :span="9">{{this.store.target.tree_p_node_name}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">服务版本</el-col>
              <el-col :span="9">{{this.store.target.service_version}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">创建时间</el-col>
              <el-col :span="9">{{this.store.target.create_time}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">创建者</el-col>
              <el-col :span="9">{{this.store.target.create_user}}</el-col>
            </el-row>
          </div>
        </props-card>
      </mutil-content>
    </el-tab-pane>
    <el-tab-pane label="任务列表" name="3">
      <mutil-content @close="handleOfClose">
        <task-list></task-list>
      </mutil-content>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import MutilContent from "./MutilContent.vue";
import ServiceParams from "./ServiceParams.vue";
import PropsCard from "../Util/PropsCard.vue";
import TaskList from './TaskList.vue';

export default {
  name: "MutilPanel",
  props: { store: Object },
  provide() {
    return {
      store: this.store
    };
  },
  data() {
    return {
      activeName: null
    };
  },
  mounted() {
    $(this.$el)
      .children(".el-tabs__content")
      .css("padding", 0);
    $(this.$el)
      .children(".el-tabs__header")
      .css("margin-top", 0);
  },
  methods: {
    handleOfClose() {
      this.activeName = null;
    }
  },
  components: {
    ServiceParams,
    MutilContent,
    PropsCard,
    TaskList,
  }
};
</script>
