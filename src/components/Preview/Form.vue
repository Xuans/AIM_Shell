<template>
  <el-form ref="data" label-width="80px">
    <el-form-item v-for="(item) in data" :key="item.name" v-bind:label="item.label">
      <!-- 输入框 Start -->
      <el-input
        v-on:change="change"
        v-if="getType(item.type,item.component)==='input'"
        v-model="item.value"
      ></el-input>
      <!-- 输入框 End -->
      <!-- 下拉框 Start -->
      <el-select
        v-else-if="getType(item.type,item.component)==='select'"
        v-model="item.value"
        v-on:change="change"
        placeholder="请选择"
      >
        <el-option
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        ></el-option>
      </el-select>
      <!-- 下拉框 End -->
    </el-form-item>

    <!-- <div v-for="(item) in data" :key="item.name">
      <label>{{item.label}}</label>

      输入框类型 Start--
      <input
        v-on:change="change"
        v-if="getType(item.type,item.component)==='input'"
        v-bind:value="item.value"
        type="text"
      >
      输入框类型 End--
      下拉框类型 Start--
      <select v-on:change="change" v-if="getType(item.type,item.component)==='select'">
        <option
          v-for="(opt,idx) in item.desp"
          :key="item[idx]"
          v-bind:selected="item[idx]===item.value"
        >{{opt}}</option>
      </select>
       下拉框类型 End
    </div>-->
  </el-form>
</template>


<script>
export default {
  name: "Form",
  props: {
    data: Array
  },
  methods: {
    change(...args) {
    },
    getValue(value) {
      return value === null || value === undefined || value === "" ? "" : value;
    },
    getType(type, component) {
      var type = "";

      switch (component) {
        case "input":
          type = "input";
          break;
        case "select":
          type = "select";
          break;
        default:
          break;
      }

      return type || "input";
    }
  }
};
</script>
