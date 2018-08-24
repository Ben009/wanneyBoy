<template>
    <mind-dialog :title="status == 'viewed'? '查看已阅人员':'查看未阅人员'"
    :visible="true"
    dialogSize="mid"
    center
    v-dialogDrag
    :lock-scroll="true"
    @close="handleCancel">
        <div style="min-height:38vh">
            <el-table :max-height="QJTableMaxHeight" v-if="status=='viewed'" :data="tableDate">
                <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
                <el-table-column label="收阅人姓名"  prop="userName"></el-table-column>
                <el-table-column :render-header="QJrenderHeader" label="收阅人部门"  prop="departName"></el-table-column>
                <el-table-column :render-header="QJrenderHeader" label="收阅时间"  prop="readTime"></el-table-column>
            </el-table>
            <el-table :max-height="QJTableMaxHeight" v-if="status == 'unviewed'" :data="tableDate">
                <el-table-column label="序号" type="index" width="50" fixed></el-table-column>
                <el-table-column  label="未收阅人姓名" prop="userName" ></el-table-column>
                <el-table-column :render-header="QJrenderHeader" label="未收阅人部门" prop="departName" ></el-table-column>
            </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right;padding-bottom:10px;">
            <mind-pagination
                :current-page="page"
                :page-size="rows"
                :total="total"
                @size-change="handlePageSizeChange"
                @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
    </mind-dialog>
</template>
<script>
import Vue from 'vue'
import Vuex from 'vuex'
import param from './memberCheck.js'
export default {
    name:'memberCheck',
    data(){
        return {
            tableDate:[],
            // 分页
            page:1,
            rows:10,
            total:0,
            // 高级搜索
            sc:'',
            rowsCondition:param,//默认同目录下json数据 会依据模板改变
            paramJson:param,//同目录下json数据 常量
        }
    },
    computed:{
        status(){
            return this.$store.state.Notification.viewStatus
        },
        noticeId(){
            return this.$store.state.Notification.noticeId
        }
    },
    mounted(){
        this.getInfo();
    },
    destroyed(){

    },
    methods:{
        // 关闭事件
        handleCancel(){
            this.$store.commit('SET_VIEWSTAUTS',null)
        },
        // 获取页面数据
        getInfo(){
            this.$store.dispatch('get_view',{
                status:this.status,
                noticeId:this.noticeId,
                page:this.page,
                rows:this.rows,
                total:0,
                sc:this.sc,
                orderProperty:this.orderProperty,
                orderType:this.orderType,
                }).then((res)=>{
                this.tableDate = res.rows
                this.total = res.total
            })
        },
        handlePageSizeChange(){
            this.page = 1;
            this.rows = size;
            this.getInfo();
        },
        handleCurrentPageChange(currentPage){
            this.page = currentPage;
            this.getInfo();
        },
        QJhandleSearch(column,value){
            var comparison = this.getComparison(column.property);
            var sqlSeg = this.getSqlSeg(column.property);
            this.sc = JSON.stringify([{"nameCode":column.property,"sqlSeg":sqlSeg,"comparison":comparison,"value":value}])
            this.getInfo()
        },
    }
}
</script>
<style scoped>

</style>

