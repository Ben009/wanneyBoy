<template>
  <div class="SoutRecord">
    <!-- 高级检索搜索框 start -->
    <!--<div style="margin-bottom:10px;"  v-if="defaultOpen">-->
      <!--<Retrieve  ref="retrieve-wapper"-->
                <!--:rowsCondition='rowsCondition'-->
                <!--:sortBy="sortBy"-->
                <!--:order="order"-->
                <!--:paramJson="paramJson"-->
                <!--:retrieveCondition="retrieveCondition"/>-->
    <!--</div>-->
    <!-- 高级检索搜索框 end -->

    <!-- 个性化设置 start -->
    <!--<div style="display: flex;justify-content: space-between;margin-bottom:10px;">-->
      <!--<div style="width:240px">-->
      <!--</div>-->
      <!--<div style="display: inline-block;text-align: center">-->
        <!--<el-button type="primary" round @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>-->
        <!--<el-button type="warning" round @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空</el-button>-->
      <!--</div>-->
      <!--<span style="float: right">-->
        <!--<el-select size="mini" v-if="resultCondition.length" v-model="templateValue"  placeholder="请选择" @change="QJHandleSelectTemplate">-->
          <!--<el-option-->
            <!--v-for="item in moduleList"-->
            <!--:key="item.name"-->
            <!--:label="item.name"-->
            <!--:value="item.name">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <!--<el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>-->
        <!--<WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>-->
      <!--</span>-->
    <!--</div>-->
    <!-- 个性化设置 end -->

    <!-- 表格 start -->
  <el-form>
    <el-row>
      <el-col :span="5" :offset="13">
        <el-form-item prop="dateBegin" label="开始日期" label-width="100px">
          <el-date-picker
            v-model="dateBegin"
            :editable="false"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            style="width:230px;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item prop="dateEnd" label="结束日期" label-width="100px">
          <el-date-picker
            v-model="dateEnd"
            :editable="false"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            :picker-options="{disabledDate:dateLimit}"
            style="width:230px;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-button type="primary" @click="search" style="position: relative;top: 7px;">查询</el-button>
    </el-row>
  </el-form>
    <div class="MStandardList-table">
      <el-table :max-height="QJTableMaxHeight"
        :data="recordList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <!--<el-table-column-->
          <!--v-if="headObj.standardName"-->
          <!--prop="standardName"-->
          <!--show-overflow-tooltip-->
          <!--label="计量标准名称">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.code"-->
          <!--prop="code"-->
          <!--show-overflow-tooltip-->
          <!--label="代码">-->
        <!--</el-table-column-->
          <!--v-if="headObj.code">-->
        <!--<el-table-column-->
          <!--v-if="headObj.department"-->
          <!--prop="department"-->
          <!--show-overflow-tooltip-->
          <!--:formatter="formatDepart"-->
          <!--label="维护部门">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.zsbh"-->
          <!--prop="zsbh"-->
          <!--show-overflow-tooltip-->
          <!--label="证书编号">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.ysjlBh"-->
          <!--prop="ysjlBh"-->
          <!--show-overflow-tooltip-->
          <!--label="原始记录编号">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.zsUserName"-->
          <!--prop="zsUserName"-->
          <!--show-overflow-tooltip-->
          <!--label="使用人">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="zsJdrq"-->
          <!--show-overflow-tooltip-->
          <!--:formatter="dealDate"-->
          <!--label="使用日期">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="socCerNo"-->
          <!--show-overflow-tooltip-->
          <!--label="社会公用证书号">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.standardProp"-->
          <!--prop="standardProp"-->
          <!--show-overflow-tooltip-->
          <!--:formatter="formatStandardProp"-->
          <!--label="标准性质">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.standardReleaseDate"-->
          <!--prop="standardReleaseDate"-->
          <!--show-overflow-tooltip-->
          <!--:formatter="dealDate"-->
          <!--label="计量标准发证日期">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.standardValidDate"-->
          <!--prop="standardValidDate"-->
          <!--show-overflow-tooltip-->
          <!--:formatter="dealDate"-->
          <!--label="计量标准有效期">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.socReleaseDate"-->
          <!--prop="socReleaseDate"-->
          <!--show-overflow-tooltip-->
          <!--:formatter="dealDate"-->
          <!--label="社会公用证书发证日期">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.remark"-->
          <!--prop="remark"-->
          <!--show-overflow-tooltip-->
          <!--label="备注">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.responsibleUser"-->
          <!--prop="responsibleUser"-->
          <!--show-overflow-tooltip-->
          <!--label="负责人">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.chiefExaminer"-->
          <!--prop="chiefExaminer"-->
          <!--show-overflow-tooltip-->
          <!--label="主持考核单位">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.takeExaminer"-->
          <!--prop="takeExaminer"-->
          <!--show-overflow-tooltip-->
          <!--label="承担考核单位">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.isSafekeeping"-->
          <!--prop="isSafekeeping"-->
          <!--show-overflow-tooltip-->
          <!--label="是否封存">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.isSafekeeping"-->
          <!--prop="isSafekeeping"-->
          <!--show-overflow-tooltip-->
          <!--label="计量标准名称（英文）">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.approvalAuth"-->
          <!--prop="approvalAuth"-->
          <!--show-overflow-tooltip-->
          <!--label="批准机关">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.auditingResult"-->
          <!--prop="auditingResult"-->
          <!--:formatter="formatAduit"-->
          <!--show-overflow-tooltip-->
          <!--label="审核结果">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.totalVal"-->
          <!--prop="totalVal"-->
          <!--show-overflow-tooltip-->
          <!--label="总价值">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.classAccuracy"-->
          <!--prop="classAccuracy"-->
          <!--show-overflow-tooltip-->
          <!--label="准确度等级">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.classAccuracyE"-->
          <!--prop="classAccuracyE"-->
          <!--show-overflow-tooltip-->
          <!--label="准确度等级（英文）">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.measuringRange"-->
          <!--prop="measuringRange"-->
          <!--show-overflow-tooltip-->
          <!--label="测量范围">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--v-if="headObj.measuringRangeE"-->
          <!--prop="measuringRangeE"-->
          <!--show-overflow-tooltip-->
          <!--label="测量范围（英文）">-->
        <!--</el-table-column>-->
        <el-table-column prop="zsJdrq" label="证书使用日期（检定日期）" :formatter="dealDate" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zsUser" label="证书使用人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jddd" label="检定地点" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zsbh" label="证书编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="beforeStatus" label="使用前状态" :formatter="formatAduit" show-overflow-tooltip></el-table-column>
        <el-table-column prop="afterStatus" label="使用后状态"  :formatter="formatAduit" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="检定员电子签名地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-edit-outline" title="详情"></i>
              </el-button>
              <el-button  v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,scope.row)}" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-delete" title="删除"></i>
              </el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格 end -->
    <div style="margin-top:10px;text-align:center; float:right;">
       <mind-pagination
        :current-page="page"
        :page-size="rows"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange">
      </mind-pagination>
    </div>
    <sout-record-dialog v-if="detailInfo" :data="detailInfo" @back="back"></sout-record-dialog>
  </div>
</template>

<script>
  import $ from 'jquery';
  import Retrieve from '../../Retrieve'; // 高级检索
  import WorkMould from '../../mould/WorkMould'; // 高级检索弹出框
  import RetrieveConfig from './RetrieveConfig/recordRetrieveConfig'; // 高级检索配置项
  import TableColumnHeader from '../../Table/TableColumnHeader'; // 表格头部
  import soutRecordDialog from './standardFormComp/dialog/soutRecordDialog.vue'
  import {ajaxRequest} from '../../util/base'
  export default {
    name: "SoutRecord",
    data(){
      return {
        /************************************* 高级检索字段 start *************************************/
        fuzzySearch:0,
        isSetting: 0, //控制个性化设置弹窗是否展示
        rowsCondition: RetrieveConfig, //默认同目录下json数据 会依据模板改变
        paramJson: RetrieveConfig, //同目录下json数据 常量
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
        /************************************* 高级检索字段 end *************************************/

        /************************************* 表格字段开始 start *************************************/
        page: 1,
        rows: 10,
        total: 0,
        recordList: [],
       //detailInfo 查看信息时带入的信息
        detailInfo: null,
        // 查询的时间
        dateBegin:null,
        dateEnd:null,
      }
    },
    computed:{
      departlist(){
        return this.$store.state.Mstandard.departlist
      },
      currentStandardId(){
        return this.$store.state.Mstandard.currentStandardId
      },
    },
    watch:{
      currentStandardId() {
        if(this.currentStandardId){
          this.getTableList()
        }
      }
    },
    methods: {
      /***********************************************  表格方法 start  *********************************************/
      /**
       * [getTableList 获取所有的计量标准列表]
       * @return {[type]} [description]
       */
      getTableList(){
        let routerApi = this.searchKey || this.fuzzySearch === 1 ? 'getRetrieveRecordList' : 'getRecordList'
        this.$store.dispatch( 'getRetrieveRecordList' ,{
          // fuzzySearch: this.searchKey || this.fuzzySearch === 1 ? 1 : null,
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          stId: this.currentStandardId,
          total:0,
          isDelete:0,
          sc: this.sc,
          beginDate:this.dateBegin,
          endDate:this.dateEnd,
        }).then(res => {
          this.total = res.total
          this.recordList = res.rows
        })
      },
      /**
       * [dealDate 格式化显示时间]
       * @param  {[type]} row       [description]
       * @param  {[type]} column    [description]
       * @param  {[type]} cellValue [description]
       * @return {[type]}           [description]
       */
      dealDate(row, column, cellValue){
        if(cellValue){
          return new Date(cellValue).format('YYYY-MM-DD')
        }
      },
      /**
       * [formatDepart 格式化显示部门]
       * @param  {[type]} row       [description]
       * @param  {[type]} column    [description]
       * @param  {[type]} cellValue [description]
       * @return {[type]}           [description]
       */
      formatDepart(row, column, cellValue){
        if(cellValue){
          for(let key of this.departlist){
            if(key.id == cellValue){
              return key.departName
            }
          }
        }
      },
      /**
       * [formatAduit 格式化显示审核状态]
       * @param  {[type]} row       [description]
       * @param  {[type]} column    [description]
       * @param  {[type]} cellValue [description]
       * @return {[type]}           [description]
       */
    formatAduit(row, column, cellValue){
      let result = {0:'正常',1:'不正常'}
      return result[cellValue]
    },
    /**
       * [getDepartList 获取部门列表]
       * @return {[type]} [description]
       */
      getDepartList() {
        this.$store.dispatch('getDepartList')
      },
      handlePageSizeChange (size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList()
      },
      handleCurrentPageChange (currentPage) {
        this.page = currentPage
        this.getTableList()
      },
      /***********************************************  表格方法 end  *********************************************/
      /*********************************************** 表格数据格式化集合 ********************************************/
      formatStandardProp(row, column, cellValue){
        let result = {0:'高标',1:'次标'}
        return result[cellValue]
      },
      /*********************************************** 表格数据格式化集合 ********************************************/
      // 异步编程管理
      async asyncInitFunction(){
        await Promise.all([this.getDepartList(),this.QJGetMounted()])
      },
      handleEdit (rowInfo) {
        this.detailInfo = rowInfo ;
      },
      handleDelete (rowInfo) {
        rowInfo.isDelete = 1
        ajaxRequest('put','back/mStandard/updateMStandardRecord',rowInfo,res=>{
          if(res.code === 200){
            this.$message.success('删除成功！')
            this.getTableList();
          }
        })
      },
      // 返回的操作
      back(){
        this.detailInfo = null;
        this.getTableList();
      },
      dateLimit(time){
        if(this.dateBegin){
          return new Date(this.dateBegin).getTime() > time.getTime()
        }else {
          return false
        }
      },
      search(){
        this.getTableList();
      }
    },
    components:{
      Retrieve,
      WorkMould,
      TableColumnHeader,
      soutRecordDialog
    },
    mounted() {
      this.asyncInitFunction()
    }
  }
</script>

<style scoped lang="scss">
  .SoutRecord{
    .flex-one{
      flex:1
    }
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
</style>
