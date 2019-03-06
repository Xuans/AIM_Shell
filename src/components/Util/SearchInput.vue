<template>
    <div style="height:10%;position:relative;"
         class="el-transfer-panel__header"
         @mouseenter="showScriptSearch=true"
         @mouseleave="showScriptSearch=false"
    >
        <div v-show="showScriptSearch||(scriptQuery!=null&&scriptQuery!='')"
             class="animated fadeIn"
             style="border-bottom:1px solid gray;position:relative;width:80%;float:right;height:100%;">
            <div contenteditable="true"
                 style="position:relative;color:gray;height:100%;outline:none;width:90%;float:left;"
                 @keydown.stop="buttonKey"
                 @input="fireScriptTreeFilter($event.currentTarget.innerText)">
            </div>
            <i class="el-icon-search"></i>
        </div>
        <span class="animated fadeIn" style="height:100%;">{{}}</span>
    </div>
</template>

<script>
  export default {
    name: 'SearchInput',
    data () {
      return {
        showScriptSearch: false,
        showServiceSearch: false,
      }
    }
  }
</script>

<style scoped>

</style>
