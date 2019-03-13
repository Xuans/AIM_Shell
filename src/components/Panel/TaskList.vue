<template>
  <div style="display:flex;">
    <el-table v-loading='loading' ref="multipleTable" :data="taskData" border size="mini" stripe tooltip-effect="dark">
      <el-table-column prop="nodeId" label="所属节点" width="50"></el-table-column>
      <el-table-column prop="ename" label="英文名" width="120"></el-table-column>
      <el-table-column prop="cname" label="中文名" width="120"></el-table-column>
      <el-table-column prop="placeholder" label="占位符" width="200"></el-table-column>

      <el-table-column prop="value" label="值" width="220">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.value"
            @input="val => handleOfValue(val, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="" width="220">
        <template slot-scope="scope">
          <el-button @click="jumpTo(scope)">跳转</el-button>
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
    reload() {
      this.loading = true;
      this.$getTasks(this.store.target)
        .then(resp => {
            this.loading=false;
            console.log(resp)
        })
        .catch(error => {
            app.alert(error)
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
