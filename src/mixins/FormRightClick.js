import Vue from 'vue';
import Clickoutside from 'element-ui/src/utils/clickoutside';
function getSelection(){
  let selText = '',startIndex = 0,endIndex = 0, text='';
  if (window.getSelection) {  // 只有IE6,IE7,IE8不支持
    let sel = document.activeElement;
    if (sel &&
      (sel.tagName.toLowerCase() === "textarea" ||
        (sel.tagName.toLowerCase() === "input" &&
          sel.getAttribute("type").toLowerCase() === "text")))
    {
      text = sel.value;
      selText = text.substring(
        sel.selectionStart,
        sel.selectionEnd
      );
      startIndex = sel.selectionStart;
      endIndex = sel.selectionEnd;
    }
    /*else {
      var selRange = window.getSelection();
      selText = selRange.toString();
      startIndex = Math.min(selRange.anchorOffset,selRange.focusOffset);
      endIndex = Math.max(selRange.anchorOffset,selRange.focusOffset);
    }*/
  }
  return {
    text,
    selText,
    startIndex,
    endIndex
  }
}
export default {
  methods:{
    handleRightClick (formData, field, event) {
      let {text, selText, startIndex, endIndex}=getSelection();
      if(!selText){
        return;
      }
      let ops=['下标','上标','换行','斜体'];
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
          handleRightClickOperation (op) {
            this.handleClose();
            switch (op){
              case '下标': selText='<sub>'+selText+'</sub>';break;
              case '上标': selText='<sup>'+selText+'</sup>';break;
              case '换行': selText=selText+'<br/>';break;
              case '斜体': selText='<i>'+selText+'</i>';break;
              default:break;
            }
            formData[field]=text.substring(0,startIndex)+selText+text.substring(endIndex);
          }
        },
        directives: { Clickoutside },
        template:
        '<ul class="right-click-menu" v-clickoutside="handleClose">' +
        '<li v-for="v in ops" @click="handleRightClickOperation(v)">{{v}}</li>' +
        '</ul>'
      });
      let instance = new RightClickMenu().$mount();

      if(this.$store.state.admin.id){
        document.getElementById(this.$store.state.admin.id).appendChild(instance.$el);
      }else{
        document.body.appendChild(instance.$el);
      }
      let windowWidth=document.documentElement.clientWidth,
        windowHeight=document.documentElement.clientHeight,
        eventX=event.clientX,
        eventY=event.clientY;
      let dom=instance.$el,
        menu=dom.getBoundingClientRect();
      let left=eventX+menu.width>windowWidth ? eventX-menu.width : eventX,
        top=eventY+menu.height>windowHeight ? eventY-menu.height : eventY;
      dom.style.top=top+'px';
      dom.style.left=left+'px';
    },
  }
}
