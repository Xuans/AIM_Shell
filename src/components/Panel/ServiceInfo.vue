<template>
    <props-card :header="`服务[${data.service_name}]基本信息`" style="margin: 10px;">
          <div style="position:relative;width:100%;height:100%;overflow:auto;padding:10px;">
            <el-row>
              <el-col :span="9">服务描述</el-col>
              <el-col :span="9">{{data.service_desc}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">服务英文名</el-col>
              <el-col :span="9">{{data.service_ename}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">服务父节点</el-col>
              <el-col :span="9">{{data.tree_p_node_name}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">服务版本</el-col>
              <el-col :span="9">{{data.service_version}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">创建时间</el-col>
              <el-col :span="9">{{data.create_time}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="9">创建者</el-col>
              <el-col :span="9">{{data.create_user}}</el-col>
            </el-row>
          </div>
        </props-card>
</template>
<script>
import PropsCard from '../Util/PropsCard'
export default {
    components:{
        PropsCard,
    },
    props:{
        data:{
            default(){
                return {}
            }
        }
    },

}
</script>
