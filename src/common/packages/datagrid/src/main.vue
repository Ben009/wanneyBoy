<template>
    <div style="margin-top:10px;">
      <el-table 
        :data="tableData"
        :stripe="stripe"
        border
        element-loading-text="拼命加载中"
        style="width: 100%"
        :row-class-name="rowClassName"
        :span-method="spanMethod"
		    :max-height="getTabHigth"
        :empty-text="emptyText"
        @sort-change="handleSort"
        @row-dblclick="dblclickRow"
        @selection-change="handleSelectionChange">
        <el-table-column  v-if="ckbox" fixed type="selection" width="60" align="center"> </el-table-column>
        <el-table-column  v-if="!showRn" fixed type="index" label="序号"  width="50"> </el-table-column>
        <el-table-column  v-if="showRn" fixed prop="RN" label="序号" width="50" align="center" ></el-table-column>
        <el-table-column  v-for="(col ,index ) in showCols" :key="index"
            :prop="col.name"
            v-if="!col.hidden"
            :label="col.name_cn"
            :align="col.align"
            :fixed="col.fixed"
            :show-overflow-tooltip="col.tooltip"
            :width="autoWidth?'':col.width"
            :render-header="renderHeader">
             <template slot-scope="scope"  >
              <slot :name="col.name"  v-bind:row="scope.row">{{ scope.row[col.name] }}</slot>
            </template>
            <!-- :sortable="col.sortable" -->
        </el-table-column>
        <slot></slot>
      </el-table>
      <div style="margin-top:10px;float: right;">
        <!-- TODO 案例 分页控件 mind-pagination  -->
        <mind-pagination
          :first-text="firstText"
          :last-text="lastText"
          :prev-text="prevText"
          :next-text="nextText"
          :layout="layout"
          :current-page="page"
          :page-size="rows"
          :total="total"
          :marginBottom="pagiMarginBottom"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import $ from 'jquery';
  import {ajaxProxyRequest,ajaxSyncProxyRequest} from '@/components/util/base.js';
  import TableColumnHeader from './TableColumnHeaderUpdate.vue';

  const colDefaults = {
    colspan: '',
    rowspan: '',
    editor: '',
    name: '',
    width: '',
    index: "1",
    sortable: false,
    align: 'center',
    hidden: false,
    name_cn: '',
    order: 'asc',
  }

  export default {
    name:"mindDatagrid",
    data() {
      return {
          page: 1,
          rows: 10,
          total: 0,
          orderProperty: '',//排序字段
          orderType: '',//排序方式
          tableData: [],
          showCols:[],
          filterCols:[],//显示列过滤项用于显示个性化设定列是否显示
          paramTemp:{},//外部传入参数缓存
          multipleSelection: [],//多行选中记录变量
          modules:[],//模板列表
          isDefModule:'',//默认模板
          emptyText:'……',
      };
    },
    props: {
      /** 分页执行编码 */
      opCode: {
        type: String,
        require:true
      },
      /** 是否斑马纹样式 */
      stripe:{
        type: Boolean,
        default:true
      },
      /** 是否支持多选 */
      ckbox:{
        type: Boolean,
        default:false
      },
      /** 是否使用分页行序号 */
      showRn:{
        type: Boolean,
        default:false
      },
      /** 回调函数 */
      callBack:{
        type:Function
      },
      /** 行样式控制方法 实现方法参考 business\secondAllot\userSjdQuery.vue */
      rowClassName:{
        type:Function
      },
      /** 分组合并行控制 实现方法参考 business\secondAllot\userSjdQuery.vue */
      spanMethod:{
        type:Function
      },
      /** 分页组件样式 */
      layout:{
        type: String,
        default : " firstp,prev, jumper, next,lastp,sizes,countpage,total ",
      },
      /** 默认查询调用链接/njmind/findPage/{opCode}，可以自定义指向 */
      findUrl:{
        type: String,
        default:'/njmind/findPage/',
      },
      /** 下载url */
      downUrl:{
        type: String,
        default:'',
      },
      /** 列宽自适应 */
      autoWidth:{
        type: Boolean,
        default:false
      },
      /** 是否初始化加载 */
      isLoad:{
        type: Boolean,
        default:true
      },
      /** table最大高度 */
      maxHeight:{
        type:Number
      },
      /** 分页下部是否显示间距  */
      pagiMarginBottom:{
        type: Boolean,
        default:true
      },
      /** 分页显示首页文字 */
      firstText:{ type:String , default:"首页" },
      /** 分页显示末页文字 */
      lastText:{ type:String , default:"末页" },
      /** 上页分页显示按钮 */
      prevText:{ type:String , default:"" },
      /** 下页分页显示按钮 */
      nextText:{ type:String , default:"" },
      setTabH:{ type:String, default:"" }
    },
    created(){
      this.asyncInitFunction()
    },
    mounted(){
      //默认查询第一页数据
      // if(this.isLoad){
      //   let param={};
      //   /* 载入个人设置默认条件 start */
      //   if(this.personalSetInfo ){
      //     let sendConditions=[];
      //     $.each(this.search.conditions,function(i,row){
      //       if(row.w_id){
      //         sendConditions.push({
      //           w_id:row.w_id,//条件字段id
      //           logicalValue:row.logicalValue,  //逻辑值
      //           comparison:row.comparison,    //检索条件
      //           value:row.value,         //检索值
      //         });
      //       }
      //     });
      //     param['sqlWhere'] =JSON.stringify(sendConditions)
      //     param['sort'] = this.search.sortBy;
      //     param['order'] = this.search.order;
      //   }
      //   /* 载入个人设置默认条件 end */
      //   this.findPageInfo(param);
      // }
    },
    methods: {
      findPageInfo(param,down){  
        if(param){
          this.page=1;
        }
        console.log(param,'paramparamparamparamparamparamparam')
        param=$.extend({}, this.paramTemp, param||{}),
        //配置分页参数排序参数
        param["rows"]=this.rows;//每页行数
        param["page"]=this.page;//页码
        this.paramTemp=param;
        if(down==true){
          this.downloadFileByForm(param);
        }else{
          this.emptyText="查询中";
          this.tableData=[];
          //查数据
          ajaxProxyRequest('post',this.findUrl+this.opCode,param,(res)=>{
            this.emptyText="暂无数据"
            this.tableData=res.rows;
            this.total=res.total;
          })
        }
      },
      /**
       * 模拟表单提交同步方式下载文件 //
       * 能够弹出保存文件对话框
       */
      downloadFileByForm(param) { 
        //console.log("展现列信息",this.showCols); 
        let exp=[];
        for(let i=0;i<this.showCols.length;i++){
          let tep=this.showCols[i];
          if(tep.hidden==false){
            exp.push({name:tep.name , name_cn:tep.name_cn});
          }
        }
        //console.log("ajaxDownloadSynchronized");
        //opCode 临时替换
        let opcode=this.opCode;
        if(param["opCode"] && param["opCode"]!=null && param["opCode"].length > 0 ){
          opcode=param["opCode"];
          delete param["opCode"];
        }
        let url =this.downUrl +opcode;
        if('/njmind/findPage/'==this.findUrl &&　''==this.downUrl){
          url ="/njmind/expExl/" +opcode;
        }else if(''==this.downUrl){
          url =this.findUrl +opcode;
        }
        let form = $("<form></form>").attr("action", url).attr("method", "post");
        form.append($("<input></input>").attr("type", "hidden").attr("name", "isDown").attr("value", "true"));
        //@EXP后端导出约定好
        form.append($("<input></input>").attr("type", "hidden").attr("name", "@EXP").attr("value", JSON.stringify(exp)));
        for(let p in param){
            form.append($("<input></input>").attr("type", "hidden").attr("name", p).attr("value", param[p]));
        }
        form.appendTo('body').submit().remove();
      },
      handleSort: function (column, prop, order) {//表头回调 排序列 变化
        this.paramTemp.sort = column['prop'];
        if (column['order'] == 'descending') {
          this.paramTemp.order = 'desc'
        } else {
          this.paramTemp.order = 'asc'
        }
        this.findPageInfo()
      },
      handlePageSizeChange (size) {//分页控件回调  每页数量
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.findPageInfo()
      },
      handleCurrentPageChange (currentPage) {//分页控件回调  页码变动
        this.page = currentPage
        this.findPageInfo()
      },
      handleSelectionChange (val) {//多行选中变化触发记录
        this.multipleSelection=val;
        //console.log("datagrid-handleSelectionChange",val);
      },
      dblclickRow(row, event){
        if(this.callBack){
          this.callBack('selectRows',row, event);
          console.log("行双击事件触发：",row);
        }
      },
      /**  外部传入过滤项 过滤列 */
      changeFilter(defModel,personalSet,wheres){
        if(personalSet){
          this.isDefModule = personalSet.isDefModule;
          this.modules = personalSet.content ;
        }
        /** 取出默认显示项 */
        let ftCols=[];
        if(defModel && defModel.length>0){
          this.modules.forEach((item,i)=>{
            if(item['name']==defModel){
              ftCols=item['checkList'];
            }
          });
        }else{
          this.modules.forEach((item,i)=>{
            if(item['name']==this.isDefModule){
              ftCols=item['checkList'];
            }
          });
        }
        this.filterCols=ftCols;
        this.filterShow(this.cols,'name',this.filterCols);
        this.findPageInfo(wheres);
      },

      /**
       * [renderHeader 编译表格头部的信息 展示popover弹框]
       * @param  {[type]} h              [编译函数 通常定义为h]
       * @param  {[type]} options.column [行信息]
       * @param  {[type]} options.$index [行索引]
       * @return {[type]}                [表格头部标题]
       */
      renderHeader(h, {column, $index}){
        /*表格头部自定义渲染  key值必加 隐藏列时需重新渲染头部*/
        let property = column.property,flag=false;
        let currentDataType = [];
        if(this.dataType && this.personalSetInfo){
          this.dataType.forEach(val => {
            this.personalSetInfo.findWhere.forEach(temp => {
              if(val['w_id'] == temp){
                currentDataType.push(val)
              }
            })
          })
        }
        currentDataType.forEach(v=>{
          if(property==v.aliases){
            flag=true;
          }
        });
        if(flag){
          let currentInfo = currentDataType.filter((v) => {return v.aliases == property}); // 注意保证aliases和行信息中的property一致
          return (
            <TableColumnHeader handlePidSearch = {this.findPageInfo.bind(this)} key={$index + property} opCode={this.opCode}  column={column}  currentInfo={ currentInfo }/>
        )
        }else{
          return column.label
        }
      },

      /**
       * 处理表格头部搜索方法
       * @return {[type]} [description]
      handleSearch(column,value){
        let currentInfo = this.dataType.filter((v) => {return v.aliases == column.property})[0]
        console.log(currentInfo,'currentInfo')
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
      },
      */
      /**
       * 获取当前模板的名称 保存个性化设置模板时需要区别该模板在哪个页面
       * @return {[type]} [description]
      getModuleType(){
          //通过路径获取调用当前组件的父组件名称【文件名.vue】
          let currentRouter = this.$route,
              currentType = '';
          if(currentRouter.matched && currentRouter.matched.length){
            currentRouter.matched.forEach(val => {
              if(val.path == currentRouter.path){
                currentType = val.components.default['__file']
              }
            })
          }
          let index = currentType.lastIndexOf('\\');
          currentType = currentType.substring(index+1)
          currentType = currentType.substring(-1,currentType.lastIndexOf('.'))
          return currentType
      },
      */
      /**
       * 获取表头所有列的的数据信息
       * @return {[promise]} [promise]
      getClosData(){
        return new Promise((resolve,reject) => {
          this.$store.dispatch('findCols',{opCode:this.opCode}).then(res => {
            resolve()
          }).catch(rej =>{
            reject('请求错误：'+rej)
          })
        })
      },
      */
      /**
       * 获取自定义模板的信息
       * @return {[type]} [description]
       */
      getTableShowModule(){
        this.userId = localStorage.getItem("userId");//获取用户id
        this.moduleType = this.opCode;
        return new Promise((resolve,reject) => {
          //console.log(this.opCode,'this.opCode22222222')
          this.$store.dispatch('findPersonalSet',{res:{userId:this.userId,moduleType:this.moduleType,isDelete:0},opcode:this.opCode}).then((_v) => {
            //console.log(this.personalSetInfo,'------------this.personalSetInfo-----------------')
            let res = this.personalSetInfo;
            if(res){
              let content=res['content']; // 保存的所有模板列表
              let isDefModule=res['isDefModule']; // 默认展示的模板
              this.isDefModule=isDefModule;
              if(content && content.length>0){//已存在自定义模板
                this.modules  = content
                this.modules.forEach((val,index)=>{
                  if(isDefModule && isDefModule==val['name']){
                    this.filterCols=val['checkList'];
                  }
                });
              }
              if(this.callBack){//回调返回，模板集合
                this.callBack('modules',this.modules,this.isDefModule);
              }
            }
            resolve()
          }).catch(rej => {
            reject(new Error('请求错误！'))
          })
        })
      },

      /**
       * 用户设定展现列过滤
       * @param  {[type]} soe    [所有表头列的信息]
       * @param  {[type]} key    [根据传入的key来]
       * @param  {[type]} filter [自定义模板信息]
       */
      filterShow(soe,key,filter){
        return new Promise((resolve,reject) => {
          this.showCols=[];
          let ftJson={};
          for(let i=0;i<filter.length;i++){
            ftJson[filter[i]]=i;
          }
          for(let i=0;i<soe.length;i++){
            let tmp= $.extend({},soe[i]);
            // 如果不存在自定义模板则取请求到的数据
            if(ftJson && filter.length>0){
              //console.log("过滤列"+tmp['name_cn'],tmp[key],'hidden:'+tmp['hidden']);
              if(!tmp['hidden'] && ftJson[tmp[key]]>=0 ){
                //过滤出来的显示，显示则为false
                //console.log("显示");
              }else{
                tmp['hidden']=true;
                //console.log("隐藏");
              }
            }else{
              if(tmp['def_show'] != '1'){
                tmp['hidden']=true;
              }
            }
            this.showCols.push(tmp);
          }
          resolve()
        })
      },

      /**
       * 异步加载流程管理
       */
      async asyncInitFunction(){
        //await this.getClosData();
        await this.getTableShowModule();
        await this.filterShow(this.cols,'name',this.filterCols);
      }



    },
    watch:{
      firstLoad(){
        let param={};
        /* 载入个人设置默认条件 start */
        if(this.personalSetInfo ){
          let sendConditions=[];
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
          param['sqlWhere'] =JSON.stringify(sendConditions)
          param['sort'] = this.search.sortBy;
          param['order'] = this.search.order;
        }
        /* 载入个人设置默认条件 end */
        this.findPageInfo(param);
      }
    },
    computed:{
      getTabHigth(){
        if(this.maxHeight){
          return this.maxHeight;
        }else{
          return this.$store.state.admin.window_innerHeight-200;
        } 
      },
      // 表头所有列的信息
      cols(){
        return this.$store.state.retrieveTableApi[this.opCode]['cols']
      },
      // 个性化设置的模板信息
      personalSetInfo(){
        return this.$store.state.retrieveTableApi[this.opCode]['personset']
      },
      // 查询条件
      search(){
        return this.$store.state.retrieveTableApi[this.opCode]['search']
      },
      // 所有字段的类型
      dataType(){
        return this.$store.state.retrieveTableApi[this.opCode]['dataType']
      },
      firstLoad(){
        return this.$store.state.retrieveTableApi[this.opCode]['firstLoad']
      }
    }
  }
</script>
