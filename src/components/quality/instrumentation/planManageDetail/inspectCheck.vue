<!--
  创建核查计划
  PLAN_CLASS 计划种类(0：年度计划 1:实施计划 【3核查计划】)
  PLAN_TYPE 计划类型(0：周检 1：自检 2：外送 :【3：核查】)
 -->

<template>
  <div class="verificationPlan">
    <div style="float:right;">
      <global-tootips>
        <p>1、使用方法：先通过上方查询条件查询结果后，点击“保存计划”按钮创建新的核查计划;</p>
        <p>2、周检计划查询仅查询状态为正常的记录;</p>
        <p>3、若创建人有审核权限，系统默认审核通过;</p>
        <p>4、计划名称:依旧所填入的部门与完成日期自动生成;</p>
        <p>5、开始日期与结束日期默认一年，可修改.</p>
      </global-tootips>
    </div>
    <div>
      <div class="title-item mb20"><span>核查计划</span></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-Row>
          <el-col :span="6">
            <el-form-item label="计划核查日期" prop="searchType">
              <el-select v-model="form.searchType" depart
                         placeholder="请选择">
                <el-option value="2" label="计划日期"></el-option>
                <el-option value="3" label="核查证书日期"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开始日期" prop="beginDate">
              <el-date-picker
                v-model="form.beginDate"
                type="date"
                value-format="yyyy-MM-dd"
                depart
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                value-format="yyyy-MM-dd"
                depart
                :picker-options="{disabledDate:dateLimit}"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-checkbox v-model="checked">日期包含日期为空的记录</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="所属部门" prop="departMent">
              <el-select v-model="form.departMent" @change="planChange"
                         placeholder="请选择">
                <el-option v-for="item in depart" :value="item.id" :label="item.departName" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 完成日期 -->
          <el-col :span="6">
            <el-form-item label="完成日期" prop="finishDate">
              <el-date-picker
                v-model="form.finishDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="planChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="请选择排序方式" prop="orderByProperty">
              <el-select v-model="form.orderByProperty" depart
                         placeholder="请选择">
                <el-option value="0" label="检定日期"></el-option>
                <el-option value="1" label="计划完成日期"></el-option>
                <el-option value="2" label="检定周期"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="orderType">
              <el-select v-model="form.orderType"
                         placeholder="请选择">
                <el-option value="asc" label="升序"></el-option>
                <el-option value="desc" label="降序"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="计划名称" prop="planItem">
              <div class="inputStyle" v-html="form.planItem"></div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 备注 -->
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="bz">
              <el-input v-model="form.bz"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <span slot="footer" class="dialog-footer mb20" style="display: block; text-align: center;margin-top:10px;">
            <el-row>
              <el-button v-if="!inspectCheckId" type="primary" @click="handleQuery">查询</el-button>
              <el-button v-if="!inspectCheckId" type="primary" @click="handleSave">保存计划</el-button>
              <el-button type="warning" @click="handleEmpty">清空</el-button>
              <el-button  @click="handleBack">取消</el-button>
            </el-row>
          </span>
    </div>
    <!-- 序号、设备名称、型号规格、测量范围、准确度等级、出厂编号、设备编号、溯源方式、校检机构、所属部门、保管人、核查方法、计划核查日期； -->
    <div>
      <el-table :max-height="QJTableMaxHeight"
                ref="table"
                border
                :data="tableData"
                @selection-change="selectionChange"
                tooltip-effect="dark">
        <el-table-column type="selection"  width="55"> </el-table-column>
        <el-table-column prop="instrumentationName" label="设备名称"></el-table-column>
        <el-table-column prop="model" label="型号规格"></el-table-column>
        <el-table-column prop="mearsuringRange" label="测量范围"></el-table-column>
        <el-table-column prop="accuracyClass" label="准确度等级"></el-table-column>
        <el-table-column prop="manufacturingCode" label="出厂编号"></el-table-column>
        <el-table-column prop="deviceNumber" label="设备编号"></el-table-column>
        <el-table-column prop="traceWay" label="溯源方式"></el-table-column>
        <el-table-column prop="calibrationInstitutiOn" label="校检机构"></el-table-column>
        <el-table-column prop="department" label="所属部门"></el-table-column>
        <el-table-column prop="keeper" label="保管人"></el-table-column>
        <el-table-column  prop="examineWay"  label="核查方法"></el-table-column>
        <el-table-column  prop="examineScheduleDate"  label="计划核查日期"></el-table-column>
        <el-table-column label="操作" width="60px" v-if="inspectCheckId">
          <template slot-scope="scope">
              <el-button v-mindPopover="{message:'确认删除？',success:handleDelete.bind(this,scope.row),placement:'left'}" type="text"><i class="el-icon-delete iconClass"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
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
  } from "../../../util/base.js";
  import $ from "jquery";

  const defaultInfo = {
    searchType: "2",
    orderType: 'asc',
    orderByProperty: "0",
    beginDate: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),//开始日期，每年的一月一日
    endDate: new Date(new Date().setFullYear(new Date().getFullYear(), 11, 31)),//结束日期，每年的十二月三十一日
    finishDate: undefined,

  };
  export default {
    name: "verification-plan",
    components: {},
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function
      },
      planClass:{
        type:Number
      },
      planType:{
        type:Number
      },
      inspectCheckId:{
        default:undefined,
      }
    },
    mounted(){
      if(this.inspectCheckId){
        // 发送请求
        // 进行form赋值
        this.getFormDetail();
      }
    },
    data() {
      return {
        depart: [],
        tableData: [],
        multipleSelection: [],
        rules: {
          beginDate: [{required: true, message: "内容不能为空"}],
          endDate: [{required: true, message: "内容不能为空"}],
          bz:[{max:200,message:"最多输入200个字符",trigger:'blur'}],
        },
        form: $.extend({}, defaultInfo),
        optCode: 'findHcExport',
        downUrl: '/back/instrumentationExa/findByHeChaCheckExport/',
        checked: false,
      };
    },
    computed: {},
    created() {
      //获取部门
      ajaxRequest("get", "back/depart/list/", {isDelete: 0}, res => {
        this.depart = res.rows;

      });
    },
    methods: {
      //表格选择
      selectionChange(val) {
        let annexs = ''
        if (val.length > 0) {
          for (let i = 0; i < val.length; i++) {
            annexs = val[i].id + ',' + annexs
          }
        }
        if (annexs != '') {
          annexs = annexs.substring(0, annexs.length - 1)
          this.multipleSelection = annexs
        }
      },

      //导出
      handleOut() {
        var param = this.form;
        let url = this.downUrl + this.optCode;
        if ('/njmind/findPage/' == this.findUrl && '' == this.downUrl) {
          url = "/njmind/expExl/" + this.optCode;
        } else if ('' == this.downUrl) {
          url = this.findUrl + this.optCode;
        }
        let form = $("<form></form>").attr("action", url).attr("method", "post");
        form.append($("<input></input>").attr("type", "hidden").attr("name", "isDown").attr("value", "true"));
        for (let p in param) {
          if (p == "searchType") {
            form.append($("<input></input>").attr("type", "hidden").attr("name", 'dateType').attr("value", param[p]));
          } else {
            form.append($("<input></input>").attr("type", "hidden").attr("name", p).attr("value", param[p]));
          }
        }
        form.appendTo('body').submit().remove();
      },
      //查询
      handleQuery() {
        this.$refs.form.validate(valid => {
          if (valid) {
            let form = this.form;
            if (form.beginDate) {
              form.beginDate = formatDate(form.beginDate, 'YYYY-MM-DD')
            }
            if (form.endDate) {
              form.endDate = formatDate(form.endDate, 'YYYY-MM-DD')
            }
            if (form.finishDate) {
              form.finishDate = formatDate(form.finishDate, 'YYYY-MM-DD')
            }
            this.checked == true ? (form.NullDateQuery = "1") : (form.NullDateQuery = "");
            form['instrumentation.department'] = form.departMent
            form.planClass = this.planClass;
            form.planType = this.planType
            ajaxRequest("post", "back/instraumentationTra/findByYQSB", form, res => {
                if (res.code === 200) {
                  if (res.rows.length > 0) {
                    this.tableData = res.rows;
                  } else {
                    this.$message.error("该部门此时间段内没有周检计划");
                  }
                }
              }
            );
          }
        });
      },
      // 保存计划
      handleSave() {
        this.$confirm('确认保存?','提示',{
            center:true,
            type:'warning',
          }).then(()=>{
          this.form.ids = this.multipleSelection
          this.form.planClass = this.planClass;
          this.form.planType = this.planType;
          if (this.multipleSelection.length > 0) {
            ajaxRequest('post', 'back/instraumentationTra/batchSaveCheck', this.form, res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
              }
            })
          } else {
            this.$message.error("请先选择")
          }
        })
      },
      // 返回
      handleBack() {
        this.$emit('back')
      },

      //清空
      handleEmpty() {
        this.form = $.extend({}, defaultInfo);
        this.$refs.form.resetFields();
      },
      //获取部门label值
      getdepartment(value) {
        var obj = {};
        this.depart.find(item => {
          if (item.id === value) {
            obj = item;
          }
        });
        this.departMent = obj.departName;
        return obj.departName
      },
      // 计划名称生成
      planChange() {
        if (this.form.departMent || this.form.finishDate) {
          let departName = this.getdepartment(this.form.departMent)
          this.$set(this.form, 'planItem', `核查计划-${departName ?departName : ' ' }-${this.form.finishDate ? this.form.finishDate : ' '}`)
        }else{
          this.$set(this.form, 'planItem', undefined)
        }
      },
      //表格日期格式化
      dateFormat(row, column, cellValue) {
        if (cellValue) {
          return new Date(cellValue).format("YYYY-MM-DD");
        }
      },
      // 做日期限定
      dateLimit(time) {
        if (this.form.beginDate) {
          return new Date(this.form.beginDate).getTime() > time.getTime()
        } else {
          return false
        }
      },
      // 获取详细信息
      getFormDetail(){
        // if(this.inspectCheckId){
        //   ajaxRequest("get", "back/instraumentationTra/"+this.inspectCheckId, {}, res => {
        //       if (res.code === 200) {
        //         let data = res.daoResult;
        //         let rows = res.rows;
        //         this.form = data;
        //         this.tableData = rows;
        //       }
        //     }
        //   );
        // }
      },
      handleDelete(info){
        // 删除数据
        console.log(info, 'info');
        let instId = info.id;
        let traId = info.traId;
        if(instId && traId){
          ajaxRequest("post", "back/instrumentationTraDetail/deleteBatch", {ids:instId,traId:traId}, res => {
            if (res.code === 200) {
              this.$message.success('删除成功！');
              console.log(res.daoResult, 'res.daoResult');
              if(res.daoResult>0){
                this.getFormDetail();
              }else{
                //仪器设备被删除光了，整个计划都删除了
                //跳转到查询列表页面


              }
            }
          });
        }else{
          this.$message.success('数据存在问题，不可删除！')
        }
      }
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

  .inputStyle {
    color: #606266;
    border: solid 1px #bbb;
    border-radius: 4px;
    padding: 4px;
    min-height: 20px;
    line-height: 20px;
    margin-top: 8px;
  }
</style>

