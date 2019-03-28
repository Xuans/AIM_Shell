<template>
  <div>
    <el-row>
      <el-button @click="reload()" size="mini">刷新</el-button>
    </el-row>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="taskData"
      border
      size="mini"
      stripe
      tooltip-effect="dark"
      height='250px'
    >
      <el-table-column prop="instance_ename" label="任务名" width="120"></el-table-column>
      <el-table-column prop="instance_name" label="任务描述" width="320"></el-table-column>
      <el-table-column prop="job_timeout" label="超时时间" width="120"></el-table-column>
      <el-table-column prop="service_version" label="服务版本" fixed='right'></el-table-column>
      <el-table-column prop="value" fixed='right'>
        <template slot-scope="scope">
          <a href="#">
            <p @click.stop="jumpTo(scope.row)">执行记录</p>
          </a>
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
    jumpTo(task) {
      // app.domain.exports("shell", {
      //   shell_ename: task.instance_name
      // });

      // app.dispatcher.load({
      //   title: "任务定义",
      //   moduleId: "dlPoc",
      //   section: "shellTaskMangement",
      //   id: task.instance_ename
      // });
      app.domain.exports("shellLogDetails", {
        task: {
          instance_name: task.instance_name + "试运行",
          instance_id: task.instance_id
        },
        service: {
          service_id: task.service_id,
          service_name: task.service_name,
          service_version: task.service_versoin
        }
      });
      //debugger;
      app.dispatcher.load({
        title: `任务执行记录`,
        moduleId: "dlPoc",
        section: "shellLogDetails",
        id: task.instance_id
      });
    },
    reload() {
      this.loading = true;
      this.$getTasks(this.store.target)
        .then(resp => {
          this.loading = false;
          this.tasks = resp.r.ret;
        })
        .catch(e => {
          app.alert("错误提示", (e && e.message) || e, app.alertShowType.ERROR);
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
