<template>
    <shell-flow ref="shell-flow"
                :target="target"
                :maximize="true"
                :make-state="makeState">

        <template slot="panels" slot-scope="{store}">
            <mutil-panel :store="store"></mutil-panel>
        </template>

    </shell-flow>
</template>
<script type="text/javascript">
  import shellFlow from './shell-flow.vue'
  import mutilPanel from '../components/Panel/MutilPanel$0.vue'
  import makeState from './state/versions-state'

  export default {
    name: 'shell-design',

    props: ['target'],

    computed: {
      makeState () { // for no reactive
        return makeState
      }
    },
    mounted(){
    },

    components: {
      mutilPanel,
      shellFlow
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