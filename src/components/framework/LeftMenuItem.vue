<template>
	<div class="menu-wrapper" :class="!!isCollapse ? 'hideSilder': ''">
	    <div v-for="(item,index) in routes" :key="index" v-if="!item.hidden&&item.children">
	      <a v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" @click="moveToViews(item.path+'/'+item.children[0].path)"
	        :key="item.children[0].name">
	        <el-menu-item :index="item.children[0].meta.activeSlug">
	          <i v-if="item.children[0].meta&&item.children[0].meta.icon" :class="item.children[0].meta.icon"></i>
	          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
	        </el-menu-item>
	      </a>
	      <el-submenu v-else :index="item.children[0].meta.activeSlug" :key="item.name">
	        <template slot="title">
	          <i v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></i>
	          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
	        </template>

	        <div v-for="(child,index) in item.children" :key="index" v-if="!child.hidden">
	          <left-menu-item class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></left-menu-item>

	          <a v-else @click="moveToViews(item.path+'/'+child.path)" :key="child.name">
	            <el-menu-item :index="child.meta.activeSlug">
	              <i v-if="child.meta&&child.meta.icon" :class="child.meta.icon"></i>
	              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
	            </el-menu-item>
	          </a>
	        </div>
	      </el-submenu>

	    </div>
  </div>
</template>
<script type="text/javascript">
	import Vue from 'vue';
	import leftMenuItem from './LeftMenuItem'
	import Cookies from 'js-cookie';

/* 	import {Menu, MenuItem, Submenu} from 'element--ui';
	Vue.use(Menu);
	Vue.use(MenuItem);
	Vue.use(Submenu); */

	export default {
		name: 'leftMenuItem',
		data() {
	      return {

	      }
	    },
		props: {
		    routes: {
		      	type: Array
		    },
		},
		methods: {

	      hasOneShowingChildren(children) {
	      	let temp = 0;
	      	  if(children && children.length == 1){
	      	  	for(let key in children){
	      	  		if(children[key].notFirst){
	      	  			return
	      	  		}
	      	  		if( !children[key].hidden ) {
		      	  		temp++
		      	  	}
	      	  	}
	      	  }
		      if (temp == 1) {
		        return true
		      }
		      return false
		    },
		    moveToViews(path){
	    		this.$router.push(path)
	    	},
	    },
	    computed:{
	      isCollapse(){
	        return this.$store.state.admin.sidebarSlug
	      }
	    },
	    components:{
	    	leftMenuItem
		},
		mounted(){
		},
		watch:{
			//isToggle(newval,oldval){
				//console.log("watch-isToggle",newval);
			//}
		}
	}
</script>
<style scoped>
	.menu-wrapper{
		height: 100%;
		width: 100%;
		overflow-y: auto;
	}
	::-webkit-scrollbar {
		  display: none;
			/*
			width: 2px;
			height: 8px;
			background-color: #F5F5F5;
			*/
	}
</style>

