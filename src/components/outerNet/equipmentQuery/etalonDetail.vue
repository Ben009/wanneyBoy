<template>
  <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <div class="title-item"><span>器具详情</span></div>
          <el-Row>
            <el-col :span="0">
            <el-form-item label="主键" prop="id">
            </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="器具名称:">
                {{form.sbmc}}
              </el-form-item>
            </el-col>

             <el-col :span="8">
              <el-form-item label="制造单位:">
                {{form.zzcs}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="出厂编号:">
                {{form.ccbh}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="型号规格:">
                {{form.xhgg}}
              </el-form-item>
            </el-col>
          </el-Row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="测量范围:">
                {{form.clfw}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="准确度等级:">
                {{form.zqddj}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="数量:">
                {{form.sl}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="使用状态:">
                {{form.sbzt}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="使用/安装地点:">
                {{form.cfdd}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="检定周期(月):">
                {{form.jdzq}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="有效期:">
                {{form.yxq | myCurrency}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="检测机构:">
                {{form.jddw}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8" ref="fileZy" v-model="fileZy" >
              <el-form-item label="主标准器证书:">
                <a href="javascript:void(0);" @click="showFj(fileZy)" target="_blank">{{ fileZy.fileName }}</a>
              </el-form-item>
            </el-col>

            <el-col :span="8" ref="fileFy" v-model="fileFy">
              <el-form-item label="主标准器证书副页:">
                <a href="javascript:void(0);" @click="showFj(fileFy)" target="_blank">{{ fileFy.fileName }}</a>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="备注:">
                {{form.bz}}
              </el-form-item>
            </el-col>
          </el-Row>

      </el-form>
      <div style="width: 100%;text-align: center; margin-top:20px;">
        <el-button @click="handleCancel">返 回</el-button>
      </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import vueBus from 'vue-bus';
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import ElRow from "@/common-el/packages/row/src/row";

/*    import {
    Button,
    Checkbox,
    CheckboxGroup,
    Col,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
    Row,
  } from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox);  */

  Vue.use(vueBus);

  const defaults = {
    hoho:''
  };
  export default {
    name: "layout",
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
        },

        cmiimsUrl : "",
        loading: false,
        remoteOptions: [],
        choose:null,
        fileZy:{},
        fileFy:{},

      }
    },
    mounted() {
      this.remoteMethod();
    },
    created () {
      this.getEquipment();
    },
    directives:{ rightclick },
    mixins:[rightClick],
    methods: {
      getEquipment () {
        ajaxRequest('get', 'back/equipmentQuery/getForceInstruments', {
          forceInstrumentsId: this.$route.query.id
        }, res => {
          if (res.code === 200) {
            this.form = res.t;
            // 拿到标准器详细信息后，去拿对应的文件 add by chenjinwei 20180629
            this.getEquipmentFile();
          }
        })
      },
      getEquipmentFile(){
        ajaxRequest('get', 'back/outerNetFile/getFileByPkId', {
          pkId: this.$route.query.id
        }, res => {
          let _this = this;
          if (res.code === 200) {
            _this.cmiimsUrl = res.map.cmiimsUrl;
            var fileList = res.map.fileList || [];
            for(var i=0;i<fileList.length;i++){
              // 设置主标准器主页附件信息
              if("0" == fileList[i].breach){
                this.$set(this.fileZy,'fileName',fileList[i].fileName);
                this.$set(this.fileZy,'filePath',fileList[i].filePath);
              }else if("1" == fileList[i].breach){
                this.$set(this.fileFy,'fileName',fileList[i].fileName);
                this.$set(this.fileFy,'filePath',fileList[i].filePath);
              }
            }
          }
        })
      },
      showFj(obj){
        window.open(this.cmiimsUrl+obj.filePath);
      },
      remoteMethod(keyWords) {
        this.loading = true;
        $.ajax();
      },
      handleCancel(){
        this.$router.go(-1)
      },
      dealDate: function (row, column, cellValue) {
        return formatDate(cellValue, "YYYY-MM-DD");
      },

    },
    components:{
      ElRow,
    },
    filters: {
      myCurrency(myInput) {
        return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
      },
    }
  }
</script>

<style>
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

  .but-yywtd{border:1px solid #3094e0!important; background:none!important;color:#3094e0!important;}
  .but-yywtd:hover{background:#3094e0!important;color:#fff!important;}
</style>
