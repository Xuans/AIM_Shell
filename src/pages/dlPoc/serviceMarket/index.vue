<template>
  <div class="stm">
    <!-- 搜索 Start -->
    <div class="search-ctn">
      <input placeholder="搜索" v-model="searchMarketItemInput">
      <i class="fa fa-search"></i>
    </div>
    <!-- 搜索 End -->
    <!-- 市场列表 Start -->
    <div
      class="data-file-list"
      style="position: absolute;top: 60px;left: 10px;right: 10px;bottom: 10px;height: auto;"
    >
      <div
        v-for="(item, itemIndex) in searchServiceMarketItems"
        :key="item.sceneClassName"
        class="bi-button-group bi-card bi-vertical-layout bi-computer"
      >
        <div data-id class="bi-pane bi-computer-list">
          <div
            class="scene-class-title noselect"
            @click="toggle(itemIndex)"
            :class="{open:isShow[itemIndex]}"
          >
            <i class="fa fa-caret-down"></i>
            {{item.sceneClassName}}&nbsp;&nbsp;（{{item.sceneList.length}}）
          </div>
          <div class="bi-computer-card-content" v-show="isShow[itemIndex]">
            <div
              v-for="list in item.sceneList"
              :key="list.id"
              :data-parent="item.sceneClassName"
              :data-id="list.id"
              :data-sid="list.service_id"
              class="bi-computer-card-item"
              :title="'名称：'+list.name+'\n'+'描述：'+list.desp"
            >
              <!-- @click.stop="showPreview(list)" -->
              <div class="card-content-text">
                <div class="file-name">{{list.name}}</div>
                <div class="file-name" style="font-size:0.86em;color:#efefef;">{{list.desp}}</div>
              </div>
              <div class="card-content-icon">
                <i class="el-icon-document"></i>
              </div>
              <div class="card-content-number"></div>
              <div class="card-content-icon-operate">
                <i title="下载" class="fa fa-download" @click.stop="showDownloadDialog(list)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 市场列表 End -->
    <!-- 预览 Start-->
    <!-- 预览 End-->

    <!-- 下载弹窗 Start -->
    <div v-show="isShowDownloadDialog" class="mask"></div>
    <div
      :style="'z-index:1070'"
      v-show="isShowDownloadDialog"
      class="modal in fade stm-add-task-modal"
      aria-hidden="false"
    >
      <div class="modal-header ui-draggable-handle">
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-hidden="true"
          @click.stop="isShowDownloadDialog=false"
        >×</button>
        <h4 class="ui-draggable-handle">下载服务</h4>
      </div>
      <div class="modal-body ssm-modal-body">
        <div style="top: 20px;bottom: 0;height: auto;">
          <div class="stm-add-task-panel">
            <div class="stm-add-task-panel-left">
              <div class="stm-form">
                <div>
                  <span style="width:100px;">新服务英文名：</span>
                  <input
                    name="newServiceEName"
                    v-model="newServiceEName"
                    autocomplete="off"
                    class="stm-modal-add-input"
                    type="text"
                  >
                </div>
                <div>
                  <span style="width:100px;">新服务中文名：</span>
                  <input
                    name="newServiceCName"
                    v-model="newServiceCName"
                    autocomplete="off"
                    type="text"
                    class="stm-modal-add-input"
                  >
                </div>
              </div>
            </div>
            <div class="stm-add-task-panel-right">
              <div class="stm-form stm-add-task-filter">
                <div>
                  <span style="width: 100px;">挂载节点：&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <div class="stm-add-task-tree-ctn">
                    <div class="stm-search" title="搜索">
                      <input
                        data-role="ssm-service-filter-input"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入查询信息"
                        v-model="searchServiceItemInput"
                      >
                      <i class="fa fa-search"></i>
                    </div>
                    <div :class="'ssm-tree-list'">
                      <ul v-for="(cat1,cat1_index) of searchServiceTreeItems" :key="cat1_index">
                        <li>
                          <div
                            class="ssm-tree-header noselect"
                            data-level="0"
                            :data-id="cat1[mapping['id']]"
                            :title="cat1[mapping['label']]"
                            @click="expand(cat1)"
                          >
                            <span>
                              {{cat1[mapping['id']]}}
                              <i
                                data-role="expand"
                                class="fa fa-caret-down"
                                @click.stop="expand(cat1)"
                              ></i>
                            </span>
                          </div>
                          <el-collapse-transition>
                            <div v-show="isExpand(cat1)">
                              <ul v-for="(cat2,cat2_index) in cat1.children" :key="cat2_index">
                                <li>
                                  <div
                                    class="ssm-tree-header noselect"
                                    :class="{active:cat2[mapping['id']]===selectedCatelog[mapping['id']]}"
                                    data-level="1"
                                    :data-p-name="cat1[mapping['label']]"
                                    :data-desc="cat2.desc"
                                    :data-id="cat2[mapping['id']]"
                                    :title="cat2[mapping['label']]"
                                    @click.stop="expand(cat2)"
                                  >
                                    <span
                                      @click.stop="selectionChanged(cat2)"
                                    >{{cat2[mapping['id']]}}</span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </el-collapse-transition>
                        </li>
                        <li></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          class="modal-btn gray"
          data-dismiss="modal"
          @click.stop="isShowDownloadDialog=false"
        >取消</button>
        <button
          data-role="smtAddCatBtn"
          class="modal-btn blue marginL15"
          @click.stop="download()"
        >下载</button>
      </div>
    </div>
  </div>
  <!-- 下载弹窗 End -->
</template>

<script>
// import axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import { request } from "http";
import iresourceManager from "../../../components/resourceManagent";
// Vue.prototype.axios = axios;

//判断是否为生成环境
const PRODUCT_ENV = !!(window.app && window.app.dispatcher);
const api = app.shellEditorApi;

//公共方法
const formatTime = function(str) {
  var time = new Date(str);

  time.setMonth(time.getMonth());

  var week = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六"
    ],
    value = {
      year: time.getFullYear(),
      month: time.getMonth() + 1,
      date: time.getDate(),
      hour: time.getHours(),
      minute: time.getMinutes(),
      second: time.getSeconds(),
      day: week[time.getDay()],
      millisecond: time.getMilliseconds()
    };

  ["month", "date", "hour", "minute", "second"].map(function(item) {
    if ((value[item] + "").length === 1) {
      value[item] = "0" + value[item];
    }
  });

  return `${value.year}-${value.month}-${value.date}`;
};
const dateMove = function(str, move) {
  const formattedTime = `${formatTime(str)} 00:00:00`;
  return new Date(formattedTime).getTime() + move * 24 * 3600 * 1000;
};
const showError = msg => {
  const arr = msg.toString().split("Exception:");

  app.alert("服务市场", arr[arr.length - 1], app.alertShowType.ERROR);
};
const showSuccess = msg => {
  app.alert("服务市场", msg, app.alertShowType.SUCCESS);
};

export default {
  name: "sceneMarket",
  props: {
    mapping: {
      default() {
        return { id: "tree_node_name", label: "tree_node_name" };
      }
    },
    serviceMapping: {
      default() {
        return {
          id: "service_id",
          label: "desp"
        };
      }
    }
  },
  data() {
    return {
      //搜索
      searchMarketItemInput: "",

      //展开
      isShow: [],

      //服务列表
      serviceMarketItems: [],

      //下载弹窗
      isShowDownloadDialog: false,

      //选中要下载的服务
      selectedService: {},
      selectedCatelog: {},
      newServiceEName: "",
      newServiceCName: "",

      //搜索
      searchServiceItemInput: "",
      //可以选择的服务列表树
      serviceTreeList: [],
      //展开列表
      expandList: {}
    };
  },
  computed: {
    searchServiceMarketItems: function() {
      var arrScene = [];
      var items = this.serviceMarketItems;
      var search = this.searchMarketItemInput;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var searchList = {
          sceneClassName: item.sceneClassName,
          sceneList: item.sceneList.filter(
            item =>
              item.name.indexOf(search) !== -1 ||
              item.desp.indexOf(search) !== -1
          )
        };
        if (searchList.sceneList.length) arrScene.push(searchList);
      }

      this.isShow = arrScene.map(e => true);
      return arrScene;
    },
    searchServiceTreeItems: function() {
      var search = (this.searchServiceItemInput || "").trim();

      var list = this.serviceTreeList;
      var expandList = {};
      var ret;

      if (search) {
        ret = list
          .filter(s => s.children && s.children.length)
          .map(s => {
            expandList[s[this.mapping.id]] = true;
            const children =
              s[this.mapping.label].indexOf(search) !== -1
                ? s.children
                : s.children.filter(
                    c => c[this.mapping.label].indexOf(search) !== -1
                  );

            return {
              ...s,
              children
            };
          })
          .filter(s => s.children && s.children.length);
      } else {
        this.serviceTreeList.forEach(
          s => (expandList[s[this.mapping.id]] = true)
        );
        ret = this.serviceTreeList;
      }

      this.expandList = expandList;
      return ret;
    }
  },
  watch: {
    isShowDownloadDialog(val) {
      if (!val) {
        this.selectedCatelog = {};
        this.expandList = {};
        this.newServiceEName = "";
        this.newServiceCName = "";
        this.$forceUpdate();
        app.shelter.lowerZIndex();
      } else {
        app.shelter.upperZIndex();
      }
    }
  },
  mounted: function() {
    let today = formatTime(new Date().getTime());

    // publish_time: 1552648688000;
    // service_desc: "asa";
    // service_ename: "a134";
    // service_id: "5fb66b72-da8f-4885-9743-a223571c51c7";
    // service_name: "asa";
    // service_version: "v1.1";
    // sv_id: "ac457788-e12f-4bea-83b4-d566628da54e";
    //
    api
      .getVersions([{}])
      .then(response => {
        console.log("成功");
        const services = response.r.ret.sort(
          (a, b) => b.publish_time - a.publish_time
        );

        let list = ["今天", "昨天", "前天"].map((e, i) => {
          return {
            sceneClassName: e,
            time: dateMove(today, -1 * i),
            sceneList: []
          };
        });
        let cursor = 0;

        services.forEach(s => {
          let sort = list[cursor];
          while (s.publish_time < sort.time) {
            cursor++;

            if (!list[cursor]) {
              const name = formatTime(s.publish_time);
              const time = dateMove(name, 0);
              list[cursor] = {
                sceneClassName: name,
                time: time,
                sceneList: []
              };
            }
            sort = list[cursor];
          }
          sort.sceneList.push({
            id: s.sv_id,
            service_id: s.service_id,
            name: s.service_ename,
            desp: s.service_desc,
            icon: "./chunk-vendors/img/icon-6.png",
            version: s.service_version
          });
        });

        list = list.filter(l => l.sceneList.length);
        this.serviceMarketItems = list;
      })
      .catch(e => showError(e));
    api
      .getTreeNodeLoop([{ tree_class: "0002", tree_node_name: "" }])
      .then(response => {
        this.serviceTreeList = response.r.ret;
        console.log(response);
      })
      .catch(e => showError(e));
    // api.downloadVersion([{sv_id:'',tree_p_node_name:'',user:window.currentUser}]).then(response=>{
    // 	debuglog;
    // });
  },
  methods: {
    toggle: function(itemIndex) {
      this.isShow[itemIndex] = !this.isShow[itemIndex];
      this.$forceUpdate();
    },
    showPreview(service) {
      app.domain.exports("serviceDebugPage", service);
      app.dispatcher.load({
        title: "服务-" + service[this.serviceMapping.label],
        moduleId: "dlPoc",
        section: "serviceDebugPage",
        id: service[this.serviceMapping.id]
      });
    },
    showDownloadDialog: function(service) {
      this.isShowDownloadDialog = true;
      this.selectedService = service;
    },
    expand(category) {
      this.expandList[category[this.mapping.id]] = !this.expandList[
        category[this.mapping.id]
      ];
      this.$forceUpdate();
    },
    isExpand(category) {
      return this.expandList[category[this.mapping.id]];
    },
    selectionChanged(cat2) {
      console.log(cat2);
      this.selectedCatelog = cat2;
    },
    download() {
      api
        .downloadVersion([
          {
            cname: this.newServiceCName,
            ename: this.newServiceEName,
            sv_id: this.selectedService.id,
            tree_p_node_name: this.selectedCatelog.tree_node_name,
            user: window.currentUser
          }
        ])
        .then(response => {
          if (response.r) {
            this.isShowDownloadDialog = false;
            showSuccess("下载成功！");
          }
        })
        .catch(error => {
          showError(error);
          console.log(error);
        });
    }
  }
};
</script>

<style lang="less">
@import "../../../less/variables.less";

.scene-class-title {
  margin-bottom: 10px;
  line-height: 2.5;
  font-size: 16px;
  cursor: pointer;
  > i {
    margin-right: 8px;
    color: #888;
  }
  &.open {
    i {
      transform: rotate(180deg);
    }
  }
}

.search-ctn {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;

  > i {
    position: absolute;
    top: 8px;
    left: 12px;
    color: #ccc;
  }
  input {
    width: ~"calc(100% - 45px)";
    height: 30px;
    margin-bottom: 10px;
    padding: 0 10px 0 30px;
    border-radius: 30px;
    border: @normal-border;
    &:focus,
    &:active {
      outline: none;
      border-color: #ccc;
      box-shadow: 0 0 5px #ccc;
    }
  }
}
</style>