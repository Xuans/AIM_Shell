<template>
  <form>
    <div v-for="(item) in data" :key="item.name">
      <label>{{item.desp}}</label>
    </div>
  </form>
</template>


<script>
export default {
  name: "Form",
  props: {
    data: Array
  },
  methods:{
      
      getValue(value){
          return value===null||value===undefined||value===''?'':value;
      }
  }
};
</script>
