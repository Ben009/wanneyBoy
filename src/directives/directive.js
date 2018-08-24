//全局指令
import Vue from 'vue';
import $ from 'jquery';
import Clickoutside from 'element-ui/src/utils/clickoutside';
import { on ,off} from 'element-ui/src/utils/dom';
import Popper from 'element-ui/src/utils/popper.js';
import store from '@/store'; // vuex仓库

//页面按钮权限解决方式
const has = Vue.directive('has', {
  bind: function(el, binding) {
    let buttonpermsStr=window.localStorage.getItem("btnPower");
    if(buttonpermsStr==null || buttonpermsStr==undefined) {//没有权限，所有涉及权限的按钮都不展示
      el.parentNode.removeChild(el);
    }else if(buttonpermsStr.indexOf("@"+binding.value+"@") == -1){//没有该按钮权限，隐藏按钮
      el.parentNode.removeChild(el);
    }
  }
});

const nodeList = [];
let iframeDocument = null;
let startClickIframe;
const ctx = '@@clickoutsideContext';
/**
 * 上面has是有该按钮权限，显示父组件
 * 该方法是有该按钮权限，不显示父组件，与has相反
 * @type {DirectiveOptions}
 */
const notHas = Vue.directive('notHas', {
  bind: function(el, binding) {
    let buttonpermsStr=window.localStorage.getItem("btnPower");
    if(buttonpermsStr==null || buttonpermsStr==undefined) {//没有权限，显示父组件
      // el.parentNode.removeChild(el);
    }else if(buttonpermsStr.indexOf("@"+binding.value+"@") != -1){//有该按钮权限，隐藏父组件
      try{
      el.parentNode.removeChild(el);
      }catch(e){
        $(el).hide();
      }
    }
  }
});

// 弹出框拖拽指令
const dialogToggle = Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        const dragDom = el.querySelector('.el-dialog');
        dialogHeaderEl.style.cursor = 'move';

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = window.getComputedStyle(dragDom, null);
        dialogHeaderEl.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft;
            const disY = e.clientY - dialogHeaderEl.offsetTop;

            // 获取到的值带px 正则匹配替换
            let styL, styT;

            // 移动之后赋值为px
            styL = +sty.left.replace(/\px/g, '');
            styT = +sty.top.replace(/\px/g, '');

            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离
                const l = e.clientX - disX;
                const t = e.clientY - disY;

                // 移动当前元素
                dragDom.style.left = `${l + styL}px`;
                dragDom.style.top = `${t + styT}px`;

                //将此时的位置传出去
                //binding.value({x:e.pageX,y:e.pageY})
            };

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
})

const popover = Vue.directive('mindPopover', {
  inserted: function(el, binding, vnode, oldVnodee){
    addElement(el, binding, vnode, oldVnodee)
  },
  update: function(el, binding, vnode, oldVnodee){
    addElement(el, binding, vnode, oldVnodee)
  }
});

const tooltip = Vue.directive('mindTooltip', {
  inserted: function(el, binding, vnode, oldVnodee){
    addTooltipElement(el, binding, vnode, oldVnodee)
  },
  update: function(el, binding, vnode, oldVnodee){
    addTooltipElement(el, binding, vnode, oldVnodee)
  }
});

function addTooltipElement(el, binding, vnode, oldVnodee){
  const DEFAULTCONFIG = {
    message:'提示！',
    placement:'top',
    show:true,
  }
  let config = Object.assign({},DEFAULTCONFIG,binding.value);
  el.onmouseenter = function(event){
    if(config && config.show){
      let tooltip = Vue.extend({
        methods:{
        },
        template:`<transition>
                    <div ref="popover" class="el-popover el-popper" style="z-index:99999999999;text-align: center;margin:10px -10px;">
                      <div>${config.message}</div>
                    </div>
                  </transition>`,
      })
      let instance = new tooltip().$mount();
      if(store.state.admin.id){
        document.getElementById(store.state.admin.id).appendChild(instance.$el);
      }else{
        document.body.appendChild(instance.$el);
      }
      let offsets = getOffsets(instance.$el,el,config.placement)
      let dom=instance.$el;
      dom.style.top=offsets.popper.top+'px';
      dom.style.left=offsets.popper.left+'px';
      el.onmouseleave = function(event){
        instance.$destroy(true);
        if(store.state.admin.id){
          document.getElementById(store.state.admin.id).removeChild(instance.$el);
        }else{
          document.body.removeChild(instance.$el);
        }
      }
    }else{
      return new Error('请确保指令中存在配置项！')
    }
  }
}


function getOuterSizes(element) {
  let Parent = parent ? parent : window;
    var styles = Parent.getComputedStyle(element);
    var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    var result = { width: element.offsetWidth + y, height: element.offsetHeight + x };
    return result;
}

function addElement(el, binding, vnode, oldVnodee) {
  let appId =  parent ? 'app' : store.state.admin.id,
      Document = parent ? parent.document : document;
  const DEFAULTCONFIG = {
    message:'是否删除',
    placement:'top',
    success(){
      this.handleClose()
    },
    isOpen(){
      return true
    },
    info:'',
    transition:'fade-in-linear',
    modal:true
  }
  let config = Object.assign({},DEFAULTCONFIG,binding.value);
  let modalDiv = '';
  el.onclick = function(event){
    event.preventDefault();
    if(config){
      let openSlug = new Promise(resolve => {
        resolve(config.isOpen())
      }).then(res => {
        if(res){
          if(typeof res == 'string') config.message = res;
          let popover = Vue.extend({
            data(){
              return {
                flag1:false,
                flag2:false,
                flag3:config.info,
              }
            },
            methods:{
              handleClose () {
                this.$destroy(true);
                if(config.modal) this.$el.parentNode.removeChild(modalDiv)
                this.$el.parentNode.removeChild(this.$el);
              },
              handleCancel () {
                this.handleClose()
              },
              makeSure () {
                if(typeof config.success == 'function'){
                  let temp = new Promise(resolve => {
                    resolve(config.success(this))
                  }).then(res => {
                    if(res !== true){
                      this.handleClose()
                    }
                  })
                }
              }
            },
            directives: { Clickoutside },
            template:`<transition
                        name="${config.transition}">
                        <div ref="popover" class="el-popover el-popper" v-clickoutside="handleClose" style="z-index:99999999999;text-align: center;padding: 15px 30px; margin:10px -10px;background:#eef7ff;">
                          <div class="popover_header" style="margin-bottom:10px">
                            <i class="el-icon-warning" style="color:#e6a23c;"></i>
                            <span>提示</span>
                          </div>
                          <div class="popover_body"  style="margin-bottom:10px">
                            <div class="message">${config.message}</div>
                          </div>
                          <div class="popover_footer" style="display:flex;justify-content: center;">
                            <el-button size="mini" type="primary" @click="makeSure">确定</el-button>
                            <el-button size="mini" @click="handleCancel">取消</el-button>
                          </div>
                        </div>
                      </transition>`,
          })
          let instance = new popover().$mount();
          if(config.modal){
            modalDiv = Document.createElement('div');
            modalDiv.setAttribute('style', "position: fixed;left: 0;top: 0;width: 100%;height: 100%;opacity: .5;background: #000;z-index: 999999999;");
          }
          if(appId){
            Document.getElementById(appId).appendChild(instance.$el);
            if(config.modal) Document.getElementById(appId).appendChild(modalDiv)
          }else{
            Document.body.appendChild(instance.$el);
            if(config.modal) Document.body.appendChild(modalDiv);
          }
          let offsets = getOffsets(instance.$el,el,config.placement)
          let dom=instance.$el;
          dom.style.top=offsets.popper.top+'px';
          dom.style.left=offsets.popper.left+'px';
        }  
      });

    }else{
      return new Error('请确保指令中存在配置项！')
    }
  }
}

function getOffsets(popper, reference, placement) {
    let Document = parent ? parent.document : document;
    placement = placement.split('-')[0];
    var popperOffsets = {};
    var referenceOffsets = getOffsetRectRelativeToCustomParent(reference, getOffsetParent(popper));
    var popperRect = getOuterSizes(popper);
    if (['right', 'left'].indexOf(placement) !== -1) {
        popperOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - popperRect.height / 2;
        if (placement === 'left') {
            popperOffsets.left = referenceOffsets.left - popperRect.width ;
        } else {
            popperOffsets.left = referenceOffsets.right;
        }
    } else {
        popperOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - popperRect.width / 2;
        if (placement === 'top') {
            popperOffsets.top = referenceOffsets.top - popperRect.height;
        } else {
            popperOffsets.top = referenceOffsets.bottom;
        }
    }
    popperOffsets.width   = popperRect.width;
    popperOffsets.height  = popperRect.height;

    // 如果超出了body的宽度 则重新计算left
    if((popperOffsets.left + popper.clientWidth) > Document.body.clientWidth){
      popperOffsets.left = Document.body.clientWidth - popper.clientWidth
    }

    return {
        popper: popperOffsets,
        reference: referenceOffsets
    };
}

function getOffsetRectRelativeToCustomParent(element, parent) {
    var elementRect = getBoundingClientRect(element);
    var parentRect = getBoundingClientRect(parent);
    if(window.frameElement){
      let sidebarWidth = window.parent.document.getElementsByClassName('box-left')[0].clientWidth
      elementRect.left += sidebarWidth
      elementRect.top += 96
    }
    var rect = {
        top: elementRect.top - parentRect.top ,
        left: elementRect.left - parentRect.left ,
        bottom: (elementRect.top - parentRect.top) + elementRect.height,
        right: (elementRect.left - parentRect.left) + elementRect.width,
        width: elementRect.width,
        height: elementRect.height
    };
    return rect;
}

function getBoundingClientRect(element) {
    var rect = element.getBoundingClientRect();
    var isIE = navigator.userAgent.indexOf("MSIE") != -1;
    var rectTop = isIE && element.tagName === 'HTML'
        ? -element.scrollTop
        : rect.top;
    return {
        left: rect.left,
        top: rectTop,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.right - rect.left,
        height: rect.bottom - rectTop
    };
}

function getOffsetParent(element) {
    let Document = parent ? parent.document : document;
    var offsetParent = element.offsetParent;
    return offsetParent === Document.body || !offsetParent ? Document.documentElement : offsetParent;
}

//获取焦点选中
const focus = Vue.directive('focusSelect', {
  bind: function(el, binding) {
    addEvent(el, 'focus', function(event) {
      $(el).find("input:eq(0)").select();
    });
  }
});

const focusFull = Vue.directive('focusSelectFull', {
  bind: function(el, binding) {
    setTimeout(val => {
      $(el).find("input:eq(0)").select();
    })
  }
});

function addEvent(element, event, listener) {
  if (element.addEventListener) {
    element.addEventListener(event, listener, true);
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, listener);
  } else {
    element['on' + event] = listener;
  }
}

const clickOutSide = Vue.directive('mindClickoutside', {
  bind (el, binding, vnode) {
    nodeList.push(el)
    iframeDocument = binding
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value,
      // 特殊限定范围的class，限定范围为该class的所有元素的并集
      exactArea: binding.arg
    }
  },

  update (el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].methodName = binding.expression
    el[ctx].bindingFn = binding.value
    // 附加 真正起作用部分
    el[ctx].exactArea = binding.arg
  },

  unbind (el) {
    let len = nodeList.length

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  }
});

const iframeClickOutSide = Vue.directive('mindIframeClickoutside', {
  bind (el, binding, vnode) {
    nodeList.push(el)
    iframeDocument = binding.value.document();
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode,iframeDocument),
      methodName: binding.expression,
      bindingFn: binding.value.success,
      // 特殊限定范围的class，限定范围为该class的所有元素的并集
      exactArea: binding.arg
    }
    // 鼠标按下时，记录此时事件信息
    !Vue.prototype.$isServer && on(iframeDocument, 'mousedown', iframeMouseDown)
    // 鼠标松开时候，遍历绑定clickoutside的节点，进行判断是否在节点外部以触发回调
    !Vue.prototype.$isServer && on(iframeDocument, 'mouseup', iframeMouseUp)  
  },

  update (el, binding, vnode) {
    iframeDocument = binding.value.document();
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].methodName = binding.expression
    el[ctx].bindingFn = binding.value.success
    // 附加 真正起作用部分
    el[ctx].exactArea = binding.arg
    // 鼠标按下时，记录此时事件信息
    !Vue.prototype.$isServer && on(iframeDocument, 'mousedown', iframeMouseDown)
    // 鼠标松开时候，遍历绑定clickoutside的节点，进行判断是否在节点外部以触发回调
    !Vue.prototype.$isServer && on(iframeDocument, 'mouseup', iframeMouseUp)  
  },

  unbind (el) {
    let len = nodeList.length

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[ctx]
    !Vue.prototype.$isServer && off(iframeDocument, 'mousedown', iframeMouseDown)
    !Vue.prototype.$isServer && off(iframeDocument, 'mouseup', iframeMouseUp) 
  }
});
function iframeMouseDown(e){
  startClickIframe = e
};

function iframeMouseUp(e){
  nodeList.forEach(node => node[ctx].documentHandler(e, startClickIframe))
};

let startClick
let seed = 0
// 鼠标按下时，记录此时事件信息
!Vue.prototype.$isServer && on(document, 'mousedown', e => (startClick = e))
// 鼠标松开时候，遍历绑定clickoutside的节点，进行判断是否在节点外部以触发回调
!Vue.prototype.$isServer && on(document, 'mouseup', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick))
})
// 是否在特殊限定范围内
function ifInExact (exactElms, target1, taget2) {
  for (let i = 0; i < exactElms.length; i++) {
    let elm = exactElms[i]
    if (elm.contains(target1) || elm.contains(taget2) || elm === target1) return true
  }
  return false
}

// 是否有特殊限定范围
function ifHasExact (el, exactArea,doc) {
  if (!exactArea) return false
  return doc ? Array.from(document.getElementsByClassName(exactArea)).concat(Array.from(doc.getElementsByClassName(exactArea))) : document.getElementsByClassName(exactArea)
}

function createDocumentHandler (el, binding, vnode, doc) {
  return function (mouseup = {}, mousedown = {}) {
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))) return
    let exactElms = ifHasExact(el, el[ctx].exactArea,doc)
    // 如果是有特殊限定范围的，则进行判断当前点击是否在 限定范围内
    if (exactElms) {
      if (ifInExact(exactElms, mouseup.target, mousedown.target)) {
        return
      }
    // 无特殊限定范围，则判断点击是否在默认的指令所在范围内
    } else if (el.contains(mouseup.target) || el.contains(mousedown.target) || el === mouseup.target) {
      return
    }
    if (binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]()
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn()
    }
  }
}

const divDrag = Vue.directive('divDrag', {
    bind(el, binding, vnode, oldVnode) {
      const DEFAULTCONFIG = {
        drag(){
          return 'Function is not define'
        },
      }
      let config = Object.assign({},DEFAULTCONFIG,binding.value);
      // 为的是如果出现滚动条鼠标不变化的问题
      el.style.borderRight = '2px solid #ccc'
      el.onmousemove = (e) => {
        var pagex = event.pageX || scroll().left + event.clientX,
            xx = $(el).offset().left;
        var targetx = pagex - xx;
        if((el.clientWidth - 5) < targetx){
          el.style.cursor = 'e-resize'
          el.onmousedown = (e) => {
            // 添加一个遮罩层 保证在document节点中
            let div = Vue.extend({
              template:`<div style="position:absolute;top:0px;left:0px;width:100%;height:${window.innerHeight}px;z-index:99999999999999999999999"></div>`,
            })
            let instance = new div().$mount();
            document.body.appendChild(instance.$el);
            e.stopPropagation()
            e.preventDefault()
            document.onmousemove = (e) => {
              e.stopPropagation()
              e.preventDefault()
              config.drag()
              var pagexx = e.pageX || scroll().left + e.clientX;
              var xxx = $(el).offset().left;
              el.style.cursor = 'e-resize'
              $(el).width(pagexx - xxx)
            };
            document.onmouseup = (e) =>{
              document.body.removeChild(instance.$el);
              document.onmousemove = null;
              document.onmouseup = null;
              el.onmousedown = null;
            }
          }
        }else{
          el.onmousedown = null;
          el.style.cursor = 'default'
        }
      }
    }
})

function scroll() {  
  if(window.pageYOffset != null) {
      return {
          left: window.pageXOffset,
          top: window.pageYOffset
      }
  }
  else if(document.compatMode === "CSS1Compat") {
      return {
          left: document.documentElement.scrollLeft,
          top: document.documentElement.scrollTop
      }
  }
  return { 
      left: document.body.scrollLeft,
      top: document.body.scrollTop
  }
}

export {has,notHas,dialogToggle,popover,tooltip,focus,focusFull,clickOutSide,iframeClickOutSide,divDrag};



