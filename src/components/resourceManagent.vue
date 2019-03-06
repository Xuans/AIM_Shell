<template>
  <div style="position:relative;width:100%;height:100%;">
    <div style="position:relative;width:100%;height:100%;border:1px solid lightgrey;">
      <el-row :gutter="20" v-for="i of rowNum" :key="i" style="height:10rem">
        <el-col :span="24/colNum" v-for="j of colNum" :key="j" v-if="cal(i-1,j-1)" style="height:100%;">
          <iresource :model="model.children[(i-1)*colNum+(j-1)]"></iresource>
        </el-col>
      </el-row>
    </div>
    
     <el-collapse-transition>
        <div v-if="showDetail">
        <slot name="detail"></slot>
        </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import iresource from "./resource";
export default {
  components: {
    iresource
  },
  props: {
    model: {
      default() {
        return {
          name: "资源名称",
          children: []
        };
      }
    }
  },
  watch: {
        'model'(v){
            console.log(v);
            this.$forceUpdate();
        },  
  },
  methods:{
      setModel(m){
          this.model=m;
      },
      cal(i,j){
          return this.model.children[i*this.colNum+j]!=null;
      }
  },
  computed: {
    rowNum() {
      let rowNum = 0;
      if (this.model&& this.model.children) {
        let len=this.model.children.length;
         rowNum= Math.ceil(len/this.colNum)+1;
      }
      return rowNum;
    }
  },
  data() {
    return {
      colNum: 8,
      showDetail: true
    };
  }
};
</script>

