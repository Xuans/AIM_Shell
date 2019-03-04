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
    <ConfigForm v-bind:data="children"></ConfigForm>
  </el-form>
</template>


<script>
export default {
  name: "objct",
  props: [
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
    children:{
      set(n){
        this.item.children=n;
      },
      get(){
        return this.item.children;
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less">
</style>


