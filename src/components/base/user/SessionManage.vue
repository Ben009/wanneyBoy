<template>
	<mind-dialog
	:visible="true"
	title="分管部门"
	class="sessionManageDialog"
	dialogSize="mini"
	@close="handleCancel"
	center
	v-dialogDrag>
		<el-table   :data="departList"
			:max-height="QJTableMaxHeight"
      border
      ref="table"
      style="width: 100%;height: 50vh;overflow: scroll;overflow-x: hidden;"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        prop="departName"
        label="部门">
      </el-table-column>
    </el-table>
		<span slot="footer" class="dialog-footer">
	      <el-button type="primary" @click="handleSubmit">保 存</el-button>
				<el-button @click="handleCancel">取 消</el-button>
	    </span>
	</mind-dialog>
</template>
<script>
	import {ajaxRequest} from '../../util/base';
	export default {
		name:'session-manage',
		props:{
			callback:{
				type:Function
			},
			rowInfo:{
				type:Array
			}
		},
		data(){
			return {
				departList: [],
				multipleSelection: []
			}
		},
		methods:{
			handleCancel(){
				this.callback();
			},
			handleSubmit(){
				if(this.multipleSelection.length){
					this.callback(this.multipleSelection,this.rowInfo);
				}else{
				 	this.$message.error('请先选择部门！')
				 	return
				}
				
			},
			/**
			 * [handleSelectionChange 复选框勾选]
			 * @param  {[type]} val [description]
			 * @return {[type]}     [description]
			 */
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
	    /**
	     * [getSessionList 获取部门列表]
	     * @return {[type]} [description]
	     */
	    getSessionList() {
	    	return new Promise(resolve => {
	    		ajaxRequest('get','back/depart/list',{
	          isDelete: 0
	        },(val) => {
	          if (val.code === 200) {
	            this.departList = val.rows;
	          }else{
	            this.$message.error(val.message)
	          }
	          resolve(val)
	        })
	    	})
	    },
	    getSelectList(res) {
	    	ajaxRequest('get','back/userChargeDepart/getChargeDeparsByUserId',{
          userId: this.rowInfo[0].id
        },(val) => {
          let tempArray = [];
          if(val && val.length && res && res.length){
          	val.forEach(v => {
          		res.forEach(j => {
          			if(v.chargeDepartId == j.id){
          				tempArray.push(j)
          			}
          		})
          	})
          }
          this.toggleSelection(tempArray)
        })
	    },
	    toggleSelection(rows) {
	        if (rows) {
	        	this.$refs.table.clearSelection();
	          rows.forEach(row => {
	            this.$refs.table.toggleRowSelection(row, true);
	          });
	        } else {
	          this.$refs.table.clearSelection();
	        }
	    },
		},
		mounted(){
			this.getSessionList().then(res=>{
				this.getSelectList(res.rows)
			})
		}
	}
</script>
<style type="text/css">
	.el-dialog__body{
		overflow-y: hidden !important;
	}
</style>