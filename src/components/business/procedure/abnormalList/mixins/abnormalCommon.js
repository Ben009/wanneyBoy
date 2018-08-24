export default {
  data(){
    return {
      page: 1,// 当前显示的页数
      rows: 10,// 每页显示显示多少条数据
      total: 0,// 总共多少条数据
    }
  },
  methods:{
    /**
     * [handlePageSizeChange 表单分页操作: 当每页显示的条数发生变化时请求列表]
     * @return {[type]} [description]
     */
    handlePageSizeChange(size){
      this.page = 1;
      this.rows = size;
      this.getTableList()
    },
    /**
     * [handleCurrentPageChange 表单分页操作: 当上下页发生变化时请求列表]
     * @return {[type]} [description]
     */
    handleCurrentPageChange(currentPage){
      this.page = currentPage
      this.getTableList()
    },
    /************************************************** 表格数据格式化操作 start**********************************************/
    /**
     * [formatApplyType 格式化申请类型]
     * @return {[type]} [description]
     */
    formatApplyType(row, column, cellValue){
      let temp = {1: '退',2:'延期'}
      return temp[cellValue]
    },
    /**
     * [formatApplyTime 格式化申请时间]
     * @return {[type]} [description]
     */
    formatApplyTime(row, column, cellValue){
      if(cellValue){
        return new Date(cellValue).format('YYYY-MM-DD')
      }
    },
    /**
     * [formatDepartAduit 格式化部门审核结果]
     * @return {[type]} [description]
     */
    formatDepartAduit(row, column, cellValue){
      let temp = {0:'未审核',1:'审核通过',2:'退回',3:'本人撤回'}
      if(row.bmShPersonName){
        return `${temp[cellValue]}[${row.bmShPersonName}]`
      }else{
        return temp[cellValue]
      }
    },
    /**
     * [formatDepartAduit 格式化二级审核结果]
     * @return {[type]} [description]
     */
    formatAduit(row, column, cellValue){
      let temp = {0:'未审核',1:'审核通过',2:'退回'}
      if(row.shPersonName){
        return `${temp[cellValue]}[${row.shPersonName}]`
      }else{
        return temp[cellValue]
      }
    },
    reasonFormat(row,column,cellValue){
      let name = ''
      if(row.applyType == 1){
        this.refundReasonList.forEach((v,i)=>{
          if(v.code == cellValue){
            name = v.remark;
            return
          }
        })
      }else{
        this.delayReasonList.forEach((v,i)=>{
          if(v.code == cellValue){
            name = v.remark;
            return
          }
        })
      }
      return name ;
    },

    /************************************************** 表格数据格式化操作 end**********************************************/
  },
  destroyed(){
    this.$store.commit('SET_ABNORMAL_INFO',{
      type:'',
    })
  }
}
