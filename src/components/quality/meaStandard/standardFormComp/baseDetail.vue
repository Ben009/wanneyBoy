<template>
	<div class="baseDetail" v-loading="baseDetailLoading" element-loading-spinner="el-icon-loading">
		<div class="title-item flex mb20">
      <span class="flex-one">基础信息</span>
      <global-tootips >
         <p>1.计量标准证书号与社会公用证书号发证日期与有效期有可能不一致，需分别维护，若一致请维护相同内容</p>
         <p>2.部分字段的英文用于出具中英文对照或纯英文报告，无此需求可不维护</p>
      </global-tootips>
<!--       <div class="el-icon-info  shuoming">
        <el-row class="el-sm">
          <p>1.计量标准证书号与社会公用证书号发证日期与有效期有可能不一致，需分别维护，若一致请维护相同内容</p>
          <p>2.部分字段的英文用于出具中英文对照或纯英文报告，无此需求可不维护</p>
        </el-row>
      </div> -->
    </div>
		<el-form ref="form" :model="form" :rules="rules" label-width="160px" :class="{'disableEdit': !!formDetailInfo.isAuditing && !isAdd}">
      <el-row>
    		<el-col>
            <el-form-item label="计量标准名称" prop="standardName">
                <el-input v-model="form.standardName"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
            <el-form-item label="计量标准名称(英文)" prop="standardNameE">
                <el-input v-model="form.standardNameE"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row class="redBorder" style="margin-bottom: 5px">
          <el-col class="mid">
              <el-form-item label="计量标准证书号" prop="standardCerNo">
                  <el-input v-model="form.standardCerNo"></el-input>
              </el-form-item>
          </el-col>
          <el-col class="small">
              <el-form-item label="计量标准发证日期" prop="standardReleaseDate">
                  <div class="flex">
                    <el-date-picker
                      class="calcDate"
                      :editable="false"
                      v-model="form.standardReleaseDate"
                      type="date"
                      :picker-options="{disabledDate:disabledDateStandardValid}"
                      placeholder="选择日期">
                    </el-date-picker>
                    <el-button style="margin: 8px 0px;" @click="calcVaildDate('standard')">计算</el-button>
                  </div>
              </el-form-item>
          </el-col>
          <el-col class="small">
              <el-form-item label="计量标准有效日期" prop="standardValidDate">
                  <el-date-picker
                    class="wdFull"
                    :editable="false"
                    v-model="form.standardValidDate"
                    type="date"
                    :picker-options="{disabledDate:disabledDateStandard}"
                    placeholder="选择日期">
                  </el-date-picker>
              </el-form-item>
          </el-col>
      </el-row>
      <el-row  class="redBorder">
        <el-col class="mid">
            <el-form-item label="社会公用证书号" prop="socCerNo">
                <el-input v-model="form.socCerNo"></el-input>
            </el-form-item>
        </el-col>
        <el-col class="small">
          <el-form-item prop="socReleaseDate" class="cell">
              <template slot = "label">
                <span>社会公用证书发证日期</span>
              </template>
              <div class="flex">
                <el-date-picker
                  class="calcDate"
                  :editable="false"
                  v-model="form.socReleaseDate"
                  type="date"
                  :picker-options="{disabledDate:disabledDateSocValid}"
                  placeholder="选择日期">
                </el-date-picker>
                <el-button style="margin: 8px 0px;" @click="calcVaildDate('soc')">计算</el-button>
              </div>
          </el-form-item>
        </el-col>
        <el-col class="small">
            <el-form-item class="cell" prop="socValidDate">
                <template slot = "label">
                  <span>社会公用证书有效日期</span>
                </template>
                <el-date-picker
                  class="wdFull"
                  :editable="false"
                  v-model="form.socValidDate"
                  type="date"
                  :picker-options="{disabledDate:disabledDateSoc}"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
          <el-col class="small" style="height:44px;">
              <el-form-item label="批准机关" prop="approvalAuth">
                  <mind-select :options="approvalAuth"
                               :optionsConfig="{label:'remark',value:'code',isNumber:true}"
                               v-model="form.approvalAuth"
                               :changeCallback="getProp"
                               class="selectFull"></mind-select>
              </el-form-item>
          </el-col>
          <el-col class="small">
              <el-form-item label="标准性质" prop="standardProp">
                  <el-radio-group v-model="form.standardProp">
                    <el-radio :label="0">高标</el-radio>
                    <el-radio :label="1">次标</el-radio>
                  </el-radio-group>
              </el-form-item>
          </el-col>
          <el-col class="small">
              <el-form-item label="是否封存" prop="isSafekeeping">
                  <el-radio-group v-model="form.isSafekeeping">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
              </el-form-item>
          </el-col>
          <el-col class="small">
              <el-form-item label="是否撤销" prop="isVerb">
                  <el-radio-group v-model="form.isVerb">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
              </el-form-item>
          </el-col>
      </el-row>

      <el-row>
            <el-col class="small">
              <el-form-item label="标准代码" prop="code">
                  <el-input v-model="form.code"></el-input>
              </el-form-item>
          </el-col>

          <el-col class="small">
              <el-form-item label="总价值（万元）" prop="totalVal">
                  <el-input type="number" v-model.number="form.totalVal"></el-input>
              </el-form-item>
          </el-col>

          <el-col class="small">
              <el-form-item label="主持考核单位" prop="chiefExaminer" >
                  <el-input v-model="form.chiefExaminer"></el-input>
              </el-form-item>
          </el-col>
          <el-col class="small">
              <el-form-item label="承考单位" prop="takeExaminer" >
                  <el-input v-model="form.takeExaminer"></el-input>
              </el-form-item>
          </el-col>
      </el-row>

			<el-row>
          <el-col class="small">
              <el-form-item label="专业领域" prop="professionalField">
                  <el-input v-model="form.professionalField"></el-input>
              </el-form-item>
          </el-col>
          <el-col class="small">
              <el-form-item label="维护部门" prop="department">
                  <mind-select :options="departList"
                               :optionsConfig="{label:'departName',value:'id'}"
                               v-model="form.department"
                               :changeCallback="getPersonList"
                               class="selectFull"></mind-select>
              </el-form-item>
          </el-col>
          <el-col class="small">
              <el-form-item label="负责人" prop="responsibleUser">
                  <mind-select :options="personList"
                               :optionsConfig="{label:'userName',value:'id'}"
                               v-model="form.responsibleUser"
                               class="selectFull"></mind-select>
              </el-form-item>
          </el-col>
          <el-col class="small">
              <el-form-item label="负责人电话" prop="telephone">
                  <el-input v-model="form.telephone"></el-input>
              </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item prop="classAccuracy">
            <template slot = "label">
              <span>准确度等级</span>
              <!-- <el-tooltip class="item" effect="dark" content="选中文本内容右击可添加修饰符">
                <i class="el-icon-info ft12"></i>
              </el-tooltip> -->
            </template>
            <el-input @input="valueChange('classAccuracy')" v-if="!form.classAccuracy" v-model="form.classAccuracy" ></el-input>
            <el-popover
              v-if="form.classAccuracy"
              popper-class="baseDetaildark"
              placement="bottom-start"
              :visible-arrow="false"
              trigger="hover">
              <div v-html="form.classAccuracy"></div>
              <el-input ref="classAccuracy" slot="reference" v-model="form.classAccuracy" ></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item prop="classAccuracyE">
            <template slot = "label">
              <span>准确度等级(英)</span>
              <el-tooltip class="item" effect="dark" content="英文适用于中英文对照证书，若无此需求可不维护">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input  @input="valueChange('classAccuracyE')" v-if="!form.classAccuracyE" v-model="form.classAccuracyE" ></el-input>
            <el-popover
              v-if="form.classAccuracyE"
              popper-class="baseDetaildark"
              placement="bottom-start"
              :visible-arrow="false"
              trigger="hover">
              <div v-html="form.classAccuracyE"></div>
              <el-input ref="classAccuracyE" slot="reference" v-model="form.classAccuracyE" ></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item prop="measuringRange">
            <template slot = "label">
              <span>测量范围</span>
              <!-- <el-tooltip class="item" effect="dark" content="选中文本内容右击可添加修饰符">
                <i class="el-icon-info ft12"></i>
              </el-tooltip> -->
            </template>
            <el-input @input="valueChange('measuringRange')" v-if="!form.measuringRange" v-model="form.measuringRange" ></el-input>
            <el-popover
              v-if="form.measuringRange"
              popper-class="baseDetaildark"
              placement="bottom-start"
              :visible-arrow="false"
              trigger="hover">
              <div v-html="form.measuringRange"></div>
              <el-input ref="measuringRange" slot="reference" v-model="form.measuringRange" ></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item prop="measuringRangeE">
            <template slot = "label">
              <span>测量范围(英)</span>
              <el-tooltip class="item" effect="dark" content="英文适用于中英文对照证书，若无此需求可不维护">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input @input="valueChange('measuringRangeE')" v-if="!form.measuringRangeE" v-model="form.measuringRangeE"></el-input>
            <el-popover
              v-if="form.measuringRangeE"
              popper-class="baseDetaildark"
              placement="bottom-start"
              :visible-arrow="false"
              trigger="hover">
              <div v-html="form.measuringRangeE"></div>
              <el-input ref="measuringRangeE" slot="reference" v-model="form.measuringRangeE"></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="附件上传" prop="fj">
            <mind-upload ref="upFiles" :callBack="handleUpLoad" v-if="upFiles" :attachIds="form.fj"></mind-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!form.id">
        <el-col>
            <el-form-item label="是否审核" prop="isAutoAuditing">
                  <el-radio-group v-model="form.isAutoAuditing">
                    <el-radio :label="'0'">否</el-radio>
                    <el-radio :label="'1'">是</el-radio>
                  </el-radio-group>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item prop="remark">
            <template slot = "label">
              <span>备注</span>
              <!-- <el-tooltip class="item" effect="dark" content="选中文本内容右击可添加修饰符">
                <i class="el-icon-info ft12"></i>
              </el-tooltip> -->
            </template>
            <el-input @input="valueChange('remark')" v-model="form.remark" v-if="!form.remark" ></el-input>
            <el-popover
              v-if="form.remark"
              popper-class="baseDetaildark"
              placement="bottom-start"
             :visible-arrow="false"
              trigger="hover">
              <div v-html="form.remark"></div>
              <el-input ref="remark" slot="reference" v-model="form.remark" ></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
		</el-form>
    <footer class="textCenter mb20" v-if="!formDetailInfo.isAuditing || isAdd">
      <el-button v-if="" v-btnHas="{message:'M22002',scope:this}" type="primary" @click="handleSubmit">{{this.form.id ? '修 改' : '保 存'}}</el-button>
      <!-- <el-button @click="reset" v-if="this.form.id" @click="">返 回</el-button> -->
      <el-button @click="reset" type="warning" class="el-icon-warning" v-if="!this.form.id">清 空</el-button>
    </footer>
	</div>
</template>

<script type="text/javascript">
	import Vue from 'vue'

  import rightclick from '@/directives/rightcilck'
  import rightClick from '@/mixins/FormRightClick'
  import {formatDate} from '@/components/util/base'

  const defaults = {
    standardProp: 0,
    isSafekeeping: 0,
    isVerb: 0,
    isAutoAuditing:'0',
  }
	export default {
    name:'baseDetail',
    props:{
      isAdd:{
        type:Boolean,
        default:true,
      }
    },
		data(){
      let telephoneCheck = (rule,value,cb)=>{
        if(value != undefined || !!value || value !=null){
          let reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/g
          let ruleRex = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/g;
            if(reg.test(value)){
              cb()
            }else{
              if(ruleRex.test(value)){
                cb()
              }else{
                cb(new Error('请输入正确格式'))
              }
            }
        }else{
          cb()
        }
      }
      let totalValCheck = (rule,value,cb)=>{
        if(value == null || value ==undefined){
          cb();
        }
        if(typeof value != 'number'){
          cb(new Error('请输入数字'))
        }
        if(value<0){
          cb(new Error('不能为负数'))
        }
        if(value>100000000){
          cb(new Error('数字最大为100000000'))
        }
        cb()
      }
			return {
        form: Object.assign({},defaults),
        /********************************* 表单验证规则字段 start ********************************/
				rules:{
          standardCerNo:[{type: 'string', required: true, message: '计量标准证书号不能为空', trigger: 'blur'},
                        {max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          socCerNo:[{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          standardName:[{type: 'string', required: true, message: '计量标准名称不能为空', trigger: 'blur'},
                        {max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          standardNameE:[{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          code:[{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          totalVal:[{validator:totalValCheck, trigger: 'blur'}],
          department:[{required: true, message: '维护部门不能为空', trigger: 'blur'}],
          professionalField: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          chiefExaminer: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          takeExaminer: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          classAccuracy: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          classAccuracyE: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          measuringRange: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          measuringRangeE: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          remark: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
          telephone:[{validator:telephoneCheck,trigger:'blur'}]
        },
        /********************************* 表单验证规则字段 end ********************************/
        cerificateAduit:localStorage.getItem("aduitSlug"),
        baseDetailLoading:false,
        upFiles:true,
			}
		},
    mixins: [rightClick],
    computed:{
      // 部门列表
      departList(){
        return this.$store.state.Mstandard.departlist
      },
      // 部门下的人员列表
      personList(){
        return this.$store.state.Mstandard.personlist
      },
      // 当前仪器标准的id
      currentStandardId(){
        return this.$store.state.Mstandard.currentStandardId
      },
      // 当前计量标准的详细信息
      formDetailInfo(){
        return this.$store.state.Mstandard.baseList
      },
      approvalAuth(){
        return this.$store.state.Mstandard.approvalAuth
      }
    },
    watch:{
      currentStandardId(){
        if(this.currentStandardId){
          this.getBaseDetailById()
        }
      },
      formDetailInfo(){
        this.form = Object.assign({},defaults,this.formDetailInfo)
        this.upFiles = false;
        this.$nextTick(_ => {
          this.upFiles = true;
        })
      },
    },
    directives:{
      rightclick,
      focus,
      btnHas:{
        bind: function(el, binding) {
          let buttonpermsStr=window.localStorage.getItem("btnPower");
          if(buttonpermsStr==null || buttonpermsStr==undefined) {//没有权限，所有涉及权限的按钮都不展示
            el.parentNode.removeChild(el);
          }else if(buttonpermsStr.indexOf("@"+binding.value.message+"@") == -1 && binding.value.scope.$route.query.id){//没有该按钮权限，隐藏按钮
            el.parentNode.removeChild(el);
          }
        }
      }
    },
    methods:{
      /**
       * [getDepartList 获取维护部门列表]
       * @return {[type]} [description]
       */
      getDepartList(){
        this.$store.dispatch('getDepartList')
      },
      /**
       * [getPersonList 根据部门id获取到该部门下的所有人员]
       * @param  {[type]} departId [description]
       * @return {[type]}          [description]
       */
      getPersonList(departId){
        this.$store.dispatch('getPersonList',{departId:departId})
        this.$set(this.form,'responsibleUser','')
      },
      getProp(id){
        this.approvalAuth.forEach(val => {
          if(val.code == id){
            this.form.standardProp = val.pcode == '0' ? 0 : 1
          }
        })
      },
      /**
       * [calcVaildDate 计算证书的有效日期：4年减去1天]
       * 备注： 调整由4年减去1天 改为 5年
       * @param  {[type]} slug [判断当前计算的是什么的发证日期]
       * @return {[type]}      [description]
       */
      calcVaildDate(slug){
        let currentTime = slug === 'standard' ? this.form.standardReleaseDate : this.form.socReleaseDate
        if(currentTime){
          let now = new Date(currentTime); // 获取需要计算的时间
          // let yearNow = new Date(now.setFullYear(now.getFullYear() + 5));// 计算增加4年的时间 ===> 改为5年
          // let calcTime = new Date(yearNow.setDate(yearNow.getDate()));// 计算增加4年减去一天的时间 ===> 改为5年
          let yearNow = new Date(now.setFullYear(now.getFullYear() + 5));// 计算增加4年的时间
          let calcTime = new Date(yearNow.setDate(yearNow.getDate() - 1));// 计算增加4年减去一天的时间
          slug === 'standard' ? this.$set(this.form,'standardValidDate',calcTime) : this.$set(this.form,'socValidDate',calcTime);
        }else{
          this.$message.error('请先选择发证日期!')
        }
      },
      /**
       * [disabledDateStandard 计量标准有效日期不能小于计量标准发证日期]
       * @param  {[type]} time [description]
       * @return {[type]}      [description]
       */
      disabledDateStandard(time){
        if(this.form.standardReleaseDate){
          return new Date(this.form.standardReleaseDate).getTime() > time.getTime()
        }else {
          return false
        }
      },
      /**
       * [disabledDateStandard 计量标准发证日期不能大于计量标准有效日期]
       * @param  {[type]} time [description]
       * @return {[type]}      [description]
       */
      disabledDateStandardValid(time){
        if(this.form.standardValidDate){
          return new Date(this.form.standardValidDate).getTime() < time.getTime()
        }else {
          return false
        }
      },
      /**
       * [disabledDateSoc 社会公用证书有效日期不能小于社会公用证书发证日期]
       * @param  {[type]} time [description]
       * @return {[type]}      [description]
       */
      disabledDateSoc(time){
        if(this.form.socReleaseDate){
          return new Date(this.form.socReleaseDate).getTime() > time.getTime()
        }else{
          return false
        }
      },
      /**
       * [disabledDateSocValid 社会公用证书发证日期不能大于社会公用证书有效日期]
       * @param  {[type]} time [description]
       * @return {[type]}      [description]
       */
      disabledDateSocValid(time){
        if(this.form.socValidDate){
          return new Date(this.form.socValidDate).getTime() < time.getTime()
        }else{
          return false
        }
      },
      /**
       * [handleSubmit 表单数据提交操作]
       * @return {[type]} [description]
       */
      handleSubmit(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            let httpMethod// http请求方式
            delete this.form.addTime
            delete this.form.updateTime
            delete this.form.auditor
            delete this.form.auditorName
            delete this.form.auditingTime
            delete this.form.auditingAdvise
            delete this.form.isAuditing
            if (this.form.standardReleaseDate) {
              this.form.standardReleaseDate = formatDate(this.form.standardReleaseDate, 'YYYY-MM-DD')
            }
            if (this.form.standardValidDate) {
              this.form.standardValidDate = formatDate(this.form.standardValidDate, 'YYYY-MM-DD')
            }
            if (this.form.socReleaseDate) {
              this.form.socReleaseDate = formatDate(this.form.socReleaseDate, 'YYYY-MM-DD')
            }
            if (this.form.socValidDate) {
              this.form.socValidDate = formatDate(this.form.socValidDate, 'YYYY-MM-DD')
            }
            if (this.cerificateAduit == 'list' && this.$route.query.id){
              this.form.chargeButton = 3
            }
            if (!this.form.id || this.form.id == '') { // 新增 注意:通过id是否存在来判断是新增还是编辑
              httpMethod = 'post'
            } else { // 更新
              httpMethod = 'put'
            }
            this.$confirm('确认保存?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center:true,
              type: 'warning'
            }).then(() => {
              this.$store.dispatch('submitForm',{
                Method:httpMethod,
                data:this.form
              }).then(res => {
                if(res && res.id){
                  this.$store.commit('CURRENT_STANDARD_ID',res.id)
                }
                this.$message.success('保存成功')
              },rej => {
                this.$message.error('保存失败')
              })
            })
          } else {
            return false
          }
        })
      },
      /**
       * [valueChange 为了解决input显示和隐藏时表格没有聚焦的问题]
       * @param  {[type]} slug [description]
       * @return {[type]}      [description]
       */
      valueChange(slug){
        this.$nextTick(()=>{
          this.$refs[slug].focus()
        })
      },
      /**
       * [reset 清空操作]
       * @return {[type]} [description]
       */
      reset(){
        if(!this.form.id){
          this.form = Object.assign({},defaults)
        }else{
          this.form = Object.assign({},defaults,{id:this.form.id})
        }
      },
      /**
       * [getBaseDetailById 如果是编辑进入的话请求id的详情]
       * @return {[type]} [description]
       */
      getBaseDetailById(){
        this.baseDetailLoading = true;
        this.$store.dispatch('getBaseDetailById',{id:this.currentStandardId}).then(res => {
          this.baseDetailLoading = false;
          if(this.form.department){
            this.$store.dispatch('getPersonList',{departId:this.form.department})
          }
        })
      },
      /**
       * [getApprovalAuth 获取到批准机关列表]
       * @return {[type]} [description]
       */
      getApprovalAuth(){
        this.$store.dispatch('getApprovalAuth',{})
      },
      handleUpLoad(file,list){
        let signnature = ''
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            signnature = list[i].id + ',' + signnature
          }
        }
        if (signnature != '') {
          signnature = signnature.substring(0, signnature.length - 1)
          this.form.fj = signnature
        }
      },
      // 异步编程管理
      async asyncInitFunction(){
        await Promise.all([this.getDepartList(),this.getApprovalAuth()])
      }
    },
    mounted(){
      this.asyncInitFunction()
    }
	}
</script>

<style type="text/css" lang="scss">
  .baseDetaildark{
    border:1px solid #14a7fb!important;
  }
  .baseDetail{
    .redBorder{
      border: 1px dashed #9e9e9e;
      padding: 5px;
    }
    .disableEdit{
      pointer-events:none;
      opacity:0.8;
    }
    .textCenter{
      text-align:center;
    }
    .flex-one{
      flex:1;
    }
    .ft12{
      font-size:12px;
    }
    .wdFull{
      width:100%!important;
    }
    .mb20{
      margin-bottom:20px;
    }
    .selectFull{
      .el-select{
        width:100%;
      }
    }
    // .isVerbRadio{
    //   margin-left: 45px!important;
    // }
    .calcDate{
      width:100%!important;
      margin-right:10px;
    }
    .cell{
      .el-form-item__label{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        word-break: break-all;
      }
    }
    .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;float: right;cursor: pointer;}
    .shuoming::after{
      content: "";
      /*background: #fff;*/
      position: absolute;
      z-index: 999;
      /* top: 0; */
      /* left: -65px; */
      // right:10;

    }
    .el-sm{
      background: #ffffff;
      position: absolute;
      z-index: 999;
      -webkit-box-shadow: 1px 7px 33px -9px #969696;
      box-shadow: 1px 7px 33px -9px #969696;
      border: 1px solid #56bc4e8c;
      border-radius: 5px;
      color: dimgrey;
      margin-left: -345px;
      margin-right: 15px;
      word-break: break-all;
      margin-top: 5px;
      padding: 4px 5px;
      font-size: 14px;
      opacity: 50;
      float: right;
      -webkit-transition: all 0.8s;
      transition: all 0.8s;
    }
    .small{width:25%!important;}
    .mid{width: 50%!important;}
    @media screen and (max-width:1500px){
      .mid{width: 100%!important;}
      .small{width:50%!important;}
    }
  }

</style>
