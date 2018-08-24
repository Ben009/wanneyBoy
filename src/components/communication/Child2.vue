<template>
  <span>{{data}}</span>
</template>

<script>
    export default {
        name: "child2",
        props:['data'],  //接收父组件的data，实为子组件1的value
    }
</script>

<style scoped>

</style>
