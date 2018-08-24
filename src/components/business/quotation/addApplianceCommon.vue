<!--
  业务受理时添加器具
 -->
<template>
  <div>
    <mind-dialog title="添加计量器具" :visible="true" dialogSize="large" center v-dialogDrag  appendToBody  @close="handleCancel">
      <applianceForm :callbackAdd="handleCancel" :otherAdd="true"></applianceForm>
    </mind-dialog>
  </div>
</template>

<script>
  import applianceForm from '../../base/appliance/applianceForm'
  export default {
    name: "addApplianceCommon",
    components:{applianceForm},
    data() {
      return {}
    },
    props:{
      callbackAdd:{
        type:Function
      }
    },
    methods:{
      handleCancel(data){
        this.callbackAdd(data);
      }
    }
  }
</script>

<style scoped>

</style>
