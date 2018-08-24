<template>

  <div style="position:relative;">

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="发证单位" name="unit">
        <div>
          <div class="el-tab_head">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增发证单位</el-button>
            <!--<el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(multipleSelection)">批量删除</el-button>-->
          </div>
          <div>
            <el-table :data="tableData" :max-height="QJTableMaxHeight" border stripe  style="width: 100%"   @selection-change="handleSelectionChange"     >

              <el-table-column type="index"  label="序号" align="center" width="80">
              </el-table-column>

              <el-table-column  prop="unit"  label="发证单位" align="center" show-overflow-tooltip>
              </el-table-column>

              <el-table-column  prop="remark"  label="备注" align="center" show-overflow-tooltip>
              </el-table-column>

              <el-table-column  prop="orderNum"  label="排序" align="center" show-overflow-tooltip>
              </el-table-column>

              <el-table-column label="操作" min-width="200" align="center">

                <template slot-scope="scope">

                  <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                    class="el-icon-edit-outline" title="编辑"></i></el-button>

                  <el-button v-mindPopover="{message:'确定要删除该发证单位?',success:handleDelete.bind(this,[scope.row])}"  type="text" style="padding:0;font-size:18px;"><i
                    class="el-icon-delete" title="删除"></i></el-button>

                  <!--<el-button  type="text" style="padding:0;font-size:18px;"><i-->
                  <!--class="el-icon-circle-plus" title="新建文件夹"></i></el-button>-->
                  <!--<el-button  type="text" style="padding:0;font-size:18px;"><i-->
                  <!--class="el-icon-setting" title="删除文件夹"></i></el-button>-->

                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin-top:10px;text-align:center; float:right;">
             <mind-pagination
              :current-page="page"
              :page-size="rows"
              :total="total"
              @size-change="handlePageSizeChange"
              @current-change="handleCurrentPageChange">
            </mind-pagination>
          </div>
          <DepartEdit v-if="!!edit" :departInfo="edit" :callback="handleEditCallback"></DepartEdit>
        </div>
      </el-tab-pane>

      <el-tab-pane label="证件类别" name="certificationType" @click="getPostList">
      <div >
        <div class="el-tab_head">
          <el-button size="small" type="primary" icon="el-icon-plus" @click="handlePostEdit(null)">新增证书类别</el-button>
          <!--<el-button size="small" type="danger" icon="el-icon-delete" @click="handlePostDelete(multipleSelection)">批量删除</el-button>-->
        </div>

        <div>
          <el-table :data="postTableData" :max-height="QJTableMaxHeight" border  style="width: 100%" @selection-change="handleSelectionChange" >

            <el-table-column  type="index"  label="序号" width="80" align="center">
            </el-table-column>

            <el-table-column  prop="certificationType"  label="证件类别" align="center"  show-overflow-tooltip>
            </el-table-column>

            <el-table-column  prop="remark"  label="备注" align="center"  show-overflow-tooltip>
            </el-table-column>

            <el-table-column  prop="orderNum"  label="排序" align="center" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="操作" align="center" min-width="200">
              <template slot-scope="scope">
                <el-button  type="text" style="padding:0;font-size:18px;"><i
                  class="el-icon-edit-outline" @click="handlePostEdit(scope.row)" title="编辑"></i></el-button>

                <el-button v-mindPopover="{message:'确定要删除该证件类别?',success:handlePostDelete.bind(this,[scope.row])}" type="text" style="padding:0;font-size:18px;"><i
                  class="el-icon-delete" title="删除" ></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right;">
           <mind-pagination
            :current-page="page"
            :page-size="rows"
            :total="total"
            @size-change="handleTypePageSizeChange"
            @current-change="handleTypeCurrentPageChange">
          </mind-pagination>
        </div>

        <PostEdit  v-if="!!editPost" :postInfo="editPost" :departNameData="departNameData" :callback="handlePostEditCallback"></PostEdit>
      </div>
    </el-tab-pane>

      <el-tab-pane label="证件名称" name="certificationName" @click="getNameList">
        <div >
          <div class="el-tab_head">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleNameEdit(null)">新增证书名称</el-button>
            <!--<el-button size="small" type="danger" icon="el-icon-delete" @click="handlePostDelete(multipleSelection)">批量删除</el-button>-->
          </div>

          <div>
            <el-table :data="nameTableData" :max-height="QJTableMaxHeight"  border  style="width: 100%" @selection-change="handleSelectionChange" >

              <el-table-column  type="index"  label="序号" width="80" align="center">
              </el-table-column>

              <el-table-column  prop="certificationName"  label="证书名称" align="center"  show-overflow-tooltip>
              </el-table-column>

              <el-table-column  prop="remark"  label="备注" align="center"  show-overflow-tooltip>
              </el-table-column>

              <el-table-column  prop="orderNum"  label="排序" align="center" show-overflow-tooltip>
              </el-table-column>

              <el-table-column label="操作" align="center" min-width="200">
                <template slot-scope="scope">
                  <el-button  type="text" style="padding:0;font-size:18px;"><i
                    class="el-icon-edit-outline" @click="handleNameEdit(scope.row)" title="编辑"></i></el-button>

                  <el-button v-mindPopover="{message:'确定要删除该证件名称?',success:handleNameDelete.bind(this,[scope.row])}"  type="text" style="padding:0;font-size:18px;"><i
                    class="el-icon-delete" title="删除" ></i></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div style="margin-top:10px;text-align:center;float:right;">
             <mind-pagination
              :current-page="page"
              :page-size="rows"
              :total="total"
              @size-change="handleNamePageSizeChange"
              @current-change="handleNameCurrentPageChange">
            </mind-pagination>
          </div>

          <NameEdit  v-if="!!editName" :nameInfo="editName" :callback="handleNameEditCallback"></NameEdit>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import { ajaxRequest, formatArrayToTree } from '../../util/base'
  import DepartEdit from './CertificationUnitForm'
  import PostEdit from './CertificationType'
  import  NameEdit from './CertificationName'

  export default {
    name: 'depart-table',
    data () {
      return {
        page: 1,
//        page2: 1,
//        page3: 1,
        rows1: 10,
        rows2: 10,
        rows3: 10,
        total: 0,
//        total2: 0,
//        total3: 0,
        searchKey: '',
        tableData: [],
        postTableData:[],
        nameTableData:[],
        multipleSelection1: [],
        multipleSelection2: [],
        multipleSelection3: [],
        departNameObj:{},
        departNameData:[],
        edit: null,
        editPost:null,
        editName:null,
        activeName:'unit'
      }
    },
    components: {DepartEdit,PostEdit,NameEdit},
    methods: {
      // tab页面切换
      handleClick(tab, event){
        if(tab.name=='certificationType'){
          this.getPostList('new');
        }
        if(tab.name=='certificationName'){
          this.getNameList('new');
        }
        if(tab.name=='unit'){
            this.getDepartList('new');
        }
      },

//      formatterDepartName:function(row,column){
//        return this.departNameObj[row.departId];
//      },
      //获取单位表格数据
      getDepartList:function(flag){
        if(flag=='new'){
          this.page=1;
        }
        ajaxRequest('get', 'back/certificationUnit/list',{

          page:this.page,
          rows:this.rows1,
          isDelete:0,
          total:0
        },function(res){
          if(res.code===200){
            this.tableData=res.rows;
            this.total=res.total;
            this.multipleSelection1=[];
          }
        }.bind(this))
      },
      //获取证书类别表格数据
      getPostList:function(flag){
        if(flag=='new'){
          this.page=1;
        }
        ajaxRequest('get', 'back/certificationType/list',{
          page:this.page,
          rows:this.rows2,
          isDelete:0,
          total:0
        },function(res){
          if(res.code===200){
            this.postTableData=res.rows;
            this.total=res.total;
            this.multipleSelection2=[];
          }
        }.bind(this))
      },
      //获取证书名称 列表数据
      getNameList:function(flag){
        if(flag=='new'){
          this.page=1;
        }
        ajaxRequest('get', 'back/certificationName/list',{
          page:this.page,
          rows:this.rows3,
          isDelete:0,
          total:0
        },function(res){
          if(res.code===200){
            this.nameTableData=res.rows;
            this.total=res.total;
            this.multipleSelection3=[];
          }
        }.bind(this))
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows1=size;
        this.getDepartList();
      },
      handleTypePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows2=size;
        this.getPostList();
      },
      handleNamePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows3=size;
        this.getNameList();
      },

      //输入页码进行跳转
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getDepartList();
      },
      handleTypeCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getPostList();
      },
      handleNameCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getNameList();
      },
      handleEdit (departInfo) {
        this.edit = departInfo || {}
      },
      handleEditCallback (departInfo) {
        let _this = this
        if (departInfo) {
          if (departInfo.id) {
            ajaxRequest('put', 'back/certificationUnit/', {
              id: departInfo.id,
              unit: departInfo.unit,
              remark: departInfo.remark,
              orderNum: departInfo.orderNum,
            }, function (res) {
              if (res.code === 200) {
                _this.$message.success('编辑成功')
                _this.edit = null
                _this.getDepartList();
              }
              else {
                _this.$message.error('编辑失败')
              }
            }.bind(this))
          }
          else {
            ajaxRequest('post', 'back/certificationUnit/', {
              unit: departInfo.unit,
              remark: departInfo.remark,
              orderNum: departInfo.orderNum,
            }, function (res) {
              if (res.code === 200) {
                _this.$message.success('新增成功')
                _this.edit = null
                _this.getDepartList();
              }
              else {
                _this.$message.error('新增失败')
              }
            }.bind(this))
          }
        }
        else {
          this.edit = null
        }
      },
      handleDelete:function(data){
        if(data.length>0){
//          this.$confirm('确定要删除该单位?', '提示', {
//            confirmButtonText: '确定',
//            cancelButtonText: '取消',
//            type: 'warning',
//            center:true,
//          }).then(() => {
            let ids = data.map(function (v) {
              return v.id
            }).join(",");
            ajaxRequest('put', 'back/certificationUnit/list/'+ids,{_method:'put',isDelete:1},function(res){
              if(res.code===200){
                this.$message.success('删除成功');
                this.getDepartList();
              }
              else{
                this.$message.error('删除失败');
              }
            }.bind(this))
//          },()=>{
//
//          })
        }else{
          this.$message({
            message: '请先选择要删除的数据',
            type: 'warning'
          })
        }
      },

      ajaxDepartNameObj(){
        ajaxRequest('get','back/certificationUnit/list',{
          isDelete:0,
        },function(data){
          if(data.code===200){
            for (var i = 0; i < data.rows.length; i++) {
              this.departNameObj[data.rows[i].id] = data.rows[i].departName;
              this.departNameData.push({'departId':data.rows[i].id,'departName':data.rows
                [i].departName});
            }
          }
        }.bind(this))
      },
      handlePostEdit:function (postInfo) {
        this.editPost = postInfo || {}
      },
      handleNameEdit:function (nameInfo) {
        this.editName = nameInfo || {}
      },
      handlePostEditCallback (postInfo) {
        let _this = this
        if (postInfo) {
          if (postInfo.id) {
            ajaxRequest('put', 'back/certificationType/', {
              id: postInfo.id,
              certificationType: postInfo.certificationType,
              remark: postInfo.remark,
              orderNum: postInfo.orderNum,
            }, function (res) {
              if (res.code === 200) {
                _this.$message.success('编辑成功')
                _this.editPost = null
                _this.getPostList();
              }
              else {
                _this.$message.error('编辑失败')
              }
            }.bind(this))
          }
          else {
            ajaxRequest('post', 'back/certificationType/', {
              certificationType: postInfo.certificationType,
              remark: postInfo.remark,
              orderNum: postInfo.orderNum,
            }, function (res) {
              if (res.code === 200) {
                _this.$message.success('新增成功')
                _this.editPost = null
                _this.getPostList();
              }
              else {
                _this.$message.error('新增失败')
              }
            }.bind(this))
          }
        }
        else {
          this.editPost = null
        }
      },
      handleNameEditCallback (nameInfo) {
        let _this = this
        if (nameInfo) {
          if (nameInfo.id) {
            ajaxRequest('put', 'back/certificationName/', {
              id: nameInfo.id,
              certificationName: nameInfo.certificationName,
              remark: nameInfo.remark,
              orderNum: nameInfo.orderNum,
            }, function (res) {
              if (res.code === 200) {
                _this.$message.success('编辑成功')
                _this.editName= null
                _this.getNameList();
              }
              else {
                _this.$message.error('编辑失败')
              }
            }.bind(this))
          }
          else {
            ajaxRequest('post', 'back/certificationName/', {
              certificationName: nameInfo.certificationName,
              remark: nameInfo.remark,
              orderNum: nameInfo.orderNum,
            }, function (res) {
              if (res.code === 200) {
                _this.$message.success('新增成功')
                _this.editName = null
                _this.getNameList();
              }
              else {
                _this.$message.error('新增失败')
              }
            }.bind(this))
          }
        }
        else {
          this.editName = null
        }
      },
      handlePostDelete(data){
        if(data.length>0){
//          this.$confirm('确定删除该单位类型?', '提示', {
//            confirmButtonText: '确定',
//            cancelButtonText: '取消',
//            type: 'warning',
//            center:true,
//          }).then(() => {
            let ids = data.map(function (v) {
              return v.id
            }).join(",");
            ajaxRequest('put','back/certificationType/list/'+ids,{_method:'put',isDelete:1},function(res){
              if(res.code===200){
                this.$message.success('删除成功');
                this.getPostList();
              }
              else{
                this.$message.error('删除失败');
              }
            }.bind(this))
//          },()=>{
//
//          })
        }else{
          this.$message({
            message: '请先选择要删除的数据',
            type: 'warning'
          })
        }
      },
      handleNameDelete(data){
        if(data.length>0){
//          this.$confirm('确定删除该单位名称?', '提示', {
//            confirmButtonText: '确定',
//            cancelButtonText: '取消',
//            type: 'warning',
//            center:true,
//          }).then(() => {
            let ids = data.map(function (v) {
              return v.id
            }).join(",");
            ajaxRequest('put','back/certificationName/list/'+ids,{_method:'put',isDelete:1},function(res){
              if(res.code===200){
                this.$message.success('删除成功');
                this.getNameList();
              }
              else{
                this.$message.error('删除失败');
              }
            }.bind(this))
//          },()=>{
//
//          })
        }else{
          this.$message({
            message: '请先选择要删除的数据',
            type: 'warning'
          })
        }
      },
      handleSearch(value) {
        this.searchKey = value;
        this.page = 1;
        this.total = 0;
        this.getTableList();
      },
      getTableList() {
        if (this.searchKey || this.fuzzySearch === 1) {
          ajaxRequest('get', 'back/certificationType/retrieve', {
            postName: this.searchKey,
            isDelete:0,
            fuzzySearch: 1,
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            orderType: this.orderType,
            total: 0,
            sc: this.sc
          }, (res) => {
            if (res.code === 200) {
              this.postTableData = res.rows;
              this.total = res.total;
              this.multipleSelection = [];
            }
          })
        }
        else {
          ajaxRequest('get', 'back/certificationType/list', {
            isDelete:0,
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            orderType: this.orderType,
            total: 0
          }, function (res) {
            if (res.code === 200) {
              this.postTableData = res.rows;
              this.total = res.total;
              this.multipleSelection = [];
            }
          }.bind(this))
        }
      },

    },
    created(){
//      this.ajaxDepartNameObj();
    },
    mounted () {
      this.getDepartList();
    }
  }
</script>

<style>
  .custom-input {
    width: 200px;
    height: 32px;
  }

  .custom-input .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  .custom-input .el-input-group__append {
    padding: 0 10px;
  }
</style>
