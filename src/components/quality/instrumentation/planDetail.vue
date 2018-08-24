<template>
    <div class="planDetail">
       <div v-if="!pauseShow">
          <!-- <el-row style="width:100%;">
            <el-col :span="8"><div class="table-content-left">开始日期</div></el-col>
            <el-col :span="16"><div class="table-content-right">{{form.beginDate}}</div></el-col>
          </el-row> -->
          <!-- <el-row v-if="!checked">
          <el-col :span="8"><div class="table-content-left">完成日期</div></el-col>
            <el-col :span="16"><div class="table-content-right">{{form.finishDate}}</div></el-col>
          </el-row> -->
          <el-row >
            <el-col :span="8"><div class="table-content-left">预计外送日期</div></el-col>
            <el-col :span="16"><div class="table-content-right">{{form.sendDate}}</div></el-col>
          </el-row>
          <el-row >
            <el-col :span="8"><div class="table-content-left">预计返库日期</div></el-col>
            <el-col :span="16"><div class="table-content-right">{{form.returnDate}}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="8"><div class="table-content-left">结束日期</div></el-col>
            <el-col :span="16"><div class="table-content-right">{{form.endDate}}</div></el-col>
          </el-row>
          <el-row >
            <el-col :span="8"><div class="table-content-left">项目</div></el-col>
            <el-col :span="16"><div class="table-content-right">{{form.planItem}}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="8"><div class="table-content-left">备注</div></el-col>
            <el-col :span="16"><div class="table-content-right">{{form.planRequire}}</div></el-col>
          </el-row>
          <!-- <el-row>
          <el-col :span="8"><div class="table-content-left borderBottom">部门</div></el-col>
            <el-col :span="16"><div class="table-content-right borderBottom">{{form.departName}}</div></el-col>
          </el-row> -->

          <span slot="footer" class="dialog-footer mb20" style="display: block; text-align: center;margin-top:20px">
            <el-row>
                <el-button type="primary" v-if="outgoing" @click="confirmEnd">确认结束</el-button>
                <el-button type="primary" v-if="outgoing" @click="dialogVisible=true" >延迟结束</el-button>
                <el-button type="warning" @click="auditTra" v-if="form.auditFlag==0" v-has="'M25730'">审核</el-button>
                <el-button type="warning" @click="unAuditTra" v-if="form.auditFlag==1" v-has="'M25730'">取消审核</el-button>
                <el-button type="warning" @click="handleDelete">删除</el-button>
                <el-button @click="handleCancel">返回</el-button>
            </el-row>
          </span>
          <mind-dialog
            title="延迟结束日期"
            v-dialogDrag
            appendToBody
            center
            :visible.sync="dialogVisible"
            dialogSize="mini">
            <el-row>
              <el-col :span="12" :offset="6">
                <el-date-picker
                  v-model="finishDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>

              </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="delayEnd">确 定</el-button>
              <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
          </mind-dialog>
          <el-table :max-height="QJTableMaxHeight"
            ref="table"
            border
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="selectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="assetsNo"
              label="资产编号"
              v-if="checked">
            </el-table-column>
            <el-table-column
              prop="departName"
              label="所属部门">
            </el-table-column>
            <el-table-column
              prop="instrumentationName"
              label="设备名称">
            </el-table-column>
            <el-table-column
              prop="model"
              label="型号规格"
              v-if="checked">
            </el-table-column>
            <el-table-column
              prop="keeperName"
              label="管理人"
              v-if="checked">
            </el-table-column>
             <el-table-column
              prop="calibrationDate"
              label="检定日期"
              :formatter="dealDate"
              v-if="checked">
            </el-table-column>
            <el-table-column
              prop="calibrationCycle"
              label="检定周期"
              v-if="checked">
            </el-table-column>
            <el-table-column
              prop="examineScheduleDate"
              label="计划完成日期"
              :formatter="dealDate"
              v-if="checked">
            </el-table-column>
            <el-table-column
              prop="finishDate"
              label="完成日期"
              :formatter="dealDate"
              v-if="checked">
            </el-table-column>
            <el-table-column
              prop="deviceNumber"
              label="设备编号"
              v-if="!checked">
            </el-table-column>
            <el-table-column
              prop="manufacturingCode"
              label="出厂编号"
              v-if="!checked">
            </el-table-column>
            <el-table-column
              prop="mearsuringRange"
              label="测量范围"
              v-if="!checked">
            </el-table-column>
            <el-table-column
              prop="calibrationInstitutiOn"
              label="检测单位"
              v-if="!checked">
            </el-table-column>
            <el-table-column
              prop="effectiveDate"
              :formatter="dealDate"
              label="有效期"
              v-if="!checked">
            </el-table-column>
            <el-table-column
              prop="scheduleDate"
              label="计划检定日期"
              :formatter="dealDate"
              v-if="!checked">
            </el-table-column>
            <el-table-column  label="暂停项目" v-if="outgoing" width="60">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-view" title="暂停项目"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
      <div v-if="pauseShow">
        <pauseItem :rowId="rowId" @pauseItem="pauseback" :rowInfo="rowInfo"></pauseItem>
      </div>
    </div>
</template>
<script>
import Vue from "vue";
// 引入封装的ajax控件
import {
  ajaxRequest,
  ajaxSyncRequest,
  ajaxProxyRequest,
  formatDate
} from "../../util/base";

import $ from "jquery";
import pauseItem from './pauseItem.vue'
const defaults = {

};
export default {
  name: "verification-plan",
  components: {
    pauseItem
  },
  props: {
    rowInfo:{
      type:Object
    },
    data: {
      type: Object
    },
    callback: {
      type: Function
    },
    beforeClose:Function
  },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      comeback:'',
      outgoing:true,
      finishDate:'',
      dialogVisible:false,
      pauseShow:false,
      rowId:'',
      checked:false,
      form: []
    };
  },
  computed: {},
  created() {
    this.getFormData();
  },
  methods: {
    getFormData(){
      if(this.rowInfo.id){
        //获取列表
        ajaxRequest("get", "back/instraumentationTra/"+this.rowInfo.id*1, {}, res => {
            if (res.code === 200) {
              let data = res.daoResult;
              let rows = res.rows;
              this.form = data;
              this.tableData = rows;
              if(this.form.traceWay==2){
                this.outgoing = true;
              }
              if(this.form.traceWay==1){
                this.checked=true
              }
            }
          }
        );
      }
    },
    //暂停项目
    handleEdit(rowInfo){
      this.rowId=rowInfo.id
      this.pauseShow=true
    },
    //确认结束
    confirmEnd(){
      this.$confirm("确认结束?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        ajaxRequest('put','/back/instraumentationTra/',{isFinish:1,id:this.form.id},res=>{
          if(res.code===200){
            this.$message.success('确认结束成功')
            this.getFormData();
          }else{
            this.$message.error('确认结束失败')
          }
        })
      })

    },
    //延迟结束确定
    delayEnd(){
      if(!!this.finishDate){
        this.$confirm("确认延迟结束?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        }).then(() => {
          ajaxRequest('put','/back/instraumentationTra/',{returnDate:this.finishDate,id:this.form.id},res=>{
            if(res.code===200){
              this.$message.success('延迟结束成功')
              this.dialogVisible = false
              this.getFormData();
            }else{
              this.$message.error('延迟结束失败')
              this.dialogVisible = false
            }
          })
        })
      }else{
        this.$message.error('请选择日期')
      }
    },
    //删除
    handleDelete(){
      if(this.multipleSelection==''){
        this.$message.error('请先选择')
      }else{
        this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        }).then(() => {
          ajaxRequest('post','back/instrumentationTraDetail/deleteBatch',{traId:this.rowInfo.id,ids:this.multipleSelection},res=>{
            if(res.code===200){
              this.$message.success('删除成功')
              ajaxRequest('post',"back/instraumentationTra/findByTraId?id="+this.rowInfo.id,{},res=>{
                if(res.code===200){
                  this.tableData=res.rows
                }
              })
              this.multipleSelection=[]
            }else{
              this.$message.error('删除失败')
            }
          })
        })
      }
    },
    //返回
    handleCancel(){
      this.$emit('show',this.comeback)
    },
    //表格选择
    selectionChange(val) {
      let id=''
      if (val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          id = val[i].id + ',' + id
        }
      }
      if (id != '') {
        id = id.substring(0, id.length - 1)
        this.multipleSelection = id
      }

    },
    //表格日期格式化
    dealDate: function(row, column, cellValue) {
      if (cellValue) {
        return new Date(cellValue).format("YYYY-MM-DD");
      }
    },
    pauseback(data){
      this.pauseShow=data
    },
    //审核计划
    auditTra(){
      if(this.form.id){
        ajaxRequest("post", "back/instraumentationTra/auditTra", {id:this.form.id,auditFlag:1}, res => {
          if (res.code === 200) {
            this.$message.success('审核成功');
            this.form.auditFlag = 1;
          }
        });
      }
    },

    //取消审核
    unAuditTra(){
      if(this.form.id){
        ajaxRequest("post", "back/instraumentationTra/auditTra", {id:this.form.id,auditFlag:0}, res => {
          if (res.code === 200) {
            this.$message.success('取消审核成功');
            this.form.auditFlag = 0;
          }
        });
      }
    }
  },
  updated() {

  }
};
</script>

<style>
.mb20 {
  margin-bottom: 20px !important;
}

.table-content-left {
  border: 1px solid #ddd !important;
  border-right: none !important;
  border-bottom: none !important;
  text-align: center;
  line-height: 40px;
  height: 40px !important;
}
.table-content-right {
  border: 1px solid #ddd !important;
  border-bottom: none !important;
  height: 40px !important;
  line-height: 40px;
  text-align: center;
}
.borderBottom {
  border-bottom: 1px solid #ddd !important;
}
</style>
