<template>
    <div style="position:relative;">
        <div v-show="!isSetting">
            <div style="margin-bottom:10px;">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增银行账号</el-button>
                    <!--<el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(multipleSelection)">-->
                        <!--批量删除-->
                    <!--</el-button>-->
            </div>

            <div class="el-tab_head"  style="position:absolute;top:0;right:0px">
                <span style="  color: #606266;font-weight: normalnpm run;font-size: 0.9rem;">开户名查询: </span>
                <el-input placeholder="请输入开户名":rows="2" class="custom-input" v-focusSelect v-model="searchKey"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                 &nbsp;&nbsp;
                 <div style="display:inline-block;position:relative;">
                    <global-tootips>
                        <p style="text-align:left;">默认账号用于委托单、现场委托单等单据打印时银行账号的显示信息；</p>
                    </global-tootips>
                 </div>

            </div>

            <div class="el-tab_head" style="">
                <el-table :data="tableData" border style="width: 100%" :max-height="QJTableMaxHeight"
                          @sort-change="handleSort"  @selection-change="handleSelectionChange" >

                    <el-table-column prop="accountName" label="开户名"></el-table-column>
                    <el-table-column prop="accountBank" label="开户行"></el-table-column>
                    <el-table-column prop="accountNo" label="账号"></el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                    <el-table-column prop="status" label="是否默认账号">
                      <template slot-scope="scope">
                        <span v-if="scope.row.status===0">否</span>
                        <span v-if="scope.row.status===1" style="color: red">是</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" fixed="right"  width="120px">
                        <template slot-scope="scope">
                            <el-button type="text" v-mindPopover="{message:'确认设为默认账号?',success:doDefault.bind(this,scope.row)}" style="padding:0;font-size:18px;"><i
                                    class="el-icon-circle-check-outline" title="设为默认账号"></i></el-button>
                          <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                                    class="el-icon-edit-outline" title="编辑"></i></el-button>
                            <el-button  type="text" v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,[scope.row])}" style="padding:0;font-size:18px;">
                                <i class="el-icon-delete" title="删除"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="text-align:center;margin-top:10px; float:right;">
                <mind-pagination
                        :current-page="page"
                        :page-size="rows"
                        :total="total"
                        @size-change="handlePageSizeChange"
                        @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
            <accountForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></accountForm>
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
    import accountForm from './accountForm';

    export default {
        name: "parameter-table",
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            accountForm
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
            }
        },
        methods: {
            selectText(event){
                event.currentTarget.select();
            },
            handleSort: function (column, prop, order) {
                this.orderProperty = column['prop'];
                if (column['order'] == 'descending') {
                    this.orderType = 'desc';
                } else {
                    this.orderType = 'asc';
                }
                this.getTableList();
            },
            handleSearch(value) {
                this.page = 1;
                this.total = 0;
                this.getTableList();
            },
            getTableList() {
                ajaxRequest('get', 'back/account/retrieve', {
                    accountName: this.searchKey,
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
                  // this.$confirm('确定要删除该银行账号?', '提示', {
                  //   confirmButtonText: '确定',
                  //   cancelButtonText: '取消',
                  //   type: 'warning',
                  //   center:true,
                  // }).then(() => {
                    let ids = data.map(function (v) {
                      return v.id
                    }).join(",");
                    if(data[0].status == 1){
                        this.$message.error('默认账号不可删除，请重新设置默认账号')
                        return ;
                    }
                    ajaxRequest('post', 'back/account/list/' + ids, {_method: 'delete'}, function (res) {
                      if (res.code === 200) {
                        this.$message.success('删除成功');
                        this.getTableList();
                      }
                      else {
                        this.$message.error('删除失败');
                      }
                    }.bind(this))
                  // },()=>{

                  // })
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
                        ajaxRequest('put', 'back/account/', {
                            id: rowInfo.id,
                            accountName: rowInfo.accountName,
                            accountBank: rowInfo.accountBank,
                            accountNo: rowInfo.accountNo,
                            remark: rowInfo.remark
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
                    }
                    else {
                        ajaxRequest('post', 'back/account/',
                            {
                                accountName: rowInfo.accountName,
                                accountBank: rowInfo.accountBank,
                                accountNo: rowInfo.accountNo,
                                remark: rowInfo.remark
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
                        console.log('1111111111', rows);
                        this.$refs['retrieve-wapper'].refreshSearchCondition(rows);
                    }
                });
            },
            doDefault(rowInfo){
              let _this = this;
              if (rowInfo.id) {
                ajaxRequest('put', 'back/account/doDefault', {
                  id: rowInfo.id,
                  status: 1
                }, function (res) {
                  if (res.code === 200) {
                    _this.$message.success('设置成功！');
                    _this.getTableList();
                  }
                  else {
                    _this.$message.error('设置失败！');
                  }
                });
              }
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
      /*  height: 32px;*/
    }

    .custom-input .el-input__inner {
        height: 32px;
        line-height: 32px;
    }

    .custom-input .el-input-group__append {
        padding: 0 10px;
    }

    /********说明样式start*******/
    .el-sm{background: #ffffff;
      position: absolute;
      z-index: 999;
      -webkit-box-shadow: 1px 7px 33px -9px #969696;
      box-shadow: 1px 7px 33px -9px #969696;
      border: 1px solid #56bc4e8c;
      border-radius: 5px;
      color: dimgrey;
      margin-left: -361px;
      word-break: break-all;
      margin-top: 18px;
      padding: 4px 5px;
      font-size: 14px;
      opacity: 50;
      float: right; -webkit-transition: all 0.8s;transition: all 0.8s;}
    .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;}
    .shuoming::after{
      content: "";
      width: 35px;
      height: 40px;
      /*background: #fff;*/
      position: absolute;
      z-index: 999;
      /* top: 0; */
      /* left: -65px; */
      margin-left: -16px;
    }
    .shuoming .el-sm{
      display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
    }
    /********说明样式end*******/
</style>
