<template>
  <mind-dialog
    :title="'挂账查询'"
    :visible="true"
    width="70%"
    center
    v-dialogDrag
    appendToBody
    @close="handleCancel"
    ref="dialog">
    <div>缴费单金额：
      <span style="color: red;width: 95%">{{billMoney}}</span>
      <span style="width: 5%;float:right">
        <global-tootips :width="600">
            <p>1、系统默认列出挂账单位与缴费单对应的单位一致的挂账记录，有权限人员可以使用其它单位的挂账记录；
            <p>2、系统支持一个缴费单从多条挂账记录中扣除金额；</p>
            <p>3、当所有的挂账金额不足扣除本次缴费单金额，需现金或其它方式补充时，需通过预开票流程补充相应的金额进行操作；</p>
          </global-tootips>
      </span>
    </div>
    <div style="position:relative;" ref="totalHeight">
      <div style="margin-bottom:5px;" ref="topButton">
        <div>
          <div style="text-align: center">
            <el-button type="primary" round @click="AdvanceSearch" class="el-icon-search">查询</el-button>
            <el-button type="warning" round @click="EmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
          </div>
        </div>
      </div>
      <div>
        <div style="margin-top:10px;">
          <el-table :data="tableData" v-if="tableVisable" :height="singleTableHeight" :key="tableKey" border style="width: 100%"
                    ref="tableList" @sort-change="handleSort"
                    @select="handleSelectionChange">
            <el-table-column prop="ticketCompany" fixed="left" label="挂账单位" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="ticketTypeName" fixed="left" label="票种" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="ticketCode" label="发票号" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="creatorName" label="挂账人" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="addTime" label="挂账日期" :formatter="dealDate" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="ticketMoney" label="挂账金额" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="ticketBalance" label="挂账余额" :render-header="renderHeader"></el-table-column>
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="使用金额" :render-header="renderHeader">
              <template slot-scope="scope">
                <el-input-number style=" width: 80px;" v-model="scope.row.useMoney" :controls="false" @change="testC" :max="scope.row.ticketBalance" :min="0"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right;" ref="pagination">
          <mind-pagination
            :current-page="page"
            :page-size="rows"
            :total="total"
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentPageChange">
          </mind-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
    </span>
    </div>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import {ajaxRequest, formatArrayToTree,formatDate, ajaxProxyRequest} from '../../util/base';
  import MiniTableHeader from '../../quality/tecBas/TableHeader.vue'
  import paramJson from './usableTicketList.js'    //同目录下json数据

  export default {
    name: "usableTicketList",
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 't.id',
        orderType: 'desc',
        tableData: [],
        tableDataLink: [],
        multipleSelection: [],
        fuzzySearch: 0,

        isSetting: 0,  //控制个性化设置弹窗是否展示
        edit: null,   //控制编辑弹窗是否展示
        isInner: 0,

        /* 高级检索相关项 */
        rowsCondition: paramJson, // 默认同目录下json数据 会依据模板改变
        paramJson: paramJson, // 同目录下json数据 常量
        moduleList: [], // 模板列表
        templateValue: '', // 当前选择的模板id
        sortBy: '', // 排序字段
        order: '', // desc降序 asc升序
        headObj: {}, // 表头显示对象 {category:true}
        userId: '',
        //allModules: {}, // 所有模板
        resultCondition: [],
        sc: {},
        search: {},
        setEmpty: {},
        //collectionInfo: [],
        setHeightForRet: null,
        tableKey: 0,
        billMoney: this.data.billMoney,
        useMoney: 0,//已经使用的金额
        needMoney: this.data.billMoney,//还需要认领的金额
        singleTableHeight:200,
        tableVisable:true,
      }
    },
    watch:{
      innerHeight(){
        this.calcTableHeight()
      }
    },
    methods: {
      calcTableHeight(){
        this.$nextTick(val => {
          this.tableVisable=false;
          this.$nextTick(val => {
            this.tableVisable=true;
          })
          let dialog = this.$refs.dialog.$el.querySelector('.el-dialog');
          let dialogBodyHeight = $(dialog).height() - $(dialog.querySelector('.el-dialog__header')).height();
          this.singleTableHeight = dialogBodyHeight - ($(this.$refs.topButton).height() + $(this.$refs.pagination).height() + 65)
        })
      },
      dealDate: function (row, column, cellValue) {
        return formatDate(cellValue, 'YYYY-MM-DD')
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
      getTableList() {
        ajaxRequest('get', 'back/ticket/retrieveTicketsOfCanClaimJdf', {
          fuzzySearch: 1,
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total: 0,
          sc: this.sc,
          billId:this.data.id,
        }, (res) => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
            this.multipleSelection = [];
            $(".has-gutter .el-checkbox").hide();
          }
        })
      },
      handleSelectionChange(val,row) {
        if(val.indexOf(row)==-1){
          this.useMoney = parseFloat(this.useMoney) - parseFloat(row.useMoney);
          this.needMoney = parseFloat(this.needMoney) + parseFloat(row.useMoney);
          row.useMoney = '';
        }
        if(val.length > 0) {
          let nowChecked = val[val.length - 1];
          let balanceMoney = nowChecked.ticketBalance;
          let tempNeedMoney = parseFloat(this.billMoney) - parseFloat(this.useMoney);
          if (parseFloat(tempNeedMoney) > 0 ) {
            if (parseFloat(tempNeedMoney) > parseFloat(balanceMoney)) {
              nowChecked.useMoney = balanceMoney;
            } else {
              if(val.length == 1){
                nowChecked.useMoney += tempNeedMoney;
              }else{
                nowChecked.useMoney = tempNeedMoney;
              }

            }
            this.useMoney = parseFloat(this.useMoney) + parseFloat(nowChecked.useMoney);
            this.needMoney = parseFloat(this.needMoney) - parseFloat(nowChecked.useMoney);
          } else {
            if(val.indexOf(row)!=-1) {
              nowChecked.useMoney = 0;
              this.needMoney = 0;
            }
          }
        }else{
          this.useMoney = 0;
          this.needMoney = this.billMoney;
        }
        this.multipleSelection = val;
      },
      handlePageSizeChange(size) {
        this.page = 1
        this.rows = size
        this.getTableList()
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage
        this.getTableList()
      },
      renderHeader(h, {column, $index}) {
        /*表格头部自定义渲染  key值必加 隐藏列时需重新渲染头部*/
        let property = column.property, flag = false;
        this.rowsCondition.forEach(v => {
          if (property == v.nameCode) {
            flag = true;
          }
        });
        if (flag) {
          let currentInfo = this.paramJson.filter((v) => {
            return v.nameCode == property
          });
          //console.log('aaaa',currentInfo,'序号',$index)
          return (
            < MiniTableHeader
          key = {$index +property}
          column = {column}
          handleSearch = {this.handleSearch.bind(this)
        }
          index = {$index}
          currentInfo = {currentInfo}
          onEnterInput={this.AdvanceSearch}
          />
        )
        } else {
          return column.label
        }
      },
      handleSearch(column, value, index, empty) {
        /*表格头部检索回调 获取当前列检索信息回显高级搜索组件
        * comparison 默认显示第一条比较项
        * column.property 列英文名称
        * value 检索值
        * sqlSeg 列sqlSeg信息*/
        var comparison = this.getComparison(column.property);
        var sqlSeg = this.getSqlSeg(column.property);
        /*表格标题检索回调 插入一条检索项*/
        this.search[column.property] = {
          logicalValue: 0,
          nameCode: column.property,
          comparison: comparison,
          value: value,
          sqlSeg: sqlSeg,
        };

        this.setEmpty[column.property] = empty;
        console.log("新增检索项", JSON.stringify(this.search));
      },
      getComparison(property) {
        /*通过列属性，找到当前列json配置中第一个比较项*/
        let temp = this.paramJson.filter((v) => {
          return v.nameCode == property
        })
        let comparison = temp.length > 0 ? temp[0].comparison : ''
        if (Object.prototype.toString.call(comparison) === '[object String]') {
          comparison = comparison.split(',')[0]
        } else {
          comparison = comparison[0]
        }
        return comparison
      },
      getSqlSeg(property) {
        /*通过列属性，找到当前列json配置中sqlSeg信息*/
        let temp = this.paramJson.filter((v) => {
          return v.nameCode == property
        })
        let sqlSeg = temp.length > 0 ? temp[0].sqlSeg : ''
        return sqlSeg
      },
      AdvanceSearch() {
        let sc = [];
        this.paramJson.forEach(item => {
          if (this.search[item.nameCode]) {
            item.isSpecial ? this.search[item.nameCode]['isSpecial'] = item.isSpecial : null;
            if (this.search[item.nameCode].value != "") {
              sc.push(this.search[item.nameCode]);
            }
          }
        })
        this.page = 1;
        this.sc = JSON.stringify(sc);
        //this.orderProperty = data.sortBy;
        //this.orderType = data.order;
        this.fuzzySearch = 1;
        this.getTableList();
      },
      EmptyCondition() {
        for (let p in  this.setEmpty) {
          this.setEmpty[p]();
          this.search[p].value = "";
        }
      },
      //详情页面
      handleEdit(rowInfo) {
        this.edit = rowInfo || {}
      },
      getTableLinkList() {
        ajaxRequest('get', 'back/billTicket/getBillLinkedTicket', {
          billId: this.data.id,
        }, function (res) {
          if (res.code === 200) {
            this.tableDataLink = res.rows;
          }
        }.bind(this))
      },
      handleCancel() {
        this.callback();
      },
      testC(val) {
        console.log(this.multipleSelection)
      },
      handleSubmit() {
        let _this = this;
        let total = 0;
        this.multipleSelection.forEach(function(d, i) {
          total +=d.useMoney;
        });
        if (parseFloat(this.billMoney) < total) {
          this.$message.error('关联金额大于缴费单金额');
          return;
        }
        ajaxRequest('post', 'back/billTicket/insertBillTicketLinkByBatch', {
          json: JSON.stringify(this.multipleSelection),
          billId: this.data.id
        }, (res) => {
          _this.callback(res);
        })

      },
    },
    components: {},
    created() {
      this.userId = localStorage.getItem('userId')
      this.paramJson.forEach((v) => {
        v.isQueryResult == 1 ? this.resultCondition.push(v) : null;
      })
      let param = [].concat(this.paramJson), headObj = {};
      param.forEach(v => v.isTableDefault == 1 ? headObj[v.nameCode] = true : null);
      this.headObj = headObj;
    },
    mounted() {
      this.getTableList();
      this.calcTableHeight();
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
</style>
