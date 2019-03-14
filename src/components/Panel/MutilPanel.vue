<template>
  <el-tabs v-model="activeName" type="border-card" tab-position="bottom">
    <el-tab-pane label="服务参数" name="1">
      <mutil-content @close="handleOfClose">
        <service-params></service-params>
      </mutil-content>
    </el-tab-pane>
    <el-tab-pane label="基本信息" name="2">
      <mutil-content @close="handleOfClose">
        <service-info :data="store.target"></service-info>
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
import ServiceInfo from './ServiceInfo.vue'

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
    ServiceInfo,
  }
};
</script>
