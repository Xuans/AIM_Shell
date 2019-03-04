<template>
  <el-form>
    <el-form-item label="名称">
      <el-input v-model="name"></el-input>
    </el-form-item>
    <el-form-item label="别名">
      <el-input v-model="alias"></el-input>
    </el-form-item>
    <el-form-item label="中文名">
      <el-input v-model="label"></el-input>
    </el-form-item>
    <el-form-item label="默认值">
      <el-input type="textarea" v-model="value"></el-input>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch style="display: block" v-model="required" active-text="必填" inactive-text="选填"></el-switch>
    </el-form-item>
    <el-form-item label="最大长度">
      <el-input v-model="length"></el-input>
    </el-form-item>
    <el-form-item label="提示">
      <el-input v-model="placeholder" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="文档链接">
      <el-input v-model="link" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="正则表达式">
      <el-input v-model="regex" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="错误提示">
      <el-input v-model="errorMsg" type="textarea"></el-input>
    </el-form-item>
  </el-form>
</template>


<script>
export default {
  name: "objct",
  props: ["item"],
  computed: {
    name: {
      set(n) {
        this.item.name = n;
      },
      get() {
        return this.item.name;
      }
    },
    alias: {
      set(n) {
        this.item.alias = n;
      },
      get() {
        return this.item.alias;
      }
    },
    label: {
      set(n) {
        this.item.label = n;
      },
      get() {
        return this.item.label;
      }
    },

    value: {
      set(n) {
        this.item.value = n;
      },
      get() {
        const value = this.item.value;
        if (
          value === "" ||
          value === "undefined" ||
          value === undefined ||
          value === null
        ) {
          return "";
        } else if (Array.isArray(value)) {
          return value.join("\n");
        } else {
          return value;
        }
      }
    },

    required: {
      set(n) {
        this.item.required = n;
      },
      get() {
        return this.item.required;
      }
    },

    length: {
      set(n) {
        this.item.length = n;
      },
      get() {
        return this.item.length;
      }
    },
    placeholder: {
      set(n) {
        this.item.placeholder = n;
      },
      get() {
        return this.item.placeholder;
      }
    },
    link: {
      set(n) {
        this.item.link = n;
      },
      get() {
        return this.item.link;
      }
    },
    regex: {
      set(n) {
        this.item.regex = n;
      },
      get() {
        return this.item.regex;
      }
    },

    errorMsg: {
      set(n) {
        this.item.errorMsg = n;
      },
      get() {
        return this.item.errorMsg;
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less"></style>
