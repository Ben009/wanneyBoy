<template>
    <div>
      <mind-dialog
        :visible="true"
        title="岗位人员产值"
        dialogSize="mid"
        center
        v-dialogDrag
        append-to-body
        @close="closeDialog">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <div>
            <Retrieve  ref="retrieve-wapper"
                       :rowsCondition='rowsCondition'
                       :sortBy="sortBy"
                       :order="order"
                       v-if="defaultOpen"
                       :paramJson="paramJson"
                       :retrieveCondition="retrieveCondition"
                       :collectionInfo="collectionInfo"/>

            <div style="display: flex;justify-content: space-between; margin:10px 0px;">
              <div style="display: inline-block;text-align: center">
                <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search"  v-if="defaultOpen">查询</el-button>
                <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning"   v-if="defaultOpen">&nbsp;清空</el-button>
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
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
          </span>
            </div>
          </div>
          <el-table  :max-height="QJTableMaxHeight"
                     ref="table"
                     :data="tableData"
                     border
                     style="width: 100%"
                     :fit="true">
            <el-table-column prop="postName" label="人员名称"></el-table-column>
            <el-table-column prop="zts" label="总套数"></el-table-column>
            <el-table-column prop="tts" label="套数（退）"></el-table-column>
            <el-table-column prop="ss" label="实收"></el-table-column>
            <el-table-column prop="ys" label="应收合计"></el-table-column>
            <el-table-column prop="ysjcf" label="应收检测费" v-if="headObj.ysjcf"></el-table-column>
            <el-table-column prop="ysxlf" label="应收修理费" v-if="headObj.ysxlf"></el-table-column>
            <el-table-column prop="ysfwf" label="应收服务费" v-if="headObj.ysfwf"></el-table-column>
            <el-table-column prop="ysqtf" label="应收其他费" v-if="headObj.ysqtf"></el-table-column>
            <el-table-column prop="ssjcf" label="检测费" v-if="headObj.ssjcf"></el-table-column>
            <el-table-column prop="ssxlf" label="修理费" v-if="headObj.ssxlf"></el-table-column>
            <el-table-column prop="ssfwf" label="服务费" v-if="headObj.ssfwf"></el-table-column>
            <el-table-column prop="ssqtf" label="其他费" v-if="headObj.ssqtf"></el-table-column>
            <el-table-column prop="ssgzl" label="工作量" v-if="headObj.ssgzl"></el-table-column>
            <el-table-column prop="ysqjgzl" label="强检工作量" v-if="headObj.ssgzl"></el-table-column>
            </el-table-column>
          </el-table>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">关闭</el-button>
        </span>
      </mind-dialog>
    </div>
</template>

<style>

</style>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  import Retrieve from "../../Retrieve";
  import WorkMould from "../../mould/WorkMould";
  import TableColumnHeader from "../../Table/TableColumnHeader";
  import paramJson from "./postFormParam"; //同目录下json数据
    export default {
      name:"postForm",//岗位人员产值弹层
      props:{
        callback:{
          type:Function,
          required: true
        },
        data: {
          type:Object,
          required: true
        },
      },
      components: {
        WorkMould,
        TableColumnHeader,
        Retrieve,
      },
        data() {
            return {
              tableData:[],

              isSetting: 0, //控制个性化设置弹窗是否展示
              edit: null, //控制编辑弹窗是否展示
              isInner: 0,
              /*高级检索相关项*/
              rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
              paramJson: paramJson, //同目录下json数据 常量
              moduleList: [], //模板列表
              templateValue: "", //当前选择的模板id
              sortBy: "", //排序字段
              order: "", //desc降序 asc升序
              headObj: {}, //表头显示对象 {category:true}
              defaultOpen: false, //默认开启高级查询
              sc:'',
              userId: "",
              allModules: {}, //所有模板
              resultCondition: [],
              retrieveCondition: [],
              collectionInfo:[],
            }
        },
      methods:{
        getTableList(){
          /*获取table数据，维护data数据*/
          ajaxRequest('get','back/statistics/chanzhiCount',this.data,(res)=>{
            if(res.code===200){
              this.tableData=res.rows;
            }
          })
        },
        dealDate: function (row, column, cellValue) {
          if(cellValue===""||cellValue===null||cellValue===undefined){
            return "";
          }else{
            return new Date(cellValue).format('YYYY-MM-DD');
          }
        },
        closeDialog(){
          this.callback();
        },
      },
      mounted(){
        this.getTableList();
      }
    }
</script>
