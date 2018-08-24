<template>
	<el-table class="mind-table"
    :data="data" ref="mindtable"
    v-bind="tableBind"
    v-on="$listeners">
		
	</el-table>
</template>
<script type="text/javascript">
	import Vue from 'vue'
	//import { Table, TableColumn } from 'element--ui'
	//Vue.use(Table)
	//Vue.use(TableColumn)
	export default {
		name: 'mindTable',
		data(){
			return {
				data:[]
			}
		},
		computed:{
			// 处理 $attrs 里面 Boolean 类型的 prop 和统一 prop 命名 
		    tableBind () {
		      const { $attrs } = this
		      const bind = {}
		      Object.keys($attrs).forEach(key => {
		      	cosnoel.log(key,'key')
		        const v = $attrs[key]
		        const uniformKey = key.replace(/([A-Z])/, '-$1').toLowerCase()
		        bind[key] = ~BOOLEAN_KEYS.indexOf(uniformKey) && v === '' ? true : v
		      })
		      return bind
		    },
		}
	}
</script>