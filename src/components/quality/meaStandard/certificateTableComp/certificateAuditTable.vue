<template>
<div>
	<div class="certificateAduit" v-if="!standardId">
    <div style="margin-bottom:10px;"  v-if="defaultOpen">
      <Retrieve  ref="retrieve-wapper"
                :rowsCondition='rowsCondition'
                :sortBy="sortBy"
                :order="order"
                :paramJson="paramJson"
                :retrieveCondition="retrieveCondition"
                 :collectionInfo="collectionInfo"/>
    </div>
    <div style="display: flex;justify-content: space-between;margin-bottom:10px;">
      <div :style="{width:resultCondition.length ? '240px' : '80px'}">
      </div>
      <div style="display: inline-block;text-align: center">
        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
        <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
      </div>
      <span style="float: right">
        <el-select size="mini" v-if="resultCondition.length" v-model="templateValue"  placeholder="请选择" @change="QJHandleSelectTemplate">
          <el-option
            v-for="item in moduleList"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
        <div style="display:inline-block;">
          <global-tootips>
            <p>１、本页面用语所有计量标准审核记录</p>
            <p>２、若未审核通过，可进行修改后再次发起；</p>
          </global-tootips>
        </div>
        <!-- <div class="el-icon-info  shuoming" >
          <el-row class="el-sm">
            <p>1.<span style="color:red">初次审核不通过的</span>审核结果标记为红色;</p>
          </el-row>
        </div> -->
        <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
      </span>
    </div>
		<el-table :max-height="QJTableMaxHeight"
      :data="standardAduitList"
      border
      v-loading="loading"
      >
      <el-table-column
          type="index"
          width="50"
          label="序号">
      </el-table-column>
      <el-table-column
        v-if="headObj.standardName"
        prop="standardName"
        show-overflow-tooltip
        :render-header="QJrenderHeader"
        label="计量标准名称">
        <template slot-scope="standardName">
            <span v-if="standardName.row.audTingResult!=2">{{standardName.row.standardName}}</span>
            <span v-else style="color:red;">{{standardName.row.standardName}} </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="headObj.standardCerNo"
        prop="standardCerNo"
        show-overflow-tooltip
        :render-header="QJrenderHeader"
        label="计量标准证书号">
      </el-table-column>
      <el-table-column
        v-if="headObj.standardProp"
        prop="standardProp"
        show-overflow-tooltip
        :render-header="QJrenderHeader"
        :formatter="formatSrandard"
        label="标准性质">
      </el-table-column>
      <el-table-column
        v-if="headObj.standardReleaseDate"
        prop="standardReleaseDate"
        show-overflow-tooltip
        :render-header="QJrenderHeader"
        :formatter="dealDate"
        label="计量标准发证日期">
      </el-table-column>
      <el-table-column
        v-if="headObj.standardValidDate"
        prop="standardValidDate"
        show-overflow-tooltip
        :render-header="QJrenderHeader"
        :formatter="dealDate"
        label="计量标准有效期">
      </el-table-column>
      <el-table-column
        v-if="headObj.audiTorName"
        prop="audiTorName"
        show-overflow-tooltip
        :render-header="QJrenderHeader"
        label="审核人">
      </el-table-column>
      <el-table-column
        v-if="headObj.audiTingTime"
        prop="audiTingTime"
        show-overflow-tooltip
        :render-header="QJrenderHeader"
        :formatter="formatAduitTime"
        label="审核时间">
      </el-table-column>
      <el-table-column
        v-if="headObj.audTingResult"
        prop="audTingResult"
        show-overflow-tooltip
        :render-header="QJrenderHeader"
        :formatter="formatAduit"
        label="审核结果">
        <template slot-scope="scope">
          <span :style="{color:scope.row.audTingResult == 2&&scope.row.isFinished==0 ? 'red' : ''}">{{formatAduit(scope.row.audTingResult)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="slug == 'audit'" @click="handleview(scope.row)" type="text" style="padding:0;font-size:18px;">
            <i class="el-icon-edit-outline" title="审核"></i>
          </el-button>
          <el-button v-else @click="handleReview(scope.row)" type="text" style="padding:0;font-size:18px;">
            <i class="el-icon-edit-outline" title="详细"></i>
          </el-button>
        </template>
      </el-table-column>
		</el-table>
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
  <m-standard-form v-if="standardId" :standardId="standardId" :isAdd="false" @goBack="back"></m-standard-form>
</div>
</template>
<script type="text/javascript">
  import Retrieve from '@/components/Retrieve'; // 高级检索
  import WorkMould from '@/components/mould/WorkMould'; // 高级检索弹出框
  import RetrieveConfig from '../RetrieveConfig/certificateAduitConfig'; // 高级检索配置项
  import TableColumnHeader from '@/components/Table/TableColumnHeader'; // 表格头部
  import MStandardForm from '.././MStandardForm'
	export default {
		name: 'certificateAuditTable',
    props:{
      slug:{
        require:true,
        type:String
      }
    },
		data(){
			return {
				page: 1,
        rows: 10,
        total: 0,

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
        collectionInfo:[],
        //详情页的信息
        standardId:null,
        loading:false
			}
		},
    computed:{
      standardAduitList(){
        return this.$store.state.Mstandard.standardaduitlist
      },
    },
    components:{
      Retrieve,
      WorkMould,
      TableColumnHeader,
      MStandardForm
    },
		methods:{
      handleview(rowInfo){
        this.$store.commit('SET_CERTIFICATE_ADUIT','view')
        this.$store.commit('SET_ADUIT_ID',rowInfo.id)
        this.standardId = rowInfo.stId
        // this.$router.push({
        //   path: '/admin/247',
        //   query: {
        //     id:rowInfo.stId
        //   }
        // })
      },
      handleReview(rowInfo){
        this.$store.commit('SET_CERTIFICATE_ADUIT','review')
        this.$store.commit('SET_ADUIT_ID',rowInfo.id)
        this.standardId = rowInfo.stId
        // this.$router.push({
        //   path: '/admin/247',
        //   query: {
        //     id:rowInfo.stId
        //   }
        // })
      },
      dealDate(row, column, cellValue){
        if(cellValue){
          return new Date(cellValue).format('YYYY-MM-DD')
        }
      },
      formatSrandard(row, column, cellValue){
        let temp = {0:'高标',1:'次标'}
        return temp[cellValue]
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
			getTableList(){
        this.loading=true
        let params = {
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total:0,
          isDelete:0,
          sc: this.sc
        };
        // this.slug == 'audit' ? params['audTingResult'] = 0 : params['audTingResult'] = 2
        this.$store.dispatch('getStandardAduitList',params).then(res => {
          this.total = res.total
          this.loading=false
        })
      },
      formatAduit(cellValue){
        let result = {0:'未审核',1:'通过',2:'未通过'}
        return result[cellValue]
      },
      formatAduitTime(cellValue){
        console.log(cellValue)
        if(cellValue.audiTingTime){
          return new Date(cellValue.audiTingTime).format('YYYY-MM-DD hh:mm:ss')
        }
      },
			// 异步编程管理
			async asyncInitFunction(){
				await Promise.all([this.getTableList(),this.QJGetMounted()])
      },
      back(){
        this.standardId = null;
        this.getTableList();
      }
		},
		mounted(){
			this.asyncInitFunction()
		}
	}
</script>
<style type="text/css" scoped lang="scss">
      .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;cursor: pointer;}
    .shuoming::after{
      content: "";
      /*background: #fff;*/
      position: absolute;
      z-index: 999;
      /* top: 0; */
      /* left: -65px; */
      right:10;

    }

    .el-sm{
      background: #ffffff;
      position: absolute;
      z-index: 999;
      -webkit-box-shadow: 1px 7px 33px -9px #969696;
      box-shadow: 1px 7px 33px -9px #969696;
      border: 1px solid #56bc4e8c;
      border-radius: 5px;
      color: dimgrey;
      margin-left: -230px;
      margin-right: 0px;
      word-break: break-all;
      margin-top: 5px;
      padding: 4px 5px;
      font-size: 14px;
      opacity: 50;
      float: right;
      -webkit-transition: all 0.8s;
      transition: all 0.8s;
    }
</style>
