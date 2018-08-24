<template>
    <mind-dialog
            :visible="true"
            dialogSize="mid"
            :title="title"
            center
            v-dialogDrag
            append-to-body
            @close="closeDialog">
        <div>
            <el-form ref="form" :model="form" label-width="150px">
                <el-row>
                    <el-form-item label="选择的登记号">
                        <el-input v-model="djhs" disabled></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="担保人">
                            <el-input v-model="dbPerson" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="担保期限">
                            <el-input v-model="dbDeadLine" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="出库时间">
                            <el-input v-model="outTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="出库人">
                            <el-input v-model="outPerson" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="单位名称">
                        <el-autocomplete style="width: 100%"
                                         v-model="companyName"
                                         :fetch-suggestions="querySearchEntrust"
                                         placeholder="请输入委托单位"
                                         @select="handleSelect">
                            <template slot-scope='scope'>
                                <div>
                  <span style="margin-left:0">({{scope.item.companyType}}) {{scope.item.companyName}}
                     (<span :style="{color:scope.item.status == 0 ? 'red' : 'green'}">{{scope.item.status == 0 ? '未审核' : '已审核'}}</span>)
                     {{!!scope.item.companyDepart ? '['+scope.item.companyDepart+']' : ''}}
                     {{!!scope.item.contacter ? '['+scope.item.contacter+']' : ''}}
                     {{!!scope.item.mobilePhone ? '['+scope.item.mobilePhone+']' : ''}}
                  </span>
                                </div>
                            </template>
                        </el-autocomplete>
                        <el-input v-model="companyId" v-show="false"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="出库类型">
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox label="证书出库" :disabled="zsDisabled"></el-checkbox>
                      <el-checkbox label="样品出库" :disabled="ypDisabled"></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                    <el-form-item label="出库方式">
                        <el-radio-group v-model="outWay">
                            <el-radio :label="1" >快递</el-radio>
                            <!--<el-radio :label="2">客户自取</el-radio>-->
                            <el-radio :label="3">样管员送样</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="快递公司" v-if="outWay===1">
                        <el-select v-model="expressCompany" placeholder="请选择" style="width:100%">
                            <el-option
                                    v-for="item in options"
                                    :key="item.code"
                                    :label="item.premark"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号" v-if="outWay===1">
                        <el-input v-model="courierNum"></el-input>
                    </el-form-item>
                    <el-form-item label="收件人" v-if="outWay===1">
                        <el-input v-model="person"></el-input>
                    </el-form-item>
                    <el-form-item label="收件地址" v-if="outWay===1">
                        <el-input v-model="address"></el-input>
                    </el-form-item>
                    <el-form-item label="收件人电话" v-if="outWay===1">
                        <el-input v-model="mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="remark" @keyup.enter.native="handleSubmit"  ref="focusInput"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item>
                        <el-radio-group v-model="operateWay">
                            <el-radio :label="1">出库并生成出库记录</el-radio>
                            <el-radio :label="2">仅出库</el-radio>
                            <el-radio :label="3">仅生成出库记录</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item>
                        <el-checkbox v-model="checked">自动打印出库记录</el-checkbox>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div style="text-align: center;margin-top:10px;">
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button type="warning" @click="handlePrint" v-if="outWay===1">打印快递单</el-button>
            <el-button @click="closeDialog">关闭</el-button>
        </div>
    </mind-dialog>
</template>

<style>

</style>

<script>
    import Vue from 'vue';
    //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
    import Vuex from 'vuex';
    //引入表格和分页插件
    //引入ajax工具
    import {ajaxRequest, ajaxProxyRequest} from '../../util/base';
    //引入jquery
    import $ from 'jquery';
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";

    const defaults = {};
    export default {
        components: {ElRow},
        name: "comprehensiveOutForm",
        props: {
            title: {
                type: String,
                require: true
            },
            data: {
                type: Array,
                require: true
            },
            callback: {
                type: Function,
                required: true
            },
        },
        data() {
            return {
                form: {},
                outTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),//出库时间
                outPerson: localStorage.getItem('userName'),//出库人
                checked: false,//自动打印出库单
                checkList:[],//出库类型
                zsDisabled:false,
                ypDisabled:false,
                outWay: 3,//出库方式
                companyName: this.data[0].companyName,//单位名称
                companyId: this.data[0].companyId,//单位id
                expressCompany: "",//快递公司
                options: [],//快递公司选项列表
                courierNum: "",//快递单号
                person: "",//收件人
                address: "",//收件地址
                mobile: "",//收件人电话
                remark: "",//备注
                operateWay: 1,//操作方式
                djhs: "",//选择的登记号
                dbPerson: this.data[0].guaranteePersonName,//担保人
                dbDeadLine: this.data[0].guaranteeDeadline//担保期限
            }
        },
        methods: {
          handlePrint() {
            this.printHtml("sendSamplePrint",{key1:this.courierNum,key2:this.address,key3:this.person,key4:this.djhs});
          },
          initCheckList(){//屏蔽复选框
            let zsckFlag=0;
            let ypckFlag=0;
            for(let i=0;i<this.data.length;i++){
              let s = this.data[i].registrationNo.toString().substring(0, 1);
              if (s == "8") {
                //可勾选的情况：（1）证书状态是已入库，已结账或已担保证。（2）样品状态是已入库，已结账或已担保货
                if ((this.data[i].applianceWarehouseFlag == 3 && (this.data[i].sfjz == 1 || this.data[i].guaranteeType == 1 || this.data[i].guaranteeType == 2))) {
                  ypckFlag++;
                }
                if((this.data[i].certificateWarehouseFlag == 3 && (this.data[i].sfjz == 1 || this.data[i].guaranteeType == 1 || this.data[i].guaranteeType == 3))){
                  zsckFlag++;
                }
              }
              else if (s == "9") {//现场检测可勾选的情况：（1）证书状态是已入库，已结账或已担保证。
                if (this.data[i].certificateWarehouseFlag == 3 && (this.data[i].sfjz == 1 || this.data[i].guaranteeType == 2 || this.data[i].guaranteeType == 3)) {
                  zsckFlag++;
                }
              }
            }
            if(zsckFlag==this.data.length&&ypckFlag==this.data.length){
              this.checkList=["证书出库","样品出库"];
            }
            if(zsckFlag==this.data.length&&ypckFlag!=this.data.length){
              this.checkList=["证书出库"];
              this.ypDisabled=true;
            }
            if(ypckFlag==this.data.length&&zsckFlag!=this.data.length){
              this.checkList=["样品出库"];
              this.zsDisabled=true;
            }
            if(ypckFlag!=this.data.length&&zsckFlag!=this.data.length){
              this.checkList=[];
              this.zsDisabled=true;
              this.ypDisabled=true;
            }
          },
            handleSubmit() {
              if (this.checkList.length<=0) {
                this.$message.warning("请选择出库类型");
                return;
              }
                if (this.operateWay == "") {
                    this.$message.warning("请选择操作方式");
                    return;
                }
                this.form.dhlist = JSON.stringify(this.data);
                this.form.ckfs = this.outWay;
                this.form.dwmc = this.companyName;
                this.form.dwid = this.companyId;
                this.form.expressName = this.expressCompany;
                this.form.expressNo = this.courierNum;
                this.form.receivePerson = this.person;
                this.form.receiveAddress = this.address;
                this.form.receiveMobile = this.mobile;
                this.form.remark = this.remark;
                this.form.czfs = this.operateWay;
                this.form.checked = this.checked;

              if(this.checkList.length>1){
                this.form.cklx = 3;
              }else{
                if(this.checkList[0]=="样品出库"){
                  this.form.cklx =1;
                }else if(this.checkList[0]=="证书出库"){
                  this.form.cklx = 2;
                }
              }
                ajaxRequest('post', 'back/ruku/chuKu', this.form, (res) => {
                    if (res.code === 200) {
                        this.$message.success('提交成功');
                        this.callback(this.form);//回调刷新父页面表格
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },
            getExpressCompany() {//快递公司下拉框
                ajaxProxyRequest('get', '/njmind/findParams/express', {codeType: 'NUMBER'}, (res) => {
                    this.options = res.express.list;
                })
            },
            getInfo() {
              this.checkList=["样品出库","证书出库"];
                for (let i = 0; i < this.data.length; i++) {
                    this.djhs = this.djhs + this.data[i].registrationNo + " ";
                }
                this.djhs = this.djhs + "共" + this.data.length + "条";
            },
            //委托单位autoComplete
            querySearchEntrust(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                let params = queryString
                    ? {
                        companyName: queryString,
                        fuzzySearch: 1
                    }
                    : "";
                ajaxRequest("get", "back/company/matchCompanysByName", params, res => {
                    if (res.code == 200) {
                        this.handleResult(res.rows);
                        cb(res.rows);
                    }
                });
            },
            handleResult(res) {
                for (let key in res) {
                    Vue.set(res[key], "value", res[key].companyName);
                }
            },
            handleSelect(item) {
                this.companyId = item.id;
            },
            closeDialog() {
                this.callback();
            },
        },
        mounted() {
            this.getExpressCompany();
//            this.initCheckList();
            this.getInfo();
          this.$nextTick(()=>{
            this.$refs.focusInput.focus()
          })
        }
    }
</script>
