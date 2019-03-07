<template>
  <div data-widget-type="aweb4MGirdValue" class="grid-value">
    <div class="gv-frame" :style="boxPadding">
      <div v-for="(v,index1) in row" class="gv-panel">
        <p v-if="v.row_title" :style="rowTitle" class="gv-row-title">{{v.row_title}}</p>
        <ul class="gv-row">
          <li v-if="v.row_pic!='none'" class="gv-row-pic" :style="boxWidth">
            <div class="gv-row-picBox">
              <i v-if="v.row_pic=='icon'" :class="v.row_icon" :style="rowIcon"></i>
              <img v-if="v.row_pic=='img'" :src="v.row_picture">
              <p :style="rowTitle">{{v.pic_title}}</p>
            </div>
          </li>
          <li
            v-for="(item, index2) in v.elements"
            class="gv-col"
            :style="colBgcolor"
            @click="getItem(item,v,index2)"
            :class="{'gv-horizontal':item.mode == 'horizontal'}"
          >
            <div
              class="gv-col-ctn"
              :class="item.addClass"
              :style="item.bgColorCss"
              v-if="item.mode == 'vertical'"
            >
              <div class="gv-col-pic" v-if="item.pic != 'none'">
                <i v-if="item.icon" :class="item.icon" :style="colIcon"></i>
                <img v-if="item.picture" :src="item.picture" :style="colPicture">
              </div>
              <div class="gv-col-text-ctn">
                <div v-if="item.edmKey" :style="[colTitle,item.titleColorCss]" class="gv-col-title">
                  {{item.edmKey}}{{test}}
                  <p v-if="item.detail" :style="colDetail" class="gv-col-detail">{{item.detail}}</p>
                </div>
                <p
                  v-if="item.edmKey"
                  class="gv-col-text"
                  :style="[text,item.textColorCss]"
                >{{viewData[v.colKeys[index2]]}}</p>
              </div>
            </div>
            <div
              class="gv-col-ctn"
              :class="item.addClass"
              :style="item.bgColorCss"
              v-if="item.mode == 'horizontal'"
            >
              <div class="gv-col-pic" v-if="item.pic != 'none'">
                <i v-if="item.icon" :class="item.icon" :style="colIcon"></i>
                <img v-if="item.picture" :src="item.picture" :style="colPicture">
              </div>

              <div v-if="item.edmKey" :style="[colTitle,item.titleColorCss]" class="gv-col-title">
                {{item.edmKey}}{{test}}
                <p v-if="item.detail" :style="colDetail" class="gv-col-detail">{{item.detail}}</p>
              </div>

              <p
                v-if="item.edmKey"
                class="gv-col-text gv-col-text"
                :style="[text,item.textColorCss]"
              >{{viewData[v.colKeys[index2]]}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
      return {
          row:[]
      }
  },
  created: function() {
    var i, col;

    for (i = 0; i < this.row.length; i++) {
      col = this.row[i].col;
      this.row[i].elements = col.elements;
      this.row[i].colFields = col.fields;
      this.row[i].colKeys = col.keys;
    }
  },
  mounted: function() {},
  watch: {},
  methods: {
    getItem(item, v, index2) {
      this.data = {
        item: item.edmKey,
        content: this.viewData[v.colKeys[index2]]
      };
    }
  },
  computed: {
    test: function() {}
  }
};
</script>


<style lang="less">
.grid-value {
  background-color: #fff;
  p {
    margin: 0;
  }
  .gv-frame {
    padding: 6px;
    .gv-panel {
      margin-top: 6px;
      &:first-child {
        margin-top: 0px;
      }
      .gv-row-title {
        font-size: 1.16em;
        border-bottom: 1px solid #e8e8e8;
        padding-bottom: 0.2em;
        margin-bottom: 0.2em;
      }
      .gv-row {
        margin: 0;
        min-height: 30px;
        width: 100%;
        margin-left: 0;
        display: flex;
        .gv-row-pic {
          box-sizing: border-box;
          padding: 0.2em 0.3em;
          text-align: center;
          flex: 1;
          .gv-row-picBox {
            padding: 0.8em 0;
            border-radius: 4px;
            > img {
              height: 3.5em;
            }
            > i {
              position: relative;
              top: 50%;
              font-size: 1.8em;
            }
            > p {
              font-size: 1em;
            }
          }
        }
        .gv-col-title {
          font-size: 1em;
          font-weight: bold;

          .gv-col-detail {
            color: #a6a6a6;
            font-size: 0.8em;
          }
        }
        .gv-col-text-ctn {
          float: left;
          padding-left: 1em;

          .gv-col-text {
            font-size: 2.5em;
            color: #89898a;
          }
        }
        .gv-col {
          box-sizing: border-box;
          padding: 0.1em 0.09em;
          flex: 1;
          color: #4d4d4d;
          margin-left: 6px;
          &:first-child {
            margin-left: 0;
          }
          .gv-col-ctn {
            position: relative;
            overflow: hidden;
            padding: 0.8em 0;
            background-color: #f7f7f7;
            border-radius: 4px;
            .gv-col-pic {
              float: left;
              overflow: hidden;
              padding-left: 1em;
              > i {
                position: relative;
                font-size: 38px;
                line-height: 60px;
              }
              > img {
                height: 3.5em;
                padding-top: 0.9em;
              }
            }
          }
        }
        .gv-horizontal {
          .gv-col-ctn {
            display: flex;
            > .gv-col-pic {
            }
            > .gv-col-title {
              flex: 1;
              line-height: 60px;
              padding-left: 14px;
              font-size: 14px;
            }
            > .gv-col-text {
              flex: 1;
              padding-right: 14px;
              text-align: right;
              font-size: 2.5em;
              color: #89898a;
              line-height: 60px;
            }
          }
        }
      }
    }
  }
}
</style>
