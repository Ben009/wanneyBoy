<template>
	<el-tree :data="treeData" 
			 @node-contextmenu="handleRightClick" 
			 @node-click="handleLeftClick"
			 :default-expand-all='true'></el-tree>
</template>
<script type="text/javascript">
	import Vue from 'vue'     
	import Clickoutside from '@/common-el/src/utils/clickoutside';

	export default {
		name: 'mindTree',
		data(){
			return {
				treeData: [],
			}
		},
		props: {
			// 传入的List数据
			data:{
				type:Array,
				require:true
			},
			// 左侧菜单栏需要的数据配置
			rightMenuConfig:{
				type:Array
			},
			leftClickCallBack:{
				type:Function
			}
		},
		methods: {
			/**
			 * [formatArrayToTree 把后台传入的List格式数据转换为Tree需要的Array数据]
			 * @param  {[type]} data [ 后台List数据格式 example ：[
					{code:'1',remark:'参数1',pcode:'0',premark:''},
					{code:'2',remark:'参数2',pcode:'0',premark:''}
				] ]
			 * @return {[type]}      [tree需要的数据格式 example ：[{
					label:'参数1',
					children:[{
						label:'参数8',
						children:[{
							lable:'参数14'
						}]
					}]
				}] ]
			 */
			formatArrayToTree(data){
				data.forEach(val => {
					if(val.pcode === '0'){
						this.treeData.push({
							label:val.remark,
							id:val.code
						})
					}
				})
				this.treeData.forEach(temp => {
					temp['children'] = this.getChildren(temp.id,data)
				})
				return  this.treeData;
			},

			/**
			 * [getChildren 递归给Tree数据添加children]
			 * @param  {[type]} id   [父级对应的id]
			 * @param  {[type]} data [后台List数据格式]
			 * @return {[type]}      [每一条数据对应的子节点]
			 */
			getChildren(id,data){
				let childList = [];
				data.forEach(val => {
					if(val.pcode !== '0'){
						if (val.pcode === id) {
							childList.push({
								id:val.code,
								label:val.remark
							})
		                }
					}
				})
				childList.forEach(temp => {
					temp['children'] = this.getChildren(temp.id,data)
				})
		        if (childList.length === 0) {
		            return null;
		        }
		        return childList;
			},
			/**
			 * [handleRightClick 处理右击事件]
			 * @param  {[type]} event [event]
			 * @param  {[type]} obj   [传递给 data 属性的数组中该节点所对应的对象]
			 * @param  {[type]} node  [节点对应的 Node]
			 * @param  {[type]} ele   [节点组件本身]
			 * @return {[type]}       [description]
			 */
			handleRightClick(event,obj,node,ele){
				let ops=this.rightMenuConfig;
		        if(ops){
		        	let RightClickMenu = Vue.extend({
			        data(){
			            return {
			              ops:ops
			            }
			        },
			        methods: {
			            handleClose () {
			              this.$destroy(true);
			              this.$el.parentNode.removeChild(this.$el);
			            },
			            handleRightClickOperation (fun) {
			              fun(obj,node,ele)
			            }
			        },
			        directives: { Clickoutside },
			        template:
			          '<ul class="right-click-menu" v-clickoutside="handleClose">' +
			          '<li v-for="v in ops" @click="handleRightClickOperation(v.callback)">{{v.name}}</li>' +
			          '</ul>'
			        });
			        // 手动挂载RightClickMenu组件
			        let instance = new RightClickMenu().$mount();
			        // 向dom中添加RightClickMenu组件
			        document.body.appendChild(instance.$el);
			        let dom=instance.$el;
			        dom.style.top=event.clientY+'px';
			        dom.style.left=event.clientX+'px';
		        }
			},
			handleLeftClick(obj,node,ele){
				this.leftClickCallBack(obj,node,ele)
			}
		},
		watch:{
			data(){
				this.formatArrayToTree(this.data)
			}
		}
	}
</script>