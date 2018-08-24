<template>
<div>
  <div v-if="!standardId">
    <div style="display:inline-block;float:right;">
        <global-tootips>
          <p>１、本页面用语所有计量标准审核记录；</p>
          <p>２、若未审核通过，可进行修改后再次发起；</p>
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
  </div>
  <m-standard-form v-if="standardId" :standardId="standardId" @goBack="back" :isAdd="false"></m-standard-form>
</div>
</template>
<script type="text/javascript">
import MStandardForm from '.././MStandardForm'
	export default {
		name: 'certificateTable',
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
        //查看详情
        standardId:null,
			}
    },
    components:{
      MStandardForm,
    },
    computed:{
      standardAduitList(){
        return this.$store.state.Mstandard.standardaduitlist
      },
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
        let params = {
          page: this.page,
          rows: this.rows,
          total:0,
          isDelete:0,
        };
        this.slug == 'audit' ? params['audTingResult'] = 0 : params['audTingResult'] = 2
        this.$store.dispatch('getStandardAduitList',params).then(res => {
          this.total = res.total
        })
      },
      // 组件返回
      back(){
        this.standardId = null;
        this.getTableList();
      },
			// 异步编程管理
			async asyncInitFunction(){
				await Promise.all([this.getTableList()])
			}
		},
		mounted(){
			this.asyncInitFunction()
		}
	}
</script>
<style type="text/css" lang="scss">

</style>