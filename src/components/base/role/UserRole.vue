<template>
  <mind-dialog
    title="用户选择"
    :visible="true"
    center
    dialogSize="mid"
    :lock-scroll="true"
    v-dialogDrag
    @close="handleCancel">
       <div >
         <el-row>
            <div class="el-icon-info shuoming" style="float:right">
               <el-row class="el-sm">
                 <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">事项说明</p>
                 <dl style="padding:6px 10px; ">
                <p>只展示已选中人员:仅显示该角色下已有人员</p>
                <p>保 存:点击保存之后,选中的人员将会拥有当前角色的权限</p>
                 </dl>
            </el-row>
            </div>
         </el-row>
         <el-form :inline="true" class="userrole">
           <el-row>
             <el-col :span="6">
               <el-form-item label="部门">
                 <el-select v-model="departId" size="mini" @change="departEvt" :popperAppendToBody="false">
                   <el-option label="全部" value="all" ></el-option>
                   <el-option v-for="(val,key) in departNameObj" :key="key" :label="val" :value="key" ></el-option>
                 </el-select>
               </el-form-item>
             </el-col>
             <el-col :span="6">
               <el-form-item label="登录账号" >
                 <el-input placeholder="登录账号" size="mini" v-model="userNo"  ></el-input>
               </el-form-item>
             </el-col>
             <el-col :span="6">
               <el-form-item label="用户名">
                 <el-input  placeholder="用户名" size="mini" v-model="userName" ></el-input>
               </el-form-item>
             </el-col>
             <el-col :span="5" style="margin-top:44px;">
               <el-checkbox @change="handleChecked">只展示已选中人员
                 <!-- <el-tooltip content="bottom center" style="fontSize=12px;">
                   <i class="el-icon-info"></i>
                   <span slot="content">仅显示该角色下已有人员</span>
                 </el-tooltip> -->
               </el-checkbox>
             </el-col>

           </el-row>
           <el-row >
             <el-col :span="24"  class="search-btn" style="text-align:center;">
               <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
               <el-button type="warning" size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
             </el-col>
           </el-row>
         </el-form>

         <el-table ref="uTable"  :max-height="QJTableMaxHeight" :data="tableData" border stripe  @selection-change="handleSelectionChange" >
           <el-table-column  type="selection"   width="40">
           </el-table-column>
           <el-table-column  prop="userNo"  label="登录账号" align="center" show-overflow-tooltip>
           </el-table-column>
           <el-table-column  prop="userName"  label="用户名" align="center" show-overflow-tooltip>
           </el-table-column>
           <el-table-column  prop="departId"  label="部门" align="center" show-overflow-tooltip :formatter="formatterDepartName">
           </el-table-column>
           <el-table-column  prop="roleName"  label="关联角色名称" align="center" show-overflow-tooltip >
           </el-table-column>
       </el-table>
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
       </div>
    <span slot="footer" class="dialog-footer">
      <!-- <div style="textAlign:center;fontSize:12px;marginBottom:10px;color:#606266;">
        <i class="el-icon-info"></i>
        <span>点击保存之后,选中的人员将会拥有当前角色的权限</span>
      </div> -->
      <el-button type="primary" @click="handleSubmit" >保 存</el-button>
      <!-- <el-tooltip content="点击保存之后,选中的人员将会拥有当前角色的权限"><i class="el-icon-info" style="fontSize:12px;color:#606266;"></i> </el-tooltip> -->
      <el-button @click="handleCancel" >取 消</el-button>
    </span>

  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxRequestJson} from '../../util/base';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElCheckbox from "@/common-el/packages/checkbox/src/checkbox.vue";

/*   import {Row,Table, TableColumn,Button,Form, FormItem, Input} from 'element--ui';
  Vue.use(Row);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Button);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input) */

  export default {
    name: "user_role",
    components: {
      ElCheckbox,
      ElCol
    }, 
    props:{
      roleId:{
        type:Number,
        required:true
      },
      departNameObj:{
        type:Object,
        required:true
      },
      callback:{
        type:Function,
        required:true
      }
    },
    data() {
      return {
        departId:'all',
        userName:null,
        userNo:null,
        byRoleId: null,
        page: 1,
        rows: 10,
        total: 0,
        tableData:[] ,
        multipleSelection: [],
        userLimit:[],
        tmpSelUser:[]
      }
    },
    methods:{
      formatterDepartName:function(row,column){
        return this.departNameObj[row.departId];
      },
      search(){
        this.getUserList();
      },
      reset(){
        this.departId='all';
        this.userName=null;
        this.userNo=null;
        this.departEvt();
      },
      departEvt(departId){
        this.getUserList();
      },
      getUserList(){
        this.mergeSelUser();//处理当前页面的选中项
        let _this=this;
        let searchKey={
          page:this.page,
          rows:this.rows,
          isDelete:0,
          total:0};
        if (null!=this.departId&&''!=this.departId&&'all'!=this.departId){
          searchKey['departId']=this.departId;
        }
        if (null!=this.userNo&&''!=this.userNo){
          searchKey['userNo']=this.userNo;
        }
        if (null!=this.userName&&''!=this.userName){
          searchKey['userName']=this.userName;
        }
        if (null!=this.byRoleId&&''!=this.byRoleId){
          searchKey['byRoleId']=this.byRoleId;
        }
        ajaxRequest('get','back/user/retrieve',searchKey,function(res){
          if(res.code===200){
            _this.tableData=res.rows;
            _this.total=res.total;
            _this.multipleSelection=[];
            console.log(res.rows,'rows')
            _this.loadSelUser();//已选中的值默认打上勾
          }
        }.bind(this))
      },
      handleSelectionChange(val) {
        let _this = this;
        this.multipleSelection=[];
        val.forEach(function(d,i) {
          _this.multipleSelection.push(d.id);
        });
      },
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getUserList();
      },
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getUserList();
      },
      handleSubmit(){
        this.mergeSelUser();//处理当前页面的选中项
        this.callback(JSON.stringify(this.userLimit), this.roleId);
      },
      handleCancel(){
        this.multipleSelection= [];
        this.userLimit=[];
        this.tmpSelUser=[];
        this.callback(null);
      },
//      获取该角色下的用户
      ajaxUserLimit(){
        this.userLimit=[];
        let _this=this;
        ajaxRequest('get','back/userRole/getUsersByRoleId',{
          roleId:_this.roleId
        },function(data){
            for(var i=0;i<data.length;i++){
              _this.userLimit.push(data[i].userId)
            }
          _this.getUserList();
        }.bind(this))
      },
      //加载当前页面已选择的用户
      loadSelUser() {
        let _this=this;
        this.tmpSelUser=[];
        this.$nextTick(()=>{
          this.tableData.forEach(function(d,i) {
            if(_this.userLimit.indexOf(d.id) >= 0) {
              _this.$refs.uTable.toggleRowSelection(_this.tableData[i], true);
              _this.tmpSelUser.push(d.id);
            }
          });
        })
      },
      //合并选择的用户
      mergeSelUser() {
        //删除和新增的用户
        let index = 0,_this=this;
        this.tmpSelUser.forEach(function(d, i) {
          if(_this.multipleSelection.indexOf(d) == -1) {
            _this.userLimit.splice(_this.userLimit.indexOf(d),1);
          }
        });
        this.multipleSelection.forEach(function(d, i) {
          if(_this.tmpSelUser.indexOf(d) == -1) {
            _this.userLimit.push(d)
          }
        });
      },
      handleChecked(val) {
        if(val) {
          this.byRoleId = this.roleId;
        }else {
          this.byRoleId = null;
        }
        this.getUserList();
      }
    },
    mounted(){
      this.ajaxUserLimit();
    },

  }
</script>

<style scoped="scss">
  .el-form-item{
    margin-bottom: 0px;
  }
  .search-btn {
    text-align: center;
    padding-bottom: 20px;
  }
  .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;}
  .shuoming::after{
   content: "";
    width: 35px;
    height: 40px;
    /*background: #fff;*/
    position: absolute;
    z-index: 999;
    /* top: 0; */
    /* left: -65px; */
    margin-left: -16px;

  }

  .el-sm{background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 2px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -301px;
    word-break: break-all;
    margin-top: 18px;
    padding: 0px 0px;
    font-size: 14px;
    opacity: 50;
    width: 320px;
    float: right;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;}

 .shuoming .el-sm{
    display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
   }
</style>
