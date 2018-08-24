<template>
      <mind-dialog title="证书配置" :visible="true" width="55%"  center v-dialogDrag  @close="handleCancel">
          <el-form ref="form" :model="form" :rules="rules" label-width="130px" size="mini">
          <el-col :span="24">
            <el-button type="primary" @click="handleSubmit" size="small">保存</el-button>
            <el-button type="primary" @click="handleDel" :disabled="delFlag" size="small" >删除</el-button>
            {{form.zmbName}}
          </el-col>
           <el-col :span="8">
            <el-form-item label="检定类型" prop="jdType">
              <el-select v-model="form.jdType" @change="getZsHtmlDetail">
                <el-option
                  v-for="item in templateJdTypes"
                  :label="item.remark"
                  :value="item.remark">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="每页高度" prop="pageHeight" v-if="form.htmlBatchFlag == 1 ">
            <el-input v-model="form.pageHeight"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="页头高度" prop="pageHeaderHeight" v-if="form.htmlBatchFlag == 1 ">
            <el-input v-model="form.pageHeaderHeight"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="页头内容" prop="pageHeaderContent" v-if="form.htmlBatchFlag == 1 ">
            <el-input v-model="form.pageHeaderContent"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="页尾高度"  prop="pageFooterHeight" v-if="form.htmlBatchFlag == 1 ">
            <el-input v-model="form.pageFooterHeight"></el-input>
          </el-form-item>
          </el-col>
           <el-col :span="8">
          <el-form-item label="页尾内容" prop="pageFooterContent" v-if="form.htmlBatchFlag == 1 ">
            <el-input v-model="form.pageFooterContent"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="表格每行高度" prop="tableRowHeight" v-if="form.htmlBatchFlag == 1 ">
            <el-input v-model="form.tableRowHeight"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="表格每行内容" prop="tableRowContent" v-if="form.htmlBatchFlag == 1 ">
            <el-input v-model="form.tableRowContent"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="表格字段对应关系"  prop="tableFieldJson" v-if="form.htmlBatchFlag == 1 ">
            <el-input v-model="form.tableFieldJson"></el-input>
          </el-form-item>
          </el-col> 
        </el-form> 
        <el-col :span="24">
            第1页内容
            <div name="kindeditor1" style="width:100%;height: 280px;"></div>
        </el-col>
        <el-col :span="24">
            第2页内容
            <div name="kindeditor2" style="width:100%;height: 280px;"></div>
        </el-col>
      </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest, ajaxProxyRequest } from '../../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../../directives/rightcilck';
  import rightClick from '../../../../mixins/FormRightClick';

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
    name: "CertificateTemplateConfig",
    props: {
       data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
       //验证数字格式
      var regNum = (rule, value, callback) => {
        let str=new RegExp(/^[0-9]*$/)
        if (!str.test(value)) {
          callback(new Error('请输入数字'));
        }else if(String(value) && String(value).length > 5){
          callback(new Error('最多输入5位数字'));
        }else{
          callback();
        }
      };
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          pageHeight:[
            { validator: regNum},
          ],
          pageHeaderHeight:[
            { validator: regNum},
          ],
          pageFooterHeight:[
            { validator: regNum},
          ],
          tableRowHeight:[
            { validator: regNum},
          ],
        },
        loading: false,
        remoteOptions: [],
        kindEditor1 : null ,
        kindEditor2 : null ,
        delFlag : false ,
        templateJdTypes:[],//模板检定类型
      }
    },
    watch:{
      //监听参数的变化
      zmbId(){
        this.getZsHtmlDetail();
      }
    },
    created(){
      //初始化检定类型列表
      this.getJdType();
    },
    mounted() {
      //加载KindEditor，再调用查询的方法
      this.loadJS(this.getZsHtmlDetail);
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
          this.$nextTick(()=>{
            _this.kindEditor1 = window.KindEditor.create(/*document.getElementById('editor')*/ 'div[name="kindeditor1"]');
            _this.kindEditor2 = window.KindEditor.create(/*document.getElementById('editor')*/ 'div[name="kindeditor2"]');
          });
//          script.onload=function(){
            if(typeof callBackFunction == 'function'){
              callBackFunction();
            }
//          }
//        }
      },
      handleSubmit() {
        this.form.pageContent1 = this.kindEditor1.html();
        this.form.pageContent2 = this.kindEditor2.html();
        //先查询类型是否存在
          ajaxRequest('get', 'back/originalLogMainTempHtml/getbyzmbId',this.form , (res) => {
            if (res.code === 200) {
              if(res.daoResult){
                 //修改
                this.delTime();
                ajaxRequest('put',"back/originalLogMainTempHtml/",this.form,(res) =>{
                  if(res.code == 200){
                    this.$message.success('修改成功');
                  }else {
                    this.$message.error('修改失败');
                  }
                });
              }else{
                 //新增
                this.delTime();
                ajaxRequest('post',"back/originalLogMainTempHtml/",this.form, (res) =>{
                  if(res.code == 200){
                    this.form.zshtmlId = res.daoResult.zshtmlId;
                    this.$message.success('保存成功');
                  }else {
                    this.$message.error('保存失败');
                  }
                });
              }
            }
          });
      },
      handleDel() {
        if (this.form.zshtmlId) {
          this.$confirm('确定要删除该证书配置?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      center:true,
                    }).then(() => {
                      ajaxRequest("DELETE", "back/originalLogMainTempHtml/list/"+this.form.zshtmlId, null, (res) => {
                         if (res.code == 200) {
                           this.$message.success('删除成功');
                           this.handleCancel();
                         } else {
                           this.$message.error('删除失败')
                         }
                       });
                    },()=>{

                    })

        } else {
          this.$message({
            message: '请先选择要删除的证书配置',
            type: 'warning'
          })
        }
      },
      remoteMethod() {
      },
      handleCancel(){
        this.callback();
      },
      getZsHtmlDetail(){
        //把时间字段删掉
        this.delTime();
        if(this.form.zmbId != ""){
          ajaxRequest('get', 'back/originalLogMainTempHtml/getbyzmbId',this.form , (res) => {
            if (res.code === 200) {
              if(res.daoResult){
                this.form.zshtmlId = res.daoResult.zshtmlId;
                this.form.pageHeight = res.daoResult.pageHeight;
                this.form.pageHeaderHeight = res.daoResult.pageHeaderHeight;
                this.form.pageHeaderContent = res.daoResult.pageHeaderContent;
                this.form.pageFooterHeight = res.daoResult.pageFooterHeight;
                this.form.pageFooterContent = res.daoResult.pageFooterContent;
                this.form.tableRowHeight = res.daoResult.tableRowHeight;
                this.form.tableRowContent = res.daoResult.tableRowContent;
                this.form.tableFieldJson = res.daoResult.tableFieldJson;
                this.form.jdType = res.daoResult.jdType;
                this.kindEditor1.html(res.daoResult.pageContent1);
                this.kindEditor2.html(res.daoResult.pageContent2);
                this.delFlag = false;
              }else{
                this.form.pageHeight = null;
                this.form.pageHeaderHeight = null;
                this.form.pageHeaderContent = null;
                this.form.pageFooterHeight = null;
                this.form.pageFooterContent = null;
                this.form.tableRowHeight = null;
                this.form.tableRowContent = null;
                this.form.tableFieldJson = null;
                this.kindEditor1.html(null);
                this.kindEditor2.html(null);
                this.delFlag = true;
              }
            }
          });
        }
      },
      delTime(){
        delete this.form.addTime
        delete this.form.updateTime
        delete this.form.deleteTime
        delete this.form.enableDate
        delete this.form.disableDate
        delete this.form.backupTime
        delete this.form.auditSubmitTime
        delete this.form.auditOneTime
        delete this.form.auditTwoTime
        delete this.form.unAuditSubmitTime
        delete this.form.unAuditOneTime
        delete this.form.unAuditTwoTime
        delete this.form.jdTime
        delete this.form.hyTime
        delete this.form.pzTime
        delete this.form.folderClearTime
        delete this.form.printTime
        delete this.form.pdfTime
        delete this.form.enableDate
        delete this.form.disableDate
        delete this.form.zsjdrq
        delete this.form.zsyxrq
        delete this.form.dataDate1
      },
      //获取模板检定类型
       getJdType() {
        ajaxProxyRequest("get", "/njmind/findParam/templateJdType", {}, res => {
          this.templateJdTypes = res.list;
        });
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
  .custom-1d74b7 .el-dialog--center {
    text-align: center;
    height: 100%;
    margin-top: 5vh !important;
}
</style>
