<template>

  <div style="position:relative;">

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="部门管理" name="depart" >
        <div>
          <div class="el-tab_head">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增部门</el-button>
            <!--<el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(multipleSelection)">批量删除</el-button>-->
          </div>
          <div style="position:absolute;top:0;right:25px;marginTop:10px;">
            <label class="label">部门名称:</label>
            <!-- <el-select v-model="departNameSearch"   placeholder="请输入"  id="postSearchSelect" >
              <el-option
                v-for="item in departNameData"
                :label="item.departName"
                :value="item.departName">
              </el-option>
            </el-select> -->
            <el-input placeholder="请输入部门名称" v-focusSelect v-model="departNameSearch" style="width:200px;position: relative;top: 2px;"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch(false)">查询</el-button>
            <el-button type="warning" icon="el-icon-warning" @click="handleReset(false)">清空</el-button>

          </div>
          <div>
            <el-table :data="tableData"  border stripe  style="width: 100%"   @selection-change="handleSelectionChange"  @sort-change="handleSort"
                    :max-height="QJTableMaxHeight"  :default-sort = "{prop: 'orderNum', order: 'ascending'}" >

              <el-table-column type="index"  label="序号" align="center" width="50" >
              </el-table-column>

              <el-table-column  prop="departName"  label="部门名称"  align="center" show-overflow-tooltip>
              </el-table-column>


              <el-table-column  prop="departCode"  label="部门代码"  align="center" show-overflow-tooltip>
              </el-table-column>

              <el-table-column  prop="departShortName"  label="部门简称"  align="center" show-overflow-tooltip>
              </el-table-column>

              <!-- <el-table-column  prop="departDesc"  label="描述" align="center" show-overflow-tooltip>
              </el-table-column> -->
              <!--<el-table-column  prop="departType"  label="部门类型" align="center" show-overflow-tooltip :formatter="formatterDepartType">-->
              <!--</el-table-column>-->

              <el-table-column  prop="orderNum"  label="排序"  align="center" show-overflow-tooltip>
              </el-table-column>

              <el-table-column label="操作"  fixed="right" width="80px" >
                <template slot-scope="scope">
                  <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                    class="el-icon-edit-outline" title="编辑"></i></el-button>
                  <el-button v-mindPopover="{message:'确定要删除该部门?',success:handleDelete.bind(this,[scope.row]),placement:'left'}" type="text" style="padding:0;font-size:18px;"><i
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
          <DepartEdit v-if="!!edit" :departInfo="edit" :callback="handleEditCallback" ></DepartEdit>

        </div>
      </el-tab-pane>

      <el-tab-pane label="岗位管理" name="post">
        <div >
          <div class="el-tab_head">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handlePostEdit(null)">新增岗位</el-button>
            <!-- multipleSelection的操作方法多余可以视情况而定直接删除 -->
            <!--<el-button size="small" type="danger" icon="el-icon-delete" @click="handlePostDelete(multipleSelection)">批量删除</el-button>-->
          </div>

          <div style="position:absolute;top:0;right:25px;marginTop:10px;" >
            <label for="postSearchSelect" class="label">部门名称:</label>
            <el-select v-model="postNameSearch" id="postSearchSelect"  style="width:200px;position: relative;top: 2px;" >
              <el-option v-for="key in departNameData" :value="key.departId" :label="key.departName"></el-option>

            </el-select>
            <label for="postKeySearch" class="label">岗位名称:</label>
            <el-input placeholder="请输入岗位名称" v-focusSelect class="custom-input" v-model="searchKey" style="width:200px;position: relative;top: 2px;"  id="postKeySearch">
              <!-- <el-button type="primary" slot="append" icon="el-icon-search"></el-button> -->
            </el-input>
            <!-- 进行搜索重置操作 -->
            <el-button type="primary" icon="el-icon-search" @click="handleSearch(true)">查询</el-button>
            <el-button type="warning" icon="el-icon-warning" @click="handleReset(true)">清空</el-button>
          </div>

          <div>
            <el-table :data="postTableData"  ref="postRef" border stripe style="width: 100%" @selection-change="handleSelectionChange" @sort-change="handlePostSort"
                  :max-height="QJTableMaxHeight"    :default-sort = "{prop: 'postName', order: 'asc'}" >

              <el-table-column  type="index"  label="序号" width="50" align="center">
              </el-table-column>

              <el-table-column  prop="departId"   label="部门名称" align="center"  :formatter="formatterDepartName"  show-overflow-tooltip>
              </el-table-column>

              <el-table-column  prop="postName"  label="岗位名称" align="center"  show-overflow-tooltip>
              </el-table-column>


              <el-table-column  prop="postCode"  label="岗位代码" align="center" show-overflow-tooltip>
              </el-table-column>

              <!--<el-table-column  prop="postShortName"  label="岗位简称" align="center" show-overflow-tooltip>-->
              <!--</el-table-column>-->

              <el-table-column  prop="postCommission"  label="岗位提成(%)" align="center">
              </el-table-column>

              <el-table-column  prop="testTerm"  label="检测期限(工作日)" align="center">
              </el-table-column>


              <el-table-column label="操作" fixed="right" width="80px">
                <template slot-scope="scope">
                  <el-button  type="text" style="padding:0;font-size:18px;"><i
                    class="el-icon-edit-outline" @click="handlePostEdit(scope.row)" title="编辑"></i></el-button>
                  <el-button type="text" style="padding:0;font-size:18px;">
                    <i class="el-icon-delete" title="删除" v-mindPopover="{message:'确定要删除该岗位?',success:handlePostDelete.bind(this,[scope.row]),placement:'left'}"></i></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin-top:10px;text-align:center; float:right;">
            <mind-pagination
              :current-page="postCurrentTablePage"
              :page-size="postTableRows"
              :total="postTableTotal"
              @size-change="handlePostPageSizeChange"
              @current-change="handlePostCurrentPageChange">
            </mind-pagination>
          </div>
          <PostEdit  v-if="!!editPost" :postInfo="editPost" :departNameData="departNameData" :callback="handlePostEditCallback"></PostEdit>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import Vuex from "vuex";
import { ajaxRequest, formatArrayToTree } from "../../util/base";
import DepartEdit from "./DepartEdit";
import PostEdit from "./PostEdit";

/* import {
  Button,
  Table,
  TableColumn,
} from "element--ui";
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn); */


export default {
  name: "depart-table",
  components: { DepartEdit, PostEdit },
  data() {
    return {
      page: 1,
      rows: 10,
      total: 0,
      searchKey: "",
      tableData: [],
      postTableData: [],
      multipleSelection: [],
      departNameObj: {},
      departNameData: [],
      departNameSearch:'',
      promiseStatus:null,
      edit: null,
      editPost: null,
      activeName: "depart",
      postCurrentTablePage: 1,
      postTableRows: 10,
      postTableTotal: 0,
      postNameSearch: "",
      postNameSearchOption: "",
      postNameSearchResult: [],
      orderType: "",
      orderColName:null,
      orderSortable:null,
      orderSort: {} //记录需要多重排序的数据    (但是感觉用不到这个变量，排序应该是根据一个字段来进行排序)
    };
  },
  created() {
    this.ajaxDepartNameObj();
  },
  mounted() {
    // this.getDepartList();
    this.getPostList();
  },

  methods: {
    handleSort(column, prop, order) {
      switch(column['prop']){
        case 'departName':
          this.orderProperty = 'd.depart_name'
          break;
        case 'departCode':
          this.orderProperty = 'd.depart_code'
          break;
        case 'departShortName':
          this.orderProperty = 'd.depart_short_name'
          break;
        case 'orderNum':
          this.orderProperty = 'd.order_num'
          break;
        default: this.orderProperty = ''
      }
      // this.orderProperty = column["prop"] == "orderNum" ? "d.order_num" : "";
      if (column["order"] == "descending") {
        this.orderType = "desc";
      } else {
        this.orderType = "asc";
      }
      // // 测试多个排序的条件
      this.getDepartList();
    },
    handlePostSort(column, prop, order) {
      switch(column['prop']){
        case 'departId':
          this.orderColName = 'p.DEPART_ID'
          break;
        case 'postName':
          this.orderColName = 'p.POST_NAME'
          break;
        case 'postCode':
          this.orderColName = 'p.POST_CODE'
          break;
        case 'postCommission':
          this.orderColName = 'p.POST_COMMISSION'
          break;
        case 'testTerm':
          this.orderColName = 'p.TEST_TERM'
          break;
        default: this.orderColName = ''
      }
      if (column["order"] == "descending") {
        this.orderSortable = "desc";
      } else {
        this.orderSortable = "asc";
      }
      // // 测试多个排序的条件
      this.getPostList();
    },
    // tab页面切换
    handleClick(tab, event) {
      // if (tab.name == "post") {
      //   this.ajaxDepartNameObj();
      // }
    },
    formatterDepartType: function(row, column) {
      var departTypeObj = {
        "1": "检测实验室",
        "2": "业务管理部",
        "3": "技术质量部",
        "4": "业务拓展部",
        "5": "驾驶室",
        "9": "所领导"
      };
      return departTypeObj[row.departType];
    },
    formatterDepartName: function(row, column) {
      return this.departNameObj[row.departId];
    },
    //获取部门表格数据
    getDepartList: function() {
      console.log('departlist')
      // if (!!this.orderType || this.departNameSearch) {
        // let nameId = "";
        // for (let item in this.departNameObj) {
        //   if (this.departNameObj[item] == this.departNameSearch) {
        //     nameId = item;
        //   }
        // }
        ajaxRequest(
          "get",
          "back/depart/retrieve",
          {
            departName:this.departNameSearch,
            fuzzySearch:1,
            isDelete: 0,
            page: this.page,
            rows: this.rows,
            total:0,
            // 进行升序降序排列的标志
            orderProperty: this.orderProperty,
            orderType: this.orderType
          },
          function(res) {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
              console.log(this.tableData,'tableData')
            }
          }.bind(this)
        );
      // } else {
      //   ajaxRequest(
      //     "get",
      //     "back/depart/list",
      //     {
      //       page: this.page,
      //       rows: this.rows,
      //       isDelete: 0,
      //       total: 0
      //     },
      //     function(res) {
      //       if (res.code === 200) {
      //         this.tableData = res.rows;
      //         this.total = res.total;
      //       }
      //     }.bind(this)
      //   );
      // }
    },
    // 对需要选择多组数据进行操作做准备
    handleSelectionChange(val) {
      // this.multipleSelection = val;
    },

    handlePageSizeChange(size) {
      this.page = 1;
      this.rows = size;
      this.getDepartList();
    },
    // 岗位管理的页面数据数目变化
    handlePostPageSizeChange(size) {
      this.postCurrentTablePage = 1;
      this.postTableRows = size;
      this.getPostList();
    },
    //输入页码进行跳转
    handleCurrentPageChange(currentPage) {
      this.page = currentPage;
      this.getDepartList();
    },
    // 岗位管理的页码跳转
    handlePostCurrentPageChange(currentPage) {
      this.postCurrentTablePage = currentPage;
      this.getPostList();
    },
    handleEdit(departInfo) {
      this.edit = departInfo || {};
    },
    // 新增的去重方法
    findDistinct(info){
      let count = 0 ;
      let data = {rows:[]}
      this.promiseStatus =  new Promise((resolve,reject)=>{
        let search = [{departName:info.departName,fuzzySearch:0,isDelete:0},
        {departShortName:info.departShortName,fuzzySearch:0,isDelete:0},
        {departCode:info.departCode,fuzzySearch:0,isDelete:0}]
        for(let i =0 ; i < search.length ; i ++){
          ajaxRequest('get','back/depart/retrieve',search[i],res=>{
            if(res.code === 200){
              data.rows = [...res.rows,...data.rows]
              count ++;
              if(count==3){
                resolve(data);
              }
            }else{
              reject(new Error('请求出错!'))
            }
          })
        }
      })
    },
    handleEditCallback(departInfo) {
      let _this = this;
      if (departInfo) {
        // 新增查重的功能
        _this.findDistinct(departInfo);
          _this.promiseStatus.then(res => {
            if (departInfo.id) {
              let judgeName = true;
              let errMessage = '';
              if (res.rows.length > 0) {
                res.rows.forEach(item => {
                  if (item.departName == departInfo.departName) {
                    if(item.id != departInfo.id){
                      judgeName = false;
                      errMessage = '部门名称有重复!';
                    }
                  }
                  if(item.departCode == departInfo.departCode){
                    if(item.id!= departInfo.id){
                      judgeName = false;
                      errMessage = "部门代码有重复!";
                    }
                  }
                  if(item.departShortName == departInfo.departShortName){
                    if(item.id != departInfo.id){
                      judgeName = false;
                      errMessage = "部门简称有重复!"
                    }
                  }
                });
              }
              if (judgeName) {
                ajaxRequest(
                  "put",
                  "back/depart/",
                  {
                    id: departInfo.id,
                    departName: departInfo.departName,
                    departCode: departInfo.departCode,
                    departShortName: departInfo.departShortName,
                    departDesc: departInfo.departDesc,
                    telephone: departInfo.telephone,
                    fax: departInfo.fax,
                    address: departInfo.address,
                    email: departInfo.email,
                    orderNum: departInfo.orderNum,
                    departType: departInfo.departType
                  },
                  function(res) {
                    if (res.code === 200) {
                      _this.$message.success("编辑成功");
                      _this.edit = null;
                      _this.getDepartList();
                      _this.ajaxDepartNameObj();
                    } else {
                      _this.$message.error("编辑失败");
                    }
                  }.bind(this)
                );
              } else {
                this.$message.error("提交失败,"+errMessage+"");
              }
            } else {
              let judgeName = true;
              let errMessage = '';
              if (res.rows.length > 0) {
                res.rows.forEach(item => {
                  if (item.departName == departInfo.departName) {
                      judgeName = false;
                      errMessage = '部门名称重复!';
                  }
                  if(item.departCode == departInfo.departCode&&item.departCode!=null){
                    judgeName = false;
                    errMessage = "部门代码重复!";
                  }
                  if(item.departShortName == departInfo.departShortName&&item.departShortName!=null){
                    judgeName = false;
                    errMessage = "部门简称重复!"
                  }
                });
              }
              if (judgeName) {
                ajaxRequest(
                  "post",
                  "back/depart/",
                  departInfo,
                  function(res) {
                    if (res.code === 200) {
                      _this.$message.success("新增成功");
                      _this.edit = null;
                      _this.getDepartList();
                      _this.ajaxDepartNameObj();
                    } else {
                      _this.$message.error("新增失败");
                    }
                  }.bind(this)
                );
              } else {
                this.$message.error("新增失败，"+errMessage+"");
              }
            }
          })
          .catch(data => {
            this.$message.error("请求出错！");
          });
      } else {
        this.edit = null;
      }
    },
    handleDelete: function(data) {
      new Promise((resolve,reject)=>{
        ajaxRequest('get','back/depart/judgeIsCanDelete?departId='+data[0].id,{},res=>{
          if(res.code===200){
            resolve(res)
          }else{
            reject(res)
          }
        })
      }).then((res)=>{
        if(res.msg==1){
          this.$message.error('此部门下尚有岗位或人员，不可删除！')
        }else{
          let ids = data
            .map(function(v) {
              return v.id;
            })
            .join(",");
          ajaxRequest(
            "put",
            "back/depart/list/" + ids,
            { _method: "put", isDelete: 1 },
            function(res) {
              if (res.code === 200) {
                this.$message.success("删除成功");
                this.getDepartList();
              } else {
                this.$message.error("删除失败");
              }
              this.getPostList();
              this.ajaxDepartNameObj();
            }.bind(this)
          );
        }
      })
    },
    //获取岗位表格数据
    getPostList: function() {
      // 如果有搜索条件
      // if (this.searchKey || this.postNameSearch) {
        // let nameId = "";
        // if(!!this.postNameSearch){
        //   for (let item in this.departNameObj) {
        //     if (this.departNameObj[item] == this.postNameSearch) {
        //       nameId = item;
        //     }
        //   }
        // }
        let departName=null;
        if(''!=this.postNameSearch){
          departName= this.postNameSearch;
        }

        ajaxRequest(
          "get",
          "back/post/retrieve",
          {
            departId:departName,
            postName: this.searchKey,
            isDelete: 0,
            // fuzzySearch: 1,
            page: this.postCurrentTablePage,
            rows: this.postTableRows,
            total: 0,
            // sc: this.sc
            orderProperty: this.orderColName,
            orderType: this.orderSortable,
          },
          res => {
            if (res.code ==200) {
              this.postTableData = res.rows;
              this.postTableTotal = res.total;
            }
          }
        );
        // 没有搜索条件
      // } else {
      //   ajaxRequest(
      //     "get",
      //     "back/post/list",
      //     {
      //       isDelete: 0,
      //       page: this.postCurrentTablePage,
      //       rows: this.postTableRows,
      //       total: 0
      //     },
      //     res => {
      //       if (res.code === 200) {
      //         this.postTableData = res.rows;
      //         this.postTableTotal = res.total;
      //       }
      //     }
      //   );
      // }
    },
    ajaxDepartNameObj() {
      console.log('nameobj')
      ajaxRequest(
          "get",
          "back/depart/retrieve",
        {
          isDelete: 0,
          orderProperty: 'd.order_num',
          orderType: 'asc'
        },
        function(data) {
          if (data.code === 200) {
            this.departNameData = [];
            this.departNameObj = {};
            for (var i = 0; i < data.rows.length; i++) {
              this.departNameObj[data.rows[i].id] = data.rows[i].departName;
              this.departNameData.push({
                departId: data.rows[i].id,
                departName: data.rows[i].departName
              });
            }
          }
        }.bind(this)
      );
    },
    handlePostEdit: function(postInfo) {
      this.editPost = postInfo || {};
    },
    handlePostEditCallback(postInfo) {
      let _this = this;
      if (postInfo) {
        if (postInfo.id) {
          ajaxRequest(
            "put",
            "back/post/",
            {
              id: postInfo.id,
              departId: postInfo.departId,
              postName: postInfo.postName,
              postCode: postInfo.postCode,
              postShortName: postInfo.postShortName,
              postCommission: postInfo.postCommission,
              testTerm: postInfo.testTerm
            },
            function(res) {
              if (res.code === 200) {
                _this.$message.success("编辑成功");
                _this.editPost = null;
                _this.getPostList();
              } else {
                _this.$message.error("编辑失败");
              }
            }.bind(this)
          );
        } else {
          ajaxRequest(
            "post",
            "back/post/",
            {
              departId: postInfo.departId,
              postName: postInfo.postName,
              postCode: postInfo.postCode,
              postShortName: postInfo.postShortName,
              postCommission: postInfo.postCommission,
              testTerm: postInfo.testTerm
            },
            function(res) {
              if (res.code === 200) {
                _this.$message.success("新增成功");
                _this.editPost = null;
                _this.getPostList();
              } else {
                _this.$message.error("新增失败");
              }
            }.bind(this)
          );
        }
      } else {
        this.editPost = null;
      }
    },
    handlePostDelete(data) {
        new Promise((resolve,reject)=>{
          ajaxRequest('get','back/post/judgePost?postId='+data[0].id,{},res=>{
            if(res.code === 200){
              resolve(res)
            }else{
              reject(res)
            }
          })
        }).then((res)=>{
          if(res.msg ==1){
            this.$message.error('此岗位下尚有人员，不可删除！')
          }else{
            let ids = data
              .map(function(v) {
                return v.id;
              })
              .join(",");
            ajaxRequest(
              "put",
              "back/post/list/" + ids,
              { _method: "put", isDelete: 1 },
              function(res) {
                if (res.code === 200) {
                  this.$message.success("删除成功");
                  this.getPostList();
                } else {
                  this.$message.error("删除失败");
                }
              }.bind(this)
            );
          }
        })

    },
    handleSearch(option) {
      this.page = 1;
      this.postCurrentTablePage = 1;
      if(option){
        this.getPostList();
      }else{
        this.getDepartList();
      }
    },
    handleReset(option) {
      if(option){
        this.searchKey = this.postNameSearch = "";
        this.getPostList();
      }else{
        this.departNameSearch = '';
        this.getDepartList();
      }
    }
  }
};
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
.label {
  color: #606266;
  font-weight: normalnpm run;
  font-size: 0.9rem;
}
.but-cz{background:#fbb142!important; border:1px solid #fbb142!important; color: #fff!important;}
.but-cz:hover{background:#e6ad57!important;border:1px solid #e6ad57!important; color:#fff;}
</style>
