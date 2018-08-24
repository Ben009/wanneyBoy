<template>
	<div>
		<el-select :value="value"
			   @change="handelOptionChange"
			   @input="change($event)"
			   :multiple="extraConfig.multiple"
			   :disabled="extraConfig.disabled"
			   :size="extraConfig.size"
			   :clearable="extraConfig.clearable"
			   :multiple-limit="extraConfig['multiple-limit']"
			   :placeholder="extraConfig.placeholder"
			   popper-append-to-body>
	    <el-option
	      v-for="item in options"
	      :collapse-tags="extraConfig['collapse-tags']"
	      :key="item[optionsConfig.value]"
	      :label="item[optionsConfig.label]"
	      :value="!!optionsConfig.isNumber && !isNaN(item[optionsConfig.value]*1) ? item[optionsConfig.value]*1 : item[optionsConfig.value]">
	    </el-option>
	</el-select>
	</div>
</template>
<script type="text/javascript">
	import Vue from 'vue'
	//import { Select } from 'element--ui'
	// import { ajaxProxyRequest } from '@/components/util/base';
	//
	export default {
		name: 'mindSelect',
		// data(){
		// 	return{
		// 		options: []
		// 	}
		// },
		props:{
			// 传入的v-model值
			value:{
				required:true,
			},
			options:{
				type:Array
			},
			optionsConfig:{
				type:Object,
				default(){
					return {
						label:'remark',
						value:'code',
					}
				}
			},
			// 传入的请求options的标记
			// opCode:{
			// 	type:String,
			// },
			// 重载options请求方法
			// valueCallback:{
			// 	type:Function,
			// },
			// option点击事件回调
			// 提供value参数
			changeCallback:{
				type:Function
			},
			// pcode:{},
			// 额外的特殊配置对象形式传入
			extraConfig:{
				type:Object,
				default(){
					return {
						multiple:false, // 是否多选
						disabled:false, // 是否禁用
						size:'small', // 输入框尺寸(medium/small/mini)
						clearable:false, // 单选时是否可以清空选项
						'collapse-tags':false, // 多选时是否将选中值按文字的形式展示
						'multiple-limit':0, // 多选时用户最多可以选择的项目数，为 0 则不限制
						placeholder:'请选择', // 默认值
					}
				}
			}
		},
		computed:{

		},
		// watch:{
		// 	value(val){
		// 		this.$emit('update:value', val)
		// 	},
		// 	pcode(){
		// 		this.getSelectOption()
		// 	}
		// },
		methods:{
			// getSelectOption(){
			// 	if(this.valueCallback){
			// 		this.valueCallback(this.options,this.pcode)
			// 	}else{
			// 		if( this.opCode ){
			// 			ajaxProxyRequest('get','/njmind/findParam/'+this.opCode,{
			// 				pcode:this.pcode
			// 			},(res) => {
			// 	    		this.options=res.list;
			// 	    	})
			// 		}
			// 	}	
			// },
			change(val){
				this.$emit('input',val)
			},
			handelOptionChange(val){
				if(this.changeCallback){
					this.changeCallback(val)
				}
			}
		},
		mounted(){
			console.log(this.optionsConfig,'111111')
		}
	}
</script>