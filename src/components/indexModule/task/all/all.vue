<template>
  <div>
    <el-form ref="form" class="sampleForm">
      <div>
        <el-Row :gutter="20">
          <el-col :span="3">
            <el-form-item label="是否现场" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否录费" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否出证" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否异常" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否超期" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="检测部门" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="检测岗位" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20">
          <el-col :span="3">
            <el-select v-model="isLocale" placeholder="请选择">
              <el-option
                v-for="item in sceneOptions"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="isCheckout" placeholder="请选择">
              <el-option
                v-for="item in entryCostOptions"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="isCertificate" placeholder="请选择">
              <el-option
                v-for="item in certificateOptions"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="isException" placeholder="请选择">
              <el-option
                v-for="item in abnormalOptions"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="isOverdue" placeholder="请选择">
              <el-option
                v-for="item in overdueOptions"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="testDepartment" placeholder="请选择" @change="getPost">
              <el-option
                v-for="item in departmentOptions"
                :key="item.id"
                :label="item.departName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="testPost" placeholder="请选择" @change="getPostId">
              <el-option
                v-for="item in postOptions"
                :key="item.id"
                :label="item.postName"
                :value="item.postName">
              </el-option>
            </el-select>
          </el-col>
        </el-Row>
        <el-Row :gutter="20" style="text-align: center;margin:20px 0;">
          <el-button class="el-button el-button--primary" @click="search">查询</el-button>
          <el-button class="el-button el-button--primary" @click="exportList">导出</el-button>
          <el-button class="el-button" @click="back">返回</el-button>
        </el-Row>
      </div>
      <div>
        <global-tootips  style="float: right">
          <p>1、有查询所有权限的，可查看所有数据；</p>
          <p>2、分管领导查看分管部门数据； </p>
          <p>3、业务员查看客户对应业务员为本人的数据；</p>
          <p>4、汇总字段：委托单所属的检测部门。</p>
        </global-tootips>
      </div>
      <div>
        <el-table :max-height="QJTableMaxHeight"
                  ref="table"
                  :data="tableData"
                  border
                  style="width: 100%"
                  :fit="true">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.urgentMissionsPost"
                        border
                        style="width: 100%"
                        :fit="true">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column
                  prop="postName"
                  label="检测岗位"
                >
                  <template slot-scope="scope">
                    <span @click="goPostDetail(props.row,scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.postName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="registrationNo"
                  label="登记号数"
                >
                </el-table-column>
                <el-table-column
                  prop="setNumber"
                  label="套数"
                >
                </el-table-column>
                <el-table-column
                  prop="pieceNumber"
                  label="件数"
                >
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column
            prop="departName"
            label="检测部门"
          >
            <template slot-scope="scope">
              <span @click="goDepartDetail(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.departName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="registrationNo"
            label="登记号数"
          >
          </el-table-column>
          <el-table-column
            prop="setNumber"
            label="套数"
          >
          </el-table-column>
          <el-table-column
            prop="pieceNumber"
            label="件数"
          >
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:10px;text-align:center;float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../../util/base';
  //引入jquery
  import $ from 'jquery';
  export default {
    name:"all",//所有未检
    data() {
      return {
        tableData:[],
        page:1,//页码
        rows:50,//每页记录数
        total:0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
        orderProperty:'',//排序字段
        orderType:'desc',//排序方式
        sceneOptions:[],//现场option
        entryCostOptions:[],//录费option
        certificateOptions:[],//出证option
        abnormalOptions:[],//异常option
        overdueOptions:[],//超期option
        departmentOptions:[],//检测部门option
        postOptions:[],//检测岗位option
        isLocale:"",//是否现场
        isCheckout:"",//是否录费
        isCertificate:"",//是否出证
        isException:"",//是否异常
        isOverdue:"",//是否超期
        testDepartment:"",//检测部门名
        deptId:"",//检测部门id
        testPost:"",//检测岗位名
        postId:"",//检测岗位id
      }
    },
    methods:{
      getTableList(){
        ajaxRequest('get','back/index/getAllUnCheckMission',{
          page:this.page,
          rows:this.rows,
          orderProperty:this.orderProperty,
          orderType:this.orderType,
          total:0,
          isLocale:this.isLocale,//是否现场
          isCheckout:this.isCheckout,//是否录费
          isCertificate:this.isCertificate,//是否出证
          isException:this.isException,//是否异常
          isOverdue:this.isOverdue,//是否超期
          departId:this.testDepartment,//检测部门id
          postId:this.postId,//检测岗位id
        },(res)=>{
          if(res.code===200){
            this.tableData=res.rows;
            this.total=res.total;
          }else{
            this.$message.error(res.msg);
          }
        })
      },
      search(){
        this.getTableList();
      },
      setOptions(){
        this.sceneOptions=[{"code":"0","remark":"是"},{"code":"1","remark":"否"},{"code":"","remark":"全部"}];
        this.entryCostOptions=[{"code":"0","remark":"否"},{"code":"1","remark":"是"},{"code":"","remark":"全部"}];
        this.certificateOptions=[{"code":"0","remark":"否"},{"code":"1","remark":"是"},{"code":"","remark":"全部"}];
        this.abnormalOptions=[{"code":"0","remark":"否"},{"code":"1","remark":"是"},{"code":"","remark":"全部"}];
        this.overdueOptions=[{"code":"0","remark":"否"},{"code":"1","remark":"是"},{"code":"","remark":"全部"}];
        ajaxRequest("get","back/depart/list",{isDelete: 0},res => {//部门
            if (res.code === 200) {
              this.departmentOptions = res.rows;
            }
          }
        );
      },
      exportList(){//导出

      },
      back(){//返回
        this.$router.push({
          path: '/admin/600',
          query: {
          }
        })
      },
      getPost(value) {
        this.testPost="";
        this.postId="";
        ajaxRequest( "get","back/user/retrieve",{isDelete: 0,departId:value},res => {
          if (res.code === 200) {
            this.postOptions = res.rows;
          }
        });
      },
      getPostId(value) {
        for(let i=0;i<this.postOptions.length;i++){
          if(this.postOptions[i].postName===value){
            this.postId=this.postOptions[i].id;
          }
        }
      },
      goDepartDetail(rowInfo){//点击部门跳转详情
        this.$router.push({
          path: '/admin/608',
          query:{
            isLocale:this.isLocale,//是否现场
            isCheckout:this.isCheckout,//是否录费
            isCertificate:this.isCertificate,//是否出证
            isException:this.isException,//是否异常
            isOverdue:this.isOverdue,//是否超期
            departId:rowInfo.departId,//检测部门id
            testDepartment:rowInfo.departName,//检测部门名
            postId:rowInfo.postId,//检测岗位id
            testPost: rowInfo.postName,//检测岗位名
          }
        })
      },
      goPostDetail(departRow,postRow){//点击岗位跳转详情
        this.$router.push({
          path: '/admin/608',
          query:{
            isLocale:this.isLocale,//是否现场
            isCheckout:this.isCheckout,//是否录费
            isCertificate:this.isCertificate,//是否出证
            isException:this.isException,//是否异常
            isOverdue:this.isOverdue,//是否超期
            departId:departRow.departId,//检测部门id
            testDepartment:departRow.departName,//检测部门名
            postId:postRow.postId,//检测岗位id
            testPost: postRow.postName,//检测岗位名
          }
        })
      },
      dealDate: function (row, column, cellValue) {
        if(cellValue===""||cellValue===null||cellValue===undefined){
          return "";
        }else{
          return new Date(cellValue).format('YYYY-MM-DD');
        }
      },
      handlePageSizeChange (size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size
        this.getTableList()
      },
      handleCurrentPageChange (currentPage) {
        this.page = currentPage
        this.getTableList()
      },
    },
    mounted(){
      this.setOptions();
      this.getTableList();
    }
  }
</script>

<style scoped>
  .lbCenter{
    width:100% !important;
    text-align: center !important;
    padding-right: 0!important;
  }
</style>
