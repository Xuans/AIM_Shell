<template>
    <div class="pl-resource">
        {{model[mapping['label']]}}
    </div>
</template>
<script>
    export default{
        props:{
            model:{
                default(){
                    return {}
                }
            },
            mapping:{
                default(){
                    return {
                    id:'id',
                    label:'name',
                    }
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