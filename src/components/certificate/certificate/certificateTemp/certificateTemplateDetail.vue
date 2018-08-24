<template>
  <div>
          <el-form ref="form" class="mainEnt" :model="form" :rules="rules" label-width="100px" size="small">
            <!-- 关联信息页主模板 -->
            <!--<el-form-item>-->
              <!--<el-button type="primary" @click="relationXxy" size="small">关联信息页主模板</el-button>-->
            <!--</el-form-item>-->
            <!--&lt;!&ndash; 检定周期 &ndash;&gt;-->
            <!--<el-form-item>-->
              <!--<el-select v-model="form.jdzq" style="width:100px"-->
                         <!--@change="setCertificateJdzq"-->
                         <!--:disabled="!certificateCanEdit"-->
              <!--&gt;-->
                <!--<el-option  ref="certificateJdzqSel"-->
                            <!--v-for="certificateJdzq in certificateJdzqArr" :key="certificateJdzq.code"-->
                            <!--:label="certificateJdzq.remark" :value="certificateJdzq.code"-->
                <!--&gt;-->
                  <!--{{certificateJdzq.remark}}-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <el-col :span="24">
                <CertificateXxy order="1" ref="certificateXxy"
                                @getXxyCont="getXxyCont"
                                :certificateCanEdit="certificateCanEdit"
                                :setCertificateJdzq4Xxy="setCertificateJdzq4Xxy"
                                :changeJdyNoCkeck="changeJdyNoCkeck"
                                :canChangeCertificateGcInfo="canChangeCertificateGcInfo"
                                :canModifyCertificateGcInfo="canModifyCertificateGcInfo"

                />
            </el-col>
            <el-col :span="24">
              <CertificateJgy
                order="2"
                ref="certificateJgy"
                v-if="isRouterAlive"
                @getJgyTotalPage = "getJgyTotalPage"
                :getXxyZmbId = "getXxyZmbId"
                @loadJgyContent4Main="loadJgyContent4Main"
                :certificateCanEdit="certificateCanEdit"
              />
            </el-col>
            <el-col :span="12">
              <el-form-item class="cerCommonStyle" label="一级审核：" >
                <span id="auditOneUserName"></span>
                 <span id="auditOneUserTime"></span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item class="cerCommonStyle" label="二级审核： " >
                <span id="auditTwoUserName"></span>
                <span id="auditTwoUserTime"></span>
              </el-form-item>
            </el-col>

          </el-form>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,formatDate,ajaxSyncRequest,ajaxProxyRequest} from '../../../util/base';
  import $ from 'jquery';
  import CertificateXxy from './certificateXxy.vue';
  import CertificateJgy from './certificateJgy.vue';
  import ExcelUtil from '@/mixins/ExcelUtil'
/*   import {
    Container,Aside,Main,
    Button,
    Col,
    Form,
    FormItem,
    Input,
    Row,
  } from 'element--ui';
  Vue.use(Container);
  Vue.use(Aside);
  Vue.use(Main);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col); */

  const defaults = {
    hoho:''
  };
  export default {
    name: "CertificateTemplateDetail",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateXxy,CertificateJgy,
    },
    props: {
      //获得父页面传进来的参数
//      mbId: {default: null},
      mbIds:{default: null},
      certificateCanEdit:{default: false},
      setMainCertificateJdzq:{
        type:Function,
        required:false
      },
      //模板维护时修改检定员信息
      changeJdyNoCkeck:{default: false},
      //证书编辑时可更换技术规程、计量标准及标准器
      canChangeCertificateGcInfo:{default: false},
      //证书编辑时可右键修改技术规程、计量标准及标准器
      canModifyCertificateGcInfo:{default: false},
    },
    mixins: [ExcelUtil],
    data() {
      return {
        form: {},
        rules: {
        },
        loading: false,
        remoteOptions: [],
        kindEditor : null ,
//        jgyMainContentMap: null,
//        jgyIdArray:[],
//        jgyContentArray:[],
        jgyShowArray:[],
        isRouterAlive: true ,
        xxyTotalPage:0,
        jgyTotalPage:0,
//        auditOneUser:{},
//        auditTwoUser:{},
        mbId:0,
//        certificateJdzqArr : [] ,
        /* excel字段 start */
        canDownloadExcel: false, // 是否可下载Excel
        zipFile: '', // 压缩emf图压缩文件保存的地址
        fileLocalSavePath: null, // 下载文件本地保存的地址
        /* excel字段 end */
      }
    },
    watch:{
      //监听参数的变化
//      mbId(){
//        this.getCertificateTemplateDetail();
//      }
    },
    created(){
//      //获得检定周期
//      this.getCertificateJdzqArr();
    },
    mounted() {
//      this.getCertificateTemplateDetail();
      this.setButtonPower()
      this.initExcelParam()
    },
    methods: {
      handleSubmit() {
        //处理excel
        if(!this.handleSubmitSaveExcel()){ //返回值为False时 excel处理失败
           return ;
        }

        //把时间字段删掉
        this.dealData(this.form);
        //对form赋值
        //信息页的Id
//        this.form.xxyId = this.$refs.certificateXxy.xxyZmbId;
        this.form.xxyContent = this.$refs.certificateXxy.getContent();
        if(this.form.xxyContent.length < 20){
          this.$message.warning('信息页不能为空')
          return ;
        }
        //结果页的
        this.form.jgyContent = this.$refs.certificateJgy.getJgyAllContent();
//        var jgyArr = this.$refs.certificateJgy.getJgyArr();
//        this.form.jgyIdArray = JSON.stringify(jgyArr[0]);
//        this.form.jgyContentArray = JSON.stringify(jgyArr[1]);
        //检定周期
        this.form.jdzq = this.$refs.certificateXxy.certificateJdzq;

        this.form.actionType = "模板修改" ;

        //处理excel
        let excelInfo = this.getExcelInfo();
        if(!!excelInfo["isSaveExcel"]){
          this.form.excelPath = excelInfo["excelId"];
          this.form.excelType = excelInfo["excelType"];
          if(!!excelInfo["isSaveRange"]){
            this.form.isSaveRange = excelInfo["isSaveRange"];
            this.form.redPositionArray = excelInfo["redRange"];
            this.form.bluePosition = excelInfo["blueRange"];
          }
        }else{
          //未打开excel时不更新excel相关字段
          delete this.form.excelPath;
          delete this.form.excelType;
        }

        //富文本的赋值
        console.log(this.form)
        ajaxRequest('put','back/certificateTemp/updateCertificateTemp',this.form,res=>{
          if (res.code==200) {
            this.$message.success('修改成功')
            this.form.backupStatus = 1 ;

          }else{
            this.$message.error(res.msg)
          }
        },'unicode')

      },
      remoteMethod() {
      },
      handleCancel(){
      },
      getCertificateTemplateDetail(mbId){
        this.mbId = mbId ;
        if(this.mbId != ""){
          let _this = this;
          ajaxSyncRequest('get', 'back/certificateTemp/queryCertificateTempById/'+this.mbId, null , (res) => {
            if (res.code === 200) {
              _this.form = res.daoResult;
              _this.$refs.certificateXxy.xxyZmbId = _this.form.xxyId ;
              //设置信息页内容
              _this.$refs.certificateXxy.setContent(_this.form.xxyContent);
//              console.log(_this.form.xxyContent,'_this.form.xxyContent')
              //初始化Excel参数
              if(typeof this.initExcelInfo == "function"){
                _this.form["mbId"] = this.mbId
                this.initExcelInfo(_this.form);
              }

              if(typeof this.setMainCertificateJdzq == "function"){
                this.setMainCertificateJdzq(_this.form.jdzq);
              }

              this.$refs.certificateXxy.certificateJdzq = _this.form.jdzq ;

                //设置页码并获得
              this.getXxyTotalPage(false);

              //设置结果页内容
//              console.log(_this.form.jgyContent,'_this.form.jgyContent')

              _this.reload();

//              _this.jgyMainContentMap = res.map.certificateMainTempMap ;
//              _this.jgyIdArray = JSON.parse(_this.form.jgyIdArray);
//              _this.jgyContentArray = JSON.parse(_this.form.jgyContentArray);
//              _this.setAuditFlag();
              //强制刷新组件
              //父组件显示模板名称
              this.$emit("showName",this.form.mbName);
              //审核map
//              _this.auditOneUser = res.map.auditOneUser ;
//              _this.auditTwoUser = res.map.auditTwoUser ;

              if(_this.form.auditFlag > 2 ){
                //二审
                if(res.map.auditTwoUser != null){
                  if(null != res.map.auditTwoUser.signnature){
                    $("#auditTwoUserName").html("<img style='width: 100px;' src='/njmind/attachment/down/"+res.map.auditTwoUser.signnature+"'><img>");
                  }else {
                    $("#auditTwoUserName").html(res.map.auditTwoUser.userName);
                  }
                  $("#auditTwoUserTime").html("（"+formatDate(_this.form.auditTwoTime,'YYYY-MM-DD hh:mm:ss')+"）");

                }
              }
              if(_this.form.auditFlag > 1 ){
                //一审
                if(res.map.auditOneUser != null){
                  if(null != res.map.auditOneUser.signnature){
                    $("#auditOneUserName").html("<img style='width: 100px;' src='/njmind/attachment/down/"+res.map.auditOneUser.signnature+"'><img>");
                  }else {
                    $("#auditOneUserName").html(res.map.auditOneUser.userName);
                  }
                  $("#auditOneUserTime").html("（"+formatDate(_this.form.auditOneTime,'YYYY-MM-DD hh:mm:ss')+"）");
                }
              }
//              console.log(_this.auditOneUser,_this.auditTwoUser)

            }
          });
        }
      },
      reload(){
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      },
      //type 0审核 1拒绝
      //step 当前
      //actionType 0单个 1批量
      changeAuditFlag(type,step,actionType){
        var _this = this ;
        var toStep = "";
        var tipMesSucess = "";
        var tipMesError = "";
        var mbId = "";
        if(0 == actionType){
          mbId = this.form.mbId
        }else if(1 == actionType){
          mbId = this.mbIds ;
        }
        //提交操作
        if(0 == step){
          toStep = 1 ;
          if(0 == type){
            if(0 == actionType){
              actionType="模板提交审核";
              tipMesSucess = "审核成功" ;
            }
          }
        }else if(1 == step){
          if(0 == type){
            toStep = 2 ;
            if(0 == actionType){
              actionType="模板一级审核";
              tipMesSucess = "审核成功" ;
            }else if(1 == actionType){
              actionType="模板批量一级审核";
              tipMesSucess = "审核成功" ;
            }
          }else if(1 == type){
            toStep = 0 ;
            if(0 == actionType){
              actionType="模板提交审核取消";
              tipMesSucess = "取消成功" ;
            }/*else if(1 == actionType){
              actionType="模板批量一级审核取消";
              tipMesSucess = "取消成功" ;
            }*/
          }
        }else if(2 == step){
          if(0 == type){
            toStep = 3 ;
            if(0 == actionType){
              actionType="模板二级审核";
              tipMesSucess = "审核成功" ;
            }else if(1 == actionType){
              actionType="模板批量二级审核";
              tipMesSucess = "审核成功" ;
            }
          }else if(1 == type){
            toStep = 0 ;
            if(0 == actionType){
              actionType="模板一级审核取消";
              tipMesSucess = "取消成功" ;
            }else if(1 == actionType){
              actionType="模板批量一级审核取消";
              tipMesSucess = "取消成功" ;
            }
          }
        }else if(3 == step){
          if(1 == type){
            toStep = 0 ;
            if(0 == actionType){
              actionType="模板二级审核取消";
              tipMesSucess = "取消成功" ;
            }else if(1 == actionType){
              actionType="模板批量二级审核取消";
              tipMesSucess = "取消成功" ;
            }
          }
        }
        ajaxSyncRequest('put',"back/certificateTemp/auditCertificateTemp/"+mbId,{auditFlag:toStep,actionType:actionType},function(res){
            if(res.code == 200){
              _this.form.auditFlag = toStep ;
//              _this.setAuditFlag();
              _this.$message.success(tipMesSucess);
            }else {
              _this.$message.error(res.msg);
              toStep = step ;
            }
        });
        return toStep ;
      },
      dealData(form){
        //把时间字段删掉
        delete form.addTime;
        delete form.updateTime;
        delete form.deleteTime;
        delete form.enableDate;
        delete form.disableDate;
        delete form.backupTime;
        delete form.auditSubmitTime;
        delete form.auditOneTime;
        delete form.auditTwoTime;
        delete form.unAuditSubmitTime;
        delete form.unAuditOneTime;
        delete form.unAuditTwoTime;
        delete form.jdTime;
        delete form.hyTime;
        delete form.pzTime;
        delete form.folderClearTime;
        delete form.printTime;
        delete form.pdfTime;
        delete form.enableDate;
        delete form.disableDate;
        delete form.zsjdrq;
        delete form.zsyxrq;
        delete form.dataDate1;
      },
      setAuditFlag(){
//        this.$emit('setAuditFlag', this.form.auditFlag );
      },
      getAuditFlag(){
        return this.form.auditFlag ;
      },
      getXxyCont(xxyZmbId){
        //后台请求信息页内容
        ajaxRequest("get", "back/certificateTemp/queryCertificateMainTempById", {zmbId:xxyZmbId,mbId:this.mbId}, res => {
          if (res.code === 200) {

            console.log("res.daoResult")
            console.log(res.daoResult)
            //将信息页加载
            this.$refs.certificateXxy.xxyZmbId = xxyZmbId;
            //初始化Excel参数
            if(typeof this.initExcelInfo == "function"){
              res.daoResult["mbId"] = this.mbId
              this.initExcelInfo(res.daoResult);
            }
            //加载新的信息页模板内容
            this.$refs.certificateXxy.setContent(res.daoResult.xxyContent);
            //设置页码并获得
            this.getXxyTotalPage(true);
          }
        });
      },
      //调用，加载结果页内容
      loadJgyContent4Main(){
        console.log(this.$refs.certificateJgy,'this.$refs.certificateJgy')
//        this.$refs.certificateJgy.loadJgyContent(
//          this.jgyIdArray ,
//          this.jgyMainContentMap ,
//          this.jgyContentArray
//        )
        this.$refs.certificateJgy.setJgyAllContent(this.form.jgyContent)

        this.getJgyTotalPage(true);
      },
      //获得信息页页数，并根据入参是否重新刷新页码
      getXxyTotalPage(flag){
        this.xxyTotalPage = this.$refs.certificateXxy.initPageIndex();
        console.log(this.xxyTotalPage,'xxyTotalPage')
        if(flag){
          //结果页页码
          this.getJgyTotalPage(true);
        }
      },
      getJgyTotalPage(flag){
        if(this.isRouterAlive){
          this.jgyTotalPage = this.$refs.certificateJgy.initPageIndex(this.xxyTotalPage);
          console.log(this.jgyTotalPage,'jgyTotalPage')
          if(flag){
            //总页码
            this.setTotalPage();
          }
        }
      },
      setTotalPage(){
        this.$refs.certificateXxy.initPageTotal(this.xxyTotalPage + this.jgyTotalPage);
        if(this.isRouterAlive){
          this.$refs.certificateJgy.initPageTotal(this.xxyTotalPage + this.jgyTotalPage);
        }
      },
      //获得信息页模板ID
      getXxyZmbId(){
        return this.$refs.certificateXxy.xxyZmbId ;
      },
      //添加结果页
      addJgy(){
        //调用结果页弹出选择模板页
        this.$refs.certificateJgy.addGjy(null,'addGjy');
      },
      //关联信息页主模板
      relationXxy(){
        this.$refs.certificateXxy.relationXxy();
      },
//      //获得检定周期
//      getCertificateJdzqArr() {
//        ajaxProxyRequest("get", "/njmind/findParam/certificateJdzq", {codeType:'NUMBER'}, res => {
//          this.certificateJdzqArr = res.list;
//        });
//      },
      //
      setCertificateJdzq() {

        this.$refs.certificateXxy.certificateJdzq = this.form.jdzq

        this.$refs.certificateXxy.setCertificateJdzq();

      },
      //子组件设置父组件检定周期
      setCertificateJdzq4Xxy(certificateJdzq) {
        this.form.jdzq = certificateJdzq ;
        if(typeof this.setMainCertificateJdzq == "function"){
          this.setMainCertificateJdzq(this.form.jdzq);
        }
      },
      setButtonPower () {
        let btnPower = window.localStorage.getItem('btnPower')// 获取用户所有权限

        // 下载Excel权限
        if (btnPower.indexOf('@M27013@') != -1) {
          this.canDownloadExcel = true
        } else {
          this.canDownloadExcel = false
        }
      },
      initExcelParam () { // 初始化excel相关参数
        if (this.canDownloadExcel) {
          this.excelInfo.downLoadExcel = '1'
        }
        this.excelInfo.btnType = '1';
      }
    },
  }

</script>


<style lang="scss" scoped>
  .topButton{
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    height: 36px;
    overflow: auto;
    /* border: 1px solid red; */
    padding: 1px;
  }
  .certForm{
    position: absolute;
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
