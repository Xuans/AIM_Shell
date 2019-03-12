<template>
    <el-tabs v-model="activeName" type="border-card" tab-position="bottom">
        <el-tab-pane label="服务参数" name="1">
            <mutil-content @close="handleOfClose"><service-params></service-params></mutil-content>
        </el-tab-pane>

        <el-tab-pane label="日志" name="2">
            <mutil-content @close="handleOfClose"><log-panel></log-panel></mutil-content>
        </el-tab-pane>
        <el-tab-pane label="任务列表" name="3">
            <mutil-content @close="handleOfClose"></mutil-content>
        </el-tab-pane>
      </el-tabs>
</template>

<script>
  import MutilContent from './MutilContent.vue'
  import ServiceParams from './ServiceParams.vue'
  import LogPanel from './LogPanel.vue'

  export default {
    name: 'MutilPanel',
    props: { store: Object },
    provide () {
      return {
        store: this.store
      }
    },
    data () {
      return {
        activeName: null
      }
    },
    mounted(){
      $(this.$el).children('.el-tabs__content').css('padding', 0)
      $(this.$el).children('.el-tabs__header').css('margin-top', 0)
    },
    methods: {
      handleOfClose () {
        this.activeName = null
      },
    },
    components: {
      LogPanel,
      ServiceParams,
      MutilContent
    }
  }
</script>
