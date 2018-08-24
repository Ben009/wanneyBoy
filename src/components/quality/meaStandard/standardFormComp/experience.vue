<template>
	<div class="experience">
		<!-- 主标准器信息 start -->
		<div class="title-item flex mb20">
			<span class="flex-one">主标准器</span>
			<div class="el-icon-info  shuoming">
        <el-row class="el-sm">
          <p>1.主配套设备均需从仪器设备库中调用</p>
          <p>2.有权限人员可在此直接查看该仪器设备的证书</p>
        </el-row>
      </div>
		</div>
		<instrument-table class="mb20" :tableDate="mianTableList" slug="main" :class="{'disableEdit': !!formDetailInfo.isAuditing && !isAdd}"></instrument-table>
		<!-- 主标准器信息 end -->
		<!-- 配套设备信息 start -->
		<div class="title-item mb20"><span>配套设备</span></div>
		<instrument-table class="mb20" :tableDate="secondTableList" slug="second" :class="{'disableEdit': !!formDetailInfo.isAuditing &&  !isAdd}"></instrument-table>
		<!-- 配套设备信息 end -->
		<header class="header_save" v-if="!formDetailInfo.isAuditing ||  isAdd">
			<el-button type="primary" v-btnHas="{message:'M22002',scope:this}" @click="submit">保存</el-button>
		</header>
		<instrument-dialog :callback="checkRow" :instrumentIds="instrumentIds" v-if="dialogVisable"></instrument-dialog>
	</div>
</template>

<script type="text/javascript">
	// 仪器设备表格
	import instrumentTable from './instrumentTable/instrumentTable'
	// 仪器设备查询弹框
	import instrumentDialog from './dialog/instrumentDialog'
	export default {
		name:'experience',
		components:{
			instrumentTable,
			instrumentDialog
		},
		props:{
			isAdd:{
				type:Boolean,
				default:true,
			}
		},
		directives:{
			btnHas:{
				bind: function(el, binding) {
			    let buttonpermsStr=window.localStorage.getItem("btnPower");
			    if(buttonpermsStr==null || buttonpermsStr==undefined) {//没有权限，所有涉及权限的按钮都不展示
						el.parentNode.removeChild(el);
						/********************这个地方的$route.query.id应该要换成currentStandardId */
			    }else if(buttonpermsStr.indexOf("@"+binding.value.message+"@") == -1 && binding.value.scope.$route.query.id){//没有该按钮权限，隐藏按钮
			      el.parentNode.removeChild(el);
			    }
			  }
			}
		},
		computed:{
			// 主标准器的列表信息
			mianTableList(){
				return this.$store.state.Mstandard.instrumentMainList
			},
			// 配套设备的列表信息
			secondTableList(){
				return this.$store.state.Mstandard.instrumentSecondList
			},
			// 仪器设备弹框是否打开的标志位
			dialogSlug(){
				return this.$store.state.Mstandard.instrumentDialog
			},
			// 当前仪器标准的id
			currentStandardId(){
        return this.$store.state.Mstandard.currentStandardId
      },
      // 选中的所有仪器设备id，用于筛选仪器设备列表
			instrumentIds(){
				let allTableList = [...this.mianTableList,...this.secondTableList],
						tempIds = [];
				allTableList.forEach(val => {
					if(val.id){
						tempIds.push(val.id)
					}
				})
				return tempIds
			},
			// 当前计量标准的详细信息
      formDetailInfo(){
        return this.$store.state.Mstandard.baseList
			},
			dialogVisable(){
				return this.$store.state.Mstandard.instrumentDialog
			}
		},
		watch:{
			// 获取到当前仪器标准的id时请求主/配套信息
			currentStandardId(){
				if(this.currentStandardId){
					this.getFormList()
				}
			}
		},
		methods:{
			/**
			 * [checkRow 仪器设备弹框的回调，用于处理弹框回显操作]
			 * @param  {[type]} row [description]
			 * @return {[type]}     [description]
			 */
			checkRow(row){
				if(this.dialogSlug == 'main'){
					this.$store.commit('REPLACE_MAININFO',row)
				}else if (this.dialogSlug == 'second'){
					this.$store.commit('REPLACE_SECONDINFO',row)
				}
				this.$store.commit('INSTRUMENT_DIALOG',false)
			},
			/**
			 * [submit 表单提交操作，未做非空校验]
			 * @return {[type]} [description]
			 */
			submit(){
				let params = this.collectIds()
				this.$confirm('确认保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(res=>{
        	this.$store.dispatch('submitInstrumentForm',params).then(res => {
        		this.$message.success('保存成功')
        	})
        })
			},
			/**
			 * [collectIds 获取所有选中的仪器设备的id用于提交操作]
			 * @return {[type]} [description]
			 */
			collectIds(){
				let mainSc = [],
						minorSc = [];
				this.mianTableList.forEach(val => {
					if(val.id){
						mainSc.push(val.id)
					}
				})
				this.secondTableList.forEach(val => {
					if(val.id){
						minorSc.push(val.id)
					}
				})
				return {
					mainSc:mainSc.length ? mainSc.join() : '',
					minorSc:minorSc.length ? minorSc.join() : '',
					stId:this.currentStandardId
				}
			},
			/**
			 * [getFormList 获取主/配套信息]
			 * @return {[type]} [description]
			 */
			getFormList(){
				this.$store.dispatch('getExperienceTable',{stantardId:this.currentStandardId})
			}
		}
	}
</script>

<style type="text/css" lang="scss">
	.experience{
		.mb20{
			margin-bottom:20px;
		}
		.disableEdit{
      pointer-events:none;
      opacity:0.8;
    }
		.header_save{
			text-align:center;
		}
		.flex-one{
      flex:1;
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
      margin-left: -288px;
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
	}
</style>
