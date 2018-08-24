<template>
      <!--  核查信息 -->
    <div :class="{'quotationState-item':true,'eventPause':info == 'traceabilityConfirm'}">
      <div class="title-item mb20"><span>核查信息</span>
        <global-tootips style="float:right;">
          <span>点击计算将自动计算核查证书日期与计划核查日期</span>
        </global-tootips>
      </div>
      <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="130px">
        <el-row>
          <!-- ************未做处理************ -->
          <el-col :span="12">
            <el-form-item label="是否核查">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--********************************* -->
           <el-col :span="12">
            <el-form-item label="核查方法" prop="examineWay">
              <el-select v-model="form.examineWay"  allow-create filterable
                         placeholder="请选择">
                <el-option
                  v-for="item in examineWays"
                  :key="item.code"
                  :label="item.remark"
                  :value="item.remark"
                  class="allwidth">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-Row>
          <el-col :span="12">
            <el-form-item label="核查计划日期" prop="examineScheduleDate">
              <el-date-picker
                v-model="form.examineScheduleDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" class="allwidth">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
           <el-form-item label="核查周期(月)" prop="examineCycle">
              <el-input v-model="form.examineCycle">
                <template slot="append" class="cursor">
                  <i  class="el-icon-date cursor" @click="computeDate" title="计算"></i>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

        </el-Row>
        <el-row>
          <el-col :span="12">
            <!-- 核查报告日期 -->
            <el-form-item label="核查证书日期" prop="certificateDate">
               <el-date-picker
                v-model="form.certificateDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" class="allwidth">
              </el-date-picker>
            </el-form-item>
          </el-col>
           <el-col :span="12">
             <!-- 预计下次核查时间 -->
            <el-form-item label="计划核查日期" prop="nextDate">
              <el-date-picker
                v-model="form.nextDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" class="allwidth">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-Row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item label="核查证书" prop="certificateId">
              <mind-upload ref="upFiles" :limitNumb="limitNumb" :callBack="callBack" :fileList="fileList"></mind-upload>
              <!-- <el-input v-model="form.attachment" v-show="false"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
      <el-row v-if="!toggle">
        <el-button type="primary"   @click="save">保存</el-button>
        <el-button type="warning"   @click="empty">清空</el-button>
      </el-row>
      <el-row v-if="toggle">
        <el-button type="primary"   @click="edit">编辑</el-button>
        <el-button type="primary"   @click="cancel">取消</el-button>
      </el-row>
    </span>
    <div class="title-item mb20"><span>检查信息更新记录</span></div>
     <el-table :max-height="QJTableMaxHeight"
      :data="tableData"
      border
      style="width: 100%;margin-top:20px">
    <el-table-column type="index" label="序号">
    </el-table-column>
    <el-table-column prop="examineWay" label="核查方法"  width="180">
    </el-table-column>
    <el-table-column
      prop="examineScheduleDate"
      :formatter="dealDate"
      label="核查计划日期">
    </el-table-column>
     <el-table-column
      prop="examineCycle"
      label="核查周期">
    </el-table-column>
    <el-table-column
      prop="certificateDate"
      :formatter="dealDate"
      label="核查证书日期">
    </el-table-column>
     <el-table-column
      prop="nextDate"
      :formatter="dealDate"
      label="计划核查日期">
    </el-table-column>
    <el-table-column
      prop="updateUser"
      label="操作人">
    </el-table-column>
     <el-table-column
      prop="updateTime"
      label="操作时间"
      :formatter="dealDate"
      width="180">
    </el-table-column>
    <el-table-column
      prop="handle"
      label="操作"
      width="120">
      <template slot-scope="scope">
        <!-- 待做 -->
        <!-- <el-button type="text" style="padding:0;font-size:14px;">
          <i class="el-icon-tickets" title="查看证书"></i>
        </el-button> -->
        <el-button @click="detail(scope.row)" type="text" class="iconClass">
          <i class="el-icon-edit" title="详情"></i>
        </el-button>
        <el-button  v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,[scope.row]),placement:'left'}"   type="text" class="iconClass">
          <i class="el-icon-delete" title="删除"></i>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
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
} from "../../../util/base.js";


import $ from "jquery";
import rightclick from "../../../../directives/rightcilck.js";
import rightClick from "../../../../mixins/FormRightClick.js";
const defaultInfo={
  status:1
}

export default {
  name: "quotation-state",
  components: {},
  props: {
    instId:{
      // type:Number,
      default:''
    },
    standardId:{
       type:Number
    },
    data: {
      type: Object
    },
    callback: {
      type: Function
    },
    info:{
      type:String,
      default:'',
    }
  },
  data() {
    return {
      tableData: [],
      rules: {
        examineCycle: [{validator:(rule,value,callback)=>{
          if(!!value){
            if(!(/[0-9]/g.test(value))){
              callback(new Error("只能输入数字"))
            }else if(value.toString().length>2){
              callback(new Error("最大为两位数"))
            }else{
              callback()
            }
          }else{
            callback()
          }
        },trigger:"blur"}],
        examineWay:[{required:true,message:'核查方法不能为空'}],
        remark:[{max:200,message:'最多输入200个字符',trigger:'blur'}],
      },
      examineWays: [],
      form:$.extend({},defaultInfo),
      fileList: [], //上传的文件
      limitNumb: 3,
      toggle:false,//保存与编辑的显示按钮
      editId:''
    };
  },
  computed: {},
  directives: { rightclick },
  mixins: [rightClick],

  methods: {
    // 核查方法
    getExamineWay(){
      ajaxProxyRequest("get", "/njmind/findParam/examineWay", {}, res => {
        this.examineWays = res.list;
      });
    },

    //清空
    empty(){
      this.form = $.exnted({},defaultInfo);
      this.$refs.form.resetFields();
      this.$refs.upFiles.deleteFile()
    },
    //编辑
    edit(){
      let _this = this;
      let annexs = ''
      if (this.fileList.length > 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          annexs = this.fileList[i].id + ',' + annexs
        }
      }
      if (annexs != '') {
        annexs = annexs.substring(0, annexs.length - 1)
        this.form.certificateId = annexs
      }
      this.form.id=this.editId;
      this.$confirm("确认编辑?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
        ajaxRequest('PUT',"back/instrumentationExa/",this.form,res=>{
         if (res.code == 200) {
           this.$message.success("编辑成功");
           this.toggle = false;
           this.$refs.form.resetFields();
           this.$refs.upFiles.deleteFile();
           this.getTableList();
           this.form = $.extend({},defaultInfo)
          } else {
            this.$message.error("编辑失败");
          }
        })
      })
    },
    //取消
    cancel(){
      this.toggle=false,
      this.$refs.form.resetFields();
      this.$refs.upFiles.deleteFile();
    },
    //详情
    detail(row) {
      console.log(row)
      this.toggle=true
      this.editId=row.id
      this.$refs.form.resetFields();
      if(row.certificateId){
        this.$refs.upFiles.loadAttacheIds(row.certificateId);
      }
      this.form = Object.assign(
        {},
        {
          certificateDate: row.certificateDate,
          examineCycle: row.examineCycle,
          examineScheduleDate: row.examineScheduleDate,
          certificateNo: row.certificateNo,
          examineWay: row.examineWay,
          nextDate: row.nextDate,
          remark: row.remark
        }
      );
    },
     //表格时间格式化
    dealDate: function(row, column, cellValue) {
      if(!cellValue){
        return '';
      }
      return new Date(cellValue).format("YYYY-MM-DD");
    },

    //获取核查记录
    getTableList(){
      if(this.standardId){
        ajaxRequest( "get","back/instrumentationExa/getInstrmentationExaByInstId?instId="+this.standardId, {},  res => {
            this.tableData = res;
          }
        );
      }
    },
    //删除数据
    handleDelete: function(data) {
      // this.tableData.splice(data[0].id, 1);
      if (data.length > 0) {
        let ids = data
          .map(function(v) {
            return v.id;
          })
          .join(",");
        this.$confirm("确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          ajaxRequest( "PUT", "back/instrumentationExa/", { isDelete: 1, id: ids }, res => {
              if (res.code == 200) {
                this.$message.success("删除成功");
                this.getTableList();
              } else {
                this.$message.error("删除失败");
              }
            }
          );
        });
      } else {
        this.$message.warning("请先选择要删除的数据");
      }
    },

    //callBack上传组件数据发生变化回调
    callBack(file, list) {
      this.fileList = list;
    },

    //计算日期
    computeDate() {
      if (this.form.examineCycle !== "") {
        if (this.form.examineCycle.length <= 2&&this.form.examineCycle.match(/[0-9]/g)) {
          // this.form.examineCycle  核查周期
          //计算证书有效日期
          let now = new Date(this.form.examineScheduleDate); // 获取需要计算的时间
          let monthNow = new Date(
            now.setMonth(now.getMonth() + Number(this.form.examineCycle))
          );
          // 计算增加(核查周期)月的时间
          let certificateDate = new Date(
            monthNow.setDate(monthNow.getDate() - 1)
          ); // 计算增加(核查周期)月减去一天的时间

          // 计算计划核查周期
          let monthNow1 = new Date(now.setMonth(now.getMonth() - 1)); // 计算增加(核查周期)月的时间
          let nextDate = new Date(
            monthNow1.setDate(monthNow1.getDate())
          ); // 计算增加(核查周期)月减去一个月的时间

          Vue.set(
            this.form,
            "certificateDate",
            new Date(certificateDate).Format("yyyy-MM-dd")
          );
          Vue.set(
            this.form,
            "nextDate",
            new Date(nextDate).Format("yyyy-MM-dd")
          );
        }
      } else {
        this.$message.error("请先填写核查周期");
      }
    },
    //保存
    save() {
      let annexs = ''
      if (this.fileList.length > 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          annexs = this.fileList[i].id + ',' + annexs
        }
      }
      if (annexs != '') {
        annexs = annexs.substring(0, annexs.length - 1)
        this.form.certificateId = annexs
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm("确认保存?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
            type: "warning"
          }).then(() => {
            this.form.instId=this.instId
            ajaxRequest("post", "back/instrumentationExa/", this.form, res => {
              if (res.code === 200) {
                this.$message.success("保存成功");
                this.$refs.form.resetFields();
                this.$refs.upFiles.deleteFile();
                this.getTableList();
              }
            });
          });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.getExamineWay();
    this.getTableList();
  }
};
</script>

<style scoped>
.mb20 {
  margin-bottom: 20px !important;
}
.allwidth{
  width: 100% !important;
}
.eventPause{
  pointer-events: none;
}
.special{
  pointer-events: all;
}
.cursor{
  cursor: pointer;
  font-size: 20px;
}
.iconClass{
  font-size: 16px;
}
</style>
