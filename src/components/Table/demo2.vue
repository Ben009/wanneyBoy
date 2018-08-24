<!--字段内容过长时，省略号显示设置show-overflow-tooltip=true-->
<template>
  <el-table :max-height="QJTableMaxHeight"
    :data="tableData3"
    height="250"
    border
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      resizable>
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      resizable>
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      resizable
      >
    </el-table-column>
  </el-table>
</template>

<script>
  import Vue from 'vue';
/*   import {Table, TableColumn} from 'element--ui';

  Vue.use(Table);
  Vue.use(TableColumn); */
  export default {
    name: "demo2",
    data() {
      return {
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      }
    }
  }
</script>

<style scoped>

</style>
