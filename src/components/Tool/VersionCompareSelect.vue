<template>
    <el-row>
        <el-select placeholder="添加版本对比" :value="null" @change="handleOfChange">
            <el-option v-for="item in versionsLeft"
                       :key="item.name"
                       :label="versionForm(item.name)"
                       :value="item.name">
            </el-option>
        </el-select>

        <el-tag v-for="version in compareVersions"
                :key="version.name"
                closable
                @close="() => handleOfClose(version)">
            {{versionForm(version.name)}}
        </el-tag>
    </el-row>
</template>

<script>
  export default {
    name: 'VersionCompareSelect',
    props: ['head', 'compareVersions', 'versions'],

    computed: {
      versionsLeft () {
        return this.versions.filter(version => version.name !== this.head)
      }
    },

    methods: {
      handleOfChange (versionName) {
        for (let i = 0; i < this.versionsLeft.length; i++) {
          if (this.versionsLeft[i].name === versionName) {
            this.compareVersions.push(this.versionsLeft[i])
            this.versionsLeft.splice(i, 1)
            break
          }
        }
      },
      handleOfClose (version) {
        let index = this.compareVersions.indexOf(version)

        this.compareVersions.splice(index, 1)
        this.versionsLeft.push(version)
      },
      versionForm (version) {
        return `v${version}.0`
      }
    }
  }
</script>

<style scoped>

</style>
