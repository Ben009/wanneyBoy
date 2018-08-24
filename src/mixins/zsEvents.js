import Vue from 'vue';
import $ from 'jquery';
import store from '@/store'; // vuex仓库
import Clickoutside from 'element-ui/src/utils/clickoutside';
import './zsEventsEditor/kindeditor-all-certificate.css'
export default {
  data(){
    return{

    }
  },
  methods:{
    zs_select(name,event){
      event.stopPropagation()
      let tempOptions=[];
      $("select[name='"+name+"']").each((index,val) => {
        $(val).find('option').each((index,opt) => {
          tempOptions.push({
            label:$(opt).html(),
            value:$(opt)[0].value
          })
        })
      })
      let select = Vue.extend({
        data(){
          return {
            value:$(event.currentTarget).html()
          }
        },
        methods:{
          handleInput($event){
            this.value = $event
            $(event.currentTarget).html($event)
            this.handleClose()
          },
          handleClose () {
            this.$destroy(true);
            $(event.currentTarget).show()
            if(this.$el.parentNode){
              this.$el.parentNode.removeChild(this.$el);
            }
          },
        },
        directives: { Clickoutside },
        render(h){
          return (
            <div v-clickoutside={this.handleClose} style="display:inline-block">
              <el-select class="zs_select_class" popper-append-to-body={false} style={{ height:event.currentTarget.getBoundingClientRect().height+'px' }} value={this.value} onChange={ this.handleInput } placeholder="请选择">
                {this._l(tempOptions,(row,$index)=><el-option style={{ 'text-align':'left' }} key={$index} isHTML={true} label={row.value} value={row.value}></el-option>)}
              </el-select>
            </div>
          )
        }
      })
      let instance = new select().$mount();
      $(event.currentTarget).after(instance.$el).hide()
    },
    zs_input(event){
      event.stopPropagation()
      let input = Vue.extend({
        data(){
          return {
            value:$(event.currentTarget).html()
          }
        },
        methods:{
          handleInput($event){
            this.value = $event
            $(event.currentTarget).html($event)
            this.handleClose()
          },
          handleClose () {
            this.$destroy(true);
            $(event.currentTarget).show()
            if(this.$el.parentNode){
              this.$el.parentNode.removeChild(this.$el);
            }
          },
        },
        directives: { Clickoutside },
        render(h){
          return (
            <div v-clickoutside={this.handleClose} style="display:inline-block">
              <el-input class="zs_input_class" style={{ width: event.currentTarget.getBoundingClientRect().width+'px',height:event.currentTarget.getBoundingClientRect().height+'px' }} v-focusSelectFull value={this.value} onChange={ this.handleInput }></el-input>
            </div>
          )
        }
      })
      let instance = new input().$mount();
      $(event.currentTarget).after(instance.$el).hide()
    },
    zs_editor(event,options){
      const DEFAULT_OPTIONS = {
        items:[
            'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'cut', 'copy', 'paste', 'plainpaste', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist',
            'indent', 'outdent', 'subscript', 'superscript', 'selectall', '|', 'formatblock', 'fontname', 'fontsize', '|',
            'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|',
            'image', 'multiimage', 'table', 'hr', 'pagebreak' , '|' , 'njmindFontInsert'
        ],
        filterMode : false,
        imageTabIndex : 1,
      }
      this.createPlugin()
      let editor = Vue.extend({
        data(){
          return {
            value:$(event.currentTarget).html(),
            KindEditor:null,
            toolbarHeight:45,
          }
        },
        mounted() {
          //加载KindEditor，再调用查询的方法
          this.loadJS()
        },
        methods:{
          //引入 kindeditor
          loadJS(callBackFunction){
            this.$nextTick(val => {
              let _this = this;
              DEFAULT_OPTIONS['afterUpload'] = function(url, data, name) { //上传文件后执行的回调函数，必须为3个参数
                if(name=="image" || name=="multiimage"){ //单个和批量上传图片时
                  var img = new Image(); img.src = url;
                  img.onload = function(){ //图片必须加载完成才能获取尺寸
                    if(img.width>600) _this.KindEditor.html(_this.KindEditor.html().replace('<img src="' + url + '"','<img src="' + url + '" width="100%"'))
                  }
                }
              }
              this.KindEditor = window.KindEditor.create( 'div[name="kindeditor"]',DEFAULT_OPTIONS)
              this.KindEditor.html(this.value).focus().sync();
            })
          },
          handleSave(){
            this.value = this.KindEditor.html();
            if(event.path && event.path.length){
              event.path.forEach(val => {
                if(val.className == 'zs_click'){
                  $(val).html(this.value)
                }
              })
            }
          },
          handleClose () {
            this.handleSave();
            this.$destroy(true);
            if(event.path && event.path.length){
              event.path.forEach(val => {
                if(val.className == 'zs_click'){
                  $(val).show()
                }
              })
            }
            if(this.$el.parentNode){
              this.$el.parentNode.removeChild(this.$el);
            }
          },
        },
        directives: { Clickoutside },
        render(h){
          let directives = [{name: 'mind-clickoutside', value: this.handleClose, arg: 'editorClass'} ];
          return (
            <div {...{directives}} class="editorClass" id="zsEditorIframe" style={{display:'flex',alignItems:'center',flexDirection:'column',position:'relative',top:-this.toolbarHeight+'px'}}>
              <div name="kindeditor" 
                   style={{ height:(event.currentTarget.getBoundingClientRect().height+this.toolbarHeight)+'px', width:event.currentTarget.getBoundingClientRect().width+'px'}}></div>
            </div>
          )
        }
      })
      let instance = new editor().$mount();
      $(event.currentTarget).after(instance.$el).hide()
    },
    createPlugin(){
      window.KindEditor.lang({
          njmindFontInsert: '插入特殊字符',
      });
    }
  }  
}
