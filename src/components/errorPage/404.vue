<template>
  <div class="center">
    <span style="font-size: 25px;font-weight: bold;">404</span>
  </div>

</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery'; 
  import {ajaxRequest, formatArrayToTree} from '../util/base';
  import ElFormItem from "@/common-el/packages/form/src/form-item.vue";

/*   import {Button,Col,  Radio,RadioGroup,Form ,FormItem,Input,Menu,MenuItem,Switch,Icon,CheckboxGroup,Checkbox,} from 'element--ui';
  Vue.use(Button); 
  Vue.use(Menu);
  Vue.use(MenuItem);
  Vue.use(Switch);
  Vue.use(Icon);
  Vue.use(Col);
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);  
  Vue.use(Radio);
  Vue.use(RadioGroup);  */

  export default {
    components: {ElFormItem},
    name: "formView",
    data(){
      return{
        form:{
          username:'',
          password: ''
        },
        errMsg:""
      }
    },
    methods:{

    },
    mounted(){

    }
  }
</script>
