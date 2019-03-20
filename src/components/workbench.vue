<template>
  <div class="stm">
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-header height="2rem">
      <el-col :span="5">
        <el-col :span="12" @click.stop="reveal()">
          <!-- 页面名称 -->
          {{model.name}}
        </el-col>
        <el-col :span="12">
          <!-- 页面actionBar -->
          <slot name="leftTool"></slot>
        </el-col>
      </el-col>
      <el-col :span="5">
        <!-- 展示path用的面包屑 -->
        <div class="ibreadcrumb" style="width:100%;height:100%;overflow:auto;">
            <span  :key="index">
                <span @click.stop="reveal()">Root</span>
                <i class="el-icon-arrow-right" v-if=" paths&& paths.length>0"></i>
            </span>
            <span  v-for="(path,index) in paths"  :key="index">
                <span @click.stop="reveal(path)">{{path[mapping.id]}}</span>
                <i class="el-icon-arrow-right" v-if="index<paths.length-1"></i>
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
        <el-aside>
          <slot name="leftPage"></slot>
        </el-aside>
        <el-main>
          <slot name="centerPage"></slot>
        </el-main>
      </slot>
    </el-container>
  </el-container>
  <slot></slot>
  </div>
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
  inject: ['parent'],
  data(){
    return {
      paths:[]
    }
  },
  props: {
    model: {
      default() {
        return {
            name:'页面名称',
            resetBreadCrumb(){

            },
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
  watch:{
    'parent.selection'(selection){
      this.model.resetBreadCrumb(selection,(p)=>{
        this.paths=p;
        this.$forceUpdate();
      });
    }
  },
  mounted(){
    console.log('workbench mounted')
  },
  //data() {},
  methods:{
      calPath(index){
          this.paths.splice(index+1);
          return this.paths.reverse();
      },
      reveal(selected){
          //点击面包屑时的跳转
        this.parent.selection=selected;
      }
  },
};
</script>
<style></style>
