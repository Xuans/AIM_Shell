<template>
    <el-tabs v-model="activeName" type="border-card" tab-position="bottom" class="MutiPanel">
        <el-tab-pane name="服务参数" label="服务参数">
            <mutil-content @close="handleOfClose">
                <service-params></service-params>
            </mutil-content>
        </el-tab-pane>
        <el-tab-pane label="基本信息" name="2">
        <mutil-content @close="handleOfClose">
            <service-info :data="store.target"></service-info>
        </mutil-content>
        </el-tab-pane>
        <el-tab-pane name="任务列表" label="任务列表">
            <mutil-content @close="handleOfClose">
                  <task-list></task-list>
            </mutil-content>
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
