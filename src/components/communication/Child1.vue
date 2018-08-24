<template>
  <button @click="callback('aaaa')">111111111111111</button>
</template>

<script>
    export default {
        name: "child1",
        props:{
          callback:{
            type:Function,
            require:true
          }
        }
    }
</script>

<style scoped>

</style>
