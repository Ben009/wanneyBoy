<template>
  <div style="position: relative;">
    <el-form>
      <el-input size="mini" :value="value" ref="applianceName"  @input="handleChange($event)"></el-input>
      <RelativeList v-if="relativeData.length && isRelative" :relativeData="relativeData" :show="show" :setValue="setValue"
                    :divWidth="divWidth" :columnsInfo="columnsInfo"/>
      <more-list v-if="isShow" :callback="handleApplianceCallBack" :relativeData="relativeData" :columnsInfo="columnsInfo"
                 :ajaxChangeUrl="ajaxChangeUrl"/>
    </el-form>
  </div>
</template>

<script>
  import Vue from 'vue'

  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest} from '../../util/base'
  //引入jquery
  import $ from 'jquery'
  //引入右击事件 可自行绑定到输入框
  import vueBus from 'vue-bus';
  import RelativeList from './RelativeList.vue'
  import MoreList from './MoreList.vue'

  Vue.use(vueBus);

  const defaults = {
  };

  export default {
    name: 'applianceAutoCompelete',
    props: {//用于接收从父组件中传来的数据
      value:{
        type:String,
      },
      data: {
        type: Object
      },
      callback: {
        type: Function
      },
    },
    data() {
      return {
        columnsInfo : {
          moreInfo: [
            {nameCode: 'applianceName', title: '器具名称', head: 'A:',width: 200},
            {nameCode: 'detectionFee', title: '收费标准', head: 'J:',width: 50},
            {nameCode: 'departName', title: '检测部门', head: 'B:',width: 150},
            {nameCode: 'certificateType', title: '服务类型', head: 'F:',width: 100},
            {nameCode: 'model', title: '型号规格', head: 'X:',width: 150},
            {nameCode: 'measureRange', title: '测量范围', head: 'C:',width: 150},
          ]
        },
        form: $.extend({}, defaults, this.data || {}),
        rules: {},
        loading: false,
        visable: false,
        edit: null,
        flag: false,
        isShow: false,
        relativeData: [],
        ajaxChangeUrl: 'back/appliance/getApplianceInfoForAutoComplete',
        isRelative: 0,
        divWidth: 0,
      }
    },
    mounted() {
      this.$nextTick(val => {
        this.getApplianceNameWidth();
      })
    },
    components: { RelativeList, MoreList},
    methods: {//方法定义'
      handleApplianceCallBack(row) {
        this.isShow = false;
        if (row) {
          this.form = row;
          this.$emit('select-value', row, this.dataindex);
        }
      },
      setValue(row) {
        if (row) {
          this.isRelative = 0;
          this.$emit('select-value', row);
        }
      },
      show() {
        this.isShow = 1;
        this.isRelative = 0;
      },
      handleChange(val) {
        //父页面v-model
        this.$emit('input',val);
        if (val) {
          ajaxRequest('get', 'back/appliance/getApplianceInfoForAutoComplete', {'applianceName': val}, (res) => {
            if (res.code == 200) {
              this.relativeData = res.rows;
              this.relativeData.length > 0 ? this.isRelative = 1 : null;
              }
          })
        } else {
          this.isRelative = 0;
        }
      },
      getApplianceNameWidth(){
        this.divWidth = this.$refs.applianceName.$el.clientWidth*2.5;
      },
    },
  }
</script>

<style>
</style>
