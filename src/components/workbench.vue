<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-header>
      <el-col :span="3">
        <!-- 页面名称 -->
        {{model.name}}
      </el-col>
      <el-col :span="2">
        <!-- 页面actionBar -->
        <slot name="leftTool"></slot>
      </el-col>
      <el-col :span="5">
        <!-- 展示path用的面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(path,index) in model.paths" :key="index">{{path}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="9">
        <!-- 中心工具栏 -->
        <slot name="centerTool"></slot>
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
        <el-main>
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
            paths:['path','to','me'],
        };
      }
    }
  },
  data() {}
};
</script>
<style></style>
