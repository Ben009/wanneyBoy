<template>
  <mind-dialog
    title="选择"
    :visible="true"
    width="500px"
    center
    v-dialogDrag
    @close="handleCancel">
    <el-table :max-height="QJTableMaxHeight"
      :data="data"
      height="250"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        label="选择">
        <template slot-scope="scope">
          <button @click="callback(scope.row)">选择</button>
        </template>
      </el-table-column>
    </el-table>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  

  export default {
    name: "modal",
    props: {
      searchKey: {required: true, type: String},
      callback: {required: true, type: Function}
    },
    data: function () {
      return {
        data: []
      }
    },
    mounted(){
      console.log(this);
    },
    methods:{
      handleCancel(){
        this.callback();
      }
    }

  }
</script>

<style scoped>

</style>
