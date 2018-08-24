<template>
  <mind-dialog
    title="证书数量修改"
    :visible="true"
    dialogSize="mid"
    center
    v-dialogDrag
    @close="handleCancel">
        <div class="btnDiv">
          <div class="tips">如无需出具证书请取消勾选</div>
          登记号：{{registrationNo}}
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleCancel">关闭</el-button>
        </div>
        <el-table class="tabDiv" :data="gridData" >
          <el-table-column property="sampleBh" label="样品号" ></el-table-column>
          <el-table-column property="applianceName" label="器具名称" ></el-table-column>
          <el-table-column :render-header="checkColumn" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.zsId != null || scope.row.ysjlId != null || (scope.row.zsId != null && scope.row.ysjlId != null) || 1 == scope.row.returnFlag ">
                {{formatData(scope.row)}}
              </div>
              <div v-else>
                <el-checkbox v-if="checkeStatus" :checked="scope.row.certificateFlag==1" @change="change(scope.row)"></el-checkbox>
              </div>
            </template>
          </el-table-column>

        </el-table>

  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../../util/base';
  import {ajaxRequestHeader} from '../../../util/base';
  import $ from 'jquery';


/*   import {
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
    Select
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
  Vue.use(Checkbox); */


  const defaults = {
    hoho:''
  };
  export default {
    name: "CertificateEditNumber",
    props: {
      callback: {
        type:Function,
        required:true
      },
      //登记号
      registrationNo: {default: null},
    },
    data() {
      return {
        loading: false,
        remoteOptions: [],
        gridData: [],
        sampleBhs:[],
        checkeStatus:true,//子复选框选中状态
        checkedAll:false,//全选
        checkeCount:0,//选中个数
        checkeAllStatus:true,//全选状态
        checke:0,//全选默认为不选中
      }
    },
    mounted() {
      this.remoteMethod();
    },
    watch: {
      //监听是否选中状态
      checkedAll(){
        this.checkeAllStatus = false;
        this.$nextTick(temp => {
          this.checkeAllStatus = true;
        })
      }
    },
    methods: {
      //初始化数据
      initData(){
        ajaxRequest("get", "back/certificateCommon/getTemplateJdTypeList/"+this.registrationNo,null, (res) => {
              this.gridData = res.daoResult;
              this.initBhs();
        });
      },
      //初始化编号集合
      initBhs(){
        this.gridData.forEach((item, index) => {
          if(item.zsId != null || item.ysjlId != null || (item.zsId != null && item.ysjlId != null) || 1 == item.returnFlag ){
          }else{
            this.sampleBhs.push(item.sampleBh);
            //如果出具证书默认为选中
            if(item.certificateFlag == 1){
              this.checkeCount++;
            }
          }
        })
        //如果长度相等 全选为true
        if(this.sampleBhs.length == this.checkeCount){
          this.checkedAll = true
          this.checke = 1;
        }
      },
      //保存
      handleSubmit() {
        if(this.sampleBhs.length == 0){
           this.$message.error('没有可保存的记录!')
           return
        }
        ajaxRequestHeader("POST", "back/certificateCommon/updateCertificatesNumberBatch",JSON.stringify(this.gridData), (res) => {
          if (res.code == 200) {
            this.$message.success('保存成功')
            this.handleCancel();
          } else {
            this.$message.error('保存失败')
          }
        },null,'application/json');
      },
      remoteMethod(keyWords) {
        this.loading = true;
        $.ajax();
      },
      //返回
      handleCancel(){
        this.callback();
      },
      //全选
      handleSelectionChange(val) {
        if(this.checke == 1){
          this.gridData.forEach((item, index) => {
            this.$set(this.gridData[index],'certificateFlag',(!val.target.checked) ? '0' : '1')
          })
        }else{
          //不是全选 第一次点全选
          this.gridData.forEach((item, index) => {
            this.$set(this.gridData[index],'certificateFlag','1')
          })
          this.checke = 1;
        }
        if(val.target.checked){
          this.checkeCount = this.sampleBhs.length;
          this.checkedAll =true
        }else {
          this.checkeCount = 0;
          this.checkedAll = false
        }
        this.checkeStatus = false;
        this.$nextTick(temp => {
          this.checkeStatus = true;
        })
      },
      //改变复选框的值
      change(row){
        row.certificateFlag = (row.certificateFlag == '1') ? '0' : '1'
        if(row.certificateFlag == 1){
          //如果选中加一个
          this.checkeCount++
        }else{
          //否则删除一个
          this.checkeCount--
        }
        this.$set(row,'certificateFlag',row.certificateFlag)
        if(this.sampleBhs.length == this.checkeCount){
          this.checkedAll =true
        }else{
          this.checkedAll = false
        }
      },
      //格式化显示数据
      formatData:function (row, column){
        if(row.zsId){
          return '已出证书'
        } else if(row.ysjlId){
          return '已出原始记录'
        } else if(row.zsId != null && row.ysjlId != null ){
          return '已出证书、原始记录'
        } else if(1 == row.returnFlag){
          return '已退回'
        }
      },
      checkColumn(h, { column, $index }){
        if(this.checkeAllStatus){
          return h('el-checkbox',{
            props:{
              checked:this.checkedAll
            },
            nativeOn:{
              change: this.handleSelectionChange
            }
          })
        }
      }
    },
    created(){
      this.initData();
    }
  }
</script>

<style lang="scss" scoped>
  .tabDiv{
    width: 100%;
    margin-top: 2% !important;
  }
  .btnDiv{
    text-align: center;
  }
  .tips{
    color: red;
    text-align: center;
    margin: 2%;
  }
</style>
