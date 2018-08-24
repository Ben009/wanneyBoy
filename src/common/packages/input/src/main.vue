<template>
	<el-input :value="value"
			  @input="change($event)"
			  ref="input"
			  :type="extraConfig.type"
			  :autofocus="extraConfig.autofocus"
			  :readonly="extraConfig.readonly"
			  :size="extraConfig.size"
			  :disabled="extraConfig.disabled"
			  :clearable="extraConfig.clearable"
			  :placeholder="extraConfig.placeholder"
			  :autosize="extraConfig.autosize"
			  :rows="extraConfig.rows"
			  @blur="handleblur"
			  @focus="handlefocus"
			  @change="handlechange"
			  @clear="handleclear"></el-input>
</template>
<script type="text/javascript">
	import Vue from 'vue'
	//import { Input } from '@/common-el/src/'
	//Vue.use(Input)
	export default {
		name:'mindInput',
		props:{
			value:{},
			extraConfig:{
				type:Object,
				default(){
					return {
						autofocus:false, // 是否自动聚焦
						readonly:false, // 是否只读
						size:'small ', // 尺寸
						disabled:false, // 是否禁用
						clearable:false, // 是否出现清空按钮
						placeholder:'请输入', // 默认值
						type:'text', // input类型，支持原生类型
						autosize:false, // 是否自动撑开：只有type=“textarea”时有用
						rows:2, // 多宽 只有type=“textarea”时有用
					}
				}
			},
			handleblur:{type:Function},
			handlefocus:{type:Function},
			handlechange:{type:Function},
			handleclear:{type:Function}
		},
		methods:{
			change(val){
				this.$emit('input',val)
			},
			// 暴露出的聚焦方法
			focus() {
		        (this.$refs.input || this.$refs.textarea).focus();
		    },
		    // 暴露出的选中 input 中的文字方法
		    inputSelect() {
		        (this.$refs.input || this.$refs.textarea).select();
		    },
		    // 处理失去焦点事件
		    // innerHandleblur(event) {
		    // 	this.handleblur(event)
		    // },
		    // // 处理获取焦点事件
		    // handlefocus(event) {
		    // 	this.handlefocus(event)
		    // },
		    // // 处理选中项事件
		    // handlechange(val) {
		    // 	this.handlechange(val)
		    // },
		    // // 在点击由 clearable 属性生成的清空按钮时触发
		    // handleclear() {
		    // 	this.handleclear()
		    // }
		},
		created() {
	      this.$on('inputSelect', this.inputSelect);
	    },

	}
</script>