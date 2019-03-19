<template>
  <div style="display:flex;position:relative;height:100%;">
    <!-- <div style="flex:1">
      service_args: {{store.service_args}}
      <br/>
      params: {{params}}
    </div>-->
    <el-table
      ref="multipleTable"
      height="250px"
      :data="params"
      border
      size="mini"
      stripe
      :fit="!0"
      tooltip-effect="dark"
    >
      <el-table-column prop="nodeId" label="所属节点" width="100"></el-table-column>
      <el-table-column prop="ename" label="英文名" width="120"></el-table-column>

      <el-table-column prop="placeholder" label="占位符" width="300"></el-table-column>
      <el-table-column prop="cname" label="中文名（别名）" width="220">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.cname"
            @input="val => handleOfValue(val, scope.row,'cname')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="cname" label="" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini" @click="reveal(scope.row)"
          >定位节点</el-button>
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
      this.$forceUpdate();
    }
  },
  methods: {
    handleOfValue(val, item, key) {
      this.store.service_args[item.nodeId][item.ename][key] = val;
    }
  },
  computed: {
    params() {
      let treeData = [];

      for (let nodeId in this.store.service_args) {
        let param;
        if ((param = this.store.service_args[nodeId])) {
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
