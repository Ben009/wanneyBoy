<script>
  import Vue from 'vue';
  import {ajaxRequest, ajaxSyncRequest, formatArrayToTree} from '../util/base';
  import EditDictType from './EditDictType';
  import EditDictData from './EditDictData';
  import $ from 'jquery';
  import '../util/Base.css';
  import '../util/CustomTable.css';

/*   import {Tree, Table, TableColumn, Pagination} from 'element--ui';
  Vue.use(Tree);
  Vue.use(Table);
  Vue.use(TableColumn); */

  export default {
    name: "dict-table",
    render(createElement) {
      const _this = this;
      return (
        <div>
          <div  style="top:0;width:220px;min-height:800px;bottom:0;">
            <el-tree
              ref="tree"
              data={this.dataTreeList}
              node-key="id"
              highlight-current
              props={{label: 'name', children: 'children'}}
              on-node-click={_this.handleNodeClick}
            >
            </el-tree>
          </div>
          <div style="position:absolute;min-height:800px;width:80%;left:220px;top:0;bottom:0;padding:15px;">
            <div>
              <el-button size="small" type="primary" icon="el-icon-plus"
                         on-click={_this.editDictType.bind(_this, null)}>新增资源
              </el-button>
            </div>
            <div style="position:absolute;top:15px;right:15px">
              <el-input placeholder="请输入字典名称" class="custom-input" on-change={_this.handleSearch}>
                <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <div style="margin-top:20px;">
              <table class="double-table">
                <colgroup>
                  {
                    _this.columns.map(function (v) {
                      return <col width={v.thStyle.width}/>
                    })
                  }
                </colgroup>

                <thead>
                <tr>
                  {
                    _this.columns.map(function (v) {
                      return <th key={v.name} style={v.thStyle}>
                        <div style={v.thStyle}>{v.title}</div>
                      </th>
                    })
                  }
                </tr>
                </thead>
                <tbody key={this.renderKey}>
                {
                  _this.dataList && _this.dataList.length > 0 ?
                    _this.dataList.map(function (row, index) {
                      return (
                        index % 2 == 0 ? <tr key={row.id}
                                             data-id={row.id}
                                             class={_this.selectedInfo.id == row.id ? 'selected' : ''}
                                             on-click={_this.handleClick.bind(_this, row)}>
                          {_this.columns.map(function (col) {
                            return (
                              <td
                                class={col.tdClass}
                                style={col.tdStyle}
                                title={col.tdClass ? row[col.name] : null}
                              >
                                {col.render ? col.render(row[col.name], index, row, _this) : row[col.name]}
                              </td>
                            )
                          })}
                        </tr> : <tr style={$.inArray(row.id, _this.showPid) != -1 ? null : {"display": "none"}}
                                    class={_this.selectedInfo.id == row.id ? 'sub-selected' : ''}>
                          <td></td>
                          <td colspan={_this.columns.length - 1} style={{"padding": "0"}}>
                            <table class='sub-table' style={{"width": "100%"}}>
                              <thead>
                              <tr>
                                {
                                  _this.subColumns.map(function (v) {
                                    return <th key={v.name} style={v.thStyle} style={{"background": "#80d4f6"}}>
                                      <div style={v.thStyle}>{v.title}</div>
                                    </th>
                                  })
                                }
                              </tr>
                              </thead>
                              <tbody>
                              {
                                $.inArray(row.id, _this.showPid) != -1 ? _this.getSubDataList(row.id, _this.subColumns) : null

                              }
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )
                    })
                    : <tr>
                      <td colspan={_this.columns.length} style={{"textAlign": "center"}}>没有数据</td>
                    </tr>
                }
                </tbody>
              </table>
            </div>


            <div style="margin-top:10px;text-align:center;float:right;">
               <mind-pagination
                current-page={this.page}
                page-size={this.rows}
                total={this.total}
                size-change={_this.handlePageSizeChange}
                current-change={_this.handleCurrentPageChange}>
              </mind-pagination>
            </div>
          </div>
          {
            this.editType ?
              <EditDictType rowInfo={this.editType} callback={this.handleEditTypeCallback.bind(this)}></EditDictType> : null
          }
          {
            this.editData ?
              <EditDictData rowInfo={this.editData} callback={this.handleEditDataCallback.bind(this)}></EditDictData> : null
          }

        </div>

      )

    },
    data() {
      let _this = this;
      let columns = [
        {
          title: '',
          thStyle: {"width": "40px"},
          tdStyle: {'width': '40px'},
          render: function (v, i, obj) {
            return (
              <div class="actions-btn">
                {$.inArray(obj.id, _this.showPid) == -1 ?
                  <a href='javascript:;' on-click={_this.showSubTable.bind(_this, obj)}><i class='el-icon-circle-plus'></i></a>
                  : <a href='javascript:;' on-click={_this.hideSubTable.bind(_this, obj)}><i class='el-icon-remove'></i></a>
                }
              </div>
            )
          }
        },
        {
          title: '物理名称',
          name: 'dictCode',
          thStyle: {"width": "80px"}
        },
        {
          title: '逻辑值',
          name: 'name',
          thStyle: {"width": "80px"}
        },
        {
          title: '所属业务',
          name: 'business',
          thStyle: {"width": "80px"}
        },
        {
          title: '描述',
          name: 'description',
          thStyle: {"width": "100px"}
        },
        {
          title: '创建时间',
          name: 'addTime',
          thStyle: {"width": "100px"},
          render: function (v, i, obj) {
            return <span>{new Date(v).format('YYYY-MM-DD hh:mm')}</span>
          }
        },
        {
          title: '操作',
          thStyle: {"width": "80px"},
          render: function (v, i, obj) {
            return (
              <div class='actions-btn'>
                <a href="javascript:;" title='新增实体' on-click={_this.editDictData.bind(_this, null,obj)}><i class='el-icon-plus'></i></a>
                <a href="javascript:;" title='编辑' on-click={_this.editDictType.bind(_this, obj)}><i class='el-icon-edit'></i></a>
                <a href="javascript:;" title='删除' on-click={_this.deleteDictType.bind(_this, obj)}><i class='el-icon-delete'></i></a>
              </div>
            )
          }
        }
      ];
      let subColumns = [
        {
          title: '序号',
          name: '',
          thStyle: {"width": "40px"},
          /* tdStyle:{"background":'#ebf0f5'},*/
          render(v, i, obj) {
            return (i + 1)
          }
        },
        {
          title: '物理名称',
          name: 'dictCode',
          thStyle: {"width": "253px"}
        },
        {
          title: '逻辑值',
          name: 'name',
          thStyle: {"width": "253px"}
        },{
          title: '备注',
          name: 'memo',
          thStyle: {"width": "253px"}
        },
        {
          title: '操作',
          thStyle: {"width": "80px"},
          render: function (v, i, obj) {
            return (
              <div class='actions-btn'>
                <a href="javascript:;" title='编辑' on-click={_this.editDictData.bind(_this, obj)}><i class='el-icon-edit'></i></a>
                <a href="javascript:;" title='删除' on-click={_this.deleteDictData.bind(_this, obj)}><i class='el-icon-delete'></i></a>
              </div>
            )
          }
        }
      ];
      return {
        dataTreeList: [],
        pid: null,
        dataList: [],
        subData: {},
        showPid: [],
        selectedInfo: {},

        page: 1,
        rows: 10,
        total: 0,
        searchKey: null,

        columns: columns,
        subColumns: subColumns,

        multipleSelection: [],
        editType: null,//编辑和新增字典类型 弹窗
        editData: null,//编辑和新增字典实体 弹窗

        dictInfo:null,
        renderKey:0,
      }
    },
    created() {
      this.getDataList();
      this.getDataListByPid();
    },
    methods: {
      showSubTable(info) {
        let pids = this.showPid;
        pids.push(info.id);
        this.showPid = pids;
        this.selectedId = info.id;
        this.getSubData(info.id);

      },
      hideSubTable(info) {
        let pids = this.showPid.filter(function (v) {
          return v != info.id
        });
        this.showPid = pids;
        this.selectedId = null;
      },
      getSubData(id) {
        let subData = this.subData;
        if (!id) {
          return
        } else {
          let tempData = [];
          ajaxSyncRequest('get', 'back/dictEntry/list/', {dictTypeId: id}, (res) => {
            if (res.code == 200) {
              tempData = res.rows;
            }
          });
          subData[id] = tempData;
          this.subData = subData;
        }
      },
      getSubDataList(id, subColumns) {
        let _this = this;
        let subData = this.subData;
        return (
          subData && !$.isEmptyObject(subData) && subData[id] && subData[id].length > 0 ?
            subData[id].map(function (row, index) {
              return (
                <tr key={row.id}>
                  {subColumns.map(function (col) {
                    return (
                      <td
                        class={col.tdClass}
                        style={col.tdStyle}
                        title={col.tdClass ? row[col.name] : null}
                      >
                        {col.render ? col.render(row[col.name], index, row, _this) : row[col.name]}
                      </td>
                    )
                  })}
                </tr>
              )
            }) :
            <tr>
              <td colspan={_this.subColumns.length} style={{"textAlign": "center"}}>没有数据</td>
            </tr>
        )
      },
      getDataList() {
        let _this = this;
        ajaxRequest('get', 'back/dictType/list', null, (res) => {
          if (res.code === 200) {
            let dataTreeList = formatArrayToTree(res.rows, [], 0, []);
            _this.dataTreeList = dataTreeList;
          }
        });
      },
      getDataListByPid() {
        if (this.searchKey) {
          ajaxRequest('get', 'back/dictType/retrieve', {
            name: this.searchKey,
            fuzzySearch: 1,
            page: this.page,
            rows: this.rows,
            total: 0
          }, (res) => {
            if (res.code === 200) {
              this.dataList = this.transferData(res.rows);
              this.total = res.total;
            }
          })
        }
        else {
          ajaxRequest('get', 'back/dictType/list', {
            pid: this.pid,
            page: this.page,
            rows: this.rows,
            total: 0
          }, (res) => {
            if (res.code === 200) {
              this.dataList = this.transferData(res.rows);
              this.total = res.total;
            }
          })
        }

      },
      transferData(data) {
        var tempData = [];
        data && data.forEach(function (v, i) {
          tempData.push(v);
          tempData.push({id: v.id});
        });
        return tempData
      },
      handleNodeClick(data, node, comp) {
        //console.log(this.$refs.tree.getCurrentNode());
        if (this.pid !== data.id) {
          this.pid = data.id;
          this.getDataListByPid();
        }
      },
      handleSearch(value) {
        this.searchKey = value;
        this.page = 1;
        this.total = 0;
        this.getDataListByPid();
      },
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getDataListByPid();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getDataListByPid();
      },
      editDictType(rowInfo) {
        this.editType = rowInfo || {};
      },
      editDictData(rowInfo,obj) {
        this.editData = rowInfo || {};
        this.dictInfo = obj;
      },
      handleEditTypeCallback(data) {
        let _this = this;
        if (data) {
          if (data.id) {
            ajaxRequest('put', 'back/dictType/',
              {
                id: data.id,
                name: data.name,
                dictCode: data.dictCode,
                rank: data.rank,
                business: data.business,
                description: data.description
              },
              function (res) {
                if (res.code === 200) {
                  _this.$message.success('编辑成功');
                  _this.editType = null;
                  _this.getDataList();
                  let tableData = _this.dataList;
                  for (let i = 0, len = tableData.length; i < len; i++) {
                    if (tableData[i].id === data.id) {
                      tableData.splice(i, 1, data);
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
            data.pid=this.pid || 0;
            ajaxRequest('post', 'back/dictType/', data,
              function (res) {
                if (res.code === 200) {
                  _this.$message.success('新增成功');
                  _this.editType = null;
                  _this.getDataListByPid();
                  _this.getDataList();
                }
                else {
                  _this.$message.error('新增失败');
                }
              })
          }
        }
        else {
          this.editType = null
        }
      },
      handleEditDataCallback(data) {
        let _this = this;
        if (data) {
          if (data.id) {
            ajaxRequest('put', 'back/dictEntry/',
              {
                id: data.id,
                name: data.name,
                dictCode: data.dictCode,
                memo: data.memo,
                rank: data.rank,
              },
              function (res) {
                if (res.code === 200) {
                  _this.$message.success('编辑成功');
                  _this.editData = null;
                  let subData = $.extend({},_this.subData);
                  for(let i in subData){
                    if(i == data.dictTypeId){
                      let temp = subData[i];
                      for (let j = 0, len = temp.length; j < len; j++) {
                        if (temp[j].id === data.id) {
                          temp.splice(j, 1, data);
                          break;
                        }
                      }
                    }
                  }
                  this.subData = subData;
                }
                else {
                  _this.$message.error('编辑失败');
                }
              });
          }
          else {
            data.dictTypeId = _this.dictInfo.id;
            ajaxRequest('post', 'back/dictEntry/', data,
              function (res) {
                if (res.code === 200) {
                  _this.$message.success('新增成功');
                  _this.editData = null;
                  _this.getSubData(data.dictTypeId);
                }
                else {
                  _this.$message.error('新增失败');
                }
              })
          }
        }
        else {
          this.editData = null
        }
      },
      /*删除字典类型*/
      deleteDictType(obj) {
        ajaxRequest('delete', 'back/dictType/list/' + obj.id, null, (res) => {
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.getDataListByPid();
            this.getDataList();
          }
        })
      },
      /*删除字典实体*/
      deleteDictData(obj) {
        ajaxRequest('delete', 'back/dictEntry/list/' + obj.id, null, (res) => {
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.getSubData(obj.dictTypeId);
            this.renderKey=!this.renderKey;
          }
        })
      },
      handleClick() {

      }
    },
    components: {
       EditDictType, EditDictData
    }
  }
</script>

<style scoped>
  .actions-btn a{
    color:#409EFF;
    font-weight:bold;
  }
  .actions-btn a i{
    margin-right:5px;
  }
</style>
