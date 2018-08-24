<template>
    <div class="main">
        <div  class="el-col el-col-24 el-col-sm-5">
            <div style="width:95%;">
                <span class="label">单位名称查询:</span>
                <el-input style="width:178px;" v-model="searchKey" v-focusSelect @keyup.enter="getTableList"></el-input>
                <el-button type="primary" icon="el-icon-search"  @click="getTableList"  >查询</el-button>
                <el-table :data="tableData" @row-click='test'  :max-height="QJTableMaxHeight">
                    <el-table-column align='left'>
                        <template slot-scope="scope" align="left">
                            <div :class="{cursor:true,'current-row':dataDetail && dataDetail.id == scope.row.id }">
                                <p>单位名称：{{scope.row.companyName}}</p>
                                <p>添加时间：{{scope.row.addTime}}</p>
                                <p>添加人：{{scope.row.addUserName}}</p>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="margin-top:10px;text-align:center;float:left;">
                <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    layout="prev,next,countpage,total"
                    style="margin-left:80px;"
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
        </div>
        <div class="right  el-col el-col-24 el-col-sm-19" >
            <div v-if="!!dataDetail">
                <company-content :data="dataDetail" :callback="callback" :isWatch="true"></company-content>
                <div style="textAlign:center;marginTop:20px;">
                    <el-button type="primary" @click="check(true)">审核</el-button>
                    <!-- <el-button>合并</el-button> -->
                    <el-button type="dander" v-mindPopover="{message:'是否删除?',success:check.bind(this,false)}">删除</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {ajaxRequest} from '../../util/base'
import Vue from 'vue'
import companyContent from './companyContent'

/* import {Table} from 'element--ui'
Vue.use(Table) */

export default {
  name: "companyUnaudit",
  components:{
      companyContent
  },
  data() {
    return {
        page:1,
        rows:10,
        total:0,
        tableData:[],
        dataDetail:null,
        searchKey:'',
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    getTableList() {
        ajaxRequest(
            "get",
            "back/company/retrieve",
            {
            fuzzySearch: 1,
            companyName:this.searchKey,
            page: this.page,
            rows: this.rows,
            isDelete: 0,
            total: 0,
            status:0,
            },
            res => {
            if (res.code === 200) {
                this.tableData = res.rows;
                this.total = res.total;
                this.dataDetail = null;
                if(!!this.tableData.length){
                    this.dataDetail = null;
                    setTimeout(() => {
                        this.dataDetail = this.tableData[0]
                    }, 0);
                }
            }
            }
        );
    },
    handlePageSizeChange(size){
      this.page = 1;
      this.rows = size;
      this.getTableList();
    },
    handleCurrentPageChange(currentPage) {
      this.page = currentPage;
      this.getTableList();
    },
    test(row, event, column){
        let that = this
        this.dataDetail = null;
        setTimeout(() => {
            this.dataDetail = row
        }, 0);
    },
    callback(){
    },
    check(flag){
        if(flag){
            let time = new Date();

            ajaxRequest('put','back/company/',
            {id:this.dataDetail.id,
            status:1,
            auditor:window.localStorage.getItem('userId'),
            auditTime:new Date(time).format('YYYY-MM-DD hh:mm:ss')},res=>{
                if(res.code===200){
                   this.$message.success('审核成功！')
                   this.getTableList();
                }
            })
        }else{
            ajaxRequest('put','back/company/',
            {id:this.dataDetail.id,isDelete:1},res=>{
                if(res.code ===200){
                    this.$message.success('删除成功!')
                    this.getTableList();
                }
            })
        }
    }
  }
};
</script>
<style scoped>
.label {
  color: #606266;
  font-weight: normalnpm run;
  font-size: 0.9rem;
}
.cursor{
    cursor: pointer !important;
}
.left{
    overflow: hidden !important;
    padding: 2px;
}
/* .main{
    max-height: 80vh;
    overflow: scroll;
} */
.left{
    /*width: 21vw;*/
    display: inline-block;
    vertical-align: top;
    max-height: 88vh;
    overflow: scroll;
}
.right{
   /* width: 62.5vw;*/
    display: inline-block;
    /*margin-left: 20px;*/
    vertical-align: top;
}
.current-row{
    background-color: #f0f9eb; 
}
</style>

