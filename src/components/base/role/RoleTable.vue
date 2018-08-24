<template>
  <div class="entrust-item">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="角色信息" name="first" :key="key.first"><roleList /></el-tab-pane>
      <el-tab-pane label="操作日志" name="second" :key="key.second" :lazy="true"><roleLogList :flag="flag"/></el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxSyncRequest} from '../../util/base'
  import $ from 'jquery'
  import roleList from './RoleList.vue'
  import roleLogList from './RoleLogList.vue'

  
/*   import {Select,  Input, Button, Checkbox} from 'element--ui';
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Checkbox); */
  
  export default {
    name: "roleTable",
    components:{
      roleList, roleLogList
    },
    data(){ 
      return {
        tabsList:['角色信息','操作日志'],
        tabIndex:0,
        activeName:'first',
        key:{
          first:'one',
          second:'two'
        },
        flag:0,
      }
    },
    computed:{ 
    },
    methods:{
      handleClick(tab,e){
        // Vue.set(this.key,tab.name,!this.key[tab.name]);
        // console.log(this.key)
        if(tab.name=='second'){
          this.flag ++;
        }
      }
    },
    mounted(){
    }
  }
</script>

<style scoped>

</style>
