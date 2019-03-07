<template>
    <el-select v-model="head"
               placeholder="待发布"
               @change="handleOfChange"
               :disabled="disabled">
        <el-option
                v-for="item in versions"
                :key="item.name"
                :label="formatter(item)"
                :value="item.name">
        </el-option>
    </el-select>
</template>

<script>
  export default {
    name: 'VersionSelect',
    props: {
      disabled: Boolean,
      value: {},
      versions: Array,
      formatter: {
        type: Function,
        default (item) {
          return `v${item.name}.0`
        }
      }
    },
    data () {
      return {
        head: this.value
      }
    },
    methods: {
      handleOfChange (value) {
        this.$emit('input', value)
      }
    }
  }
</script>

<style scoped>

</style>
