<template>
    <div style="position:relative; ">
        <div v-show="!isSetting">
            <div style="margin-bottom:10px;">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增结论用语</el-button>
                <!--<el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(multipleSelection)">-->
                    <!--批量删除-->
                <!--</el-button>-->
            </div>
            <div style="position:absolute;top:0;right:0px">
                <span style="  color: #606266;font-weight: normalnpm run;font-size: 0.9rem;">部门: </span>
                <el-input  :rows="2" placeholder="请输入部门名称" ref="input" class="custom-input" v-focusSelect v-model="searchKeyDepart"></el-input>
                <span style="  color: #606266;font-weight: normalnpm run;font-size: 0.9rem;">结论用语: </span>
                <el-input  :rows="2" placeholder="请输入结论用语" ref="input" class="custom-input" v-focusSelect v-model="searchKey"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch"> 查询</el-button> &nbsp;&nbsp;
                <!-- <el-tooltip class="item" effect="dark" content="选中文本内容右击可添加修饰符"><i class="el-icon-info ft12"></i></el-tooltip> -->
              <!-- <div class="el-icon-info  shuoming" >
                <el-row class="el-sm">
                </el-row>
              </div> -->
              <div style="display:inline-block;position:relative">
                <global-tootips>
                  <p>1、结论用语用于证书/原始记录的调用；</p>
                  <p>2、新增或修改的结论用语仅针对新添加的证书/原始记录生效，已经出具的证书/原始记录无效，如需修改原证书/原始记录，请在相应证书/原始记录处鼠标右键进行修改；</p>
                  <p>3、权限说明：有权限查询所有记录，无权限查询本部门记录；</p>
                </global-tootips>
              </div>
            </div>
          <div style="">
                <el-table :data="tableData" border style="width: 100%" :max-height="QJTableMaxHeight"
                          @sort-change="handleSort"  @selection-change="handleSelectionChange" >
                    <!-- <el-table-column type="selection" width="40"></el-table-column> -->

                    <el-table-column  prop="departName"  label="适用部门"></el-table-column>
                    <el-table-column  prop="postName"  label="适用岗位"></el-table-column>
                    <el-table-column  prop="conclusion" label="结论用语">
                      <template slot-scope="scope">
                        <span v-html="scope.row.conclusion"></span>
                      </template>
                    </el-table-column>
                    <el-table-column  prop="conclusionEn" label="结论用语（英文）">
                      <template slot-scope="scope">
                        <span v-html="scope.row.conclusionEn"></span>
                      </template>
                    </el-table-column>
                    <el-table-column  prop="certificateType" label="适用证书类型"></el-table-column>

                    <el-table-column  label="操作" fixed="right"  width="80px">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-edit-outline" title="编辑"></i></el-button>
                            <el-button v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,[scope.row])}" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-delete" title="删除"></i></el-button>
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
            <conclusionForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></conclusionForm>
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
    import conclusionForm from './conclusionForm';

/*     import {Table, TableColumn, Pagination} from 'element--ui';
    Vue.use(Table);
    Vue.use(TableColumn); */

    export default {
        name: "parameter-table",
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            conclusionForm
        },
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: 'c.id',
                orderType: 'desc',
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 0,
                isSetting: 0,
                edit: null,
                searchKeyDepart:'',
            }
        },
        methods: {
            selectText(event){
                event.currentTarget.select();

                // console.log(this.$refs,'$refs')
                // this.$refs.input.select();
            },
            handleSearch() {
                this.page = 1;
                this.total = 0;
                this.getTableList();
            },
            getTableList() {
                ajaxRequest('get', 'back/conclusion/retrieve', {
                    conclusion: this.searchKey,
                    departName:this.searchKeyDepart,
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    isDelete:0,
                    total: 0,
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
                    ajaxRequest('post', 'back/conclusion/list/' + ids, {_method: 'delete'}, function (res) {
                      if (res.code === 200) {
                        this.$message.success('删除成功');
                        this.getTableList();
                      }
                      else {
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
            handleEditCallback(rowInfo) {
                let _this = this;
                if (rowInfo) {
                    rowInfo.certificateType = rowInfo.certificateType.toString();
                    if (rowInfo.id) {
                        ajaxRequest('put', 'back/conclusion/',
                            {
                                id: rowInfo.id,
                                orgId: rowInfo.orgId,
                                postId: rowInfo.postId,
                                conclusion: rowInfo.conclusion,
                                conclusionEn: rowInfo.conclusionEn,
                                certificateType: rowInfo.certificateType
                            }
                            , function (res) {
                                if (res.code === 200) {
                                    _this.$message.success('编辑成功');
                                    _this.edit = null;
                                    _this.getTableList();
                                }
                                else {
                                    _this.$message.error('编辑失败');
                                }
                            });
                    }
                    else {
                        ajaxRequest('post', 'back/conclusion/',
                            {
                                orgId: rowInfo.orgId,
                                postId: rowInfo.postId,
                                conclusion: rowInfo.conclusion,
                                conclusionEn: rowInfo.conclusionEn,
                                certificateType: rowInfo.certificateType
                            }
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
        }
    }
</script>

<style scoped>
    .custom-input {
        width: 200px;
        /*height: 32px;*/
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
