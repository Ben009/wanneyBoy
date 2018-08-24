<template>
	<el-checkbox :value="value"
				 @input="valueChange($event)"
				 @change="handleChange"
				 :disabled="extraConfig.disabled"
				 :border="extraConfig.border"
				 :size="extraConfig.size"></el-checkbox>
</template>
<script type="text/javascript">
	import Vue from 'vue'
/* 	import { Checkbox } from 'element--ui'
	Vue.use(Checkbox) */
	export default {
		name:'mindCheckbox',
		props:{
			value:{},
			change:{
				type:Function
			},
			extraConfig:{
				type:Object,
				default(){
					return {
						disabled:false, // 是否禁用
						border:false, // 是否有边框
						size:'small', // 尺寸
					}
				}
			}
		},
		methods:{
			// 处理change事件 val为更新后的值
			handleChange(val){
				if(this.change){
					this.change(val)
				}
			},
			valueChange(val){
				this.$emit('input',val)
			}
		}
	}
</script>