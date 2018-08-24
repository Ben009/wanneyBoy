<template>
  <transition name="dialog-fade">
    <div class="el-dialog__wrapper" v-show="visible" @click.self="handleWrapperClick">
      <div
        class="el-dialog"
        :class="[{ 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        ref="dialog"
        :close-on-click-modal="clickModal"
        :style="style">
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button type="button"
            class="other-code"
            style="margin-reight:100px;"
            v-if="otherCode" >
            <!-- 特殊字符 -->
            <span style="position:relative;">
              <i  class="el-icon-other-code" @mouseenter="enter" @mouseleave="leave" style="font-size:45px;" >
                <div class="fontBoxes"  v-show="displayBox" @mouseleave="leaveSpan" @mouseenter="enterSpan">
                  <div>
                      <span class="fontBiao but editorClass" @click="changeFont(1)">上标</span>
                      <span class="fontBiao but editorClass" @click="changeFont(2)">下标</span>
                      <span class="fontBiao but editorClass" @click="changeFont(3)">换行</span>
                      <span class="fontBiao but editorClass" @click="changeFont(4)">斜体</span>
                  </div>
                     <p style="font-size:14px;padding:15px 0px;">通用特殊字符</p>
                  <div style="overflow: auto;max-height:93px;">
                    <!-- <el-scrollbar style="height:100%"> -->
                    <span  v-for="(myFont,index) in currencyFonts" :key="index" class="fontBox but editorClass commonFont" @click="copyMe($event)">{{myFont.myFont}}</span>
                    <!-- </el-scrollbar> -->
                  </div>
                   <p style="font-size:14px;padding: 15px 0px;">自有特殊字符</p>
                  <div style="overflow: hidden;max-height:88px;overflow-y: scroll;">
                    <span  v-for="(myFont,index) in selfFonts" :key="index" class="fontBox but editorClass diyFont" @click="copyText($event)">{{myFont.remark}}</span>
                  </div>
                </div>
              </i>
            </span>
          </button>
          <button
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div :style="bodyStyle" style=" overflow-y: auto!important; " class="el-dialog__body" v-if="rendered"><slot></slot></div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Popup from '@/common-el/src/utils/popup';
  import Migrating from '@/common-el/src/mixins/migrating';
  import emitter from '@/common-el/src/mixins/emitter';
  import $ from 'jquery';
  import {ajaxRequest,ajaxProxyRequest, formatArrayToTree} from '@/components/util/base';

  export default {
    name: 'mindDialog',
    mixins: [Popup, emitter, Migrating],
    props: {
      title: {
        type: String,
        default: ''
      },
      modal: {
        type: Boolean,
        default: true
      },
      modalAppendToBody: {
        type: Boolean,
        default: true
      },
      appendToBody: {
        type: Boolean,
        default: true
      },
      lockScroll: {
        type: Boolean,
        default: true
      },
      closeOnClickModal: {
        type: Boolean,
        default: false
      },
      closeOnPressEscape: {
        type: Boolean,
        default: true
      }, 
      showClose: {
        type: Boolean,
        default: true
      },
      otherCode: {//是否引用特殊字符
        type: Boolean,
        default: false
      },  
      fullscreen: Boolean,
      customClass: {
        type: String,
        default: ''
      },
      top: {
        type: String,
        default: '15vh'
      },
      beforeClose: Function,
      center: {
        type: Boolean,
        default: false
      },
      dialogSize: {type:String, default:'mid'},
      height: {//指定高度
        type: Number,
        default: 0
      },
      width: {//指定宽度
        type: [Number,String]
      },
    },

    data() {
      return {
        closed: false,
        currencyFonts:[{myFont:"Ａ"},{myFont:"Ｂ"},{myFont:"Ｃ"},{myFont:"Ｄ"},{myFont:"Ｅ"},
          {myFont:"Ｆ"},{myFont:"Ｇ"},{myFont:"Ｈ"},{myFont:"Ｉ"},{myFont:"Ｊ"},{myFont:"Ｋ"},
          {myFont:"Ｌ"},{myFont:"Ｍ"},{myFont:"Ｎ"},{myFont:"Ｏ"},{myFont:"Ｐ"},{myFont:"Ｑ"},
          {myFont:"Ｒ"},{myFont:"Ｓ"},{myFont:"Ｔ"},{myFont:"Ｕ"},{myFont:"Ｖ"},{myFont:"Ｗ"},
          {myFont:"Ｘ"},],//通用字list
        selfFonts:[],//自造字list
        displayBox:false,
        myTime:"",//定时器
      };
    },

    watch: {
      visible(val) {
        let appId =  parent ? 'app' : this.$store.state.admin.id,
            Document = parent ? parent.document : document;
        if (val) {
          this.closed = false;
          this.$emit('open');
          this.$el.addEventListener('scroll', this.updatePopper);
          this.$nextTick(() => {
            this.$refs.dialog.scrollTop = 0;
          });
          if (this.appendToBody) {
            if(appId){
              Document.getElementById(appId).appendChild(this.$el);
            }else{
              Document.body.appendChild(this.$el);
            }
          }
          if(this.otherCode){
            this.getFonts();
          }
        } else {
          this.$el.removeEventListener('scroll', this.updatePopper);
          if (!this.closed) this.$emit('close');
        }
      }
    },

    computed: {
      style() { 
        //根据传入参数确认是否使用计算值
        let ph=this.$store.state.dialogView[this.dialogSize].height;
        let mh=this.$store.state.admin.window_innerHeight;
        if(this.height>0){
          ph=this.height;
        }
        let hei=(mh-ph)/2  
        //debugger
        //根据传入参数确认是否使用计算值
        let pw=this.$store.state.dialogView[this.dialogSize].width;
        if(!isNaN(this.width) && this.width>0){
          //console.log("number",this.width);
          pw=this.width+ "px";
        }else if( typeof(this.width) == 'string' && this.width.length>0){
          //console.log("string",this.width);
          pw=this.width; 
        }else{
          pw=pw+"px"
        }
        return { 
          marginTop:(this.fullscreen==true)?this.top:hei+"px",
          width: pw ,
          height: ph+ "px",
        };
      },
      bodyStyle() {
        let ph=this.$store.state.dialogView[this.dialogSize].height;
        if(this.height>0){
          ph=this.height;
        }
        let hei=ph-55-10;
        if(this.$slots.footer){
          hei=hei-58;
        }
        return {
          maxHeight:hei + "px" 
          };
      },
      clickModal() {
        return this.closeOnClickModal;
      }
    },
    created(){
      this.$store.dispatch('setDialogSize');//计算弹出框的大小
    },
    methods: {
      changeFont(args){//上标，下标，换行，斜体
        // if(this.$store.state.myName===""){
        //   return;
        // }
        if(window.getSelection()){
          let textObj=window.getSelection();
          let text=textObj.toString();
          //console.log(window.getSelection(),text,'text')
          if(text===""){
            return;
          }
          if(args===1){
            text='<sup>'+text+'</sup>';
          }else if(args===2){
            text='<sub>'+text+'</sub>';
          }else if(args===3){
            text=text+'</br>';
          }else if(args===4){
            text='<i>'+text+'</i>';
          }
          this.dispatchEvents(text)
        }
      },
      getFonts(){//获取自造字列表
        ajaxProxyRequest('get','njmind/findParam/specialCharacter',{
        },(res)=>{
          this.selfFonts=res.list;
        })
      },
      dispatchEvents(text,type){
        let focusElement=document.activeElement;
        let focusElementText = focusElement.value;
        let [startIndex,endIndex] = [0,0];
        if (focusElement &&
          (focusElement.tagName.toLowerCase() === "textarea" ||
            (focusElement.tagName.toLowerCase() === "input" &&
              focusElement.getAttribute("type").toLowerCase() === "text")))
        {
          startIndex = focusElement.selectionStart;
          endIndex = focusElement.selectionEnd;
          if(type == 'focu'){
            $($(focusElement)[0]).val(focusElementText.substring(0,startIndex)+text+focusElementText.substring(startIndex))
          }else{
            $($(focusElement)[0]).val(focusElementText.substring(0,startIndex)+text+focusElementText.substring(endIndex))
          }
          $(focusElement)[0].dispatchEvent(new Event('input'))
          // this.$store.state.form[this.$store.state.myName]=focusElementText.substring(0,startIndex)+text+focusElementText.substring(endIndex);
        }
      },
      copyMe(e){//通用字
        var copyValue='<span style="font-family: njmindFont;">'+e.target.innerText+'</span>';
        if(this.getCursortPosition() !== -1){
          this.dispatchEvents(copyValue,'focu')
        }else{
          // 创建'虚拟'DOM
          const input = document.createElement('input')
          document.body.appendChild(input)
          input.setAttribute('value', copyValue)
          input.select()
          if (document.execCommand('copy')) {
            document.execCommand('copy')
            this.$message({
              type: 'success',
              message: '复制成功!'
            })
          }
          // 删除'虚拟'DOM
          document.body.removeChild(input);
        }
      },
      getCursortPosition () {
          let focusElement=document.activeElement;
          let CaretPos = -1;
          if (focusElement.selectionStart || focusElement.selectionStart == '0')
              CaretPos = focusElement.selectionStart;
          return (CaretPos);
      },
      copyText(e){//自造字
        let copyValue=e.target.innerText;
        if(this.getCursortPosition() !== -1){
          this.dispatchEvents(copyValue,'focu')
        }else{
          // 创建'虚拟'DOM
          const input = document.createElement('input')
          document.body.appendChild(input)
          input.setAttribute('value', copyValue)
          input.select()
          if (document.execCommand('copy')) {
            document.execCommand('copy')
            this.$message({
              type: 'success',
              message: '复制成功!'
            })
          }
          // 删除'虚拟'DOM
          document.body.removeChild(input);
        }
      },
      enter(){
        this.displayBox=true;
        clearInterval(this.myTime);
      },
      leave(){
        let _this=this;
        /*两秒后不进入自造字面板，面板自动消失*/
        _this.myTime=setInterval(function(){
            _this.leaveSpan();
        }, 2000);
      },
      enterSpan(){//上标，下标，换行，斜体按钮阻止点击后文本框失焦事件
        clearInterval(this.myTime);
        var btn = document.getElementsByClassName('but');
        for(let i=0;i<btn.length;i++){
          btn[i].onmousedown = function(event) {event.preventDefault()}
        }
      },
      leaveSpan(){
        this.displayBox=false;
      },
      getMigratingConfig() {
        return {
          props: {
            'size': 'size is removed.'
          }
        };
      },
      handleWrapperClick() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
      },
      handleClose() {
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(this.hide);
        } else {
          this.hide();
        }
      },
      hide(cancel) {
        if (cancel !== false) {
          this.$emit('update:visible', false);
          this.$emit('close');
          this.closed = true;
        }
      },
      updatePopper() {
        this.broadcast('ElSelectDropdown', 'updatePopper');
        this.broadcast('ElDropdownMenu', 'updatePopper');
      }
    },

    mounted() {
      let appId =  parent ? 'app' : this.$store.state.admin.id,
          Document = parent ? parent.document : document;
      if (this.visible) {
        this.rendered = true;
        this.open();
        if (this.appendToBody) {
          if(appId){
            Document.getElementById(appId).appendChild(this.$el);
          }else{
            Document.body.appendChild(this.$el);
          }
          //document.body.appendChild(this.$el);
        }
        if(this.otherCode){
          this.getFonts();
        }
      }
    },

    destroyed() {
      // if appendToBody is true, remove DOM node after destroy
      if (this.appendToBody && this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .fontBoxes {
   position: absolute;
    top: 34px;
    right: 7px;
    border: 1px solid #ddd;
    width: 258px;
    font-size: 25px;
    color: #000;
    background: white;
    padding: 10px 3px;
    border-radius: 5px;
    border-color: #3094e0;
    z-index:99999;
    ::-webkit-scrollbar   {
        display: none;
    }
}
.fontBiao{ font-family: "njmindFont";
    margin: 1px;
    display: inline;
    font-size: 14px;
    border: 1px solid #eaeaea;
    padding: 2px;
    width:42px;
    text-align: center;
    padding: 5px 10px;
    cursor: pointer;
}
.fontBiao:hover{
  background-color: rgb(143,197,239);
}
  .fontBox {
    font-family: "njmindFont";
    margin: 1px;
    cursor: pointer;
    font-size: 20px;
    float: left;
    border: 1px solid #eaeaea;
    padding: 2px;
    width: 42px;
    text-align: center; height: 23px;overflow:hidden;
}
  .fontBox:hover{
    background-color: rgb(143,197,239);
  }
.other-code {
    position: absolute;
    top: 7px;
    right: 50px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 39px;
}

.el-dialog__body{
  overflow-x: hidden!important;
}
.dialog-fade-enter-active {
  /* -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both; */
  animation: flipInY 0.8s!important;
}

.dialog-fade-leave-active {
  animation: flipInY 0.8s reverse!important;
}

@keyframes flipInY {
from {
-webkit-transform: rotate3d(0, 1, 0, 90deg);
transform: rotate3d(0, 1, 0, 90deg);
-webkit-animation-timing-function: ease-in;
animation-timing-function: ease-in;
opacity: 0;
}

60% {
-webkit-transform: rotate3d(0, 1, 0, 0deg);
transform: rotate3d(0, 1, 0, 0deg);
-webkit-animation-timing-function: ease-in;
animation-timing-function: ease-in;
opacity: 1;
}

/*60% {
-webkit-transform: perspective(800px) rotate3d(0, 1, 0, 0deg);
transform: perspective(800px) rotate3d(0, 1, 0, 0deg);
opacity: 1;
}

80% {
-webkit-transform: perspective(800px) rotate3d(0, 1, 0, 0deg);
transform: perspective(800px) rotate3d(0, 1, 0, 0deg);
}
*/

}

</style>
