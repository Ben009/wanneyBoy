<template>
	<el-table  :data="tableDate"
      :max-height="QJTableMaxHeight"
      border
      style="width: 100%">
		<el-table-column
      prop="instrumentationName"
      show-overflow-tooltip
      label="设备名称">
      <template slot-scope="scope">
				<div @click="selectInstrument(scope.$index)">{{scope.row.instrumentationName|| '无'}}</div>
      </template>
    </el-table-column>
    <el-table-column
      prop="model"
      show-overflow-tooltip
      label="型号规格">
    </el-table-column>
    <el-table-column
      prop="manufacturingCode"
      show-overflow-tooltip
      label="出厂编号">
    </el-table-column>
    <el-table-column
      prop="deviceNumber"
      show-overflow-tooltip
      label="设备编号">
    </el-table-column>
    <el-table-column
      prop="accuracyClass"
      show-overflow-tooltip
      label="准确度等级">
    </el-table-column>
    <el-table-column
      prop="mearsuringRange"
      show-overflow-tooltip
      label="测量范围">
    </el-table-column>
    <el-table-column
      prop="manufacturer"
      show-overflow-tooltip
      label="制造厂家">
    </el-table-column>
    <el-table-column
      prop="calibrationDate"
      :formatter="dealDate"
      show-overflow-tooltip
      label="检定日期">
    </el-table-column>
    <el-table-column
      prop="effectiveDate"
      show-overflow-tooltip
      :formatter="dealDate"
      label="有效期限">
    </el-table-column>
    <el-table-column
      prop="certificateNo"
      show-overflow-tooltip
      label="证书编号">
    </el-table-column>
    <el-table-column
      prop=""
      width="120px"
      label="操作">
      <template slot-scope="scope">
				<el-button @click="handleAdd(scope.row)" type="text" style="padding:0;font-size:18px;">
          <i class="el-icon-circle-plus" title="增加"></i>
        </el-button>
        <el-button v-if="tableDate.length == 1" v-mindPopover="{message:'是否置空?',success:handleReset.bind(this,scope.$index)}" type="text" style="padding:0;font-size:18px;">
          <i class="el-icon-refresh" title="置空"></i>
        </el-button>
        <el-button v-if="tableDate.length !== 1" v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,scope.$index)}" type="text" style="padding:0;font-size:18px;">
          <i class="el-icon-delete" title="删除"></i>
        </el-button>
        <!-- <el-button @click="handleReview([scope.row])" type="text" style="padding:0;font-size:18px;">
          <i class="el-icon-view" title="查看"></i>
        </el-button> -->
      </template>
    </el-table-column>
	</el-table>
</template>
<script type="text/javascript">
	const tableDefault = {};
	export default {
		props:{
			tableDate:{
				type:Array,
				default(){
					return [tableDefault]
				}
			},
			slug:{
				type:String,
				require:true
			}
		},
		methods:{
			handleAdd(){
				this.tableDate.push(tableDefault)
			},
			handleDelete(index){
        console.log(this.tableDate,index,'11111')
				if(this.tableDate.length == 1){
					this.tableDate.splice(index,1,{})
				}else{
	        this.tableDate.splice(index,1)
				}
			},
			handleReset(index){
				console.log(index,'index')
				this.$store.commit('CURRENT_INDEX',index)
				if(this.slug == 'main'){
					this.$store.commit('REPLACE_MAININFO',{})
				}else if (this.slug == 'second'){
					this.$store.commit('REPLACE_SECONDINFO',{})
				}
			},
			handleReview(){
				
			},
			selectInstrument(index){
				this.$store.commit('CURRENT_INDEX',index)
				this.$store.commit('INSTRUMENT_DIALOG',this.slug)
			},
			dealDate: function (row, column, cellValue) {
	      if(cellValue){
	    		return new Date(cellValue).format('YYYY-MM-DD')
	    	}
	    }
		}
	}
</script>
<style type="text/css">

</style>