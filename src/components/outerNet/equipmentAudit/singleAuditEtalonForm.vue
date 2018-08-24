<template>
<mind-dialog :title="'器具审核'" :visible="true" width="40%"  center v-dialogDrag  @close="handleEdited(null)">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-Row>
            <el-col :span="24">
              <el-form-item label="审核结果" prop="qjshStatus">
                <el-radio-group v-model="form.qjshStatus">
                  <el-radio :label="1">通过</el-radio>
                  <el-radio :label="2">退回修改</el-radio>
                  <el-radio :label="4">不予备案</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="审核意见" prop="opinion">
                <el-input v-model="form.opinion"></el-input>
              </el-form-item>
            </el-col>

            <div v-if="form.qjshStatus == 1">

              <el-col :span="24">
                <el-form-item label="检定周期" prop="jdzq">
                  <el-select v-model="form.jdzq">
                    <el-option
                      v-for="item in jdzqData"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="检定机构" prop="jddwId">
                  <el-select v-model="form.jddwId">
                    <el-option
                      v-for="item in jddws"
                      :key="item.id"
                      :label="item.mc"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
          </el-Row>
      </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">审 核</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
</mind-dialog>
</template>

<script>
  import Vue from 'vue';

  import {ajaxRequest,ajaxProxyRequest,transToType} from '../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';

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
      var validateOpinion = (rule, value, callback) => {
        if (this.form.qjshStatus != '1' && !this.form.opinion) {
          callback(new Error("请输入审核意见"))
        } else {
          callback();
        }
      };
        return {
            jdzq:'',
            form: $.extend({}, defaults, this.data || {}),
            rules: {
              opinion:[{validator: validateOpinion, trigger: 'blur'}],
              jddwId:[{required: true, message: '请选择检定机构',trigger:'blur'}],
              jdzq:[{required: true, message: '请选择检定周期',trigger:'blur'}]
            },
            loading: false,
            jddws:[],
            jdzqData:[
              {name:"首检"},
              {name:"6"},
              {name:"12"},
              {name:"24"},
              {name:"36"},
              {name:"48"},
              {name:"60"},
              {name:"72"},
              ],

        };
    },
    mounted() {
      this.getJddwListInit();
    },
    directives:{ rightclick },
    mixins:[rightClick],
    methods: {
        getJddwListInit(){
          let _this = this;
          //初始化获取强检目录项别数据
          ajaxRequest('get', 'back/equipmentAudit/getAllJddw' , {}, (res)=> {
              if(res.code===200){
                _this.jddws = res.map.jddws||[] ;

                // 若未匹配到，则默认选中可报检的那个单位
                if(!_this.form.jddwId){
                  for(var i=0;i<_this.jddws.length;i++){
                    var isWsbj = _this.jddws[i].isWsbj;
                    if('1' == isWsbj){
                      _this.form.jddwId = _this.jddws[i].id;
                      break;
                    }
                  }
                }else{
                  for(var i=0;i<_this.jddws.length;i++){
                    var isWsbj = _this.jddws[i].isWsbj;
                    if(_this.form.jddwId == _this.jddws[i].id){
                      _this.form.jddwId = _this.jddws[i].id;
                      break;
                    }
                  }
                }
              }
          })
        },
        handleSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.callback(this.form);
                } else {
                    return false;
                }
            })
        },
      remoteMethod(keyWords) {
      },
        handleCancel () {
          //关闭窗口
            this.callback()
        }
    },
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
</style>
