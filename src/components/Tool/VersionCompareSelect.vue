<template>
  <el-row>
    <el-select placeholder="添加对比版本" :value="null" @change="handleOfChange">
      <el-option
        v-for="item in versionsLeft"
        :key="item.sv_id"
        :label="versionForm(item)"
        :value="item.sv_id"
      ></el-option>
    </el-select>

    <el-tag
      v-for="version in compareVersions"
      :key="version.sv_id"
      closable
      @close="() => handleOfClose(version)"
    >
      {{versionForm(version)}}
    </el-tag>
  </el-row>
</template>

<script>
export default {
  name: "VersionCompareSelect",
  /**
   * sv_id:服务标识
   * compareVersion:比较中的版本数组
   * versions:全部版本数组
   */
  props: ["sv_id", "compareVersions", "versions"],

  computed: {
    versionsLeft() {
      return this.versions.filter(version => version.sv_id !== this.sv_id);
    }
  },
  mounted() {
    window.vsc = this;
  },
  methods: {
    handleOfChange(version) {
      for (let i = 0; i < this.versionsLeft.length; i++) {
        if (this.versionsLeft[i].sv_id === version) {
          this.compareVersions.push(this.versionsLeft[i]);
          this.versionsLeft.splice(i, 1);
          break;
        }
      }
    },
    handleOfClose(version) {
      let index = this.compareVersions.indexOf(version);

      this.compareVersions.splice(index, 1);
      this.versionsLeft.push(version);
    },
    versionForm(version) {
      return version.service_version;
    }
  }
};
</script>

<style scoped>
</style>
