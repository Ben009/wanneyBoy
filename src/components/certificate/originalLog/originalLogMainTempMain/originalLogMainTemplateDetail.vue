<template>
     <section slot="footer" class="certificateMainClass" ref="certificateMainClass" style="width:100%;">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px"  >
          <el-col class="njmindMidToLarge" :span="24" style="border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:10px;">
            <el-button type="primary" @click="handleSubmit" >保存主模板</el-button>
              <!--{{form.zmbName}}-->
            <el-button type="primary" @click="handleEdit" size="small" v-if="form.zmbType == 2 ">证书配置</el-button>
          </el-col>
          <el-col class="njmindSmallToMid main-mini" :span="6" v-if="form.zmbType == 1 ">
            <el-form-item label="三页宽" prop="redWidth" v-if="form.zmbType == 1 ">
              <el-input v-model.number="form.redWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="njmindSmallToMid main-mini" :span="6">
            <el-form-item label="三页高" prop="redHeight" v-if="form.zmbType == 1 ">
              <el-input v-model.number="form.redHeight"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="njmindSmallToMid main-mini" :span="6">
            <el-form-item label="二页宽" prop="blueWidth" v-if="form.zmbType == 1 ">
              <el-input v-model.number="form.blueWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="njmindSmallToMid main-mini" :span="6">
            <el-form-item label="二页高"  prop="blueHeight" v-if="form.zmbType == 1 ">
              <el-input v-model.number="form.blueHeight"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="njmindSmallToMid main-mini" :span="6">
            <el-form-item label="批次模板" prop="htmlBatchFlag" v-if="form.zmbType == 2 ">
              <el-select v-model="form.htmlBatchFlag" >
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="njmindSmallToMid main-mini" :span="6">
            <el-form-item label="结果页类型" prop="htmlPageCount" v-if="form.zmbType == 2 ">
              <el-select v-model="form.htmlPageCount" >
                <el-option label="红框" :value="3"></el-option>
                <el-option label="蓝框" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <div style="clear:both"></div>
        </el-form>
            <!--<div id="zmbContent">-->
            <!--</div>-->
            <!-- 富文本编辑器 -->
            <div name="kindeditor" :style="{'width':'100%'}"></div>
       <originalLogMainTemplateConfig v-if="!!edit" :data="edit" :callback="handleEditCallback"></originalLogMainTemplateConfig>
      </section>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest, ajaxProxyRequest, formatDate} from '../../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../../directives/rightcilck';
  import rightClick from '../../../../mixins/FormRightClick';
  import OriginalLogMainTemplateConfig from './originalLogMainTemplateConfig';



  const defaults = {
    hoho:''
  };
  export default {
    name: "OriginalLogMainTemplateDetail",
    props: {
      //获得父页面传进来的参数
      zmbId: {required: true}
    },
    components:{
      /** 模块对象 import 进来 后的别名  */
      OriginalLogMainTemplateConfig
    },
    data() {
      //验证数字格式
      var regNum = (rule, value, callback) => {
        let str=new RegExp(/^[0-9]*$/);
        if(value === ""){
          //js是弱类型，所以采用==判断第一次进入页面会导致0和空字符串判断相等
          callback(new Error('不能为空'));
        }else{
          if (!str.test(value)) {
            callback(new Error('请输入数字'));
          }else {
            callback();
          }
        }
      };
      return {
        form: {},
        rules: {
          jsgcCount:[
            { validator: regNum,},
          ],
          jlbzCount:[
            { validator: regNum,},
          ],
          jlbzqCount:[
            { validator: regNum,},
          ],
          redWidth: [
            { validator: regNum,},
          ],
          redHeight:[
            { validator: regNum,},
          ],
          blueWidth:[
            { validator: regNum,},
          ],
          blueHeight:[
            { validator: regNum,},
          ],
        },
        loading: false,
        remoteOptions: [],
        kindEditor : null ,
        templateZsTypes: [], //模板证书类型
        templateJdTypes:[],//模板检定类型
        pickerOptions:{
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '清空',
            onClick(picker) {
              picker.$emit('pick', null);
            }
          }]
        },
        edit: null,
        zsMaxHeight:'',
      }
    },
//    watch:{
//      //监听参数的变化
//      zmbId(){
//        alert(1);
//        this.getCertificateTemplateDetail();
//      }
//    },
    created(){
      //初始化证书类型、检定类型列表
      this.getZsType();
      this.getJdType();
    },
    mounted() {
      //加载KindEditor，再调用查询的方法
      this.loadJS(this.getOriginalLogTemplateDetail);
//      this.$refs.btn.onclick=this.toTest1.bind(this);
    },
    watch:{
      innerHeight(v){
        if(this.kindEditor){
          this.calcEditorHeight();
        }
      },
      innerWidth(v){
        if(this.kindEditor){
          this.calcEditorHeight();
        }
      },
    },
    activated(){//keepalive 缓存重新反序列化
      //console.log("CertificateTemplateDetail 创建 activated》》》》》》》》》》》》》》》》》》》");
      if(this.kindEditor){
        //解决反序列化，iframe无法显示证书情况
        this.kindEditor.fullscreen(false);
        //console.log("编辑器对象：",this.kindEditor);
      }
      this.calcEditorHeight();
    },
    deactivated(){//keepalive 序列化保存时
      //console.log("CertificateTemplateDetail 序列化》》》》》》》》》》》》》》》》》》》");
    },
    methods: {
      calcEditorHeight(){
        let mainHeight = $(this.$refs['certificateMainClass']).parents('.tbs_info').height(),
            toolbarHeight = $(this.kindEditor.toolbar.div[0]).outerHeight(),
            statusbarHeight = $(this.kindEditor.statusbar[0]).outerHeight(),
            formHeight = this.$refs.form.$el.clientHeight;
        this.zsMaxHeight = mainHeight - (formHeight + statusbarHeight + toolbarHeight + 2)
        this.kindEditor.edit.setHeight(this.zsMaxHeight)
      },
      //引入 kindeditor
      loadJS(callBackFunction){

        var _this = this;
        //先引入kindeditor
//        var script=document.createElement('script');
//        script.src='./static/js/kindeditor/kindeditor.js';
//        document.body.appendChild(script);
//        script.onload=function(){
//          //加载完毕后引入语言包
//          script=document.createElement('script')
//          script.src='./static/js/kindeditor/lang/zh_CN.js';
//          document.body.appendChild(script);
          _this.kindEditor = window.KindEditor.create('div[name="kindeditor"]',
            { items:[
                  'source', '|', 'undo', 'redo', '|', 'preview', 'print' , 'cut', 'copy', 'paste',
                  'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                  'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                  'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
                  'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                  'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
                  'insertfile', 'table', 'hr', 'emoticons', 'pagebreak',
                  'anchor', 'link', 'unlink', '|', 'njmindFontInsert'
              ],
              filterMode : false,
              imageTabIndex : 1,
              afterUpload : function(url, data, name) { //上传文件后执行的回调函数，必须为3个参数
                if(name=="image" || name=="multiimage"){ //单个和批量上传图片时
                  var img = new Image(); img.src = url;
                  img.onload = function(){ //图片必须加载完成才能获取尺寸
                    if(img.width>600) _this.kindEditor.html(_this.kindEditor.html().replace('<img src="' + url + '"','<img src="' + url + '" width="100%"'))
                  }
                }
              }
            });
//          script.onload=function(){
            if(typeof callBackFunction == 'function'){
              callBackFunction().then(_ => {

                this.calcEditorHeight();
              });
            }
//          }
//        }
      },
      handleSubmit() {
        this.$refs.form.validate((valid) => {

          if (valid) {
            this.dealData(this.form);
            //把时间字段删掉

            //时间字段进行格式化
            this.form.enableDate = formatDate(this.form.enableDate, 'YYYY-MM-DD');
            this.form.disableDate = formatDate(this.form.disableDate, 'YYYY-MM-DD');
            if (this.form.enableDate != null && this.form.disableDate != null && this.form.enableDate > this.form.disableDate) {
              this.$message.error('启用日期不可大于停用日期');
              return;
            }

            //富文本的赋值
            this.form.backupType = 1 ;
            this.form.zmbContent = this.kindEditor.html();
            ajaxRequest('post',"back/originalLogMainTemp/updateOriginalLog",this.form,(res) =>{
              if(res.code == 200){
                this.form.backupStatus = 1 ;
                this.$message.success('修改成功');
              }else {
                this.$message.error('修改失败');
              }
            },
            'unicode'
            );
          } else {
            return false;
          }
        })
      },
      remoteMethod() {
      },
      handleCancel(){
      },
      //初始化信息
      getOriginalLogTemplateDetail(){
        return new Promise(resolve => {
          if(this.zmbId != ""){
            ajaxRequest('get', 'back/originalLogMainTemp/'+this.zmbId, null , (res) => {
              if (res.code === 200) {
                this.form = res.daoResult;
                this.kindEditor.html(this.form.zmbContent);
                this.setOriginalLogMainTemplateId();
                resolve()
              }
            });
          }
        })
      },
      //获取模板证书类型
      getZsType() {
        ajaxProxyRequest("get", "/njmind/findParam/templateZsType", {}, res => {
          //数组第一位默认为空
		  var zsTypeBlank = {code:"",remark:"请选择"};
          res.list.unshift(zsTypeBlank);
          [0].concat(res.list);
          this.templateZsTypes = res.list;
        });
      },
      //获取模板检定类型
       getJdType() {
        ajaxProxyRequest("get", "/njmind/findParam/templateJdType", {}, res => {
          //数组第一位默认为空
		  var jdTypeBlank = {code:"",remark:"请选择"};
          res.list.unshift(jdTypeBlank);
          [0].concat(res.list);
          this.templateJdTypes = res.list;
        });
      },
      //将证书的ID设置到大字段中
      setOriginalLogMainTemplateId(){
        if(this.form.zmbType == 1 ){
          this.kindEditor.edit.doc.getElementsByName("zs_xxy_zmb_id").value = this.zmbId ;
        }else if(this.form.zmbType == 2){
          this.kindEditor.edit.doc.getElementsByName("zs_jgy_zmb_id").value = this.zmbId ;
        }
      },
      handleEdit() {
        this.edit = this.form || {};
      },
      handleEditCallback(rowInfo) {
        let _this = this;
        if (rowInfo) {
          if (rowInfo.id) {

          }
          else {

          }
        }
        else {
          this.edit = null
        }
      },
      dealData(form){
        //把时间字段删掉
        delete form.addTime;
        delete form.updateTime;
        delete form.deleteTime;
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
        delete form.zsjdrq;
        delete form.zsyxrq;
        delete form.dataDate1;
      },
    },
  }

</script>

<style lang="scss">
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
  .custom-1d74b7 .el-form-item--mini.el-form-item, .custom-1d74b7 .el-form-item--small.el-form-item {
    /*margin-bottom: 25px;*/
}
  .certificateMainClass{
    .main-mini{
      width:20%!important;
    }
    @media screen and (max-width:1500px){
      .main-mini{width: 25%!important;}
    }
  }
</style>
