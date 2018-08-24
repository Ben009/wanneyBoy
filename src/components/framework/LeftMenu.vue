<template>
<div style="">
  <div style=" text-align: center; padding: 5px 0 0 0; " @click.prevent.stop="toggleSideBar" >
			<i class="el-icon-align-left" title="隐藏菜单" v-show="!isCollapse" ></i>
			<i class="el-icon-align-right" title="展开菜单" v-show="isCollapse" ></i>
		</div>
  <el-menu
      mode="vertical"
      :hide-timeout="200"
      :collapse="!!isCollapse"
      :default-active="$route.meta.activeSlug"
      router 
      >
      <left-menu-item :routes="menu"></left-menu-item>
  </el-menu>
</div>
</template>
<script>
  import Vue from 'vue';
  import leftMenuItem from './LeftMenuItem'

  export default {
    name: "left-menu",
    props: {
      /** <LeftMenu :menu="父级对象" > */
      menu: {required: true}
    },
    methods:{
      toggleSideBar(){
						this.$store.dispatch('toggleSideBar',!this.isCollapse)
	    	},
    },
    computed:{
      isCollapse(){
        return this.$store.state.admin.sidebarSlug
      }
    },
    components:{
      leftMenuItem
    }
  }
</script>

<style scoped>
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸
::-webkit-scrollbar  
{  
    width: 2px;  
    height: 8px;  
    background-color: #F5F5F5;  
}  
  */  
/*定义滚动条轨道 内阴影+圆角
::-webkit-scrollbar-track  
{  
    -webkit-box-shadow: inset 0 0 6px #9E9E9E;  
    border-radius: 10px;  
    background-color: #F5F5F5;  
}  
*/  
/*定义滑块 内阴影+圆角
::-webkit-scrollbar-thumb  
{  
    border-radius:5px;  
    -webkit-box-shadow: inset 0 0 6px #9E9E9E;  
    background-color: #BFBFBF;  
}  */  

</style>
