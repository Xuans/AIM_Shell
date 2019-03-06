<template>
    <div class="pl-resource">
        {{model.name}}
    </div>
</template>
<script>
    export default{
        props:{
            model:{
                default(){
                    return {}
                }
            }
        },
        data(){
            return {

            }
        }
    }
</script>
<style>
    .pl-resource{
        width:100%;
        height:100%;
        position:relative;
        padding:10px 10px;
        border:1px solid lightblue;
    }
</style>