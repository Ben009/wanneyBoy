<template>
	<mind-dialog
    title="单位多信息选择"
    :visible="true"
    dialogSize="mid"
		center
		v-dialogDrag
    @close="handleCancel">
		<el-table :max-height="QJTableMaxHeight"
	        :data="tableData"
	        border
	        style="width: 100%"
	        @row-click="handleCancel">
	        <el-table-column
            width="50px"
            label="序号"
	          type="index">
	        </el-table-column>

	        <el-table-column
	          prop="contacter"
	          label="联系人">
	        </el-table-column>

	        <el-table-column
	          prop="telephone"
	          label="电话">
	        </el-table-column>

	        <el-table-column
	          prop="fax"
	          label="传真">
	        </el-table-column>

	        <el-table-column
	          prop="certificateCompanyName"
	          label="证书单位名称">
	        </el-table-column>

	        <el-table-column
	          prop="address"
	          label="地址">
	        </el-table-column>

	    </el-table>
  	</mind-dialog>
</template>
<script type="text/javascript">
  import Vue from 'vue'
  import Vuex from 'vuex'
  import { ajaxRequest, formatArrayToTree,formatDate } from '../../util/base'
  import vueBus from 'vue-bus'
	import $ from 'jquery'

/* 	  import { Button, Table, TableColumn, Container, Header } from 'element--ui'
		Vue.use(Button)
		Vue.use(Table)
		Vue.use(TableColumn)
		Vue.use(Container)
		Vue.use(Header)
		 */
Vue.use(vueBus)
  const defaults = {
    hoho: ''
  };
	export default {
		props:{
			callback:{
				type:Function,
				required:true,
			},
      data:{
			  type:Number,
        required:true,
      }
		},
		data(){
			return {
				tableData:[]
			}
		},
		methods:{
      getCompanyContact(){
        this.tableData.push(this.data);
        ajaxRequest('get', 'back/companyContact/getCompanyContactByCompanyId',{companyId:this.data}, res => {
          if (res.code === 200) {
            this.tableData=res.rows;
          }
        })
      },
			handleCancel(val){
				this.callback(val)
			},
		},
    mounted(){
		  this.getCompanyContact();
    }
	}
</script>
