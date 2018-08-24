<template>
  <div class="menu">
    <div ref="menu" class="menu-container" >
      <ul  class="menu-main">
        <li v-for="module in leftMenu"  :key="module.id"  @click=changeMenu(module) class="menu-item" :class="active==module.id ? 'active': ''" >
          <p v-if="module.icon!=null"><i  :class="module.icon" :title="module.title" ></i></p>
          <p v-else title="使用图标">{{module.title}}</p>
        </li>
      </ul>
    </div>
    <i class="el-icon-cl-arrow-left left-btn" @click="move(-120)"></i>
    <i class="el-icon-cl-arrow-right right-btn" @click="move(120)"></i>
  </div>
</template>

<script>
  import Vue from 'vue';
  import $ from 'jquery';
  import Cookies from 'js-cookie';
  import {ajaxRequest, formatArrayToTree} from '../util/base';

/*   import {Button} from 'element--ui';
  Vue.use(Button); */

  export default {
    name: "top-menu",
    data() {
      return {
        current: 0,
        modules:[],
        scroll:0,
      }
    },
    computed:{
      active(){
        return this.$store.state.admin.active
      },
      leftMenu(){
        return this.$store.state.admin.leftMenu
      }, 
    },
    watch:{
      innerWidth(v){//监控该值实现窗口变化触发
        this.loadArrow();
      }
    },
    methods:{
      move(value){
        //debugger;
        //console.log(value);
        //console.log("scrollLeft",this.$refs.menu.scrollLeft);
        //console.log("scrollWidth",this.$refs.menu.scrollWidth);
        //console.log("clientWidth",this.$refs.menu.clientWidth);
        this.$refs.menu.scrollLeft = this.$refs.menu.scrollLeft + value;
      },
      changeMenu(module){
        /** 调用父级模块相应的方法 <TopMenu @changMenuEvent="父级方法名"> */
        this.$store.dispatch('setActive',module.id)
        this.$emit('changMenuEvent', module.id);
      },
      loadArrow(){
        if(this.$refs.menu.scrollWidth < (this.$refs.menu.clientWidth +20)){
          $(".left-btn").hide();
          $(".right-btn").hide();
        }else{
          $(".left-btn").show();
          $(".right-btn").show();
        }
      }
    },
    mounted(){
      // this.active = sessionStorage.getItem('topMenuId')
      this.$store.dispatch('setActive',sessionStorage.getItem('topMenuId'))
      //debugger;
      //动态显示 主菜单左右移动按钮
      this.loadArrow();
    },

  }
</script>

<style scoped>
  .menu {
    position: relative;
    width: 100%;
    height:60px;
    /*padding-left: 25px;
    padding-right: 25px;*/
    margin-left: -28px;

  }

  .left-btn {
    position:absolute;
    top:0;
    left:-25px;
    line-height:60px;
    cursor:pointer;
    background:grey;
  }
  .right-btn{
    position:absolute;
    top:0;
    right:-25px;
    line-height:60px;
    cursor: pointer;
    background:grey;
  }
  .menu-container{
    position:relative;
    width:100%;
    height:100%;
    overflow: hidden;
  }
  .menu-main{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin-right:-17px;
    margin-bottom:0px;
    /*overflow: scroll;*/
    white-space: nowrap;
    font-size:0;
  }
  .menu-item{
    cursor: pointer;
    display: inline-block;
    margin-left: 10px;
    width:60px;
    height:100%;
    text-align:center;
    background:#b3c0d1;
    font-size:15px;
  }
  .menu-item p i{
    line-height:40px;
    font-size:40px;
    vertical-align: middle;
  }


  .active>p{
    background: #3094e0;
    padding:10px 0px;
  }
  .active{

  };

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
    display: none;
    /*width: 2px;
    height: 8px;
    background-color: #F5F5F5;*/
}

</style>
