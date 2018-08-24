<template>

    <el-row class="main">
      <el-col :lg="4" class="mindTreeP" id="mindTreeP">
        <div class="zoomEle" @mousedown="test()"></div>
        <mind-tree :data="treeData" :props="defaultProps" :leftClickCallBack="handleLeftCallback" class="mindTree"></mind-tree>
        <!-- <el-tree
        ref="tree"
        :data="data"
        :props="defaultProps"
        node-key="id"
        check-strictly
        default-expand-all
        :expand-on-click-node=false
        @node-click="treeClick"
        >
      </el-tree> -->

      </el-col>
      <el-col :lg="20" class="mindTreeC" id="mindTreeC" >
        <el-button type="primary" @click="handleAdd(null)">新增字典项</el-button>
        <el-button type="warning" class="m-b-10" v-mindPopover="{message:'确认删除?',success:handelRemove.bind(this,multipleSelection),placement:'bottom',isOpen:isRemove}">删除</el-button>
        <el-table :data="tableData"  border stripe  style="width: 100%" @selection-change="handleSelectionChange" >
          <el-table-column type="selection" ></el-table-column>
          <el-table-column type="index"  label="序号" align="center"  width="50"></el-table-column>
          <el-table-column label="值" prop="value" align="center"  width="150"></el-table-column>
          <el-table-column label="字典项文本" prop="text" align="center" width="150"></el-table-column>
          <!-- <el-table-column  label="状态"  align="center" ></el-table-column> -->
          <el-table-column  label="备注" prop="remark" align="center" min-width="300"></el-table-column>
          <el-table-column label="排序"  prop="orderNum" align="center" width="100"></el-table-column>
          <el-table-column label="操作"  align="center" width="60">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" title="编辑" type="text" style="padding:0;font-size:18px;"><i class="el-icon-edit-outline"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <DictEdit  v-if="!!add" :treeNodeId="add" :formData="formData" :callback="handleAddCallback"></DictEdit>
    </el-row>
  </template>


  <script>
  import Vue from "vue";
  import Vuex from "vuex";
  import { Tree, Button, TableColumn, Row, Col } from "element-ui";
  import { ajaxRequest, ajaxProxyRequest } from "../../util/base";
  import DictEdit from "./DictEdit.vue";
  import $ from 'jquery'

  Vue.use(Tree);
  Vue.use(Button);
  Vue.use(TableColumn);
  Vue.use(Row);
  Vue.use(Col);
  export default {
    name: "dict-tree",
    data() {
      return {
        tableData: [],
        add: null,
        treeNodeId: null,
        multipleSelection: [],
        data: [],
        treeData: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        orderProperty: "",
        orderType: "",
        formData: {}
      };
    },
    components: { DictEdit },
    methods: {
      test(e){
        let thing = e || event ;
        $('.main').mousemove(function(){
          $('#mindTreeP.mindTreeP').css('width',event.clientX - 200 +'px')
          $('#mindTreeC.mindTreeC').css('width',`calc(97% - ${event.clientX}px + 200px )`)
        })
        $('.main').mouseup(function(){
          $(this).unbind('mousemove')
        })
      },
      handleEdit(row) {
        this.formData = row;
        this.add = row.nodeId.toString();
      },
      // handleSort({ column, prop, order }) {
      //   this.orderProperty = prop;
      //   if (order === "ascending") {
      //     this.orderType = "asc";
      //   } else if (order === "descending") {
      //     this.orderType = "desc";
      //   } else {
      //     this.orderType = "";
      //   }
      //   this.getTableData();
      // },
      getTreeNodeData() {
        ajaxProxyRequest("post", "/njmind/findParam/treeNodeMenu", {}, res => {
          this.treeData = res.list;
        });
      },
      getTableData(nodeId) {

        ajaxRequest(
            "get",
            "back/dict/list",
            {
              nodeId: this.treeNodeId,
              isDelete: "0",
              orderProperty:'d.order_Num',
              orderType:'ASC'
            },
            data => {
              this.tableData = data.rows;
            }
          );

        // if (this.orderProperty && this.orderType) {
        //   ajaxRequest(
        //     "get",
        //     "back/dict/list",
        //     {
        //       nodeId: this.treeNodeId,
        //       isDelete: "0",
        //       orderProperty: this.orderProperty,
        //       orderType: this.orderType
        //     },
        //     data => {
        //       this.tableData = data.rows;
        //     }
        //   );
        // } else {

        // }
      },
      handleAdd(row) {
        if (!!row) {
        } else {
          this.add = this.treeNodeId;
        }
      },
      handleLeftCallback(obj, node, ele) {
        this.treeNodeId = obj.id;
        this.getTableData(this.treeNodeId);
      },
      handleAddCallback(data) {
        if (data) {
          // 是否需要对传入的数据进行去重？
          if (data.id) {
            // 进行put请求
            ajaxRequest('put','back/dict/',{
              id:data.id,
              nodeId:data.nodeId,
              isDelete:0,
              orderNum:data.orderNum,
              text:data.text,
              value:data.value,
              remark:data.remark,
              status:data.status
            },res=>{
              if(res.code===200){
                this.getTableData(data.nodeId)
                this.$message.success('编辑成功')
              }else{
                this.$message.error('编辑失败,请求错误!')
              }
            })

          } else {
            // 进行post请求
            ajaxRequest("post", "back/dict/", data, res => {
              if (res.code == "200") {
                this.$message.success("新增成功");
                this.getTableData(data.nodeId);
              } else {
                this.$message.error("新增失败,请求错误!");
              }
            });
          }
        }
        this.add = null;
        this.formData = {};
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handelRemove(data) {
        if (data.length > 0) {
          let ids = data
            .map(function(v) {
              return v.id;
            })
            .join(",");
          ajaxRequest(
            "put",
            "back/dict/list/" + ids,
            { _method: "put", isDelete: 1 },
            res => {
              if (res.code === 200) {
                this.$message.success("删除成功");
                this.getTableData(this.treeNodeId);
              } else {
                this.$message.error("删除失败");
              }
            }
          );
        } else {
          this.$message.warning("请先选择要删除的数据");
        }
      },
      isRemove(){
        if(this.multipleSelection.length==0){
          this.$message.warning("请先选择要删除的数据");
        }
       return this.multipleSelection.length==0?false:true


      }
    },
    mounted() {
      this.getTreeNodeData();
    }
  };
  </script>


  <style  scoped>
  .m-b-10 {
    margin-bottom: 10px;
  }
  #mindTreeP.mindTreeP {
    /* max-height: 100vh !important; */
    /* overflow: scroll !important; */
    position: relative;
    user-select: none;
    display: inline-block;
    overflow-x: hidden;

    /* max-width: 14vw !important; */
  }
  #mindTreeC.mindTreeC{
    display: inline-block;
    max-height:88vh ;
    overflow: scroll;
    overflow-x: hidden !important;
  }
  .mindTree{
    max-height: 88vh !important;
    overflow: scroll !important;
    overflow-x:hidden !important;
  }
  .main{
    max-height: 88vh !important;
    /* overflow: hidden; */
  }
  .zoomEle{
    height: 100%;
    width: 3px;
    position: absolute;
    right: 2px;
    top: 0;
    z-index: 10;
  }
  .zoomEle:hover{
    cursor: w-resize;
  }
  </style>
