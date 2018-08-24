<!--只要加height就能看到表头固定的效果-->
<!--排序对列加sortable=custom, table绑定sort-change事件-->
<!--调整列宽设置resizable属性,也可以不设置，默认为true-->
<!--最好某一列不要加width，或者只加min-width, 否则当列宽和小于表格宽度的时候右侧会有留空，不好看-->
<template>
  <div>
  <el-table :max-height="QJTableMaxHeight"
    :data="tableData3"
    height="250"
    border
    style="width: 100%"
    @sort-change="handleSort">
    <el-table-column
      prop="date"
      label="日期"
      
      width="180"
      :render-header="renderHeader">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      
      width="180"
      :render-header="renderHeader">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      :formatter="formatContent"
    >
    </el-table-column>
    <el-table-column
      label="远程搜索"
    >
      <template slot-scope="scope">
        <el-autocomplete
          v-model="scope.row.search"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <span v-if="!item.isLast" class="name">{{ item.value }}</span>
            <span v-if="!item.isLast" class="addr">{{ item.address }}</span>
            <div v-if="item.isLast" @click="getMore($event,scope.row.search)">更多</div>
          </template>
        </el-autocomplete>
      </template>
    </el-table-column>
  </el-table>

    <modal v-if="showModal" :searchKey="modalParam" :callback="handleSelect"></modal>
  </div>
</template>

<script>
  import Vue from 'vue';
  
  import TableColumnHeader from './TableColumnHeader';
  import Modal from './modal';

/*   import { Table, TableColumn, Popover, Button, Input, Autocomplete } from 'element--ui';
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Popover);
  Vue.use(Button);
  Vue.use(Input);
  Vue.use(Autocomplete); */

  export default {
    name: "demo1",
    components:{TableColumnHeader, Modal},
    data() {
      return {
        showModal:false,
        modalParam:'',

        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          search:''
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          search:''
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          search:''
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          search:''
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          search:''
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          search:''
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          search:''
        }]
      }
    },
    methods: {
      handleSort: function(column, prop, order){
        console.log(column, prop, order)
      },
      handleSearch(column,value){


      },
      renderHeader:function(h, { column, $index }){
        return <TableColumnHeader column={column} handleSearch={this.handleSearch.bind(this)}></TableColumnHeader>
      },
      formatContent(row, column, cellValue, index){
        return (
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover">
            <span slot="reference">{cellValue}</span>
            <h1>这是一段内容,这是一段内容,这是一段内容,这是一段内容。</h1>
          </el-popover>
        )
      },

      querySearchAsync(searchKey, cb){
        cb([
          {value:'222',address:'qwqwwqwq'},
          {value:'333',address:'eggwgg'},
          {isLast:true}//获取到数据之后追加这一项
        ])
      },
      handleSelect(item){
        //赋值
        if(item){

        }
        this.showModal=false;
      },
      getMore(event,searchKey){
        event.stopPropagation();
        this.showModal=true;
        this.modalParam=searchKey;
      }
    }
  }
</script>

<style scoped>

</style>
