<template>
  <div class="config-form-ctn">
    <div style="text-align:right;">
      <el-button size="mini" icon="el-icon-plus" circle v-on:click="add"></el-button>
    </div>
    <el-collapse accordion>
      <el-collapse-item v-for="(item) in data" :key="item.uid">
        <template slot="title" class="config-list-header">
          <div class="form-line">
            <label class="form-name" :for="item.name">{{item.label}}</label>
            <div class="form-toollit">
              <el-select :class="'form-type'" v-model="item.type">
                <el-option
                  v-for="cpt in components"
                  :key="cpt.value"
                  :label="cpt.label"
                  :value="cpt.value"
                ></el-option>
              </el-select>
              <el-button size="mini" icon="el-icon-delete" circle v-on:click="()=>{del(item.uid)}"></el-button>
            </div>
          </div>
        </template>
        <div>
          <objct v-if="item.type==='object'" :item="item"/>
          <string_input
            v-else-if="item.type==='string_input'||item.type==='string_array'||item.type==='slider'"
            :item="item"
          />
          <string_select
            v-else-if="item.type==='string_select'"
            :item="item"
          />
          <number_input
            v-else-if="item.type==='number_input'"
            :item="item"
          />
          <bool
            v-else-if="item.type==='boolean'"
            :item="item"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import uid from "uid";
import { debug, debuglog } from "util";
import objct from "./objct.vue";
import string_input from "./string_input.vue";
import string_select from "./string_select.vue";
import number_input from "./number_input.vue";
import bool from "./bool.vue";

let cursor = 0;

export default {
  name: "ConfigForm",
  props: {
    data: Array
  },
  data: function() {
    return {
      components: [
        {
          label: "输入框",
          value: "string_input"
        },
        {
          label: "字符串数组",
          value: "string_array"
        },
        {
          label: "数值滑块",
          value: "slider"
        },
        {
          label: "数值输入框",
          value: "number_input"
        },
        {
          label: "下拉框",
          value: "string_select"
        },
        {
          label: "布尔值",
          value: "boolean"
        },
        {
          label: "对象",
          value: "object"
        }
      ],
      list: [""]
    };
  },
  methods: {
    add() {
      debugger;
      const acc = ++cursor;
      this.data.push({
        label: "中文名" + acc,
        name: "EN_NAME" + acc,
        uid: uid(48),
        type: "string_input",
        value: "",
        children: [],
        option: []
      });
    },
    del(uid) {
      const idx = this.data.findIndex(e => e.uid === uid);

      this.data.splice(idx, 1);
    },
    delOption(uid, value) {}
  },
  components: {
    objct,
    string_input,
    string_select,
    number_input,
    bool
  }
};
</script>
<style lang="less">
.config-form-ctn {
  .form-line {
    width: 100%;

    > .form-name {
      font-weight: 600;

      &::after {
        content: attr(for);
        color: #aaa;
        padding: 0.5em;
      }
    }
  }

  .form-toollit {
    float: right;

    > .form-type {
      width: 8em;

      .el-input__inner {
        border: none;
      }
    }

    > .el-button {
      border: none;
    }
  }
}
</style>



