<template>
    <el-select v-model="target.sv_id"
               placeholder="待发布"
               @change="handleOfChange"
               :disabled="disabled"
               @focus="findVersions"
               size="mini"
               v-loading="loading"
               >
        <el-option 
                v-for="item in versions"
                :key="item.sv_id"
                :label="formatter(item)"
                :value="item.sv_id" 
               >
        </el-option>
        <el-option 
               :key="undefined" :value="undefined" label="当前开发版本"></el-option>
    </el-select>
</template>

<script>
  export default {
    name: 'VersionSelect',
    props: {
      disabled: Boolean,
      service_id:String,
      target:{},
      formatter: {
        type: Function,
        default (item) {
          return `${item.service_version}`
        }
      }
    },
    data () {
      return {
        loading:false,
        versions:[],
        head: this.value
      }
    },
    methods: {
      handleOfChange (value) {
        this.target.sv_id=value;
        // this.$emit('input', value)
      },
      findVersions(){
          this.loading=true;
        this.$getVersionHistory({'service_id':this.service_id}).then(resp=>{
          this.versions=resp.r.ret;
          this.loading=false;
        }).catch(e=>{
          app.alert(e);
        });
      },
    }
  }
</script>

<style scoped>

</style>
