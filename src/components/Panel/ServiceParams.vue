<template>
  <div style="display:flex;">
    <!-- <div style="flex:1">
      service_params: {{store.service_params}}
      <br/>
      params: {{params}}
    </div> -->
    <el-table ref="multipleTable" :data="params" border size="mini" stripe tooltip-effect="dark">
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
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ServiceParams",
  inject: ["store"],
  watch: {
    "store.modified"() {
      console.log("modified");
      this.$forceUpdate();
    }
  },
  methods: {
    handleOfValue(val, item) {
      this.store.service_params[item.nodeId][item.ename].value = val;
    }
  },
  computed: {
    params() {
      console.log("params computed",this.store.service_params);
      let treeData = [];

      for (let nodeId in this.store.service_params) {
        let param;
        if ((param = this.store.service_params[nodeId])) {
          for (let p in param) {
            let item = {
              ...param[p],
              nodeId
            };
            treeData.push(item);
          }
        }
      }

      return treeData;
    }
  }
};
</script>

<style scoped>
</style>
