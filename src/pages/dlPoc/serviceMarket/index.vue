<template>
  <div class="stm">
    <!-- 市场列表 Start -->
    <div class="scene-ctn">
      <div class="search-ctn">
        <input placeholder="搜索" v-model="searchMarketItemInput">
				<i class="fa fa-search"></i>
      </div>
      <div
        v-for="(item, itemIndex) in searchSceneMarketItems"
        :key="item.sceneClassName"
        class="scene-class-ctn"
      >
        <div class="scene-class-title" @click="toggle(itemIndex)" :class="{open:isShow[itemIndex]}">
          <i class="fa fa-angle-down"></i>
          {{item.sceneClassName}}({{item.sceneList.length}})
        </div>
        <div class="scene-class-list-ctn" v-show="isShow[itemIndex]">
          <div v-for="list in item.sceneList" :key="list.id" class="scene-class-list-ctt">
            <img class="scene-icon" v-bind:src="list.icon?list.icon:'../../img/icon.jpg'">
            <div class="scene-title-desp">
              <div v-html="list.name" class="scene-title"></div>
              <div v-html="list.desp" class="scene-desp"></div>
              <button @click="showDownloadDialog(list)">下载</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 市场列表 End -->

    <!-- 下载弹窗 Start -->
    <div v-show="isShowDownloadDialog" class="mask"></div>
    <div
      :style="'height:600px;width:450px;z-index:1070'"
      v-show="isShowDownloadDialog"
      class="modal in fade stm-add-task-modal"
      aria-hidden="false"
    >
      <div class="modal-header ui-draggable-handle">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" >×</button>
        <h4 class="ui-draggable-handle">下载服务</h4>
      </div>
      <div class="modal-body ssm-modal-body">
        <div class="stm-form stm-add-task-filter" style="position: relative;">
          <div>
            <span style="width: 100px;">选择挂载节点：&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
                <ul v-for="(cat1,cat1_index) of serviceTreeList" :key="cat1_index">
                  <li>
                    <div
                      class="ssm-tree-header noselect"
                      data-level="0"
                      :data-id="cat1[mapping['id']]"
                      :title="cat1[mapping['label']]"
                      @click="expand(cat1)"
                      :class="{selected:cat1==selectedCatelog}"
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
                              :class="{selected:cat2==selectedCatelog}"
                              data-level="1"
                              :data-p-name="cat1[mapping['label']]"
                              :data-desc="cat2.desc"
                              :data-id="cat2[mapping['id']]"
                              :title="cat2[mapping['label']]"
                              @click.stop="expand(cat2)"
                            >
                              <span @click.stop="selectionChanged(cat2)">{{cat2[mapping['id']]}}</span>
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
  app.alert("服务市场", msg, app.alertShowType.ERROR);
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
    }
  },
  data() {
    return {
      //搜索
      searchMarketItemInput: '',

      //展开
      isShow: [],

      //服务列表
      serviceMarketItems: [],

      //下载弹窗
      isShowDownloadDialog: false,

      //选中要下载的服务
      selectedService: {},

			//可以选择的服务列表树
			
			serviceTreeList: [],

			//
			searchServiceItemInput:'',
			
			expandList: {},
			
      selectedCatelog: {}
    };
  },
  computed: {
    searchSceneMarketItems: function() {
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
      return arrScene;
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
        const services = response.r.ret.sort((a, b) => b - a);

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
            id: s.service_id,
            name: s.service_ename,
            desp: s.service_desc,
            icon: "./chunk-vendors/img/icon-6.png",
            version: s.service_version
          });
        });

        list = list.filter(l => l.sceneList.length);
        this.serviceMarketItems = list;
        this.isShow = list.map(e => true);
      })
      .catch(e => showError(e));
    api
      .getTreeNodeLoop([{ tree_class: "0002", tree_node_name: "" }])
      .then(response=>{
				this.serviceTreeList=response.r.ret;
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
      this.selectedCatelog = cat2;
    },
    download() {
      api
        .downloadVersion([
          {
            sv_id: this.selectedService.id,
            tree_p_node_name: this.selectedCatelog.tree_p_node_name,
            user: window.currentUser
          }
        ])
        .then(response => {
          debuglog;
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
.scene-ctn {
  float: left;
  height: 100%;
  width: 70%;
  padding: @padding-value;
  box-sizing: border-box;
  border-radius: @border-radius;
  .search-ctn {
    position: relative;
    > i {
      position: absolute;
      top: 8px;
      left: 12px;
      color: #ccc;
    }
    input {
      width: 100%;
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
}
.scene-icon {
  float: left;
  width: 50px;
  height: 50px;
  background: @brand-color;
  border-radius: 4px;
}

.scene-title-desp {
  float: none;
  margin-left: 60px;
  font-size: 13px;
  button {
    margin-top: 5px;
    border-radius: @border-radius;
    border: @normal-border;
    background-color: #fff;
    cursor: pointer;
    + button {
      margin-left: 5px;
    }
  }
}
.scene-class-ctn {
  padding: 0 @padding-value;
  .scene-class-list-ctn {
    height: 170px;
    margin-bottom: 20px;
    padding-bottom: 30px;
    border-bottom: 1px solid #e5e5e5;
  }
  .scene-class-list-ctt {
    position: relative;
    float: left;
    width: 33.3%;
    width: ~"calc(100% / 3)";
    margin-bottom: 30px;
  }
}
.scene-store {
  position: absolute;
  width: 15px;
  height: 15px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  font-size: 16px;
  line-height: 0.8;
  background-color: #ddd;
  z-index: 0;
  cursor: pointer;
  &:after {
    position: absolute;
    content: "";
    border: 7px solid #ddd;
    top: 8px;
    left: 0;
    right: 0;
    border-color: #ddd #ddd transparent #ddd;
    z-index: -1;
  }
  i {
    display: none;
    top: -60px;
    transition: all linear 0.5s;
  }
  &.store {
    background-color: @red-color;
    &:after {
      border-color: @red-color @red-color transparent @red-color;
    }
    i {
      position: absolute;
      left: 2px;
      top: 2px;
      font-size: 12px;
      display: block;
    }
    span {
      display: none;
    }
  }
}
.scene-desp {
  color: @ctn-ctt-color;
  line-height: 2;
}
.scene-load-ctn {
  float: none;
  height: 100%;
  margin-left: 70%;
  padding: @padding-value;
  box-sizing: border-box;
  background-color: @model-ctn-bg;
  .scene-load-title {
    font-size: 16px;
    margin-bottom: @padding-value;
  }
}
.scene-load-list-ctn.ishover {
  img,
  button,
  .scene-store {
    display: block;
  }
  .scene-title-desp {
    margin-left: 60px;
  }
}

.scene-load-list-ctn.inhover {
  img,
  button,
  .scene-store {
    display: none;
  }
  .scene-title-desp {
    margin-left: 0px;
  }
}

.scene-load-list-ctn {
  position: relative;
  padding-bottom: @padding-value;
  padding-left: 20px;
  cursor: pointer;
  .top-num {
    position: absolute;
    left: 0px;
    top: 0px;
  }
  button {
    background: transparent;
    border-color: #ccc;
    color: #888;
    padding: 0 8px;
    border-radius: 2px;
  }
  img,
  button,
  .scene-store {
    display: none;
  }
  .scene-title-desp {
    margin-left: 0;
  }

  &:first-child {
  }
}
</style>
