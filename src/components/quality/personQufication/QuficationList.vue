<template>
  <div style="position:relative;">
    <div>
      <div>
        <Retrieve  ref="retrieve-wapper"
                   :rowsCondition='rowsCondition'
                   :sortBy="sortBy"
                   :order="order"
                   :paramJson="paramJson"
                   :retrieveCondition="retrieveCondition"
                   :collectionInfo="collectionInfo"
                   />
        <div>
        <!--<div style="display: flex;justify-content: space-between; margin:10px 0px;">-->
          <div style="display: flex;justify-content: space-between;text-align: center">
            <span></span>
            <div style="display: inline-block;text-align: center">
              <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
              <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning" >&nbsp;清空</el-button>
            </div>
              <span style="margin-bottom:5px;text-align: right">
                <el-select  size="mini" v-model="templateValue" v-if="resultCondition.length" placeholder="请选择" @change="QJHandleSelectTemplate">
                  <el-option
                    v-for="item in moduleList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>

                <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>

                 <div style="display:inline-block">
                    <global-tootips style="float: right;text-align: left">
                    <p>1.无权限用户只能查看本人申报资质。</p>
                    <p>2.资质审核之后不可直接进行修改、删除，若想修改，请先撤销审核。</p>
                    <p>3.系统只允许申报者本人或者有权限的用户删除资质申报。</p>
                    </global-tootips>
                </div>
              </span>
          </div>
      </div>
    <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
    <!--<div style="margin-bottom:5px;" v-show="!isSetting">-->
      <!--<Retrieve v-if="defaultOpen" ref="retrieve-wapper" :rowsCondition='rowsCondition' :sortBy="sortBy" :order="order" @toparentevent="advanceSearch"/>-->
    <!--</div>-->
    <!--<div style="margin-bottom:5px;text-align: right" v-show="isSetting">-->
      <!--<el-button type="primary" round @click="personalSetting(0)">返回</el-button>-->
    <!--</div>-->
    <!--<WorkMould v-if="isSetting" ref="workMould" :rowsCondition='rowsCondition' :callback="QJPersonalSetting"/>-->
        <div style="margin-top:10px;">
          <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%" @sort-change="handleSort" v-loading="loading">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column v-if="headObj.personName" prop="personName" label="姓名" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column v-if="headObj.education" prop="education" label="学历" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column v-if="headObj.certificateCategory" prop="certificateCategory" label="证件类别" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column v-if="headObj.certificateNo" prop="certificateNo" label="证件编号" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column v-if="headObj.certificateName" prop="certificateName" label="证件名称" :render-header="QJrenderHeader" ></el-table-column>
            <el-table-column v-if="headObj.certificateDate" prop="certificateDate" label="发证日期" :render-header="QJrenderHeader"  :formatter="dealDate"></el-table-column>
            <el-table-column v-if="headObj.certificateDepart" prop="certificateDepart" label="发证单位" :render-header="QJrenderHeader" ></el-table-column>
            <el-table-column prop="status" label="状态"  :render-header="QJrenderHeader" >
              <template slot-scope="scope">
                <span v-if="scope.row.status==0" @click='findNoAudi(scope.row)' style="cursor: pointer;color: red" >未审核</span>
                <span v-if="scope.row.status==1" >审核撤销</span>
                <span v-if="scope.row.status==2" >退回</span>
                <span v-if="scope.row.status==3" >已审核</span>
              </template>n
            </el-table-column>
            <el-table-column label="操作" min-width="200">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                  <i class="el-icon-edit-outline" title="编辑"></i>
                </el-button>
                <el-button v-if="scope.row.personId==creator || btnPower>=0" v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,[scope.row])}"  type="text" style="padding:0;font-size:18px;">
                  <i class="el-icon-delete" title="删除"></i>
                </el-button>
                <el-button v-if="scope.row.personId!=creator && btnPower<0"   type="text" style="padding:0;font-size:18px;" disabled>
                  <i class="el-icon-delete" title="删除"></i>
                </el-button>
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
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import {ajaxRequest} from '../../util/base'
  import Retrieve from '../../Retrieve'
  import $ from 'jquery'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import  quficationListParam from './quficationListParam'
  import paramJson from './personQuficate'    //同目录下json数据


  export default {
    name: 'quficationList',
    data () {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 'p.add_time',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 1,

        isSetting: 0,  //控制个性化设置弹窗是否展示
        edit: null,   //控制新增弹窗是否展示
        modify: null,   //控制修改弹窗是否展示
        isInner: 0,

        /*高级检索相关项*/
        rowsCondition: paramJson,   //默认同目录下json数据 会依据模板改变
        paramJson: paramJson,      //同目录下json数据 常量
        moduleList: [],           //模板列表
        templateValue: '',       //当前选择的模板id
        sortBy: '',              //排序字段
        order: '',              //desc降序 asc升序
        headObj: {},           //表头显示对象 {category:true}
        defaultOpen: true,

        creator:localStorage.getItem('userId'),
        btnPower:localStorage.getItem('btnPower').indexOf('@M26201@'),
        allModules: {}, //所有模板
        resultCondition: [],
        retrieveCondition: [],
        collectionInfo:[],
        loading:false,
      }
    },
    methods: {
      handleSort: function (column, prop, order) {
        this.orderProperty = column['prop']
        if (column['order'] === 'descending') {
          this.orderType = 'desc'
        } else {
          this.orderType = 'asc'
        }
        this.getTableList()
      },
//      handleSearch (column, value) {
//        /* 表格头部检索回调 获取当前列检索信息回显高级搜索组件
//          * comparison 默认显示第一条比较项
//          * column.property 列英文名称
//          * value 检索值
//          * sqlSeg 列sqlSeg信息 */
//        var comparison = this.getComparison(column.property)
//        var sqlSeg = this.getSqlSeg(column.property)
//        this.$refs['retrieve-wapper'].insertRetrieveItem(0, column.property, comparison, value, sqlSeg)
//      },
//      advanceSearch: function (data) {
//        this.sc = JSON.stringify(data.conditions)
//        this.orderProperty = data.sortBy
//        this.orderType = data.order
//        this.fuzzySearch = 1
//        this.getTableList()
//      },
//      getStatus(row, column, cellValue, index){
//        if(cellValue==0){
//          return '未审核';
//        } else  if(cellValue==1){
//          return '审核撤销';
//        } else  if(cellValue==2){
//          return '退回';
//        }else if(cellValue==3){
//          return '已审核';
//        }
//      },
//      getSqlSeg (property) {
//        /* 通过列属性，找到当前列json配置中sqlSeg信息 */
//        let temp = quficationListParam.filter((v) => { return v.nameCode == property })
//        let sqlSeg = temp.length > 0 ? temp[0].sqlSeg : ''
//        return sqlSeg
//      },
//      getComparison (property) {
//        /* 通过列属性，找到当前列json配置中第一个比较项 */
//        let temp = quficationListParam.filter((v) => { return v.nameCode == property })
//        let comparison = temp.length > 0 ? temp[0].comparison : ''
//        if (Object.prototype.toString.call(comparison) === '[object String]') {
//          comparison = comparison.split(',')[0]
//        } else {
//          comparison = comparison[0]
//        }
//        return comparison
//      },
//      renderHeader: function (h, { column, $index }) {
//        let property = column.property
//        let currentInfo = quficationListParam.filter((v) => { return v.nameCode == property })
//        // console.log('aaaa',currentInfo,'序号',$index)
//        return (
//          <TableColumnHeader key={$index + property} column={column} handleSearch={this.handleSearch.bind(this)}
//        currentInfo={currentInfo}/>
//      )
//      },
//      recoverRetrieve (temp) {
//        /* 模板信息回显高级搜索组件 模板具体内容放在json格式的content字段里 */
//        if (!$.isEmptyObject(temp)) {
//          let headObj = {}
//          let info = temp.content ? JSON.parse(temp.content) : []
//          this.rowsCondition = info.conditions
//          this.sortBy = info.sortBy
//          this.order = info.order
//          if (info.headList) {
//            for (let i = 0, len = info.headList.length; i < len; i++) {
//              headObj[info.headList[i]] = true
//            }
//          }
//          this.headObj = headObj
//          this.defaultOpen = info.defaultOpen
//        }
//      },
//      personalSetting (flag) {
//        /*控制显示个性化设置的弹窗 isSetting 默认false*/
//        this.isSetting = flag
//        !flag ? this.getTemplate() : null
//      },
//      getTemplate () {
//        /* 获取到当前菜单下模板列表 */
//        ajaxRequest('get', 'back/settingTemplate/list', {userId: 1, moduleType: "TecBasList", isDelete: 0}, (res) => {
//          if (res.code == 200) {
//            this.moduleList = res.rows
//            /* 个性化设置完成后需通过templateValue刷新当前模板 */
//            var temp = res.rows.filter((v) => { return v.id == this.templateValue })
//            if (temp.length > 0) {
//              this.recoverRetrieve(temp[0])
//            } else {
//              this.templateValue = ''
//              this.recoverRetrieve({})
//            }
//          }
//        })
//      },
      getTableList () {
        this.loading=true
        ajaxRequest('get', 'back/personQufication/retrieve', {
          fuzzySearch: 1,
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total: 0,
          sc: this.sc
        }, (res) => {
          if (res.code === 200) {
            this.tableData = res.rows
            this.total = res.total
            this.multipleSelection = []
          }
          this.loading=false
        })
      },
      handleToggleTheme (color) {
        this.$store.commit('toggleTheme', color)
      },
      handlePageSizeChange (size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size
        this.getTableList()
      },
      handleCurrentPageChange (currentPage) {
        this.page = currentPage
        this.getTableList()
      },
      defaultShowAllCol () {
        let param = [].concat(quficationListParam), headObj = {}
        param.forEach(v => v.isDefault == 1 ? headObj[v.nameCode] = true : null)
        this.headObj = headObj
      },
      //未审核
      findNoAudi(row){
        this.$router.push({
          path: '/admin/750',
          query: {personId:row.personId,id:row.id,status:row.status,type:1}
        })
      },
      //修改
      handleEdit (rowInfo) {
        this.$router.push({
          path: '/admin/750',
          query:{personId:rowInfo.personId,personName:rowInfo.personName,id:rowInfo.id,status:rowInfo.status,type:2,creator:rowInfo.personId}
        })
      },
      handleDelete: function (data) {

        if (data.length > 0) {
          let ids = data.map(function (v) {
            return v.id
          }).join(',');
//          this.$confirm('确认删除?', '提示', {
//            confirmButtonText: '确定',
//            cancelButtonText: '取消',
//            type: 'warning'
//          }).then(() => {
            ajaxRequest('PUT', 'back/personQufication/list/' + ids, {isDelete: 1}, (res) => {
              if (res.code == 200) {
                this.$message.success('删除成功')
                this.getTableList()
              } else {
                this.$message.error('删除失败')
              }
            })
//          })
        } else {
          this.$message.warning('请先选择要删除的数据')
        }
      },
      dealControlled (row, column) {
        let controlled = {0: '否', 1: '是'}
        return controlled[row.controlled]
      },
      dealDate: function (row, column, cellValue) {
        return new Date(cellValue).format('YYYY-MM-DD')
      },
//      handleSelectTemplate (value) {
//        ajaxRequest('get', 'back/settingTemplate/list', {id: value}, (res) => {
//          if (res.code == 200) {
//            var temp = res.rows[0]
//            this.recoverRetrieve(temp)
//          }
//        })
//      }
    },
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve
    },
    mounted () {
        //判断是否从首页跳转进来,并设置默认查询条件
        let objFromIndex = this.$route.query;
        if (objFromIndex && objFromIndex.title) {
            let now = new Date();
            now.setDate(now.getDate() + 90);
            this.collectionInfo = [{
                name: '',
                value: [{
                    comparison: "3",
                    nameCode: "effectiveDate",
                    sqlSeg: "project.PROJECT_EFECTIVE_DATE",
                    value: now.format("YYYY-MM-DD")
                }, {
                    logicalValue:0,
                    comparison: "1",
                    nameCode: "status",
                    sqlSeg: "p.STATUS",
                    value: 0
                }]
            }];
            setTimeout(res => {
                this.QJAdvanceSearch();
            }, 0)
        } else {
            this.getTableList();
            this.defaultShowAllCol();
            this.QJGetMounted;
        }

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
