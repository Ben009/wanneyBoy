<template>
    <div>
        <span slot="footer" class="dialog-footer">
        <el-form ref="form" :model="form" :rules="rules"  label-width="100px" size="mini">
          <el-col :span="24">
            <el-button type="primary" @click="handleSubmit" size="small">保存主模板</el-button>
            <el-button type="primary" @click="handleEdit" size="small" v-if="form.zmbType == 2 ">证书配置</el-button>
              {{form.zmbName}}
          </el-col>
          <el-col :span="4">
          <el-form-item label="三页宽" prop="redWidth" v-if="form.zmbType == 1 ">
            <el-input v-model="form.redWidth"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="4">
          <el-form-item label="三页高" prop="redHeight" v-if="form.zmbType == 1 ">
            <el-input v-model="form.redHeight"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="4">
          <el-form-item label="二页宽" prop="blueWidth" v-if="form.zmbType == 1 ">
            <el-input v-model="form.blueWidth"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="4">
          <el-form-item label="二页高"  prop="blueHeight" v-if="form.zmbType == 1 ">
            <el-input v-model="form.blueHeight"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="批次模板" prop="htmlBatchFlag" v-if="form.zmbType == 2 ">
              <el-select v-model="form.htmlBatchFlag" >
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="结果页类型" prop="htmlPageCount" v-if="form.zmbType == 2 ">
              <el-select v-model="form.htmlPageCount" >
                <el-option label="红框" :value="3"></el-option>
                <el-option label="蓝框" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!--<div id="zmbContent">-->
            <!--</div>-->
            <!-- 富文本编辑器 -->
            <div name="kindeditor" style="width:100%;height: 600px;"></div>
          </el-col>
          <originalLogMainTemplateConfig v-if="!!edit" :data="edit" :callback="handleEditCallback"></originalLogMainTemplateConfig>
        </el-form>
      </span>

    </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../../directives/rightcilck';
  import rightClick from '../../../../mixins/FormRightClick';
  import originalLogMainTemplateConfig from './originalLogMainTemplateConfig';


/*   import {
    Button,
    Col,
    Form,
    FormItem,
    Input,
    Row,
  } from 'element--ui';
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
    name: "originalLogMainTemplateDetail",
    components:{
      /** 模块对象 import 进来 后的别名  */
      originalLogMainTemplateConfig
    },
    props: {
      //获得父页面传进来的参数
      zmbId: {required: true}
    },
    data() {
      //验证数字格式
      var regNum = (rule, value, callback) => {
        let str=new RegExp(/^[0-9]*$/)
        if (!str.test(value)||value == "") {
          callback(new Error('请输入数字'));
        }else if(String(value) && String(value).length > 3){
          callback(new Error('最多输入3位数字'));
        }else{
          callback();
        }
      };
      return {
        form: {},
        rules: {
          redWidth: [
            { validator: regNum},
          ],
          redHeight:[
            { validator: regNum},
          ],
          blueWidth:[
            { validator: regNum},
          ],
          blueHeight:[
            { validator: regNum},
          ],
        },
        loading: false,
        remoteOptions: [],
        kindEditor : null ,
        edit: null,
      }
    },
    watch:{
      //监听参数的变化
      zmbId(){
        this.getOriginalLogTemplateDetail();
      }
    },
    created(){
    },
    mounted() {
      //加载KindEditor，再调用查询的方法
      this.loadJS(this.getOriginalLogTemplateDetail);
//      this.$refs.btn.onclick=this.toTest1.bind(this);
    },
    methods: {
      //引入 kindeditor
      loadJS(callBackFunction){

        var _this = this;
//        //先引入kindeditor
//        var script=document.createElement('script');
//        script.src='./static/js/kindeditor/kindeditor.js';
//        document.body.appendChild(script);
//        script.onload=function(){
//          //加载完毕后引入语言包
//          script=document.createElement('script')
//          script.src='./static/js/kindeditor/lang/zh_CN.js';
//          document.body.appendChild(script);
          _this.kindEditor = window.KindEditor.create(/*document.getElementById('editor')*/ 'div[name="kindeditor"]',{filterMode : false});
//          script.onload=function(){
            if(typeof callBackFunction == 'function'){
              callBackFunction();
            }
//          }
//        }
      },
      handleSubmit() {
        let _this=this;
        this.$refs.form.validate((valid) => {
          if (valid) {
            //把时间字段删掉
            delete _this.form.addTime
            delete _this.form.updateTime
            delete _this.form.deleteTime
            delete _this.form.enableDate
            delete _this.form.disableDate
            delete _this.form.backupTime
            delete _this.form.auditSubmitTime
            delete _this.form.auditOneTime
            delete _this.form.auditTwoTime
            delete _this.form.unAuditSubmitTime
            delete _this.form.unAuditOneTime
            delete _this.form.unAuditTwoTime
            delete _this.form.jdTime
            delete _this.form.hyTime
            delete _this.form.pzTime
            delete _this.form.folderClearTime
            delete _this.form.printTime
            delete _this.form.pdfTime
            delete _this.form.enableDate
            delete _this.form.disableDate
            delete _this.form.zsjdrq
            delete _this.form.zsyxrq
            delete _this.form.dataDate1

            _this.form.backupType = 1 ;

            //富文本的赋值
            _this.form.zmbContent = _this.kindEditor.html();
            ajaxRequest('post',"back/originalogMainTemp/updateOriginalog",_this.form,function(res){
              if(res.code == 200){
                _this.form.backupStatus = 1 ;
                _this.$message.success('修改成功');
              }else {
                _this.$message.error('修改失败');
              }
            });
          } else {
             return false;
          }
        })

      },
      remoteMethod() {
      },
      handleCancel(){
      },
      getOriginalLogTemplateDetail(){
        if(this.zmbId != ""){
          let _this = this;
          ajaxRequest('get', 'back/originalogMainTemp/'+this.zmbId, null , (res) => {
            if (res.code === 200) {
              _this.form = res.daoResult;

              //              $("#zmbContent").html(_this.form.zmbContent) ;
              _this.kindEditor.html(_this.form.zmbContent);
            }
          });
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
      toTest1(){
        //设置编辑器的HTML内容
        this.kindEditor.html('<strong>你好啊</strong>');
        //取得编辑器的HTML内容
        alert(this.kindEditor.html());

        //设置编辑器的内容，直接显示HTML代码
        this.kindEditor.text('<strong>你好啊3</strong>');
        //取得编辑器的纯文本内容
        alert(this.kindEditor.text());
      },
      toTest2(){
        //取得当前被选中的HTML内容
        alert(this.kindEditor.selectedHtml());

        //将指定的HTML内容插入到编辑区域里的光标处
        this.kindEditor.insertHtml('<strong>输入文字</strong>');

        //将指定的HTML内容添加到编辑区域最后位置
        this.kindEditor.appendHtml('<strong>结尾追加文字</strong>');
      },
      toTest3(){
        var $_content1 = $('textarea[name="content1"]');
        $_content1.text("");

        this.kindEditor.html('开始<span id="userId">用户ID</span>结束');
        alert($_content1.text());

        //将编辑器的内容设置到原来的textarea控件里
        this.kindEditor.sync();
        alert($_content1.text());
      },
      toTest4(){
        //创建KCmd对象，KCmd用于操作可视化编辑区域的DOM
        var cmd1 = this.kindEditor.cmd;

        //获取kindEditor组件可视化编辑区域的window对象
        var kindEditorWindow1 = cmd1.win;

        //获取kindEditor组件可视化编辑区域的document对象
        var kindEditorDocument1 = cmd1.doc;


        this.kindEditor.html('开始<span id="userId">用户ID</span>结束');
        alert(kindEditorDocument1.getElementById("userId").outerHTML);

        //弹出打印窗口
        cmd1.print();
      },
    },
  }

</script>

<style >
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
  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
  .custom-1d74b7 .el-form-item--small.el-form-item{
    margin-bottom:0px;
  }
  .custom-1d74b7 .el-col-24 {
    width: 100%;
    margin-bottom: 18px;
  }
  .custom-1d74b7 .el-form-item--mini.el-form-item, .custom-1d74b7 .el-form-item--small.el-form-item {
    margin-bottom: 25px;
}
</style>
<template>
    <div>
        <span slot="footer" class="dialog-footer">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
          <el-col :span="24">
            <el-button type="primary" @click="handleSubmit" size="small">保存主模板</el-button>
            <el-button type="primary" @click="handleEdit" size="small" v-if="form.zmbType == 2 ">证书配置</el-button>
              {{form.zmbName}}
          </el-col>
          <el-col :span="4">
          <el-form-item label="三页宽" prop="redWidth" v-if="form.zmbType == 1 ">
            <el-input v-model.number="form.redWidth"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="4">
          <el-form-item label="三页高" prop="redHeight" v-if="form.zmbType == 1 ">
            <el-input v-model.number="form.redHeight"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="4">
          <el-form-item label="二页宽" prop="blueWidth" v-if="form.zmbType == 1 ">
            <el-input v-model.number="form.blueWidth"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="4">
          <el-form-item label="二页高"  prop="blueHeight" v-if="form.zmbType == 1 ">
            <el-input v-model.number="form.blueHeight"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="批次模板" prop="htmlBatchFlag" v-if="form.zmbType == 2 ">
              <el-select v-model="form.htmlBatchFlag" >
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="结果页类型" prop="htmlPageCount" v-if="form.zmbType == 2 ">
              <el-select v-model="form.htmlPageCount" >
                <el-option label="红框" :value="3"></el-option>
                <el-option label="蓝框" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!--<div id="zmbContent">-->
            <!--</div>-->
            <!-- 富文本编辑器 -->
            <div name="kindeditor" style="width:100%;height: 600px;"></div>
          </el-col>
          <originalLogMainTemplateConfig v-if="!!edit" :data="edit" :callback="handleEditCallback"></originalLogMainTemplateConfig>
        </el-form>
      </span>

    </div>
</template>

<script>
  import Vue from 'vue';

  import {ajaxRequest} from '../../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../../directives/rightcilck';
  import rightClick from '../../../../mixins/FormRightClick';
  import originalLogMainTemplateConfig from './originalLogMainTemplateConfig';

/*   import {
    Button,
    Col,
    Form,
    FormItem,
    Input,
    Row,
  } from 'element--ui';
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
      originalLogMainTemplateConfig
    },
    props: {
      //获得父页面传进来的参数
      zmbId: {required: true}
    },
    data() {
      return {
        form: {},
        rules: {
          redWidth: [
            { type: 'number', required: true, max: 999, message: '最多输入3位数字'},
          ],
          redHeight:[
             { type: 'number', required: true, max: 999, message: '最多输入3位数字'},
          ],
          blueWidth:[
             { type: 'number', required: true, max: 999, message: '最多输入3位数字'},
          ],
          blueHeight:[
             { type: 'number', required: true, max: 999, message: '最多输入3位数字'},
          ],
        },
        loading: false,
        remoteOptions: [],
        kindEditor : null ,
        edit: null,
      }
    },
    watch:{
      //监听参数的变化
      zmbId(){
        this.getOriginalLogTemplateDetail();
      }
    },
    created(){
    },
    mounted() {
      //加载KindEditor，再调用查询的方法
      this.loadJS(this.getOriginalLogTemplateDetail);
//      this.$refs.btn.onclick=this.toTest1.bind(this);
    },
    methods: {
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
          _this.kindEditor = window.KindEditor.create(/*document.getElementById('editor')*/ 'div[name="kindeditor"]',{filterMode : false});
//          script.onload=function(){
            if(typeof callBackFunction == 'function'){
              callBackFunction();
            }
//          }
//        }
      },
      handleSubmit() {
        let _this=this;
        //把时间字段删掉
        delete _this.form.addTime
        delete _this.form.updateTime
        delete _this.form.deleteTime
        delete _this.form.enableDate
        delete _this.form.disableDate
        delete _this.form.backupTime
        delete _this.form.auditSubmitTime
        delete _this.form.auditOneTime
        delete _this.form.auditTwoTime
        delete _this.form.unAuditSubmitTime
        delete _this.form.unAuditOneTime
        delete _this.form.unAuditTwoTime
        delete _this.form.jdTime
        delete _this.form.hyTime
        delete _this.form.pzTime
        delete _this.form.folderClearTime
        delete _this.form.printTime
        delete _this.form.pdfTime
        delete _this.form.enableDate
        delete _this.form.disableDate
        delete _this.form.zsjdrq
        delete _this.form.zsyxrq
        delete _this.form.dataDate1


        _this.form.backupType = 1 ;
        //富文本的赋值
        _this.form.zmbContent = _this.kindEditor.html();
        ajaxRequest('post',"back/originalogMainTemp/updateOriginalog",_this.form,function(res){
          if(res.code == 200){
            _this.$message.success('修改成功');
          }else {
            _this.$message.error('修改失败');
          }
        });
      },
      remoteMethod() {
      },
      handleCancel(){
      },
      getOriginalLogTemplateDetail(){
        if(this.zmbId != ""){
          let _this = this;
          ajaxRequest('get', 'back/originalogMainTemp/'+this.zmbId, null , (res) => {
            if (res.code === 200) {
              _this.form = res.daoResult;

              //              $("#zmbContent").html(_this.form.zmbContent) ;
              _this.kindEditor.html(_this.form.zmbContent);
            }
          });
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
      toTest1(){
        //设置编辑器的HTML内容
        this.kindEditor.html('<strong>你好啊</strong>');
        //取得编辑器的HTML内容
        alert(this.kindEditor.html());

        //设置编辑器的内容，直接显示HTML代码
        this.kindEditor.text('<strong>你好啊3</strong>');
        //取得编辑器的纯文本内容
        alert(this.kindEditor.text());
      },
      toTest2(){
        //取得当前被选中的HTML内容
        alert(this.kindEditor.selectedHtml());

        //将指定的HTML内容插入到编辑区域里的光标处
        this.kindEditor.insertHtml('<strong>输入文字</strong>');

        //将指定的HTML内容添加到编辑区域最后位置
        this.kindEditor.appendHtml('<strong>结尾追加文字</strong>');
      },
      toTest3(){
        var $_content1 = $('textarea[name="content1"]');
        $_content1.text("");

        this.kindEditor.html('开始<span id="userId">用户ID</span>结束');
        alert($_content1.text());

        //将编辑器的内容设置到原来的textarea控件里
        this.kindEditor.sync();
        alert($_content1.text());
      },
      toTest4(){
        //创建KCmd对象，KCmd用于操作可视化编辑区域的DOM
        var cmd1 = this.kindEditor.cmd;

        //获取kindEditor组件可视化编辑区域的window对象
        var kindEditorWindow1 = cmd1.win;

        //获取kindEditor组件可视化编辑区域的document对象
        var kindEditorDocument1 = cmd1.doc;


        this.kindEditor.html('开始<span id="userId">用户ID</span>结束');
        alert(kindEditorDocument1.getElementById("userId").outerHTML);

        //弹出打印窗口
        cmd1.print();
      },
    },
  }

</script>

<style >
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
  .custom-1d74b7 .el-col-24 {
    width: 100%;
    margin-bottom: 18px;
  }
</style>
