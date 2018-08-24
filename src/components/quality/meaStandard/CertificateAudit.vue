<template>
<div>
	<div class="certificateAduit" v-if="!standardId">
    <div style="float:right;margin-bottom:10px;">
      <span style="color:#606266;">计量标准名称:</span>
      <el-input placeholder="请输入计量标准名称" v-focusSelect v-model="searchName" style="width:200px;position: relative;top: 2px;"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="getTableList">查询</el-button>
      <global-tootips>
        <p>1.有权限人员查询所有记录，无权限仅可查询本部门记录;</p>
        <p>2.本页面功能主要为计量标准需的审核功能；您可在添加、查询明细中发起计量标准的审核功能，由维护部门有权限人员进行审核;</p>
      </global-tootips>
    </div>
    <div class="certificateAduit">
      <el-table :max-height="QJTableMaxHeight"
        :data="standardAduitList"
        border
        >
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column

          prop="standardName"
          show-overflow-tooltip
          label="计量标准名称">
        </el-table-column>
        <el-table-column
          prop="standardCerNo"
          show-overflow-tooltip
          label="计量标准证书号">
        </el-table-column>
        <el-table-column
          prop="responsibleUserName"
          show-overflow-tooltip
          label="负责人">
        </el-table-column>
        <el-table-column
          prop="addUserName"
          show-overflow-tooltip
          label="发起人">
        </el-table-column>
        <el-table-column
          prop="addTime"
          :formatter="dealDate"
          show-overflow-tooltip
          label="发起时间">
        </el-table-column>
        <el-table-column
          prop="standardProp"
          show-overflow-tooltip
          :formatter="formatSrandard"
          label="标准性质">
        </el-table-column>
        <el-table-column
          prop="standardReleaseDate"
          show-overflow-tooltip
          :formatter="dealDate"
          label="计量标准发证日期">
        </el-table-column>
        <el-table-column
          prop="standardValidDate"
          show-overflow-tooltip
          :formatter="dealDate"
          label="计量标准有效期">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="操作"
          width="60px">
          <template slot-scope="scope">
            <el-button  @click="handleview(scope.row)" type="text" style="padding:0;font-size:18px;">
              <i class="el-icon-edit-outline" title="审核"></i>
            </el-button>
            <!-- <el-button v-else @click="handleReview(scope.row)" type="text" style="padding:0;font-size:18px;">
              <i class="el-icon-edit-outline" title="详细"></i>
            </el-button> -->
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
	</div>
  <m-standard-form v-if="standardId" :standardId="standardId" @goBack="back" :isAdd="false"></m-standard-form>
</div>
</template>
<script type="text/javascript">
  // import certificateTable from './certificateTableComp/certificateTable'
  import MStandardForm from './MStandardForm'
	export default {
		name: 'certificateAduit',
		data(){
			return {
        searchName:'',
        	page: 1,
        rows: 10,
        total: 0,
        // 证书审核详情
        standardId:null,
			}
    },
    computed:{
      standardAduitList(){
        return this.$store.state.Mstandard.standardaduitlist
      },
    },
    mounted(){
      this.asyncInitFunction()
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
      },
      back(){
        this.standardId = null;
        this.getTableList();
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
        let params = {
          page: this.page,
          rows: this.rows,
          total:0,
          isDelete:0,
          standardName:this.searchName,
          audTingResult:0,
          fuzzySearch: 1,
        };
        this.$store.dispatch('getStandardAduitList',params).then(res => {
          this.total = res.total
        })
      },
			// 异步编程管理
			async asyncInitFunction(){
				await Promise.all([this.getTableList()])
			}
		},
		components:{
      // certificateTable
      MStandardForm
		}
	}
</script>
<style type="text/css" scoped lang="scss">
	  .shuoming{border: none!important;color:#56BC4E!important;float:right;margin-bottom:5px;font-size:16px!important;cursor: pointer;}
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
      margin-left: -300px;
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