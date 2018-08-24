  //现场要号
  <template>
    <el-row class="m-l-5">
      <el-col :sm="5">
        <div style="width:95%;">
        <el-form :inline="true" >
          <el-form-item >
            <el-select v-model="searchType"  style="width:120px">
              <el-option value="0" label="委托单编"></el-option>
              <el-option value="1" label="单位名称"></el-option>
              <el-option value="2" label="录入人"></el-option>
            </el-select>

          </el-form-item>

          <el-form-item >
            <el-input clearable  v-model="searchKey"  style="width:120px"></el-input>
          </el-form-item>

          <el-form-item >
            <el-button type="primary" size="mini" @click="search">查询</el-button>
          </el-form-item >

        </el-form>
        <el-row>
          <el-col>
            <el-table :data="tableData"  :max-height="QJTableMaxHeight">
              <el-table-column align='left'>
                <template slot-scope="scope" align="left">
                  <div @click="quoInfoClick(scope.row.id,scope.row.orderNo)" :class="{cursor:true,'current-row':planData && planData.orderNo == scope.row.orderNo }">
                    <p>{{scope.row.orderNo}}  </p>
                    <p>{{scope.row.compayName}}</p>
                    <p>{{scope.row.personName }} </p>
                    <p>{{scope.row.addTime | myCurrency}}</p>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <mind-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="rows"
              :total="total"
              :layout="layout" style="margin-left:80px; margin-top:10px;"
            >
            </mind-pagination>
          </el-col>
        </el-row>
        </div>
  </el-col>
      <Demo class="right  el-col el-col-24 el-col-sm-19"
           @reaload="reach"
             :quoInfo="quoInfo"
             :planData="planData"
             :planId="planId"
             :orderNo="orderNo"
             :planApplianceData="planApplianceData"
             :zhuihao="zhuihaoList"
             :page="page"
             :rows="rows"
             :searchType="searchType"
      >

      </Demo>
    </el-row>
  </template>


  <script>
    import Vue from "vue";
    import Vuex from "vuex";
      import Demo from "./EntrustXcYhForm.vue";
    import { ajaxRequest, ajaxSyncRequest,formatDate } from "../../util/base";

/*     import {
      Button,
      Table,
      TableColumn,
      Row,
      Col,
      Radio,
      RadioGroup
    } from "element--ui";
    Vue.use(Button);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Radio);
    Vue.use(RadioGroup); */

    export default {
      data() {
        return {
          searchType: "0",
          searchKey: "",
           layout:"prev,next,countpage,total",
          page: 1,
          rows: 10,
          total: 0,
          tableData: [],
          planId:"",
          planApplianceData:[],
          planData: {}, //器具信息
          orderNo:"",
          quoInfo: {}, //报价单编号 报价单附件 报价单备注\
          zhuihaoList:[],
          isFresh:[false,false],//刷新左边列表
        }
      },
      watch:{
        isFresh(n,o){
          console.log("======")
          // if(n.top&&n.bottom){
          //   console.log('----------------')
          // }
        }
      },
      methods:{
        //根据报价单编号联动右上 现场任务客户信息
        quoInfoClick(id,orderNo) {
          let paramter = {};
          this.planId=id;
          this.arrangeDates = [];
          this.planHour = "";
          this.desc = "";
          this.orderNo=orderNo;
          paramter["planId"]=this.planId;
          ajaxRequest("get", "back/planAppliance/findByPlanId", paramter, res => {
            if (res.code === 200) {
              this.planData = res.rows[0];
              console.log(this.planData);
              this.findByListZhuihao(this.planData.orderNo);
            }
          });
          paramter["orderNo"]=this.orderNo;
          ajaxRequest("get", "back/planAppliance/findByListQj", paramter, res => {
            if (res.code === 200) {
              this.planApplianceData =res.rows;
            }
          });
        },
        search() {
          let paramters = {
            total: 0
          };
          if(this.searchType!=''){
            paramters["searchType"]=this.searchType;
          }
          if (this.searchType == "0") {
            if (this.searchKey!='') {
              this.page=1;
              this.rows=10;
              paramters["page"]=this.page;
              paramters["rows"]=this.rows;
              paramters["searchVal"] = this.searchKey;
            }
          } else if (this.searchType == "1") {
            if (this.searchKey!='') {
              this.page=1;
              this.rows=10;
              paramters["page"]=this.page;
              paramters["rows"]=this.rows;
              paramters["searchVal"] = this.searchKey;
            }
          } else {
            if (this.searchKey!='') {
                this.page=1;
              this.rows=10;
              paramters["page"]=this.page;
              paramters["rows"]=this.rows;
              paramters["searchVal"] =this.searchKey;
            }
          }
          this.getTableData(paramters)
        },
        findByListZhuihao(orderNo){
          ajaxRequest(
            "POST",
            "back/entrustSjd/findByZhuihao",
            {
              orderNo: orderNo,
              source:"6"
            },
            res => {
              if (res.code == 200) {
                this.zhuihaoList = res.rows;
                if(res.rows.length == 0){
                  this.isFresh[0] = true;
                  if(this.isFresh[0]&& this.isFresh[1]){
                    this.getTableData();
                  }
                }else{
                  this.isFresh[0] = false;
                }
              }
            }
          )
        },
        getTableData(paramters) {
       paramters = paramters == null ? { page: this.page, rows: this.rows, total: 0,searchType:'0'} : paramters;
          ajaxRequest("post", "back/planAppliance/findByLeftXcYh", paramters, res => {
            if (res.code === 200) {
              this.tableData = res.rows;
              if (this.tableData.length > 0) {
                this.total = res.total;
                this.planData = this.tableData[0];
                      if(this.$route.params.obj !=null){
                  // this.$route.params.obj.planId,this.$route.params.obj.orderNo
                   this.getQuoInfo(this.$route.params.obj.planId)
                    this.getQjInfo(this.$route.params.obj.orderNo);
                    this.findByListZhuihao(this.$route.params.obj.orderNo);
                    this.planId=this.$route.params.obj.planId;
                    this.findByPlanId( this.planId);
                    this.page=this.$route.params.obj.page;
                    this.rows=this.$route.params.obj.rows;
                }else{
                    this.getQuoInfo(this.planData.id)
                     this.getQjInfo(this.planData.orderNo);
                     this.findByListZhuihao(this.planData.orderNo);
                    this.planId=this.planData.id;
                }
              
                // this.getQjInfo(this.planData.orderNo);
                // this.findByListZhuihao(this.planData.orderNo);
                this.orderNo=this.planData.orderNo;
              } else {
                this.planData = null;
                this.quoInfo = null;
              }
            }
          });
        },
        findByPlanId(planId){
          let paramters = {
            total: 0
          };
          paramters["planId"]=planId;
          ajaxRequest("get", "back/planAppliance/findByPlanId", paramters, res => {
            if (res.code === 200) {
              this.planData = res.rows[0];
              console.log(this.planData);
            }
          });
        },
        handleSizeChange(size) {
          this.page = 1;//Math.floor(this.page * this.rows / size);
          this.rows = size;
          this.getTableData(null);
        },
        handleCurrentChange(currentPage) {
          this.page = currentPage;
          this.getTableData(null);
        },
        dateFormatter(row, column) {
          return formatDate(row.addTime, "YYYY-MM-DD hh:mm:ss");
        },
        reach(orderNo){
          let paramters = {
            page: this.page,
            rows: this.rows,
            total: 0
          };
          paramters["searchType"]="0";
          console.log('--------------'+orderNo);
          this.getQjInfo(orderNo);
          this.findByPlanId(this.planId);
          this.findByListZhuihao(orderNo);
        },
        //根据报价单编号获取报价单 附件 备注
        getQuoInfo(quoId) {
          ajaxRequest(
            "get",
            "back/planAppliance/findByPlanId",
            {
              planId: quoId
            },
            res => {
              if (res.code === 200) {
                this.quoInfo = res.daoResult;
              }
            }
          );
        },
        getQjInfo(orderNo){
          ajaxRequest(
            "get",
            "back/planAppliance/findByListQj",
            {
              orderNo:orderNo
            },
            res => {
              if (res.code === 200) {
                this.planApplianceData = res.rows;
                if(res.rows.length == 0){
                  this.isFresh[1] = true;
                  if(this.isFresh[0] && this.isFresh[1]){
                    this.getTableData();
                  }
                }else{
                  this.isFresh[1] = false;
                }
              }
            }
          );
        },
      },
      components: {Demo},
      filters: {
        myCurrency(myInput) {
          return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
        },
      },
      created() {
        },
      mounted() {
        this.$nextTick(()=>{
          if(this.$route.params.obj && this.$route.params.obj.orderNo != undefined){
            console.log('================',this.$route.params)
             let paramters = {
            page: this.$route.params.obj.page,
            rows: this.$route.params.obj.rows,
           };
            this.planId=this.$route.params.obj.planId;
            // this.getTableData(paramters);
            //  this.reach(this.$route.params.obj.orderNo);
            this.getTableData(paramters);
            //  this.getQjInfo(this.$route.params.obj.orderNo);
            // this.findByListZhuihao(this.$route.params.obj.orderNo)
              //this.quoInfoClick(this.$route.params.obj.planId,this.$route.params.obj.orderNo);
          }
        })
        this.getTableData();
      }
    }
  </script>


  <style scoped>
    .m-b-10 {
      margin-bottom: 10px;
    }

    .m-b-20 {
      margin-bottom: 20px;
    }
    .inline {
      display: inline;
    }
    .m-r-10 {
      margin-right: 661px;
    }

    .m-f-10 {
      margin-left: 10px;
    }

    .m-t-10 {
      margin-top: 10px;
    }
    .m-l-10 {
      margin-left: 10px;
    }
    .m-l-5 {
      /*margin-left: 5px;*/
    }
    .font-blod {
      font-weight: bold;
    }
    .current-row{
      background-color: #f0f9eb; 
    }
    .cursor{
      cursor: pointer !important;
    }
  </style>
