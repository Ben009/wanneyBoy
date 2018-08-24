<template>
  <mind-dialog
    :title="'费用详情'"
    :visible="true"
    dialogSize="large"
    center
    v-dialogDrag
    @close="handleCancel">
    <div style="font-size: 14px">
      <div style="width: 100%">
        <div class="title-item" style="text-align: left;margin-bottom: 10px">
          <span style="width: 95%">基本信息</span>
          <span style="width: 5%">
          <global-tootips :width="600">
            <p>1、	若无权限，{{defaultInfo.fee1}}、{{defaultInfo.fee2}}、{{defaultInfo.fee3}}仅可调用计量器具库默认生成；</p>
            <p>2、{{defaultInfo.fee2}}来自计量器具库维护，可输入需要增加几个附加点，如增加两个附加点，系统自动按该数量*{{defaultInfo.fee2}}；</p>
            <p>3、	若受理时调用的计量器具库与实际检测的器具库不一致时，可从计量器具中选择正确的计量库；当一个登记号有多套器具且收费标准不一致时，可点“按器具录费”，针对一个登记号下每一个计量器具录入费用；当该登记号下套数超过50时，系统不支持按每一个器具收费。</p>
            <p>4、	当系统检测该器具存在上一周期的收费标准时，予以提示供参考；</p>
            <p>5、	若该器具为合同器具且允许打折，系统依据折扣自动生成实收费用，若无需打折，需在受理时清空合同号；</p>
            <p>6、	若该器具为可打折器具，将出现总收或打折按钮。是否允许打折依赖于受理时该器具在计量器具库中维护的状态；</p>
            <p>7、	费用录入后如需打折，可通过总收或打折按钮进行；当折扣在您打折范围内，该折扣将直接生效，若超出您的折扣权限范围，系统将发起折扣申请流程，需有权限人员审批。</p>
            <p>8、	若该器具为不可打折器具，系统禁止打折；是否允许打折依赖于受理时该器具在计量器具库中维护的状态；</p>
            <p>9、	“撤销收费”按钮，可以撤销已经录入的费用信息；</p>
          </global-tootips>
          </span>
        </div>
        <table style="width: 100%;" class="gridtable">
          <tr>
            <td colspan="6">
              登记号：{{djhData.registrationNo}}
            </td>
            <td colspan="12">
              委托单位：{{djhData.companyName}}
            </td>
            <td colspan="6">
              委托日期：{{djhData.addTime|dateyymmdd}}
            </td>
          </tr>
          <tr>
            <td colspan="6">
              检测部门/岗位：{{djhData.departName}}/{{djhData.postName}}
            </td>
            <td colspan="6">
              器具名称：{{djhData.applianceActualName==null?djhData.applianceName:djhData.applianceActualName}}
            </td>
            <td colspan="6">
              套数/件数/退：{{djhData.setNumber}}/{{djhData.pieceNumber}}/{{djhData.returnNumber}}
            </td>
            <td colspan="6">
              是否强检：<span style="color: red" v-if="djhData.isCompulsoryVerify=='1'">是</span>
              <span v-if="djhData.isCompulsoryVerify=='0'">否</span>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              是否加急：<span style="color: red" v-if="djhData.isUrgent!='0'">{{djhData.urgentProportions}}%</span>
              <span v-if="djhData.isUrgent=='0'">否</span>
            </td>
            <td colspan="6">
              是否可打折
              <el-tooltip class="item" effect="dark" :content="'该器具在业务受理时为不可打折；如需打折：可重新关联可打折的计量器具进行折扣；'">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
              ：{{djhData.isDiscount=="1"?"是":"否"}}
            </td>
            <td colspan="6">
              收费标准
              <el-tooltip class="item" effect="dark" :content="'器具收费标准与附加费收费标准；'">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
              ：{{djhData.detectionFee}}<span v-if="djhData.attachedFee>0">/{{djhData.attachedFee}}</span>
            </td>
            <td colspan="6">
              服务类型：{{djhData.certificateType}}
            </td>
          </tr>
          <tr>
            <td colspan="6" v-if="djhData.contractNo!=null">
              合同编号/折扣
              <el-tooltip class="item" effect="dark" :content="'该单位存在有效的合同号，若无需使用该合同号，或在受理时清空该合同号；'">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
              ：{{djhData.contractNo}}/{{djhData.contractNo==null?"":parseFloat(djhData.contractDiscount).toFixed(2)}}
            </td>
            <td colspan="6" v-if="djhData.source===4">费用来源：报价器具</td>
            <td colspan="6" v-else-if="djhData.source===7">费用来源：单位价格库</td>
            <td colspan="6" v-else>费用来源：计量器具库</td>
            <td colspan="6" v-if="djhData.contractNo!=null">
              收费说明：
              <span v-if="djhData.detectionFeeExplain">{{djhData.detectionFeeExplain}}</span>
              <span v-else>无</span>
              <span v-if="djhData.attachedFeeExplain">&nbsp;&nbsp;&nbsp;附加费说明：{{djhData.attachedFeeExplain}}</span>
            </td>
            <td colspan="12" v-if="djhData.contractNo==null">
              收费说明：
              <span v-if="djhData.detectionFeeExplain">{{djhData.detectionFeeExplain}}</span>
              <span v-else>无</span>
              <span v-if="djhData.attachedFeeExplain">&nbsp;&nbsp;&nbsp;附加费说明：{{djhData.attachedFeeExplain}}</span>
            </td>
            <td colspan="6">
              分包费
              <el-tooltip class="item" effect="dark" :content="'若器具为分包器具，可录入分包费用，分包费用通常为分包商收取的费用；'">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
              ：<span><el-input v-model="subcontractFee" style="width: 50%" size="mini" @change="verificateFbFee" ></el-input></span>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              费用录入人：{{feeAddPerson}}
            </td>
            <td colspan="6" v-if="djhData.historyFeeExplain">
              费用录入时间：{{feeAddTime | datehhmmss}}
            </td>
            <td colspan="18" v-else>
              费用录入时间：{{feeAddTime | datehhmmss}}
            </td>
            <td colspan="12" v-if="djhData.historyFeeExplain">
              历史费用说明：{{djhData.historyFeeExplain}}
            </td>
          </tr>
        </table>
      </div>
      <div style="width: 100%;margin-top: 20px;text-align: left">
        <div class="title-item" style="text-align: left;margin-bottom: 10px"><span>操作区</span> <el-button style="margin-left: 20px" size="mini" type="primary" @click="changeSample()" v-if="isReadOnly">按器具录费</el-button></div>
        <div style="text-align: left;margin-top: 10px" v-show="djhData.isDiscount=='1'">
          <el-Row>
            <el-col :span="2" style="text-align: right">
              折扣：
            </el-col>
            <el-col :span="4" >
              <el-input size="mini" style="width: 70%" v-model="discount_value" @change="verificateDiscount"></el-input>
              <el-input size="mini" v-show="false" v-model="discount"></el-input>
              <el-button type="primary" size="mini" @click="doDiscount">折扣</el-button>
            </el-col>
            <el-col :span="2" style="text-align: right">
              总收：
            </el-col>
            <el-col :span="4" >
              <el-input size="mini" style="width: 70%" v-model="totalCollection_value" @change="verificateTotalCollection"></el-input>
              <el-input size="mini" v-model="totalCollection" v-show="false"></el-input>
              <el-button type="primary" size="mini" @click="doTotalCollection">总收</el-button>
            </el-col>
            <el-col :span="2" style="text-align: right" v-show="isNeedVerify=='1'">
              申请原因：
            </el-col>
            <el-col :span="10" v-show="isNeedVerify=='1'">
              <font color="red">(*)</font>：<el-input size="mini" v-model="applyReason" style="width: 70%"></el-input>
            </el-col>
          </el-Row>
        </div>
        <el-Row v-show="!isReadOnly" style="margin-top: 10px">
          <el-col :span="2" style="text-align: right">
            器具名称
            <el-tooltip class="item" effect="dark" :content="'若受理时候的器具名称与实际检测的器具名称不一致，您可在此从计量器具库中重新选择正确的器具；'">
              <i class="el-icon-info ft12"></i>
            </el-tooltip>
            ：
          </el-col>
          <el-col :span="4" >
            <div style="width: 70%;float: left" >
              <applianceAutoCompelete v-model="qj_mc" @select-value="selectValue" ></applianceAutoCompelete>
            </div>
          </el-col>
          <el-col :span="2" style="text-align: right">
            附加费数量：
          </el-col>
          <el-col :span="4" >
            <span>
                <el-input v-model="additionalPoints_value" style="width: 70%" size="mini" @change="verificateFjpoint" :readonly="isReadOnly"></el-input>
                <el-input v-model="additionalPoints" v-show="false"></el-input>
                <el-button type="primary" size="mini" @click="toCalculateFjf">计 算</el-button>
            </span>
          </el-col>
        </el-Row>
        <div>
          <div class="title-item" style="margin-top: 10px"><span>应收费区域</span></div>
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
              <td>操作</td>
            </tr>
            <tr v-for="(temp,index) in chargeList">
              <td>
                <el-select style="width: 100%;" placeholder="请选择" v-model="temp.departId" size="mini" @change="getPersonList(index,temp.departId)">
                  <el-option
                    v-for="item in departNameData"
                    :label="item.departName"
                    :value="item.departId+''">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-select style="width: 100%;" placeholder="请选择" v-model="temp.commissionerId" size="mini" @change="toSynchronInfo(index)">
                  <el-option
                    v-for="item in temp.personList"
                    :label="item.userName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input style="width: 100%;" v-model="temp.jdf" size="mini" @change="toSynchronInfo(index)" :readonly="jcfPower || isReadOnly"></el-input>
              </td>
              <td>
                <el-input style="width: 100%;" v-model="temp.fjf" size="mini" readonly></el-input>
              </td>
              <td>
                <el-input style="width: 100%;" v-model="temp.jjf" size="mini" @change="toSynchronInfo(index)" readonly></el-input>
              </td>
              <td>
                <el-input style="width: 100%;" v-model="temp.xlf" size="mini" @change="toSynchronInfo(index)"></el-input>
              </td>
              <td>
                <el-input style="width: 100%;" v-model="temp.fwf" size="mini" @change="toSynchronInfo(index)"></el-input>
              </td>
              <td>
                <el-input style="width: 100%;" v-model="temp.qtf" size="mini" @change="toSynchronInfo(index)"></el-input>
              </td>
              <td>
                <el-input style="width: 100%;" readonly v-model="temp.totalActual" size="mini"></el-input>
              </td>
              <td>
                <el-input style="width: 100%;" v-model="temp.workload" size="mini" @change="toSynchronInfo(index)" readonly></el-input>
              </td>
              <td>
                <el-input style="width: 100%;" v-model="temp.intensiveWorkload" size="mini" @change="toSynchronInfo(index)" readonly></el-input>
              </td>
              <td style="text-align: center;width: 100px">
                <el-button @click="addLine(index)" type="el-button el-button--primary" style="padding: 2px; font-size: 14px;">增加</el-button>
                <el-button @click="delLine(index)" type="el-button el-button--danger" style="padding: 2px; font-size: 14px;">删除</el-button>
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
              <td>
                &nbsp;
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
              <td>{{defaultInfo.fee8}}
                <el-tooltip class="item" effect="dark" :content="'自检时实收'+defaultInfo.fee1+','+defaultInfo.fee2+','+defaultInfo.fee3+',累加到'+defaultInfo.fee8">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </td>
              <td>{{defaultInfo.fee9}}
                <el-tooltip class="item" effect="dark" :content="'强检时实收'+defaultInfo.fee1+','+defaultInfo.fee2+','+defaultInfo.fee3+',累加到'+defaultInfo.fee9">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </td>
              <td>操作</td>
            </tr>
            <tr v-for="(temp,index) in actualChargeList">
              <td>
                <el-select placeholder="请选择" v-model="temp.departId" size="mini" disabled="disabled">
                  <el-option
                    v-for="item in departNameData"
                    :label="item.departName"
                    :value="item.departId+''">
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
              <td>
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
              <td style="width: 100px">
                &nbsp;
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
          <el-button v-if="canModifyFee=='1'" type="primary" v-mindPopover="{message:'确定保存费用信息?',success:handleSubmit.bind(this),isOpen:handleOpen.bind(this)}">保 存</el-button>
          <el-button v-if="canModifyFee=='1'" type="danger" v-mindPopover="{message:'确定撤销收费?',success:cancelFee.bind(this)}">撤销收费</el-button>
          <el-button @click="handleCancel">取 消</el-button>
    </span>
    <!--器具修改费用弹窗页面-->
    <chargeSampleModify v-if="!!edit" :data="edit" :callback="handleEditCallback"></chargeSampleModify>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxSyncRequest,ajaxRequest,ajaxProxyRequest,formatDate} from '../../util/base';
  import ElRow from "@/common-el/packages/row/src/row";
  import ElCol from '@/common-el/packages/col/src/col';
  import chargeSampleModify from './chargeSampleModify';
  import applianceAutoCompelete from '../plan/applianceAutoCompelete.vue'

  let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
  export default {
    name: "charge-modify",
    props: {
      djhData: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        defaultInfo:{},//初始化页面字段名称
        canModifyFee:"0",//修改，撤销费用按钮显示规则0：不显示，1：显示
        feeAddTime:"",//费用添加人
        feeAddPerson:"",//费用添加时间

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
            personList:[]//人员列表
          }
        ],//实收费列表
        edit: null,//变更器具

        additionalPoints:0,//附加点
        additionalPoints_value:0,//附加点填写值
        subcontractFee:this.djhData.subcontractFee,//分包费
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
        isReadOnly:false,//只读判断依据
        isNeedVerify:"0",//是否需要审核标志位0:无需审核，1：需要审核
        applyReason:"",//打折申请原因

        qj_mc:this.djhData.applianceName,//器具名称
        new_qj_id:"",//变更器具后新的器具ID
        new_qj_mc:"",//变更器具后新的器具名称
        jcfPower:false,//检测费修改权限
      }
    },
    methods:{
      //关闭
      handleCancel(){
        this.callback();
      },
      //保存费用
      handleSubmit(){
        let _this = this;
        let resData = _this.validateSubmitData();
        if(resData==="error"){
          return;
        }
        let obj={
          registrationNo:_this.djhData.registrationNo,//登记号
          chargeList:_this.chargeList,//应收费列表
          actualChargeList:_this.actualChargeList,//实收费列表
          additionalPoints:_this.additionalPoints,//附加点
          subcontractFee:_this.subcontractFee,//分包费
          discount:_this.discount,//折扣
          isNeedVerify:_this.isNeedVerify,//是否需要审核（0：不需要；1：需要）
          applyReason:_this.applyReason,//折扣申请原因。
          totalCollection:_this.totalCollection,//总收值。
          isCompulsoryVerify:_this.djhData.isCompulsoryVerify,//总收值。
          //应收费合计
          totaljdf:_this.totaljdf,//检测费
          totalfjf:_this.totalfjf,//附加费
          totalxlf:_this.totalxlf,//修理费
          totaljjf:_this.totaljjf,//加急费
          totalfwf:_this.totalfwf,//服务费
          totalqtf:_this.totalqtf,//其他费
          totaltotalActual:_this.totaltotalActual,//小计
          totalworkload:_this.totalworkload,//工作量
          totalintensiveWorkload:_this.totalintensiveWorkload,//强检工作量

          //实收费合计
          actualtotaljdf:_this.actualtotaljdf,//检测费
          actualtotalfjf:_this.actualtotalfjf,//附加费
          actualtotalxlf:_this.actualtotalxlf,//修理费
          actualtotaljjf:_this.actualtotaljjf,//加急费
          actualtotalfwf:_this.actualtotalfwf,//服务费
          actualtotalqtf:_this.actualtotalqtf,//其他费
          actualtotaltotalActual:_this.actualtotaltotalActual,//小计
          actualtotalworkload:_this.actualtotalworkload,//工作量
          actualtotalintensiveWorkload:_this.actualtotalintensiveWorkload,//强检工作量

          new_qj_id:_this.new_qj_id,//变更器具后新的器具ID
          new_qj_mc:_this.new_qj_mc,//变更器具后新的器具名称
          is_discount:this.djhData.isDiscount//是否可打折
        };

        if(_this.isNeedVerify==="1"){
          _this.$confirm('您没有当前折扣权限，确认提交审核?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ajaxSyncRequest('post','back/charge/toModifyCharge/',{
              jsonStr : JSON.stringify(obj)
            },function (res){
              if(res.code === 200){
                _this.$message.success('保存成功！');
                _this.callback();
              }else if(res.code === 100){
                _this.$message.error(res.msg);
              }else{
                _this.$message.error('保存异常！');
              }
            }.bind(this));
          });
        }else{
          ajaxSyncRequest('post','back/charge/toModifyCharge/',{
            jsonStr : JSON.stringify(obj)
          },function (res){
            if(res.code === 200){
              _this.$message.success('保存成功！');
              _this.callback();
            }else if(res.code === 100){
              _this.$message.error(res.msg);
            }else{
              _this.$message.error('保存异常！');
            }

          }.bind(this));
        }
      },
      //保存前验证数据
      handleOpen(){
        let resData = this.validateSubmitData();
        if(resData==="error"){
          return false;
        }else{
          return true;
        }
      },
      //提交验证数据
      validateSubmitData(){
        let resData = "success";
        for (let i=0;i<this.chargeList.length;i++){
          if(this.chargeList[i].departId===""){
            this.$message.error('请选择第'+(i+1)+"行部门");
            resData = "error";
            break;
          }else if(this.chargeList[i].commissionerId===""){
            this.$message.error('请选择第'+(i+1)+"行检定员");
            resData = "error";
            break;
          }
        }
        if(this.isNeedVerify ==="1" && this.applyReason===""){
          this.$message.error("请输入打折申请原因！");
          resData = "error";
        }
        return resData;
      },
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
        _this.chargeList[index].commissionerId="";
        _this.actualChargeList[index].commissionerId="";
        _this.actualChargeList[index].departId=departId;
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
      //增加行方法
      addLine(index){
        this.chargeList.push({
          departId:this.chargeList[index].departId,//部门
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
        this.actualChargeList.push({
          departId:this.actualChargeList[index].departId,//部门
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
        this.divideAllFee();
        this.toSynchronInfo(0);
        this.getPersonList(this.chargeList.length-1,this.chargeList[index].departId)
      },
      //删除行方法
      delLine(index){
        if(this.chargeList.length===1){
          this.$message.error('至少保留一条数据！');
          return;
        }else{
          this.chargeList.splice(index,1);
          this.actualChargeList.splice(index,1);
        }
        this.divideAllFee();
        this.toSynchronInfo(0);
      },
      //应收费区域修改同步实收费区域方法
      toSynchronInfo(index){
        this.verificate();

        let info = 0;
        for(let a=0;a<this.chargeList.length;a++){
            if(this.chargeList[index].commissionerId ==this.chargeList[a].commissionerId && this.chargeList[a].commissionerId !=""){
              info = info + 1;
            }
        }
        if(info>1){
          this.$message.error("同一个检定员不允许录入多次费用信息");
          this.chargeList[index].commissionerId="";
          return;
        }
        //应收费合计
        this.totaljdf=0;//检测费
        this.totalfjf=0;//附加费
        this.totalxlf=0;//修理费
        this.totaljjf=0;//加急费
        this.totalfwf=0;//服务费
        this.totalqtf=0;//其他费
        this.totaltotalActual=0;//小计
        this.totalworkload=0;//工作量
        this.totalintensiveWorkload=0;//强检工作量

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

        for(let i=0;i<this.chargeList.length;i++){
          if(this.chargeList[i].jdf=="")this.chargeList[i].jdf=parseFloat(0.00).toFixed(2);
          if(this.chargeList[i].fjf=="")this.chargeList[i].fjf=parseFloat(0.00).toFixed(2);
          if(this.chargeList[i].xlf=="")this.chargeList[i].xlf=parseFloat(0.00).toFixed(2);
          if(this.chargeList[i].jjf=="")this.chargeList[i].jjf=parseFloat(0.00).toFixed(2);
          if(this.chargeList[i].fwf=="")this.chargeList[i].fwf=parseFloat(0.00).toFixed(2);
          if(this.chargeList[i].qtf=="")this.chargeList[i].qtf=parseFloat(0.00).toFixed(2);
          if(this.chargeList[i].totalActual=="")this.chargeList[i].totalActual=parseFloat(0.00).toFixed(2);
          if(this.chargeList[i].workload=="")this.chargeList[i].workload=parseFloat(0.00).toFixed(2);
          if(this.chargeList[i].intensiveWorkload=="")this.chargeList[i].intensiveWorkload=parseFloat(0.00).toFixed(2);

          if(this.djhData.isUrgent!='0'){//加急计算加急费
            this.chargeList[i].jjf = parseFloat(parseFloat(this.chargeList[i].jdf) * parseFloat(this.djhData.urgentProportions)/100).toFixed(2);
          }

          this.chargeList[i].totalActual = (parseFloat(this.chargeList[i].jdf)+
            parseFloat(this.chargeList[i].fjf)+
            parseFloat(this.chargeList[i].xlf)+
            parseFloat(this.chargeList[i].jjf)+
            parseFloat(this.chargeList[i].fwf)+
            parseFloat(this.chargeList[i].qtf)).toFixed(2);


          this.actualChargeList[i].departId=this.chargeList[i].departId;
          this.actualChargeList[i].commissionerId=this.chargeList[i].commissionerId;
          this.actualChargeList[i].xlf=this.chargeList[i].xlf;
          this.actualChargeList[i].fwf=this.chargeList[i].fwf;
          this.actualChargeList[i].qtf=this.chargeList[i].qtf;
          this.actualChargeList[i].totalActual=this.chargeList[i].totalActual;
          this.actualChargeList[i].personList=this.chargeList[i].personList;
          if(this.djhData.source==1) {//自检
            this.actualChargeList[i].jdf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].fjf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].jjf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].workload=parseFloat(this.chargeList[i].workload)
                                                                    +parseFloat(this.chargeList[i].jdf)
                                                                    +parseFloat(this.chargeList[i].fjf)
                                                                    +parseFloat(this.chargeList[i].jjf).toFixed(2);
            this.actualChargeList[i].intensiveWorkload=this.chargeList[i].intensiveWorkload;
          }else if(this.djhData.isCompulsoryVerify=="1") {//强检
            this.actualChargeList[i].jdf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].fjf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].jjf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].intensiveWorkload=parseFloat(this.chargeList[i].intensiveWorkload)
                                                                    +parseFloat(this.chargeList[i].jdf)
                                                                    +parseFloat(this.chargeList[i].fjf)
                                                                    +parseFloat(this.chargeList[i].jjf).toFixed(2);
            this.actualChargeList[i].workload=this.chargeList[i].workload;
          }else{
            this.actualChargeList[i].jdf=this.chargeList[i].jdf;
            this.actualChargeList[i].fjf=this.chargeList[i].fjf;
            this.actualChargeList[i].jjf=this.chargeList[i].jjf;
            this.actualChargeList[i].intensiveWorkload=this.chargeList[i].intensiveWorkload;
            this.actualChargeList[i].workload=this.chargeList[i].workload;
          }

          //应收费合计
          this.totaljdf = parseFloat(parseFloat(this.totaljdf) + parseFloat(this.chargeList[i].jdf)).toFixed(2);//检测费
          this.totalfjf = parseFloat(parseFloat(this.totalfjf) + parseFloat(this.chargeList[i].fjf)).toFixed(2);//附加费
          this.totalxlf = parseFloat(parseFloat(this.totalxlf) + parseFloat(this.chargeList[i].xlf)).toFixed(2);//修理费
          this.totaljjf = parseFloat(parseFloat(this.totaljjf) + parseFloat(this.chargeList[i].jjf)).toFixed(2);//加急费
          this.totalfwf = parseFloat(parseFloat(this.totalfwf) + parseFloat(this.chargeList[i].fwf)).toFixed(2);//服务费
          this.totalqtf = parseFloat(parseFloat(this.totalqtf) + parseFloat(this.chargeList[i].qtf)).toFixed(2);//其他费
          this.totaltotalActual = parseFloat(parseFloat(this.totaltotalActual) + parseFloat(this.chargeList[i].totalActual)).toFixed(2);//小计
          this.totalworkload = parseFloat(parseFloat(this.totalworkload) +  parseFloat(this.chargeList[i].workload)).toFixed(2);//工作量
          this.totalintensiveWorkload = parseFloat(parseFloat(this.totalintensiveWorkload) + parseFloat(this.chargeList[i].intensiveWorkload)).toFixed(2);//强检工作量

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
        this.doDiscount();
      },
      //计算附加费
      toCalculateFjf(){
        this.additionalPoints_value = parseFloat(this.additionalPoints_value).toFixed(2);
        let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
        if (!regu.test(this.additionalPoints_value)) {
          this.additionalPoints_value=0;
        }
        this.additionalPoints = this.additionalPoints_value;
        let totalFjf = parseFloat(parseFloat(this.djhData.attachedFee)*parseFloat(this.additionalPoints)).toFixed(2);
        let perFjf = (totalFjf/this.chargeList.length).toFixed(2);

        for(let i=0; i<this.chargeList.length; i++){
          if(this.chargeList.length===1){
            this.chargeList[i].fjf=parseFloat(totalFjf).toFixed(2);
          }else if(i===this.chargeList.length-1){
            this.chargeList[i].fjf = parseFloat(totalFjf-(perFjf*(this.chargeList.length-1))).toFixed(2);
          }else{
            this.chargeList[i].fjf = parseFloat(perFjf).toFixed(2);
          }
        }

        this.toSynchronInfo(0);
      },
      //验证费用大于0
      verificate(){
        let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
        for(let i=0;i<this.chargeList.length;i++){
          let arr = ["jdf","fjf","xlf","jjf","fwf","qtf","totalActual","workload","intensiveWorkload"];
          for(let a =0;a<arr.length;a++){
            let val = this.chargeList[i][arr[a]];
            if (val != "") {
              if (!regu.test(val)) {
                this.chargeList[i][arr[a]]=0.00;
              }else{
                this.chargeList[i][arr[a]] = parseFloat(this.chargeList[i][arr[a]]).toFixed(2);
              }
            }
          }
        }
      },
      //验证分包费大于0
      verificateFbFee(){
        let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
        if (this.subcontractFee != "") {
          if (!regu.test(this.subcontractFee)) {
            this.subcontractFee=0.00;
          }else{
            this.subcontractFee = parseFloat(this.subcontractFee).toFixed(2);
          }
        }else{
          this.subcontractFee = 0.00;
        }
      },
      //验证附加点大于0
      verificateFjpoint(){
        let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
        if (this.additionalPoints_value != "") {
          if (!regu.test(this.additionalPoints_value)) {
            this.additionalPoints_value=0.00;
          }else{
            this.additionalPoints_value = parseFloat(this.additionalPoints_value).toFixed(2);
          }
        }else{
          this.additionalPoints_value = 0.00;
        }
      },
      //平分费用
      divideAllFee(){
        let arrTotal = ["totaljdf","totalfjf","totalxlf","totaljjf","totalfwf","totalqtf","totaltotalActual","totalworkload","totalintensiveWorkload"];
        for(let a =0;a<arrTotal.length;a++){
          let arrFee = ["jdf","fjf","xlf","jjf","fwf","qtf","totalActual","workload","intensiveWorkload"];

          let totalFee = this[arrTotal[a]];
          let perFee = parseFloat(totalFee/this.chargeList.length).toFixed(2);

          for(let i=0; i<this.chargeList.length; i++){
            if(this.chargeList.length===1){
              this.chargeList[i][arrFee[a]]=totalFee;
            }else if(i===this.chargeList.length-1){
              this.chargeList[i][arrFee[a]] = (totalFee-(perFee*(this.chargeList.length-1))).toFixed(2);
            }else{
              this.chargeList[i][arrFee[a]] = perFee;
            }
          }
        }
      },
      //折扣输入值验证
      verificateDiscount(){
        let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
        if (this.discount_value != "") {
          if (!regu.test(this.discount_value)) {
            this.discount_value="";
          }else{
            this.discount_value = parseFloat(this.discount_value).toFixed(2);
          }
        }
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
          if(this.djhData.source==1) {//自检
            this.actualChargeList[i].jdf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].fjf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].jjf=parseFloat(0.00).toFixed(2);
            this.actualChargeList[i].workload=parseFloat((parseFloat(this.chargeList[i].workload)
                                                          +parseFloat(this.chargeList[i].jdf)
                                                          +parseFloat(this.chargeList[i].fjf)
                                                          +parseFloat(this.chargeList[i].jjf))*this.discount).toFixed(2);
            this.actualChargeList[i].intensiveWorkload = parseFloat(this.chargeList[i].intensiveWorkload*this.discount).toFixed(2);
          }else if(this.djhData.isCompulsoryVerify=="1") {//强检
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

        //验证是否有打折权限
        this.havePowerForDiscount();
      },
      //总收输入值验证
      verificateTotalCollection(){
        let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
        if (this.totalCollection_value != "") {
          if (!regu.test(this.totalCollection_value)) {
            this.totalCollection_value="";
          }else{
            if(this.actualtotaltotalActual===0){
              this.totalCollection_value = 0.00;
            }else{
              this.totalCollection_value = parseFloat(this.totalCollection_value).toFixed(2);
            }
          }
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
        if(this.djhData.source==1) {//自检
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
        }else if(this.djhData.isCompulsoryVerify=="1") {//强检
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

        //验证是否有打折权限
        this.havePowerForDiscount();
      },
      //变更器具按钮事件
      changeSample(){
        this.edit = {
          registrationNo:this.djhData.registrationNo,
          qj_mc:this.djhData.applianceActualName,
          qj_bh:this.djhData.applianceId,
          fjfsm:this.djhData.attachedFeeExplain,
          jdfsm:this.djhData.detectionFeeExplain,
          fjf_norm:this.djhData.attachedFee,
          jdf:parseFloat(this.djhData.detectionFee),
          attachedFee:this.djhData.attachedFee,
          isUrgent:this.djhData.isUrgent,
          urgentProportions:this.djhData.urgentProportions,
        };
      },
      //器具变更弹窗回调事件
      handleEditCallback(rowInfo){
        if(rowInfo.feeType=="1"){
          this.additionalPoints=rowInfo.additionalPoints;
          this.additionalPoints_value = rowInfo.additionalPoints;
          this.totalfjf = rowInfo.fjf;
          this.actualtotalfjf = rowInfo.fjfActual;
          this.totaljdf = rowInfo.jdf;
          this.actualtotaljdf = rowInfo.jdfActual;
          this.divideAllFee();
          this.toSynchronInfo(0);

          this.isReadOnly=true;
        }
        this.edit=null;
      },
      //初始化进入加载费用数据
      loadInfoFristIntoPage(){
        let _this = this;
        ajaxRequest('get','back/charge/getRegistrationFeeInfoAndBackSample',{registrationNo:_this.djhData.registrationNo},function(res){
          if(res.code === 200){
            let resData=res.map;
            _this.canModifyFee = resData.canModifyFee;
            _this.feeAddTime = res.map.chargeDetail.addTime;//费用添加人
            _this.feeAddPerson = res.map.chargeDetail.userName;//费用添加时间
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

            if(resMap.discountType===1){//总收
              _this.totalCollection_value=parseFloat(parseFloat(resMap.totalActual)+parseFloat(resMap.intensiveWorkloadActual)).toFixed(2);
              _this.totalCollection=parseFloat(parseFloat(resMap.totalActual)+parseFloat(resMap.intensiveWorkloadActual)).toFixed(2);
              _this.discount = parseFloat(resMap.discount).toFixed(2);
            }else{
              _this.discount_value = parseFloat(resMap.discount).toFixed(2);
              _this.discount = parseFloat(resMap.discount).toFixed(2);
            }
            if(_this.djhData.chargeType===1){//按样品收费
              _this.isReadOnly=true;
            }else{
              _this.isReadOnly=false;
            }
          }
        });
      },
      //判断是否具有打折权限
      havePowerForDiscount(){
        if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
          btnPower = "@@";
        }
        this.isNeedVerify = "0";//无需申请打折
        if(this.djhData.contractNo!=null && this.djhData.contractDiscount!=null){//合同折扣
          if(parseFloat(this.discount) < parseFloat(this.djhData.contractDiscount)){
            if(btnPower.indexOf("@M7115@")!=-1){//折扣申请高级权限 可打折所有折扣
              this.isNeedVerify = "0";//无需申请打折
            }else if(btnPower.indexOf("@M7110@")!=-1){//折扣申请中级权限 可打折0.7折以上折扣
              if(parseFloat(this.discount) < parseFloat(this.defaultInfo.dcCountLevel2)){
                this.isNeedVerify = "1";//需要申请打折
              }
            }else if(btnPower.indexOf("@M7105@")!=-1){//折扣申请低级权限 可打折0.9折以上折扣
              if(parseFloat(this.discount) < parseFloat(this.defaultInfo.dcCountLevel1)){
                this.isNeedVerify = "1";//需要申请打折
              }
            }else {
              if(parseFloat(this.discount) < 1){//折扣小于1都需要申请打折
                this.isNeedVerify = "1";//需要申请打折
              }
            }
          }
        }else{
          if(btnPower.indexOf("@M7115@")!=-1){//折扣申请高级权限 可打折所有折扣
            this.isNeedVerify = "0";//无需申请打折
          }else if(btnPower.indexOf("@M7110@")!=-1){//折扣申请中级权限 可打折0.7折以上折扣
            if(parseFloat(this.discount) < parseFloat(this.defaultInfo.dcCountLevel2)){
              this.isNeedVerify = "1";//需要申请打折
            }
          }else if(btnPower.indexOf("@M7105@")!=-1){//折扣申请低级权限 可打折0.9折以上折扣
            if(parseFloat(this.discount) < parseFloat(this.defaultInfo.dcCountLevel1)){
              this.isNeedVerify = "1";//需要申请打折
            }
          }else {
            if(parseFloat(this.discount) < 1){//折扣小于1都需要申请打折
              this.isNeedVerify = "1";//需要申请打折
            }
          }
        }
      },
      //撤销收费
      cancelFee(){
        let _this = this;
        ajaxSyncRequest('post','back/charge/cancelFee',{registrationNo:_this.djhData.registrationNo},function(res) {
          if (res.code === 200) {
            _this.$message.success('操作成功！');
            _this.handleCancel();
          }else if(res.code === 100){
            _this.$message.error(res.msg);
          }else{
            _this.$message.error('系统异常！');
          }
        });
      },
      //器具下拉框选中事件
      selectValue(row){
        this.djhData.isDiscount = row.isDiscount;
        this.djhData.detectionFee = row.detectionFee;
        this.djhData.detectionFeeExplain = row.detectionFeeExplain;
        this.djhData.attachedFee = row.attachedFee;
        this.djhData.attachedFeeExplain = row.attachedFeeExplain;
        this.djhData.applianceName = row.applianceName;
        this.qj_mc = row.applianceName;
        this.new_qj_id = row.id;
        this.new_qj_mc = row.applianceName;


        if(row.isDiscount!==1){//不可打折
          this.discount_value="";//折扣填写值
          this.discount="1";//折扣值
          this.totalCollection_value="";//总收填写值
          this.totalCollection="";//总收值
        }
        this.totaljdf=parseFloat(this.djhData.detectionFee)*parseFloat(this.data.setNumber)*parseFloat(this.data.pieceNumber);//检测费
        this.divideAllFee();
        this.toCalculateFjf();
      },
    },
    components:{
      ElCol,
      ElRow,
      chargeSampleModify,
      applianceAutoCompelete
    },
    mounted() {
      this.ajaxDepartNameObj();
      this.loadInfoFristIntoPage();
      // 获取费用名称，打折点
      ajaxProxyRequest('get','/njmind/findParams/fee1$fee2$fee3$fee4$fee5$fee6$fee7$fee8$fee9$dcCountLevel1$dcCountLevel2',{},(res)=>{
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
          dcCountLevel1:res.dcCountLevel1.value,
          dcCountLevel2:res.dcCountLevel2.value,
        }
      });
      if(btnPower.indexOf("@M16450@") !=-1){//检测费修改权限
        this.jcfPower = false;
      }else{
        this.jcfPower = true;
      }
    },
    filters: {
      dateyymmdd(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      },
      datehhmmss(myInput) {
        return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
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
