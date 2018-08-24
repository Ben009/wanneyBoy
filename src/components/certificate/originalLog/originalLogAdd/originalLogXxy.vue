<template>
  <div>
    <div>
      <el-col :span="24">
        <div ref='xxyContent' id="xxyContent">

        </div>
      </el-col>
    </div>
    <OriginalLogTreeDialog :queryType="1" :xxyZmbId="0" v-if="!!treeDialogShow" :callback="treeDialogClose" ></OriginalLogTreeDialog>
    <CertificateJSGCDialog v-if="!!jsyjDialogShow" :thlogyRules="thlogyRules" :callback="jsyjDialogClose" ></CertificateJSGCDialog>
    <CertificateJLBZDialog  v-if="!!jlbzDialogShow" :thlogyRules="thlogyRulesJLBZ" :callback="jlbzCallback"></CertificateJLBZDialog>
    <CertificateJLBZQDialog  v-if="!!jlbzQDialogShow" :thlogyRules="thlogyRulesJLBZQ"  :callback="jlbzqCallback"></CertificateJLBZQDialog>
    <CertificateJLBZQZSDialog  v-if="!!jlbzQZSDialogShow" :thlogyRules="thlogyRulesJLBZQZS"  :callback="jlbzqZSCallback" :jlbzqId="thlogyRulesJLBZQId"></CertificateJLBZQZSDialog>
    <CheckSignnaturePasswordDialog  ref="checkSignnaturePasswordDialog" v-if="!!checkSignnaturePasswordShow"  :callback="checkSignnaturePasswordBack"></CheckSignnaturePasswordDialog>
  </div>
</template>

<script>
import Vue from "vue";
import { ajaxRequest,ajaxSyncRequest,formatDate,ajaxProxyRequest,changeWS } from "../../../util/base";
import Clickoutside from "@/common-el/src/utils/clickoutside";
import $ from "jquery";
import OriginalLogTreeDialog from "../../common/originalLogCommon/originalLogTreeDialog.vue";
import CertificateJSGCDialog from "../../common/jsgcDialog/CertificateJSGCDialog.vue";
import CertificateJLBZDialog from "../../common/jlbzDialog/CertificateJLBZDialog.vue";
import CertificateJLBZQDialog from "../../common/jlbzqDialog/CertificateJLBZQDialog.vue";
import CertificateJLBZQZSDialog from "../../common/jlbzqDialog/CertificateJLBZQZSDialog.vue";
import CheckSignnaturePasswordDialog from "../../common/checkSignnaturePasswordDialog.vue";
import zsEvents from "@/mixins/zsEvents";
import CertificateCommon from "@/components/certificate/common/certificateCommon.js";

const defaults = {
  hoho: ""
};
export default {
  name: "OriginalLogTempXxy",
  components: {
    /** 模块对象 import 进来 后的别名  */
    OriginalLogTreeDialog,
    CertificateJSGCDialog,
    CertificateJLBZDialog,
    CertificateJLBZQDialog,
    CertificateJLBZQZSDialog,
    CheckSignnaturePasswordDialog,
  },
  props: {
    //获得父页面传进来的参数
    getChangeShr:{
      type:Function,
      required:false
    },
    getOriginalLogId:{
      type:Function,
      required:false
    },
    setCertificateJdzq4Xxy:{
      type:Function,
      required:false
    },
//    setMainCertificatePzr:{
//      type:Function,
//      required:false
//    },
    certificateCanEdit:{default: false},
    //是否可修改标准器证书
    canChangeBzqZSInfo:{default: false},
    //技术依据、标准、仪器可编辑内容
    canEditYjBzBzqInfo:{default: false},
    //可根据器具名称查询开始数据
    canChooseHistoryByQjmc:{default: false},
    //模板维护时修改检定员信息
    changeJdyNoCkeck:{default: false},
    //已审核的证书更换人员
    changeJdy4Sh:{default: false},
    //证书编辑时可更换技术规程、计量标准及标准器
    canChangeCertificateGcInfo:{default: false},
    //证书编辑时可右键修改技术规程、计量标准及标准器
    canModifyCertificateGcInfo:{default: false},
    certificatePasswordCheck:{default: 0},
    //是否受控
    skFlag:{default: 1,required:false},
    //获得每一个检定/审核/批准的状态
    returnAuditStatus:{
      type:Function,
      required:false
    },
  },
  mixins:[zsEvents,CertificateCommon],
  data() {
    return {
      form: {},
      rules: {},
      loading: false,
      remoteOptions: [],
      kindEditor: null,
      treeDialogShow: false,
      xxyZmbId: null,
      jsyjDialogShow: null,
      thlogyRules: null,
      thlogyRulesJLBZ:null,
      thlogyRulesJLBZQ:null,
      thlogyRulesJLBZQId:0,
      thlogyRulesJLBZQZS:null,
      jlbzDialogShow: null,
      jlbzQDialogShow: null,
      jlbzQZSDialogShow: null,
      jlbzKzxmData:null,
      jcbmList : [],
      dJdDyRList : [],
      dPzRList : [],
      indexEle : null ,
      certificateJdzqArr : [] ,
      //props中的值不能修改，创建临时对象
      certificateJdzq:12 ,
      checkSignnaturePasswordShow:false,
    };
  },
  watch: {

  },
  created() {
    //获得检定周期
    this.getCertificateJdzqArr();

  },
  mounted() {

  },
  computed:{
    normalizedSize: function () {
      return this.size.trim().toLowerCase()
    }
  },
  methods: {
    relationXxy() {
      this.treeDialogShow = true;
    },
    leftClick() {
      //绑定左击事件
      let _this = this;
      $("#xxyContent .zs_click").click(function(event) {
        if(_this.certificateCanEdit) {
          var that = this;
          //证书鼠标左击事件
          var showName = $(that).attr("data-zs-click-show-name");
          var thisName = $(that).attr("name")
          if (showName) {
            if (showName.endsWith("_input")) {
              //input输入框
              $(that).hide().parent()
                .find("[name='" + showName + "']")
                .show()
                .val($(this).html())
                .select();
            } else if (showName.endsWith("_select")) {
              //select下拉框
              //检定员
              if (thisName == "zs_jdy") {
                _this.leftClickJdy(that, thisName, showName);
              } else if (thisName == "zs_hyy") {
                _this.leftClickHyy(that, thisName, showName);
              } else if (thisName == "zs_pzr") {
                _this.leftClickPzr(that, thisName, showName);
              } else if (thisName == "zs_jdzq") {
                _this.leftClickJzq(that, thisName, showName);
              }else if (thisName == "zs_jdjl"){
                _this.zs_select('zs_jdjl_select',event);
              }else if (thisName == "zs_jdjl_eng"){
                _this.zs_select('zs_jdjl_eng_select',event);

              }else {
                $(that)
                  .hide()
                  .parent()
                  .find("[name='" + showName + "']")
                  .show()[0].value = $(this).html();
                $(that)
                  .parent()
                  .find("[name='" + showName + "']")
                  .focus();
              }
            } else if (showName.endsWith("_input_date")) {
              //获得当前的日期
              var defDate = "";
              var minDate = "";
              //证书检定日期
              if (
                $(that)
                  .attr("name")
                  .indexOf("zs_zsjdrq_") != -1
              ) {
                defDate = _this.getZsJdrq();
              } else if (
                $(that)
                  .attr("name")
                  .indexOf("zs_zsyxrq_") != -1
              ) {
                //证书有效日期
                defDate = _this.getZsYxrq();
                minDate = _this.getZsJdrq();
              } else {
                return;
              }
              _this.appendDatePicker(that, defDate, minDate);
            }
            return;
          }
          console.log(_this.canChangeCertificateGcInfo,'_this.canChangeCertificateGcInfo')
          if($(that).attr("name").startsWith("zs_jsgc_") || $(that).attr("name").startsWith("zs_jlbz_") || $(that).attr("name").startsWith("zs_jlbzq_")) {
            if(_this.skFlag === 0 && _this.canChangeCertificateGcInfo ) {
              //技术规程
              if ($(that).attr("name").startsWith("zs_jsgc_")) {
                _this.thlogyRules = that;
                _this.jsyjDialogShow = true;
                return;
              }
              //计量标准
              if ($(that).attr("name").startsWith("zs_jlbz_")) {
                _this.jlbzDialogShow = true;
                _this.thlogyRulesJLBZ = that;
                return;
              }
              //计量标准器
              if ($(that).attr("name").startsWith("zs_jlbzq_")) {
                if (($(that).attr("name") == "zs_jlbzq_zsbh" || $(that).attr("name") == "zs_jlbzq_yxrq" ) && (_this.canChangeBzqZSInfo )) {
                  var bzqIndex = $("[name='" + $(that).attr("name") + "']").index(that);
                  _this.thlogyRulesJLBZQId = $("#xxyContent [name='zs_jlbzq_id']").eq(bzqIndex).val();
                  if (_this.thlogyRulesJLBZQId != "") {
                    _this.jlbzQZSDialogShow = true;
                    _this.thlogyRulesJLBZQZS = that;
                  }
                } else {
                  _this.jlbzQDialogShow = true;
                  _this.thlogyRulesJLBZQ = that;
                }
                return;
              }
            }else {
              if (($(that).attr("name") == "zs_jlbzq_zsbh" || $(that).attr("name") == "zs_jlbzq_yxrq" ) && (_this.canChangeBzqZSInfo )) {
                var bzqIndex = $("[name='" + $(that).attr("name") + "']").index(that);
                _this.thlogyRulesJLBZQId = $("#xxyContent [name='zs_jlbzq_id']").eq(bzqIndex).val();
                if (_this.thlogyRulesJLBZQId != "") {
                  _this.jlbzQZSDialogShow = true;
                  _this.thlogyRulesJLBZQZS = that;
                }
              }
              return;
            }
          }
          //检定按钮
          if ($(that).attr("name") == "zs_jdy_button") {
            _this.jdyButtonClick(that);
            return;
          }
          //核验按钮
          if ($(that).attr("name") == "zs_hyy_button") {
            _this.hyyButtonClick(that);
            return;
          }
        }
      });
    },
    rightClick() {
      var _this = this
      $("#xxyContent .zs_contextmenu").contextmenu(function(event) {
        if(_this.certificateCanEdit) {
          //证书鼠标右击事件
          var showName = $(this).attr("data-zs-contextmenu-show-name");
          //模板处 技术依据、标准、仪器不能编辑内容
          if( !_this.canEditYjBzBzqInfo){
            if($(this).attr("name").indexOf("zs_jsgc_") == 0 ||
              $(this).attr("name").indexOf("zs_jlbz_") == 0 ||
              $(this).attr("name").indexOf("zs_jlbzq_") == 0
            ){
              return;
            }
          }
          //证书添加
            if($(this).attr("name").indexOf("zs_jsgc_") == 0){
              //无修改权限
              if(!_this.canModifyCertificateGcInfo ){
                return;
              }
              //id为空  zs_jsgc_id
              var indexEle = $("[name='" + $(this).attr("name") + "']").index(this);
              if($("[name='zs_jsgc_id']").eq(indexEle).val()==null || $("[name='zs_jsgc_id']").eq(indexEle).val()==""){
                console.log("id为空")
                return;
              }
            }else if($(this).attr("name").indexOf("zs_jlbzq_") == 0){
              if(!_this.canModifyCertificateGcInfo ){
                return;
              }
              //id为空  zs_jlbzq_id
              var indexEle = $("[name='" + $(this).attr("name") + "']").index(this);
              if($("[name='zs_jlbzq_id']").eq(indexEle).val()==null || $("[name='zs_jlbzq_id']").eq(indexEle).val()==""){
                console.log("id为空")
                return;
              }
            }else if($(this).attr("name").indexOf("zs_jlbz_") == 0){
              if(!_this.canModifyCertificateGcInfo ){
                return;
              }
              //id为空  zs_jlbz_id
              var indexEle = $("[name='" + $(this).attr("name") + "']").index(this);
              if($("[name='zs_jlbz_id']").eq(indexEle).val()==null || $("[name='zs_jlbz_id']").eq(indexEle).val()==""){
                console.log("id为空")
                return;
              }
            }
          //无权限可修改
          if( _this.skFlag != 0 || !_this.canModifyCertificateGcInfo ){
            if($(this).attr("name").indexOf("zs_jsgc_") == 0 ||
              $(this).attr("name").indexOf("zs_jlbz_") == 0 ||
              $(this).attr("name").indexOf("zs_jlbzq_") == 0
            ){
              return;
            }
          }
          if (showName) {
            if (showName.endsWith("_input")) {
              if ("zs_jlbzq_yxrq_input" == showName) {
                _this.appendDatePicker(this, $.trim($(this).html()), _this.getZsJdrq());
              } else if ("zs_jlbz_yxrq_input" == showName) {
                _this.appendDatePicker(this, $.trim($(this).html()), _this.getZsJdrq());
              } else if ("zs_jlbz_yxrq_social_input" == showName) {
                _this.appendDatePicker(this, $.trim($(this).html()), _this.getZsJdrq());
              } else {
                //input输入框
                $(this)
                  .hide()
                  .parent()
                  .find("[name='" + showName + "']")
                  .show()
                  .val($(this).html())
                  .select();
              }
            } else if (showName.endsWith("_select")) {
              if ("zs_zzcs_select" == showName && (_this.canChooseHistoryByQjmc )) {
                _this.getFieldList(this,"zzcs",event);
              }else if ("zs_xhgg_select" == showName && (_this.canChooseHistoryByQjmc )) {
                _this.getFieldList(this,"xhgg",event);
              } else {
                //select下拉框
                $(this)
                  .hide()
                  .parent()
                  .find("[name='" + showName + "']")
                  .show()[0].value = $(this).html();
                $(this)
                  .parent()
                  .find("[name='" + showName + "']")
                  .focus();
              }
            }
            return false;
          }
        }
      });
    },
    blurEvt() {
      let _this = this;
      $("#xxyContent .zs_blur").blur(function() {
        if(_this.certificateCanEdit) {
          //证书鼠标失焦事件
          var showName = $(this).attr("data-zs-blur-show-name");
          if (showName) {
            if (showName == "zs_jdy") {
              _this.blurClickJdy(this, showName);
            } else if (showName == "zs_hyy") {
              _this.blurClickHyy(this, showName);
            } else if (showName == "zs_pzr") {
              _this.blurClickPzr(this, showName);
            } else if (showName == "zs_jdzq") {
              _this.blurClickJzq(this, showName);
            } else {
              if ($(this)[0].selectedIndex == -1) {
                $(this)
                  .hide()
                  .parent()
                  .find("[name='" + showName + "']")
                  .show();
              } else {
                $(this)
                  .hide()
                  .parent()
                  .find("[name='" + showName + "']")
                  .show()
                  .html($(this).val());

                //自动更新证书文字大小
                _this.updateZsSizeAuto($(this).hide().parent().find("[name='" + showName + "']"));
              }
            }
            return;
          }
        }
      });
    },
    updateZsSizeAuto(thisObject) {
      //自动更新证书文字大小
      var sizeUnit = $(thisObject).attr("data-zs-size-unit");
      if (sizeUnit) {
        var sizeInit = parseInt($(thisObject).attr("data-zs-size-init"));
        var sizeMin = parseInt($(thisObject).attr("data-zs-size-min"));
        var heightMax = parseInt($(thisObject).attr("data-zs-height-max"));

        $(thisObject).attr("data-zs-size-update", "1");
        $(thisObject).css("font-size", sizeInit + sizeUnit);
        while (parseInt($(thisObject).css("height")) > heightMax && sizeInit > sizeMin) {
          sizeInit = sizeInit - 1;
          $(thisObject).css("font-size", sizeInit + sizeUnit);
        }
      }
    },
    updateZsSizeAutoAll(zsObject) {
      //证书文字大小自动缩放
      let _this = this;
      $(".zs_size_auto", zsObject).each(function () {
        if ($(this).attr("data-zs-size-update") == "0") {
          //证书文字大小未进行过更新
          _this.updateZsSizeAuto(this);
        }
      });
    },
    updateZsJdlxAutoAll(zsObject) {
      //证书文字大小自动缩放
      $("[name='zs_jd_type']",zsObject).change(function () {
        //证书检定类型变更后页面相关文字自动跟着变更
        $("."+$(this).attr("data-zs-hide-class"),zsObject).hide();
        $("."+$(this).attr("data-zs-show-class"),zsObject).show();
      });
      $("[name='zs_jd_type']:checked",zsObject).change();

    },
//    clearContent(obj) {
//      $("#xxyContent").html("");
//    },
    setContent(xxyContent) {
      $("#xxyContent").html(xxyContent);
      //左击事件
      this.leftClick();

      //证书鼠标右击事件
      this.rightClick();

      //证书鼠标失焦事件
      this.blurEvt();

      //证书文字大小自动缩放
      this.updateZsSizeAutoAll($("#xxyContent"));

      //证书检定类型变更后页面相关文字自动跟着变更
      this.updateZsJdlxAutoAll($("#xxyContent"));

      //获得部门下拉列表
      this.getJcbmList();
      changeWS("#xxyContent");
    },
    getContent() {
      var xxyDiv = $("#xxyContent") ;

      this.initCheckboxRadioSelect(xxyDiv);

      return xxyDiv.html();
    },
    initXxyCont() {
      $("#xxyContent").html("");
      $("#xxyContent .zs_focus").unbind();
      $("#xxyContent .zs_contextmenu").unbind();
      $("#xxyContent .zs_blur").unbind();
    },
    //设置证书检定日期
    setZsJdrq(date) {
      var dateArr = date.split("-");
      $("#xxyContent")
        .find("[name='zs_zsjdrq_year']")
        .html(dateArr[0]);
      $("#xxyContent")
        .find("[name='zs_zsjdrq_month']")
        .html(dateArr[1]);
      $("#xxyContent")
        .find("[name='zs_zsjdrq_day']")
        .html(dateArr[2]);
      //自动设置有效期
      this.setCertificateJdzq();
    },
    //获得证书检定日期
    getZsJdrq() {
      var mydate = new Date();

      var year =
        $.trim(
          $("#xxyContent")
            .find("[name='zs_zsjdrq_year']")
            .html()
        ) == ""
          ? mydate.getFullYear()
          : $.trim(
              $("#xxyContent")
                .find("[name='zs_zsjdrq_year']")
                .html()
            );
      var month =
        $.trim(
          $("#xxyContent")
            .find("[name='zs_zsjdrq_month']")
            .html()
        ) == ""
          ? mydate.getMonth() + 1
          : $.trim(
              $("#xxyContent")
                .find("[name='zs_zsjdrq_month']")
                .html()
            );
      var day =
        $.trim(
          $("#xxyContent")
            .find("[name='zs_zsjdrq_day']")
            .html()
        ) == ""
          ? mydate.getDate()
          : $.trim(
              $("#xxyContent")
                .find("[name='zs_zsjdrq_day']")
                .html()
            );

      return year + "-" + month + "-" + day;
    },
    //设置证书有效日期
    setZsYxrq(date) {
      var dateArr = date.split("-");
      $("#xxyContent")
        .find("[name='zs_zsyxrq_year']")
        .html(dateArr[0]);
      $("#xxyContent")
        .find("[name='zs_zsyxrq_month']")
        .html(dateArr[1]);
      $("#xxyContent")
        .find("[name='zs_zsyxrq_day']")
        .html(dateArr[2]);
    },
    //设置证书有效日期
    getZsYxrq() {
      var mydate = new Date();

      var year =
        $.trim(
          $("#xxyContent")
            .find("[name='zs_zsyxrq_year']")
            .html()
        ) == ""
          ? mydate.getFullYear()
          : $.trim(
              $("#xxyContent")
                .find("[name='zs_zsyxrq_year']")
                .html()
            );
      var month =
        $.trim(
          $("#xxyContent")
            .find("[name='zs_zsyxrq_month']")
            .html()
        ) == ""
          ? mydate.getMonth() + 1
          : $.trim(
              $("#xxyContent")
                .find("[name='zs_zsyxrq_month']")
                .html()
            );
      var day =
        $.trim(
          $("#xxyContent")
            .find("[name='zs_zsyxrq_day']")
            .html()
        ) == ""
          ? mydate.getDate()
          : $.trim(
              $("#xxyContent")
                .find("[name='zs_zsyxrq_day']")
                .html()
            );

      return year + "-" + month + "-" + day;
    },
    jsyjDialogClose(thlogyRules, data) {
      if(!thlogyRules){
        this.jsyjDialogShow = null;
        return ;
      }
      this.indexEle = $("[name='" + $(thlogyRules).attr("name") + "']").index(thlogyRules);
      if ('reset'==data) {
        $("#xxyContent [name='zs_jsgc_name']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jsgc_name_eng']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jsgc_id']").eq(this.indexEle).val('');
        $("#xxyContent [name='zs_jsgc_canzhao']").eq(this.indexEle).html('');

      }else{
        $("#xxyContent [name='zs_jsgc_name']").eq(this.indexEle).html(data.jsgcName);
        $("#xxyContent [name='zs_jsgc_name_eng']").eq(this.indexEle).html(data.jsgcNameEng);
        $("#xxyContent [name='zs_jsgc_id']").eq(this.indexEle).val(data.jsgcId);
      }

      //自动更新证书文字大小
      this.updateZsSizeAuto($("#xxyContent [name='zs_jsgc_name']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jsgc_name_eng']").eq(this.indexEle));

      this.jsyjDialogShow = null;
    },
    jlbzCallback(thlogyRules, data) {
      if(!thlogyRules){
        this.jlbzDialogShow = null;
        return ;
      }

     if ('reset'!=data) {
       this.getJlbzKzxm(data.jlbzId);
     }

      this.indexEle = $("[name='" + $(thlogyRules).attr("name") + "']").index(thlogyRules);

       if ('reset'==data) {
        $("#xxyContent [name='zs_jlbz_name']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbz_name_eng']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbz_clfw']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbz_clfw_eng']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbz_zqddj']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbz_zqddj_eng']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbz_zsbh']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbz_yxrq']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbz_kzxm']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbz_id']").eq(this.indexEle).val('');
        $("#xxyContent [name='zs_jlbz_lines']").eq(this.indexEle).val('1');
        $("#xxyContent [name='zs_jlbz_zsbh_social']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbz_yxrq_social']").eq(this.indexEle).html('');


      }else{
        $("#xxyContent [name='zs_jlbz_name']").eq(this.indexEle).html(data.jlbzName);
        $("#xxyContent [name='zs_jlbz_name_eng']").eq(this.indexEle).html(data.jlbzNameEng);
        $("#xxyContent [name='zs_jlbz_clfw']").eq(this.indexEle).html(data.jlbzClfw);
        $("#xxyContent [name='zs_jlbz_clfw_eng']").eq(this.indexEle).html(data.jlbzClfwEng);
        $("#xxyContent [name='zs_jlbz_zqddj']").eq(this.indexEle).html(data.jlbzZqddj);
        $("#xxyContent [name='zs_jlbz_zqddj_eng']").eq(this.indexEle).html(data.jlbzZqddjEng);

        $("#xxyContent [name='zs_jlbz_zsbh']").eq(this.indexEle).html(
          (data.jlbzZsbh?data.jlbzZsbh
            +
            ($("#xxyContent [name='zs_jlbz_zsbh']").eq(this.indexEle).attr("data-zs-value-suffix")?$("#xxyContent [name='zs_jlbz_zsbh']").eq(this.indexEle).attr("data-zs-value-suffix"):"")
          :"")
       );
        $("#xxyContent [name='zs_jlbz_yxrq']").eq(this.indexEle).html(
          formatDate(
            data.jlbzYxrq,
            ($("#xxyContent [name='zs_jlbz_yxrq']").eq(this.indexEle).attr("data-zs-value-date-format")?$("#xxyContent [name='zs_jlbz_yxrq']").eq(this.indexEle).attr("data-zs-value-date-format").toUpperCase():"YYYY-MM-DD")
          )
        );
        $("#xxyContent [name='zs_jlbz_id']").eq(this.indexEle).val(data.jlbzId);
        let innerHTML='';
         this.jlbzKzxmData.forEach(element => {
          innerHTML+=`<option value="${element.jlbzKzxm}">${element.jlbzKzxm}</option>`;
        });
        $("#xxyContent [name='zs_jlbz_kzxm_select']").eq(this.indexEle).get(0).innerHTML=innerHTML;
        $("#xxyContent [name='zs_jlbz_kzxm']").eq(this.indexEle).html(this.jlbzKzxmData.length>0?this.jlbzKzxmData[0].jlbzKzxm:'');
         $("#xxyContent [name='zs_jlbz_zsbh_social']").eq(this.indexEle).html(
           (data.jlbzZsbhSocial?data.jlbzZsbhSocial
            +
             ($("#xxyContent [name='zs_jlbz_zsbh_social']").eq(this.indexEle).attr("data-zs-value-suffix")?$("#xxyContent [name='zs_jlbz_zsbh_social']").eq(this.indexEle).attr("data-zs-value-suffix"):"")
           :"")
         );
         $("#xxyContent [name='zs_jlbz_yxrq_social']").eq(this.indexEle).html(
           data.jlbzYxrqSocial ? (
             formatDate(
               data.jlbzYxrqSocial,
               ($("#xxyContent [name='zs_jlbz_yxrq']").eq(this.indexEle).attr("data-zs-value-date-format")?$("#xxyContent [name='zs_jlbz_yxrq']").eq(this.indexEle).attr("data-zs-value-date-format").toUpperCase():"YYYY-MM-DD")
             )
           ):""
         )
      }

      //自动更新证书文字大小
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbz_name']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbz_name_eng']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbz_clfw']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbz_clfw_eng']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbz_zqddj']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbz_zqddj_eng']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbz_zsbh']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbz_zsbh_social']").eq(this.indexEle));

      this.jlbzDialogShow = null;
    },
    jlbzqCallback(thlogyRules,data) {

      if(!thlogyRules){
        this.jlbzQDialogShow = null;
        return ;
      }
      this.indexEle = $("[name='" + $(thlogyRules).attr("name") + "']").index(thlogyRules);

      if ('reset'==data) {
        $("#xxyContent [name='zs_jlbzq_name']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_name_eng']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_clfw']").eq(this.indexEle).html('');
//        $("#xxyContent [name='zs_jlbzq_clfw_eng']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_zqddj']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_zqddj_eng']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_xhgg']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_sbbh']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_ccbh']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_jddw']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_zzcs']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_zsbh']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_yxrq']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_id']").eq(this.indexEle).val('');
        $("#xxyContent [name='zs_jlbzq_lines']").eq(this.indexEle).val(1);
      }else{
        $("#xxyContent [name='zs_jlbzq_name']").eq(this.indexEle).html(data.jlbzqName);
        $("#xxyContent [name='zs_jlbzq_name_eng']").eq(this.indexEle).html(data.jlbzqNameEng);
        $("#xxyContent [name='zs_jlbzq_clfw']").eq(this.indexEle).html(data.jlbzqClfw);
//        $("#xxyContent [name='zs_jlbzq_clfw_eng']").eq(this.indexEle).html(data.jlbzqClfwEng);
        $("#xxyContent [name='zs_jlbzq_zqddj']").eq(this.indexEle).html(data.jlbzqZqddj);
        $("#xxyContent [name='zs_jlbzq_zqddj_eng']").eq(this.indexEle).html(data.jlbzqZqddjEng);
        $("#xxyContent [name='zs_jlbzq_xhgg']").eq(this.indexEle).html(data.jlbzqXhgg);
        $("#xxyContent [name='zs_jlbzq_sbbh']").eq(this.indexEle).html(data.jlbzqSbbh);
        $("#xxyContent [name='zs_jlbzq_ccbh']").eq(this.indexEle).html(data.jlbzqCcbh);
        $("#xxyContent [name='zs_jlbzq_jddw']").eq(this.indexEle).html(data.jlbzqJddw);
        $("#xxyContent [name='zs_jlbzq_zzcs']").eq(this.indexEle).html(data.jlbzqZzcs);
        $("#xxyContent [name='zs_jlbzq_zsbh']").eq(this.indexEle).html(
          (data.jlbzqZsbh?data.jlbzqZsbh
            +
            ($("#xxyContent [name='zs_jlbzq_zsbh']").eq(this.indexEle).attr("data-zs-value-suffix")?$("#xxyContent [name='zs_jlbzq_zsbh']").eq(this.indexEle).attr("data-zs-value-suffix"):"")
          :"")
        );
        $("#xxyContent [name='zs_jlbzq_yxrq']").eq(this.indexEle).html(
          data.jlbzqYxrq ? (
            formatDate(
              data.jlbzqYxrq,
              ($("#xxyContent [name='zs_jlbzq_yxrq']").eq(this.indexEle).attr("data-zs-value-date-format")?$("#xxyContent [name='zs_jlbzq_yxrq']").eq(this.indexEle).attr("data-zs-value-date-format").toUpperCase():"YYYY-MM-DD")
            )
          ):""
        );
        $("#xxyContent [name='zs_jlbzq_id']").eq(this.indexEle).val(data.jlbzqId);
      }

      //自动更新证书文字大小
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_name']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_name_eng']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_clfw']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_zqddj']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_zqddj_eng']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_xhgg']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_ccbh']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_sbbh']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_jddw']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_zzcs']").eq(this.indexEle));
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_zsbh']").eq(this.indexEle));

      this.jlbzQDialogShow = null;

    },
    jlbzqZSCallback(thlogyRules,data) {

      if(!thlogyRules){
        this.jlbzQZSDialogShow = null;
        return ;
      }
      this.indexEle = $("[name='" + $(thlogyRules).attr("name") + "']").index(thlogyRules);

      if ('reset'==data) {
        $("#xxyContent [name='zs_jlbzq_zsbh']").eq(this.indexEle).html('');
        $("#xxyContent [name='zs_jlbzq_yxrq']").eq(this.indexEle).html('');

      }else{
        $("#xxyContent [name='zs_jlbzq_zsbh']").eq(this.indexEle).html(
          (data.jlbzqZsbh?data.jlbzqZsbh
            +
            ($("#xxyContent [name='zs_jlbzq_zsbh']").eq(this.indexEle).attr("data-zs-value-suffix")?$("#xxyContent [name='zs_jlbzq_zsbh']").eq(this.indexEle).attr("data-zs-value-suffix"):"")
          :"")
        );
        $("#xxyContent [name='zs_jlbzq_yxrq']").eq(this.indexEle).html(
          data.jlbzqYxrq ? (
            formatDate(
              data.jlbzqYxrq,
              ($("#xxyContent [name='zs_jlbzq_yxrq']").eq(this.indexEle).attr("data-zs-value-date-format")?$("#xxyContent [name='zs_jlbzq_yxrq']").eq(this.indexEle).attr("data-zs-value-date-format").toUpperCase():"YYYY-MM-DD")
            )
          ):""
        );
      }

      //自动更新证书文字大小
      this.updateZsSizeAuto($("#xxyContent [name='zs_jlbzq_zsbh']").eq(this.indexEle));

      this.jlbzQZSDialogShow = null;

    },
//    getJsgcList(){
//      let jsgcData=[];
//      $("[name='zs_jsgc_name']").each(function(index){
//        let obj={
//          jsgcName:$("[name='zs_jsgc_name']").eq(index)[0].innerText,
//          jsgcNameEng:$("[name='zs_jsgc_name_eng']").eq(index)[0].innerText,
//          jsgcId:$("[name='zs_jsgc_id']").eq(index).val()
//        };
//        jsgcData.push(obj);
//      });
//      return jsgcData;
//    },
//    getJlbzList(){
//      let jlbzData=[];
//      $("[name='zs_jlbz_name']").each(function(index) {
//        let obj={
//          jlbzId:$("[name='zs_jlbz_id']").eq(index).val(),
//          jlbzName:$("[name='zs_jlbz_name']").eq(index).get(0).innerText,
//          jlbzNameEng:$("[name='zs_jlbz_name_eng']").eq(index).get(0).innerText,
//          jlbzClfw:$("[name='zs_jlbz_clfw']").eq(index).get(0).innerText,
//          jlbzClfwEng:$("[name='zs_jlbz_clfw_eng']").eq(index).get(0).innerText,
//          jlbzZqddj:$("[name='zs_jlbz_zqddj']").eq(index).get(0).innerText,
//          jlbzZqddjEng:$("[name='zs_jlbz_zqddj_eng']").eq(index).get(0).innerText,
//          jlbzZsbh:$("[name='zs_jlbz_zsbh']").eq(index).get(0).innerText,
//          jlbzYxrq:$("[name='zs_jlbz_yxrq']").eq(index).get(0).innerText,
//        };
//        jlbzData.push(obj);
//      })
//      return  jlbzData;
//    },
//    getJlbzQList(){
//      let jlbzQData=[];
//      $("[name='zs_jlbz_name']").each(function(index) {
//        let obj={
//          jlbzqId:$("[name='zs_jlbzq_id']").eq(index).val(),
//          jlbzqName:$("[name='zs_jlbzq_name']").eq(index).get(0).innerText,
//          jlbzqNameEng:$("[name='zs_jlbzq_name_eng']").eq(index).get(0).innerText,
//          jlbzqClfw:$("[name='zs_jlbzq_clfw']").eq(index).get(0).innerText,
//          jlbzqClfwEng:$("[name='zs_jlbzq_clfw_eng']").eq(index).get(0).innerText,
//          jlbzClfwEng:$("[name='zs_jlbz_clfw_eng']").eq(index).get(0).innerText,
//          jlbzqZqddj:$("[name='zs_jlbzq_zqddj']").eq(index).get(0).innerText,
//          jlbzqZqddjEng:$("[name='zs_jlbzq_zqddj_eng']").eq(index).get(0).innerText,
//          jlbzqXhgg:$("[name='zs_jlbzq_xhgg']").eq(index).get(0).innerText,
//          jlbzqSbbh:$("[name='zs_jlbzq_sbbh']").eq(index).get(0).innerText,
//          jlbzqCcbh:$("[name='zs_jlbzq_ccbh']").eq(index).get(0).innerText,
//          jlbzqJddw:$("[name='zs_jlbzq_jddw']").eq(index).get(0).innerText,
//          jlbzqZzcs:$("[name='zs_jlbzq_zzcs']").eq(index).get(0).innerText,
//          jlbzqZsbh:$("[name='zs_jlbzq_zsbh']").eq(index).get(0).innerText,
//          jlbzYxrq:$("[name='zs_jlbzq_yxrq']").eq(index).get(0).innerText,
//        };
//        jlbzQData.push(obj);
//      })
//      return  jlbzQData;
//    },
    setXxyZsbh(zsbh){
      $("#xxyContent [name='zs_zsbh']").html(zsbh)
    },
    getJlbzKzxm(jlbzId){

      ajaxSyncRequest('get','back/certificateQuality/getJlbzKzxm/'+jlbzId,null,res=>{
        if (res.code==200) {
          this.jlbzKzxmData=res.rows;
        }
      })
    },
    //获得部门下拉列表
    getJcbmList(){
      var _this = this;
      $("#xxyContent [name='zs_dept_select']").change(function () {
        if(_this.certificateCanEdit) {
          _this.indexEle = $("#xxyContent [name='zs_dept_select']").index(this);
          _this.getJdHyList(this.value);
        }
      })
    },
    //获得检定核验人员下拉列表
    getJdHyList(depId){
      if(!depId){
        return;
      }
      ajaxSyncRequest('get','back/certificateCommon/getDepartJdyHyyList/'+depId , null ,res=>{
        if (res.code==200) {

          //删除除第一个选项卡的下拉框
          var options = $("#xxyContent [name='zs_jdy_select']").eq(this.indexEle).children('option');
          for(var i=1 ;i<options.length;i++ ){
            options[i].remove();
          }
          options = $("#xxyContent [name='zs_hyy_select']").eq(this.indexEle).children('option');
          for(var i=1 ;i<options.length;i++ ){
            options[i].remove();
          }
          //追加人员列表
          this.dJdDyRList=res.rows;
          for(var i=0;i<this.dJdDyRList.length;i++){
            $("#xxyContent [name='zs_jdy_select']").eq(this.indexEle).append("<option value='"+this.dJdDyRList[i].userId+"'>"+this.dJdDyRList[i].userName+"</option>");
            $("#xxyContent [name='zs_hyy_select']").eq(this.indexEle).append("<option value='"+this.dJdDyRList[i].userId+"'>"+this.dJdDyRList[i].userName+"</option>");
          }
        }
      })
    },
    //点击检定员的方法
    leftClickJdy(obj,thisName,showName){
      //先获得第几个元素
      this.indexEle = $("#xxyContent [name='" + thisName + "']").index(obj);
      if(typeof this.getChangeShr == "function" && (this.getChangeShr()) && $("#xxyContent [name='zs_jdy_audit_status']").eq(this.indexEle).val() == "1") {
        this.$message.warning("请先保存证书");
      }else {
        //判断是否核验
        console.log($("#xxyContent [name='zs_hyy_audit_status'][value!='0']") , ($("#xxyContent [name='zs_jdy_id']").eq(this.indexEle).val() ));
        if(this.changeJdyNoCkeck || $("#xxyContent [name='zs_hyy_audit_status'][value='1']").length==0 ||
          ($("#xxyContent [name='zs_jdy_id']").eq(this.indexEle).val() != "" && $("#xxyContent [name='zs_hyy_audit_status'][value='1']").length > 0  )
        ) {
          console.log(this.changeJdy4Sh,'this.changeJdy4Sh')
          if(this.changeJdy4Sh || $("#xxyContent [name='zs_jdy_audit_status']").eq(this.indexEle).val() != "1"){
            //隐藏当前元素
            $(obj).hide();
            //显示并赋值
            $("#xxyContent [name='" + showName + "']").eq(this.indexEle).show()[0].value
              =
              $("#xxyContent [name='zs_jdy_id']").eq(this.indexEle).val();
            //选中元素
            $("#xxyContent [name='" + showName + "']").eq(this.indexEle).focus();
          }else {
            this.$message.warning("证书已检定，不允许修改检定员");
          }
        }else {
          this.$message.warning("证书已核验，不允许增加检定员");
        }
      }
    },
    //失焦方法 检定员
    blurClickJdy(obj,showName){
      if ($(obj)[0].selectedIndex == -1) {
        //隐藏
        $(obj).hide();
        //显示
        $("#xxyContent [name='"+showName+"']").eq(this.indexEle).show();
      } else {
        //隐藏
        $(obj).hide();
        //显示
        $("#xxyContent [name='"+showName+"']").eq(this.indexEle).show();
        //判断检定员、核验员是否一样
        if($(obj).val() != "" && ($(obj).val() == $("#xxyContent [name='zs_hyy_id']").eq(this.indexEle).val())) {
          this.$message.warning("检定员与核验员不能相同");
          return ;
        }
        //判断人员是否更换
        if($(obj).val() != $("#xxyContent [name='zs_jdy_id']").eq(this.indexEle).val()){
          //判断当前是否检定
          if($("#xxyContent [name='zs_jdy_audit_status']").eq(this.indexEle).val() == "1"){
            if("" != $(obj).val()) {
              //赋值
              $("#xxyContent [name='" + showName + "']").eq(this.indexEle).html($(obj).find("option:selected").text());
              //设置id
              $("#xxyContent [name='zs_jdy_id']").eq(this.indexEle).val($(obj).val());
              //获得证书id
              var certificateId = this.getOriginalLogId();
              //获得人员id
              var auditRyId = $("#xxyContent [name='zs_jdy_id']").eq(this.indexEle).val();
              if (auditRyId && "" != auditRyId) {
                var auditObj = this.certificateAudit("1", "0", this.indexEle, auditRyId, certificateId, "更换检定员成功");
                console.log(auditObj, 'auditObj')
                if (auditObj != false) {
                  //审核状态位
                  $("#xxyContent [name='zs_jdy_audit_status']").eq(this.indexEle).val("1");
                  // 职务
                  $("#xxyContent [name='zs_jdy_job']").eq(this.indexEle).html(auditObj.position);
                  // 名称
                  $("#xxyContent [name='zs_jdy_name']").eq(this.indexEle).html(auditObj.userName);
                  // 电子签名
                  $("#xxyContent [name='zs_jdy_img']").eq(this.indexEle).attr("src", "/njmind/attachment/down/" + auditObj.signnature);

                }
              }
            }else {
              this.$message.warning("已检定证书不可以删除检定员");
            }
          }else {
            if("" == $(obj).val()){
              $("#xxyContent [name='zs_jdy_button']").eq(this.indexEle).attr("disabled","true");
            }else {
              $("#xxyContent [name='zs_jdy_button']").eq(this.indexEle).removeAttr("disabled");
            }
            //赋值
            $("#xxyContent [name='"+showName+"']").eq(this.indexEle).html($(obj).find("option:selected").text());
            //设置id
            $("#xxyContent [name='zs_jdy_id']").eq(this.indexEle).val($(obj).val());
//            $("#xxyContent [name='zs_jdy_button']").eq(this.indexEle).removeAttr("disabled");
            //设置修改状态
            this.$emit('setChangeShr',true );
          }
        }

      }
    },
    //点击核验员的方法
    leftClickHyy(obj,thisName,showName){
      //先获得第几个元素
      this.indexEle = $("#xxyContent [name='"+thisName+"']").index(obj);
      if(typeof this.getChangeShr == "function" && (this.getChangeShr()) && $("#xxyContent [name='zs_hyy_audit_status']").eq(this.indexEle).val() == "1") {
        this.$message.warning("请先保存证书");
      }else {
        //判断是否批准
        if(this.changeJdyNoCkeck || $("#xxyContent [name='zs_pzr_audit_status'][value='1']").length==0 ||
          ($("#xxyContent [name='zs_hyy_id']").eq(this.indexEle).val() != "" && $("#xxyContent [name='zs_pzr_audit_status'][value='1']").length > 0  )
        ){
          if(this.changeJdy4Sh || $("#xxyContent [name='zs_hyy_audit_status']").eq(this.indexEle).val() != "1"){
            //隐藏当前元素
            $(obj).hide();
            //显示并赋值
            $("#xxyContent [name='" + showName + "']").eq(this.indexEle).show()[0].value
              =
              $("#xxyContent [name='zs_hyy_id']").eq(this.indexEle).val();
            //选中元素
            $("#xxyContent [name='" + showName + "']").eq(this.indexEle).focus();
          }else {
            this.$message.warning("证书已核验，不允许修改核验员");
          }
        }else {
          this.$message.warning("证书已批准，不允许增加核验员");
        }
      }
    },
    //失焦方法 核验员
    blurClickHyy(obj,showName){
      if ($(obj)[0].selectedIndex == -1) {
        //隐藏
        $(obj).hide();
        //显示
        $("#xxyContent [name='"+showName+"']").eq(this.indexEle).show();
      } else {
        //隐藏
        $(obj).hide();
        //显示
        $("#xxyContent [name='"+showName+"']").eq(this.indexEle).show();
        //
        if($(obj).val() != "" && ($(obj).val() == $("#xxyContent [name='zs_jdy_id']").eq(this.indexEle).val()) ){
          this.$message.warning("检定员与核验员不能相同");
          return ;
        }
        //判断人员是否更换
        if ($(obj).val() != $("#xxyContent [name='zs_hyy_id']").eq(this.indexEle).val()) {

          //判断当前是否核验
          if($("#xxyContent [name='zs_hyy_audit_status']").eq(this.indexEle).val() == "1"){
            if("" != $(obj).val()) {
              //赋值
              $("#xxyContent [name='" + showName + "']").eq(this.indexEle).html($(obj).find("option:selected").text());
              //设置id
              $("#xxyContent [name='zs_hyy_id']").eq(this.indexEle).val($(obj).val());
              //获得证书id
              var certificateId = this.getOriginalLogId();
              //获得人员id
              var auditRyId = $("#xxyContent [name='zs_hyy_id']").eq(this.indexEle).val();
              if(auditRyId && ""!=auditRyId) {
                var auditObj = this.certificateAudit("1", "1", this.indexEle, auditRyId, certificateId, "更换核验员成功");
                console.log(auditObj, 'auditObj')

                if(auditObj != false){
                  $("#xxyContent [name='zs_hyy_audit_status']").eq(this.indexEle).val("1")
                  // 职务
                  $("#xxyContent [name='zs_hyy_job']").eq(this.indexEle).html(auditObj.position);
                  // 名称
                  $("#xxyContent [name='zs_hyy_name']").eq(this.indexEle).html(auditObj.userName);
                  // 电子签名
                  $("#xxyContent [name='zs_hyy_img']").eq(this.indexEle).attr("src","/njmind/attachment/down/"+auditObj.signnature);
                }
              }
            }else {
              this.$message.warning("已核验证书不可以删除核验员");
            }
          }else {
            if("" == $(obj).val()){
              $("#xxyContent [name='zs_hyy_button']").eq(this.indexEle).attr("disabled","true");
            }else {
              $("#xxyContent [name='zs_hyy_button']").eq(this.indexEle).removeAttr("disabled");
            }
            //赋值
            $("#xxyContent [name='" + showName + "']").eq(this.indexEle).html($(obj).find("option:selected").text());
            //设置id
            $("#xxyContent [name='zs_hyy_id']").eq(this.indexEle).val($(obj).val());
//            $("#xxyContent [name='zs_hyy_button']").eq(this.indexEle).removeAttr("disabled");
            //设置修改状态
            this.$emit('setChangeShr',true );
          }
        }
      }
    },
//    //点击批准人的方法
//    leftClickPzr(obj,thisName,showName){
//      //先获得第几个元素
//      this.indexEle = $("#xxyContent [name='"+thisName+"']").index(obj);
//      if(typeof this.getChangeShr == "function" && (this.getChangeShr()) && $("#xxyContent [name='zs_pzr_audit_status']").eq(this.indexEle).val() == "1") {
//        this.$message.warning("请先保存证书");
//      }else {
//        if(this.changeJdy4Sh || $("#xxyContent [name='zs_pzr_audit_status']").eq(this.indexEle).val() != "1"){
//          //隐藏当前元素
//          $(obj).hide();
//          //显示并赋值
//          $("#xxyContent [name='" + showName + "']").eq(this.indexEle).show()[0].value
//            =
//            $("#xxyContent [name='zs_pzr_id']").eq(this.indexEle).val();
//          //选中元素
//          $("#xxyContent [name='" + showName + "']").eq(this.indexEle).focus();
//        }else {
//          this.$message.warning("证书已批准，不允许修改批准人");
//        }
//      }
//    },
//    //失焦方法 批准人
//    blurClickPzr(obj,showName){
//      if ($(obj)[0].selectedIndex == -1) {
//        //隐藏
//        $(obj).hide();
//        //显示
//        $("#xxyContent [name='"+showName+"']").eq(this.indexEle).show();
//      } else {
//        //隐藏
//        $(obj).hide();
//        //显示
//        $("#xxyContent [name='"+showName+"']").eq(this.indexEle).show();
//        //判断人员是否更换
//        if ($(obj).val() != $("#xxyContent [name='zs_pzr_id']").eq(this.indexEle).val()) {
//          //判断当前是否批准
//          if($("#xxyContent [name='zs_pzr_audit_status']").eq(this.indexEle).val() == "1"){
//            if("" != $(obj).val()) {
//              //赋值
//              $("#xxyContent [name='" + showName + "']").eq(this.indexEle).html($(obj).find("option:selected").text());
//              //设置id
//              $("#xxyContent [name='zs_pzr_id']").eq(this.indexEle).val($(obj).val());
//              //获得证书id
//              var certificateId = this.getOriginalLogId();
//              //获得人员id
//              var auditRyId = $("#xxyContent [name='zs_pzr_id']").eq(this.indexEle).val();
//              if(auditRyId && ""!=auditRyId) {
//                var auditObj = this.certificateAudit("1", "2", this.indexEle, auditRyId, certificateId, "更换批准人成功");
//                console.log(auditObj, 'auditObj')
//
//                if(auditObj != false){
//                  $("#xxyContent [name='zs_pzr_audit_status']").eq(this.indexEle).val("1")
//                  // 职务
//                  $("#xxyContent [name='zs_pzr_job']").eq(this.indexEle).html(auditObj.position);
//                  // 名称
//                  $("#xxyContent [name='zs_pzr_name']").eq(this.indexEle).html(auditObj.userName);
//                  // 电子签名
//                  $("#xxyContent [name='zs_pzr_img']").eq(this.indexEle).attr("src","/njmind/attachment/down/"+auditObj.signnature);
//                }
//              }
//
//            }else {
//              this.$message.warning("已核验证书不可以删除批准人");
//            }
//          }else {
//            //赋值
//            $("#xxyContent [name='" + showName + "']").eq(this.indexEle).html($(obj).find("option:selected").text());
//            //设置id
//            $("#xxyContent [name='zs_pzr_id']").eq(this.indexEle).val($(obj).val());
//
//            //设置修改状态
//            this.$emit('setChangeShr', true);
//          }
//        }
//      }
//    },
    //获得检定周期
    getCertificateJdzqArr() {
      ajaxProxyRequest("get", "/njmind/findParam/certificateJdzq", {codeType:'NUMBER'}, res => {
        this.certificateJdzqArr = res.list;
      });
    },
    //设置有效期
    setCertificateJdzq(){
      var jdrq = this.getZsJdrq();

      ajaxRequest("get", "back/certificateCommon/getYxrqByJdrq/"+ jdrq +"/"+ this.certificateJdzq +"/"+"yyyy-MM-dd", null, res => {
        if(res.code == 200){
          this.setZsYxrq(res.daoResult);
          $("#xxyContent [name='zs_jdzq']").html(this.certificateJdzq);
//          this.$message.success('设置日期成功');
        }else {
          this.$message.error('设置日期失败');
        }
      });
    },
    //点击检定周期
    leftClickJzq(obj,thisName,showName){
      //先获得第几个元素
      this.indexEle = $("#xxyContent [name='"+thisName+"']").index(obj);

      $(obj)
        .hide()
        .parent()
        .find("[name='" + showName + "']")
        .show()[0].value = this.certificateJdzq;
      $(obj)
        .parent()
        .find("[name='" + showName + "']")
        .focus();
    },
    //失焦方法 检定周期
    blurClickJzq(obj,showName){
      if ($(obj)[0].selectedIndex == -1) {
        //隐藏
        $(obj).hide();
        //显示
        $("#xxyContent [name='"+showName+"']").eq(this.indexEle).show();
      } else {
        //隐藏
        $(obj).hide();
        //显示、赋值
        $("#xxyContent [name='"+showName+"']").eq(this.indexEle).show()
          .html($(obj).find("option:selected").text());
        //设置id
        this.certificateJdzq = parseInt($(obj).val());
        //
        if(typeof this.setCertificateJdzq4Xxy == "function"){
          this.setCertificateJdzq4Xxy(this.certificateJdzq);
        }
        this.setCertificateJdzq();
      }
    },
    //证书添加，信息页保存时候校验
    checkData4CertificateAdd(){
      //单位名称
      var dwmcObj = $("#xxyContent [name='zs_zsdwmc']");
      for(var i=0;i<dwmcObj.length;i++){
        if("" === dwmcObj.eq(i).html()){
          return "请填写单位名称" ;
        }
      }

      //器具名称
      var qjmcObj = $("#xxyContent [name='zs_zsqjmc']");
      for(var i=0;i<qjmcObj.length;i++){
        if("" === qjmcObj.eq(i).html()){
          return "请填写器具名称" ;
        }
      }

      var jdrq = this.getZsJdrq()

      //检定日期、有效日期
      if(jdrq > this.getZsYxrq()){
        return "有效日期不得小于检定日期" ;
      }

      //检定核验员
      //先获得已经填写id的检定员
      var jdyArr = $("#xxyContent [name='zs_jdy_id'][value!='']");
      if(jdyArr.length == 0 ){
        return "请选择检定员" ;
      }
      //判断已填写id的最后一个检定员在总检定员中是否正常顺序
      if($("#xxyContent [name='zs_jdy_id']").index(jdyArr[jdyArr.length-1]) != jdyArr.length-1){
        for(var i=0;i<jdyArr.length;i++){
          if($("#xxyContent [name='zs_jdy_id']").index(jdyArr[i]) != i){
            return "第"+(i+1)+"行检定员不可为空" ;
          }
        }
        return "检定员不可有空行" ;
      }
      //先获得已经填写id的检定员
      var hyyArr = $("#xxyContent [name='zs_hyy_id'][value!='']");
      if(hyyArr.length == 0 ){
        return "请选择核验员" ;
      }
      //判断已填写id的最后一个检定员在总检定员中是否正常顺序
      if($("#xxyContent [name='zs_hyy_id']").index(hyyArr[hyyArr.length-1]) != hyyArr.length-1){
        for(var i=0;i<hyyArr.length;i++){
          if($("#xxyContent [name='zs_hyy_id']").index(hyyArr[i]) != i){
            return "第"+(i+1)+"行核验员不可为空" ;
          }
        }
        return "核验员不可有空行" ;
      }

      //获得检验类型
      var zs_jd_type = $("#xxyContent [name='zs_jd_type']:checked");
      console.log(zs_jd_type,'zs_jd_type')
      if(zs_jd_type.length == 0 ){
        return "请选择检定类型！" ;
      }

      var jsgcCountMin = zs_jd_type.eq(0).attr("data-zs-jsgc-count-min");
      var jlbzCountMin = zs_jd_type.eq(0).attr("data-zs-jlbz-count-min");
      var jlbzqCountMin = zs_jd_type.eq(0).attr("data-zs-jlbzq-count-min");
      console.log(jsgcCountMin,'jsgcCountMin')
      console.log(jlbzCountMin,'jlbzCountMin')
      console.log(jlbzqCountMin,'jlbzqCountMin')

      //先将无ID的勾选去掉


      //技术依据校验
      var jsyjRowArr = $("#xxyContent [name='zs_jsgc_row']");
      //循环每一行 有id并且勾选
      for(var i=0;i<jsyjRowArr.length;i++){
        if (jsyjRowArr.eq(i).find("[name='zs_jsgc_id']").eq(0).val() != ""
          && jsyjRowArr.eq(i).find("[name='zs_jsgc_checked']").eq(0).is(":checked")
        ) {
          //先寻找中文名称
          if (jsyjRowArr.eq(i).find("[name='zs_jsgc_name']").length == 1) {
            if ("" == $.trim(jsyjRowArr.eq(i).find("[name='zs_jsgc_name']").html())) {
              return "第" + (i + 1) + "行技术依据名称不能为空！";
            }
          }
        }else {
          //没有id，去除勾选
          jsyjRowArr.eq(i).find("[name='zs_jsgc_checked']").eq(0).prop("checked",false);
        }
      }
      if($("#xxyContent input:checkbox[name='zs_jsgc_checked']:checked").length < jsgcCountMin ){
        return "至少关联"+jsgcCountMin+"个技术规程！" ;
      }


      //计量标准 校验
      var jlbzRowArr = $("#xxyContent [name='zs_jlbz_row']");
      //循环每一行
      for (var i = 0; i < jlbzRowArr.length; i++) {
        if (jlbzRowArr.eq(i).find("[name='zs_jlbz_id']").eq(0).val() != ""
          && jlbzRowArr.eq(i).find("[name='zs_jlbz_checked']").eq(0).is(":checked")
        ) {
          //先寻找中文名称
          if (jlbzRowArr.eq(i).find("[name='zs_jlbz_name']").length == 1) {
            if ("" == $.trim(jlbzRowArr.eq(i).find("[name='zs_jlbz_name']").html())) {
              return "第" + (i + 1) + "行计量标准名称不能为空！";
            }
          }
          //有效日期 与 检定日期对比
          if (jlbzRowArr.eq(i).find("[name='zs_jlbz_yxrq']").length == 1) {
            console.log(jdrq,$.trim(jlbzRowArr.eq(i).find("[name='zs_jlbz_yxrq']").html()),"行计量标准有效期")
            if("" == $.trim(jlbzRowArr.eq(i).find("[name='zs_jlbz_yxrq']").html())){
              return "第" + (i + 1) + "行计量标准有效期不能为空！";
            }
            if (jdrq > $.trim(jlbzRowArr.eq(i).find("[name='zs_jlbz_yxrq']").html())) {
              return "第" + (i + 1) + "行计量标准有效期过期！";
            }
          }
          //溯源有效日期 与 检定日期对比
          if (jlbzRowArr.eq(i).find("[name='zs_jlbz_yxrq_social']").length == 1) {
            console.log(jdrq,$.trim(jlbzRowArr.eq(i).find("[name='zs_jlbz_yxrq_social']").html()),"行计量标准有效期")
            if("" == $.trim(jlbzRowArr.eq(i).find("[name='zs_jlbz_yxrq_social']").html())){
              return "第" + (i + 1) + "行计量标准溯源有效期不能为空！";
            }
            if (jdrq > $.trim(jlbzRowArr.eq(i).find("[name='zs_jlbz_yxrq_social']").html())) {
              return "第" + (i + 1) + "行计量标准溯源有效期过期！";
            }
          }
        }else {
          //没有id，去除勾选
          jlbzRowArr.eq(i).find("[name='zs_jlbz_checked']").eq(0).prop("checked",false);
        }
      }
      if($("#xxyContent input:checkbox[name='zs_jlbz_checked']:checked").length < jlbzCountMin ){
        return "至少关联"+jlbzCountMin+"个计量标准！" ;
      }

      //标准器 校验
      var bzqRowArr = $("#xxyContent [name='zs_jlbzq_row']");
      //循环每一行
      for (var i = 0; i < bzqRowArr.length; i++) {
        if (bzqRowArr.eq(i).find("[name='zs_jlbzq_id']").eq(0).val() != ""
          && jlbzRowArr.eq(i).find("[name='zs_jlbzq_checked']").eq(0).is(":checked")
        ) {
          //先寻找中文名称
          if (bzqRowArr.eq(i).find("[name='zs_jlbzq_name']").length == 1) {
            if ("" == $.trim(bzqRowArr.eq(i).find("[name='zs_jlbzq_name']").html())) {
              return "第" + (i + 1) + "行标准器名称不能为空！";
            }
          }
          //有效日期 与 检定日期对比
          if (bzqRowArr.eq(i).find("[name='zs_jlbzq_yxrq']").length == 1) {
            console.log(jdrq,$.trim(bzqRowArr.eq(i).find("[name='zs_jlbzq_yxrq']").html()),"行标准器有效期")
            if("" == $.trim(bzqRowArr.eq(i).find("[name='zs_jlbzq_yxrq']").html())){
              return "第" + (i + 1) + "行标准器有效期不能为空！";
            }
            if (jdrq > $.trim(bzqRowArr.eq(i).find("[name='zs_jlbzq_yxrq']").html())) {
              return "第" + (i + 1) + "行标准器有效期过期！";
            }
          }
        }else {
          //没有id，去除勾选
          jlbzRowArr.eq(i).find("[name='zs_jlbzq_checked']").eq(0).prop("checked",false);
        }
      }
      if($("#xxyContent input:checkbox[name='zs_jlbzq_checked']:checked").length < jlbzqCountMin ){
        return "至少关联"+jlbzqCountMin+"个计量标准器！" ;
      }

      return true ;
    },
    //检定员检定按钮
    jdyButtonClick(clickObj){
      console.log(typeof this.getChangeShr,'typeof this.getChangeShr')
      console.log(typeof this.getChangeShr,typeof this.getOriginalLogId,'111111111111')
      if(typeof this.getChangeShr == "function" && typeof this.getOriginalLogId == "function"){
        if(!this.getChangeShr()){
          //获得证书id
          var certificateId = this.getOriginalLogId();
          if(certificateId == null || certificateId ==""){
            this.$message.warning("请先保存证书");
            return ;
          }
          //获得当前第几个核验按钮
          var index = $("#xxyContent [name='zs_jdy_button']").index(clickObj);
          //获得人员id
          var auditRyId = $("#xxyContent [name='zs_jdy_id']").eq(index).val();
          if(auditRyId && ""!=auditRyId){
            if(window.localStorage.userId == auditRyId || this.certificatePasswordCheck == 1 ){
              this.checkSignnaturePasswordBack(true,"0", "0", index, auditRyId, certificateId, "检定成功");
            }else {
              this.checkSignnaturePasswordShow = true;
              this.$nextTick(() => {
                this.$refs.checkSignnaturePasswordDialog.getUserInfo("0", "0", index, auditRyId, certificateId, "检定成功");
              });
              return;
            }
          }
        }else {
          this.$message.warning("请先保存证书");
        }
      }
    },
    //核验员检定按钮
    hyyButtonClick(clickObj,auditUserChangeFlag){
      if(typeof this.getChangeShr == "function" && typeof this.getOriginalLogId == "function"){
        if(!this.getChangeShr()){
          if($("#xxyContent [name='zs_jdy_id'][value!='']").length==0 || $("#xxyContent [name='zs_jdy_id'][value!='']").length != $("#xxyContent [name='zs_jdy_audit_status'][value='1']").length) {
            this.$message.warning("请先完成检定操作！");
            return;
          }

          //获得证书id
          var certificateId = this.getOriginalLogId();
          //获得当前第几个核验按钮
          var index = $("#xxyContent [name='zs_hyy_button']").index(clickObj);
          //获得人员id
          var auditRyId = $("#xxyContent [name='zs_hyy_id']").eq(index).val();
          if(auditRyId && ""!=auditRyId){
            if(window.localStorage.userId == auditRyId || this.certificatePasswordCheck == 1 ){
              this.checkSignnaturePasswordBack(true,auditUserChangeFlag,"1",index,auditRyId,certificateId,"核验成功");
            }else {
              this.checkSignnaturePasswordShow = true ;
              this.$nextTick(() => {
                this.$refs.checkSignnaturePasswordDialog.getUserInfo(auditUserChangeFlag,"1",index,auditRyId,certificateId,"核验成功");
              });
              return;
            }
          }
        }else {
          this.$message.warning("请先保存证书");
        }
      }
    },
//    //批准按钮（BY：是否备用批准）
//    pzrButtonClick(BY){
//      if(typeof this.getChangeShr == "function" && typeof this.getOriginalLogId == "function"){
//        if(!this.getChangeShr()){
//          console.log($("#xxyContent [name='zs_hyy_id'][value!='']"),'$("#xxyContent [name=\'zs_hyy_id\'][value!=\'\']")')
//          console.log($("#xxyContent [name='zs_Hyy_audit_status'][value='1']"),'$("#xxyContent [name=\'zs_Hyy_audit_status\'][value=\'1\']")')
//          if($("#xxyContent [name='zs_hyy_id'][value!='']").length==0 || $("#xxyContent [name='zs_hyy_id'][value!='']").length != $("#xxyContent [name='zs_hyy_audit_status'][value='1']").length) {
//            this.$message.warning("请先完成核验操作！");
//            return;
//          }
//
//          //获得证书id
//          var certificateId = this.getOriginalLogId();
//          //获得当前第几个核验按钮
//          var index = 0;
//          //获得人员id
//          var auditRyId = window.localStorage.userId ;
//          if(BY == true){
//            auditRyId = $("#xxyContent [name='zs_pzr_id']").eq(index).val();
//          }
//          if(auditRyId && ""!=auditRyId){
//            if(window.localStorage.userId == auditRyId || this.certificatePasswordCheck == 1 ){
//              this.checkSignnaturePasswordBack(true,"0","2",index,auditRyId,certificateId,"批准成功");
//            }else {
//              this.checkSignnaturePasswordShow = true ;
//              this.$nextTick(() => {
//                this.$refs.checkSignnaturePasswordDialog.getUserInfo("0","2",index,auditRyId,certificateId,"批准成功");
//              });
//              return;
//            }
//          }else {
//            this.$message.warning("请选择批准人");
//          }
//        }else {
//          this.$message.warning("请先保存证书");
//        }
//      }
//    },
    //auditUserChangeFlag：是否更换检定员，核验员，0没更换，1更换
    //auditCertificateFlag：审核状态，0检定，1核验，2批准
    //auditCertificateInex：检定，核验的是第几个检定员核验员
    //auditRyId：人员id
    //certificateId：证书id
    //successTip：成功提示信息
    certificateAudit(auditUserChangeFlag,auditCertificateFlag,auditCertificateInex,auditRyId,certificateId,successTip){
      var returnObj = {};
      var flag = false ;
      ajaxSyncRequest("put", "back/originalLog/auditOriginalLogById", {
        auditUserChangeFlag:auditUserChangeFlag,
        auditCertificateFlag:auditCertificateFlag,
        auditCertificateInex:auditCertificateInex,
        ysjlId:certificateId,
        auditRyId:auditRyId
      }, res => {
        if(res.code == 200){
          if("" != successTip){
            this.$message.success(successTip);
          }
          if(auditCertificateFlag == "0" || auditCertificateFlag == "1"){
            returnObj.userName = res.daoResult.dataValue1 ;
            returnObj.position = res.daoResult.dataValue4 ;
            returnObj.signnature = res.daoResult.dataValue3 ;
          }else if(auditCertificateFlag == "2"){
            returnObj.userId = res.daoResult.pzr ;
            returnObj.userName = res.daoResult.pzrName ;
            returnObj.position = res.daoResult.pzrJob ;
            returnObj.signnature = res.daoResult.pzrPath ;
          }

          flag = true ;
        }else {
          this.$message.error(res.msg);
          flag = false ;
        }
      });

      if(flag){
        return returnObj ;
      }else {
        return false ;
      }
    },

    //批量审核
    // djhArr：登记号数组
    // auditCertificateFlag：审核状态，0检定，1核验，2批准

    certificateAuditBatch(djhArr,auditCertificateFlag,successTip){
      var returnObj = {};
      var flag = false ;
      ajaxSyncRequest("put", "back/originalLog/auditOriginalLogBatch/"+djhArr, {auditCertificateFlag:auditCertificateFlag}, res => {
        if(res.code == 200){
          this.$message.success(successTip);
          flag = true ;
        }else {
          this.$message.error(res.msg);
          flag = false ;
        }
      });

      if(flag){
        return returnObj ;
      }else {
        return false ;
      }
    },

    //追加挂在日期控件
    //obj：追加的obj
    //defDate：默认时间
    //minDate：最小日期
    appendDatePicker(obj,defDate,minDate){
      var _this = this ;
      if(minDate != ""){
        minDate = this.stringToDate(minDate)
      }
      //日期控件
      let DateSelect = Vue.extend({
        data() {
          return {
            pickerOptions: {
              disabledDate(time) {
                if(minDate != "" ){
                  return time.getTime() < minDate.getTime();
                }else {
                  return false ;
                }
              },
              firstDayOfWeek:1,
              shortcuts: [
                {
                  text: "今天",
                  onClick(picker) {
                    picker.$emit("pick", new Date());
                  }
                },
                {
                  text: "昨天",
                  onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit("pick", date);
                  }
                },
                {
                  text: "一周前",
                  onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit("pick", date);
                  }
                }
              ]
            },
            value: null,
            defDate: defDate
          };
        },

        mounted() {
          this.$nextTick(() => {
            this.$refs.datePicker.focus();
          });
        },
        methods: {
          handleClose() {
            this.$destroy(true);
            this.$el.parentNode.removeChild(this.$el);
            $(obj).show();
          },
          chooseDate(date) {
            //判断元素的name，进行相应的赋值判断
            //证书检定日期
            if (
              $(obj)
                .attr("name")
                .indexOf("zs_zsjdrq_") != -1
            ) {
              _this.setZsJdrq(date);
            } else if (
              $(obj)
                .attr("name")
                .indexOf("zs_zsyxrq_") != -1
            ) {
              //与检定日期进行校验
              if(date < _this.getZsJdrq()){
                this.$message.warning("有效日期不得小于检定日期");
              }else {
                //证书有效日期
                _this.setZsYxrq(date);
              }
            }else if($(obj)
                .attr("name") ==
                "zs_jlbzq_yxrq" ){
              if(date < _this.getZsJdrq()){
                this.$message.warning("有效日期不得小于检定日期");
              }else {
                $(obj).html(date)
              }
            }else if($(obj)
                .attr("name") ==
              "zs_jlbz_yxrq" ){
              if(date < _this.getZsJdrq()){
                this.$message.warning("有效日期不得小于检定日期");
              }else {
                $(obj).html(date) ;
              }
            }else if($(obj)
                .attr("name") ==
              "zs_jlbz_yxrq_social" ){
              if(date < _this.getZsJdrq()){
                this.$message.warning("有效日期不得小于检定日期");
              }else {
                $(obj).html(date) ;
              }
            }
            this.handleClose();
          }
        },
        directives: { Clickoutside },
        template:
        '<el-date-picker v-model="value" type="date" :default-value="defDate" @blur="handleClose" @change="chooseDate" ' +
        'value-format="yyyy-MM-dd" ref="datePicker" placeholder="请选择日期" :picker-options="pickerOptions">></el-date-picker>'
      });
      let instance = new DateSelect().$mount();

      $(obj).hide();
      $(obj).after(instance.$el);
    },
    //字符串转日期
    stringToDate(DateStr){
      var arys= DateStr.split('-');
      var myDate = new Date(arys[0],--arys[1],arys[2]);
      return myDate;
    },
    //设置检定员签名图片
    setJdyInfo(jdyList){

      var jdyArrTemp=[];
      if(jdyList) {
        for (var i = 0; i < jdyList.length; i++) {
          //判断元素是否存在
          if ($("#xxyContent [name='zs_jdy_id']").eq(jdyList[i].dataIndex).length == 1) {
            if (jdyList[i].dataKey != null) {
              //人员id
              $("#xxyContent [name='zs_jdy_id']").eq(jdyList[i].dataIndex).val(jdyList[i].dataKey)
              //状态
              $("#xxyContent [name='zs_jdy_audit_status']").eq(jdyList[i].dataIndex).val(jdyList[i].dataValue2)
              //按钮
              if (jdyList[i].dataValue2 == 1) {
                $("#xxyContent [name='zs_jdy_button']").eq(jdyList[i].dataIndex).attr("disabled", "true");
                // 职务
                $("#xxyContent [name='zs_jdy_job']").eq(jdyList[i].dataIndex).html(jdyList[i].dataValue4);
                // 名称
                $("#xxyContent [name='zs_jdy_name']").eq(jdyList[i].dataIndex).html(jdyList[i].dataValue1);
                // 电子签名
                $("#xxyContent [name='zs_jdy_img']").eq(jdyList[i].dataIndex).attr("src", "/njmind/attachment/down/" + jdyList[i].dataValue3);
                //下拉框的名字
                $("#xxyContent [name='zs_jdy']").eq(jdyList[i].dataIndex).html(jdyList[i].dataValue1);
              } else {
                $("#xxyContent [name='zs_jdy_button']").eq(jdyList[i].dataIndex).removeAttr("disabled");
                // 职务
//                $("#xxyContent [name='zs_jdy_job']").eq(jdyList[i].dataIndex).html($("#xxyContent [name='zs_jdy_job']").eq(jdyList[i].dataIndex).attr("data-zs-value-default")?$("#xxyContent [name='zs_jdy_job']").eq(jdyList[i].dataIndex).attr("data-zs-value-default"):'');
//                // 名称
//                $("#xxyContent [name='zs_jdy_name']").eq(jdyList[i].dataIndex).html($("#xxyContent [name='zs_jdy_name']").eq(jdyList[i].dataIndex).attr("data-zs-value-default")?$("#xxyContent [name='zs_jdy_name']").eq(jdyList[i].dataIndex).attr("data-zs-value-default"):'');
                // 电子签名
//                $("#xxyContent [name='zs_jdy_img']").eq(jdyList[i].dataIndex).attr("src", "");
              }
            }
            jdyArrTemp[jdyArrTemp.length]= jdyList[i].dataIndex;
          } else {
            continue;
          }
        }
      }
      var jdyIdArr = $("#xxyContent [name='zs_jdy_id']") ;
      for(var i=0;i<jdyIdArr.length;i++){
        if($.inArray(i,jdyArrTemp)<0){
          console.log($("#xxyContent [name='zs_jdy_id']").eq(i),'不存在');
          console.log($("#xxyContent [name='zs_jdy_id']").eq(i),'$("#xxyContent [name=\'zs_jdy_id\']").eq(i).val()')
          if(null == $("#xxyContent [name='zs_jdy_id']").eq(i).val() || $("#xxyContent [name='zs_jdy_id']").eq(i).val()==""){
            $("#xxyContent [name='zs_jdy_button']").eq(i).attr("disabled", "true");
          }else {
            $("#xxyContent [name='zs_jdy_button']").eq(i).removeAttr("disabled");
          }
        }
      }
    },
    //设置核验员签名图片
    setHyyInfo(hyyList){
      var hyyArrTemp=[];
      if(hyyList) {
        for(var i=0;i<hyyList.length;i++){
          //判断元素是否存在
          if($("#xxyContent [name='zs_hyy_id']").eq(i).length == 1 ){
            if(hyyList[i].dataKey != null ){

              //人员id
              $("#xxyContent [name='zs_hyy_id']").eq(i).val(hyyList[i].dataKey)
              //状态
              $("#xxyContent [name='zs_hyy_audit_status']").eq(i).val(hyyList[i].dataValue2)
              //按钮
              //按钮
              if(hyyList[i].dataValue2 == 1){
                $("#xxyContent [name='zs_hyy_button']").eq(i).attr("disabled", "true");
                // 职务
                $("#xxyContent [name='zs_hyy_job']").eq(i).html(hyyList[i].dataValue4);
                // 名称
                $("#xxyContent [name='zs_hyy_name']").eq(i).html(hyyList[i].dataValue1);
                // 电子签名
                $("#xxyContent [name='zs_hyy_img']").eq(i).attr("src","/njmind/attachment/down/"+hyyList[i].dataValue3);
                //下拉框的名字
                $("#xxyContent [name='zs_hyy']").eq(i).html(hyyList[i].dataValue1);
              }else {
                $("#xxyContent [name='zs_hyy_button']").eq(i).removeAttr("disabled");
//                // 职务
//                $("#xxyContent [name='zs_hyy_job']").eq(i).html($("#xxyContent [name='zs_hyy_job']").eq(hyyList[i].dataIndex).attr("data-zs-value-default")?$("#xxyContent [name='zs_hyy_job']").eq(hyyList[i].dataIndex).attr("data-zs-value-default"):'');
//                // 名称
//                $("#xxyContent [name='zs_hyy_name']").eq(i).html($("#xxyContent [name='zs_hyy_name']").eq(hyyList[i].dataIndex).attr("data-zs-value-default")?$("#xxyContent [name='zs_hyy_name']").eq(hyyList[i].dataIndex).attr("data-zs-value-default"):'');
//                // 电子签名
//                $("#xxyContent [name='zs_hyy_img']").eq(i).attr("src","");
              }
            }
            hyyArrTemp[hyyArrTemp.length]= hyyList[i].dataIndex;
          }else {
            continue;
          }
        }
      }
      var hyyIdArr = $("#xxyContent [name='zs_hyy_id']") ;
      for(var i=0;i<hyyIdArr.length;i++){
        if($.inArray(i,hyyArrTemp)<0){
          if(null == $("#xxyContent [name='zs_hyy_id']").eq(i).val() || $("#xxyContent [name='zs_hyy_id']").eq(i).val()==""){
            $("#xxyContent [name='zs_hyy_button']").eq(i).attr("disabled", "true");
          }else {
            $("#xxyContent [name='zs_hyy_button']").eq(i).removeAttr("disabled");
          }
        }
      }
    },
    //设置批准人签名图片
//    setPzrInfo(obj){
//      //判断元素是否存在
//      if($("#xxyContent [name='zs_pzr_id']").eq(0).length == 1 ){
//        if(obj.pzr != null ){
//
//          //人员id
//          $("#xxyContent [name='zs_pzr_id']").eq(0).val(obj.pzr)
//          //状态
//          $("#xxyContent [name='zs_pzr_audit_status']").eq(0).val(obj.pzrSh)
//          //按钮
//          //按钮
//          if(obj.pzrSh == 1){
//            // 职务
//            $("#xxyContent [name='zs_pzr_job']").eq(0).html(obj.pzrJob);
//            // 名称
//            $("#xxyContent [name='zs_pzr_name']").eq(0).html(obj.pzrName);
//            // 电子签名
//            $("#xxyContent [name='zs_pzr_img']").eq(0).attr("src","/njmind/attachment/down/"+obj.pzrPath);
//            //下拉框的名字
//            $("#xxyContent [name='zs_pzr']").eq(0).html(obj.pzrName);
//          }else {
//            // 职务
////            $("#xxyContent [name='zs_pzr_job']").eq(0).html($("#xxyContent [name='zs_pzr_job']").eq(0).attr("data-zs-value-default")?$("#xxyContent [name='zs_pzr_job']").eq(0).attr("data-zs-value-default"):'');
////            // 名称
////            $("#xxyContent [name='zs_pzr_name']").eq(0).html($("#xxyContent [name='zs_pzr_name']").eq(0).attr("data-zs-value-default")?$("#xxyContent [name='zs_pzr_name']").eq(0).attr("data-zs-value-default"):'');
////            // 电子签名
////            $("#xxyContent [name='zs_pzr_img']").eq(0).attr("src","");
//          }
//        }
//      }
//    },
    //下一份证书对信息页的处理
    nextCertificateInit(flag){
      if(flag){
        for(var i=0;i<$("#xxyContent [name='zs_jdy_id']").length;i++){
          // 职务
          $("#xxyContent [name='zs_jdy_job']").eq(i).html(($("#xxyContent [name='zs_jdy_job']").eq(i).attr("data-zs-value-default")!= null)?$("#xxyContent [name='zs_jdy_job']").eq(i).attr("data-zs-value-default"):'');
          // 名称
          $("#xxyContent [name='zs_jdy_name']").eq(i).html(($("#xxyContent [name='zs_jdy_name']").eq(i).attr("data-zs-value-default")!= null)?$("#xxyContent [name='zs_jdy_name']").eq(i).attr("data-zs-value-default"):'');
        }
      }
      // 电子签名
      $("#xxyContent [name='zs_jdy_img']").attr("src","");
      //状态
      $("#xxyContent [name='zs_jdy_audit_status']").val("0")

      this.setJdyInfo();
      if(flag) {
        for (var i = 0; i < $("#xxyContent [name='zs_hyy_id']").length; i++) {
          // 职务
          $("#xxyContent [name='zs_hyy_job']").eq(i).html(($("#xxyContent [name='zs_hyy_job']").eq(i).attr("data-zs-value-default") != null) ? $("#xxyContent [name='zs_hyy_job']").eq(i).attr("data-zs-value-default") : '');
          // 名称
          $("#xxyContent [name='zs_hyy_name']").eq(i).html(($("#xxyContent [name='zs_hyy_name']").eq(i).attr("data-zs-value-default") != null) ? $("#xxyContent [name='zs_hyy_name']").eq(i).attr("data-zs-value-default") : '');
        }
      }
      // 电子签名
      $("#xxyContent [name='zs_hyy_img']").attr("src", "");
      //状态
      $("#xxyContent [name='zs_hyy_audit_status']").val("0");
      this.setHyyInfo();
      if(flag) {
        // 职务
        $("#xxyContent [name='zs_pzr_job']").eq(0).html(($("#xxyContent [name='zs_pzr_job']").eq(0).attr("data-zs-value-default") != null) ? $("#xxyContent [name='zs_pzr_job']").eq(0).attr("data-zs-value-default") : '');
        // 名称
        $("#xxyContent [name='zs_pzr_name']").eq(0).html(($("#xxyContent [name='zs_pzr_name']").eq(0).attr("data-zs-value-default") != null) ? $("#xxyContent [name='zs_pzr_name']").eq(0).attr("data-zs-value-default") : '');
      }
      // 电子签名
      $("#xxyContent [name='zs_pzr_img']").attr("src", "");
      //状态
      $("#xxyContent [name='zs_pzr_audit_status']").val("0")


    },
    //获取历史数据，生成下拉
    getFieldList(obj,fieldName,event){
      ajaxRequest("get", "back/certificateCommon/getCertificateFieldListByQjmc/"+$("[name='zs_zsqjmc']").eq(0).html()+"/"+fieldName, null, res => {
        if(res.code == 200){
          console.log(res.rows);
          var selObjName = $(obj).attr("data-zs-contextmenu-show-name");
          $("[name='"+selObjName+"']").empty();
          //往select下面追加内容
          for(var i=0;i<res.rows.length;i++){
            $("[name='"+selObjName+"']").append("<option value='"+res.rows[i][fieldName]+"'>res.rows[i][fieldName]</option>")
          }
          this.zs_select(selObjName,event);

        }else {
          this.$message.error(res.msg);
        }
      },"unicode");
    },
    //auditUserChangeFlag：是否更换检定员，核验员，0没更换，1更换
    //auditCertificateFlag：审核状态，0检定，1核验，2批准
    //auditCertificateInex：检定，核验的是第几个检定员核验员
    //auditRyId：人员id
    //certificateId：证书id
    //successTip：成功提示信息
    checkSignnaturePasswordBack(flag,auditUserChangeFlag,auditCertificateFlag,auditCertificateInex,auditRyId,certificateId,successTip){
      this.checkSignnaturePasswordShow = false ;
      var auditObj = false ;
      if(flag){
        auditObj = this.certificateAudit(auditUserChangeFlag,auditCertificateFlag,auditCertificateInex,auditRyId,certificateId,successTip);
        console.log(auditObj,'auditObj')
        if(auditObj != false){
          if(auditCertificateFlag == '0'){
            //审核状态位
            $("#xxyContent [name='zs_jdy_audit_status']").eq(auditCertificateInex).val("1");
            //按钮disabled
            $("#xxyContent [name='zs_jdy_button']").eq(auditCertificateInex).attr("disabled", "true");
            // 职务
            $("#xxyContent [name='zs_jdy_job']").eq(auditCertificateInex).html(auditObj.position);
            // 名称
            $("#xxyContent [name='zs_jdy_name']").eq(auditCertificateInex).html(auditObj.userName);
            // 电子签名
            $("#xxyContent [name='zs_jdy_img']").eq(auditCertificateInex).attr("src","/njmind/attachment/down/"+auditObj.signnature);
          }else if(auditCertificateFlag == '1'){
//            var auditObj = this.certificateAudit(auditUserChangeFlag,"1",auditCertificateInex,auditRyId,certificateId,successTip);
//            if(auditObj != false){
              $("#xxyContent [name='zs_hyy_audit_status']").eq(auditCertificateInex).val("1")
              //按钮disabled
              $("#xxyContent [name='zs_hyy_button']").eq(auditCertificateInex).attr("disabled", "true");
              // 职务
              $("#xxyContent [name='zs_hyy_job']").eq(auditCertificateInex).html(auditObj.position);
              // 名称
              $("#xxyContent [name='zs_hyy_name']").eq(auditCertificateInex).html(auditObj.userName);
              // 电子签名
              $("#xxyContent [name='zs_hyy_img']").eq(auditCertificateInex).attr("src","/njmind/attachment/down/"+auditObj.signnature);
//            }
          }/*else if(auditCertificateFlag == '2'){
//            var auditObj = this.certificateAudit(auditUserChangeFlag,"1",auditCertificateInex,auditRyId,certificateId,successTip);
//            if(auditObj != false){
              $("#xxyContent [name='zs_pzr_audit_status']").eq(auditCertificateInex).val("1")
              //按钮disabled
//              $("#xxyContent [name='zs_hyy_button']").eq(auditCertificateInex).attr("disabled", "true");
              // 职务
              $("#xxyContent [name='zs_pzr_job']").eq(auditCertificateInex).html(auditObj.position);
              // ID
              $("#xxyContent [name='zs_pzr_id']").eq(auditCertificateInex).val(auditObj.userId);
              // 名称
              $("#xxyContent [name='zs_pzr_name']").eq(auditCertificateInex).html(auditObj.userName);
              $("#xxyContent [name='zs_pzr']").eq(auditCertificateInex).html(auditObj.userName);
              // 电子签名
              $("#xxyContent [name='zs_pzr_img']").eq(auditCertificateInex).attr("src","/njmind/attachment/down/"+auditObj.signnature);
//              if(typeof this.setMainCertificatePzr == "function") {
//                this.setMainCertificatePzr(1);
//              }
//            }
          }*/
          this.getAuditStatus();
        }
        return auditObj ;
      }
    },
    //设置默认检定员 （0->默认模板维护的人员;1->当前登录人;）
    setCertificateAddDefaultJdy(certificateAddDefaultJdy){
      if(1==certificateAddDefaultJdy){
        $("#xxyContent [name='zs_jdy_select']").eq(0).focus();
        // 当前登录人
        $("#xxyContent [name='zs_jdy_select']").eq(0)[0].value = window.localStorage.userId ;

        $("#xxyContent [name='zs_jdy_select']").eq(0).blur() ;
      }
    },
    //获得每一个检定/审核/批准的状态
    //type：jdy/hyy/pzr
    getAuditStatus(){
      var buttonArr = {};
      var auditRyId = null;
      var auditRyStatus = 0;
      var buttonArrTemp = [] ;

      var jdyButtonArr = $("#xxyContent [name='zs_jdy_button']");
      buttonArrTemp = [] ;
      for(var i=0;i<jdyButtonArr.length;i++){
        auditRyId = $("#xxyContent [name='zs_jdy_id']").eq(i).val();
        auditRyStatus = $("#xxyContent [name='zs_jdy_audit_status']").eq(i).val();
        if("" != auditRyId){
          buttonArrTemp[buttonArrTemp.length] = {auditRyId:auditRyId,auditRyStatus:auditRyStatus};
        }
      }
      buttonArr.jdy = buttonArrTemp ;

      var hyyButtonArr = $("#xxyContent [name='zs_hyy_button']");
      buttonArrTemp = [] ;
      for(var i=0;i<hyyButtonArr.length;i++){
        auditRyId = $("#xxyContent [name='zs_hyy_id']").eq(i).val();
        auditRyStatus = $("#xxyContent [name='zs_hyy_audit_status']").eq(i).val();
        if("" != auditRyId) {
          buttonArrTemp[buttonArrTemp.length] = {auditRyId: auditRyId, auditRyStatus: auditRyStatus};
        }
      }
      buttonArr.hyy = buttonArrTemp ;

      if(typeof this.returnAuditStatus == "function"){
        this.returnAuditStatus(buttonArr)
      }
    },
    //触发检定/核验 的按钮
    auditButtonCilck(type,index){
      if(type == "jdy"){
        $("#xxyContent [name='zs_jdy_button']").eq(index).click();
      }else if(type == "hyy"){
        $("#xxyContent [name='zs_hyy_button']").eq(index).click();
      }
    },

    //增加技术依据
    addJzgc(){

      var oldDiv = $("[name='zs_jsgc_row']").eq(0) ;
      var newDiv = oldDiv.clone(true);

      $("[name='zs_jsgc_row']").last().after(newDiv);
      newDiv.find("[name='zs_jsgc_name']").eq(0).html('');
      newDiv.find("[name='zs_jsgc_name_eng']").eq(0).html('');
      newDiv.find("[name='zs_jsgc_id']").eq(0).val('');
      newDiv.find("[name='zs_jsgc_canzhao']").eq(0).html('');
    },
    //增加计量标准
    addJlbz(){
      var oldDiv = $("[name='zs_jlbz_row']").eq(0) ;
      var newDiv = oldDiv.clone(true);


      $("[name='zs_jlbz_row']").last().after(newDiv);
      newDiv.find("[name='zs_jlbz_name']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_name_eng']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_clfw']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_clfw_eng']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_zqddj']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_zqddj_eng']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_zsbh']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_yxrq']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_kzxm']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_id']").eq(0).val('');
      newDiv.find("[name='zs_jlbz_zsbh_social']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_yxrq_social']").eq(0).html('');
      newDiv.find("[name='zs_jlbz_lines']").eq(0).val('1');
    },
    //增加计量标准期
    addJlbzq(){
      var oldDiv = $("[name='zs_jlbzq_row']").eq(0) ;
      var newDiv = oldDiv.clone(true);

      $("[name='zs_jlbzq_row']").last().after(newDiv);
      newDiv.find("[name='zs_jlbzq_name']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_name_eng']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_clfw']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_zqddj']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_zqddj_eng']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_xhgg']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_sbbh']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_ccbh']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_jddw']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_zzcs']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_zsbh']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_yxrq']").eq(0).html('');
      newDiv.find("[name='zs_jlbzq_id']").eq(0).val('');
      newDiv.find("[name='zs_jlbzq_lines']").eq(0).val('1');

    },

  }
};
</script>

<style scoped>
</style>
