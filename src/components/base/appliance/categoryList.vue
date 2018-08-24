<template>
  <div style="position:relative;">
    <div>
      <div class="el-tab_head" >
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增器具类别</el-button>
        <div v-show="!isSetting" style="float:right;">
          <div style="text-align:center;">
            <span class="span">器具类别代码：</span>
            <el-input
              placeholder="请输入器具类别代码"
              v-model="input1"
              size="small"
              style="width:200px"
              v-focusSelect
              clearable>
            </el-input>
            <span class="span">器具类别名称：</span>
            <el-input
              placeholder="请输入器具类别名称"
              v-model="input2"
              size="small"
              style="width:200px"
              v-focusSelect
              clearable>
            </el-input>
            <el-button size="small" type="primary" @click="handleSearch()" class="el-icon-search">查询</el-button>
            <el-button size="small" type="warning" @click="handleClear()" class="el-icon-warning">&nbsp;清空</el-button>
         </div>
      </div>
      </div>
      <div class="el-tab_head" style="margin-top:10px;">
        <el-table  :data="tableData"
          :max-height="QJTableMaxHeight"
          border
          style="width: 100%"
          @sort-change="handleSort"
          @selection-change="handleSelectionChange">
          <el-table-column
            label="序号"
            type="index"
            width="60">
          </el-table-column>
          <el-table-column
            prop="categoryCode"
            label="器具类别代码"

          >
          </el-table-column>
          <el-table-column
            prop="categoryName"
            label="器具类别名称"

          >
          </el-table-column>
          <el-table-column label="操作" fixed="right"  width="80px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-edit-outline" title="编辑"></i></el-button>
              <el-button v-mindPopover="{message:'确定删除?',success:handleDelete.bind(this,[scope.row])}" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-delete" title="删除"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align:center; margin-top:10px; float:right;">
        <mind-pagination
          first-text="首页" last-text="末页"
          prev-text=""  next-text=""
          layout=" firstp,prev, jumper,next,lastp,sizes,countpage,total"
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
      <categoryForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></categoryForm>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest, formatArrayToTree} from '../../util/base';
  import Retrieve from '../../Retrieve';
  import WorkMould from '../../mould/WorkMould';
  import TableColumnHeader from '../../Table/TableColumnHeader';
  import categoryForm from './categoryForm';


  export default {
    name: "category-list",
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      categoryForm
    },
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 'id',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,
        isSetting: 0,
        edit: null,
        input1: '',
        input2: '',
      }
    },
    methods: {
      handleSort: function (column, prop, order) {
        this.orderProperty = column['prop'];
        if (column['order'] == 'descending') {
          this.orderType = 'desc';
        } else {
          this.orderType = 'asc';
        }
        this.getTableList();
      },
      handleSearch() {
        this.searchKey = '1';
        this.getTableList();
      },
      handleClear() {
        this.input2 = '';
        this.input1 = '';
      },
      advanceSearch: function (data) {
        this.sc = JSON.stringify(data.conditions);
        this.orderProperty = data.sortBy;
        this.orderType = data.order;
        this.fuzzySearch = 1;
        this.getTableList();
      },
      personalSetting(flag) {
        this.isSetting = flag;
      },
      getTableList() {
          ajaxRequest('get', 'back/category/retrieve', {
            isDelete: 0,
            categoryCode: this.input1,
            categoryName: this.input2,
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            orderType: this.orderType,
            total: 0,
            sc: this.sc
          }, (res) => {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
              this.multipleSelection = [];
            }
          })
      },
      handleToggleTheme(color) {
        this.$store.commit('toggleTheme', color)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      handleEdit(rowInfo) {
        this.edit = rowInfo || {}
      },

      handleDelete(data) {
        if (data.length > 0) {
          let ids = data.map(function (v) {
            return v.id
          }).join(",");
          ajaxRequest('get', 'back/category/isBindAppliance', {id: ids}, function (res) {
            if (res.code === 200) {
              if(res.msg===""){
                ajaxRequest('put', 'back/category/', {id: ids, isDelete: 1}, function (res) {
                  if (res.code === 200) {
                    this.$message.success('删除成功');
                    this.getTableList();
                  } else {
                    this.$message.error('删除失败');
                  }
                }.bind(this))
              }else{
                this.$message.error(res.msg);
              }
            } else {

            }
          }.bind(this))
        } else {
          this.$message({
            message: '请先选择要删除的数据',
            type: 'warning'
          })
        }
      },
      handleEditCallback(rowInfo) {
        let _this = this;

          console.log(rowInfo,'post请求中的查询字段')
        if (rowInfo) {
          ajaxRequest('post', 'back/category/checkRepeatCategory', {
            categoryCode: rowInfo.categoryCode,
            categoryName: rowInfo.categoryName,
            id:rowInfo.id
          }, function (res) {
            if (res.code === 200) {
              if (res.t === true) {
                _this.$message.error('器具类别代码/名称已存在，请修改后再提交');
              } else {
                if (rowInfo.id) {//修改
                  ajaxRequest('put', 'back/category/', {
                    id: rowInfo.id,
                    category: rowInfo.category,
                    name: rowInfo.name,
                    value: rowInfo.value,
                    memo: rowInfo.memo
                  }, function (res) {
                    if (res.code === 200) {
                      _this.$message.success('编辑成功');
                      _this.edit = null;
                      let roleList = _this.tableData;
                      for (let i = 0, len = roleList.length; i < len; i++) {
                        if (roleList[i].id === rowInfo.id) {
                          _this.tableData.splice(i, 1, rowInfo);
                          break;
                        }
                      }
                    }
                    else {
                      _this.$message.error('编辑失败');
                    }
                  });
                } else {//新增
                  ajaxRequest('post', 'back/category/getDeleteCategory', {
                    categoryCode: rowInfo.categoryCode,
                    categoryName: rowInfo.categoryName,
                    isDelete: 1
                  }, function (res) {
                    if (res.code === 200) {
                      console.log(res.t);
                      if (res.t !== null) {
                        _this.$confirm('存在历史数据，是否从历史数据中恢复?', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        }).then(() => {
                          ajaxRequest('put', 'back/category/', {id: res.t.id, isDelete: 0}, function (res) {
                            if (res.code === 200) {
                              _this.$message.success('恢复成功');
                              _this.edit = null;
                              _this.getTableList();
                            }
                            else {
                              _this.$message.error('恢复失败');
                            }
                          }.bind(_this))
                        }).catch(() => {
                          ajaxRequest('post', 'back/category/', {
                            categoryCode: rowInfo.categoryCode,
                            categoryName: rowInfo.categoryName
                          }, function (res) {
                            if (res.code === 200) {
                              _this.$message.success('新增成功');
                              _this.edit = null;
                              _this.getTableList();
                            }
                            else {
                              _this.$message.error('新增失败');
                            }
                          })
                        });
                      } else {
                          ajaxRequest('post', 'back/category/', {
                              categoryCode: rowInfo.categoryCode,
                              categoryName: rowInfo.categoryName
                          }, function (res) {
                              if (res.code === 200) {
                                  _this.$message.success('新增成功');
                                  _this.edit = null;
                                  _this.getTableList();
                              }
                              else {
                                  _this.$message.error('新增失败');
                              }
                          })
                      }
                    } else {
                      _this.$message.error('操作失败');
                    }
                  })
                }
              }
            }
          })
        }
        else {
          this.edit = null
        }
      },
      getRetrieveHeader() {
        ajaxRequest('get', 'back/dictEntry/list/', {dictTypeId: 13}, function (res) {
          if (res.code === 200) {
            var rows = res.rows;
            if (rows != null && rows.length > 0) {
              for (var i = 0; i < rows.length; i++) {
                rows[i].title = rows[i].name;
                rows[i].name = rows[i].dictCode;
                if (rows[i].memo != null && rows[i].memo.length > 0) {
                  var comparisonstrs = rows[i].memo.split(',');
                  var comparisons = [];
                  for (var j = 0; j < comparisonstrs.length; j++) {
                    comparisons[j] = new Object();
                    switch (comparisonstrs[j]) {
                      case '0':
                        comparisons[j].title = '包含';
                        comparisons[j].value = 0;
                        break;
                      case '1':
                        comparisons[j].title = '等于';
                        comparisons[j].value = 1;
                        break;
                      case '2':
                        comparisons[j].title = '大于';
                        comparisons[j].value = 2;
                        break;
                      case '3':
                        comparisons[j].title = '大于等于';
                        comparisons[j].value = 3;
                        break;
                      case '4':
                        comparisons[j].title = '小于';
                        comparisons[j].value = 4;
                        break;
                      case '5':
                        comparisons[j].title = '小于等于';
                        comparisons[j].value = 5;
                        break;
                      default :
                        ;
                    }
                  }
                  rows[i].comparisons = comparisons;
                }
                rows[i].type = 0;

              }
            }

            this.$refs['retrieve-wapper'].refreshSearchCondition(rows);
          }
        });
      }
    },
    mounted() {
      this.getTableList();
    }
  }
</script>

<style scoped>
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
  .span{
    font-size: 0.9rem;
    color:#606266;
  }
  .el-tab_head{margin-top: 0px;}
  .el-icon-cz::before{
    content: "\e62e";
  }
  .el-icon-cz{border:1px solid #fbb142;color: #fff;background:#fbb142;}
   .el-icon-cz:hover{background:#e6ad55; border:1px solid #e6ad55;}

</style>
