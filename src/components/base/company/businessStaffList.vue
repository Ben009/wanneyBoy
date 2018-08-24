<template>
  <div style="position:relative;">

    <div class="el-tab_head" style="float:left;">
      <!--<el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(multipleSelection)">批量删除</el-button>-->
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增业务员</el-button>
    </div>
    <div class="el-tab_head"  style="position:absolute;top:0;right:0px;">
      <span class="span">业务组: </span>
      <el-input placeholder="请输入业务组" v-focusSelect class="custom-input" style="width:200px;" v-model="searchKeyGroup"></el-input>
      <span class="span">业务员: </span>
      <el-input placeholder="请输入业务员" v-focusSelect class="custom-input" style="width:200px;" v-model="searchKey"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="position: relative;top: -1px;">查询</el-button>
    </div>
    <div class="el-tab_head">
      <el-table :data="tableData"
        :max-height="QJTableMaxHeight"
        border
        style="width: 100%; position:relative; top:10px;min-height:39vh;"
        @selection-change="handleSelectionChange">
        <!-- <el-table-column
          type="selection"
          width="40">
        </el-table-column> -->

        <el-table-column
          prop="staffName"
          label="业务员"
        >
        </el-table-column>
        <el-table-column
          prop="businessGroupName"
          label="业务组"
        >
        </el-table-column>
        <el-table-column
          prop="chargeName"
          label="负责人"
        >
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="mobilePhone"
          label="手机"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          width="80">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-edit-outline" title="编辑"></i></el-button>
            <el-button v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,[scope.row]),placement:'left'}" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-delete" title="删除"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align:center; margin-top:10px;float:right;">
      <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">
      </mind-pagination>
    </div>
    <salesmanForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></salesmanForm>
  </div>


</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest, formatArrayToTree , ajaxProxyRequest} from '../../util/base';
  import Retrieve from '../../Retrieve';
  import WorkMould from '../../mould/WorkMould';
  import TableColumnHeader from '../../Table/TableColumnHeader';
  import salesmanForm from './businessStaffForm';

  export default {
    name: "parameter-table",
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve,
      salesmanForm
    },
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        // 业务员与业务组查询
        searchKey: '',
        searchKeyGroup:'',
        orderProperty: 's.id',
        orderType: 'desc',
        defaultInfo:{},
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,
        isSetting: 0,
        edit: null,
      }
    },
    methods: {
      handleSearch(value) {
        // this.searchKey = value;

        this.page = 1;
        this.total = 0;
        this.getTableList();
      },
      getTableList() {
        if (this.searchKey || this.fuzzySearch === 1 || this.searchKeyGroup) {
          ajaxRequest('get', 'back/businessStaff/retrieve', {
            staffName:this.searchKey,
            businessGroupName:this.searchKeyGroup,
            fuzzySearch: 1,
            page: this.page,
            rows: this.rows,
            isDelete:0,
            total: 0
          }, (res) => {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
            }
          })
        }
        else {
          ajaxRequest('get', 'back/businessStaff/list', {
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            orderType: this.orderType,
            total: 0
          }, function (res) {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
              this.multipleSelection = [];
            }
          }.bind(this))
        }
      },
      handleToggleTheme(color) {
        this.$store.commit('toggleTheme', color)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePageSizeChange(size) {
        this.page = 1;
        this.rows = size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
      handleEdit(rowInfo) {
        console.log(rowInfo)
        this.edit = rowInfo || this.defaultInfo
      },
      handleDelete(data) {
        if (data.length > 0) {
          let ids = data.map(function (v) {
            return v.id
          }).join(",");
          ajaxRequest('post', 'back/businessStaff/list/' + ids, {_method: 'delete'}, function (res) {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.getTableList();
            }
            else {
              this.$message.error('删除失败');
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
        if (rowInfo) {
          if (rowInfo.id) {
            ajaxRequest('put', 'back/businessStaff/',
              rowInfo, function (res) {
                if (res.code === 200) {
                  _this.$message.success('编辑成功');
                  _this.edit = null;
                  // let roleList = _this.tableData;
                  // for (let i = 0, len = roleList.length; i < len; i++) {
                  //   if (roleList[i].id === rowInfo.id) {
                  //     _this.tableData.splice(i, 1, rowInfo);
                  //     break;
                  //   }
                  // }
                  _this.getTableList();

                }
                else {
                  _this.$message.error('编辑失败');
                }
              });
          }
          else {
            ajaxRequest('post', 'back/businessStaff/',
              rowInfo
              , function (res) {
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
      ajaxProxyRequest('get','/njmind/findParams/defaultCompanyName$defaultAddress$defaultTelephone$defaultFax',{},(res)=>{
        this.defaultInfo = {
          address:res.defaultAddress.value,
          companyName:res.defaultCompanyName.value,
          telephone:res.defaultTelephone.value,
          fax:res.defaultFax.value
        }
      })
    }
  }
</script>

<style scoped>
  /*.custom-input {
    width: 200px;
    height: 32px;
  }

  .custom-input .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  .custom-input .el-input-group__append {
    padding: 0 10px;
  }*/
    .span{
    font-size:0.9rem;
    color:#606266;
    /* vertical-align: bottom; */
  }

</style>
