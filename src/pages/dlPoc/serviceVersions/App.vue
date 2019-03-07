<template>
  <workbench :model="model">

    <el-row slot="rightTool">
      <el-select v-model="target.head"
                 placeholder="待发布"
                 :disabled="compareVersions.length > 0">
        <el-option
                v-for="item in target.versions"
                :key="item.name"
                :label="`v${item.name}.0`"
                :value="item.name">
        </el-option>
      </el-select>
      <el-button icon="el-icon-circle-close-outline"></el-button>
    </el-row>

    <el-row slot="centerTool">

      <el-select placeholder="版本对比" :value="null" @change="handleOfChange">
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

    <el-row slot="mainPage" class="sv-ctn">

      <shell-versions ref="editor" :target="target"></shell-versions>

      <shell-versions v-for="version in compareVersions"  :target="target.cloneByVersion(version)"></shell-versions>

    </el-row>

  </workbench>
</template>


<script>
  import Vue from 'vue'
  import ShellVersions from '../../../editor/shell-versions.vue'
  import 'element-ui/lib/theme-chalk/index.css'
  import '../../../assets/flow-style.css'
  import '../../../assets/flow1/iconfont.css'
  import ElementUi from 'element-ui'
  import ExternalApi from '../../../plugin/externalApi'
  import workbench from '../../../components/workbench.vue'

  Vue.config.productionTip = false
  Vue.use(ElementUi)
  Vue.use(ExternalApi)

  export default {
    name: 'app',
    props: ['target'],
    data: function () {
      return {
        model: {
          name: '服务编排',
          paths: [{name: 'path'}, {to: 'to'}, {me: 'me'}]
        },
        compareVersions: Array.of()
      }
    },

    computed: {
      versionsLeft () {
        return this.target.versions.filter(version => version.name !== this.target.head)
      }
    },

    methods: {
      versionForm (version) {
        return `v${version}.0`
      },
      editorHandle (action) {
        this.$refs.editor.request(action)
      },
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
      cloneTarget (version) {
        return
      }
    },

    components: {
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
