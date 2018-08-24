<template>
  <div v-show="!isSetting">
    <div style="margin-top:10px;">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增发证单位</el-button>
      <el-table :max-height="QJTableMaxHeight"
        :data="tableData"
        border
        style="width: 100%" size="small">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="companyName" label="发证单位"></el-table-column>
        <el-table-column prop="quotationNumber" label="备注"></el-table-column>
        <el-table-column prop="contractNumber" label="排序"></el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
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
       <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">
      </mind-pagination>
      <certificationUnitForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></certificationUnitForm>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex'; 
  import {ajaxRequest, formatArrayToTree,formatDate} from '../../util/base';
 

  export default {
    name: "parameter-table",
    data(){
      return{
        page:1,
        rows:10,
        total:0,
        searchKey:'',
        orderProperty:'id',
        orderType:'desc',
        tableData:[],
        multipleSelection:[],
        fuzzySearch:0,
        isSetting:0,
        edit:null,
      }
    },
    methods:{
      getTableList(){
//        ajaxRequest('get','back/certificationUnit/getCerUnitList',{
//          page:this.page,
//          rows:this.rows,
//          orderProperty:this.orderProperty,
//          orderType:this.orderType,
//          total:0
//        },function(res){
//          if(res.code===200){
//            this.tableData=res.rows;
//            this.total=res.total;
//            this.multipleSelection=[];
//          }
//        }.bind(this))
        ajaxRequest('get', 'back/certificationUnit/list', {
//          unit:this.input1,
//          remark:this.input2,
//          orderNum:input3,
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total: 0,
          isDelete: 0,
        }, function (res) {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
            this.multipleSelection = [];
          }
        }.bind(this))
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getTableList();
      },
      formatterTime:function(row, column){
        return formatDate(row.addTime,'YYYY-MM-DD');
      },
      handleEdit(rowInfo) {
        this.edit = rowInfo || {}
      },
      handleDelete(data) {
        if (data.length > 0) {
          let ids = data.map(function (v) {
            return v.id
          }).join(",");
          this.$confirm('是否确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ajaxRequest('put', 'back/certificationUnit/', {id: ids, isDelete: 1}, function (res) {
              if (res.code === 200) {
                this.$message.success('删除成功');
                this.getTableList();
              } else {
                this.$message.error('删除失败');
              }
            }.bind(this))
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
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
          ajaxRequest('post', 'back/certificationUnit/checkUnit', {
            unit: rowInfo.unit,
          }, function (res) {
            if (res.code === 200) {
              if (res.t === true) {
                _this.$message.error('发证单位名称已存在，请修改后再提交');
              } else {
                if (rowInfo.id) {//修改
                  ajaxRequest('put', 'back/certificationUnit/', {
                    id: rowInfo.id,
                    certificationUnit: rowInfo.certificationUnit,
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
                }
                else {//新增
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
                      _this.$message.error('新增失败');
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
    },
    components:{

    },
    mounted() {
      this.getTableList();
    }
  }
</script>

<style scoped>
  .custom-input{
    width:200px;
    height:32px;
  }
  .custom-input .el-input__inner{
    height:32px;
    line-height:32px;
  }
  .custom-input .el-input-group__append{
    padding:0 10px;
  }
</style>
