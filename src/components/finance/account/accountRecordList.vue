<template>
  <div style="position:relative;">
    <div>
      <!-- 高级查询条件 -->
      <mind-condition ref="accountRecordWhere" :op-code="opCode" ></mind-condition>
      <!-- 查询调用按钮 -->
      <div style="display: flex;justify-content: space-between;">
        <span>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增</el-button>
        <el-button size="small" type="primary" icon="el-icon-upload2" @click="handleFileUpload()">导入</el-button>
        </span>
        <div style="display: inline-block;text-align: center">
          <el-button type="primary"  @click="findBtn" class="el-icon-search">查询</el-button>
          <el-button type="primary" @click="exportExcleBtn" class="el-icon-download">导出</el-button>
          <el-button type="warning"  @click="emptyCondition" class="el-icon-info">清空</el-button>
        </div>
        <span style="float: right">
          <el-select size="mini"  v-model="isDefModule" placeholder="请选择" @change="changeModule">
            <el-option
              v-for="(item,index) in modules"
              :key="index"
              :label="item.name"
              :value="item.name">
            </el-option>
        </el-select>
          <el-button type="primary" size="mini" round @click="personalSetting(1)" class="el-icon-setting">个性化设置</el-button>
          <global-tootips>
            <p>1、	本功能可将所有银行的到款记录上传至系统，供查询与认领；</p>
            <p>2、	“新增”节点需逐条录入；</p>
            <p>3、	“导入”可使用EXCEL导入到款记录；</p>
            <p>4、	若到款记录未有人认领，可进行删除或修改操作；</p>
          </global-tootips>
        </span>
      </div>

      <!-- TODO 案例 通用查询组件 -->
      <mind-datagrid ref="accountRecordList"  :op-code="opCode" :callBack="callBack" setTabH="setHeightForRetS">
        <template slot="payTime" slot-scope="scope"  >
          {{scope.row.payTime|formatDateFifter}}
        </template>
        <template>
          <el-table-column   label="操作" fixed="right"  width="80px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-edit-outline" title="详情"></i></el-button>
              <el-button v-if="scope.row.payMoney==scope.row.balance" v-mindPopover="{message:'确定删除?',success:handleDelete.bind(this,[scope.row])}" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-delete" title="删除"></i></el-button>
            </template>
          </el-table-column>
        </template>
      </mind-datagrid>
      <!--到款详情页面-->
      <accountRecordForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></accountRecordForm>
      <!--导入到款页面-->
      <fileUpload v-if="!!fileData" :callback="handlefileUploadCallback"></fileUpload>
    </div>
  </div>


</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,formatDate} from '../../util/base';
  import accountRecordForm from '../account/accountRecordForm.vue';
  import fileUpload from '../account/fileUpload.vue';

  export default {
    name: "account-record-list",
    data(){
      return{
        opCode: "findAccountRecordPage",
        modules:[],//模板列表
        isDefModule:'',//默认模板
        edit:null,
        fileData:null,
      }
    },
    methods:{
      //查询按钮调用
      findBtn() {
        this.$refs.accountRecordWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          //console.log("回调传入参数：", wheres);
          this.$refs.accountRecordList.findPageInfo(wheres);
        });
      },
      //导出按钮调用
      exportExcleBtn() {
        this.$refs.accountRecordWhere.sendParams(wheres => {
          //调用usersDataGrid查询
          //console.log("回调传入参数：", wheres);
          this.$refs.accountRecordList.findPageInfo(wheres,true);
        });
      },
      /** 打开个性化设置 */
      personalSetting(){//个性化设置
        this.$refs.accountRecordWhere.settingShow(true,(personalSet)=>{
          //当个性化设置打开后如果有参数变动会回调
          //console.log("设置后回调：",res);
          this.$refs.accountRecordList.changeFilter(null,personalSet);
          this.modules=personalSet.content;
          this.isDefModule=personalSet.isDefModule;
        });
      },
      /** 清空查询条件 */
      emptyCondition(){//
        this.$refs.accountRecordWhere.emptyCondition();
      },
      /** 回调 可以单datagrid使用  */
      callBack(type,param1,param2){
        if(type=='modules'){
          this.modules=param1;
          this.isDefModule=param2;
        }else{
          //console.log("回调接收参数",param1);
        }
      },
      /** 模板变换 */
      changeModule(value){
        //console.log("模板变更",value);
        this.$refs.accountRecordList.changeFilter(value,null);
      },

      //编辑页面
      handleEdit(rowInfo){
        if(null !== rowInfo){
          rowInfo.isReadOnly=false;
        }
        this.edit = rowInfo || {isReadOnly:false}
      },
      //删除操作
      handleDelete(data){
        if(data.length>0){
          let ids = data.map(function (v) {
            return v.id
          }).join(",");
          ajaxRequest('post','back/accountRecord/list/'+ids,{_method:'delete'},function(res){
            if(res.code===200){
              if(res.msg!==""){
                this.$message.error(res.msg);
                this.findBtn();
              }else{
                this.$message.success('删除成功！');
                this.findBtn();
              }
            }
            else{
              this.$message.error('删除失败！');
            }
          }.bind(this))
        }else{
          this.$message({
            message: '请先选择要删除的数据',
            type: 'warning'
          })
        }
      },
      //详情页回调
      handleEditCallback(res){
        let _this=this;
        if(res=="success"){
          _this.$message.success('操作成功！');
          _this.edit=null;
          _this.findBtn();
        }else if(res=="error"){
          _this.$message.error('操作失败！');
        }else{
          _this.edit=null;
        }
      },
      //上传回调
      handlefileUploadCallback(res){
        let _this=this;
        if(res=="success"){
          _this.$message.success('导入成功！');
          _this.fileData=null;
          _this.findBtn();
        }else if(res=="error"){
          _this.$message.error('Excle解析异常！请确认Excle内容！');
        }else{
          _this.fileData=null;
        }
      },
      //上传
      handleFileUpload(){
        this.fileData ={}
      },
    },
    components:{
      accountRecordForm,
      fileUpload
    },
    mounted() {
      this.findBtn();
    },
    filters: {
      formatDateFifter(val) {
        return formatDate(val, 'YYYY-MM-DD')
      }
    },
  }

</script>

<style scoped>
  .custom-input{
    width:200px;
    height:32px;
  }
  .custom-input .el-input__inner{
    height:32px;
    line-height:32px;
  }
  .custom-input .el-input-group__append{
    padding:0 10px;
  }
  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }
  .el-icon-setting:hover {
    color: #3094e0 !important;
  }
</style>
