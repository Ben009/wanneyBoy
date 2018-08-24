<template>
  <div style="font-size: 14px">
      <div style="width: 100%">
        <div class="title-item" style="text-align: left;margin-bottom: 10px"><span>基本信息</span></div>
        <table style="width: 100%;" class="gridtable">
          <tr>
            <td colspan="6">
              登记号：{{data.registrationNo}}
            </td>
            <td colspan="12">
              委托单位：{{data.companyName}}
            </td>
            <td colspan="6">
              委托日期：{{data.addTime|claimTimeFormat}}
            </td>
          </tr>
          <tr>
            <td colspan="6">
              检测部门/岗位：{{data.departName}}/{{data.postName}}
            </td>
            <td colspan="6">
              器具名称：{{data.applianceActualName==null?data.applianceName:data.applianceActualName}}
            </td>
            <td colspan="6">
              套数/件数/退：{{data.setNumber}}/{{data.pieceNumber}}/{{data.returnNumber}}
            </td>
            <td colspan="6">
              是否强检：<span style="color: red" v-if="data.isCompulsoryVerify=='1'">是</span>
                       <span v-if="data.isCompulsoryVerify=='0'">否</span>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              是否加急：<span style="color: red" v-if="data.isUrgent!='0'">{{data.urgentProportions}}%</span>
                       <span v-if="data.isUrgent=='0'">否</span>
            </td>
            <td colspan="6">
              是否可打折
              <el-tooltip class="item" effect="dark" :content="'该器具在业务受理时为不可打折；如需打折：可重新关联可打折的计量器具进行折扣；'">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
              ：{{data.isDiscount=="1"?"是":"否"}}
            </td>
            <td colspan="6">
              收费标准
              <el-tooltip class="item" effect="dark" :content="'器具收费标准与附加费收费标准；'">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
              ：{{data.detectionFee}}<span v-if="data.attachedFee>0">/{{data.attachedFee}}</span>
            </td>
            <td colspan="6">
              服务类型：{{data.certificateType}}
            </td>
          </tr>
          <tr>
            <td colspan="6" v-if="data.contractNo!=null">
              合同编号/折扣
              <el-tooltip class="item" effect="dark" :content="'该单位存在有效的合同号，若无需使用该合同号，或在受理时清空该合同号；'">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
              ：{{data.contractNo}}/{{data.contractNo==null?"":parseFloat(data.contractDiscount).toFixed(2)}}
            </td>
            <td colspan="6" v-if="data.source===4">费用来源：报价器具</td>
            <td colspan="6" v-else-if="data.source===7">费用来源：单位价格库</td>
            <td colspan="6" v-else>费用来源：计量器具库</td>
            <td colspan="12" v-if="data.contractNo!=null">
              收费说明：
              <span v-if="data.detectionFeeExplain">{{data.detectionFeeExplain}}</span>
              <span v-else>无</span>
              <span v-if="data.attachedFeeExplain">&nbsp;&nbsp;&nbsp;附加费说明：{{data.attachedFeeExplain}}</span>
            </td>
            <td colspan="18" v-if="data.contractNo==null">
              收费说明：
              <span v-if="data.detectionFeeExplain">{{data.detectionFeeExplain}}</span>
              <span v-else>无</span>
              <span v-if="data.attachedFeeExplain">&nbsp;&nbsp;&nbsp;附加费说明：{{data.attachedFeeExplain}}</span>
            </td>
          </tr>
          <tr>
            <td colspan="24" v-if="data.historyFeeExplain">
              历史费用说明：{{data.historyFeeExplain}}
            </td>
          </tr>
        </table>
      </div>
      <div style="margin-top: 10px">
        <div class="title-item" style="margin-top: 20px"><span>应收费区域</span></div>
        <table style="width: 100%;margin-top: 10px" class="gridtable">
          <tr>
            <td>部门<font style="color: red">(*)</font></td>
            <td>检定员<font style="color: red">(*)</font></td>
            <td>{{defaultInfo.fee1}}</td>
            <td>{{defaultInfo.fee2}}</td>
            <td>{{defaultInfo.fee3}}</td>
            <td>{{defaultInfo.fee4}}</td>
            <td>{{defaultInfo.fee5}}</td>
            <td>{{defaultInfo.fee6}}</td>
            <td>{{defaultInfo.fee7}}</td>
            <td>{{defaultInfo.fee8}}</td>
            <td>{{defaultInfo.fee9}}</td>
          </tr>
          <tr v-for="(temp,index) in chargeList">
            <td>
              <el-select  placeholder="请选择" v-model="temp.departId" size="mini" disabled="disabled">
                <el-option
                  v-for="item in departNameData"
                  :label="item.departName"
                  :value="item.departId+''"
                >
                </el-option>
              </el-select>
            </td>
            <td>
              <el-select  placeholder="请选择" v-model="temp.commissionerId" size="mini" disabled="disabled">
                <el-option
                  v-for="item in temp.personList"
                  :label="item.userName"
                  :value="item.id">
                </el-option>
              </el-select>
            </td>
            <td>
              <el-input  v-model="temp.jdf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input  v-model="temp.fjf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input  v-model="temp.jjf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input  v-model="temp.xlf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input  v-model="temp.fwf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input  v-model="temp.qtf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input  v-model="temp.totalActual" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input  v-model="temp.workload" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input  v-model="temp.intensiveWorkload" size="mini" disabled="disabled"></el-input>
            </td>
          </tr>
          <tr style="font-weight: bold;font-size: 16px">
            <td colspan="2" style="text-align: right">
              应收费合计
            </td>
            <td>
              {{totaljdf}}
            </td>
            <td>
              {{totalfjf}}
            </td>
            <td>
              {{totaljjf}}
            </td>
            <td>
              {{totalxlf}}
            </td>
            <td>
              {{totalfwf}}
            </td>
            <td>
              {{totalqtf}}
            </td>
            <td>
              {{totaltotalActual}}
            </td>
            <td>
              {{totalworkload}}
            </td>
            <td>
              {{totalintensiveWorkload}}
            </td>
          </tr>
        </table>
        <div class="title-item" style="margin-top: 10px"><span>实收费区域</span></div>
        <table style="width: 100%;margin-top: 10px" class="gridtable">
          <tr>
            <td>部门<font style="color: red">(*)</font></td>
            <td>检定员<font style="color: red">(*)</font></td>
            <td>{{defaultInfo.fee1}}</td>
            <td>{{defaultInfo.fee2}}</td>
            <td>{{defaultInfo.fee3}}</td>
            <td>{{defaultInfo.fee4}}</td>
            <td>{{defaultInfo.fee5}}</td>
            <td>{{defaultInfo.fee6}}</td>
            <td>{{defaultInfo.fee7}}</td>
            <td>
              {{defaultInfo.fee8}}
              <el-tooltip class="item" effect="dark" :content="'自检时实收'+defaultInfo.fee1+','+defaultInfo.fee2+','+defaultInfo.fee3+',累加到'+defaultInfo.fee8">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </td>
            <td>
              {{defaultInfo.fee9}}
              <el-tooltip class="item" effect="dark" :content="'自检时实收'+defaultInfo.fee1+','+defaultInfo.fee2+','+defaultInfo.fee3+',累加到'+defaultInfo.fee9">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </td>
          </tr>
          <tr v-for="(temp,index) in actualChargeList">
            <td>
              <el-select placeholder="请选择" v-model="temp.departId" size="mini" disabled="disabled">
                <el-option
                  v-for="item in departNameData"
                  :label="item.departName"
                  :value="item.departId+''"
                >
                </el-option>
              </el-select>
            </td>
            <td>
              <el-select placeholder="请选择" v-model="temp.commissionerId" size="mini" disabled="disabled">
                <el-option
                  v-for="item in temp.personList"
                  :label="item.userName"
                  :value="item.id">
                </el-option>
              </el-select>
            </td>
            <td>
              <el-input v-model="temp.jdf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input v-model="temp.fjf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input v-model="temp.jjf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input v-model="temp.xlf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input v-model="temp.fwf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input v-model="temp.qtf" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input v-model="temp.totalActual" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input v-model="temp.workload" size="mini" disabled="disabled"></el-input>
            </td>
            <td>
              <el-input v-model="temp.intensiveWorkload" size="mini" disabled="disabled"></el-input>
            </td>
          </tr>
          <tr style="font-weight: bold;font-size: 16px">
            <td colspan="2" style="text-align: right">
              实收费合计
            </td>
            <td>
              {{actualtotaljdf}}
            </td>
            <td>
              {{actualtotalfjf}}
            </td>
            <td>
              {{actualtotaljjf}}
            </td>
            <td>
              {{actualtotalxlf}}
            </td>
            <td>
              {{actualtotalfwf}}
            </td>
            <td>
              {{actualtotalqtf}}
            </td>
            <td>
              {{actualtotaltotalActual}}
            </td>
            <td>
              {{actualtotalworkload}}
            </td>
            <td>
              {{actualtotalintensiveWorkload}}
            </td>
          </tr>
        </table>
      </div>
  </div>
</template>

<script>
  import Vue from 'vue';

  import {ajaxSyncRequest,ajaxRequest,ajaxProxyRequest,formatDate} from '../../util/base';
  import chargeSample from './chargeSample';


  let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
  export default {
    name: "charge-detail",
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        defaultInfo:{},//初始化页面字段名称

        departNameData:[],//部门
        chargeList:[
          {
            departId:'',//部门
            commissionerId:'',//检定员
            jdf:0,//检测费
            fjf:0,//附加费
            xlf:0,//修理费
            jjf:0,//加急费
            fwf:0,//服务费
            qtf:0,//其他费
            totalActual:0,//小计
            workload:0,//工作量
            intensiveWorkload:0,//强检工作量
            personList:[]//人员列表
          }
        ],//应收费列表
        actualChargeList:[
          {
            departId:'',//部门
            commissionerId:'',//检定员
            jdf:0,//检测费
            fjf:0,//附加费
            xlf:0,//修理费
            jjf:0,//加急费
            fwf:0,//服务费
            qtf:0,//其他费
            totalActual:0,//小计
            workload:0,//工作量
            intensiveWorkload:0,//强检工作量
            personList:[]//人员列表doDiscount
          }
        ],//实收费列表
        edit: null,//变更器具

        additionalPoints:0,//附加点
        additionalPoints_value:0,//附加点填写值
        subcontractFee:0,//分包费
        //应收费合计
        totaljdf:0,//检测费
        totalfjf:0,//附加费
        totalxlf:0,//修理费
        totaljjf:0,//加急费
        totalfwf:0,//服务费
        totalqtf:0,//其他费
        totaltotalActual:0,//小计
        totalworkload:0,//工作量
        totalintensiveWorkload:0,//强检工作量

        //实收费合计
        actualtotaljdf:0,//检测费
        actualtotalfjf:0,//附加费
        actualtotalxlf:0,//修理费
        actualtotaljjf:0,//加急费
        actualtotalfwf:0,//服务费
        actualtotalqtf:0,//其他费
        actualtotaltotalActual:0,//小计
        actualtotalworkload:0,//工作量
        actualtotalintensiveWorkload:0,//强检工作量

        discount_value:"",//折扣填写值
        discount:"1",//折扣值
        totalCollection_value:"",//总收填写值
        totalCollection:"",//总收值
        isNeedVerify:"0",//是否需要审核标志位0:无需审核，1：需要审核
        applyReason:"",//打折申请原因
      }
    },
    methods:{
      //获取部门列表
      ajaxDepartNameObj(){
        let _this = this;
        ajaxProxyRequest('get', '/njmind/findParam/departmentList', {}, (res) => {
          for (var i = 0; i < res.list.length; i++) {
            _this.departNameData.push({'departId':parseInt(res.list[i].code),'departName':res.list[i].remark});
          }
        });
      },
      //获取人员列表
      getPersonList(index,departId){
        let _this = this;
        _this.chargeList[index].commissionerId='';
        ajaxRequest('get','back/user/listUserByDeptId/'+departId,{},function(data){
          if(data.code===200){
            _this.chargeList[index].personList=[];
            _this.actualChargeList[index].personList=[];
            for (var i = 0; i < data.rows.length; i++) {
              _this.chargeList[index].personList.push({'id':data.rows[i].id,'userName':data.rows[i].userName});
              _this.actualChargeList[index].personList.push({'id':data.rows[i].id,'userName':data.rows[i].userName});
            }
          }
        }.bind(this));
      },
      //打折按钮事件
      doDiscount(){
        this.totalCollection_value="";
        this.totalCollection="";
        if(this.discount_value==""){
          this.discount = 1.00;
        }else{
          this.discount = this.discount_value;
        }

        //实收费合计
        this.actualtotaljdf=0;//检测费
        this.actualtotalfjf=0;//附加费
        this.actualtotalxlf=0;//修理费
        this.actualtotaljjf=0;//加急费
        this.actualtotalfwf=0;//服务费
        this.actualtotalqtf=0;//其他费
        this.actualtotaltotalActual=0;//小计
        this.actualtotalworkload=0;//工作量
        this.actualtotalintensiveWorkload=0;//强检工作量
        for (let i=0;i<this.actualChargeList.length;i++){
          if(this.data.source==1) {//自检
            this.actualChargeList[i].jdf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].fjf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].jjf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].workload=parseFloat((parseFloat(this.chargeList[i].workload)
              +parseFloat(this.chargeList[i].jdf)
              +parseFloat(this.chargeList[i].fjf)
              +parseFloat(this.chargeList[i].jjf))*this.discount).toFixed(2);
            this.actualChargeList[i].intensiveWorkload = parseFloat(this.chargeList[i].intensiveWorkload*this.discount).toFixed(2);
          }else if(this.data.isCompulsoryVerify=="1") {//强检
            this.actualChargeList[i].jdf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].fjf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].jjf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].intensiveWorkload=parseFloat((parseFloat(this.chargeList[i].intensiveWorkload)
              +parseFloat(this.chargeList[i].jdf)
              +parseFloat(this.chargeList[i].fjf)
              +parseFloat(this.chargeList[i].jjf))*this.discount).toFixed(2);
            this.actualChargeList[i].workload = parseFloat(this.chargeList[i].workload*this.discount).toFixed(2);
          }else{
            this.actualChargeList[i].jdf = parseFloat(this.chargeList[i].jdf*this.discount).toFixed(2);
            this.actualChargeList[i].fjf = parseFloat(this.chargeList[i].fjf*this.discount).toFixed(2);
            this.actualChargeList[i].jjf = parseFloat(this.chargeList[i].jjf*this.discount).toFixed(2);
            this.actualChargeList[i].intensiveWorkload = parseFloat(this.chargeList[i].intensiveWorkload*this.discount).toFixed(2);
            this.actualChargeList[i].workload = parseFloat(this.chargeList[i].workload*this.discount).toFixed(2);
          }

          this.actualChargeList[i].xlf = parseFloat(this.chargeList[i].xlf*this.discount).toFixed(2);
          this.actualChargeList[i].fwf = parseFloat(this.chargeList[i].fwf*this.discount).toFixed(2);
          this.actualChargeList[i].qtf = parseFloat(this.chargeList[i].qtf*this.discount).toFixed(2);
          this.actualChargeList[i].workload = parseFloat(this.chargeList[i].workload*this.discount).toFixed(2);
          this.actualChargeList[i].totalActual = (parseFloat(this.actualChargeList[i].jdf)+
            parseFloat(this.actualChargeList[i].fjf)+
            parseFloat(this.actualChargeList[i].xlf)+
            parseFloat(this.actualChargeList[i].jjf)+
            parseFloat(this.actualChargeList[i].fwf)+
            parseFloat(this.actualChargeList[i].qtf)).toFixed(2);


          //实收费合计
          this.actualtotaljdf=parseFloat(parseFloat(this.actualtotaljdf) + parseFloat(this.actualChargeList[i].jdf)).toFixed(2);//检测费
          this.actualtotalfjf=parseFloat(parseFloat(this.actualtotalfjf) + parseFloat(this.actualChargeList[i].fjf)).toFixed(2);//附加费
          this.actualtotalxlf=parseFloat(parseFloat(this.actualtotalxlf) + parseFloat(this.actualChargeList[i].xlf)).toFixed(2);//修理费
          this.actualtotaljjf=parseFloat(parseFloat(this.actualtotaljjf) + parseFloat(this.actualChargeList[i].jjf)).toFixed(2);//加急费
          this.actualtotalfwf=parseFloat(parseFloat(this.actualtotalfwf) + parseFloat(this.actualChargeList[i].fwf)).toFixed(2);//服务费
          this.actualtotalqtf=parseFloat(parseFloat(this.actualtotalqtf) + parseFloat(this.actualChargeList[i].qtf)).toFixed(2);//其他费
          this.actualtotaltotalActual=parseFloat(parseFloat(this.actualtotaltotalActual) + parseFloat(this.actualChargeList[i].totalActual)).toFixed(2);//小计
          this.actualtotalworkload=parseFloat(parseFloat(this.actualtotalworkload) + parseFloat(this.actualChargeList[i].workload)).toFixed(2);//工作量
          this.actualtotalintensiveWorkload=parseFloat(parseFloat(this.actualtotalintensiveWorkload) + parseFloat(this.actualChargeList[i].intensiveWorkload)).toFixed(2);//强检工作量
        }
      },
      //总收按钮事件
      doTotalCollection(){
        this.discount = 1.00;
        this.discount_value ="";
        if(this.totalCollection_value==""){
          this.doDiscount();
          return;
        }else{
          this.totalCollection = this.totalCollection_value;
          let discount = parseFloat(this.totalCollection/this.totaltotalActual).toFixed(2);
          this.discount = discount;
        }
        //实收费合计
        this.actualtotaljdf=0;//检测费
        this.actualtotalfjf=0;//附加费
        this.actualtotalxlf=0;//修理费
        this.actualtotaljjf=0;//加急费
        this.actualtotalfwf=0;//服务费
        this.actualtotalqtf=0;//其他费
        this.actualtotaltotalActual=0;//小计
        this.actualtotalworkload=0;//工作量
        this.actualtotalintensiveWorkload=0;//强检工作量
        for (let i=0;i<this.actualChargeList.length;i++) {

          this.actualChargeList[i].jdf = parseFloat(this.chargeList[i].jdf*this.discount).toFixed(2);
          this.actualChargeList[i].fjf = parseFloat(this.chargeList[i].fjf*this.discount).toFixed(2);
          this.actualChargeList[i].jjf = parseFloat(this.chargeList[i].jjf*this.discount).toFixed(2);
          this.actualChargeList[i].intensiveWorkload = parseFloat(this.chargeList[i].intensiveWorkload*this.discount).toFixed(2);
          this.actualChargeList[i].xlf = parseFloat(this.chargeList[i].xlf * this.discount).toFixed(2);
          this.actualChargeList[i].fwf = parseFloat(this.chargeList[i].fwf * this.discount).toFixed(2);
          this.actualChargeList[i].qtf = parseFloat(this.chargeList[i].qtf * this.discount).toFixed(2);
          this.actualChargeList[i].workload = parseFloat(this.chargeList[i].workload * this.discount).toFixed(2);
          this.actualChargeList[i].totalActual = parseFloat(parseFloat(this.actualChargeList[i].jdf)+
            parseFloat(this.actualChargeList[i].fjf)+
            parseFloat(this.actualChargeList[i].xlf)+
            parseFloat(this.actualChargeList[i].jjf)+
            parseFloat(this.actualChargeList[i].fwf)+
            parseFloat(this.actualChargeList[i].qtf)).toFixed(2);

          //实收费合计
          this.actualtotaljdf = parseFloat(parseFloat(this.actualtotaljdf) + parseFloat(this.actualChargeList[i].jdf)).toFixed(2);//检测费
          this.actualtotalfjf = parseFloat(parseFloat(this.actualtotalfjf) + parseFloat(this.actualChargeList[i].fjf)).toFixed(2);//附加费
          this.actualtotalxlf = parseFloat(parseFloat(this.actualtotalxlf) + parseFloat(this.actualChargeList[i].xlf)).toFixed(2);//修理费
          this.actualtotaljjf = parseFloat(parseFloat(this.actualtotaljjf) + parseFloat(this.actualChargeList[i].jjf)).toFixed(2);//加急费
          this.actualtotalfwf = parseFloat(parseFloat(this.actualtotalfwf) + parseFloat(this.actualChargeList[i].fwf)).toFixed(2);//服务费
          this.actualtotalqtf = parseFloat(parseFloat(this.actualtotalqtf) + parseFloat(this.actualChargeList[i].qtf)).toFixed(2);//其他费
          this.actualtotaltotalActual = parseFloat(parseFloat(this.actualtotaltotalActual) + parseFloat(this.actualChargeList[i].totalActual)).toFixed(2);//小计
          this.actualtotalworkload = parseFloat(parseFloat(this.actualtotalworkload) + parseFloat(this.actualChargeList[i].workload)).toFixed(2);//工作量
          this.actualtotalintensiveWorkload = parseFloat(parseFloat(this.actualtotalintensiveWorkload) + parseFloat(this.actualChargeList[i].intensiveWorkload)).toFixed(2);//强检工作量
        }

        if(this.totalCollection!==this.actualtotaltotalActual){
          let deviate = parseFloat(parseFloat(this.totalCollection)-parseFloat(this.actualtotaltotalActual)).toFixed(2);
          for (let j=0;j<this.actualChargeList.length;j++) {
            if(this.actualChargeList[j].jdf>0 && (parseFloat(deviate)+parseFloat(this.actualChargeList[j].jdf)).toFixed(2)>0){
              this.actualChargeList[j].jdf = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].jdf)).toFixed(2);
              this.actualChargeList[j].totalActual = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].totalActual)).toFixed(2);
              this.actualtotaljdf = (parseFloat(deviate)+parseFloat(this.actualtotaljdf)).toFixed(2);
              this.actualtotaltotalActual = (parseFloat(deviate)+parseFloat(this.actualtotaltotalActual)).toFixed(2);
              break;
            }
            if(this.actualChargeList[j].fjf>0 && (parseFloat(deviate)+parseFloat(this.actualChargeList[j].fjf)).toFixed(2)>0){
              this.actualChargeList[j].fjf = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].fjf)).toFixed(2);
              this.actualChargeList[j].totalActual = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].totalActual)).toFixed(2);
              this.actualtotalfjf = (parseFloat(deviate)+parseFloat(this.actualtotalfjf)).toFixed(2);
              this.actualtotaltotalActual = (parseFloat(deviate)+parseFloat(this.actualtotaltotalActual)).toFixed(2);
              break;
            }
            if(this.actualChargeList[j].jjf>0 && (parseFloat(deviate)+parseFloat(this.actualChargeList[j].jjf)).toFixed(2)>0){
              this.actualChargeList[j].jjf = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].jjf)).toFixed(2);
              this.actualChargeList[j].totalActual = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].totalActual)).toFixed(2);
              this.actualtotaljjf = (parseFloat(deviate)+parseFloat(this.actualtotaljjf)).toFixed(2);
              this.actualtotaltotalActual = (parseFloat(deviate)+parseFloat(this.actualtotaltotalActual)).toFixed(2);
              break;
            }
            if(this.actualChargeList[j].xlf>0 && (parseFloat(deviate)+parseFloat(this.actualChargeList[j].xlf)).toFixed(2)>0){
              this.actualChargeList[j].xlf = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].xlf)).toFixed(2);
              this.actualChargeList[j].totalActual = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].totalActual)).toFixed(2);
              this.actualtotalxlf = (parseFloat(deviate)+parseFloat(this.actualtotalxlf)).toFixed(2);
              this.actualtotaltotalActual = (parseFloat(deviate)+parseFloat(this.actualtotaltotalActual)).toFixed(2);
              break;
            }
            if(this.actualChargeList[j].fwf>0 && (parseFloat(deviate)+parseFloat(this.actualChargeList[j].fwf)).toFixed(2)>0){
              this.actualChargeList[j].fwf = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].fwf)).toFixed(2);
              this.actualChargeList[j].totalActual = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].totalActual)).toFixed(2);
              this.actualtotalfwf = (parseFloat(deviate)+parseFloat(this.actualtotalfwf)).toFixed(2);
              this.actualtotaltotalActual = (parseFloat(deviate)+parseFloat(this.actualtotaltotalActual)).toFixed(2);
              break;
            }
            if(this.actualChargeList[j].qtf>0 && (parseFloat(deviate)+parseFloat(this.actualChargeList[j].qtf)).toFixed(2)>0){
              this.actualChargeList[j].qtf = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].qtf)).toFixed(2);
              this.actualChargeList[j].totalActual = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].totalActual)).toFixed(2);
              this.actualtotalqtf = (parseFloat(deviate)+parseFloat(this.actualtotalqtf)).toFixed(2);
              this.actualtotaltotalActual = (parseFloat(deviate)+parseFloat(this.actualtotaltotalActual)).toFixed(2);
              break;
            }
            this.actualChargeList[j].jdf = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].jdf)).toFixed(2);
            this.actualChargeList[j].totalActual = (parseFloat(deviate)+parseFloat(this.actualChargeList[j].totalActual)).toFixed(2);
            this.actualtotaljdf = (parseFloat(deviate)+parseFloat(this.actualtotaljdf)).toFixed(2);
            this.actualtotaltotalActual = (parseFloat(deviate)+parseFloat(this.actualtotaltotalActual)).toFixed(2);
            break;
          }
        }
        if(this.data.source==1) {//自检
          for (let j=0;j<this.actualChargeList.length;j++) {
            this.actualChargeList[j].totalActual = parseFloat(parseFloat(this.actualChargeList[j].totalActual)
              -parseFloat(this.actualChargeList[j].jdf)
              -parseFloat(this.actualChargeList[j].fjf)
              -parseFloat(this.actualChargeList[j].jjf)+parseFloat(0.0000000001)).toFixed(2);
            this.actualChargeList[j].workload = parseFloat(parseFloat(this.actualChargeList[j].workload)
              +parseFloat(this.actualChargeList[j].jdf)
              +parseFloat(this.actualChargeList[j].fjf)
              +parseFloat(this.actualChargeList[j].jjf)).toFixed(2);

            this.actualtotaltotalActual = parseFloat(parseFloat(this.actualtotaltotalActual)
              -parseFloat(this.actualChargeList[j].jdf)
              -parseFloat(this.actualChargeList[j].fjf)
              -parseFloat(this.actualChargeList[j].jjf)+parseFloat(0.0000000001)).toFixed(2);
            this.actualtotalworkload = parseFloat(parseFloat(this.actualtotalworkload)
              +parseFloat(this.actualChargeList[j].jdf)
              +parseFloat(this.actualChargeList[j].fjf)
              +parseFloat(this.actualChargeList[j].jjf)).toFixed(2);
            this.actualChargeList[j].jdf = parseFloat(0.00).toFixed(2);
            this.actualChargeList[j].fjf = parseFloat(0.00).toFixed(2);
            this.actualChargeList[j].jjf = parseFloat(0.00).toFixed(2);
            this.actualtotaljdf = parseFloat(0.00).toFixed(2);
            this.actualtotalfjf = parseFloat(0.00).toFixed(2);
            this.actualtotaljjf = parseFloat(0.00).toFixed(2);
          }
        }else if(this.data.isCompulsoryVerify=="1") {//强检
          for (let j=0;j<this.actualChargeList.length;j++) {
            this.actualChargeList[j].totalActual = parseFloat(parseFloat(this.actualChargeList[j].totalActual)
                                                  -parseFloat(this.actualChargeList[j].jdf)
                                                  -parseFloat(this.actualChargeList[j].fjf)
                                                  -parseFloat(this.actualChargeList[j].jjf)+parseFloat(0.0000000001)).toFixed(2);
            this.actualChargeList[j].intensiveWorkload = parseFloat(parseFloat(this.actualChargeList[j].intensiveWorkload)
                                                  +parseFloat(this.actualChargeList[j].jdf)
                                                  +parseFloat(this.actualChargeList[j].fjf)
                                                  +parseFloat(this.actualChargeList[j].jjf)).toFixed(2);

            this.actualtotaltotalActual = parseFloat(parseFloat(this.actualtotaltotalActual)
                                                  -parseFloat(this.actualChargeList[j].jdf)
                                                  -parseFloat(this.actualChargeList[j].fjf)
                                                  -parseFloat(this.actualChargeList[j].jjf)+parseFloat(0.0000000001)).toFixed(2);
            this.actualtotalintensiveWorkload = parseFloat(parseFloat(this.actualtotalintensiveWorkload)
                                                  +parseFloat(this.actualChargeList[j].jdf)
                                                  +parseFloat(this.actualChargeList[j].fjf)
                                                  +parseFloat(this.actualChargeList[j].jjf)).toFixed(2);
            this.actualChargeList[j].jdf = parseFloat(0.00).toFixed(2);
            this.actualChargeList[j].fjf = parseFloat(0.00).toFixed(2);
            this.actualChargeList[j].jjf = parseFloat(0.00).toFixed(2);
            this.actualtotaljdf = parseFloat(0.00).toFixed(2);
            this.actualtotalfjf = parseFloat(0.00).toFixed(2);
            this.actualtotaljjf = parseFloat(0.00).toFixed(2);
          }
        }
      },
      //初始化进入加载费用数据
      loadInfoFristIntoPage(){
        let _this = this;
        ajaxSyncRequest('get','back/charge/getRegistrationFeeInfo',{registrationNo:_this.data.registrationNo},function(res){
          if(res.code === 200){
            let resData=res.map;
            for(let i=0;i<resData.CommissionerList.length;i++){
              if(i!==0){
                _this.chargeList.push({
                    departId:'',//部门
                    commissionerId:'',//检定员
                    jdf:0,//检测费
                    fjf:0,//附加费
                    xlf:0,//修理费
                    jjf:0,//加急费
                    fwf:0,//服务费
                    qtf:0,//其他费
                    totalActual:0,//小计
                    workload:0,//工作量
                    intensiveWorkload:0,//强检工作量
                    personList:[]//人员列表
                  });
                _this.actualChargeList.push({
                    departId:'',//部门
                    commissionerId:'',//检定员
                    jdf:0,//检测费
                    fjf:0,//附加费
                    xlf:0,//修理费
                    jjf:0,//加急费
                    fwf:0,//服务费
                    qtf:0,//其他费
                    totalActual:0,//小计
                    workload:0,//工作量
                    intensiveWorkload:0,//强检工作量
                    personList:[]//人员列表
                  });
              }
              _this.chargeList[i].departId = resData.CommissionerList[i].departId;
              _this.getPersonList(i,resData.CommissionerList[i].departId);
              _this.chargeList[i].commissionerId = resData.CommissionerList[i].commissionerId;
              _this.chargeList[i].jdf = parseFloat(resData.CommissionerList[i].jdf).toFixed(2);
              _this.chargeList[i].fjf = parseFloat(resData.CommissionerList[i].fjf).toFixed(2);
              _this.chargeList[i].xlf = parseFloat(resData.CommissionerList[i].xlf).toFixed(2);
              _this.chargeList[i].jjf = parseFloat(resData.CommissionerList[i].jjf).toFixed(2);
              _this.chargeList[i].fwf = parseFloat(resData.CommissionerList[i].fwf).toFixed(2);
              _this.chargeList[i].qtf = parseFloat(resData.CommissionerList[i].qtf).toFixed(2);
              _this.chargeList[i].totalActual = parseFloat(resData.CommissionerList[i].totalFee).toFixed(2);
              _this.chargeList[i].workload = parseFloat(resData.CommissionerList[i].workload).toFixed(2);
              _this.chargeList[i].intensiveWorkload = parseFloat(resData.CommissionerList[i].intensiveWorkload).toFixed(2);

              _this.actualChargeList[i].departId = resData.CommissionerList[i].departId;
              _this.actualChargeList[i].commissionerId = resData.CommissionerList[i].commissionerId;
              _this.actualChargeList[i].jdf = parseFloat(resData.CommissionerList[i].jdfActual).toFixed(2);
              _this.actualChargeList[i].fjf = parseFloat(resData.CommissionerList[i].fjfActual).toFixed(2);
              _this.actualChargeList[i].xlf = parseFloat(resData.CommissionerList[i].xlfActual).toFixed(2);
              _this.actualChargeList[i].jjf = parseFloat(resData.CommissionerList[i].jjfActual).toFixed(2);
              _this.actualChargeList[i].fwf = parseFloat(resData.CommissionerList[i].fwfActual).toFixed(2);
              _this.actualChargeList[i].qtf = parseFloat(resData.CommissionerList[i].qtfActual).toFixed(2);
              _this.actualChargeList[i].totalActual = parseFloat(resData.CommissionerList[i].totalActual).toFixed(2);
              _this.actualChargeList[i].workload = parseFloat(resData.CommissionerList[i].workloadActual).toFixed(2);
              _this.actualChargeList[i].intensiveWorkload = parseFloat(resData.CommissionerList[i].intensiveWorkloadActual).toFixed(2);
            }

            let resMap=res.map.chargeDetail;
            _this.additionalPoints=parseFloat(resMap.additionalPoints).toFixed(2);//附加点
            _this.additionalPoints_value=parseFloat(resMap.additionalPoints).toFixed(2);//附加点填写值
            _this.subcontractFee=0;//分包费
            //应收费合计
            _this.totaljdf=parseFloat(resMap.jdf).toFixed(2);//检测费
            _this.totalfjf=parseFloat(resMap.fjf).toFixed(2);//附加费
            _this.totalxlf=parseFloat(resMap.xlf).toFixed(2);//修理费
            _this.totaljjf=parseFloat(resMap.jjf).toFixed(2);//加急费
            _this.totalfwf=parseFloat(resMap.fwf).toFixed(2);//服务费
            _this.totalqtf=parseFloat(resMap.qtf).toFixed(2);//其他费
            _this.totaltotalActual=parseFloat(resMap.totalFee).toFixed(2);//小计
            _this.totalworkload=parseFloat(resMap.workload).toFixed(2);//工作量
            _this.totalintensiveWorkload=parseFloat(resMap.intensiveWorkload).toFixed(2);//强检工作量

            //实收费合计
            _this.actualtotaljdf=parseFloat(resMap.jdfActual).toFixed(2);//检测费
            _this.actualtotalfjf=parseFloat(resMap.fjfActual).toFixed(2);//附加费
            _this.actualtotalxlf=parseFloat(resMap.xlfActual).toFixed(2);//修理费
            _this.actualtotaljjf=parseFloat(resMap.jjfActual).toFixed(2);//加急费
            _this.actualtotalfwf=parseFloat(resMap.fwfActual).toFixed(2);//服务费
            _this.actualtotalqtf=parseFloat(resMap.qtfActual).toFixed(2);//其他费
            _this.actualtotaltotalActual=parseFloat(resMap.totalActual).toFixed(2);//小计
            _this.actualtotalworkload=parseFloat(resMap.workloadActual).toFixed(2);//工作量
            _this.actualtotalintensiveWorkload=parseFloat(resMap.intensiveWorkloadActual).toFixed(2);//强检工作量
          }
        });
      },
      //父组件调用打折方法
      toDoDiscount(discount){
        this.discount=parseFloat(discount).toFixed(2);
        this.discount_value=parseFloat(discount).toFixed(2);
        this.doDiscount();
      },
      //父组件调用总收方法
      toDoTotalCollection(totalCollection){
        this.totalCollection_value=parseFloat(totalCollection).toFixed(2);
        this.totalCollection=parseFloat(totalCollection).toFixed(2);
        this.doTotalCollection()
      },
    },
    components:{
      chargeSample
    },
    mounted() {
      this.ajaxDepartNameObj();
      this.loadInfoFristIntoPage();
      //获取费用字段名称，打折点
      ajaxProxyRequest('get','/njmind/findParams/fee1$fee2$fee3$fee4$fee5$fee6$fee7$fee8$fee9',{},(res)=>{
        this.defaultInfo = {
          fee1:res.fee1.value,
          fee2:res.fee2.value,
          fee3:res.fee3.value,
          fee4:res.fee4.value,
          fee5:res.fee5.value,
          fee6:res.fee6.value,
          fee7:res.fee7.value,
          fee8:res.fee8.value,
          fee9:res.fee9.value,
        }
      })
    },
    filters: {
      claimTimeFormat(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      }
    },

  }
</script>

<style type="text/css">
  table.gridtable {
    border-width: 1px;
    border-color: darkgray;
    border-collapse: collapse;
  }
  table.gridtable td {
    border-width: 1px;
    border-style: solid;
    border-color: darkgray;
    padding: 3px;
  }
</style>
