<template>
    <div style="height: 300px">
        <div style="display:flex;height: 20px;background-color: #f4f4f5" @dblclick="$emit('close')">
            <span>服务信息（双击最小化）</span>
            <el-button class="mc-btn" type="info" plain icon="el-icon-minus" size="mini" @click="$emit('close')"></el-button>
            <el-button class="mc-btn" type="info" plain icon="el-icon-setting" size="mini" style="right: 35px"></el-button>
        </div>

        <div class="el-dialog__body"><slot></slot></div>
    </div>
</template>

<script>
  export default {}
</script>

<style scoped>

    .mc-btn {
        position: absolute;
        top: 0px;
        right: 0px;
        padding: 3px 8px;
        border: 0;
    }

</style>