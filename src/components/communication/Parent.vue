<template>
  <div>
    <Child1 :callback="receiveFrom1"/>
    <Child2 :data="data"/>
  </div>
</template>

<script>
  import Child1 from './Child1'
  import Child2 from './Child2'
    export default {
        name: "parent",
        data(){
          return{
            data:''
          }
        },
        methods:{
          /*接收子组件1传来的value,赋值给data,再传给子组件2*/
          receiveFrom1(value){
            this.data = value;
          }
        },
        components:{
          Child1,Child2
        }
    }
</script>

<style scoped>

</style>
