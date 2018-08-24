<template>
	<div class="support" >
		<tecbas-dialog :callback="checkRow" :tecBasIds="tecBasIds" v-if="tecbasCon" @close="handleClose"></tecbas-dialog>
		<!-- 当前开展项目表单信息 start -->
		<div class="support_form">
			<div class="title-item mb20"><span>开展项目</span></div>
			<el-form ref="form" :model="form" :rules="rules" label-width="170px" size="mini" :class="{'disableEdit': !!formDetailInfo.isAuditing &&  !isAdd}">
				<el-row>
          <el-col :span="12" class="el-form-item  is-required">
          	<el-form-item label="项目名称" prop="itemName">
	            <el-input v-model="form.itemName"></el-input>
	        	</el-form-item>
					</el-col>
					<el-col :span="12" class="el-form-item  is-required">
						<el-form-item label="开展项目方式" prop="itemWay">
	            <mind-select :options="itemWayOptions"
                           :optionsConfig="{label:'label',value:'value'}"
                           v-model="form.itemWay"
                           class="selectFull"></mind-select>
	        	</el-form-item>
					</el-col>
				</el-row>
				<el-row>
          <el-col :span="24">
          	<el-form-item prop="mearsuRingRange">
          		<template slot = "label">
                 <span>测量范围</span>
                 <!-- <el-tooltip class="item" effect="dark" content="选中文本内容右击可添加修饰符">
                  <i class="el-icon-info ft12"></i>
                 </el-tooltip> -->
              </template>
              <el-input @input="valueChange('mearsuRingRange')" v-if="!form.mearsuRingRange" v-model="form.mearsuRingRange" ></el-input>
              <el-popover
                v-if="form.mearsuRingRange"
                popper-class="baseDetaildark"
                :visible-arrow="false"
								placement="bottom-start"
                trigger="hover">
                <div v-html="form.mearsuRingRange"></div>
                <el-input ref="mearsuRingRange" slot="reference" v-model="form.mearsuRingRange" ></el-input>
              </el-popover>
	        	</el-form-item>
					</el-col>
				</el-row>
				<el-row>
          <el-col>
          	<el-form-item prop="accuracyClass">
          		<template slot = "label">
                 <span>不确定度或准确度等级</span>
                 <!-- <el-tooltip class="item" effect="dark" content="选中文本内容右击可添加修饰符">
                  <i class="el-icon-info ft12"></i>
                 </el-tooltip> -->
              </template>
              <el-input @input="valueChange('accuracyClass')" v-if="!form.accuracyClass" v-model="form.accuracyClass"></el-input>
              <el-popover
                v-if="form.accuracyClass"
                popper-class="baseDetaildark"
                :visible-arrow="false"
								placement="bottom-start"
                trigger="hover">
                <div v-html="form.accuracyClass"></div>
                <el-input ref="accuracyClass" slot="reference" v-model="form.accuracyClass"></el-input>
              </el-popover>
	        	</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item :label="'依据规程' + (index+1)" v-for="(tecBas,index) in tecBasArray" :key="index" required :class="{'is-error':!!tecBas.errorIcon}">
	            <div style="flex-wrap: wrap;" class="flex">
								<el-input v-model="tecBas.tecBasName" class="mr10" @focus="selectTecBas(index)" @blur="noticeCheck(index)" style="margin-right:0; position:relative">
                  <el-button slot="append" type="primary" @click="handleAdd" style="color:#14a7fb"><i class="el-icon-circle-plus" title="增加" style="font-size:16px;"></i></el-button>
                  <el-button slot="append" v-if="tecBasArray.length == 1" type="warning" v-mindPopover="{message:'是否清空?',success:handleRefrence}"><i class="el-icon-refresh" title="置空" style="font-size:16px;"></i></el-button>
                  <el-button slot="append" v-if="tecBasArray.length != 1" type="primary" v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,index)}"><i class="el-icon-delete" title="删除" style="font-size:16px;"></i></el-button>
                </el-input>
									<br><span v-show="!!tecBas.errorIcon" style="font-size:14px;color:#f56c6c;">依旧规程不能为空</span>
	            </div>
	        	</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div class="textCenter" v-if="!formDetailInfo.isAuditing ||  isAdd">
				<el-button type="primary" @click="submitForm">{{isEdit ? '编辑' : '新增'}}</el-button>
		    <el-button @click="handleRefrenceForm" v-if="!isEdit">清空</el-button>
		    <el-button v-if="isEdit" @click="handleCancle">取消</el-button>
			</div>
		</div>
		<!-- 当前开展项目表单信息 end -->
		<!-- 开展项目列表信息 start -->
		<div class="support_table">
			<div class="title-item mb20"><span>可开展项目</span></div>
			<el-table :max-height="QJTableMaxHeight"
				:data="tableDate"
	      border
        :class="{'disableEdit': !!formDetailInfo.isAuditing &&  !isAdd}"
	      style="width: 100%">
	      <el-table-column
		      type="index"
		      width="70px"
		      show-overflow-tooltip
		      label="序号">
		    </el-table-column>
		    <el-table-column
		      prop="ITEMNAME"
		      show-overflow-tooltip
		      label="项目名称">
		    </el-table-column>
		    <el-table-column
		      prop="ITEMWAY"
		      :formatter="formatItemWay"
		      show-overflow-tooltip
		      label="项目开展方式">
		    </el-table-column>
		    <el-table-column
		      prop="MEARSURINGRANGE"
		      show-overflow-tooltip
		      label="测量范围">
		    </el-table-column>
		    <el-table-column
		      prop="ACCURACYCLASS"
		      show-overflow-tooltip
		      label="不确定度或准确度等级">
		    </el-table-column>
		    <el-table-column
		      prop="TecBas"
		      show-overflow-tooltip
		      :formatter="formatTecBas"
		      label="依据规程">
		    </el-table-column>
		    <el-table-column
		      show-overflow-tooltip
		      label="操作">
		      <template slot-scope="scope">
						<el-button v-btnHas="{message:'M22002',id:$route.query.id}" @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
		          <i class="el-icon-edit" title="详细"></i>
		        </el-button>
		        <el-button v-mindPopover="{message:'是否删除?',success:handleProjectDelete.bind(this,scope.row)}" type="text" style="padding:0;font-size:18px;">
		          <i class="el-icon-delete" title="删除"></i>
		        </el-button>
		      </template>
		    </el-table-column>
    	</el-table>
		</div>
		<!-- 开展项目列表信息 end -->
	</div>
</template>

<script type="text/javascript">
	import rightclick from '@/directives/rightcilck'
  import rightClick from '@/mixins/FormRightClick'
  import tecbasDialog from './dialog/tecbasDialog'
	const defaults = {
		itemWay:2
	}
	export default {
		name:'support',
		mixins: [rightClick],
		props:{
			isAdd:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return {
				// 当前编辑或新增的开展项目表单信息
				form:Object.assign({},defaults,this.supportForm),
				// 表单校验规则
				rules:{
					itemWay:[{required: true, message: '项目开展方式不能为空', trigger: 'change'}],
					itemName:[{type: 'string', required: true, message: '项目名称不能为空', trigger: 'blur'},{max: 400, message: '最多输入400个字符', trigger: 'blur'}],
					mearsuRingRange:[{max: 400, message: '最多输入400个字符', trigger: 'blur'}],
					accuracyClass:[{max: 400, message: '最多输入400个字符', trigger: 'blur'}],
				},
				// 依据规程列表 默认存在一个空值
				tecBasArray: [{tecBasName: '', basisSId: '',errorIcon:false}],
				// 开展项目方式下拉选择
				itemWayOptions:[{
					label:'检定',
					value:0
				},{
					label:'校准',
					value:1
				},{
					label:'检定或校准',
					value:2
				}],
				// 当前点击的依据规程的索引
				currentTecbasIndex:'',
				// 判断表单信息是新增还是编辑 默认新增
				isEdit:false,
				// 之前的表单控制是由vuex内的状态进行控制，导致mounted无效
				tecbasCon:false,
			}
		},
		computed:{
			// 所有选中的依据规程的id 用于筛选依据规程列表和提交保存操作
			tecBasIds(){
				let tempIds = [];
				this.tecBasArray.forEach(val => {
					if(val.basisSId){
						tempIds.push(val.basisSId)
					}
				})
				return tempIds
			},
			// 当前仪器标准的id
			currentStandardId(){
        return this.$store.state.Mstandard.currentStandardId
      },
      // 所有开展项目的列表信息
      tableDate (){
      	return this.$store.state.Mstandard.projectTableList
      },
      // 当前计量标准的详细信息
      formDetailInfo(){
        return this.$store.state.Mstandard.baseList
      },
		},
		watch:{
			// 获取到当前仪器标准的id时请求开展项目的列表信息
			currentStandardId(){
				if(this.currentStandardId){
					this.getTableList()
				}
			}
		},
    directives:{
      rightclick,
      btnHas:{
        bind: function(el, binding) {
          let buttonpermsStr=window.localStorage.getItem("btnPower");
          if(buttonpermsStr==null || buttonpermsStr==undefined) {//没有权限，所有涉及权限的按钮都不展示
            el.parentNode.removeChild(el);
          }else if(buttonpermsStr.indexOf("@"+binding.value.message+"@") == -1 && binding.value.id){//没有该按钮权限，隐藏按钮
            el.parentNode.removeChild(el);
          }
        }
      }
    },
		methods:{
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
       * [formatItemWay 格式化接口返回的信息，选中开展项目方式下拉的值]
       * @param  {[type]} row       [description]
       * @param  {[type]} column    [description]
       * @param  {[type]} cellValue [description]
       * @return {[type]}           [description]
       */
      formatItemWay(row, column, cellValue){
      	for(let temp of this.itemWayOptions){
      		if(cellValue == temp.value){
      			return temp.label
      		}
      	}
      },
      /**
       * [formatTecBas 格式化接口返回的信息，只展示所有依据规程的名称]
       * @param  {[type]} row       [description]
       * @param  {[type]} column    [description]
       * @param  {[type]} cellValue [description]
       * @return {[type]}           [description]
       */
      formatTecBas(row, column, cellValue){
      	let tempName = [];
      	if(cellValue && cellValue.length){
      		cellValue.forEach(val => {
      			if(val.TECNAME){
      				tempName.push(val.TECNAME)
      			}
      		})
      	}
      	return tempName.join()
      },
     	/**
     	 * [selectTecBas 点击依据规程当前行得操作，记录当前行的索引 并且打开依据规程列表弹框]
     	 * @param  {[type]} index [description]
     	 * @return {[type]}       [description]
     	 */
      selectTecBas(index){
      	this.currentTecbasIndex = index
				this.$store.commit('TECBAS_DIALOG',true)
				this.tecbasCon = true
      },
      /**
       * [checkRow 依据规程弹框选择的回调操作，替换掉当前行的信息]
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      checkRow(row){
				this.tecbasCon = false
      	this.$store.commit('TECBAS_DIALOG',false)
      	this.tecBasArray.splice(this.currentTecbasIndex,1,{tecBasName:row.name,basisSId:row.id,errorIcon:false})
      },
      /**
       * [handleDelete 依据规程的新增操作]
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      handleAdd(){
      	this.tecBasArray.push({tecBasName: '', basisSId: '',errorIcon:false})
      },
      /**
       * [handleDelete 依据规程的删除操作]
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      handleDelete(index){
      	// this.$confirm('确认要删除?', '提示', {
       //    confirmButtonText: '确定',
       //    cancelButtonText: '取消',
       //    center:true,
       //    type: 'warning'
       //  }).then(res => {
        	this.$message.success('删除成功')
        	this.tecBasArray.splice(index,1)
        // }, rej => {

        // })
      },
      /**
       * [handleRefrence 依据规程的清空操作]
       * @return {[type]} [description]
       */
      handleRefrence(){
      	// this.$confirm('确认要清空?', '提示', {
       //    confirmButtonText: '确定',
       //    cancelButtonText: '取消',
       //    center:true,
       //    type: 'warning'
       //  }).then(res => {
        	this.$message.success('清空成功')
        	this.tecBasArray = [{tecBasName: '', basisSId: '',errorIcon:false}]
        // }, rej => {

        // })
      },
      /**
       * [submitForm 表单提交操作 包括更新和新增]
       * @return {[type]} [description]
       */
      submitForm(){
      	this.$refs.form.validate((valid) => {
      		if(valid){
      			if(!this.tecBasIds.length){
      				return
      			}
      			let http = this.isEdit ? {
		      		Method : 'put',
		      		ajaxUrl : 'back/mStandard/updateMitem'
		      	} : {
		      		Method : 'post',
		      		ajaxUrl : 'back/mStandard/addMitem'
		      	}
		      	this.form.tecBasids = this.tecBasIds.join()
		      	this.form.stId = this.currentStandardId
		      	this.$confirm('确认要保存?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          center:true,
		          type: 'warning'
		        }).then(res => {
		        	this.$store.dispatch('submitMitemForm',{
		        		Method: http.Method,
		        		AjaxUrl: http.ajaxUrl,
		        		Data: this.form
		        	}).then(res => {
		        		this.getTableList();
		        		if(!this.isEdit){
		        			this.form = {itemWay:2}
         					this.tecBasArray = [{tecBasName: '', basisSId: '',errorIcon:false}]
		        		}
		        		this.$message.success('保存成功')
		        	})
		        }, rej => {

		        })
      		}
      	})
      },
      /**
       * [handleRefrenceForm 处理当前表单的清空操作，非编辑和新增情况，编辑需要保留当前项目的id]
       * @return {[type]} [description]
       */
      handleRefrenceForm(){
         if(this.form.id){
         	this.form = Object.assign({},{id:this.form.id,itemName:'',itemWay:2,mearsuRingRange:'',accuracyClass:''})
         	this.tecBasArray = [{tecBasName: '', basisSId: '',errorIcon:false}]
         }else{
         	this.form = {itemWay:2}
         	this.tecBasArray = [{tecBasName: '', basisSId: '',errorIcon:false}]
         }
      },
      /**
       * [getTableList 获取开展项目列表信息]
       * @return {[type]} [description]
       */
      getTableList(){
      	this.$store.dispatch('getPorjectList',{isDelete:0,stantardId:this.currentStandardId})
      },
      /**
       * [handleEdit 开展项目列表编辑操作，将列表信息展示到表单中]
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      handleEdit(row){
      	let tempArray = [];
      	if(row && row.TecBas && row.TecBas.length){
      		row.TecBas.forEach(val => {
      			tempArray.push({
      				tecBasName:val.TECNAME,
      				basisSId:val.TECID
      			})
      		})
      	}
      	if(tempArray.length){
      		this.tecBasArray = tempArray
      	}
      	this.form = Object.assign({},{
      		id:row.ID,
      		itemName:row.ITEMNAME,
      		itemWay:row.ITEMWAY,
      		mearsuRingRange:row.MEARSURINGRANGE,
      		accuracyClass:row.ACCURACYCLASS,
      	})
      	this.isEdit = true
      },
      /**
       * [handleProjectDelete 开展项目列表删除操作（软删除：isDelete:1）]
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      handleProjectDelete(row){
        console.log(row.ID)
      	let http = {
      		Method : 'put',
      		ajaxUrl : 'back/mStandard/updateMitem'
      	}
      	this.$confirm('确认要删除该项目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(res => {
	      	this.$store.dispatch('submitMitemForm',{
        		Method: http.Method,
        		AjaxUrl: http.ajaxUrl,
        		Data: {
        			id:row.ID,
        			isDelete:1,
        			delWay:'0',
        		}
        	}).then(res => {
        		this.getTableList();
            this.form = {};
            this.tecBasArray = [{tecBasName: '', basisSId: '',errorIcon:false}]
            this.isEdit = false
        		this.$message.success('删除成功')
        	})
        })
      },
      /**
       * [handleCancle 表单部分编辑时退出编辑时的操作]
       * @return {[type]} [description]
       */
      handleCancle(){
      	this.form = {};
      	this.tecBasArray = [{tecBasName: '', basisSId: '',errorIcon:false}]
      	this.isEdit = false
			},
			/**
			 * [noticeCheck 依据规程提示]
			 * @param {index} 选择的位置
			 */
			noticeCheck(index){
				if(!this.tecBasArray[index].tecBasName){
					this.tecBasArray[index].errorIcon = true;
				}else{
					this.tecBasArray[index].errorIcon = false;
				}
			},
			handleClose(){
				this.tecbasCon = false
			}
		},
		components:{
			tecbasDialog
		},
	}
</script>

<style type="text/css" lang="scss">
	.support{
		.mb20{
			margin-bottom:20px;
		}
		.mr10{
			margin-right:10px;
		}
		.ft12{
			font-size:12px;
		}
    .disableEdit{
      pointer-events:none;
      opacity:0.8;
    }
		.support_form{
			.selectFull{
	      .el-select{
	        width:100%;
	      }
	    }
	    .textCenter{
	    	text-align:center;
	    }
		}
	}
</style>
