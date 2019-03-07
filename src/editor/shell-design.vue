<template>
    <div class="aim-shell-content">

        <shell-flow ref="shell-flow"
                    :target="target"
                    :maximize="target.lastest ? maximize : true"
                    @selection-change="handleOfSelectionChange"
                    @selection-remove="handleOfSelectionRemove">
            <mutil-panel slot="panels" :store="store"></mutil-panel>

            <dblf-transition
                    slot="canvass"
                    ref="transition"
                    :visible="visible"
                    :expand.sync="expand"
                    @click-control="handleOfExpand"
                    @click-back="handleOfCollapse"
                    @editor-open="handleOfOpening">
                <slot name="form" :store="store"></slot>
            </dblf-transition>

        </shell-flow>

        <!--<dblf-transition
                ref="transition"
                :visible="visible"
                :expand.sync="expand"
                @click-control="handleOfExpand"
                @click-back="handleOfCollapse"
                @editor-open="handleOfOpening">
            <slot name="form" :store="store"></slot>
        </dblf-transition>-->

    </div>
</template>
<script type="text/javascript">
  import dblfTransition from './transition.vue'
  import shellFlow from './shell-flow.vue'
  import mutilPanel from '../components/Panel/MutilPanel.vue'

  import abbreviate from './mixins/abbreviate'

  export default {
    name: 'shell-design',

    props: ['target'],

    mixins: [abbreviate],

    mounted () {
      this.store = this.$refs['shell-flow'].store
    },

    data () {
      return {
        store: null,
        expand: false,
        visible: false,
        maximize: false
      }
    },

    methods: {
      handleOfSelectionChange () {
        this.visible = this.expand || this.store.active != null
        this.expand && this.handleOfExpand()
      },

      handleOfSelectionRemove () {
        this.$refs.transition.$once('editor-closed', () => {
          // this.store.active = null
          if (!this.store.active) throw Error()
        })
      },

      handleOfExpand () {
        if (this.store.active) {
          this.expand = this.visible = true
          this.maximize = true
        }
      },

      handleOfCollapse () {
        this.expand = false
        this.visible = this.store.active != null
        this.maximize = false
        this.abbreviateWhenClose(this.store.activeEditor)
      },
      handleOfSwitch () {
        if (this.visible) {
          this.expand ? this.handleOfCollapse() : this.handleOfExpand()
        }
      },
      handleOfOpening (el) {
        this.abbreviateWhenOpen(this.store.activeEditor, this.store.active, el)
      },
      request (action) {
        this.store[action]()
      }
    },

    components: {
      shellFlow,
      mutilPanel,
      dblfTransition
    }
  }
</script>
<style lang="less">
    .aim-shell-content {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100% !important;
        width: 100% !important;
        overflow: auto;
        display: flex;
        flex-direction: column;

        > .aim-shell-header {
            background-color: #fafafa;
            border-bottom: 1px solid #e5e5e5;
            height: 44px;
            line-height: 44px;
            padding-left: 20px;
            font-size: 14px;
            margin: 0;
            border-top-right-radius: 6px;
            border-top-left-radius: 6px;

            > .tookit {
                float: right;

                > [data-role="btn"] {
                    background-color: #13b1f5;
                    color: #fff;
                    margin: 0 5px;
                    cursor: pointer;
                    padding: 0.25em 0.5em;

                    > i {
                        font-size: 12px;
                        margin-right: 5px;
                    }
                }
            }
        }
    }

    .aim-shell-content .el-aside .el-transfer-panel {
        border: none;
    }
    .aim-shell-content .el-aside .el-input {
        height: 28px;
        align-items: center;
        border: 1px solid #dadada;
        border-radius: 4px;
        margin: 5px auto;
        display: flex;
        flex-direction: row;
        width: calc(100% - 2px);
    }
    .aim-shell-content .el-aside .el-input input {
        border: none;
        box-shadow: none;
        font-size: 12px;
        margin: 0;
        flex: 1;
        height: 100%;
    }
    .aim-shell-content .el-aside .el-input span {
        font-size: 14px;
        margin-right: 10px;
        color: #9b9b9b;
        position: relative;
        top: -6px;
    }
    .aim-shell-content .el-transfer-panel + .el-transfer-panel {
        border-top: 1px solid #e5e5e5;
        border-radius: 0;
        margin-top: -5px;
        padding-top: 5px;
    }
</style>

