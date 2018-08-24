<template>
  <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="配号退回" name="NumberReturn">
      <abnormalTaskDetail :key="renderKey1" :isClaim="isClaim"></abnormalTaskDetail>
    </el-tab-pane>
    <el-tab-pane label="未认领" name="NotClaim">
      <abnormalTaskDetail :key="renderKey2" :isClaim="isClaim"></abnormalTaskDetail>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import Vue from 'vue';
  import abnormalTaskDetail from './abnormalTaskDetail.vue';
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import ElButton from "@/common-el/packages/button/src/button";


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
    Autocomplete
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
  Vue.use(Checkbox);
  Vue.use(Autocomplete); */
  Vue.use(abnormalTaskDetail);


  export default {
    components: {ElButton,abnormalTaskDetail},
    data() {
      return {
        activeName: 'NumberReturn',
        isClaim:'2',
        renderKey1:1,
        renderKey2:1,
      };
    },

    mounted() {

    },
    methods: {
      handleClick(tab, event) {
        if(tab.name=="" || tab.name=="NumberReturn"){//配号退回
          this.isClaim = '2';
          this.renderKey1=!this.renderKey1;
        }else{//未认领
          this.isClaim = '0';
          this.renderKey2=!this.renderKey2;
        }
      }
    }
  };
</script>

<style scoped>

</style>
