<template>
    <el-tabs value="first" type="card" style="width: 100%">
        <el-tab-pane label="脚本参数配置" name="first">
            <props-card header="脚本参数配置" style="margin: 10px;">
                <el-table
                        v-if="store.active"
                        ref="multipleTable"
                        :data="tableData"
                        border
                        size="mini"
                        stripe
                        tooltip-effect="dark"
                        style="width: 100%">
                    <el-table-column
                            prop="name"
                            label="名称"
                            fixed="left"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="value"
                            label="值">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.writable" size="mini" v-model="scope.row.value" @input="val => handleOfValue(val, scope.row)"></el-input>
                            <span v-else>{{scope.row.value}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="对外暴露"
                            width="100">
                        <template slot-scope="scope">
                            <el-checkbox v-if="scope.row.exposure" v-model="scope.row.isExposure" @change="val => handleOfExposure(val, scope.row)"></el-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
            </props-card>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
  import PropsCard from '../Util/PropsCard.vue'

  export default {
    name: 'ShellFlowPanel',
    props: ['store'],
    computed: {
      tableData () {
        let data = []

        let input, item, id
        if (input = this.store.activeInput) {

          id = this.store.activeId
          for (let option of this.scriptField) {
            item = {
              id: id,
              name: option.name,
              writable: option.writable,
              exposure: option.exposure,
              key: option.key
            }

            item.value = Reflect.has(input, option.key) ? input[option.key] : option.default()

            if (option.exposure) {
              item.isExposure = this.store.checkExposure(id, option.key)
            }

            data.push(item)
          }
        }

        return data
      }
    },

    methods: {
      handleOfValue (val, item) {
        this.store.setValueToActive(item.key, val)
      },
      handleOfExposure (value, item) {
        value ? this.store.addServiceParams(item.id, item.key, item.name) : this.store.removeServiceParams(item.id, item.key)
      }
    },

    components: {
      PropsCard
    }

  }
</script>

<style scoped>

</style>
