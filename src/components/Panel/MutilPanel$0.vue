<template>
    <el-tabs type="border-card">
        <el-tab-pane label="服务参数">
            <service-params></service-params>
        </el-tab-pane>
        <el-tab-pane label="日志">
            <log-panel></log-panel>
        </el-tab-pane>
        <el-tab-pane label="任务列表">

        </el-tab-pane>
    </el-tabs>
</template>

<script>
  import ServiceParams from './ServiceParams.vue'
  import LogPanel from './LogPanel.vue'

  export default {
    name: 'MutilPanel$0',
    props: { store: Object },
    provide () {
      return {
        store: this.store
      }
    },
    components: {
      LogPanel,
      ServiceParams
    }
  }
</script>

<style scoped>

</style>
