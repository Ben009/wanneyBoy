<template>
  <mind-dialog
    :title="'器具收费'"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="mid"
    appendToBody
    @close="handleCancel">
    <div>
      <span style="margin-left: 95%">
        <global-tootips>
          <p>1、	登记号下多套器具存在不同收费标准时，可针对同样收费标准的器具勾选批量录入费用；</p>
          <p>2、	可从计量器具库中重新选择正确的记录；</p>
          <p>3、	已经按器具收费的器具若不需要按每器具收费时，可点击撤消收费；</p>
        </global-tootips>
      </span>
    </div>
    <div v-if="returnList.length>0">
      <div class="title-item"><span>退件区</span></div>
      <div style="padding-bottom: 10px;padding-top: 10px">
          <el-checkbox-group v-model="returnListChecked">
            <el-checkbox v-for="returned in returnList" disabled :key="returned.sampleBh" :label="returned.sampleBh">{{returned.sampleBh}}</el-checkbox>
          </el-checkbox-group>
      </div>
    </div>
    <div v-if="chargedList.length>0">
      <div class="title-item">
        <span>已收费区&nbsp;&nbsp;&nbsp;
          <el-checkbox v-model="chargedCheckAll" @change="handleChargedCheckAllChange">全选</el-checkbox>
        </span>&nbsp;&nbsp;&nbsp;
      </div>
      <div style="padding-bottom: 10px;padding-top: 10px">
        <el-checkbox-group v-model="chargedListChecked" @change="handleCheckedChargedChange">
              <el-checkbox v-for="charged in chargedList" :key="charged.sampleBh" :label="charged.sampleBh">
                  {{charged.sampleBh}}<span style="color: red">({{charged.jdfActual}})</span>
              </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="title-item"><span>操作区</span></div>
    <div style="margin-top: 10px">
      <el-Row>
        <el-col :span="3" style="text-align: right">
          器具名称：
        </el-col>
        <el-col :span="9" >
          <div style="width: 70%;float: left" >
            <applianceAutoCompelete v-model="qj_mc" @select-value="selectValue"></applianceAutoCompelete>
          </div>
        </el-col>
        <el-col :span="3" style="text-align: right">
          附加费数量：
        </el-col>
        <el-col :span="9">
          <el-input v-model="fjd" style="width: 70%" size="mini" type="number"></el-input>
          <el-button type="primary" size="mini" @click="sumFjf">计 算</el-button>
        </el-col>
      </el-Row>
      </el-Row>
      <el-Row style="margin-top: 10px">
        <el-col :span="3" style="text-align: right">
          收费标准：
        </el-col>
        <el-col :span="9">
          {{jdf_norm}}<span v-if="fjf_norm>0">/{{fjf_norm}}</span>
        </el-col>
        <el-col :span="3" style="text-align: right">
          收费说明：
        </el-col>
        <el-col :span="9">
          {{jdfsm}}<span v-if="fjfsm">；附加费说明：{{fjfsm}}</span>
        </el-col>
      </el-Row>
      <el-Row style="margin-top: 10px">
        <el-col :span="3" style="text-align: right">
          {{defaultInfo.fee1}}：
        </el-col>
        <el-col :span="5">
          <el-input type="number" v-model="jdf" size="mini" @change="toSynchronJjf" :readonly="jcfPower"></el-input>
        </el-col>
        <el-col :span="3" style="text-align: right">
          {{defaultInfo.fee2}}
          <el-tooltip class="item" effect="dark" :content="'附加费由 附加费数量*'+defaultInfo.fee2+'计算，不可直接修改'">
            <i class="el-icon-info ft12"></i>
          </el-tooltip>
          ：
        </el-col>
        <el-col :span="5">
          <el-input type="number" v-model="fjf" size="mini" readonly></el-input>
        </el-col>
        <el-col :span="3" style="text-align: right">
          {{defaultInfo.fee3}}
          <el-tooltip class="item" effect="dark" :content="'如果器具被加急，加急费由 加急比例*'+defaultInfo.fee1+'计算，不可直接修改'">
            <i class="el-icon-info ft12"></i>
          </el-tooltip>
          ：
        </el-col>
        <el-col :span="5">
          <el-input type="number" v-model="jjf" size="mini" readonly></el-input>
        </el-col>
      </el-Row>
      <el-Row style="margin-top: 10px">
        <el-col :span="3" style="text-align: right">
          已录入合计：
        </el-col>
        <el-col :span="4">
          {{defaultInfo.fee1}}：{{jcfTotal}}
        </el-col>
        <el-col :span="4">
          {{defaultInfo.fee2}}：{{fjfTotal}}
        </el-col>
        <el-col :span="4">
          {{defaultInfo.fee3}}：{{jjfTotal}}
        </el-col>
      </el-Row>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="handleSubmit">保 存</el-button>
        <el-button size="mini" @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  import $ from 'jquery';
  import applianceAutoCompelete from '../plan/applianceAutoCompelete.vue'
  let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
  const defaults = {
  };
  export default {
    components: {
      applianceAutoCompelete
    },
    name: "charge-sample-modify",
    props: {
      data: {
        type: Object,
        require: true
      },
      callback: {
        type: Function,
        require: true
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        jcfTotal:0,//检测费合计
        fjfTotal:0,//附加费合计
        jjfTotal:0,//加急费合计
        fjf:this.data.attachedFee,//附加费
        fjd:0,//附加点
        fjf_norm:this.data.fjf_norm,//器具库附加费
        jdf_norm:this.data.fjf_norm,//器具库检测费
        jdf:this.data.jdf,//检测费
        fjfsm:this.data.fjfsm,//附加费说明
        jdfsm:this.data.jdfsm,//检测费说明
        qj_mc:this.data.qj_mc,//器具名称
        qj_bh:this.data.qj_bh,//器具编号
        isUrgent:this.data.isUrgent,//是否加急
        urgentProportions:this.data.urgentProportions,//加急比例
        jjf:this.data.isUrgent!=0?parseFloat(parseFloat(this.data.jdf)*parseFloat(this.data.urgentProportions)/100).toFixed(2):0,
        returnList:[],//退件区列表
        chargedList:[],//已收费区列表
        unChargeList:[],//未收费1区列表
        returnListChecked:[],//退件区已选列表
        chargedListChecked:[],//已收费区已选列表
        unChargeListChecked:[],//未收费区已选列表
        chargedCheckAll: true,//已收费区全选
        unChargCheckAll: false,//未收费区全选
        registrationNo:this.data.registrationNo,//登记号

        jcfPower:false,//检测费修改权限
        defaultInfo:{},//初始化名称
      }
    },
    mounted() {
      this.ajaxSampleList();
      if(btnPower.indexOf("@M16450@") !=-1){//检测费修改权限
        this.jcfPower = false;
      }else{
        this.jcfPower = true;
      };
      //获取费用名称
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
      });
    },
    created(){

    },
    methods: {
      //计算附加费
      sumFjf(){
        this.fjf=this.fjd*this.fjf_norm;
      },
      //器具下拉框选中事件
      selectValue(row){
        this.qj_bh = row.id;
        this.qj_mc = row.applianceName;
        this.fjfsm = row.attachedFeeExplain;
        this.jdfsm = row.detectionFeeExplain;
        this.fjf_norm = row.attachedFee == null? 0: row.attachedFee;
        this.fjd = 0;
        this.fjf = 0;
        this.jdf = parseFloat(row.detectionFee);//检测费;
        this.jdf_norm = parseFloat(row.detectionFee);//器具库检测费;
        this.toSynchronJjf();
      },
      //退件区、已收费区、未收费区初始化数据
      ajaxSampleList(){
        let _this = this;
        ajaxRequest('get','back/charge/queryRegistrationNoSample',{registrationNo:this.registrationNo},function(res){
          _this.chargedListChecked = [];
          _this.unChargeListChecked = [];
          _this.chargedList = res.daoResult.chargedList;
          _this.returnList = res.daoResult.returnList;
          _this.unChargeList = res.daoResult.unChargedList;
          _this.handleChargedCheckAllChange();
          for(let i=0;i<_this.chargedList.length;i++){
            _this.jcfTotal = parseFloat(parseFloat(_this.jcfTotal) + parseFloat(_this.chargedList[i].jdfActual)).toFixed(2);
            _this.fjfTotal = parseFloat(parseFloat(_this.fjfTotal) + parseFloat(_this.chargedList[i].fjfActual)).toFixed(2);
            _this.jjfTotal = parseFloat(parseFloat(_this.jjfTotal) + parseFloat(_this.chargedList[i].jjfActual)).toFixed(2);
          }
        })
      },
      //样品费用提交
      handleSubmit() {
        let info={};
        let _this=this;
        if(_this.qj_bh==null || _this.qj_bh==""){
          _this.$message.error("请选择计量器具！");
          return;
        }
        info.fjd=_this.fjd;
        info.fjf=_this.fjf;
        info.fjfActual=_this.fjf;
        info.jdf=_this.jdf;
        info.jdfActual=_this.jdf;
        info.qj_bh=_this.qj_bh;
        info.registrationNo=_this.registrationNo;
        if(_this.chargedListChecked.length>0){
          info.sampleBh=_this.chargedListChecked;
        }
        if(_this.unChargeListChecked.length>0){
          info.sampleBh=_this.unChargeListChecked;
        }
        if(!info.sampleBh){
          _this.$message.error("请选择要修改的器具编号！");
          return;
        }
        ajaxRequest('post','back/charge/modifySampleCharge',{json:JSON.stringify(info)},function(res){
          if(res.code == 200){
            _this.$message.success('提交成功');
            _this.ajaxSampleList();
          }
        })
      },
      handleCancel(){
        let _this=this;
        ajaxRequest('get','back/charge/getRegistrationNoTempTotalFee',{registrationNo:this.registrationNo},function(res){
          if(res.code == 200){
            let data=res.daoResult;
            data.feeType='1';//费用录入方式：1样品，0非样品
            _this.callback(data);
          }
        })
      },
      //已收费区域全选按钮事件
      handleChargedCheckAllChange() {
        let temp= [];
        this.chargedList.forEach(val => {
          temp.push(val.sampleBh)
        });
        if(!this.chargedCheckAll){
          temp=[];
        }
        this.chargedListChecked = temp.length>0 ? temp: [];
      },
      //已收费区域勾选事件
      handleCheckedChargedChange(value) {
        if(this.chargedListChecked.length>0){
          for(var i=0;i<this.chargedList.length;i++){
            if(this.chargedList[i].sampleBh===this.chargedListChecked[(this.chargedListChecked.length-1)]){
              this.qj_bh = this.chargedList[i].applianceId;
              this.qj_mc = this.chargedList[i].sampleName;
              this.fjfsm = this.chargedList[i].attachedFeeExplain;
              this.jdfsm = this.chargedList[i].detectionFeeExplain;
              this.fjf_norm = this.chargedList[i].attachedFee == null? 0: this.chargedList[i].attachedFee;
              this.jdf_norm = this.chargedList[i].detectionFee == null? 0: this.chargedList[i].detectionFee;
              this.fjd = this.chargedList[i].additionalPoints;
              this.fjf = this.chargedList[i].fjfActual;
              this.jdf = this.chargedList[i].jdfActual;//检测费;
              this.jjf = this.chargedList[i].jjfActual;//加急费;
              break;
            }else{
              continue;
            }
          }
        }

        let checkedCount = value.length;
        this.chargedCheckAll = checkedCount === this.chargedList.length;
      },
      toSynchronJjf(){
        if (this.data.isUrgent!=0){
          this.jjf = parseFloat(parseFloat(this.jdf)*parseFloat(this.urgentProportions)/100).toFixed(2);
        }else{
          this.jjf = parseFloat(0.00).toFixed(2)
        }
      }
    }
  }
</script>

<style>
  .right-click-menu {
    position: fixed;
    border: 1px solid #ccc;
    padding: 2px 0;
    background: #fff;
    width: 100px;
    z-index: 9999;
  }

  .right-click-menu li {
    padding: 3px 10px;
    cursor: default;
    font-size: 14px;
    color: #606266;
  }

  .right-click-menu li:hover {
    color: #409eff;
  }

  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

</style>
