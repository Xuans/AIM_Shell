<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-header height="2rem">
      <el-col :span="2" @click.stop="reveal()">
        <!-- 页面名称 -->
        {{model.name}}
      </el-col>
      <el-col :span="1">
        <!-- 页面actionBar -->
        <slot name="leftTool"></slot>
      </el-col>
      <el-col :span="7">
        <!-- 展示path用的面包屑 -->
        <div class="ibreadcrumb" style="width:100%;height:100%;">
            <span  :key="index">
                <span @click.stop="reveal()">{{model.name}}</span>
                <i class="el-icon-arrow-right" v-if=" model.paths&& model.paths.length>0"></i>
            </span>
            <span  v-for="(path,index) in model.paths"  :key="index">
                <span @click.stop="reveal(path)">{{path[mapping.label]}}</span>
                <i class="el-icon-arrow-right" v-if="index<model.paths.length-1"></i>
            </span>
        </div>
      </el-col>
      <el-col :span="9">
        <!-- 中心工具栏 -->
        <slot name="centerTool">

        </slot>
      </el-col>
      <el-col :span="5">
        <!-- 右侧工具栏 -->
        <slot name="rightTool"></slot>
      </el-col>
    </el-header>
    <el-container>
      <!-- 主页内容 -->
      <slot name="mainPage">
        <el-aside width="200px">
          <slot name="leftPage"></slot>
        </el-aside>
        <el-main style="padding:0 0;">
          <slot name="centerPage"></slot>
        </el-main>
      </slot>
    </el-container>
  </el-container>
</template>
<script>
/**
 * slot列表：
 * leftTool, 偏左侧的工具栏，宽度2
 * centerTool,中央工具栏，宽度9
 * rightTool,右侧工具栏，宽度5
 *
 * mainPage，页面主要内容
 * leftPage，页面左侧内容，使用mainPage后失效
 *  centerPage，页面中间内容，使用mainPage后失效
 */
export default {
  props: {
    model: {
      default() {
        return {
            name:'页面名称',
            paths:[],
        };
      }
    },
    mapping:{
       default(){
           return {
                id:'tree_node_name',
            label:'tree_node_desc',
           }
       }
      },
  },
  data() {},
  methods:{
      calPath(index){
          this.model.paths.splice(index+1);
          return this.model.paths.reverse();
      },
      reveal(selected){
          //点击面包屑时的跳转
          this.$emit('reveal',selected);
      }
  },
};
</script>
<style></style>
