<template>
    <div>
        <!-- 留给高级搜索 -->
        <div v-if="!id">
            <Retrieve  ref="retrieve-wapper"
                    :rowsCondition='rowsCondition'
                    :sortBy="sortBy"
                    v-if="defaultOpen"
                    :order="order"
                    :paramJson="paramJson"
                    :retrieveCondition="retrieveCondition"
                    :collectionInfo="collectionInfo"/>
        </div>
        <div style="text-align:center;" v-if="!id">
            <div style="display: inline-block;">
                <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询</el-button>
                <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning" v-if="defaultOpen" >&nbsp;清空</el-button>
            </div>
            <div style="float: right">
                <el-select size="mini" v-model="templateValue"  placeholder="请选择" @change="QJHandleSelectTemplate">
                    <el-option
                        v-for="item in moduleList"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                </el-select>
                <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
                <div style="display:inline-block;text-align:left;">
                    <global-tootips>
                        <p>1、标题红：表示未审核</p>
                        <p>2、发布：若通知未审核，则不能进行发布</p>
                    </global-tootips>
                </div>
                <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
            </div>
        </div>

        <!-- ************ -->
        <div v-if="!id">
            <div>
                <el-table :data="tableData"
                border
                style="width: 100%;min-height:39vh;"
                :max-height="QJTableMaxHeight"
                v-loading="loading"
                >
                    <el-table-column  fixed  type="index"  label="序号"  width="50"> </el-table-column>
                    <el-table-column  :render-header="QJrenderHeader" prop="noticeTitle" label="标题"  >
                        <template slot-scope="title">
                                <span v-if="title.row.auditingStatus==0" style="color:red;">{{title.row.noticeTitle}}</span>
                                <span v-if="title.row.auditingStatus!=0">{{title.row.noticeTitle}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  :render-header="QJrenderHeader" prop="createPersonName" label="录入人"  width="200" ></el-table-column>
                    <el-table-column  :render-header="QJrenderHeader" prop="createTime" label="录入日期"  :formatter="dateFormat" ></el-table-column>
                    <el-table-column  :render-header="QJrenderHeader" prop="isShow" label="是否发布"  width="100"  :formatter="isShowFormat" ></el-table-column>
                    <el-table-column  :render-header="QJrenderHeader" prop="type" label="发布范围"  width="100" :formatter="typeFormat" ></el-table-column>
                    <el-table-column  :render-header="QJrenderHeader" prop="auditingStatus" label="审核状态"  width="100" :formatter="auditFormat" ></el-table-column>
                    <el-table-column  :render-header="QJrenderHeader" prop="showTime" label="发布日期"  :formatter="dateFormat" ></el-table-column>
                    <el-table-column  :render-header="QJrenderHeader" prop="showPersonName" label="发布人"  ></el-table-column>
                    <el-table-column  label="操作" width="240">
                        <template slot-scope="scope">
                            <el-button type="text"  @click="detail(scope.row)"  title='编辑' class="button">
                                <i class="el-icon-edit"></i>
                            </el-button>
                            <el-button type="text"  v-if="scope.row.isTop==0" v-has="'M57501'" title='置顶' class="button"
                            v-mindPopover="{message:'确定置顶?',success:editStatus.bind(this,scope.row,1)}" >
                                <i class="el-icon-upload2"></i>
                            </el-button>
                            <el-button type="text"  v-if="scope.row.isTop==1" v-has="'M57501'" title='取消置顶' class="button"
                            v-mindPopover="{message:'确定取消置顶?',success:editStatus.bind(this,scope.row,3)}" style="color:#DB4D6D;transform: rotate(180deg);">
                                <i class="el-icon-upload2"></i>
                            </el-button>
                            <el-button type="text"   :disabled="scope.row.isShow==1 || scope.row.auditingStatus == 0" v-has="'M57502'" title='发布' class="button"
                            v-mindPopover="{message:'确定发布?',success:editStatus.bind(this,scope.row,2)}" >
                                <i class="el-icon-message"></i>
                            </el-button>
                            <el-button type="text" v-has="'M57503'" class="button"
                            v-mindPopover="{message:'确定删除?',success:editStatus.bind(this,scope.row,0)}" title="删除" >
                                <i class="el-icon-delete"></i>
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="margin-top:10px;text-align:center;float:right;">
                <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
        </div>
        <notification-edit v-if="id" :infoId="id"></notification-edit>
        <!-- <member-check v-if="status"></member-check> -->
    </div>
</template>
<script>
import Vue from "vue";
import Vuex from 'vuex'
import paramJson from './notificationSearch.js';
import {ajaxRequest} from '../../util/base';
import notificationEdit from './notificationEdit';
import Retrieve from '../../Retrieve';
import WorkMould from '../../mould/WorkMould';
import memberCheck from './memberCheck.vue'
export default {
    name:'notification-search',
    data(){
        return {
            // 表格数据
            tableData:[],
            // 分页
            page:1,
            rows:10,
            total:0,
            // 待编辑数据
            edited:{},
            //高级检索相关项
            fuzzySearch:0,
            isSetting: 0, //控制个性化设置弹窗是否展示
            rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
            paramJson: paramJson, //同目录下json数据 常量
            moduleList: [], //模板列表
            templateValue: "", //当前选择的模板id
            sortBy: "", //排序字段
            order: "", //desc降序 asc升序
            headObj: {}, //表头显示对象 {category:true}
            defaultOpen: true, //默认开启高级查询
            userId: "",
            allModules: {}, //所有模板
            resultCondition: [],
            retrieveCondition: [],
            collectionInfo:[],
            // 排序
            orderProperty:'',
            orderType:'',
            sc:'',
          loading:false,
        }
    },
    components:{
        notificationEdit,
        Retrieve,
        WorkMould,
        memberCheck
    },
    mounted(){
        this.getTableList();
        this.QJGetMounted()
    },
    watch:{
        id(n,old){
            if(n === null){
                this.getTableList();
            }
        }
    },
    computed:{
        id(){
            return this.$store.state.Notification.infoId
        },
        status(){
            return this.$store.state.Notification.viewStatus
        }
    },
    methods:{
        getTableList(){
          this.loading=true
            ajaxRequest('get','back/notice/retrieve',{
                isDelete:0,
                page:this.page,
                rows:this.rows,
                total:0,
                orderProperty:this.orderProperty,
                orderType:this.orderType,
                sc:this.sc,
                },res=>{
                if(res.code === 200){
                    this.tableData = res.rows;
                    this.total = res.total;
                }else{
                    console.log(res)
                }
                this.loading=false
            })
        },
        handlePageSizeChange(size){
            this.page = 1;
            this.rows = size;
            this.getTableList();
        },
        handleCurrentPageChange(currentPage){
            this.page = currentPage;
            this.getTableList();
        },
        // 页面内容格式化
        typeFormat(row, column, cellValue, index){
            return cellValue == 0?'全体':'指定'
        },
        auditFormat(row, column, cellValue, index){
            return cellValue == 0 ?'未审核':cellValue == 1 ?"已通过" :"已退回"
        },
        isShowFormat(row, column, cellValue, index){
            return cellValue == 0?'未发布':'已发布'
        },
        dateFormat(row, column, cellValue, index){
            if(cellValue == null){
                return ;
            }
            return new Date(cellValue).format('YYYY-MM-DD')
        },
        // 操作对应的方法
        detail(data){
            this.$store.commit('SET_ID',data.id)
        },
        editStatus(data,status){
            let info = {id:data.id},
                message = '';
            switch(status){
                case 0:
                    info.isDelete = 1;
                    message="删除成功!";
                    break;
                case 1:
                    info.isTop = 1;
                    message = "置顶成功!";
                    break;
                case 2:
                    info.isShow = 1;
                    message = "发布成功!";
                    info.showPerson = window.localStorage.getItem('userId')
                    let time = new Date()
                    info.showTime = new Date(time).format('YYYY-MM-DD hh:mm:ss')
                    break;
                case 3:
                    info.isTop = 0;
                    message= '取消置顶成功!' ;
                    break ;
            }
            ajaxRequest('put','back/notice/updateNoticeStatus',info,res=>{
                if(res.code ==200){
                    this.$message.success(message)
                    this.getTableList();
                }
            })
        },
        //已查阅人员与未查阅人员查看
        view(data,flag){
            this.$store.commit('SET_NOTICEDID',data.id)
            if(flag){
                this.$store.commit('SET_VIEWSTAUTS','viewed')
            }else{
                this.$store.commit('SET_VIEWSTAUTS','unviewed')
            }
        }
    }
}
</script>
<style scoped>
.el-icon-setting {
  background: none !important;
  border: none !important;
  color: #3094e0 !important;
}
.el-icon-setting:hover {
  color: #3094e0 !important;
}
.button{
  padding:0;
  font-size:18px;
}
</style>


