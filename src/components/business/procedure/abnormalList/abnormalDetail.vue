<template>
	<div class="abnormalDetail">
			<!-- ******************************************************* 异常详情信息 start ********************************************** -->
      <div class="title-item mb20"><span>异常申请信息</span></div>
			<el-form class="abnormalDetailInfo" label-width="160px" size="mini">
        <el-row>
          <el-col :offset="3">
            <el-form-item label="委托单位：">
              {{abnormalApplyDetail.companyName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9"  :offset="3">
            <el-form-item label="登记号：">
              {{abnormalApplyDetail.registrationNo}}
            </el-form-item>
          </el-col>
          <el-col :span="9"  :offset="3">
            <el-form-item label="器具名称：">
              {{abnormalApplyDetail.applianceName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9"  :offset="3">
            <el-form-item label="套数：">
              {{abnormalApplyDetail.setNumber}}
            </el-form-item>
          </el-col>
          <el-col :span="9"  :offset="3">
            <el-form-item label="检测期限：">
              {{abnormalApplyDetail.detectionDeadline}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9"  :offset="3">
            <el-form-item label="申请类型：">
              {{abnormalApplyDetail.applyType == '1' ? '退件' : '延期'}}
            </el-form-item>
          </el-col>
          <el-col :span="9"  :offset="3" v-if="abnormalApplyDetail.applyType == '2'">
            <el-form-item label="新检测期限：">
              {{abnormalApplyDetail.newDate}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col  :offset="3">
            <el-form-item label="分号：" :title="abnormalApplyDetail.samples" class="textOverflow">
              {{abnormalApplyDetail.samples}}
              <span v-if="abnormalApplyDetail.applyType == '1'">({{semicolonType}})</span>
              <span v-else>(全延)</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col  :offset="3">
            <el-form-item label="申请原因：">
              {{reason}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="3">
            <el-form-item label="备注：">
              {{abnormalApplyDetail.applyBz}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9"  :offset="3">
            <el-form-item label="申请人：">
              {{abnormalApplyDetail.addUserName}}
            </el-form-item>
          </el-col>
          <el-col :span="9"  :offset="3">
            <el-form-item label="申请日期：">
              {{abnormalApplyDetail.applyDate}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
			<!-- ******************************************************* 异常详情信息 end ********************************************** -->
			<!-- ******************************************************* 一审详情表单信息 start ********************************************** -->
      <div>
        <div class="title-item mb20"><span>部门审批结果</span></div>
        <el-form :model="departAduitForm" :rules="departAduitRules" ref="departAduitForm" label-width="160px" size="mini">
          <!-- <el-row>
            <el-col>
              <el-form-item label="审批结果" prop="bmShFlag">
                <mind-select :options="aduitResult"
                             :optionsConfig="{label:'remark',value:'code',isString:true}"
                             class="selectFull"
                             :extraConfig="{disabled:type == 'review'||abnormalApplyDetail.bmShFlag == '1'}"
                             v-model="departAduitForm.bmShFlag"></mind-select>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :offset="3">
              <el-form-item label="审批意见：" prop="bmShRemark">
                <el-input v-model="departAduitForm.bmShRemark" :disabled="type == 'review' || abnormalApplyDetail.bmShFlag == '1'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9"  :offset="3">
              <el-form-item label="审批人：" prop="">
                <el-input v-model="departAduitForm.bmShPerson" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9"  :offset="3">
              <el-form-item label="审批时间：" prop="">
                <el-date-picker
                  class="wdFull"
                  :disabled="true"
                  :editable="false"
                  v-model="departAduitForm.aduitTime"
                  type="datetime"
                  placeholder="选择审批时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="flex footer" v-if="type !== 'review' && abnormalApplyDetail.bmShFlag == '0'">
          <el-button type="primary" @click="bmShAction(1)">通过</el-button>
          <el-button type="warning" @click="bmShAction(2)">拒绝</el-button>
          <el-button v-if="typeof permission == 'string' && permission.indexOf('@M705@') !== -1 && permission.indexOf('@M706@') == -1" @click="goBack">返回</el-button>
        </div>
      </div>
			<!-- ******************************************************* 一审详情表单信息 end ********************************************** -->
			<!-- ******************************************************* 二审详情表单信息 start ********************************************** -->
      <div v-if="abnormalApplyDetail.bmShFlag == '1'">
        <div class="title-item mb20"><span>审批结果</span></div>
        <el-form ref="aduitForm" :model="aduitForm" :rules="aduitRules" label-width="160px" size="mini">
          <!-- <el-row>
            <el-col>
              <el-form-item label="审批结果" prop="shFlag">
                <mind-select :options="aduitResult"
                             :optionsConfig="{label:'remark',value:'code',isString:true}"
                             :extraConfig="{disabled:type == 'review'}"
                             class="selectFull"
                             v-model="aduitForm.shFlag"></mind-select>
                  <div>
                    <el-radio v-model="aduitForm.shFlag" label="1" >通过</el-radio>
                    <el-radio v-model="aduitForm.shFlag" label="2" >拒绝</el-radio>
                  </div>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :offset="3">
              <el-form-item label="审批意见：" prop="shRemark">
                  <el-input v-model="aduitForm.shRemark" :disabled="type == 'review' || abnormalApplyDetail.bmShFlag == '0' "></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9"  :offset="3">
              <el-form-item label="审批人：" prop="">
                <el-input v-model="aduitForm.shPerson" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9"  :offset="3">
              <el-form-item label="审批时间：" prop="">
                <el-date-picker
                  class="wdFull"
                  :disabled="true"
                  :editable="false"
                  v-model="aduitForm.aduitTime"
                  type="datetime"
                  placeholder="选择审批时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 审核页面操作 -->
        <div class="flex footer" v-if="type !== 'review'">
          <el-button type="primary" :disabled="abnormalApplyDetail.bmShFlag == '0'" @click="shAction(1)">通过</el-button>
          <el-button type="primary" :disabled="abnormalApplyDetail.bmShFlag == '0'" @click="shAction(2)">拒绝</el-button>
          <!-- <el-button  v-has="'M706'" v-mindPopover="{message:'确定退回?',
          success:handleRecall.bind(this,abnormalApplyDetail),
          isOpen:handleOpen.bind(this,abnormalApplyDetail)}">
          退回
          </el-button> -->
        </div>
      </div>
      <!-- ******************************************************* 二审详情表单信息 end ********************************************** -->
		<!-- ******************************************************* 表单操作 start ********************************************** -->
    <!-- 查看页面操作 -->
    <footer class="flex footer" v-if="type == 'review'">
      <el-button v-if="abnormalApplyDetail.addUser == localUser" type="primary" :disabled="abnormalApplyDetail.bmShFlag != 0 || flag == 2" @click="personalBack">本人撤回</el-button>
      <el-button type="primary" @click="goBack">返回</el-button>
    </footer>
		<!-- ******************************************************* 表单操作 end ********************************************** -->
	</div>
</template>
<script type="text/javascript">
import { ajaxRequest } from '../../../util/base';
  const departAduitDefault = {
    aduitTime:Date.now(),
    bmShPerson:localStorage.getItem('userName'),
  }

  const aduitDefault = {
    aduitTime:Date.now(),
    shPerson:localStorage.getItem('userName'),
  }
	export default {
		name:'abnormalDetail',
    data(){
      return {
        /******************************************************* 一级审核字段 start***************************************************/
        departAduitForm:departAduitDefault,
        departAduitRules:{
          bmShFlag:[{ required: true, message: '请选择审批结果！', trigger: 'change'}],
          bmShRemark:[{max: 200, message: '最多输入200个字符', trigger: 'blur'}]
        },
        /******************************************************* 一级审核字段 end***************************************************/

        /******************************************************* 二级审核字段 start***************************************************/
        aduitForm:aduitDefault,
        aduitRules:{
          shFlag:[{ required: true, message: '请选择审批结果！', trigger: 'change'}],
          shRemark:[{max: 200, message: '最多输入200个字符', trigger: 'blur'}]
        },
        /******************************************************* 二级审核字段 start***************************************************/

        abnormalApplyDetail:{},
        aduitResult:[{
          remark:'通过',
          code:'1'
        },{
          remark:'拒绝',
          code:'2'
        }],

        permission:localStorage.getItem("btnPower"),
        localUser:'',
        // 申请原因
        reason:''
      }
    },
    computed:{
      abnormalId(){
        return this.$store.state.Procedure.abnormalInfo.id
      },
      semicolonType(){
        let temp = this.abnormalApplyDetail.samples.split(',')
        return temp.length == this.abnormalApplyDetail.setNumber ? '全退' : '部分退件'
      }
    },
    watch:{
      abnormalId(n,o){
        if(!n){
          return ;
        }
        this.getDetailByAbnormalId()
      }
    },
    props:{
      type:{
        type:String
      },
      level:{
        type:String
      }
    },
    methods:{
      /**
       * [bmShAction 一级审核操作]
       * @return {[type]} [description]
       */
      bmShAction(num){
        if(num == 2){
          if(!this.departAduitForm.bmShRemark){
            this.$message.error('审批意见不能为空!');
            return ;
          }
        }
        this.$refs.departAduitForm.validate((valid) => {
          if(valid){
            this.$confirm('确认审核?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center:true,
              type: 'warning'
            }).then(res => {
              console.log(this.departAduitForm.bmShRemark,'bmShRemark')
              this.$store.dispatch('bmShAction',{
                id:this.abnormalApplyDetail.id, // 异常信息id
                applyType:this.abnormalApplyDetail.applyType, // 申请类型
                registrationNo:this.abnormalApplyDetail.registrationNo, // 登记号
                bmShFlag:num, // 审核结果
                bmShRemark:this.departAduitForm.bmShRemark, // 审核意见
                flag:num==2?num:null,//审核结果 1 为通过，2为拒绝
                ts:this.abnormalApplyDetail.ts,//套数
              }).then(res => {
                this.$message.success({
                  message:'审核成功',
                  duration:1000,
                  onClose: () => {
                    // 根据权限判断 ： 如果存在一级权限则一审结束之后重新获取详情，刷新状态  否则返回查询列表
                    // if(typeof this.permission == 'string' && this.permission.indexOf('@M705@') !== -1){
                      // this.getDetailByAbnormalId()
                    // }else{
                      // this.getDetailByAbnormalId()
                    // }
                  }
                })
                this.$emit('resolveSubmit')
                this.$store.commit('SET_ABNORMAL_INFO',{
                  type: ''
                })
              })
            }).catch(rej => {

            })
          }
        })
      },
      /**
       * [shAction 二级审核操作]
       * @return {[type]} [description]
       */
      shAction(num){
        if(num ==2){
          if(!this.aduitForm.shRemark){
            this.$message.error('审批意见不能为空！')
            return ;
          }
        }
        this.$refs.aduitForm.validate((valid) => {
          if(valid){
            this.$confirm('确认审核?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center:true,
              type: 'warning'
            }).then(res => {
              this.$store.dispatch('shAction',{
                id:this.abnormalApplyDetail.id, // 异常信息id
                applyType:this.abnormalApplyDetail.applyType, // 申请类型
                registrationNo:this.abnormalApplyDetail.registrationNo, // 登记号
                ts:this.abnormalApplyDetail.ts, // 套数
                shFlag:num, // 审核结果
                shRemark:this.aduitForm.shRemark, // 审核意见
                newDate:this.abnormalApplyDetail.newDate, // 新检测期限
                flag:num,//审核的结果，1为通过， 2为拒绝
                ts:this.abnormalApplyDetail.ts,//套数
              }).then(res => {
                this.$message.success({
                  message:'审核成功',
                  duration:1000,
                  onClose: () => {
                    // this.$store.commit('SET_ABNORMAL_INFO',{
                    //   type: ''
                    // })
                    // this.getDetailByAbnormalId()

                  }
                })
                this.$emit('resolveSubmit')
                this.$store.commit('SET_ABNORMAL_INFO',{
                  type: ''
                })
              })
            }).catch(rej => {

            })
          }
        })
      },
      /**
       * [goBack 返回到异常查询页面]
       * @return {[type]} [description]
       */
      goBack(){
        this.$store.commit('SET_ABNORMAL_INFO',{
          type:'',
        })
      },
      personalRecal(){
				this.$store.dispatch('handleRecall',{
          id:this.abnormalApplyDetail.id,
          type:1,
          flag:2,
				}).then(res => {
					this.$message.success({
						message:'撤回成功！',
            duration:1000,
            onClose: () => {
              this.getTableList()
            }
					})
				})
			},
      /**
       * [getDetailByAbnormalId 通过异常的id获取它的详情]
       * @return {[type]} [description]
       */
      getDetailByAbnormalId(){
        this.$store.dispatch('getAbnormalDetail',{
          id:this.abnormalId
        }).then(res => {
          this.abnormalApplyDetail = res
          // 获取理由
          this.$store.dispatch('getInfoReason',{type:this.abnormalApplyDetail.applyType == 1?'refund':'delay'}).then(res=>{
            // this.applyReason=res.list;
            res.list.forEach((v,i)=>{
              if(v.code==this.abnormalApplyDetail.applyReason){
                this.reason = v.remark ;
                return ;
              }
            })
          })
          this.departAduitForm=Object.assign({},departAduitDefault,{
            bmShFlag:this.abnormalApplyDetail.bmShFlag == '0'? '未审核' : this.abnormalApplyDetail.bmShFlag,
            bmShRemark:this.abnormalApplyDetail.bmShRemark,
            bmShPerson:this.type == 'aduit'&&this.abnormalApplyDetail.bmShFlag == '0' ? departAduitDefault.bmShPerson : this.abnormalApplyDetail.bmShPersonName,
            aduitTime:this.type == 'aduit'&&this.abnormalApplyDetail.bmShFlag == '0' ? departAduitDefault.aduitTime : this.abnormalApplyDetail.bmShTime
          })

          this.aduitForm=Object.assign({},aduitDefault,{
            shFlag:this.abnormalApplyDetail.shFlag == '0'? '未审核' : this.abnormalApplyDetail.shFlag,
            shRemark:this.abnormalApplyDetail.shRemark,
            shPerson:this.type == 'aduit'&&this.abnormalApplyDetail.shFlag == '0' ? aduitDefault.shPerson : this.abnormalApplyDetail.shPersonName,
            aduitTime:this.type == 'aduit'&&this.abnormalApplyDetail.shFlag == '0' ? aduitDefault.aduitTime : this.abnormalApplyDetail.shTime
          })

          if(this.type == 'aduit' && this.abnormalApplyDetail.bmShFlag == '0'){
            this.$delete(this.departAduitForm,'bmShFlag')
          }

          if(this.type == 'aduit' && this.abnormalApplyDetail.shFlag == '0'){
            this.$delete(this.aduitForm,'shFlag')
          }
        })
      },
      // 异步编程管理
      async asyncInitFunction(){
        await Promise.all([this.getDetailByAbnormalId()])
      },
			/**
			 * [handleRecall 处理异常申请的撤回操作仅针对2级审核]
			 * @return {[type]} [description]
			 */
			handleRecall(row){
				this.$store.dispatch('handleRecall',{
					id:row.id
				}).then(res => {
					this.$message.success({
						message:'退回成功！',
            duration:1000,
            onClose: () => {
              this.getDetailByAbnormalId()
            }
					})
				})
      },
			/**
			 * [handleOpen 如果未通过则不出现提示框]
			 * @param  {[type]} row [description]
			 * @return {[type]}     [description]
			 */
			handleOpen(row){
				if(row.shFlag == '0'){
					this.$message.error('二审未通过，无法撤回！')
					return false
				}
				if(row.isSettlement == 1){
					this.$message.error('该任务已结算，无法撤回！')
					return false
				}
				if(row.isSettleAccount == 1){
					this.$message.error('该任务已结账，无法撤回！')
					return false
				}
				return true
      },
      // 本人撤回
      personalBack(){
			  this.$confirm('确认本人撤回?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center:true,
              type: 'warning'
            }).then(()=>{
          this.$store.dispatch('handleRecall',{
            id:this.abnormalId,
            type:1,
            flag:2,
            bmShFlag:3,
          }).then(res => {
            this.$message.success({
              message:'撤回成功！',
              duration:1000,
              onClose: () => {
                this.goBack()
              }
            })
          })
        })

      }
    },
    mounted(){
      console.log(this.abnormalApplyDetail.bmShFlag,'flag')
      this.localUser = window.localStorage.getItem('userId')
      this.asyncInitFunction()

      if(!this.aduitForm.shFlag){
        this.aduitForm.shFlag = '1';
      }
    }
	}
</script>
<style type="text/css" lang="scss">
  .abnormalDetail{
    .mb20{
      margin-bottom:20px;
    }
    .abnormalDetailInfo{
      padding-top: 15px;
      margin: 0px auto;
      margin-bottom: 10px;
      background: #fbfbfb;
    }
    .selectFull{
      .el-select{
        width:100%;
      }
    }
    .textOverflow{
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wdFull{
      width:100%!important;
    }
    .footer{
      justify-content: center;
      margin-bottom: 20px;
      margin-top: 20px;
    }
    .el-form-item--mini{
      .el-form-item__error{
        padding-top: 5px;
      }
    }
  }
</style>
