<template>
    <el-tabs type="border-card">
        <el-tab-pane label="服务参数">
            <service-params></service-params>
        </el-tab-pane>
        <el-tab-pane label="日志">

        </el-tab-pane>
        <el-tab-pane label="任务列表">

        </el-tab-pane>
      </el-tabs>
</template>

<script>
  import ServiceParams from './ServiceParams.vue'

  export default {
    name: 'MutilPanel',
    props: { store: Object },
    provide () {
      return {
        store: this.store
      }
    },
    components: {
      ServiceParams
    }
  }
</script>

<style scoped>

</style>
