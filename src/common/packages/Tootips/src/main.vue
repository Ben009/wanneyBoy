<template>
		<div class="ming-global-tootips" @mouseenter="initPos" @mouseleave="displayBox=false">
			<span ref="pos-icon" class="posIcon el-icon-info" ></span>
			<div ref="pos-content" class="posContent" v-show="displayBox" :style="{width:width+'px'}">
				<div class="title">{{title}}</div>
				<div class="content">
					<slot></slot>
				</div>
			</div>
		</div>
</template>
<script type="text/javascript">
	import Vue from 'vue'  
	export default {
		name: 'GlobalTootips',
		data(){
			return {
				displayBox:false,
			}
		},
		props:{
			title:{
				default : '事项说明'
			},
			placement:{
				default : 'bottom-end'
			},
			width:{
				type: Number,
				default : 350
			}
		},
		methods:{
			initPos(){
				this.displayBox = true
				setTimeout(val => {
					let popperPos = this.getOffsets(this.$refs['pos-content'],this.$refs['pos-icon'],this.placement).popper
					this.$refs['pos-content'].style.left = popperPos.left + 'px'
					this.$refs['pos-content'].style.top = popperPos.top + 'px'
				},0)
			},
			getOuterSizes(element) {
			    var styles = window.getComputedStyle(element);
			    var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
			    var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
			    var result = { width: element.offsetWidth + y, height: element.offsetHeight + x };
			    return result;
			},
			getOffsets(popper, reference, placement) {
					var shiftVariation = placement.split('-')[1];
			    var basePlacement = placement.split('-')[0];
			    var popperOffsets = {};
			    var referenceOffsets = this.getOffsetRectRelativeToCustomParent(reference, this.getOffsetParent(popper));
			    var popperRect = this.getOuterSizes(popper);
			    if (['right', 'left'].indexOf(basePlacement) !== -1) {
			        popperOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - popperRect.height / 2;
			        if (basePlacement === 'left') {
			            popperOffsets.left = referenceOffsets.left - popperRect.width;
			        } else {
			            popperOffsets.left = referenceOffsets.right;
			        }
			    } else {
			        popperOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - popperRect.width / 2;
			        if (basePlacement === 'top') {
			            popperOffsets.top = referenceOffsets.top - popperRect.height;
			        } else {
			            popperOffsets.top = referenceOffsets.bottom;
			        }
			    }
			    popperOffsets.width   = popperRect.width;
			    popperOffsets.height  = popperRect.height;

	        if (shiftVariation) {
	            var reference = referenceOffsets;
	            var popper = popperRect;

	            var shiftOffsets = {
	                y: {
	                    start:  { top: reference.top },
	                    end:    { top: reference.top + reference.height - popper.height }
	                },
	                x: {
	                    start:  { left: reference.left },
	                    end:    { left: reference.left + reference.width - popper.width }
	                } 
	            };

	            var axis = ['bottom', 'top'].indexOf(basePlacement) !== -1 ? 'x' : 'y';
	            popperOffsets = Object.assign(popperOffsets, shiftOffsets[axis][shiftVariation]);
	        }
			    return {
			        popper: popperOffsets,
			        reference: referenceOffsets
			    };
			},
			getOffsetRectRelativeToCustomParent(element, parent) {
			    var elementRect = this.getBoundingClientRect(element);
			    var parentRect = this.getBoundingClientRect(parent);
			    var rect = {
			        top: elementRect.top - parentRect.top ,
			        left: elementRect.left - parentRect.left ,
			        bottom: (elementRect.top - parentRect.top) + elementRect.height,
			        right: (elementRect.left - parentRect.left) + elementRect.width,
			        width: elementRect.width,
			        height: elementRect.height
			    };
			    return rect;
			},
			getBoundingClientRect(element) {
			    var rect = element.getBoundingClientRect();
			    var isIE = navigator.userAgent.indexOf("MSIE") != -1;
			    var rectTop = rect.top;
			    return {
			        left: rect.left,
			        top: rectTop,
			        right: rect.right,
			        bottom: rect.bottom,
			        width: rect.right - rect.left,
			        height: rect.bottom - rectTop
			    };
			},
			getOffsetParent(element) {
			    var offsetParent = element.offsetParent;
			    return offsetParent === window.document.body || !offsetParent ? window.document.documentElement : offsetParent;
			}
		}
	}
</script>
<style lang="scss">
	.ming-global-tootips{
		display:inline-block;
		.posIcon{
			border: none;
			color:#56BC4E;
			font-size:16px;
			cursor: pointer;
		}
    .posIcon::after{
      content: "";
      position: absolute;
      z-index: 999;
    }
    .posContent{
    	padding:5px;
    	position:absolute;
    	border:1px solid #ccc;
    	z-index: 99999999999;
    	background: #ffffff;
      font-size: 14px;
      opacity: 50;
      box-shadow: 1px 7px 33px -9px #969696;
      border: 1px solid #56bc4e8c;
      border-radius: 5px;
      color: dimgrey;
    }
    .title{
			text-align: center;
	    font-size: 15px;
	    font-weight: bold;
	    padding: 7px 0px;
	    color: black;
	    border-bottom: 1px solid #ccc;
    }
    .content{
			padding:8px;
    }
	}
</style>