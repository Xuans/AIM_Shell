<template>
    <el-tabs v-model="activeName" type="border-card" tab-position="bottom">
        <el-tab-pane name="服务参数" label="服务参数">
            <mutil-content @close="handleOfClose">
                <service-params></service-params>
            </mutil-content>
        </el-tab-pane>
        <el-tab-pane name="日志" label="日志">
            <mutil-content @close="handleOfClose">
                <log-panel></log-panel>
            </mutil-content>
        </el-tab-pane>
        <el-tab-pane name="任务列表" label="任务列表">
            <mutil-content @close="handleOfClose"></mutil-content>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
  import MutilPanel from './MutilPanel.vue'

  export default {
    name: 'MutilPanel$0',
    extends: MutilPanel,
  }
</script>

<style scoped>

</style>
