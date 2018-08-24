<template>
	<div class="tab">
		<el-tabs ref="tabs" v-model="modelPath" type="card" closable @tab-click="moveToViews" @tab-remove="closeSelectedTag" >
		  <el-tab-pane
		    :key="item.path"
		    :name="item.path"
		    v-for="item in Array.from(visitedViews) "
		    :label="item.title"
		  >
		  </el-tab-pane>
		</el-tabs>
		<ul class='menu' v-show="visible" :style="{left:left+'px',top:top+'px'}" v-clickoutside="handleClose">
				<li v-if="showRefrence" @click="refrenceTag(tabIndex)">刷新页面</li>
	      <li @click="closeSelectedTag(tabIndex)">关闭页面</li>
	      <li @click="closeOthersTags(tabIndex)">关闭其他页面</li>
	    </ul>
	</div>
</template>
<script type="text/javascript">
    import Vue from 'vue'
	import $ from 'jquery'
	import Cookies from 'js-cookie';
	import Clickoutside from '@/common-el/src/utils/clickoutside';
	export default {
		data() {
	      return {
	      	modelPath:'',
	      	tabIndex:'',
	      	visible:false,
	      	selectedTag:'',
	      	left:'',
	      	top:'',
	      	isToggle:false,
	      	showRefrence:false,
	      }
	    },
	    computed: {
		    visitedViews() {
		      return this.$store.state.tagViews.visitedViews
		    },
		    cachedViews() {
		    	return this.$store.state.tagViews.cachedViews
		    },
		    isCollapse(){
          return this.$store.state.admin.sidebarSlug
        },
		},
		watch: {
		    $route() {
		      this.modelPath = this.$route.path
		      this.addViewTags()
		    },
		},
	    methods: {
	    	refrenceTag(view){
	    		let route = null
		      if(this.visitedViews && this.visitedViews.length){
		      	this.visitedViews.forEach(val => {
		      		if(val.path == view){
		      			route={
		      				path:view,
		      				name:val.compName,
		      				id:val.id,
		      			}
		      		}
		      	})
		      }
	    		this.$store.commit('DELETE_CACHEDVIEWS',route);
	    		this.$store.commit('REFRENCETAG',false);
	    		if($(`.tbs_info .iframeClass.${route.id}`).length){
	    			setTimeout(val => {
	    				try{
	    					if($('#'+route.id)[0].contentWindow.globalEvents){
		              let tempEvents = $('#'+route.id)[0].contentWindow.globalEvents;
		              tempEvents['_destroyed'](tempEvents['_this'])
		            }
	    				}catch(e){
	    				}finally{
	    					$($(`.tbs_info .iframeClass.${route.id}`)[0]).remove()
	    				}        
	          },0)
	    		}
	    		this.visible=false
	    		setTimeout(val => {
	    			this.$store.commit('REFRENCETAG',true);
	    			this.$store.commit('ADD_CACHEDVIEWS',route);
	    		},100)
	    	},
	    	moveToViews(path){
	    		if(path === '/'){
	    			this.$router.push(path)
	    			this.$store.dispatch('handleRoutes',{mPid:process.env.INDEX_ID})
	    			sessionStorage.setItem('topMenuId', process.env.INDEX_ID)
	    			this.$store.state.admin.active = process.env.INDEX_ID
	    			return
	    		}
	    		let tempPath = typeof path === 'string' ? path : path.name
	    		this.$router.push(tempPath)
	    		// let currentRoute = this.$router.currentRoute
	    		// let tempArrayObj = JSON.parse(sessionStorage.getItem('titleArrayObj'));
	    		// let tempArray = tempArrayObj['nameArray'];
	    		// for(let key=0 ; key < tempArray.length; key++){
	    		// 	if(tempArray[key].name === currentRoute.name || currentRoute.path.substring(currentRoute.path.lastIndexOf('/')+1,currentRoute.path.length) == tempArray[key].name){
	    		// 		this.$store.state.admin.routers = Array.from(this.$store.state.admin['routers-'+tempArray[key].id])
	    		// 		this.$router.addRoutes(this.$store.state.admin.routers)
	    		// 		this.$store.state.admin.active = tempArray[key].id	    				
	    		// 		sessionStorage.setItem('topMenuId', tempArray[key].id)
	    		// 	}
	    		// }
	    	},
	    	isActive(route) {
		      return route === this.$route.path
		    },
	    	generateRoute() {
		      if (this.$route.name) {
		        return this.$route
		      }
		      return false
		    },
		    handleClose(){
		    	this.visible=false
		    },
	    	addViewTags() {
		      const route = this.generateRoute()
		      if (!route) {
		        return false
		      }
		      if(route.meta.hidden){
		      	return
		      }
		      this.$store.dispatch('addVisitedViews', route)
		    },
		    closeOthersTags() {
		    	let route = null
		      if(this.visitedViews && this.visitedViews.length){
		      	this.visitedViews.forEach(val => {
		      		if(val.path == this.tabIndex){
		      			route={
		      				path:this.tabIndex,
		      				name:val.compName,
		      				id:val.id,
		      			}
		      		}
		      	})
		      }
		      this.$store.dispatch('delOthersViews', route).then(res => {
		      	this.visible=false
		      	this.moveToViews(this.tabIndex)
		      	let _this = this;
		      	if($(`.tbs_info .iframeClass`).length){
		      		$(`.tbs_info .iframeClass`).each(function(index,val) {
			      		if(this.id !== route.id){
			      			setTimeout(val => {
			      				try{
			      					if($('#'+this.id)[0].contentWindow.globalEvents){
				                let tempEvents = $('#'+this.id)[0].contentWindow.globalEvents;
				                tempEvents['_destroyed'](tempEvents['_this'])
				              }
			      				}catch(e){
		    						}finally{
			      					$($(`.tbs_info .iframeClass.${this.id}`)[0]).remove()
			      				}
			            },0)
			      		}
	            })
		      	}
		      })
		    },
		    closeSelectedTag(view) {
		      let route = null
		      if(this.visitedViews && this.visitedViews.length){
		      	this.visitedViews.forEach(val => {
		      		if(val.path == view){
		      			route={
		      				path:view,
		      				name:val.compName,
		      				id:val.id,
		      			}
		      		}
		      	})
		      }
		      this.$store.dispatch('delVisitedViews', route).then((views) => {
		      	this.visible=false
		        if (this.isActive(view)) {
		          const latestView = views.slice(-1)[0]
		          if (latestView) {
		            this.moveToViews(latestView.path)
		          } else {
		            this.moveToViews('/')
		          }
		        }
	        	setTimeout(val => {
	        		try{
	        			if($('#'+route.id)[0].contentWindow.globalEvents){
	                let tempEvents = $('#'+route.id)[0].contentWindow.globalEvents;
	                tempEvents['_destroyed'](tempEvents['_this'])
	              }
	        		}catch(e){
	    				}finally{
	        			$($(`.tbs_info .iframeClass.${route.id}`)[0]).remove()
	        		}
            },0)
		      })
		    },
		    handleRightClick() {
		      const _this = this;
		      $('.tab').on("contextmenu",'.el-tabs__header .el-tabs__nav>div',function(event){
		        _this.tabIndex=this.getAttribute('id').split('-')[1];
		        _this.showRefrence=_this.modelPath == _this.tabIndex ? true : false;
		        _this.visible = true
				    _this.left = !!_this.isCollapse ? event.clientX-64 : event.clientX-200
				    _this.top = event.clientY-60
				    return false
		      });
		    }
	    },
	    directives: { Clickoutside },
	    mounted() {
	      this.modelPath = this.$route.path
		  	this.addViewTags()
	      this.handleRightClick()
			},
	}
</script>

<style scoped>
  .pane_inner{
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    overflow-y: auto;
  }
	.tab{
		position: absolute;
    right: 0px;
    left: 0px;
	}
  .tab .el-tabs .el-tabs__content{
    position: absolute;
    top: 75px;
    bottom: 0;
    left: 19px;
    right: 0;
  }
 .tab .el-tab-pane{
    height:100%;
  }
  .tab ul.menu{
    width: 115px;
    padding: 3px 0px;
    /*border: 2px #409EFF solid;*/
    position: absolute;
    background: #fff;
    z-index: 10;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    box-shadow: 3px 3px 5px #888888;
  }
  .tab ul.menu li{
    height:25px;
    /*line-height:20px;*/
    padding: 5px 10px;
    font-size:12px;
    color:#333;
    cursor: pointer;
  }
  .tab ul.menu li:hover{
    background:#eee;
  }
</style>