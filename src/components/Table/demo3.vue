<!--操作列-->
<template>
  <el-table :max-height="QJTableMaxHeight"
    :data="tableData3"
    height="250"
    border
    style="width: 100%"
    @row-contextmenu="handleRightClick">
    <el-table-column
      prop="date"
      label="日期"
      resizable
      width="100">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      resizable
      width="100">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      resizable
      class-name="ellipsis">
    </el-table-column>
    <el-table-column
      label="操作"
      resizable
      min-width="200">
      <template slot-scope="scope">
        <el-button v-if="!!ops[0]" @click="handleOperation(scope.row, ops[0])" type="text" size="small">{{ops[0]}}</el-button>
        <el-button v-if="!!ops[1]" @click="handleOperation(scope.row, ops[1])" type="text" size="small">{{ops[1]}}</el-button>

        <el-dropdown size="mini" v-if="showBtnMore && moreOps.length>0" style="margin-left:10px;">
          <el-button type="text" size="small" style="padding:0;" icon="el-icon-more"></el-button>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  v-for="v in moreOps" :key="v">{{v}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button v-if="!showBtnMore" v-for="v in moreOps" :key="v" @click="handleOperation(scope.row, v)" type="text" size="small">{{v}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import Vue from 'vue';
  import Clickoutside from '@/common-el/src/utils/clickoutside';
/*   import {Table, TableColumn, Button, Dropdown, DropdownMenu, DropdownItem} from 'element--ui';
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Button);
  Vue.use(Dropdown);
  Vue.use(DropdownMenu);
  Vue.use(DropdownItem); */

  export default {
    name: "demo3",
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
        }],
        ops: ['详情', '删除', '编辑'],
        showBtnMore: true
      }
    },
    computed: {
        moreOps () {
          return this.ops.slice(2)
        }
    },
    methods: {
      handleRightClick (row, event) {
        event.preventDefault();
        let handleOperation=this.handleOperation,
            ops=this.ops;
        let RightClickMenu = Vue.extend({
          data(){
            return {
              ops:ops
            }
          },
          methods: {
            handleClose () {
              this.$destroy(true);
              this.$el.parentNode.removeChild(this.$el);
            },
            handleRightClickOperation (op) {
              this.handleClose();
              handleOperation(row, op)
            }
          },
          directives: { Clickoutside },
          template:
            '<ul class="right-click-menu" v-clickoutside="handleClose">' +
              '<li v-for="v in ops" @click="handleRightClickOperation(v)">{{v}}</li>' +
            '</ul>'
        });
        let instance = new RightClickMenu().$mount();

        document.body.appendChild(instance.$el);
        let windowWidth=document.documentElement.clientWidth,
            windowHeight=document.documentElement.clientHeight,
            eventX=event.clientX,
            eventY=event.clientY;
        let dom=instance.$el,
            menu=dom.getBoundingClientRect();
        let left=eventX+menu.width>windowWidth ? eventX-menu.width : eventX,
            top=eventY+menu.height>windowHeight ? eventY-menu.height : eventY;
        dom.style.top=top+'px';
        dom.style.left=left+'px';
      },
      handleOperation (row, op){
        alert(op);

      }
    },

  }
</script>

<style>
  .el-table{
    overflow: visible;
  }
  .el-table .cell{
    overflow:visible;
  }


  .right-click-menu{
    position:fixed;
    border:1px solid #ccc;
    padding: 2px 0;
    background:#fff;
    width:100px;
    z-index:9999;
  }
  .right-click-menu li{
    padding:3px 10px;
    cursor:default;
    font-size:14px;
    color:#606266;
  }
  .right-click-menu li:hover{
    color:#409eff;
  }
  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
</style>
