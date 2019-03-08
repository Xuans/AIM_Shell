<template>
  <workbench>

    <el-row slot="rightTool">

      <version-select v-model="target.head"
                      :versions="target.versions"
                      :disabled="compareVersions.length > 0">
      </version-select>

      <el-button icon="el-icon-circle-close-outline"></el-button>

    </el-row>

    <version-compare-select slot="centerTool"
                            :head="target.head"
                            :compareVersions="compareVersions"
                            :versions="target.versions">
    </version-compare-select>

    <el-row slot="mainPage" class="sv-ctn">

      <shell-versions ref="editor" :target="target"></shell-versions>

      <shell-versions v-for="version in compareVersions" :key="version.name" :target="target.cloneByVersion(version)"></shell-versions>

    </el-row>

  </workbench>
</template>


<script>
  //import Vue from 'vue'
  import ShellVersions from '../../../editor/shell-versions.vue'
  import 'element-ui/lib/theme-chalk/index.css'
  import '../../../assets/flow-style.css'
  import '../../../assets/flow1/iconfont.css'
  import ElementUi from 'element-ui'
  import ExternalApi from '../../../plugin/externalApi'
  import workbench from '../../../components/workbench.vue'

  import VersionSelect from '../../../components/Tool/VersionSelect.vue'
  import VersionCompareSelect from '../../../components/Tool/VersionCompareSelect.vue'

  Vue.config.productionTip = false
  Vue.use(ElementUi)
  Vue.use(ExternalApi)

  export default {
    name: 'app',
    props: ['target'],
    provide: {
      parent: this
    },
    data () {
      return {
        cache: null,
        selection: null,
        compareVersions: Array.of()
      }
    },

    components: {
      VersionSelect,
      VersionCompareSelect,
      ShellVersions,
      workbench
    }
  }
</script>

<style>
.aim-shell-editor{
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom: 15px;
  overflow: hidden;
  border-radius: 6px;
  border:1px solid #efefef;
}
.aim-shell-editor section{
  border: none;
  margin:0;
}
  .sv-ctn{
    display: flex;
    flex-direction: row;
    flex-wrap:nowrap;
    flex: 1;
  }
  .sv-ctn>.aim-shell-content{
    flex: 1;
  }
</style>
