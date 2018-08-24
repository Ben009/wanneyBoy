<template>
	<div class="applyForm">
	 	<!-- ********************************************* 登记号信息 start ********************************************* -->
		<div class="title-item mb20">
      <span>登记号信息</span>
      <!-- <div class="el-icon-info shuoming">
        <el-row class="el-sm">
          <template v-if="type == 'refund'">
            <p>1、若分号无法选中，表示该号已退件或已出具证书/原始记录,无法申请;</p>
            <p>2、若申请人有一级审核权限，保存时系统自动通过一级审核；</p>
          </template>
          <template v-else>
            <p>若本人有一级审核权限，默认通过</p>
          </template>
        </el-row>
      </div> -->
      <div style="display:inline-block;float:right">
        <global-tootips>
            <template v-if="type == 'refund'">
              <p>1、若分号无法选中，表示该号已退件或已出具证书/原始记录,无法申请;</p>
              <p>2、若申请人有一级审核权限，提交时系统自动通过一级审核；</p>
            </template>
            <template v-else>
              <p>若本人有一级审核权限，默认通过</p>
            </template>
        </global-tootips>
      </div>
    </div>
		<el-form class="registrationForm" label-width="160px" size="mini">
			<el-row>
        <el-col>
          <el-form-item label="委托单位：">
            {{registrationDetail.companyName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登记号：">
            {{registrationDetail.registrationNo}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="器具名称：">
            {{registrationDetail.applianceName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="套数：">
            {{registrationDetail.setNumber}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测期限：">
            {{registrationDetail.detectionDeadline}}
          </el-form-item>
        </el-col>
      </el-row>
		</el-form>
		<!-- ********************************************* 登记号信息 end ********************************************* -->
		<!-- ********************************************* 申请信息 start ********************************************* -->
		<div class="title-item mb20 mt20"><span>申请信息</span></div>
		<el-form ref="applyForm" :model="applyForm" :rules="applyRules" label-width="160px">
			<el-row>
        <el-col class="el-form-item is-error is-required">
          <el-form-item label="分号" prop="samplesCheckList" v-if="type == 'refund'">
            <el-checkbox-group v-model="applyForm.samplesCheckList">
              <!-- <el-tooltip  :key="index" :content="temp.reason" :disabled="!temp.reason"> -->
                <el-checkbox v-for="(temp,index) in applyForm.samples" v-mindTooltip="{message:temp.reason,show:!!temp.reason}" :disabled="!!temp.reason" :label="temp" :key="index">{{temp.sampleBh}}</el-checkbox>
              <!-- </el-tooltip> -->
					  </el-checkbox-group>
            <div class="applyFormJumper">
              <el-button  @click="checkAllSelection">全选</el-button>
              <el-button  @click="clearAllSelection">清空</el-button>
            </div>
          </el-form-item>
          <el-form-item  prop="newDate" v-if="type == 'delay'">
            <template slot="label">
                <span>新检测期限</span>
                <el-tooltip content="请选择您希望延期的日期">
                  <i class="el-icon-info" style="fontSize:12px;"></i>
                </el-tooltip>
            </template>
            <el-date-picker
              class="wdFull"
              :editable="false"
              v-model="applyForm.newDate"
              :picker-options="{disabledDate:dateLimit}"
              type="date"
              placeholder="新检测期限">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="el-form-item  is-required">
          <el-form-item label="申请原因" prop="applyReason">
            <!-- 做成下拉框 -->
            <el-select v-model="applyForm.applyReason">
              <el-option v-for="item in applyReason"
              :value="item.code"
              :label="item.remark"
              :key="item.code">

              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="el-form-item ">
          <!-- 申请的备注 -->
          <el-form-item label="备注" prop="applyBz">
            <el-input v-model="applyForm.applyBz"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="联系信息" prop="telephone">
            <template slot="label">
              <span>联系信息</span>
              <el-tooltip>
                <i class="el-icon-info fs12"></i>
                <div slot="content">通常填写联系客户沟通异常事情的联系人、联系电话信息，表示已由该人员联系</div>
              </el-tooltip>
            </template>
            <el-input v-model="applyForm.telephone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请人" prop="">
            <el-input v-model="applyForm.standardCerNo" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请日期" prop="">
            <el-date-picker
	            class="wdFull"
              :disabled="true"
	            :editable="false"
	            v-model="applyForm.standardValidDate"
	            type="date"
            	placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
		</el-form>
		<!-- ********************************************* 申请信息 end ********************************************* -->
		<!-- ********************************************* 提交操作 start ********************************************* -->
		<footer class="flex footer">
			<el-button type="primary" @click="submitApplyForm">提交</el-button>
			<el-button @click="goBack">返回</el-button>
		</footer>
		<!-- ********************************************* 提交操作 end ********************************************* -->
    <!-- *********************************************历史申请记录 start************************************************ -->
    <div>
      <div class="title-item mb20"><span>历史申请信息</span></div>
      <el-table :data="abnormalList" :max-height="QJTableMaxHeight" >
        <!-- <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column label="信息1">
        </el-table-column>
        <el-table-column label="信息2">
        </el-table-column>
        <el-table-column label="信息3">
        </el-table-column>
        <el-table-column label="信息4">
        </el-table-column> -->
        <!-- <el-table-column
		      prop="registrationNo"
		      show-overflow-tooltip
		      label="登记号">
		    </el-table-column> -->
		    <!-- <el-table-column
		      prop="companyName"
		      show-overflow-tooltip
		      label="委托单位">
		    </el-table-column>
		    <el-table-column
		      prop="applianceName"
		      show-overflow-tooltip
		      label="器具名称">
		    </el-table-column> -->
		    <el-table-column
		      prop="applyType"
		      :formatter="formatApplyType"
		      show-overflow-tooltip
		      label="异常类型">
		    </el-table-column>
		    <el-table-column
		      prop="applyDate"
		      :formatter="formatApplyTime"
		      show-overflow-tooltip
		      label="申请时间">
		    </el-table-column>
		    <el-table-column
		      prop="addUserName"
		      show-overflow-tooltip
		      label="申请人">
		    </el-table-column>
		    <el-table-column
		      prop="applyReason"
		      show-overflow-tooltip
		      label="申请原因">
          <template slot-scope="reason">
            {{reason.row.applyReason | reasonFormat(reason.row.applyType,otherReasonList,anotherReasonList)}}
          </template>
		    </el-table-column>
		    <el-table-column
		      prop="applyBz"
		      show-overflow-tooltip
		      label="备注">
		    </el-table-column>
		    <el-table-column
		      prop="bmShFlag"
		      show-overflow-tooltip
		      label="一审(审核人/审核时间/意见)">
          <template slot-scope="one">
              <span>{{one.row.bmShFlag | presonFormat(one.row)}}|{{one.row.bmShTime | timeFormat}} | {{ one.row.bmShRemark }}</span>
          </template>
		    </el-table-column>
		    <el-table-column
		      prop="shFlag"
		      show-overflow-tooltip
		      label="二审(审核人/审核时间/意见)">
          <template slot-scope="two">
              <span>{{two.row.shPersonName}} | {{two.row.shTime | timeFormat}} | {{two.row.shRemark }}</span>
          </template>
		    </el-table-column>
      </el-table>
    </div>
    <!-- ***********************************************历史申请记录  end******************************************* -->
	</div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/components/util/base';
	import abnormalCommon from '../abnormalList/mixins/abnormalCommon';//混入的数据，用于列表显示数据格式化
  const defaults = {
    standardCerNo: localStorage.getItem('userName'),
    standardValidDate: Date.now(),
    samplesCheckList:[],
  }
	export default {
    name: 'applyForm',
    mixins:[abnormalCommon],
    props:{
      // 退件为 refund  延期为 delay
      // type:{
      //   type:String
      // }
    },
    filters:{
      timeFormat:function(value){
        if(value){
          return new Date(value).format('YYYY-MM-DD');
        }else{
          return '';
        }
      },
      presonFormat:function(value,data){
        let temp = {0:'未审核',1:'审核通过',2:'退回',3:'本人撤回'}
        if(data.bmShPersonName){
          if(value == 3){
            return temp[value];
          }
          return `${data.bmShPersonName}`
        }else{
          return temp[value]
        }
      },
      // 对申请原因进行数据格式化
      reasonFormat : function(value,info,otherReasonList,anotherReasonList){
        // 1 退件  2 延期
        // another 退件   other 延期
        let name = ''
        if(info == 1){
          anotherReasonList.forEach((v,i)=>{
            if(v.code == value){
              name = v.remark;
              return
            }
          })
        }else{
          otherReasonList.forEach((v,i)=>{
            if(v.code == value){
              name = v.remark;
              return 
            }
          })
        }
        return name;
      }
    },
		data(){
      let telephoneCheck = (rule,value,cb)=>{
        if(value){
          let reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/g
          let ruleRex = /^((1[3,5,8,7,9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/g;
          if(value.length>20){
            cb(new Error('最多输入20位字符'))
          }else{
            if(reg.test(value)){
              cb()
            }else{
              if(ruleRex.test(value)){
                cb()
              }else{
                cb(new Error('请输入正确的号码格式'))
              }
            }
          }
        }else{
          cb()
        }
      }
      let samplesCheckListCheck = (r,v,cb)=>{
        if(this.clearFlag){
          this.clearFlag = false;
          cb()
        }else{
          if(v.length){
            cb()
          }else{
            cb(new Error('请至少选择1个分号'))
          }
        }
      }
			return {
        // 申请信息提交字段
				applyForm:Object.assign({},defaults),
        // 申请信息校验规则
				applyRules:{
          samplesCheckList:[{ required: true, validator:samplesCheckListCheck,trigger: 'change'}],
          applyReason:[{required:true,message:'申请原因不能为空',trigger:'change'}],
          applyBz:[{required:false,max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          newDate:[{ required: true, message: '请选择新检测日期'}],
          telephone:[{validator:telephoneCheck,trigger:'blur'}]
        },
        // 登记号信息
        registrationDetail:{},
        abnormalList:[],
        applyReason:[],
        //点击清空之后页面不显示提示
        clearFlag:false,
        // table申请原因
        anotherReasonList:[],  //refund
        otherReasonList:[],   //delay
			}
		},
    computed: {
      // 登记号
      registrationNo(){
        return this.$store.state.Procedure.registrationInfo.registrationNo
      },
      type(){
        return this.$store.state.Procedure.registrationInfo.type
      }
    },
    methods: {
      /******************************************** 分号操作 start **************************************/
      /**
       * [checkAllSelection 选中全部的分号]
       * @return {[type]} [description]
       */
      checkAllSelection(){
        let tempArray = [];
        this.applyForm.samples.forEach(val => {
          if(val.reason === ''){
            tempArray.push(val)
          }
        })
        this.applyForm.samplesCheckList = tempArray
      },
      /**
       * [clearAllSelection 清除全部得分号]
       * @return {[type]} [description]
       */
      clearAllSelection(){
        this.clearFlag = true ;
        this.applyForm.samplesCheckList = [];
      },
      /******************************************** 分号操作 end **************************************/

      /******************************************** 表单操作 start **************************************/
      submitApplyForm(){
        this.$refs.applyForm.validate((valid) => {
          if(valid){
            this.$confirm('确认提交申请?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center:true,
              type: 'warning'
            }).then(res => {
              if (this.applyForm.newDate) {
                this.applyForm.newDate = formatDate(this.applyForm.newDate, 'YYYY-MM-DD')
              }
              this.$store.dispatch('submitApplyForm',{
                registrationNo: this.registrationNo, // 登记号
                applyType:this.type == 'refund' ? '1' : '2', // 申请类型：1退，2延期
                ts:this.type == 'refund' ? this.applyForm.samplesCheckList.length : this.applyForm.samples.length, // 本次申请套数
                newDate:this.applyForm.newDate, // 延期后日期
                detectionDeadline:this.registrationDetail.detectionDeadline, // 原检测期限
                applyReason:this.applyForm.applyReason, // 申请原因
                samples:this.type == 'refund' ? JSON.stringify(this.applyForm.samplesCheckList) : JSON.stringify(this.applyForm.samples) // 样品从表信息
              }).then(res => {
                this.$message.success({
                  message:'提交成功',
                  duration:1000,
                  onClose: () => {
                    this.$store.commit('SET_REGISTRATION_INFO',{
                      type: ''
                    })
                  }
                })
              })
            })
          }

        })
      },
      /**
       * [goBack 返回登记号输入页面]
       * @return {[type]} [description]
       */
      goBack(){
        this.$store.commit('SET_REGISTRATION_INFO',{
          type: ''
        })
      },
      /******************************************** 表单操作 end **************************************/

      /******************************************** 初始化操作 start **************************************/
      /**
       * [getRegistrationInfo 根据登记号获取该登记号的详细信息]
       * @return {[type]} [description]
       */
      getRegistrationInfo(){
        this.$store.dispatch('getRegistrationDetail',{registrationNo:this.registrationNo,applyType:this.type == 'refund' ? '1' : '2'}).then(res => {
          this.registrationDetail = res.detaillist[0]
          this.$set(this.applyForm,'samples',res.simplelist)
        })
      },

      // 异步编程管理
      async asyncInitFunction(){
        await Promise.all([this.getRegistrationInfo()])
      },
      // 获取页面的异常列表
      getAbnormalList(){
        this.$store.dispatch('getAbnormalList',{registrationNo:this.registrationNo,})
        .then(res=>{
          this.abnormalList = res.rows;
        })
      },
        // 根据type的值进行匹配退件、延期的字典资源
      getReasonInfo(){
        this.$store.dispatch('getInfoReason',{type:this.type}).then(res=>{
          this.applyReason=res.list;
        })
      },
      //对选择的时间进行限制
      dateLimit(time){
        if(this.registrationDetail.detectionDeadline){
          return new Date(this.registrationDetail.detectionDeadline).getTime() > time.getTime()
        }else {
          return false
        }
      },
      // 表格数据的映射方法
      tableReasonInit(){
        this.$store.dispatch('getInfoReason',{type:'refund'}).then(res=>{
          this.anotherReasonList=res.list;
        })
        this.$store.dispatch('getInfoReason',{type:'delay'}).then(res=>{
          this.otherReasonList=res.list;
        })
      }
      /******************************************** 初始化操作 end **************************************/
    },
    mounted(){
      this.asyncInitFunction()
      this.getAbnormalList()
      this.getReasonInfo();
      this.tableReasonInit();
    }
	}
</script>
<style type="text/css" lang="scss" scoped>
	.applyForm{
		.mb20{
			margin-bottom:20px;
		}
    .mt20{
      margin-top:20px;
    }
		.wdFull{
      width:100%!important;
    }
		.footer{
			margin-top:20px;
			justify-content:center;
		}
    .registrationForm{
      padding-top: 15px;
      margin: 0px auto;
      background: #fbfbfb;
    }
    .el-checkbox-group{
      overflow: auto;
      max-height: 130px;
    }
    .el-checkbox{
      width:70px;
      margin-left:0px!important;
    }
    .applyFormJumper{
      padding-top: 10px;
      border-top: 1px solid #ccc;
    }
    // .el-form-item--mini{
    //   .el-form-item__error{
    //     padding-top: 5px;
    //   }
    // }
	}
  // 提示信息
  .fs12{
    font-size: 12px;
  }
</style>
