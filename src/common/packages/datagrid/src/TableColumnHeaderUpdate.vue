
<template >
    <span >
      {{column.label}}
      <el-popover
        width="150"
        popper-class="qb-popper"
        trigger="hover"
        @after-enter="show"
        v-model="visible">
          <i slot="reference" @hover.stop style="position:absolute;left:0;right:0;top:0px;bottom:0px;"></i>
          <div style="text-align:center;" id="demo">
            <span>{{comparison}}</span>
            <!--<input type="text" v-model="value" ref="input"  @keyup.enter="handleSubmit">-->
            <el-input  size="mini"  v-if="!component || component=='input'"  v-model="value" ref="input"  @keyup.enter.native="handleSubmit" autofocus></el-input>
            <el-date-picker
              ref="val"
              style="width:130px;"
              size="mini"
              v-else-if="component=='date'"
              v-model="value"
              type="date"
              :format="format"
              :value-format="format"
              placeholder="选择日期">
            </el-date-picker>
            <el-select ref="val" v-else-if="component=='select'" v-model="value" placeholder="请选择" :popper-append-to-body="false">
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
  import {ajaxSyncRequest, tablePopover,ajaxSyncProxyRequest} from '@/components/util/base'
  export default {
    name: "table-column-header",
    props:{
      opCode:{required:true},
      //index:{required:true},
      column:{required:true},  //table列信息
      handlePidSearch:{type:Function, required:true},  //
      currentInfo:{required:true}
    },
    data() {
      return {
        value: '',    //检索值
        visible:false, //控制popover组件是否显示
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
    methods:{
      handleSubmit(){
        /*点击确定，将列信息和搜索值返回父组件*/
        if(this.value == ''){
          this.$message.error('请先填写值!');
          return
        }
        this.handleSearch(this.column, this.value); //调用父组件搜索事件
        this.visible=false;    //关闭当前popover组件
      },
      show(){
         /*输入框聚焦 并将输入框值清空*/
         if(this.$refs.input){
           this.$refs.input.$el.getElementsByTagName("input")[0].focus();
           this.$refs.input.$el.getElementsByTagName("input")[0].select();
         }
      },
      handleSearch(column,value){
        let currentInfo = this.dataType.filter((v) => {return v.aliases == column.property})[0]
        if(this.search.conditions && this.search.conditions.length){
          for(let i=0 ; i<this.search.conditions.length ; i++){
            if(!this.search.conditions[i]['value']){
              this.$store.commit('ADDSEARCH',{res:{
                'w_id':currentInfo['w_id'],
                'nameCode':currentInfo['name_cn'],
                'aliases':currentInfo['aliases'],
                'component':currentInfo['component'],
                'temp_compare':currentInfo['data_source']['comparis'],
                'temp_data':currentInfo['data_source']['data'],
                'temp_format':!currentInfo['data_source']['format']?'yyyy-MM-dd hh:mm:ss':currentInfo['data_source']['format'],
                'value':value,
                'logicalValue':0,
                'comparison':currentInfo['data_source']['comparis'][0]['code'],
              },opcode:this.opCode,index:i})
              this.handleInnerSearch()
              return
            }
          }
          this.$store.commit('ADDSEARCH',{res:{
            'w_id':currentInfo['w_id'],
            'nameCode':currentInfo['name_cn'],
            'aliases':currentInfo['aliases'],
            'component':currentInfo['component'],
            'temp_compare':currentInfo['data_source']['comparis'],
            'temp_data':currentInfo['data_source']['data'],
            'temp_format':!currentInfo['data_source']['format']?'yyyy-MM-dd hh:mm:ss':currentInfo['data_source']['format'],
            'value':value,
            'logicalValue':0,
            'comparison':currentInfo['data_source']['comparis'][0]['code'],
          },opcode:this.opCode})
          this.handleInnerSearch()
        }
      },
      handleInnerSearch(){
        let sendBody=this.getSearchParam('search');
        this.handlePidSearch(sendBody)
      },
      /** 获取查询条件 */
      getSearchParam(type){
        let  sendConditions=[];
        $.each(this.search.conditions,function(i,row){
          if(row.w_id){
            sendConditions.push({
              w_id:row.w_id,//条件字段id
              logicalValue:row.logicalValue,  //逻辑值
              comparison:row.comparison,    //检索条件
              value:row.value,         //检索值
            });
          }
        });
        return {'order':this.search.order,'sort':this.search.sortBy,'sqlWhere':JSON.stringify(sendConditions)};
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

      },
    },
    mounted(){
      /*当前列的json配置信息回显至该组件
        默认第一条比较项，不同列不同组件类型显示*/
      if(this.currentInfo.length>0){
        let cur = this.currentInfo[0];
        if( cur.data_source && cur.data_source.comparis && cur.data_source.comparis.length > 0){
          this.comparison = cur.data_source.comparis[0].remark
        }else{
          this.comparison = '等于'; // 如果不存在的话就默认 等于
        }
        this.component=cur.component;
        cur.component=='date'?this.format=cur.data_source.format:null; // 如果组件是时间的话则需要时间格式化
        cur.component=='select'?this.options=cur.data_source.data:[]; // 如果组件是下拉框的话则需要数据源
      }
    },
    computed:{
      // 所有字段的类型
      dataType(){
        return this.$store.state.retrieveTableApi[this.opCode]['dataType']
      },
      // 查询条件
      search(){
        return this.$store.state.retrieveTableApi[this.opCode]['search']
      },
    }
  }
</script>
<style>
 #demo:after, #demo:before {
            border: solid transparent;
            content: ' ';
            height: 0;
            left: 100%;
            position: absolute;
            width: 0;
        }

   #demo:after {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #3094e0;
    top: -10px;
    left: 80px;
   }
</style>

