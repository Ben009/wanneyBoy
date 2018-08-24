 <template>
    <div>
      <el-table :data="orderList" :max-height="QJTableMaxHeight"  style="width: 100%" @expand-change="rowExpand">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="applianceList[scope.row.orderNo]" :max-height="QJTableMaxHeight" style="width: 100%">
              <el-table-column label="器具名称" prop="applianceName">
              </el-table-column>
              <el-table-column label="型号规格" prop="model">
              </el-table-column>
              <el-table-column label="套数" prop="setNumber">
              </el-table-column>
              <el-table-column label="检测方式" prop="detectionMethod"><!--0现场 1送检 2带回-->
              </el-table-column>
              <el-table-column label="执行人" prop="inspector">
              </el-table-column>
              <el-table-column label="预计工作量" prop="estimatedWorkload">
              </el-table-column>
              <el-table-column label="状态" prop="status"><!--未分配、未配号、djh、退回（原因）-->
              </el-table-column>
              <el-table-column
                label="操作"
                min-width="100">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" plain @click="handleApplianceEdit(scope.row)"  >器具详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="委托单号" prop="orderNo">
        </el-table-column>
        <el-table-column label="计划时间" prop="allPlanTime">
        </el-table-column>
        <el-table-column label="带队人" prop="leader_name">
        </el-table-column>
        <el-table-column label="车辆" prop="vehicle">
        </el-table-column>
        <el-table-column label="司机" prop="vehicleName">
        </el-table-column>
        <el-table-column label="备注" prop="remark">
        </el-table-column>
        <el-table-column label="安排时间" prop="addTime" :formatter="formatterTime">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleOrderEdit(scope.row)">委托单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <planApplianceEdit v-if="!!applianceEdit" :data="applianceEdit" :callback="handleApplianceEditCallback" ></planApplianceEdit>
      <ArrangeEdit v-if="!!orderEdit" :orderNo="orderEdit" :callback="handleOrderEditCallback"></ArrangeEdit>
    </div>
  </template>


<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import { ajaxRequest, formatArrayToTree,formatDate } from '../../util/base'
  import $ from 'jquery';
  import planApplianceEdit from './planApplianceEdit.vue';
  import ArrangeEdit from './AssigmentDialog.vue';

/*   import { Button,  Table, TableColumn, Container, Header } from 'element--ui'
  Vue.use(Button)
  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Container);
  Vue.use(Header); */

  export default {
    name: 'orderList',
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
        orderList: [],
        applianceList:{},
        applianceEdit:null,
        orderEdit:null,
      }
    },
    components: {planApplianceEdit,ArrangeEdit},
    methods:{
      rowExpand:function(row,rows){
        ajaxRequest('get', 'back/plan/getApplianceListByOrderNo', {
          orderNo: row.orderNo
        }, res => {
          if (res.code === 200) {
            Vue.set(this.applianceList,row.orderNo,res.rows)
          }
        })
      },
      formatterTime:function(row, column){
        return formatDate(row.addTime,'YYYY-MM-DD');
      },
      //器具弹窗
      handleApplianceEdit(rowInfo) {
        console.log(rowInfo,"委托单器具弹窗");
        this.applianceEdit = rowInfo || {};
        console.log(this.applianceEdit,'this.applianceEdit')
      },
      handleApplianceEditCallback(rowInfo){
        let _this = this;
        console.log(rowInfo,'关闭器具弹窗');
        if(rowInfo){
          if (rowInfo.id) {//修改
            ajaxRequest('put', 'back/planAppliance/', rowInfo, function (res) {
              if (res.code === 200) {
                _this.$message.success('编辑成功');
                _this.applianceEdit = null;
              }
              else {
                _this.$message.error('编辑失败');
              }
            });
          }else{//新增
            this.applianceEdit = null
          }
        }else{
          this.applianceEdit = null
        }

      },
      handleOrderEdit(rowInfo){
        this.orderEdit = rowInfo.orderNo;
      },
      handleOrderEditCallback(data){
       /* if (data) {
          if (data.id) {
            ajaxRequest(
              "put",
              "back/arrange/",
              {
                id: data.id,
                orderNo: data.orderNo,
                isSelfarrange: data.isSelfarrange,
                allPlanTime: data.allPlanTime,
                leader: data.leader,
                driver: data.driver,
                vehicle: data.vehicle,
                remark: data.remark
              },
              res => {
                if (res.code == 200) {
                  this.$emit('refreshData');
                  this.$message.success("编辑成功");
                }
              }
            );
            this.assigmentDialog = null;
          }
        } else {
          this.assigmentDialog = null;
        }*/
        this.$emit('refreshData');
      },
      refreshThisVue(){
        this.$emit('refreshData');
      }
    }
  }

</script>
