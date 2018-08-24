<template>
  <div>
    <el-row>
    </el-row>
    <div style="margin-bottom: 10px 0">
      <el-form>
        <el-row style=" background:#f5f5f5;paddingBottom:10px;">
          <el-col :span="8" v-if="!isWatch">
            <el-button type="primary" @click="addNew(null)">新增器具特殊价格</el-button>
          </el-col>
          <el-col :span="!isWatch? 16 : 24" style="text-align:right;">
          <span style="color:#606266;">状态查询：</span>
          <el-select v-model="filterClass" placeholder="请选择"   @change="handleSearchChange" >
            <el-option v-for="item in filterClassOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <span style="color:#606266;">器具名称：</span>
          <el-input v-model="applianceName" style="width:200px;"></el-input>
          <el-button type="primary" @click="handleSearchTop" class="el-icon-search" >查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData"
        :max-height="QJTableMaxHeight"
        border
        ref="tableData"
        style="width: 100%;min-height:39vh;"
        @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="55">
      </el-table-column>

      <el-table-column
        prop="applianceName"
        label="器具名称">
      </el-table-column>
      <el-table-column
        prop="applianceRealname"
        label="器具实际名称">
      </el-table-column>
      <el-table-column
        prop="model"
        label="型号规格">
      </el-table-column>
      <el-table-column
        prop="measureRange"
        label="测量范围">
      </el-table-column>
      <el-table-column
        prop="standardPrice"
        label="收费标准">
      </el-table-column>
      <el-table-column
        prop="specialPrice"
        label="特殊价格">
      </el-table-column>
      <el-table-column
        prop="specialPriceExplain"
        label="特殊价格说明">
      </el-table-column>
      <el-table-column
        prop="status"
        label="当前状态">
                <!-- :formatter="statusCheck" -->
        <template slot-scope="scope">
          <span style="color:#DB4D6D;"v-if='scope.row.status == 1'>未审核</span>
          <span style="color:#0089A7;" v-if='scope.row.status == 2'>已启用</span>
          <span style="color:#080808;" v-if='scope.row.status == 3'>已暂停</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="80" v-if="!isWatch">
        <template slot-scope="scope">
          <!-- <el-button :disabled="scope.row.status == 1" @click="handleApprove(scope.row)" type="text" style="padding:0;font-size:14px;">审核</el-button>
          <el-button v-if="scope.row.status == 3" @click="handleStart(scope.row)" type="text" style="padding:0;font-size:14px;">启用</el-button>
          <el-button v-if="scope.row.status == 1" @click="handlePause(scope.row)" type="text" style="padding:0;font-size:14px;">暂停</i></el-button> -->
          <el-button v-if='scope.row.status == 2' type="text" style="padding:0;font-size:14px;" class="el-icon-edit" title="编辑" disabled></el-button>
          <el-button v-if='scope.row.status != 2'  type="text" style="padding:0;font-size:14px;" class="el-icon-edit" title="编辑" @click="addNew(scope.row)"></el-button>
          <el-button v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,scope.row)}" type="text" style="padding:0;font-size:14px;" class="el-icon-delete" title="删除"></el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>
  <div style="margin-top: 20px" v-if="!isWatch">
    <el-button @click="handleMultipleSelection(1)" v-has='"M4802"'>审核</el-button>
    <el-button @click="handleMultipleSelection(2)" v-has='"M4802"'>启用</el-button>
    <el-button @click="handleMultipleSelection(3)" v-has='"M4802"'>暂停</el-button>
    <el-tooltip>
      <i class="el-icon-info fS12"></i>
      <div slot="content">
        <p><span class="strong">审核</span>:仅对<span class="strong">未审核</span>状态生效</p>
        <p><span class="strong">启用</span>:仅对<span class="strong">已暂停</span>状态生效</p>
        <p><span class="strong">暂停</span>:仅对<span class="strong">已启用</span>状态生效</p>
      </div>
    </el-tooltip>
  </div>
    <div style="margin-top:10px;text-align:center; float:right;">
      <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">
      </mind-pagination>
    </div>
    <template v-if="isEditing">
      <price-form :data='form' :callBack='handleSubmit'></price-form>
      <!-- <test :callback='handleSubmit'></test> -->
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import { ajaxRequest, ajaxSyncRequest } from "../../util/base";
import priceForm from './priceForm'
import $ from "jquery";

/* import {
  Input,
  Button,
  Checkbox,
  Form,
  FormItem,
} from "element--ui";
Vue.use(Input);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Form);
Vue.use(FormItem); */
export default {
  name: "price-list",
  components: {
   priceForm
  },
  props: {
    data: {
      type: Object
    },
    isPut:{
      type:Boolean,
    },
    isWatch:{
      type:Boolean,
      default:false,

    }
  },

  data() {


    return {
      page: 1,
      rows: 10,
      total: 0,
      applianceName: "",
      tableData: [],
      isEditing:false,
      multipleSelection: [],
      form: {
        // applianceName: "",
        // applianceRealname: "",
        // standardPrice: "",
        // model: "",
        // measureRange: "",
        // specialPrice: "",
        // specialPriceExplain: "",
        // companyId: "",
        // status: 2
      },
      filterClass:0,
      isCheckDisabled:true,
      // 可以直接在这里改查询的条件 ， 启用没有必要添加
      filterClassOption:[{value:0,label:'全部'},{value:1,label:'未审核'},{value:2,label:'已启用'},{value:3,label:'已暂停'}],
      // isSuccess:{number:0,success:0},
    };
  },
  computed: {},

  methods: {

    addNew(info){
      if(!info){
        this.isEditing = true;
      }else{
        this.form = info;
        console.log(this.form)
        this.isEditing = true;
      }
    },
    handleSearchChange(value){
      this.filterClass = value;
    },

    handleSubmit(info) {
      if(!!info){
        if(!info.id){
          info.companyId = this.data.id;
          info.status = 1;
          ajaxRequest("post", "back/companyAppliance/", info, res => {
            if (res.code == 200) {
              this.$message({
                  type:'success',
                  message:'新增成功'
                });
              this.tableData.unshift(res.daoResult);
              this.handleSearch();
            }
          });
        }else{
          info.updateWay = 0;
          ajaxRequest('put','back/companyAppliance/',info,res=>{
            if(res.code == 200){
              this.$message.success('保存成功')
              this.handleSearch()
            }
          })
        }
      }
      this.form = {}
      this.isEditing = false;
    },
    handleSearch() {
      ajaxRequest(
        "get",
        "back/companyAppliance/retrieve",
        {
          applianceName: this.applianceName,
          companyId: this.data.id,
          page: this.page,
          rows: this.rows,
          total: 0,
          isDelete:0,
          // 1可用 2未审核 3停用
          status:this.filterClass==0?null:this.filterClass,
          orderProperty:'c.status',
          orderType:'asc'
        },
        res => {
          if (res.code == 200) {
            this.total = res.total;
            this.tableData = res.rows;
          }
        }
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleMultipleSelection(num){
      if(!this.multipleSelection.length){
        return ;
      }
      let unaudit=0,start=0,pause=0;
      for(let i =0 ; i< this.multipleSelection.length;i++){
        if(this.multipleSelection[i].status == 1){
          unaudit ++;
        }
        if(this.multipleSelection[i].status == 3){
          pause ++;
        }
        if(this.multipleSelection[i].status == 2){
          start ++;
        }
      }
      let message = '';
      let arrInfo = [],
        arr = [],
        status = num;
      // 审核
      if(num === 1){
        status = 2;
        arr = this.multipleSelection.filter((item)=>{
          // 找到未审核状态返回
          return item.status == 1 ;
        })
        // 启用
        if(unaudit == 0){
            message = `选中未审核${unaudit}条，无数据可审核，请确认数据！`
          }else{
            message = `选中未审核${unaudit}条，确认进行审核并启用？`
          }
      }else if (num === 2){
        status = 2;
        arr = this.multipleSelection.filter((item)=>{
          // 找到已暂停状态返回
          return item.status == 3 ;
        })
        // 暂停
         if(pause == 0){
            message = `选中已暂停${pause}条，无数据可启用，请确认数据！`
          }else{
            message = `选中已暂停${pause}条，确认进行启用？`
          }
      }else if(num === 3){
        status = 3;
        arr = this.multipleSelection.filter((item)=>{
          // 找到已启用状态返回
          return item.status == 2 ;
        })
         if(start == 0){
            message = `选中已启用${start}条，无数据可暂停，请确认数据！`
          }else{
            message = `选中已启用${start}条，确认进行暂停？`
          }
      }
      for(let i = 0; i < arr.length ; i ++){
        arrInfo.push(arr[i].id)
      }
      this.$confirm(message).then(()=>{
        this.handleStatus(arrInfo.join(),status)
      })

    },
    handlePageSizeChange(size) {
      this.page = 1;
      this.rows = size;
      this.handleSearch();
    },
    handleCurrentPageChange(currentPage) {
      this.page = currentPage;
      this.handleSearch();
    },
    handleStatus(ids,status){
      ajaxRequest('put','back/companyAppliance/list/'+ids,{status},(res)=>{
        if(res.code === 200){
          let message
          switch (status) {
            case 1:
              message = '审核成功！'
              break;
            case 2:
              message = '启用成功！'
              break;
            case 3:
              message = '暂停成功！'
              break;
          }
          this.$message.success(message)
          this.handleSearch();
        }
      })
    },
    handleDelete(row) {
      ajaxRequest("put", "back/companyAppliance/" , {id:row.id,isDelete:1}, res => {
        if (res.code == 200) {
          this.handleSearch();
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.handleSearch();
        }
      });
    },
    handleCancel(){
      this.$emit('willBack')
    },
    handleSearchTop(){
      this.page = 1;
      this.handleSearch();
    }
  },
  mounted() {
    if(this.data.id){
      this.handleSearch();
    }
    // ajaxRequest("get","back/companyAppliance/queryAppliance",{},
    //   function(res) {
    //     //companyAppliance/queryAppliance 中返回的数据默认是数组格式
    //     this.appliances = res;
    //   }.bind(this)
    // );

  }
};
</script>

<style>
.but-cx {
  background: #56bc4e !important;
  border: none !important;
}
.fS12{
  font-size: 12px;
  color: #606266 !important;
}
.strong{
  color: red;
}
</style>
