<template>
	<div class="aduit">
    <div class="title-item"><span>审核</span></div>
    <el-form class="aduitForm" :class="{'disableEdit' : cerificateAduit == 'list' || cerificateAduit == 'review'}" ref="form" :model="form" :rules="rules" size="mini" label-width="100px">
      <el-row class="mt20">
        <el-col :span="11">
        	<el-form-item prop="auditingResult">
        		<template slot="label">
							<span class="lineHeight">审核结果：</span>
            </template>
            <div class="flex">
							<span class="lineHeight">经确认，该计量标准信息能否满足相关工作要求：</span>
	            <mind-select :options="audit"
	            						 :optionsConfig="{label:'label',value:'value'}"
	            						 :extraConfig="{disabled: cerificateAduit == 'list' || cerificateAduit == 'review'}"
	            						 v-model="form.auditingResult"
	            						 :changeCallback="setCommentsDefault"
	            						 ></mind-select>
            </div>
        	</el-form-item>
        </el-col>
        <el-col :span="11" v-if=" cerificateAduit == 'list' || cerificateAduit == 'review'">
            <div class="flex">
							<div class="wd80 lineHeight">审核人：</div>
            	<span class="lineHeight">{{formDetailInfo.auditorName}}</span>
            </div>
        </el-col>
      </el-row>
      <el-row class="mt20">
        <el-col>
          <el-form-item prop="auditingAdvise">
          	<template slot="label">
							<span class="lineHeight">审批意见：</span>
            </template>
	          <div class="flex">
							<el-input v-model="form.auditingAdvise" :disabled="cerificateAduit == 'list' || cerificateAduit == 'review'" ref="auditingAdvise"></el-input>

	          </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <footer class="textCenter mt20">
    	<!-- 未送审状态 -->
      <el-button type="primary" v-if="formDetailInfo.isAuditing === 0" @click="translateReviews">{{formDetailInfo.auditingResult === 2&&this.aduitId  ? '重新送审':'送 审'}}</el-button>
      <!-- 已送审并且未审核状态 -->
      <el-button type="primary"
      					 v-if="formDetailInfo.isAuditing !== 0 && cerificateAduit == 'view'"
      					 @click="approval">审 核</el-button>
    </footer>
  </div>
</template>
<script type="text/javascript">
	const defaults = {
		auditingAdvise:'',// 审批意见字段
	  auditingResult:'',// 审批结果字段
	}
	export default {
		name:'auditComp',
		data(){
			return {
				// 是否确认送审下拉选择
        audit:[{
          label:'是',
          value:1
        },{
          label:'否',
          value:2
        }],
        form:defaults,
        cerificateAduit:localStorage.getItem("aduitSlug"),
        rules:{
        	auditingAdvise:[{ required: true, message: '审批意见不能为空！', trigger: 'blur'}],
        	auditingResult:[{required: true, message: '审核结果不能为空！', trigger: 'change'}]
        }
			}
		},
		props:{
			standardId:{
				default:null,
			}
		},
		computed:{
			// 当前计量标准id查询到的详情
			formDetailInfo(){
        return this.$store.state.Mstandard.baseList
      },
      // 当前计量标准id
      // standardId(){
      //   return this.$route.query.id
      // },
      aduitId(){
      	return localStorage.getItem("aduitId");
      }
		},
		watch: {
			formDetailInfo(){
				this.form = {
					auditingAdvise:'',// 审批意见字段
	  			auditingResult:'',// 审批结果字段
				};
				if(this.formDetailInfo && this.formDetailInfo.auditingResult !== 0){
					this.$set(this.form,'auditingResult',this.formDetailInfo.auditingResult)
				}
				this.$set(this.form,'auditingAdvise',this.formDetailInfo.auditingAdvise)
			}
		},
		methods:{
			/**
			 * [translateReviews 送审行为]
			 * @return {[type]} [description]
			 */
			translateReviews(){
				let AJAX_METHOD = {
					Method: 'post',
					Params: {
						stId: this.standardId,
					}
				}
/*				if(this.formDetailInfo.auditingResult === 2 && this.aduitId){
					AJAX_METHOD['Params']['chargeButton'] = 1,
					AJAX_METHOD['Params']['id'] = this.aduitId
				}*/
				this.$confirm('确认送审?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(res => {
        	this.$store.dispatch('updataStandardAduit',AJAX_METHOD).then(res => {
        		this.$message({
        			message:'送审成功',
        			type:'success',
        			duration:1000,
        			onClose:(res)=>{
							this.$emit('goBack')
        				// if(this.cerificateAduit === 'review'){
        				// 	this.$router.push({
					      //     path: '/admin/367',
					      //   })
        				// }else{
        				// 	this.$router.push({
					      //     path: '/admin/248',
					      //   })
        				// }
        			}
        		})
        	})
        },rej => {

        })
			},
			/**
			 * [approval 审核行为]
			 * @return {[type]} [description]
			 */
			approval(){
				this.$refs.form.validate((valid) => {
					if(valid){
						let AJAX_METHOD = {
							Method:'put',
							Params: {
		        		stId: this.standardId,
		        		id: this.aduitId,
		        		audiTingAdvice: this.form.auditingAdvise,
		        		audTingResult: this.form.auditingResult,
		        		chargeButton: 0
		        	}
						}
						this.$confirm('确认审核结果?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          center:true,
		          type: 'warning'
		        }).then(res => {
		        	this.$store.dispatch('updataStandardAduit',AJAX_METHOD).then(res => {
		        		this.$message({
		        			message:'审核成功',
		        			type:'success',
		        			duration:1000,
		        			onClose:(res)=>{
										this.$emit('goBack')
		        				// this.$router.push({
						        //   path: '/admin/366',
						        // })
		        			}
		        		})
		        	})
		        },rej => {

		        })
					}
				})
			},
			/**
			 * [setCommentsDefault 设置审批意见的默认值：如果审核结果为是默认意见为‘同意’]
			 */
			setCommentsDefault(){
				if(this.form.auditingResult == 1){
					// this.form.auditingAdvise = '同意'
					this.$set(this.form,'auditingAdvise','同意')
				}else{
					// this.form.auditingAdvise = ''
					this.$set(this.form,'auditingAdvise','')
				}
				setTimeout(() => {
					this.$refs['auditingAdvise'].focus()
				}, 0);
			},
			// 异步编程管理
			async asyncInitFunction(){
				await Promise.all([])
			},
		},
		mounted(){
			this.asyncInitFunction()
		},
		destroyed(){
			localStorage.removeItem('aduitId');
		},
	}
</script>
<style type="text/css" scoped lang="scss">
	.aduit{
		font-size:14px;
		.wd100{
			text-align:left;
      width:100px;
    }
    .wd80{
			width:80px;
    }
    .mt20{
      margin-top:20px;
    }
    .mb20{
      margin-bottom:20px;
    }
    .lineHeight{
    	line-height:24px;
    }
    .disableEdit{
    	pointer-events:none;
    	opacity:0.5;
    }
    .textCenter{
      text-align:center;
    }
	}
</style>
