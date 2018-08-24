<!--
 设置快捷
-->

<template>
  <div>
    <div class="moduleLeftMenu">

        <el-tree
          ref="tree"
          :data="data"
          :props="defaultProps"
          node-key="id"
          @check-change="handleChange"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span v-if="node.data.leaf == 1">
                <el-checkbox v-model="node.data.checked">{{ node.data.label}}</el-checkbox>
            </span>

            <span v-else>
             {{ node.data.label }}
            </span>
          </span>
        </el-tree>

    </div>

    <div class="moduleContentMid">
      <el-button type="primary" style="margin-top: 40%" @click="selectModule">选择</el-button>
      <br><br>
      <el-button type="warning" @click="handleSubmit">保存</el-button>
    </div>

    <div class="moduleContent">
      <div class="setMyMenu title-item flex mb20">
        <span class="flex-one">已选菜单</span>
        <!--<div class="el-icon-info  shuoming">-->
          <!--<el-row class="el-sm">-->
            <!--<p>1、说明 </p>-->
          <!--</el-row>-->
        <!--</div>-->
      </div>

      <el-table
        :data="tableData"
        style="width: 60%">
        <el-table-column
          prop="moduleName"
          label="菜单名称">
        </el-table-column>

        <el-table-column
          prop="moduleTabName"
          label="菜单别名">
        </el-table-column>

        <el-table-column
          label="操作"
          width="80px">
          <template slot-scope="scope">
            <el-button @click="deleteRow(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-delete" title="删除"></i></el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest, ajaxSyncRequest} from '../util/base';
  import '../util/Base.css';
  import $ from 'jquery';


  export default {
    name: "setMyMenu",
    components: {},
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        test: [],
        tableData: [],
        checkList: []

      };
    },
    methods: {
      // 选中的菜单
      selectModule() {
        this.checkList = [];
        this.getChecked(this.data);
        //查看出右侧的明细
        if(this.checkList.length>0){
          ajaxSyncRequest('get', 'back/module/list/'+this.checkList.join(','), {}, (res) => {
            let newDatas =  res.rows;
            let datas = this.tableData.map(function(v){
              return v.id*1;
            })
            for (var i=0;i<newDatas.length;i++){
              if(!datas.includes(newDatas[i].id*1)){
                this.tableData = this.tableData.concat(newDatas[i]);
              }
            }
          })
        }else{
          this.$message.error('操作失败，未在左侧勾选任何菜单');
        }
      },
      //删除当前行，页面逻辑
      deleteRow(row) {
        this.tableData.splice($.inArray(row, this.tableData), 1);
      },
      handleChange(data, checked, indeterminate) {

      },
      //获取用户数据
      getTableData(){
        ajaxSyncRequest('get', 'back/moduleUser/getUserModule', {
        }, (res) => {
          this.tableData = res.rows;
        })
      },
      //加载节点
      getResourceList() {
        ajaxSyncRequest('get', 'back/module/getModuleTreeNoPower', {
          showDesc: '0'
        }, (data) => {
          this.data = this.getArray(data);
        })
      },
      //查找子节点  leaf=1
      getArray(data) {
        for (var i in data) {
          if (!data[i].children) {
            data[i].leaf = 1;
          } else {
            data[i].leaf = 0;
            this.getArray(data[i].children);
          }
        }
        return data;
      },
      //获取已选择的菜单
      getChecked(data) {
        for (var i in data) {
          if (!data[i].children) {
            if(data[i].checked){
              this.checkList.push(data[i].id);
            }
          } else {
            this.getChecked(data[i].children);
          }
        }
      },
      //保存修改
      handleSubmit() {
        let ids = "";
        this.tableData.forEach(e=>{
          ids += e.id + ",";
        })
        if(ids){
          ids = ids.substring(0, ids.length - 1);
          console.log(ids);
          ajaxSyncRequest('post', 'back/moduleUser/', {
            moduleIds: ids
          }, (res) => {
            if(res.code===200){
              this.$message.success('保存成功');
            }else{
              this.$message.error('保存失败');
            }
          })
        }
      }
    },
    created() {
      this.getTableData();
      this.getResourceList();
    },
  }
</script>

<style type="text/css" lang="scss">

  .setMyMenu {
    .flex-one {
      flex: 1;
    }
    .mb20 {
      margin-bottom: 20px;
    }

    .shuoming {
      border: none !important;
      color: #56BC4E !important;
      font-size: 16px !important;
      float: right;
      cursor: pointer;
    }
    .shuoming::after {
      content: "";
      position: absolute;
      z-index: 999;
    }
    .el-sm {
      background: #ffffff;
      position: absolute;
      z-index: 999;
      -webkit-box-shadow: 1px 7px 33px -9px #969696;
      box-shadow: 1px 7px 33px -9px #969696;
      border: 1px solid #56bc4e8c;
      border-radius: 5px;
      color: dimgrey;
      margin-left: -345px;
      margin-right: 15px;
      word-break: break-all;
      margin-top: 5px;
      padding: 4px 5px;
      font-size: 14px;
      opacity: 50;
      float: right;
      -webkit-transition: all 0.8s;
      transition: all 0.8s;
    }
  }

  .moduleLeftMenu {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 350px;
    bottom: 0px;
    overflow: auto;
  }

  .moduleContent {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 450px;
    overflow: auto;
  }

  .moduleContentMid {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 350px;
    width: 100px;
    overflow: auto;
  }

</style>
