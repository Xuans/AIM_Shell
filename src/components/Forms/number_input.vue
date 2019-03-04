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
      <el-switch style="display: block" v-model="value" active-text="是" inactive-text="否"></el-switch>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch style="display: block" v-model="required" active-text="必填" inactive-text="选填"></el-switch>
    </el-form-item>
    <el-form-item label="最小值">
      <el-input-number v-model="min"  label="最小值"></el-input-number>
    </el-form-item>
    <el-form-item label="最大值">
      <el-input-number v-model="max"  label="最大值"></el-input-number>
    </el-form-item>
    <el-form-item label="提示">
      <el-input v-model="placeholder" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="文档链接">
      <el-input v-model="link" type="textarea"></el-input>
    </el-form-item>
  </el-form>
</template>


<script>
export default {
  name: "number_input",
  props:[
    'item'
  ],
  computed:{
    name:{
      set(n){
        this.item.name=n;
      },
      get(){
        return this.item.name;
      }
    },
    alias:{
      set(n){
        this.item.alias=n;
      },
      get(){
        return this.item.alias;
      }
    },
    label:{
      set(n){
        this.item.label=n;
      },
      get(){
        return this.item.label;
      }
    },
    
    value:{
      set(n){
        this.item.value=n;
      },
      get(){
        return this.item.value;
      }
    },

    required:{
      set(n){
        this.item.required=n;
      },
      get(){
        return this.item.required;
      }
    },

    min:{
      set(n){
        this.item.min=n;
      },
      get(){
        return this.item.min;
      }
    },

    max:{
      set(n){
        this.item.max=n;
      },
      get(){
        return this.item.max;
      }
    },
    placeholder:{
      set(n){
        this.item.placeholder=n;
      },
      get(){
        return this.item.placeholder;
      }
    },
    link:{
      set(n){
        this.item.link=n;
      },
      get(){
        return this.item.link;
      }
    },
  },
  data() {
    return {};
  }
};
</script>

<style lang="less"></style>
