<template>
    <el-card shadow="hover" :body-style="bodyStyle" class="card">
        <span  slot="header" style="display:flex;font-weight: 200;font-size: 11px">
            <span style="flex:2;">{{header}}</span>
            <span style="flex:1;">
              <slot name="righttoolbar"></slot>
            </span>
        </span>
        <slot></slot>
    </el-card>
</template>

<script>
  export default {
    name: 'propsCard',
    props: {
      header: String,
      bodyStyle: {
        type: Object,
        default () {
          return {
            'padding': '8px'
          }
        }
      }
    }
  }
</script>

<style scoped>
    .card {
        color: #303133;
        margin-bottom: 20px;
        border: 2px solid #DCDFE6;
        border-radius: 3px
    }
</style>
