<template>
  <div style="position:relative;">

    <div style="margin-bottom:10px;"	v-if="defaultOpen">
      <Retrieve  ref="retrieve-wapper"
                 :rowsCondition='rowsCondition'
                 :sortBy="sortBy"
                 :order="order"
                 :paramJson="paramJson"
                 :retrieveCondition="retrieveCondition"
                 :collectionInfo="collectionInfo"
      />
    </div>
    <div style="margin-top:10px; margin-bottom:10px;">
      <div style="display: flex;justify-content: space-between;">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增预开票</el-button>
        <div style="display: inline-block;text-align: center">
          <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
          <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning" >&nbsp;清空</el-button>
        </div>
        <span style="float:right;">
          <div>
             <el-select size="mini" v-if="resultCondition.length" v-model="templateValue"  placeholder="请选择" @change="QJHandleSelectTemplate">
              <el-option
                v-for="item in moduleList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
            <div class="el-icon-info shuoming" >
            <el-row class="el-sm">
              <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">事项说明</p>
              <dl style="padding:6px 10px; ">
                <p>1、预开发票指：先开具发票后回款；</p>
                <p>2、系统支持通过缴费单预开票、未发生业务预开票两种模式。缴费单预开票需通过缴费单明确界面发起申请，“新增预开票”用于申请无业务预开；针对无业务预开票，当到款后将转入挂账查询节点，待后续业务发生后从该记录抵扣费用；</p>
                <p>3、状态涉及：待审核（申请成功后需审核）、审核通过、退回（未通过审核）、已到款（预开发票后款项已到）、取消（取消该申请）；</p>
              </dl>
            </el-row>
          </div>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
            </div>
         </span>
      </div>
    </div>
    <div v-show="!isSetting">
      <div>
        <div style="padding-top: 5px;text-align: center">
          合计金额：<span style="color: red;font-weight: bold;font-size: 16px;">{{totalMoney}}</span>
        </div>
        <el-table :max-height="QJTableMaxHeight"
          :data="tableData"
          border
          style="width: 100%"
          @sort-change="handleSort"
          @selection-change="handleSelectionChange"
          v-loading="loading">
          <el-table-column v-if="headObj.ticketCompany" prop="ticketCompany" label="开票单位"></el-table-column>
          <el-table-column v-if="headObj.billNo" prop="billNo" label="缴费单编号"></el-table-column>
          <el-table-column v-if="headObj.ticketMoney" prop="ticketMoney" label="开票金额"></el-table-column>
          <el-table-column v-if="headObj.paybackPeriods" prop="paybackPeriods" label="回款周期" :formatter="handleDate"></el-table-column>
          <el-table-column v-if="headObj.departName" prop="departName" label="开票部门"></el-table-column>
          <el-table-column v-if="headObj.userName" prop="userName" label="申请人"></el-table-column>
          <el-table-column v-if="headObj.status" prop="status" label="状态" :formatter="function(row, column, cellValue, index){return cellValue==0?'待审核':cellValue==1?'审核通过':cellValue==2?'已开票':cellValue==3?'已到款':cellValue==-1?'退回':'取消'}"></el-table-column>
          <el-table-column label="操作" min-width="60">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-search" title="编辑"></i></el-button>
          <!--    <el-button @click="handleDelete([scope.row])" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-delete" title="删除"></i></el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <div style="padding-top: 5px;text-align: center">
          合计金额：<span style="color: red;font-weight: bold;font-size: 16px;">{{totalMoney}}</span>
        </div>
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
      <ticketApplyForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></ticketApplyForm>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import {ajaxRequest, formatArrayToTree, ajaxProxyRequest} from '../../util/base';
  import Retrieve from '../../Retrieve';
  import WorkMould from '../../mould/WorkMould';
  import TableColumnHeader from '../../Table/TableColumnHeader';
  import ticketApplyForm from './ticketApplyForm';
  import paramJson from './apply'    //同目录下json数据

  export default {
    name: "parameter-table",
    data(){
      return{
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 't.id',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 0,

        isSetting: 0,  //控制个性化设置弹窗是否展示
        edit: null,   //控制编辑弹窗是否展示
        isInner: 0,

        /*高级检索相关项*/
        rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
        paramJson: paramJson, //同目录下json数据 常量
        moduleList: [], //模板列表
        templateValue: "", //当前选择的模板id
        sortBy: "", //排序字段
        order: "", //desc降序 asc升序
        headObj: {}, //表头显示对象 {category:true}
        defaultOpen: true, //默认开启高级查询

        userId: "",
        allModules: {}, //所有模板
        resultCondition: [],
        retrieveCondition: [],
        collectionInfo: [],
        loading:false,
        totalMoney: 0,//预开票总金额
      }
    },
    methods:{
      handleSort: function(column, prop, order){
        this.orderProperty = column['prop'];
        if(column['order'] == 'descending'){
          this.orderType='desc';
        }else{
          this.orderType = 'asc';
        }
        this.getTableList();
      },
      handleSearch (column, value) {
        /*表格头部检索回调 获取当前列检索信息回显高级搜索组件
        * comparison 默认显示第一条比较项
        * column.property 列英文名称
        * value 检索值
        * sqlSeg 列sqlSeg信息*/
        var comparison = this.getComparison(column.property)
        var sqlSeg = this.getSqlSeg(column.property)
        this.$refs['retrieve-wapper'].insertRetrieveItem(0, column.property, comparison, value, sqlSeg)
      },
      advanceSearch:function(data){
        this.sc = JSON.stringify(data.conditions);
        this.orderProperty = data.sortBy;
        this.orderType = data.order;
        this.fuzzySearch = 1;
        this.getTableList();
      },
      getComparison (property) {
        /*通过列属性，找到当前列json配置中第一个比较项*/
        let temp = paramJson.filter((v) => {return v.nameCode == property})
        let comparison = temp.length > 0 ? temp[0].comparison : ''
        if (Object.prototype.toString.call(comparison) === '[object String]') {
          comparison = comparison.split(',')[0]
        } else {
          comparison = comparison[0]
        }
        return comparison
      },
      getSqlSeg (property) {
        /*通过列属性，找到当前列json配置中sqlSeg信息*/
        let temp = paramJson.filter((v) => {return v.nameCode == property})
        let sqlSeg = temp.length > 0 ? temp[0].sqlSeg : ''
        return sqlSeg
      },
      renderHeader (createElement, {column, $index}) {
        let label = column.label;
        let labelArr = label.split(' ');
        return createElement(
          'font',
          [
            labelArr[0],createElement('br'),
            labelArr[1] || ''
          ]
        );
      },
      //个性化设置
      personalSetting (flag) {
        /*控制显示个性化设置的弹窗 isSetting 默认false*/
        this.isSetting = flag
        !flag ? this.getTemplate() : null
      },
      //获取预开票申请列表
      getTableList(){
        this.loading=true
        if(this.searchKey || this.fuzzySearch === 1){
          ajaxRequest('get','back/ticketApply/retrieve',{
            fuzzySearch:1,
            page:this.page,
            rows:this.rows,
            orderProperty:this.orderProperty,
            orderType:this.orderType,
            total:0,
            sc:this.sc
          },(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
              this.totalMoney = res.map.TICKET_MONEY;
              this.multipleSelection=[];
            }
            this.loading=false;
          })
        }
        else{
          ajaxRequest('get','back/ticketApply/retrieve',{
            page:this.page,
            rows:this.rows,
            orderProperty:this.orderProperty,
            orderType:this.orderType,
            total:0
          },function(res){
            if(res.code===200){
              this.tableData=res.rows;
              this.total=res.total;
              this.totalMoney = res.map.TICKET_MONEY;
              this.multipleSelection=[];
            }
            this.loading=false;
          }.bind(this))
        }
      },
      handleToggleTheme(color) {
        this.$store.commit('toggleTheme', color)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //每页显示条数切换加载数据
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      //页码切换加载数据
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getTableList();
      },
      //详情页面
      handleEdit(rowInfo){
        this.edit = rowInfo || {}
      },
      handleSelectTemplate (value) {
        ajaxRequest('get', 'back/settingTemplate/list', {id: value}, (res) => {
          if (res.code == 200) {
            var temp = res.rows[0]
            this.recoverRetrieve(temp)
          }
        })
      },
      getTemplate () {
        /*获取到当前菜单下模板列表*/
        ajaxRequest('get', 'back/settingTemplate/list', {userId: 1, moduleType: 1, isDelete: 0}, (res) => {
          if (res.code == 200) {
            this.moduleList = res.rows
            /*个性化设置完成后需通过templateValue刷新当前模板*/
            var temp = res.rows.filter((v) => {return v.id == this.templateValue})
            if (temp.length > 0) {
              this.recoverRetrieve(temp[0])
            } else {
              this.templateValue = ''
              this.recoverRetrieve({})
            }
          }
        })
      },
      recoverRetrieve (temp) {
        /*模板信息回显高级搜索组件 模板具体内容放在json格式的content字段里*/
        if (!$.isEmptyObject(temp)) {
          let headObj = {}
          let info = temp.content ? JSON.parse(temp.content) : []

          this.rowsCondition = info.conditions
          this.sortBy = info.sortBy
          this.order = info.order
          if (info.headList) {
            for (let i = 0, len = info.headList.length; i < len; i++) {
              headObj[info.headList[i]] = true
            }
          }
          this.headObj = headObj
          this.defaultOpen = info.defaultOpen
        }
      },
      handleSelectTemplate (value) {
        ajaxRequest('get', 'back/settingTemplate/list', {id: value}, (res) => {
          if (res.code == 200) {
            var temp = res.rows[0]
            this.recoverRetrieve(temp)
          }
        })
      },
      defaultShowAllCol () {
        let param = [].concat(this.paramJson), headObj = {}
        param.forEach(v => v.isDefault == 1 ? headObj[v.nameCode] = true : null)

        this.headObj = headObj
      },
      getRetrieveHeader (){
        ajaxRequest('get','back/dictEntry/list/',{dictTypeId:13},function(res){
          if(res.code===200){
            var rows = res.rows;
            if(rows != null && rows.length > 0){
              for(var i = 0 ; i < rows.length; i ++){
                rows[i].title = rows[i].name;
                rows[i].name = rows[i].dictCode;
                if(rows[i].memo != null && rows[i].memo.length > 0) {
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
                rows[i].type=0;

              }
            }
            this.$refs['retrieve-wapper'].refreshSearchCondition(rows);
          }
        });
      },
      //预开票申请回调函数
      handleEditCallback(){
          this.edit=null;
          this.getTableList();
      },
      //日期处理
      handleDate: function (row, column, cellValue) {
        if(cellValue != null && cellValue != "") {
          return new Date(cellValue).format('YYYY-MM-DD');
        }
      },
      //删除预开票  此方法作废
      handleDelete (data) {
         let ids = data.map(function (v) {
           return v.id
         }).join(',')
         ajaxRequest('post', 'back/ticketApply/list/' + ids, {_method: 'delete'}, function (res) {
           if (res.code === 200) {
             this.$message.success('删除成功');
             this.getTableList();
           } else {
             this.$message.error('删除失败');
           }
         }.bind(this))
      },
    },
    components:{
      WorkMould,
      TableColumnHeader,
      Retrieve,
      ticketApplyForm
    },
    mounted() {
      this.getTableList();
      this.defaultShowAllCol();
      this.QJGetMounted();
    }
  }
</script>

<style scoped>

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

  .el-sm{background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 1px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -302px;
    word-break: break-all;
    margin-top: 18px;
    padding: 4px 5px;width:320px;
    font-size: 14px;
    opacity: 50;
    float: right; -webkit-transition: all 0.8s;transition: all 0.8s;}

  .shuoming .el-sm{
    display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
  }
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
  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }
  .el-icon-setting:hover {
    color: #3094e0 !important;
  }
</style>
