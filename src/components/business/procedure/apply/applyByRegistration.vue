<template>
	<div class="applyByRegistration">
		<div class=" applyByRegistrationContent" style="text-align:center;">
			<div style="display:inline-block;text-align:left;float:right;">
				<global-tootips>
					<p>1、无登记号或无委托单号或流转单号，不可申请</p>
					<p>2、登记号的检测部门是否为当前申请人部门（高级权限除外）</p>
					<p>3、已经结算结账的不能申请退或延</p>
					<p>4、如果有缴费单，已经添加进缴费单的不能申请退或延</p>
					<p>5、登记号如果申请了全退，后面不可再申请退或延</p>
					<p>6、登记号如果有退或延已申请未处理完成的不可申请退或延</p>
					<p>7、登记号所有证书已出，系统不允许退或延</p>
				</global-tootips>
			</div>
			<div>
				<el-radio v-model="type" label="refund">退件申请</el-radio>
				<el-radio v-model="type" label="delay" >延期申请</el-radio>
			</div>
			<br/>
			<div class="label">请输入登记号:
			</div>
			<div>
				<el-input v-model="registration" ref="input" class="input-content" :class="{'error':errorText}" @focus="errorText=''"></el-input>
				<transition name="applyByRegistration">
					<div class="errorText" v-if="errorText">{{errorText}}</div>
				</transition>
			</div>
		</div>
		<div class="flex applyByRegistrationButton">
			<el-button type="primary" @click="submitRegistration">确定</el-button>
		</div>
	</div>
</template>
<script type="text/javascript">
	import $ from 'jquery'
	export default {
		name: 'applyByRegistration',
		props:{
			// 退件为 refund  延期为 delay
			// type:{
			// 	type:String
			// }
		},
		data(){
			return {
				error: false, // 错误提示
				registration: '', // 登记号
				errorText: '', // 错误提示信息
				type:'refund',//查询证书类型
			}
		},
		mounted(){
			this.$nextTick(()=>{
				this.$refs.input.focus()
        this.getInitData();
			})
		},
		methods:{
			/**
			 * [submitRegistration 提交验证号前端校验位数字，后端校验该登记号是否能过退件和延期]
			 * @return {[type]} [description]
			 */
			submitRegistration(){
                const registration = $.trim(this.registration);
				// 判断登记号是否填写
				if(registration == ''){
					this.errorText = '请输入登记号！';
					return
				}
				// 判断登记号是否是数字
				let reNum=/^\d*$/;
				if(!reNum.test(registration)){
					this.errorText = '登记号必须为数字！';
					return
				}
				if(this.registration.length !== 9){
					this.errorText = '登记号不存在！';
					return
				}
				this.errorText = '正在验证中。。。';
				this.$store.dispatch('validateRegistration',{registrationNo:this.registration,applyType:this.type == 'refund' ? '1' : '2'}).then(res => {
					if(res !== '1'){
						this.errorText = res
					}else{
						this.$store.commit('SET_REGISTRATION_INFO',{
							type: this.type, // 退件为 refund  延期为 delay
							registrationNo: this.registration, // 登记号
							type:this.type,//异常类型
						})
					}
				})
			},
      //进行中的任务跳转进入，自动带入登记号至输入框中
      getInitData(){
        if( this.$route.query.registrationNo){
          this.registration = this.$route.query.registrationNo;
        }
      }
		}
	}
</script>
<style lang="scss">
	.applyByRegistration{
		.applyByRegistrationContent{
			margin-top:10px;
			align-items: center;
	    justify-content: center;
	    font-size: 15px;
	    .label{
	    	margin-right:10px;
	    }
	    .input-content{
	    	width:450px;
	    }
	    .errorText{
	    	position:absolute;
	    	color:red;
	    	font-size:12px;
			width: 100%;
			text-align: center;
	    }
	    .error{
	    	.el-input__inner{
	    		border:1px solid red;
	    	}
	    }
		}
		.applyByRegistrationButton{
			margin-top:18px;
			justify-content: center;
		}
		.applyByRegistration-enter-active{
			animation: bounce .5s;
		}
		@keyframes bounce {
		  0% {
		    opacity: 0;
		  }
		  50% {
		    opacity: 0.5;
		  }
		  100% {
		    opacity: 1;
		  }
		}
	}
</style>
