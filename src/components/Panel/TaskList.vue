<template>
  <div>
    <el-row>
      <el-button @click="reload()" size="mini">刷新</el-button>
    </el-row>
    <el-table v-loading='loading' ref="multipleTable" :data="taskData" border size="mini" stripe tooltip-effect="dark">
      <el-table-column prop="instance_ename" label="任务名" width="120"></el-table-column>
      <el-table-column prop="instance_name" label="任务描述" width="120"></el-table-column>
      <el-table-column prop="job_timeout" label="超时时间" width="120"></el-table-column>
      <el-table-column prop="value" label="" width="220">
        <template slot-scope="scope">
          <el-button size='mini' @click="jumpTo(scope.row)">查看任务</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TaskList",
  inject: ["store"],
  methods: {},
  data() {
    return {
      tasks: [],
      loading: false
    };
  },
  mounted() {
    this.reload();
  },
  methods: {
    jumpTo(task){
      app.domain.exports("shell", {
              shell_ename: task.instance_name
            });

            app.dispatcher.load({
              title: "任务定义",
              moduleId: "dlPoc",
              section: "shellTaskMangement",
              id: task.instance_ename
            });
    },
    reload() {
      this.loading = true;
      this.$getTasks(this.store.target)
        .then(resp => {
            this.loading=false;
            this.tasks=resp.r.ret;
        })
        .catch(e => {
            app.alert('错误提示',e && e.message||e,app.alertShowType.ERROR);
        });
    }
  },
  computed: {
    taskData() {
      return this.tasks;
    }
  }
};
</script>

<style scoped>
</style>
