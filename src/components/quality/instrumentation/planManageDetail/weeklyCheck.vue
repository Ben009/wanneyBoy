<!--
  创建周检计划 - 年度计划
  PLAN_CLASS 计划种类(0：年度计划 1:实施计划 3核查计划)
  PLAN_TYPE 计划类型(0：周检 1：自检 2：外送 :3：核查)
 -->
<!--
  2.0版本查看详情周检计划需要有存入周检计划 导出Excel 与重新查询三个按钮
  目前页面上缺少的是 导出excel功能， 存入与重新查询具有
 -->

<template>
  <div>
    <div style="float:right;">
      <global-tootips>
        <template v-if="type === 'week'">
          <p>1、使用方法：先通过上方查询条件查询结果后，点击“保存计划”按钮创建新的周检计划；</p>
          <p>2、周检计划查询仅查询状态为正常的记录；</p>
          <p>3、若创建人有审核权限，系统默认审核通过；</p>
          <p>4、开始日期与结束日期默认为一年，可修改</p>
          <p>5、周检计划：依旧填入的部门、完成日期、溯源方式内容自动生成</p>
        </template>
        <template v-else>
          <p>1、使用方法：先通过上方查询条件查询结果后，点击“转入自检任务”按钮创建新的周检计划，并同步将器具转入自检配号；</p>
          <p>2、周检计划查询仅查询状态为正常的记录；</p>
          <p>3、若自检配号中存在未配号的设备，本次将不重复转入，采用抛弃处理；</p>
        </template>
      </global-tootips>
    </div>
    <div>
      <div class="title-item mb20"><span>{{type=="week"?'周检计划':'自检计划'}}</span></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-Row>
          <el-col :span="6">
            <el-form-item label="日期类型" prop="searchType">
              <template slot="label">
                <span>日期类型</span>
                <el-tooltip content="按有效日期或计划校检日期进行查询">
                  <i class="el-icon-info fs12"></i>
                </el-tooltip>
              </template>
              <el-select v-model="form.searchType" style="width:100%"
                         placeholder="请选择">
                <el-option value="0" label="有效日期"></el-option>
                <el-option value="1" label="计划校检日期"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="开始日期" prop="beginDate">
              <el-date-picker
                v-model="form.beginDate"
                type="date"
                @change="judgeDate"
                value-format="yyyy-MM-dd"
                style="width:100%"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                :disabled="!form.beginDate"
                :picker-options="{disabledDate:dateLimit}"
                value-format="yyyy-MM-dd"
                style="width:100%"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-checkbox v-model="checked">选中则将该日期类型为空列入计划中</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="所属部门" prop="departMent">
              <el-select v-model="form.departMent" style="width:100%" @change="planChange"
                         placeholder="请选择">
                <el-option v-for="item in depart" :value="item.id" :label="item.departName" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="完成日期" prop="finishDate">
              <el-date-picker
                v-model="form.finishDate"
                type="date"
                :picker-options="{disabledDate:finishDateLimit}"
                value-format="yyyy-MM-dd"
                style="width:100%"
                placeholder="选择日期"
                @change="planChange">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="请选择排序方式" prop="sortColumn">
              <template slot="label">
                <span>请选择排序方式</span>
                <el-tooltip content="查询结果按该字段进行排序">
                  <i class="el-icon-info fs12"></i>
                </el-tooltip>
              </template>
              <el-select v-model="form.sortColumn" style="width:100%"
                         placeholder="请选择">
                <el-option value="0" label="设备名称"></el-option>
                <el-option value="1" label="型号规格"></el-option>
                <el-option value="2" label="出场编号"></el-option>
                <el-option value="3" label="检校机构"></el-option>
                <el-option value="4" label="证书有效期"></el-option>
                <el-option value="5" label="计划检校期"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="" prop="sortType">
              <el-select v-model="form.sortType"
                         placeholder="请选择">
                <el-option value="asc" label="升序"></el-option>
                <el-option value="desc" label="降序"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="溯源方式" prop="traceWay">
              <template slot="label" v-if="type === 'self'">
                <span>溯源方式</span>
                <el-tooltip content="若溯源方式非自检，请勿选择">
                  <i class="el-icon-info fs"></i>
                </el-tooltip>
              </template>
              <el-select v-model="form.traceWay" style="width:100%"  placeholder="请选择" @change="planChange">
                  <el-option
                    v-for="item in instWayBind"
                    :key="item.code"
                    :label="item.remark"
                    :value="item.code">
                  </el-option>
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
        <!-- <el-row>
          <el-form-item label="备注" prop="planRequire">
            <el-input v-model="form.planRequire"></el-input>
          </el-form-item>
        </el-row> -->

      </el-form>
      <span slot="footer" class="dialog-footer mb20" style="display: block; text-align: center;margin-top:10px;">
            <el-row>
                <el-button v-if="!weeklyCheckId && !selfCheckInfo" type="primary" @click="handleQuery(null)">查询</el-button>
                <!-- 周检任务与自检计划的区别 -->
                <template v-if="type === 'week'">
                  <el-button v-if="!weeklyCheckId" type="primary" @click="hadleSearch" :disabled="!multipleSelection.length">保存计划</el-button>
                  <el-button type="warning" v-if="!weeklyCheckId"  @click="handleEmpty">清空</el-button>
                  <el-button type="warning" v-if="weeklyCheckId && form.auditFlag==0" v-has="'M25730'"  @click="auditPlan">审核</el-button>
                  <el-button type="warning" v-if="weeklyCheckId && form.auditFlag==1" v-has="'M25730'"  @click="unAuditPlan">取消审核</el-button>
                </template>
                <template v-else>
                    <el-button type="primary" @click="trunToTask" :disabled="!multipleSelection.length">转入自检任务</el-button>
                </template>
                <el-button @click="handleBack">{{type==='week'?'返回':'取消'}}   </el-button>
            </el-row>
          </span>
    </div>
    <div>
      <el-table :data="tableData" @selection-change="selectionChange">
        <!-- 序号、设备名称、型号规格、测量范围、准确度等级、出厂编号、设备编号、溯源方式、校检机构、所属部门、保管人、有效日期； -->
        <el-table-column type="selection"  width="55"> </el-table-column>
        <el-table-column label="设备名称" prop="instrumentationName"></el-table-column>
        <el-table-column label="型号规格" prop="model"></el-table-column>
        <el-table-column label="测量范围" prop="mearsuringRange" :formatter="htmlFormat"></el-table-column>
        <el-table-column label="准确度等级" prop="accuracyClass" :formatter="htmlFormat"></el-table-column>
        <el-table-column label="出厂编号" prop="manufacturingCode"></el-table-column>
        <el-table-column label="设备编号" prop="deviceNumber"></el-table-column>
        <el-table-column label="溯源方式" prop="traceWay" :formatter="traceWayFormat"></el-table-column>
        <el-table-column label="校检机构" prop="calibrationInstitutiOn"></el-table-column>
        <el-table-column label="所属部门" prop="departName"></el-table-column>
        <el-table-column label="保管人" prop="keeperName"></el-table-column>
        <el-table-column label="有效日期" prop="effectiveDate" :formatter="dateFormat"></el-table-column>
        <el-table-column label="操作" width="60px" v-if="weeklyCheckId || selfCheckInfo">
          <template slot-scope="scope">
              <el-button v-mindPopover="{message:'确认删除？',success:handleDelete.bind(this,scope.row),placement:'left'}" type="text"><i class="el-icon-delete iconClass"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
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


  </div>
</template>
<script>
  import Vue from 'vue'
  import $ from 'jquery'
  import {ajaxRequest,ajaxProxyRequest,formatDate} from '../../../util/base.js';
  import formatTable from '../format.js'

  const defaultInfo = {
    searchType: '0',//查询日期类型
    planClass: '0',//计划类型
    beginDate: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),//起始日期 每年的1月1号
    endDate: new Date(new Date().setFullYear(new Date().getFullYear(), 11, 31)),//截止日期 每年的12月31号
    finishDate: undefined,//完成日期
    departMent: undefined,//所属部门
    sortColumn: '0',//排序字段  有效期、设备编号、所属部门
    sortType: 'asc',//排序类型
    planItem: undefined,//计划名称
    traceWay: [],// 溯源方式**********************
    // 备注**********************
  }
  const selfInfo = {
    searchType: '0',//查询日期类型
    planClass: '0',//计划类型
    beginDate: undefined,//起始日期
    endDate: undefined,//截止日期
    finishDate: undefined,//完成日期
    departMent: undefined,//所属部门
    sortColumn: '0',//排序字段  有效期、设备编号、所属部门
    sortType: 'asc',//排序类型
    planItem: undefined,//计划名称
    traceWay: [],// 溯源方式**********************
    // 备注**********************
  }
  export default {
    name: 'weeklyCheck',
    components: {},
    props: {
      // 周检为week
      // 自检为self
      type: {
        type: String,
        required: true,
      },
      //计划种类(0：年度计划 1:实施计划 3核查计划)
      planClass: {
        type: Number
      },
      //0：周检 1：自检 2：外送 :3：核查
      planType: {
        type: Number
      },
      // 传入周检信息id
      weeklyCheckId:{
        default:'',
      },
      // 传入查看自检信息
      selfCheckInfo:{
        default:'',
      },

    },
    data() {
      return {
        form: this.type === 'week' ? $.extend({}, defaultInfo) : $.extend({}, selfInfo),
        rules: {
          beginDate: [{required: true, message: '开始日期不能为空', trigger: 'change'}],
          endDate: [{required: true, message: '结束日期不能为空', trigger: 'change'}],
          finishDate: [{required: true, message: '完成日期不能为空', trigger: 'change'}],
          planRequire:[{max:200,message:'最多不能超过200个字符',trigger:'blur'}],
        },
        checked: false,//选中日期的标志位
        tableData: [],
        // 分页相关
        page: 1,
        rows: 10,
        total: 0,

        depart: [],
        instWayBind:[],//周检计划溯源方式
        multipleSelection:'',
      }
    },
    mixins:[formatTable],
    mounted() {
      this.initData();
      if(this.weeklyCheckId){
        this.getFormDetail();
      }
      if(this.selfCheckInfo){
        // 查看自检信息
      }
    },
    methods: {
      dateFormat(row,column,cellValue){
        if(cellValue){
          return new Date(cellValue).Format('yyyy-MM-dd');
        }
      },
      //表格选择
      selectionChange(val) {

        let annexs=''
        if (val.length > 0) {
          for (let i = 0; i < val.length; i++) {
            annexs = val[i].id + ',' + annexs
          }
        }
        if (annexs != '') {
          annexs = annexs.substring(0, annexs.length - 1)
          this.multipleSelection = annexs
        }else{
          this.multipleSelection = ''
        }
      },

      // 初始数据加载
      initData() {
        this.getDepart();
        this.getIsUrgent();
       // this.handleQuery();
      },
      // 查询
      handleQuery(flag) {
        this.$refs.form.validate(valid => {
          if (valid) {
            let form = this.form;
            // 对溯源方式去重
            if(form.beginDate){
              form.beginDate = formatDate(form.beginDate, 'YYYY-MM-DD')
            }
            if(form.endDate){
              form.endDate = formatDate(form.endDate, 'YYYY-MM-DD')
            }
            if(form.finishDate){
              form.finishDate = formatDate(form.finishDate, 'YYYY-MM-DD')
            }
            this.checked == true ? (form.NullDateQuery = "1") : (form.NullDateQuery = "");
            form['instrumentation.department'] = form.departMent
            form.planClass = this.planClass;
            form.planType = this.planType;
            // 点击查询按钮从第一页开始显示，其他的查询方式接着当前的页面进行显示
            console.log(flag,'flag===')
            let param = $.extend({},this.form,{page:flag ?this.page:this.page = 1,rows:this.rows,total:0})
            ajaxRequest("post", "back/instraumentationTra/findByYQSB", param, res => {
                if (res.code === 200) {
                  if (res.rows.length > 0) {
                    this.tableData = res.rows;
                    this.total = res.total;
                  } else {
                    this.$message.error("该部门此时间段内没有周检计划");
                  }
                }
              }
            );
          }
        });
      },
      //获取溯源方式
      getIsUrgent() {
        ajaxProxyRequest('get', '/njmind/findParams/instWayBind', {}, (res) => {
          this.instWayBind = res.instWayBind.list
          console.log(this.instWayBind,'溯源方式')
        })
      },

      //获取部门
      getDepart(){
        ajaxRequest("get", "back/depart/list/", {isDelete: 0}, res => {
            if (res.code === 200) {
              this.depart = res.rows;
            }
          }
        );
      },
      // 保存计划
      hadleSearch() {
        if(this.multipleSelection.length>0){
          this.form.ids=this.multipleSelection
          this.form.planClass = this.planClass;
          this.form.planType = this.planType;
          this.$confirm('确认保存?','提示',{
            center:true,
            type:'warning',
          }).then(()=>{
            ajaxRequest('post','back/instraumentationTra/batchSaveCheck',this.form,res=>{
              if(res.code===200){
                this.$message.success(res.msg)
              }
            })
          })
        }else{
          this.$message.error("请先选择")
        }
      },
      // 清空
      handleEmpty() {
        this.form = $.extend({}, defaultInfo)
      },
      // 返回
      handleBack() {
        this.$emit('back')
      },
      handlePageSizeChange(size) {
        this.page = 1;
        this.rows = size;
        this.handleQuery(true);
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage,
          this.handleQuery(true);
      },
      // 结束日期时间限定
      dateLimit(time) {
        if (this.form.beginDate) {
          return new Date(this.form.beginDate).getTime() > time.getTime()
        } else {
          return false
        }
      },
      // 完成日期的限定
      finishDateLimit(time){
        if(this.form.beginDate){
          return new Date(this.form.beginDate).getTime() > time.getTime();
        }else{
          return false
        }
      },
      // 溯源方式改变
      planChange() {
        if (this.form.departMent || this.form.finishDate || this.form.traceWay) {
          let traceWayInfo = '', departInfo = '';
          this.instWayBind.forEach((value,index)=>{
            if(value.code ==  this.form.traceWay){
              traceWayInfo = value.remark
            }
          })
          this.depart.forEach((v, i) => {
            if (this.form.departMent == v.id) {
              departInfo = v.departName
            }
          })
          this.$set(this.form, 'planItem', `周检计划-${departInfo}-${this.form.finishDate ? this.form.finishDate : ''}-${traceWayInfo}`);
        }else{
          this.$set(this.form, 'planItem', undefined);
        }
      },
      // 转入自检任务
      trunToTask() {
        this.$confirm('是否确认确认自检任务？转入后需通过委托－自检要号进行配号操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning'
        }).then(() => {
          ajaxRequest("post", "back/instrmentationAud/insertTraDetailBatch", {ids:this.multipleSelection,source:2}, res => {
              this.handleQuery(true);
              if(res.code === 200){
                this.$message.success('转入成功！')
                }
            });
        })
      },
      //获取计划明细
      getFormDetail(){
        if(this.weeklyCheckId){
          ajaxRequest("get", "back/instraumentationTra/"+this.weeklyCheckId, {}, res => {
              if (res.code === 200) {
                let data = res.daoResult;
                let rows = res.rows;
                this.form = data;
                this.tableData = rows;
                this.total = res.total;
              }
            }
          );
        }
      },
      // 删除
      handleDelete(info){
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
      },
      //审核计划
      auditPlan(){
        if(this.weeklyCheckId){
          ajaxRequest("post", "back/instraumentationTra/auditTra", {id:this.weeklyCheckId,auditFlag:1}, res => {
            if (res.code === 200) {
              this.$message.success('审核成功');
              this.form.auditFlag = 1;
            }
          });
        }
      },
      //取消审核
      unAuditPlan(){
        if(this.weeklyCheckId){
          ajaxRequest("post", "back/instraumentationTra/auditTra", {id:this.weeklyCheckId,auditFlag:0}, res => {
            if (res.code === 200) {
              this.$message.success('取消审核成功');
              this.form.auditFlag = 0;
            }
          });
        }
      },
      // 开始日期取消选中时触发的方法
      judgeDate(time){
        // 结束日期存在且开始日期为空
        if(this.form.endDate && !this.form.beginDate){
          Vue.set(this.form,'endDate',undefined);
        }
        // 完成日期存在且开始日期为空
        if(this.form.finishDate && !this.form.beginDate ){
          Vue.set(this.form,'finishDate',undefined);
        }
        // 开始结束日期存在判断两者的大小
        if(this.form.beginDate && this.form.endDate){
          if(this.form.beginDate > this.form.endDate){
            Vue.set(this.form,'endDate',undefined);
          }
        }
        // 开始完成日期存在，判断两者的大小
        if(this.form.beginDate && this.form.finishDate){
          if(this.form.beginDate > this.form.finishDate){
            Vue.set(this.form,'finishDate',undefined);
          }
        }

      }
    }
  }
</script>
<style scoped>
  .fs12 {
    font-size: 12px;
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

  .fs12 {
    font-size: 12px;
  }
  .iconClass{
    font-size: 16px;
  }
</style>


