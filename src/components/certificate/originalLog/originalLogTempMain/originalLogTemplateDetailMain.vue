<template>
  <div ref="certificate-page">
        <div class="topButton" ref="topBut">
          <!--{{form.mbName}}-->
          <!--<el-button type="primary" @click="handleSubmit" size="small">保存模板</el-button>-->
          <el-button type="primary" :disabled="!canSaveBut" @click="handleSubmit" size="small" class="certificateButton">保存模板</el-button>
          <el-button type="primary" v-if="jgyTempType == 'exl'" @click="handleExcel" class="certificateButton">Excel模板</el-button>
          <el-button type="primary" @click="addJzgc" class="certificateButton">增加技术规程</el-button>
          <el-button type="primary" @click="addJlbz" class="certificateButton">增加计量标准</el-button>
          <el-button type="primary" @click="addJlbzq" class="certificateButton">增加计量标准器</el-button>
          <el-button type="primary" @click="changeAuditFlag(0,0,0)" :disabled="auditFlag != 0 " size="small" class="certificateButton">提交审核</el-button><!--auditFlag-->
          <el-button type="primary" @click="changeAuditFlag(1,1,0)" :disabled="auditFlag != 1" size="small" class="certificateButton">取消提交</el-button><!--auditFlag-->
          <el-button type="primary" @click="changeAuditFlag(0,1,0)" :disabled="(auditFlag != 1 )" size="small" v-has="'M27010'" class="certificateButton">一级审核</el-button>
          <el-button type="primary" @click="changeAuditFlag(1,2,0)" :disabled="(auditFlag != 2 )" size="small" v-has="'M27010'" class="certificateButton">一级审核取消</el-button>
          <el-button type="primary" @click="changeAuditFlag(0,2,0)" :disabled="(auditFlag != 2 ) " size="small" v-has="'M27011'" class="certificateButton">二级审核</el-button>
          <el-button type="primary" @click="changeAuditFlag(1,3,0)" :disabled="(auditFlag != 3 ) " size="small" v-has="'M27011'" class="certificateButton">二级审核取消</el-button>
          <el-select size="mini" v-model="jgyTempType" style="width:100px"
                     @change="setJgyTempType"
          >
            <el-option key="exl" label="Excel模板" value="exl" >
              Excel模板
            </el-option>
            <el-option key="html" label="HTml主模板" value="html" >
              HTml主模板
            </el-option>
          </el-select>
          <el-button type="primary" v-if="jgyTempType == 'html'" @click="relationJgy"  size="small" class="certificateButton">关联HTml主模板</el-button>
          <el-button type="primary" @click="relationXxy" size="small" class="certificateButton">关联信息页主模板</el-button>

          <!--<el-select size="mini" v-model="mainCertificateJdzq" style="width:100px"-->
                     <!--@change="setCertificateJdzq"-->
                     <!--:disabled="!canSaveBut"-->
          <!--&gt;-->
            <!--<el-option  ref="certificateJdzqSel"-->
                        <!--v-for="certificateJdzq in certificateJdzqArr" :key="certificateJdzq.code"-->
                        <!--:label="certificateJdzq.remark" :value="certificateJdzq.code"-->
            <!--&gt;-->
              <!--{{certificateJdzq.remark}}-->
            <!--</el-option>-->
          <!--</el-select>-->
        </div>
        <div class="certForm" :style="{'max-height':certificateMaxHeight+'px' }">
          <OriginalLogTemplateDetail ref="originalLogTemplateDetail"
                                      @setAuditFlag="setAuditFlag"
                                     :certificateCanEdit="canSaveBut"
                                     :setMainCertificateJdzq = "setMainCertificateJdzq"
                                     :changeJdyNoCkeck="changeJdyNoCkeck"
                                     :canChangeCertificateGcInfo="canChangeCertificateGcInfo"
                                     :canModifyCertificateGcInfo="canModifyCertificateGcInfo"
                                     :getJgyTempType="getJgyTempType"
          ></OriginalLogTemplateDetail>
        </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {ajaxRequest, ajaxProxyRequest} from '../../../util/base'
import $ from 'jquery'
import OriginalLogTemplateDetail from './originalLogTemplateDetail.vue'
export default {
  name: 'OriginalLogTemplateDetailMain',
  components: {
    /** 模块对象 import 进来 后的别名  */
    OriginalLogTemplateDetail
  },
  props: {
    // 获得父页面传进来的参数
    mbId: {default: null},
    // 模板维护时修改检定员信息
    changeJdyNoCkeck: {default: false}
  },
  data () {
    return {
      form: {},
      rules: {
      },
      //        loading: false,
      //        remoteOptions: [],
      //        kindEditor : null ,
      //        jgyMainContentMap: null,
      //        jgyIdArray:[],
      //        jgyContentArray:[],
      //        jgyShowArray:[],
      isRouterAlive: false,
      auditFlag: 0,
      canSaveBut: false,
      auditOneFlagBun: false,
      auditTwoFlagBun: false,
      certificateJdzqArr: [],
      mainCertificateJdzq: 12,
      certificateMaxHeight:'',
      canModifyCertificateGcInfo:true,
      canChangeCertificateGcInfo:true,
      jgyTempType:"exl",
    }
  },
  watch: {
    // 监听参数的变化
    //      mbId(){
    //        this.reload();
    //      }
    innerWidth(v){
         //写入触发的事件方法
         this.formTop = this.$refs.topBut.clientHeight+'px';
         this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
     },
    innerHeight(v){
      this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
    }
  },
    activated(){//keepalive 缓存重新反序列化
    this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
  },
  created () {
    // 获得检定周期
    this.getCertificateJdzqArr()
  },
  mounted () {
    this.$refs.originalLogTemplateDetail.getOriginalLogTemplateDetail(this.mbId)
    this.auditFlag = this.$refs.originalLogTemplateDetail.getAuditFlag()
    this.setButtonPower()
    this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
  },
  methods: {
    handleSubmit () {
      this.$refs.originalLogTemplateDetail.handleSubmit()
    },
    handleExcel () {
      this.$refs.originalLogTemplateDetail.openExcelDialog();
    },
    changeAuditFlag (type, step, actionType) {
      if (this.$refs.originalLogTemplateDetail.$refs.originalLogTempXxy.getContent().length < 20) {
        this.$message.warning('信息页不能为空')
        return
      }
      this.auditFlag = this.$refs.originalLogTemplateDetail.changeAuditFlag(type, step, actionType)
      if (this.auditFlag == 0) {
        this.setButtonPower()
      }
    },
    setAuditFlag (auditFlag) {
      this.auditFlag = auditFlag
    },
    handelExcelCallback () {
    },
    // 添加结果页
    relationJgy () {
      this.$refs.originalLogTemplateDetail.relationJgy()
      this.certificateMaxHeight = $(this.$refs['certificate-page']).parents('.tbs_info').height() - this.$refs.topBut.clientHeight - 3
    },
    setButtonPower () {
      let btnPower = window.localStorage.getItem('btnPower')// 获取用户所有权限

      if (btnPower == null || btnPower == undefined) { // 没有权限，所有涉及权限的按钮都不展示
        btnPower = '@@'
      }
      // 按钮_模板维护可修改已审核模板
      console.log(btnPower.indexOf('@M27008@'), 'btnPower.indexOf("@M27008@")')
      if (btnPower.indexOf('@M27008@') != -1) {
        this.canSaveBut = true
      } else {
        if (this.auditFlag != 0) {
          this.canSaveBut = false
        } else {
          this.canSaveBut = true
        }
      }
      //        if(btnPower.indexOf("@M27010@") != -1){
      //          this.auditOneFlagBun = true ;
      //        }
      //        if(btnPower.indexOf("@M27011@") != -1){
      //          this.auditTwoFlagBun = true ;
      //        }
    },
    // 关联信息页主模板
    relationXxy () {
      this.$refs.originalLogTemplateDetail.relationXxy()
    },
    // 获得检定周期
    getCertificateJdzqArr () {
      ajaxProxyRequest('get', '/njmind/findParam/certificateJdzq', {codeType: 'NUMBER'}, res => {
        this.certificateJdzqArr = res.list
      })
    },
    setCertificateJdzq () {
      this.$refs.originalLogTemplateDetail.form.jdzq = this.mainCertificateJdzq
      this.$refs.originalLogTemplateDetail.setCertificateJdzq()
    },
    setMainCertificateJdzq (certificateJdzq) {
      this.mainCertificateJdzq = certificateJdzq
    },
    addJzgc(){
      this.$refs.originalLogTemplateDetail.addJzgc()
    },
    addJlbz(){
      this.$refs.originalLogTemplateDetail.addJlbz()
    },
    addJlbzq(){
      this.$refs.originalLogTemplateDetail.addJlbzq()
    },
    setJgyTempType(){
      this.$refs.originalLogTemplateDetail.setJgyTempType(this.jgyTempType)
    },
    getJgyTempType(jgyTempType){
      if(jgyTempType){
        this.jgyTempType = jgyTempType ;
      }
    },
  }
}

</script>

<style lang="scss" scoped>
  .certificateButton{
    margin-bottom: 5px;
    margin-right: 5px;
    margin-left: 0px!important;
  }
  .topButton{
    // position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    // height: 40px;
    overflow: auto;
    /* border: 1px solid red; */
    padding: 1px;
    border-bottom: 1px solid #ccc;
  }
  .certForm{
    // position: absolute;
    top: 36px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    overflow: auto;
    padding: 1px;
  }

  .right-click-menu{
    position:fixed;
    border:1px solid #ccc;
    padding: 2px 0;
    background:#fff;
    width:100px;
    z-index:9999;
  }
  .right-click-menu li{
    padding:3px 10px;
    cursor:default;
    font-size:14px;
    color:#606266;
  }
  .right-click-menu li:hover{
    color:#409eff;
  }
  .custom-1d74b7 .el-form-item--small.el-form-item{
    margin-bottom:0px;
  }
</style>
