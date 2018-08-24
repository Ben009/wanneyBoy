<template>
  <div class="message-box">
    <mind-dialog
      title="消息列表"
      :visible="true"
      width="900px"
      @close="handleCancel">
      <el-tabs v-model="activeName" @tab-click="handleClick">

        <el-tab-pane  v-for="item in tabPaneList" :label='item.label' :name="item.name">
          <div>
            <div style="margin-bottom:10px;">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(multipleSelection)">批量删除
              </el-button>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增</el-button>
            </div>
            <el-table :data="item.name=='unread'?unreadData:readData" :max-height="QJTableMaxHeight"
              border
              style="width: 100%"
              height="450"
              @sort-change="handleSort"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column
                prop="addTime"
                label="创建时间"
                min-width="105"
                :formatter="function(row, column, cellValue, index){return new Date(row.addTime).format('YYYY-MM-DD')}"
              >
              </el-table-column>
              <el-table-column
                prop="updateTime"
                label="更新时间"
                min-width="105"
                :formatter="function(row, column, cellValue, index){return new Date(row.addTime).format('YYYY-MM-DD')}"
              >
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
              >
                <template slot-scope="scope">
                  <el-button :type="scope.row.status==1?'success':'danger'" round size="mini">{{scope.row.status==1?'已读':'未读'}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="title"
                label="消息标题"
                
              >
              </el-table-column>
              <el-table-column
                prop="content"
                label="消息内容"
              >
              </el-table-column>
              <el-table-column
                prop="category"
                label="消息类型"
              >
              </el-table-column>
              <el-table-column
                prop="bussiness"
                label="所属业务"
              >
              </el-table-column>
              <el-table-column
                prop="sourceUserId"
                label="消息发起者用户Id"
                min-width="150"
              >
              </el-table-column>
              <el-table-column
                prop="TargetUserId"
                label="目标用户Id"
                min-width="100"
              >
              </el-table-column>
              <el-table-column
                prop="channel"
                label="消息渠道"
                min-width="80"
              >
              </el-table-column>
              <el-table-column
                prop="targetAddress"
                label="目标地址（邮箱地址，手机号等）"
                min-width="150px"
              >
              </el-table-column>
              <el-table-column
                prop="memo"
                label="备注"
              >
              </el-table-column>
              <el-table-column
                prop="thirdId"
                min-width="110"
                label="第三方渠道Id"
              >
              </el-table-column>

              <el-table-column
                label="操作"
                fixed="right"
                min-width="100">
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                    class="el-icon-edit-outline" title="编辑"></i></el-button>
                  <el-button @click="handleDelete([scope.row])" type="text" style="padding:0;font-size:18px;"><i
                    class="el-icon-delete" title="删除"></i></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin-top:10px;text-align:center; float:right;">
            <el-pagination
              :current-page="page"
              :page-size="rows"
              layout="sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handlePageSizeChange"
              @current-change="handleCurrentPageChange">
            </el-pagination>
          </div>
        </el-tab-pane>

      </el-tabs>
    </mind-dialog>
    <messageForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></messageForm>

  </div>

</template>

<script>
  import {ajaxRequest} from "../util/base";
  import messageForm from './MessageForm'

  export default {
        name: "message-info-list",
        props:{
          callback:{type:Function,required:true},
        },
        components:{messageForm},
        data(){
          return{
            page:1,
            rows:10,
            total:null,

            tabPaneList:[{name:'unread',label:'未读'},{name:'read',label:'已读'}],
            activeName:'unread',
            tableData: [
              {
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              date: '2016-05-04',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1517 弄'
            }, {
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              date: '2016-05-03',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1516 弄'
            },
              {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              }, ],
            tableData1:[
              {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              },{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              }
            ],


            multipleSelection:[],
            orderProperty:null,
            unreadData:[],
            readData:[],
            edit:null,
          }
        },
        methods:{
          handleCancel(){
            this.callback();
          },
          handleClick(){

          },
          getTableList(){
            ajaxRequest('get','back/message/list',{},(res)=>{
              if(res.code==200){
                let arr = res.rows;
                this.unreadData=[].concat(arr).filter(v=>{return v.status==0});  //未读消息
                this.readData=[].concat(arr).filter(v=>{return v.status==1});  //已读消息

              }
            })
          },
          handleSelectionChange(val) {
            this.multipleSelection = val;
          },
          handleSort: function(column, prop, order){
            /*用ui组件提供的排序接口,维护实例data数据*/
            this.orderProperty = column['prop'];
            if(column['order'] == 'descending'){
              this.orderType='desc';
            }else{
              this.orderType = 'asc';
            }
            this.getTableList();
          },

          handlePageSizeChange(size){
            this.page=1;//Math.floor(this.page * this.rows / size);
            this.rows=size;
            this.getTableList();
          },
          handleCurrentPageChange(currentPage){
            /*分页组件每页显示条数change 重新计算页码，控制信息在当前表格中*/
            this.page=currentPage;
            this.getTableList();
          },
          handleEdit(rowInfo){
            this.edit = rowInfo || {}
          },
          handleDelete(data){
            /*删除表格数据*/
            if(data.length>0){
              let ids = data.map(function (v) {
                return v.id
              }).join(",");
              ajaxRequest('post','back/message/list/'+ids,{_method:'delete'},function(res){
                if(res.code===200){
                  this.$message.success('删除成功');
                  this.getTableList();
                }
                else{
                  this.$message.error('删除失败');
                }
              }.bind(this))
            }else{
              this.$message({
                message: '请先选择要删除的数据',
                type: 'warning'
              })
            }
          },
          handleEditCallback(rowInfo){
            //回调刷新列表页数据
            if(rowInfo){
              this.getTableList();
            }
            this.edit = null
          },
        },
        mounted(){
          this.getTableList();
        }
    }
</script>

<style scoped>
  .message-box{

  }
  .message-box .read-box{
    height:500px;
    overflow: auto;
  }

</style>
