<template>
  <div class="box">
    <div class="box-top" >
      <TopMenu />
    </div>
    <div class="box-left" style="width:200px;top:60px;">
      <LeftMenu :menu="leftMenu" @openNewTab="openNewTab"/>
    </div>
    <div class="box-right" style="left:200px;top:60px;">
      <Tabs ref="tab" @closePanel="handleClosePanel"/>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue';
  import TopMenu from './TopMenu';
  import LeftMenu from './LeftMenu';
  import Tabs from './Tabs';

  let tabIndex=0;
  const map={//key是菜单项的id，import的参数是要加载的模块
    '1':() => import('../Layout.vue'),
//    '2':() => import('../parameter/ParameterTableTemplate.vue'),
    '3':() => import('../Layout.vue'),
    '4':() => import('../Layout.vue'),
    '5':() => import('../Layout.vue'),
    '6':() => import('../Layout.vue'),
    '7':() => import('../Layout.vue'),
  };
  let exist={ //key是菜单项的id，value是打开的tab的name

  };
  export default {
    name: "framework",
    components:{ TopMenu, LeftMenu, Tabs },
    data(){
      return {
        leftMenu:[
          {
            id:1,
            name:'菜单1',
            children:[
              {
                id:3,
                name:'菜单1-1'
              },
              {
                id:4,
                name:'菜单1-2',
                children:[
                  {
                    id:5,
                    name:'菜单1-2-1'
                  }
                ]
              }
            ]
          },
          {
            id:2,
            name:'菜单2'
          }
        ]
      }
    },
    methods:{
      openNewTab(index){
      /*index就是菜单的id，然后需要自己搜索到菜单的数据，panel变量的title需要修改*/
      if(exist[index]){
        this.$refs.tab.editableTabsValue=exist[index];
      }
      else{
        map[index]().then((res) => {
          let panel={
            title:'eeee',
            name:(tabIndex++) + '',
            content:Vue.extend(res.default)
          };
          this.$refs.tab.handleTabsAdd(panel);
          exist[index]=panel.name;
        });

      }
    },
    handleClosePanel(name){
      for(let i in exist){
        if(exist[i]===name){
          delete exist[i];
        }
      }
    }
  }
  }
</script>

<style scoped>

</style>
