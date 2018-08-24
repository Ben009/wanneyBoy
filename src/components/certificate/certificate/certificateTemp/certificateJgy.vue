<template>
  <div>
    <div id="certificateJgyDiv" class="cerEditorStyle">
      <!--<div name="certificateJgyTempDiv"  >-->
      <!--<el-button name="conTemp" type="primary"  size="small">关联结果页主模板</el-button>-->
      <!--<el-button name="addPage" type="primary"  size="small">追加一页</el-button>-->
      <!--<el-button name="delPage" type="primary"  size="small" >删除该页</el-button>-->
      <!--<div name="certificateJgyMainContentDiv">-->

      <!--</div>-->
      <!--</div>-->
    </div>
    <CertificateTreeDialog :queryType="2" :xxyZmbId="xxyZmbId" :isFirst="isFirst"
                           v-if="dialogShow != null " :callback="dialogClose" ></CertificateTreeDialog>
    <CertificateKindeEitorDialog ref="certificateKindeEitorDialog" v-if="kindeEitordialogShowObj != null"
                                 :showData="kindeEitordialogshowData"  :callback="kindeEitordialogColse" />

  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../../util/base';
  import $ from 'jquery';
  import CertificateTreeDialog from '../../common/certificateCommon/certificateTreeDialog.vue';
  import CertificateKindeEitorDialog from '../../common/certificateKindeEitorDialog.vue';
  import Clickoutside from '@/common-el/src/utils/clickoutside';
  import zsEvents from '@/mixins/zsEvents'

/*   import {
    Input,
    Col,
  } from 'element--ui';
  Vue.use(Input)
  Vue.use(Col); */

  const defaults = {
    hoho:''
  };
  export default {
    name: "CertificateJgy",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateTreeDialog,CertificateKindeEitorDialog,
    },
    mixins:[zsEvents],
    props: {
      //获得父页面传进来的参数
//      jgyIdArray: {required: true},
//      jgyMainContentMap: {required: true },
//      jgyContentArray: {required: true },
      getXxyZmbId:{
        type:Function,
        required:true
      },
      setZsbh:{
        type:Function,
        required:false,
        default: null,
      },
      certificateCanEdit:{default: false},
    },
    data() {
      return {
        form: {},
        rules: {
        },
        zsDivJgyName : "zs_div_jgy",
        loading: false,
        remoteOptions: [],
        kindEditor : null ,
        dialogShow:null,
        dialogShowType:null,
        jgyContentRedName:'zs_jgy_red',
        jgyContentBlueName:'zs_jgy_blue',
        kindeEitordialogshowData:null,
        kindeEitordialogShowObj:null,
        jgyTotalPage : 0 ,
//        jgyIdArray : [] ,
//        jgyMainContentMap : {} ,
//        jgyContentArray : [] ,
        xxyZmbId:0,
        isFirst:false ,
        jgyRightClickArr:[
          {type:"1",name:"关联结果页主模板"},
          {type:"2",name:"追加一页"},
          {type:"3",name:"删除该页"}
        ],
      }
    },
    watch:{
      //监听参数的变化

    },
    created(){

    },
    mounted() {
      this.loadJgyContent4Main();
    },
    methods: {
      //append 当前的追加
      //addGjy 追加最后
      //relationGjy 替换当前
      relationGjy(objIndex,type){
        console.log(objIndex,'objIndex')
        console.log(type,'type')
        //如果是空的，追加结果页
//        var index = 0 ;
        console.log($("[name='"+this.zsDivJgyName+"']"))
        console.log("111",(!objIndex))
        this.isFirst = false;
        this.dialogShowType = type;
        if(type == "append"){
          this.dialogShow = objIndex;
        }else if(type == "addGjy"){
          this.dialogShow = ($("[name='"+this.zsDivJgyName+"']").length  );
          if(this.dialogShow == 0 ){
            this.isFirst = true;
          }
        }else if(type == "relationGjy"){
          this.dialogShow = objIndex;
          if(this.dialogShow == 0 ){
            this.isFirst = true;
          }
        }
//        if(null == objIndex){
//          if($("[name='"+this.zsDivJgyName+"']").length == 0){
//            objIndex = 0 ;
//            if(type == 'addGjy'){
//              this.isFirst = true;
//            }
//          }else {
//            objIndex = ($("[name='"+this.zsDivJgyName+"']").length  ) ;
//          }
//        }/*else {
//          index = $("[name='"+this.zsDivJgyName+"']").find("[name='conTemp']").index(obj);
//        }*/
//        if(objIndex == 0){
//
//        }else {
//          this.isFirst = false;
//        }
        //获得信息页Id
        this.getMainXxyZmbId();
//        this.dialogShow = objIndex;
//        this.dialogShowType = type;
        console.log(this.dialogShow,"this.dialogShow")
        console.log(this.isFirst,"this.isFirst")
      },
      dialogClose(jgyZmbId){
        //隐藏弹出层
        if(!jgyZmbId){
          this.dialogShow = null;
          return;
        }
        var _this = this;
        //后台请求信息页内容
        ajaxRequest('get', 'back/certificateMainTemp/'+jgyZmbId, null, (res) => {
          if (res.code === 200) {
            //判断是否有这个结果页，没有的话追加
            console.log(this.dialogShow,'this.dialogShow')
            console.log($("[name='"+this.zsDivJgyName+"']").eq(this.dialogShow),'div');
            console.log(this.dialogShowType,'this.dialogShowType');

            if(this.dialogShowType == "relationGjy" ){
              //找到当前选择的div
              //先获得当前富文本区域的内容
              var contentDivCon = this.getDivContentDivHtml(_this.dialogShow);
              //替换ID
//              $("[name='"+this.zsDivJgyName+"']").eq(this.dialogShow).attr("jgyId",jgyZmbId);
              //替换模板内容
              $("[name='"+this.zsDivJgyName+"']").eq(this.dialogShow).replaceWith(res.daoResult.zmbContent);

              //设置富文本区域内容
              //设置模板内容
              this.setDivContentDivHtml(_this.dialogShow,contentDivCon,_this);
            }else if(this.dialogShowType == "addGjy" ){
              $("#certificateJgyDiv").append(res.daoResult.zmbContent);
//              $("[name='"+this.zsDivJgyName+"']").eq(this.dialogShow).attr("jgyId",jgyZmbId);
              this.setDivContentDivHtml(_this.dialogShow,"",_this);
            }else if(this.dialogShowType == "append" ){
              $("[name='"+this.zsDivJgyName+"']").eq(_this.dialogShow).after(res.daoResult.zmbContent);
              _this.dialogShow = _this.dialogShow+1;
//              $("[name='"+this.zsDivJgyName+"']").eq(this.dialogShow).attr("jgyId",jgyZmbId);
              this.setDivContentDivHtml(_this.dialogShow,"",_this);
            }
            console.log(this.dialogShow)
            //绑定下当前div的事件
            this.bindFunction($("[name='"+this.zsDivJgyName+"']").eq(this.dialogShow));
            //重新计算页码
            this.$emit('getJgyTotalPage',true);

            if(typeof this.setZsbh == "function"){
              this.setZsbh();
            }

          }
          this.dialogShow = null;
          this.dialogShowType = null;
        });
      },
      jgyLeftCilckShowEdit(obj){
        //调用父页面打开富文本编辑器
        this.kindeEitordialogShow(obj);
      },
//      clearContent(obj){
//
//      },
      addGjy(objIndex,type){
        // debugger
//        var index = $("[name='"+this.zsDivJgyName+"']").find("[name='addPage']").index(obj);
        //拿到当前整个div
//        var _this = this;

        if(null == objIndex){
          if($("[name='"+this.zsDivJgyName+"']").length == 0){
            objIndex = 0 ;
          }else {
            objIndex = ($("[name='"+this.zsDivJgyName+"']").length)-1   ;
          }
        }

        console.log($("[name='"+this.zsDivJgyName+"']").eq(objIndex),objIndex,"11111111222222222222222")

        //判断当前div是否是篮框
        if($("[name='"+this.zsDivJgyName+"']").eq(objIndex).length == 0 || $("[name='"+this.zsDivJgyName+"']").eq(objIndex).find("[name='"+this.jgyContentBlueName+"']").length>0){
          //篮框，认为是添加篮框
          this.relationGjy(objIndex,type);
        }else {
          var oldDiv = $("[name='"+this.zsDivJgyName+"']").eq(objIndex) ;
          var newDiv = oldDiv.clone(true);
          //红框
          oldDiv.after(newDiv);
          //设置模板内容
          this.setDivContentDivHtml(objIndex+1,"",this);
          //绑定事件
          this.bindFunction(newDiv);
          //重新计算页码
          this.$emit('getJgyTotalPage',true);

        }
//        var zsDivJgy = $(obj).parent().clone(true);
//        $(obj).parent().after(zsDivJgy);
//        //设置模板内容
//        this.setDivContentDivHtml(zsDivJgy,"",_this);
//        //重新计算页码
//        this.$emit('getJgyTotalPage',true);
      },
      delGjy(objIndex){
//        var index = $("[name='"+this.zsDivJgyName+"']").find("[name='delPage']").index(obj);
//        if(index == 1){
//          $("[name='"+this.zsDivJgyName+"']").eq(this.dialogShow).attr("jgyId","");
//          $("[name='"+this.zsDivJgyName+"']").eq(this.dialogShow).html("");
//        }else {
        $("[name='"+this.zsDivJgyName+"']").eq(objIndex).remove();
//        }
        //重新计算页码
        this.$emit('getJgyTotalPage',true);
      },
      setJgyContent(data){
        $(this.kindeEitordialogShowObj).html(data==null?"":data);
      },
//      getJgyArr(){
//        //获得所有的结果页内容字段、结果页ID
//        var allDiv = $("[name='"+this.zsDivJgyName+"']");
//        //id
//        var jgyIdArr = [];
//        //内容
//        var jgyConArr = [];
//        for(var i=0;i<allDiv.length;i++){
//          if($(allDiv[i]).attr("jgyId")){
//            jgyIdArr[i]= $(allDiv[i]).attr("jgyId");
//            jgyConArr[i] = this.getDivContentDivHtml($(allDiv[i]))
//          }
//        }
//        return [jgyIdArr,jgyConArr];
//      },
      getJgyAllContent(){
        //获得所有的结果页内容字段、结果页ID
        var jgyDiv = $("#certificateJgyDiv");
        return jgyDiv.html();
      },
      setJgyAllContent(jgyDivHtml){
        //获得所有的结果页内容字段、结果页ID
        $("#certificateJgyDiv").html(jgyDivHtml)
        //绑定按钮事件
        this.bindFunction();
      },
      bindFunction(obj){
        var _this = this;
//        var obj = null ;
        if(!obj){
          obj = $("[name='"+this.zsDivJgyName+"']") ;
        }
        //再绑定
//        obj.find("[name='conTemp']").click(
//          function () {
//            //获得红蓝框的元素
//
//            _this.relationGjy(this);
//          }
//        );
//        obj.find("[name='addPage']").click(
//          function () {
//            _this.addGjy(this);
//          }
//        );
//        obj.find("[name='delPage']").click(
//          function () {
//            _this.delGjy(this);
//          }
//        );
        //点击内容事件
        //左击
        obj.find("[name='"+this.jgyContentRedName+"'],[name='"+this.jgyContentBlueName+"']").unbind();

        obj.find("[name='"+this.jgyContentRedName+"'],[name='"+this.jgyContentBlueName+"']").each((index,val) => {
          $(val).click(function(){
            //左击
            if(_this.certificateCanEdit) {
              _this.zs_editor(event)
              // _this.jgyLeftCilckShowEdit(this);
              return false;
            }
          })
        });

        //右击
        obj.find("[name='"+this.jgyContentRedName+"'],[name='"+this.jgyContentBlueName+"']").contextmenu(
          function () {
            //右击
            if(_this.certificateCanEdit) {
              _this.jgyRightClick(this);
              return false;
            }
          }
        );
      },
      kindeEitordialogColse(data){
        if(data){
          this.setJgyContent(data);
        }
        this.kindeEitordialogShowObj = null;
      },
      kindeEitordialogShow(obj){
        this.kindeEitordialogShowObj = obj ;
        if(obj){
          console.log(obj)
          this.kindeEitordialogshowData = obj.innerHTML;
        }
      },
      //设置第X个结果页框内的内容
      setDivContentDivHtml(index,html,_this){
        if($("[name='"+this.zsDivJgyName+"']").eq(index).find("[name='"+this.jgyContentBlueName+"']").length>0){
          $("[name='"+this.zsDivJgyName+"']").eq(index).find("[name='"+this.jgyContentBlueName+"']").html(html);
//          $("[name='"+this.zsDivJgyName+"']").eq(index).find("[name='"+this.jgyContentBlueName+"']").click(
//            function () {
//              _this.jgyLeftCilckShowEdit(this);
//            }
//          );
        }else {
          $("[name='"+this.zsDivJgyName+"']").eq(index).find("[name='"+this.jgyContentRedName+"']").html(html);
//          $("[name='"+this.zsDivJgyName+"']").eq(index).find("[name='"+this.jgyContentRedName+"']").click(
//            function () {
//              _this.jgyLeftCilckShowEdit(this);
//            }
//          );
        }
      },
      //获得第X个结果页框内的内容
      getDivContentDivHtml(index){
        var contentDivCon = "";
        if($("[name='"+this.zsDivJgyName+"']").eq(index).find("[name='"+this.jgyContentBlueName+"']").length>0){
          contentDivCon = $("[name='"+this.zsDivJgyName+"']").eq(index).find("[name='"+this.jgyContentBlueName+"']").html();
        }else {
          contentDivCon = $("[name='"+this.zsDivJgyName+"']").eq(index).find("[name='"+this.jgyContentRedName+"']").html();
        }
        return contentDivCon;
      },
      //初始化页码（当前第几页）
      initPageIndex(xxyTotalPage){
        console.log(xxyTotalPage,'xxyTotalPage')

        var pageObj = $("#certificateJgyDiv [name='zs_page_index']");
        console.log(pageObj)
        for(var i=0;i<pageObj.length;i++){
          pageObj.eq(i).html((i+1)+xxyTotalPage) ;
        }
        this.jgyTotalPage = pageObj.length ;
        console.log(this.jgyTotalPage,'jgyTotalPage')
        return this.jgyTotalPage ;
      },
      //设置总页码
      initPageTotal(pageTotal){
        $("#certificateJgyDiv [name='zs_page_total']").html(pageTotal);
      },
      //设置总页码
      getJgyPageTotal(pageTotal){
        $("#certificateJgyDiv [name='zs_page_index']").html(pageTotal);
      },
      loadJgyContent4Main(){
        this.$emit('loadJgyContent4Main');
      },
      //获得信息页主模板ID
      getMainXxyZmbId(){
        console.log("getXxyZmbId")
        this.xxyZmbId = this.getXxyZmbId();
      },
      //结果页蓝红框右击
      jgyRightClick(obj){
//        alert();
        //先获得当前选中的是第几个结果页框子
        var index = $("[name='zs_jgy_blue'],[name='zs_jgy_red']").index(obj)
        //index从1开始，所以减一
//        index = index - 1 ;
        console.log(obj,index)
        let ops=this.jgyRightClickArr;
        var _this = this ;
        let RightClickMenu = Vue.extend({
          data(){
            return {
              ops:ops
            }
          },
          methods: {
            handleClose () {
              this.$destroy(true);
              this.$el.parentNode.removeChild(this.$el);
            },
            handleRightClickOperation (op) {
              this.handleClose();
              console.log(op);
              if(1 == op){
                _this.relationGjy(index,'relationGjy');
              }else if(2 == op){
                _this.addGjy(index,'append');
              }else if(3 == op){
                _this.delGjy(index);
              }
//              handleOperation(obj,node, op)
            }
          },
          directives: { Clickoutside },
          template:
          '<ul class="right-click-menu cerCommonStyle" v-clickoutside="handleClose" style="width: 150px">' +
          '<li v-for="v in ops" @click="handleRightClickOperation(v.type)">{{v.name}}</li>' +
          '</ul>'
        });
        let instance = new RightClickMenu().$mount();

        document.body.appendChild(instance.$el);
        let windowWidth=document.documentElement.clientWidth,
          windowHeight=document.documentElement.clientHeight,
          eventX=event.clientX,
          eventY=event.clientY;
        let dom=instance.$el,
          menu=dom.getBoundingClientRect();
        let left=eventX+menu.width>windowWidth ? eventX-menu.width : eventX,
          top=eventY+menu.height>windowHeight ? eventY-menu.height : eventY;
        dom.style.top=top+'px';
        dom.style.left=left+'px';

        return;
      },
      //设置证书编号
      setJgyZsbh(zsbh){
        $("#certificateJgyDiv [name='zs_zsbh']").html(zsbh)
      },
    },
    updated () {
    },
  }

</script>

<style lang="scss" >

  .right-click-menu {
    position: fixed;
    border: 1px solid #ccc;
    padding: 2px 0;
    background: #fff;
    width: 200px;
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
  .btn{
    text-align: center;
    margin: 4% !important;
  }

</style>
