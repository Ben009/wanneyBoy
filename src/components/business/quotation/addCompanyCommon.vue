<!--
    受理业务时添加单位 调用此组件
 -->
<template>
  <mind-dialog title="添加委托单位" :visible="true" dialogSize="large" center v-dialogDrag  @close="handleCancel">
    <companyForm :callbackAdd="handleCancel" :data="data" :isPut="false" :otherAdd="true"></companyForm>
  </mind-dialog>
</template>

<script>
  import companyForm from '../../base/company/companyForm';

  export default {
    name: "addCompanyCommon",
    props:{
      callback:{
        type:Function
      }

    },
    components: {companyForm},
    data() {
      return {
        isAdd:1,
        data:{isAdd:1},
        isPut:true
      };
    },
    methods:{
      handleCancel(data){
        this.callback(data);
      }
    }

  }
</script>

<style scoped>

</style>
