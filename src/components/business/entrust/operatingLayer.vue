<template>
	<div class="operatingLayer" v-loading="operatingLayerLoading" element-loading-spinner="el-icon-loading">
		<div class="title-item mb20"><span>操作痕迹</span></div>
		<el-collapse v-if="operatingList.length" v-model="currentActive" accordion style="min-height:300px">
		  <el-collapse-item v-for="(item,index) in operatingList" :name="index">
		  	<template slot="title">
		     <span class="operationType fontOverFlow">{{item.operationType}}</span>
		     <span class="operatorName fontOverFlow">{{item.operationType}}人员:{{item.operatorName}}</span>
		     <span class="fontOverFlow">{{item.operationType}}时间:{{item.operatingTime}}</span>
		    </template>
		    <div class="operatingContent flex" v-loading="operatingContentLoading" element-loading-spinner="el-icon-loading">
					<div class="oldInfo">
						<div class="oldInfo_title"><span>操作信息</span></div>
						<div style="max-height: 200px;overflow: auto;" :id="'id'+index">
							<div>11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
						</div>
					</div>
					<div class="newInfo">
						<div class="newInfo_title"><span>最新信息</span></div>
						<div style="max-height: 200px;overflow: auto;" :id="'newId'+index">
							<div>11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
							<div>1</div>
						</div>
					</div>
		    </div>
		  </el-collapse-item>
		</el-collapse>
		<div v-else class="noInfo">暂无有关该登记号的操作</div>
		<footer class="flex footer">
			<el-button type="primary" @click="goBack">返回</el-button>
		</footer>
	</div>
</template>
<script type="text/javascript">
	import $ from 'jquery'
	export default {
		name: 'applyByRegistration',
		data(){
			return {
				operatingList: [], // 操作痕迹列表
				currentActive: 0, // 当前激活展示项 默认展开第一个
				oldCurrentActive: 0,
				operatingLayerLoading: true, // 主体部分loading加载
				operatingContentLoading:true, // 详情部分的loading加载
			}
		},
		props:{
			registrationNo:{
				type:Number,
				require:true
			}
		},
		watch:{
			// 监听激活项改变时触发请求详情的操作
			currentActive(value,oldValue){
				console.log(value,oldValue)
				if(typeof value == 'number'){
					this.getOperatingDetail(value,oldValue)
				}
			}
		},
		methods:{
			/**
			 * [goBack 返回行为]
			 * @return {[type]} [description]
			 */
			goBack(){
				this.$emit('visable')
			},
			/**
			 * [getOperatingDetail 获取操作的详情信息]
			 * @param  {[type]} value [当前激活的展示项的index]
			 * @return {[type]}       [description]
			 */
			getOperatingDetail(value,oldValue){
				this.bindScrollEvent(oldValue)
				this.operatingContentLoading = true
				setTimeout(()=>{
					this.operatingContentLoading = false
				},1000)
				console.log(value,'-------------value-----------')
			},
			/**
			 * [scrollEvent 左侧的滚动事件绑定，控制右边滚动]
			 * @return {[type]} [description]
			 */
			scrollEvent(){
				$('#newId'+this.currentActive).scrollTop($('#id'+this.currentActive).scrollTop())
				$('#newId'+this.currentActive).scrollLeft($('#id'+this.currentActive).scrollLeft())
			},
			/**
			 * [newScrollEvent 右侧的滚动事件绑定，控制左侧滚动]
			 * @return {[type]} [description]
			 */
			newScrollEvent(){
				$('#id'+this.currentActive).scrollTop($('#newId'+this.currentActive).scrollTop())
				$('#id'+this.currentActive).scrollLeft($('#newId'+this.currentActive).scrollLeft())
			},
			/**
			 * [bindScrollEvent 绑定滚动事件]
			 * @return {[type]} [description]
			 */
			bindScrollEvent(){
				// 去掉上一个元素的事件绑定
				if(typeof oldValue == 'number'){
					this.$nextTick(val => {
						let scrollDiv = document.getElementById('id'+oldValue),
								newScrollDiv = document.getElementById('newId'+oldValue);
						scrollDiv.removeEventListener('scroll',this.throttle(this.scrollEvent,20),false)
						newScrollDiv.removeEventListener('scroll',this.throttle(this.newScrollEvent,20),false)
					})
				}
				// 绑定滚动事件
				this.$nextTick(val => {
					let scrollDiv = document.getElementById('id'+this.currentActive),
							newScrollDiv = document.getElementById('newId'+this.currentActive);
					scrollDiv.addEventListener('scroll',this.throttle(this.scrollEvent,20),false)
					newScrollDiv.addEventListener('scroll',this.throttle(this.newScrollEvent,20),false)
				})
			},
			/**
			 * [throttle 节流操作，处理过于频繁的事件触发]
			 * @param  {Function} fn      [需要节流的函数]
			 * @param  {[type]}   delay   [延迟时间]
			 * @param  {[type]}   mustRun [description]
			 * @return {[type]}           [description]
			 */
			throttle(fn, delay, mustRun) {
		    var startTime = +new Date();
		    var timeout = null;
		    return function () {
	        var context = this;
	        var args = Array.prototype.slice.call(arguments);
	        var curTime = +new Date();
	        var later = function() {
	            fn.apply(context, args);
	        };
	        clearTimeout(timeout);
	        if (curTime - startTime >= mustRun) {
	            fn.apply(context, args);
	            startTime = curTime;
	        } else {
	            timeout = setTimeout(later, delay);
	        }
		    }
			},
			/******************************************** 初始化操作 start **************************************/
			/**
			 * [getTableList 查询出所有的异常流程]
			 * @return {[type]} [description]
			 */
			getOperatingList(){
				return new Promise((resolve,reject) => {
					this.$store.dispatch('getOperatingList',{registrationNo:this.registrationNo}).then(res => {
						this.operatingList = res
						this.operatingLayerLoading = false
						resolve()
					}).catch(rej => {
						this.$message.error('接口错误')
						this.operatingLayerLoading = false
						reject()
					})
				})
			},
			// 异步编程管理
      async asyncInitFunction(){
        await this.getOperatingList()
        await this.getOperatingDetail(this.currentActive)
      },
      /******************************************** 初始化操作 end **************************************/
		},
		mounted(){
			this.asyncInitFunction()
		}
	}
</script>
<style lang="scss">
	.operatingLayer{
		@each $i in 10,20,30,40,50 {
	    .ml#{$i} {
	      margin-left:#{$i}px;
	    }
		}
		.oldInfo{
			width:50%;
			padding:10px;
			border-right: 1px dashed #ccc;
			.oldInfo_title{
				padding: 5px 0;
    		border-bottom: 1px #c9c9c9 solid;
    		span{
    			border-left:2px solid #14a7fb;
    			padding-left:5px;
    		}
			}
		}
		.newInfo{
			width:50%;
			padding:10px;
			.newInfo_title{
				padding: 5px 0;
    		border-bottom: 1px #c9c9c9 solid;
    		span{
    			border-left:2px solid #14a7fb;
    			padding-left:5px;
    		}
			}
		}
		.operatingContent{
			min-height: 250px;
			background:#fbfbfb;
			border:1px solid #ccc;
		}
		.noInfo{
			min-height: 300px;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    color: #999;
		}
		.operationType{
			min-width:150px;
		}
		.fontOverFlow{
			overflow: hidden;
			display:inline-block;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.operatorName{
			min-width:300px;
			display:inline-block;
		}
		.el-collapse-item__arrow{
			line-height: 48px!important;
			float:left!important;
		}
		.footer{
			justify-content: center;
    	margin: 10px 0px;
		}
	}
</style>