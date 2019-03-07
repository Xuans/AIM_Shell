<template>
    <div ref="logPanel"
         class="ui-widget-content"
         style="position:fixed;bottom:5%;right:5%;width:80%;height:300px;box-shadow:0 0 5px gray;">
        <div style="position:relative;height:20px;width:100%;">
            <!-- <span
                        style="position:absolute;right:5px;top:-2px;"
                        @click="((showLogBtn=true) && (showLogPanel=false))"
            >x</span>-->
        </div>
        <div style="width:40%;float:left;height:calc(100% - 20px)">
            <div style="padding:0 10px 0 10px;height:50px;width:100%;">
                <span style="font-size:.8rem">选择任务：</span>
                <el-autocomplete
                        v-model="task"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="查看任务日志"
                        @select="taskChanged"
                        size="mini"
                        value="name"
                ></el-autocomplete>
            </div>
            <el-table :data="logs" @row-click="handleSelect" height="calc(100% - 50px)">
                <el-table-column prop="time" label="日期" width="180"></el-table-column>
                <el-table-column prop="duration" label="耗时(ms)" width="180"></el-table-column>
                <el-table-column prop="result" label="结果"></el-table-column>
            </el-table>
        </div>
        <div
                style="width:60%;height:calc(100% - 20px);float:right;background:black;color:white;font-size:.8rem;overflow-y:scroll;"
        >
            <div :key="i" v-for="(node,i) in currentLog.progress" style="padding:4px 4px;">
                >节点: {{i}} 耗时:
                <span
                        :style="{color:node.duration>36000?'red':node.duration>10000?'yellow':'green'}"
                >{{timeFormat(node)}}</span>
                <br>
                <span :style="{color: node.result?'green':'red'}">{{node.log}}</span>
            </div>
        </div>
    </div>
</template>

<script>
  import debuggerRunner from '../../util/scriptDebugger'

  export default {
    name: 'LogPanel',

    inject: ['store'],

    data () {
      return {
        logs: this.$getLogs(this.store.target),
        showLogPanel: false,
        showLogBtn: true,
        currentLog: {},
        task: ''
      }
    },

    methods: {
      taskChanged (item) {
        this.target.inputId = item.inputId
      },
      timeFormat (node) {
        return this.$convertTimeFormat(node.duration)
      },
      querySearchAsync (queryString, cb) {
        let restaurants = this.$getTasks()
        let results = queryString
            ? restaurants.filter(this.createStateFilter(queryString))
            : restaurants

        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cb(results)
        }, 1000 * Math.random())
      },
      createStateFilter (queryString) {
        return ({ value, inputId }) => {
          return (
              value.toLowerCase().indexOf(queryString.toLowerCase()) === 0 &&
              inputId != this.target.inputId
          )
        }
      },
      handleSelect (row, event, column) {
        console.log(this.store.activeEditor.rootEditPart)
        let editor = this.store.activeEditor
        if (editor) {
          let root = editor.rootEditPart
          this.currentLog = row
          const json = { data: {}, start: 1 }
          editor.store.node().each(record => {
            json.data[record.id] = record.data
          })
          debuggerRunner.start(root, json, row)
        }
      }
    }
  }
</script>

<style lang="less">
    .aim-shell-content {
        position: absolute;
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

