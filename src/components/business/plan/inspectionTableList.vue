<template >
  <div>
    <!-- 高级查询条件 -->
    <mind-condition ref="applianceWhere" :op-code="opCode" ></mind-condition>
    <!-- 查询调用按钮 -->
    <div style="display: flex;justify-content: space-between;">
      <span style="width: 50px">&nbsp;</span>
      <div style="display: inline-block;text-align: center">
        <el-button type="primary"  @click="findBtn" class="el-icon-search">查询</el-button>
        <el-button type="primary" @click="findBtn(true)" class="el-icon-download">导出</el-button>
        <el-button type="warning"  @click="emptyCondition" class="el-icon-info">清空</el-button>
      </div>
      <span style="float: right">
          <el-select size="mini"  v-model="isDefModule" placeholder="请选择" @change="changeModule">
            <el-option
              v-for="(item,index) in modules"
              :key="index"
              :label="item.name"
              :value="item.name">
            </el-option>
        </el-select>
          <el-button type="primary" size="mini" round @click="personalSetting" class="el-icon-setting">个性化设置</el-button>
           <global-tootips :width="600">
             <p> 1、查询从报价单转过来的送检器具。</p>
          </global-tootips>
        </span>
    </div>
    <!-- TODO 案例 通用查询组件 -->
    <mind-datagrid ref="applianceList"  :op-code="opCode"  :callBack="callBack" setTabH="setHeightForRetS">
    </mind-datagrid>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest, formatArrayToTree,formatDate} from '../../util/base';

/*   import { Button,  Table, TableColumn} from 'element--ui';
  Vue.use(Button);
  Vue.use(Table);
  Vue.use(TableColumn); */

  export default {
    name: "inspection-table-list",
    data(){
      return{
        opCode: "inspectionTableList",
        modules:[],//模板列表
        isDefModule:'',//默认模板
      }
    },
    methods:{
      //查询按钮调用
      /** 查询按钮调用 */
          findBtn(down){
            this.$refs.applianceWhere.sendParams((wheres)=>{
                //调用DataGrid查询
                //console.log("回调传入参数：",wheres);
                this.$refs.applianceList.findPageInfo(wheres,down);
            });
          },
          /** 打开个性化设置 */
          personalSetting(){//个性化设置
            this.$refs.applianceWhere.settingShow(true,(personalSet)=>{
              //当个性化设置打开后如果有参数变动会回调
              //console.log("设置后回调：",res);
              this.$refs.applianceList.changeFilter(null,personalSet);
              this.modules=personalSet.content;
              this.isDefModule=personalSet.isDefModule;
            });
          },
          /** 清空查询条件 */
          emptyCondition(){//
            this.$refs.applianceWhere.emptyCondition();
          },
          /** 回调 可以单datagrid使用  */
          callBack(type,param1,param2){
            if(type=='modules'){
              this.modules=param1;
              this.isDefModule=param2;
            }else{
              //console.log("回调接收参数",param1);
            }
          },
          /** 模板变换 */
          changeModule(value){
            //console.log("模板变更",value);
            this.$refs.applianceList.changeFilter(value,null);
          },
    },
    components:{

    },
    mounted() {
      this.findBtn();
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

  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }

  .el-icon-setting:hover {
    color: #3094e0 !important;
  }
</style>
