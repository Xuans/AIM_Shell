<template>
    <el-table
            ref="multipleTable"
            :data="params"
            border
            size="mini"
            stripe
            tooltip-effect="dark">
        <el-table-column
                prop="name"
                label="脚本"
                width="120">
        </el-table-column>
        <el-table-column
                prop="key"
                label="参数"
                width="120">
        </el-table-column>
        <el-table-column
                prop="alias"
                label="别名"
                width="120">
        </el-table-column>
    </el-table>
</template>

<script>
  export default {
    name: "ServiceParams",
    inject: ['store'],

    computed: {
      params() {
        return this.store.serviceParams
      }
    }
  }
</script>

<style scoped>

</style>