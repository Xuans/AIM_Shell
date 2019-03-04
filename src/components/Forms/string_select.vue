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

    <div class="config-form-ctn">
      <div>
        选项
        <div class="form-toollit">
          <el-button size="mini" icon="el-icon-plus" circle v-on:click="add"></el-button>
        </div>
      </div>
      <el-collapse accordion>
        <el-collapse-item v-for="(item) in option" :key="item.uid">
          <template slot="title" class="config-list-header">
            <div class="form-line">
              <label class="form-name" :for="item.name">{{item.label}}</label>
              <div class="form-toollit">
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  v-on:click="()=>{del(item.uid)}"
                ></el-button>
              </div>
            </div>
          </template>
          <div>
            <el-form-item label="中文名">
              <el-input v-model="item.label"></el-input>
            </el-form-item>
            <el-form-item label="值">
              <el-input v-model="item.value"></el-input>
            </el-form-item>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <el-form-item label="是否必填">
      <el-switch style="display: block" v-model="required" active-text="必填" inactive-text="选填"></el-switch>
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
let cursor = 0;
import uid from "uid";

export default {
  name: "objct",
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
    option:{
      set(n){
        this.item.option=n;
      },
      get(){
        return this.item.option;
      }
    }
  },
  props: [
    "item"
  ],
  data() {
    return {};
  },
  methods: {
    add() {
      const acc = ++cursor;
      this.option.push({
        label: "中文名" + acc,
        value: "EN_NAME" + acc,
        uid: uid(48)
      });
    },
    del(uid) {
      const idx = this.data.findIndex(e => e.uid === uid);

      this.data.splice(idx, 1);
    }
  }
};
</script>

<style lang="less"></style>
