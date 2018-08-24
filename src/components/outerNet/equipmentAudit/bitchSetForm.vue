<template>
<mind-dialog :title="'批量设置'" :visible="true"  width="40%" center v-dialogDrag  @close="handleCancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-Row>

              <el-col :span="24">
                <el-form-item label="强检目录项别" prop="qjmlXb">
                          <el-select  v-model="form.qjmlXb"  @change="changeForceKindEvt">
                              <el-option
                                      v-for="item in forceItems"
                                      :key="item.itemName"
                                      :label="item.itemName"
                                      :value="item.itemName">
                              </el-option>
                          </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="强检目录种别" prop="qjml">
                          <el-select v-model="form.qjml">
                              <el-option
                                      v-for="item in forceKinds"
                                      :key="item.kindName"
                                      :label="item.kindName"
                                      :value="item.kindName">
                              </el-option>
                          </el-select>
                </el-form-item>
              </el-col>

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

          </el-Row>
      </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
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

        return {
            qjml:'',
            jdzq:'',
            form: $.extend({}, defaults, this.data || {}),
            rules: {
              qjmlXb:[{required: true, message: '请选择强检目录项别',trigger:'blur'}],
              qjml:[{required: true, message: '请选择强检目录种别',trigger:'blur'}],
              jddwId:[{required: true, message: '请选择检定机构',trigger:'blur'}],
              jdzq:[{required: true, message: '请选择检定周期',trigger:'blur'}]
            },
            loading: false,
            forceItems: [],
            forceKinds:[],
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
      this.getForceItemListInit();
      this.getJddwListInit();
    },
    directives:{ rightclick },
    mixins:[rightClick],
    methods: {
        getForceItemListInit(){
            //初始化获取强检目录项别数据
            ajaxRequest('get', 'back/forceCatalogItem/listAllForceCatalogItem/' , {}, (res)=> {
                this.forceItems = res.rows;
                if(this.form.qjmlXb){
                    //初始化有项别时，根据项别获取种别
                    this.changeForceKindInit(this.form.qjmlXb);
                }
            })
        },
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
        changeForceKindEvt(qjmlXb){
          //根据项别获取种别
            if(qjmlXb){
                ajaxRequest('get', 'back/forceCatalogKind/getForceCatalogKindByItemName', {
                  itemName:qjmlXb
                },(res)=>{
                    this.forceKinds = res.rows;
                    //每次选择一级，自动清空二级
                    Vue.set(this.form, 'qjml', '');
                })
            }
        },
      changeForceKindInit(qjmlXb){
            //初始化时,根据项别获取种别(与changeForceKindEvt 区别就是不清空，用于编辑页面)
            if(qjmlXb){
                ajaxRequest('get', 'back/forceCatalogKind/getForceCatalogKindByItemName', {
                  itemName :qjmlXb
                },(res)=>{
                    this.forceKinds = res.rows;
                })
            }
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
