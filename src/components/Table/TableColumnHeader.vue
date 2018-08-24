
<template >
    <span >
      {{column.label}}

      <el-popover
        key="first"
        v-if="!component || component==='input'"
        width="150"
        popper-class="qb-popper"
        trigger="hover"
        @after-enter="show"
        v-model="visible">
          <i slot="reference" @hover.stop style="position:absolute;left:0;right:0;top:0px;bottom:0px;" @mouseenter="handleHover"></i>
          <div style="text-align:center;" id="demo">
            <span>{{Compare[comparison]}}</span>
            <!--<input type="text" v-model="value" ref="input"  @keyup.enter="handleSubmit">-->
            <el-input  size="mini"  v-if="!component || component=='input'"  v-model="value" ref="input"  @keyup.enter.native="handleSubmit" autofocus></el-input>
            <el-button type="primary" size="mini" @click="handleSubmit" style="margin-top:5px;">确 定</el-button>
          </div>
      </el-popover>
      <el-popover
        key="second"
        v-else
        width="150"
        popper-class="qb-popper"
        v-model="visible">
          <i slot="reference" @hover.stop style="position:absolute;left:0;right:0;top:0px;bottom:0px;" @mouseenter="handleHover"></i>
          <div style="text-align:center;" id="demo1">
            <span>{{Compare[comparison]}}</span>

            <el-date-picker
              ref="val"
              style="width:130px;"
              size="mini"
              v-if="component=='date'"
              v-model="value"
              type="date"
              :format="format"
              :value-format="format"
              placeholder="选择日期">
            </el-date-picker>
            <el-select ref="val" v-if="component=='select'" v-model="value" placeholder="请选择">
              <el-option
                size="mini"
                v-for="item in options"
                :key="item[code]"
                :label="item[remark]"
                :value="item[code]">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="handleSubmit" style="margin-top:5px;">确 定</el-button>
          </div>
      </el-popover>


    </span>
</template>

<script>
  import $ from 'jquery'
  import {ajaxSyncRequest, tablePopover,ajaxSyncProxyRequest} from '../util/base'
  export default {
    name: "table-column-header",
    props:{
      index:{required:true},
      column:{required:true},  //table列信息
      handleSearch:{type:Function, required:true},  //
      currentInfo:{required:true}
    },
    data() {
      return {
        value: '',    //检索值
        visible:false, //控制popover组件是否显示
        Compare:{
          0:'包含',
          1:'等于',
          2:'大于',
          3:'小于',
          4:'不等于',
          5:'大于等于',
          6:'小于等于',
          7:'不包含',
          8:'为空',
          9:'不为空'
        },
        comparison:'',
        component:'',
        options:[],
        format:'yyyy-MM-dd',
        info:this.currentInfo,
        renderKey:0,
        code:'code',
        remark:'remark'
      }
    },
    computed:{

    },
    methods:{
      handleHover(){
        /*if(this.$refs.input){
          this.$refs.input.$el.getElementsByTagName("input")[0].focus();
          this.$refs.input.$el.getElementsByTagName("input")[0].select();
        }*/

      },
      handleSubmit(){
        /*点击确定，将列信息和搜索值返回父组件*/
        if(this.value == ''){
          this.$message.error('请先填写值!');
          return
        }
        this.handleSearch(this.column, this.value,this.index); //调用父组件搜索事件
        this.visible=false;    //关闭当前popover组件
      },
      getOptions(url){
        ajaxSyncProxyRequest('get',url,null,(res)=>{
          if( res instanceof Array ){
            this.options=res;
          }else{
            if(res.list){
              this.options=res.list;
            }else{
              this.options=res.rows;
            }
          }
        });
      },
      show(){
         /*输入框聚焦 并将输入框值清空*/
         if(this.$refs.input){
           this.$refs.input.$el.getElementsByTagName("input")[0].focus();
           this.$refs.input.$el.getElementsByTagName("input")[0].select();
         }
      },
      addParentHover(){
        var $this=this.$el;
        /*循环找到当前最近的父级TH*/
        while($this){
          if($this.tagName==='TH'){
            break;
          }
          $this=$this.parentNode;
        }
        /*循环找到当前表格的tableId*/
        let $i=this;
        while($i){
          if($i.tableId){
            break;
          }
          $i = $i.$parent;
        }
        let $tableId=$i.tableId;
        /*TH上绑定hover事件*/
        $this.onmouseover=()=>{

          /*输入框聚焦 并将输入框值清空*/
          if(this.$refs.input){
            this.$refs.input.$el.getElementsByTagName("input")[0].focus();
            this.$refs.input.$el.getElementsByTagName("input")[0].value='';
          }
          this.$refs.val?this.$refs.val.$el.getElementsByTagName("input")[0].value='':null;
          /*通过tableId维护tablePopover对象，每个table都仅有一个columnHeader组件显示*/
          if(tablePopover[$tableId]){
            //console.log(tablePopover[$tableId])
            tablePopover[$tableId].visible=false;
          }
          tablePopover[$tableId]=this;
          this.visible=true;
        };

      }
    },
    mounted(){
      /*当前列的json配置信息回显至该组件
        默认第一条比较项，不同列不同组件类型显示*/
      if(this.currentInfo.length>0){
        let cur = this.currentInfo[0];
        if( Object.prototype.toString.call(cur.comparison)==='[object String]'){
          this.comparison = cur.comparison.split(",")[0]
        }else{
          this.comparison=cur.comparison[0]
        }
        this.component=cur.component;
        cur.component=='date'?this.format=cur.dateFormat:null;
        if( cur.component=='select'){
          if(cur.ajaxUrl){
            this.getOptions(cur.ajaxUrl);
            if(cur.toRex){
              this.code=cur.toRex.code;
              this.remark=cur.toRex.remark;
            }
          }else{
            this.options= cur.options;
          }

        }
      }

      /*将事件放在父级th上，通过hover触发*/
      //this.addParentHover();


    }
  }
</script>
<style>
 #demo:after, #demo:before,
 #demo1:after, #demo:before{
            border: solid transparent;
            content: ' ';
            height: 0;
            left: 100%;
            position: absolute;
            width: 0;
        }

   #demo:after,#demo1:after {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #3094e0;
    top: -10px;
    left: 68px;
   }
</style>

