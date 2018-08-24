<template>
  <mind-dialog
  :title="!!data.id?'编辑项目维护':'新增项目维护'"
  :visible="true"
  dialogSize="mid"
  center
  v-dialogDrag
  @close="handleCancel">
      <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-Row>
              <el-col :span="12">
              <el-form-item label="项目名称" prop="projectName">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.projectName" v-rightclick="handleRightClick.bind(this,form,'projectName')"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="12">
              <el-form-item  prop="projectType">
                <template slot = "label">
                  <span>项目类别</span>
                  <el-tooltip class="item" effect="dark" content="项目类别在基础数据中维护。">
                    <i class="el-icon-info ft12"></i>
                  </el-tooltip>
                </template>
                <el-select
                  placeholder="请选择"
                  v-model="form.projectType">
                  <el-option
                    v-for="item in projectType"
                    :label="item.remark"
                    :value="item.remark"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.remark" v-rightclick="handleRightClick.bind(this,form,'remark')"></el-input>
              </el-form-item>
              </el-col>
          </el-Row>
        <el-Row><div class="title-item"><span>技术依据</span></div></el-Row>
        <el-Row :gutter="20">
          <el-col :span="6">
            <el-form-item label="技术依据编号" prop="basisNo" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="技术依据名称" prop="name" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20" v-for="(spe,index) in tecBasList" :key="index">
          <el-col :span="6">
            <el-input v-model="spe.basisNo" @focus.stop="chooseSpe(1,index)" v-rightclick="handleRightClick.bind(this,form,'basisNo')" readonly="true"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input v-model="spe.name" v-rightclick="handleRightClick.bind(this,form,'name')" readonly="true"></el-input>
          </el-col>
          <el-col :span="6" class="formBtn">
            <el-button @click="addSpecification" class="el-button el-button--primary">新增</el-button>
            <el-button @click.prevent="deleteSpecification(spe)" class="el-button el-button--danger">删除</el-button>
          </el-col>
        </el-Row>
        <el-Row><div class="title-item"><span>计量标准</span></div></el-Row>
        <el-Row :gutter="20">
          <el-col :span="4">
            <el-form-item label="计量标准名称" prop="standardName" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="计量标准证书号" prop="standardCerNo" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="扩展/不确定度" prop="levels" class="lbCenter lbPadding"></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="测量范围" prop="measuringRange" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="计量标准有效期" prop="validity" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20" v-for="(sta,index1) in standardList" :key="index1">
          <el-col :span="4">
            <el-input v-model="sta.standardName" @focus.stop="chooseSta(1,index1)" v-rightclick="handleRightClick.bind(this,form,'standardName')"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="sta.publicNo" v-rightclick="handleRightClick.bind(this,form,'publicNo')" readonly="true"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="sta.levels" v-rightclick="handleRightClick.bind(this,form,'levels')" readonly="true"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="sta.measuringRange" v-rightclick="handleRightClick.bind(this,form,'measuringRange')" readonly="true"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="sta.validity" :formatter="dealDate" v-rightclick="handleRightClick.bind(this,form,'validity')" readonly="true"></el-input>
          </el-col>
          <el-col :span="4" class="formBtn">
            <el-button @click="addStandard" class="el-button el-button--primary">新增</el-button>
            <el-button @click="deleteStandard(sta)" class="el-button el-button--danger">删除</el-button>
          </el-col>
        </el-Row>
        <el-Row><div class="title-item"><span>CNAS管理</span></div></el-Row>
        <el-Row :gutter="20">
          <el-col :span="6">
            <el-form-item label="项目名称" prop="name" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目类别" prop="typeName" class="lbCenter"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属部门" prop="departName" class="lbCenter"></el-form-item>
          </el-col>
        </el-Row>
        <el-Row :gutter="20" v-for="(cnas,index2) in cnasList" :key="index2">
          <el-col :span="6">
            <el-input v-model="cnas.name" @focus.stop="chooseCn(1,index2)" v-rightclick="handleRightClick.bind(this,form,'cnasName')" readonly="true"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input v-model="cnas.typeName" v-rightclick="handleRightClick.bind(this,form,'category')" readonly="true"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input v-model="cnas.departName" v-rightclick="handleRightClick.bind(this,form,'department')" readonly="true"></el-input>
          </el-col>
          <el-col :span="6" class="formBtn">
            <el-button @click="addCNAS" class="el-button el-button--primary">新增</el-button>
            <el-button @click="deleteCNAS(cnas)" class="el-button el-button--danger">删除</el-button>
          </el-col>
        </el-Row>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button type="warning" @click="handleEmpty('form')">清空</el-button>
          <el-button @click="handleCancel">关闭</el-button>
      </span>
    <!--:data="chooseSpecification chooseStandard chooseCnas"-->
    <quficationSpecificationForm v-if="chooseSpecification" :callback="handleCloseSpe" :speIds='speIds' :index="index" :checkRow="checkRow"></quficationSpecificationForm>
    <quficationStandardForm v-if="chooseStandard" :callback="handleCloseSta" :staIds='staIds' :index1="index1" :checkRow1="checkRow1"></quficationStandardForm>
    <quficationCnasForm v-if="chooseCnas" :callback="handleCloseCn" :cnasIds='cnasIds' :index2="index2" :checkRow2="checkRow2"></quficationCnasForm>
  </mind-dialog>
</template>

<script>
import Vue from 'vue';
import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
import rightclick from '../../../directives/rightcilck';
import rightClick from '../../../mixins/FormRightClick';
import $ from 'jquery';
import ElCol from "@/common-el/packages/col/src/col";
import ElRow from "@/common-el/packages/row/src/row";
import quficationSpecificationForm from './QuficationSpecificationForm';
import quficationStandardForm from './QuficationStandardForm';
import quficationCnasForm from './QuficationCnasForm';


const defaults = {
  };
  export default {
    components: {
      ElRow,
      ElCol},
    name: "quficationProjectForm",
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object,
        require: true
      },
      callback: {
        type: Function,
          require: true
      },
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
//校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          projectName:[{type: 'string', required: true, message: '项目名称不能为空', trigger: 'blur'},
            {max: 100, message: '最多输入100个字符', trigger: 'blur'}],
          remark:[{max: 200, message: '最多输入200个字符', trigger: 'blur'}]
        },
        projectType:[],//项目类别
        loading: false,
        chooseSpecification:false,//依据规范弹层
        chooseStandard:false,//计量标准弹层
        chooseCnas:false,//CNAS弹层
        speIds: [],
        staIds: [],
        cnasIds: [],
        index: 0,
        index1: 0,
        index2: 0,
        row: {},
        standardList: [{standardName: '', publicNo: '', measuringRange: '',levels:'',validity:'',sort: 1,standardId:null}],
        tecBasList:[{basisNo:'',name:'',sort: 1,specificationId: null}],
        cnasList:[{name:'',typeName:'',departName:'',sort: 1,cnasId: null}]
      }
    },
    mounted() {
//      this.getStandardTypes();
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
    },
    created(){
      //初始化部门
//      this.ajaxDepartNameObj();
      this.getStandardTypes ();
    },
    directives:{ rightclick },
    mixins:[rightClick],
    components:{
      quficationSpecificationForm,
      quficationStandardForm,
      quficationCnasForm
    },
    methods: {//方法定义
      ajaxDepartNameObj(){
        ajaxRequest('get','back/depart/list/',{
          isDelete:0,
        },function(data){
          if(data.code===200){alert(1)
            for (var i = 0; i < data.rows.length; i++) {
              this.projectType.push({'departId':data.rows[i].id,'departName':data.rows
                [i].departName});
            }
          }
        }.bind(this))
      },
      dealDate: function (row, column, cellValue) {
        return new Date(cellValue).format('YYYY-MM-DD')
      },
      getStandardTypes () {
        let _this=this;
        ajaxProxyRequest('get','/njmind/findParam/standardType',{},function (res) {
          // debugger;
          _this.projectType = res.list;
        }.bind(this))
      },
      checkRow (row, index) {
        let repeat=false;
        for(var i=0;i<this.tecBasList.length;i++){
          if(this.tecBasList[i]["specificationId"]==row.id){
            repeat=true;
            this.$message.warning('不要选择重复的依据规范');
            return false;
          }else{
            repeat=false;
          }
        }
        if(repeat===false) {
          let speTemp = {
            name: row.name,
            basisNo: row.basisNo,
            sort: index + 1,
            specificationId: row.id,
            basisId: this.form.id
          }
          this.tecBasList[index] = speTemp;
        }
      },
      checkRow1 (row, index) {
        let repeat=false;
        for(var i=0;i<this.standardList.length;i++){
          if(this.standardList[i]["standardId"]==row.id){
            repeat=true;
            this.$message.warning('不要选择重复的计量标准');
            return false;
          }else{
            repeat=false;
          }
        }
        if(repeat===false) {
          let newDate = new Date(row.standardValidDate).format('YYYY-MM-DD');
          if (row.standardValidDate === null) {
            newDate = "";
          }
          let staTemp = {
            standardName: row.standardName,
            publicNo: row.standardCerNo,
            measuringRange: row.measuringRange,
            levels: row.classAccuracy,
            validity: newDate,
            standardNo: row.id,
            sort: index + 1,
            standardId: row.id,
            basisId: this.form.id
          }
          this.standardList[index] = staTemp
        }
      },
      checkRow2 (row, index) {
        let repeat=false;
        for(var i=0;i<this.cnasList.length;i++){
          if(this.cnasList[i]["cnasId"]==row.id){
            repeat=true;
            this.$message.warning('不要选择重复的CNAS');
            return false;
          }else{
            repeat=false;
          }
        }
        if(repeat===false) {
          let cnasTemp = {
            name: row.name,
            typeName: row.typeName,
            departName: row.departName,
            sort: index + 1,
            cnasId: row.id,
            id:row.id,
            basisId: this.form.id
          }
          this.cnasList[index] = cnasTemp
        }
      },
      handleSubmit() {
        let _this = this;
      //-- 表单提交处理 --
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
          if (valid) {
                  var httpMethod;//http请求方式
            if(!this.form.id||this.form.id==''){//新增 注意:通过id是否存在来判断是新增还是编辑
                httpMethod = 'post';
            }else {//更新
                httpMethod = 'put';
            }

            let speArr=[];
            for(var i=0;i<this.tecBasList.length;i++){
              if(_this.tecBasList[i].specificationId!=null && _this.tecBasList[i].specificationId != ''){
                speArr[i]=_this.tecBasList[i];
              }
            }
            if (speArr.length > 0) {
              this.form.tecBasList = JSON.stringify(speArr)
            }

            let staArr=[];
            for(var j=0;j<this.standardList.length;j++){
              if(_this.standardList[j].standardId!=null && _this.standardList[j].standardId != ''){
                staArr[j]=_this.standardList[j];
              }
            }
            if (staArr.length > 0) {
            this.form.standardList=JSON.stringify(staArr);
            }

            let cnasArr=[];
            for(var k=0;k<this.cnasList.length;k++){
              if(_this.cnasList[k].cnasId!=null && _this.cnasList[k].cnasId != ''){
                cnasArr[k]=_this.cnasList[k];
              }
            }
            if (cnasArr.length > 0) {
              this.form.cnasList=JSON.stringify(cnasArr);
            }

              ajaxRequest(httpMethod, "back/quficationProject", this.form, (res)=> {
                  if(res.code == 200){
                    if(httpMethod = 'put'){
                      this.$message.success('编辑成功');
                    }else {
                      this.$message.success('新增成功');
                    }
                      this.callback(this.form);//回调刷新父页面表格
                  }else{
                    if(httpMethod = 'put'){
                      this.$message.success('编辑失败');
                    }else {
                      this.$message.success('新增失败');
                    }
                  }
              });
          }else{
            return false;
          }
        })
      },
      handleEmpty(formName){
        this.$refs[formName].resetFields();
        this.standardList=[{standardName: '', publicNo: '', measuringRange: '',levels:'',validity:'',sort: 1,standardId:null}];
        this.tecBasList=[{basisNo:'',name:'',sort: 1,specificationId: null}];
        this.cnasList=[{name:'',typeName:'',departName:'',sort: 1,cnasId: null}];
      },
      handleCancel(){
        this.callback();
      },
      handleCloseSpe(){
        this.chooseSpecification =null;
      },
      handleCloseSta(){
        this.chooseStandard =null;
      },
      handleCloseCn(){
        this.chooseCnas =null;
      },
      remoteMethod() {
      //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
          if(this.form && this.form.id){
            ajaxRequest('get', 'back/quficationProject/getProjectDetail', {id: this.form.id}, (data) => {
              if (data.code == 200) {
                data = data.daoResult
                for (let key in data) {
                  if (data[key] == null) {
                    delete data[key]
                  }
                }
                delete data.addTime
                delete data.updateTime
                this.form = data

                var staId='standardId';
                for(var i=0;i<data.standardList.length;i++){
                  data.standardList[i][staId]=data.standardList[i]['standardNo'];
                }
                if (data.standardList.length > 0) {
                  this.standardList = data.standardList
                }

                var speId='specificationId';
                for(var j=0;j<data.tecBasList.length;j++){
                  data.tecBasList[j][speId]=data.tecBasList[j]['id'];
                }
                if (data.tecBasList.length > 0) {
                  this.tecBasList = data.tecBasList
                }

                var cnasId='cnasId';
                for(var k=0;k<data.cnasList.length;k++){
                  data.cnasList[k][cnasId]=data.cnasList[k]['id'];
                }
                if (data.cnasList.length > 0) {
                  this.cnasList = data.cnasList
                }
              }
            })
          }
      },
      addSpecification(){
        this.tecBasList.push({
          basisNo:null,
          name:null,
          sort: 1,
          specificationId: null
        })
      },
      deleteSpecification(spe){
        var index = this.tecBasList.indexOf(spe);
        if (index !== -1) {
          this.tecBasList.splice(index,1);
        }
        if(this.tecBasList.length==0){
          this.tecBasList=[{
            basisNo:null,
            name:null,
            specificationId: null
          }];
        }else {
          let _this=this;
          $(_this.tecBasList).each(function (index) {
            _this.tecBasList[index].sort = index + 1
          })
        }
      },
      addStandard(){
        this.standardList.push({
          standardName:null,
          socialPublic:null,
          measuringRange:null,
          levels:null,
          validity:null,
          sort: 1,
          standardId: null
        })
      },
      deleteStandard(sta){
        var index = this.standardList.indexOf(sta);
        if (index !== -1) {
          this.standardList.splice(index,1);
        }
        if(this.standardList.length==0){
          this.standardList=[{
            standardName:null,
            socialPublic:null,
            measuringRange:null,
            levels:null,
            validity:null,
            standardId: null
          }];
        }else {
          let _this=this;
          $(_this.standardList).each(function (index) {
            _this.standardList[index].sort = index + 1
          })
        }
      },
      addCNAS(){
        this.cnasList.push({
          name:null,
          typeName:null,
          departName:null,
          sort: 1,
          cnasId: null
        })
      },
      deleteCNAS(cnas){
        var index = this.cnasList.indexOf(cnas);
        this.cnasList.splice(index,1);
        if(this.cnasList.length==0){
          this.cnasList=[{
            name:null,
            typeName:null,
            departName:null,
            cnasId: null
          }];
        }else{
          let _this=this;
          $(_this.cnasList).each(function (index) {
            _this.cnasList[index].sort = index + 1
          })
        }
      },
      chooseSpe: function (flag, index) {
        for (let i = 0; i < this.tecBasList.length; i++) {
          let spe = this.tecBasList[i]
          if (spe.specificationId != null) {
            this.speIds[this.speIds.length] = spe.specificationId
          }
        }
        if (this.form.id != null && this.form.id != '') {
          this.speIds[this.speIds.length] = this.form.id
        }
        this.chooseSpecification = flag
        this.index = index == null ? 0 : index
      },
      chooseSta: function (flag, index) {
        for (let i = 0; i < this.standardList.length; i++) {
          let sta = this.standardList[i]
          if (sta.standardId != null) {
            this.staIds[this.staIds.length] = sta.standardId
          }
        }
        if (this.form.id != null && this.form.id != '') {
          this.staIds[this.staIds.length] = this.form.id
        }
        this.chooseStandard = flag
        this.index1 = index == null ? 0 : index
      },
      chooseCn: function (flag, index) {
        for (let i = 0; i < this.cnasList.length; i++) {
          let cn = this.cnasList[i]
          if (cn.cnasId != null) {
            this.cnasIds[this.cnasIds.length] = cn.cnasId
          }
        }
        if (this.form.id != null && this.form.id != '') {
          this.cnasIds[this.cnasIds.length] = this.form.id
        }
        this.chooseCnas = flag
        this.index2 = index == null ? 0 : index
      },
    },

  }
</script>

<style>
   <!-- 右键菜单样式设置 -->
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
  .el-row{
    margin-bottom: 10px!important;
  }
  .el-form-item__label{
    text-align: center !important;
  }
  .lbCenter>label{
    width:100%!important;
  }
   .lbPadding>label{
     padding-right:0!important;
   }
</style>
