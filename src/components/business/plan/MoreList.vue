<template>
  <mind-dialog
    title="器具列表"
    :visible="true"
    width="680px"
    center
    appendToBody
    v-dialogDrag
    @close="handleCancel">
  <div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="器具查询">
          <el-input class="input-form-inline" v-model="formInline.applianceName"></el-input>
        </el-form-item>
        <el-form-item label="型号规格">
          <el-input class="input-form-inline" v-model="formInline.model"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :max-height="QJTableMaxHeight"
        :data="tableData"
        border
        style="width: 100%"
        @row-click="handleSelect"
        @selection-change="handleSelectionChange">
        <!--<el-table-column-->
          <!--type="selection"-->
          <!--width="40">-->
        <!--</el-table-column>-->

        <el-table-column
          v-for="item in columnsInfo.moreInfo"
          :prop="item.nameCode"
          :label="item.title">
        </el-table-column>

        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleSelect(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-success" title="选择"></i></el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
  </mind-dialog>
</template>

<script>

  import {ajaxRequest} from '../../util/base'
  export default {
    name: 'more-list',
    /*表格列信息 表格数据*/
    props: {
      relativeData: {required: true, type: Array},
      columnsInfo: {required: true, type: Object},
      callback: {required: true, type: Function},
      ajaxChangeUrl: {required: true,type: String},
    },
    data () {
      return {
        multipleSelection:[],
        formInline:{},
        tableData:[]
      }
    },
    methods: {
      handleCancel(){
        this.callback(null)
      },
      onSubmit(){
        ajaxRequest('get','back/appliance/getApplianceInfoForAutoComplete',this.formInline,(res)=>{
          this.tableData=res.rows;
        })
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleSelect(row){
        console.log(row)
        this.callback(row);
      }
    },
    mounted(){
      this.relativeData.pop();
      this.tableData=this.relativeData;
    }
  }

</script>

<style lang="scss">
  .demo-form-inline{
    .input-form-inline{
      .el-input__inner{
        border-radius: 4px !important;
        border: 1px solid #ccc!important;
        height: 28px!important;
      }
    }
  }

</style>
