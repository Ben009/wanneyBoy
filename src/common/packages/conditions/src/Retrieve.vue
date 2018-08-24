<template>
  <div >
    <div v-show="showCondition"  style="background: rgb(251, 251, 251); padding: 14px 5px;">
    <!-- **********************************************高级检索 检索项************************************************* -->
    <table style="font-size:14px; width:100%; text-align:center; table-layout:fixed;">
      <thead>
      <tr>
        <th class="th-normal" style="width:150px;" ><span title="逻辑">逻辑：</span></th>
        <th class="th-normal">检索项：</th>
        <th class="th-normal">比较：</th>
        <th class="th-normal" style="min-width:200px;">检索词：</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(v,i) in search.conditions"  :key="'pk'+i">
        <td class="retrieveTr">
          <el-select size="mini" v-if="i>0" v-model="v.logicalValue"  placeholder="请选择">
            <el-option
              v-for="item in logicalValues"
              :key="item.value"
              :label="item.title"
              :value="item.value">
            </el-option>
          </el-select>
        </td>
        <td style="padding:5px 0px;display:inline-block">
          <el-select size="mini"  v-model="v.w_id" placeholder="请选择" @change="changeRetrieveItem(v,i)">
            <el-option
              v-for="item in filterSearch"
              :key="item.w_id"
              :label="item.name_cn"
              :value="item.w_id">
            </el-option>
          </el-select>
        </td>
        <td>
          <el-select size="mini"  v-model="v.comparison" placeholder="请选择">
            <el-option
              v-for="item in v.temp_compare"
              :key="item.code"
              :label="item.remark"
              :value="item.code">
            </el-option>
          </el-select>
        </td>
        <td>
          <el-input size="mini" v-if="v.component == null || v.component=='input'" v-model="v.value" placeholder="请输入内容" style="width: 100%;"></el-input>
          <el-date-picker
            v-else-if="v.component==='date'"
            v-model="v.value"
            size="mini"
            type="date"
            :format="v.temp_format"
            :value-format="v.temp_format"
            placeholder="选择日期"  style="width: 100%;">
          </el-date-picker>
          <el-select size="mini" v-else-if="v.component='select'" v-model="v.value" placeholder="请选择"  style="width: 100%;">
            <el-option label="请选择" :value="null"></el-option>
            <el-option
              v-for="item in v.temp_data"
              :key="item.code"
              :label="item.remark"
              :value="item.code">
            </el-option>
          </el-select>
        </td>
        <td ref="retrieve-td">
          <el-button size="mini" type="primary" plain @click="addRetrieveItem">增加</el-button>
          <el-button size="mini" type="danger" plain @click="delRetrieveItem(i)">删除</el-button>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- **********************************************高级检索 检索项************************************************* -->
    <!-- **********************************************高级检索 排序项************************************************* -->
    <div class="second">
      <!--<el-button type="primary" round @click="retrieve" class="el-icon-search">查询</el-button>-->
      <div :style="{float:'right',marginRight:marginRight}">
        <el-dropdown trigger="click"  @command="handleCollectionChange">
          <div class="el-dropdown-link">
            <div style="position: relative;cursor: pointer; padding: 0 40px 0 10px;border:1px #c0c4cc solid;border-radius: 3px;height:28px;">
              <input type="text" readonly v-model="collectionType" placeholder="请选择" style="width:60px;cursor: pointer;border:none;height:26px;">
              <i class="el-icon-circle-close" style="position: absolute;right:25px;top:6px;" v-mindPopover="{message:'确认删除该收藏？',success:deleteCollect.bind(this),isOpen:handleCollectOpen.bind(this)}"></i>
              <i class="el-icon-arrow-down el-icon--right" style="position: absolute;right:7px;top:6px;color:#c0c4cc"></i>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown"  style="width:110px;">
            <el-dropdown-item command="-1">
              请选择
            </el-dropdown-item>
            <el-dropdown-item v-for="item in collectionList" :key="item.name" :command="item.name">
              {{item.name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" type="primary" plain v-mindPopover="{message:'<div>请输入收藏名称</div><div><el-input v-model=flag3 v-focusSelectFull></el-input></div>',success:handleCollect.bind(this),info:'',isOpen:handleOpen.bind(this)}">收藏</el-button>
      </div>
      <div style="margin-left:150px;">
        <span style="display:inline-block;margin-right:3%;">请选择查询结果排序方式：</span>
        <el-select size="mini"  v-model="search.sortBy" placeholder="请选择">
          <el-option
            v-for="item in sortColumnsData"
            :key="item.name"
            :label="item.name_cn"
            :value="item.aliases">
          </el-option>
        </el-select>
        <el-select size="mini"  v-model="search.order" placeholder="请选择">
          <el-option
            v-for="item in orders"
            :key="item.name"
            :label="item.title"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <!-- **********************************************高级检索 排序项************************************************* -->
    </div>
    <!-- 高级查询个人设置 -->
    <personalSettings  v-if="isSetting"
          :op-code="opCode"
          :callback="settingCallback"
          ></personalSettings>

  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest,ajaxProxyRequest,ajaxSyncRequest,ajaxSyncProxyRequest,arrayToMap,transToType,transTokey} from '@/components/util/base';
  import $ from 'jquery'
  import personalSettings from './PersonalSettings.vue';
  export default {
    name: "mind-condition",
    props:{
      opCode:{//用于控件 基础数据加载
        type:String,
        required:true
      },
      loaded:{//用于控件 加载完成后回调方法
        type:Function
      },
    },
    data(){
      return {
        callback:null,
        isSetting:false,//个性化设置窗口是否展现
        //showCondition:true,
        logicalValues:[{title:'并且', value:0},{title:'或者', value:1}],
        orders:[{title:'升序', value:'asc'},{title:'降序', value:'desc'}],
        //filterSearch:[],//个性化过滤  会对生成 search.conditions 加以过滤只展现指定的查询项
        //filterColumns:[],//过滤后的条件
        conditionDef:{//检索条件
            w_id:null,          //条件组件
            logicalValue:0,  //逻辑值
            sqlSeg:null,        //检索项  --不建议在前端显示
            nameCode:null,      //字段英文名称
            aliases:null,       //字段别名 在列头显示检索项必须要有值且保持相同
            comparison:null,    //检索条件
            value:null,         //检索值
            temp_compare:[],    //检索类型可以选项
            temp_data:[],       //可选检索值
            temp_format:null,   //显示格式
        },
        //favorite:[], //收藏记录
        //collectionType:null, //当前收藏下拉选择的类型
        //collectionList:[], //收藏的列表
        marginRight:0,
      }
    },
    computed:{
      // 表头所有列的信息
      cols(){
        return this.$store.state.retrieveTableApi[this.opCode]['cols']
      },
      //所有查询条件
      columns(){
        return this.$store.state.retrieveTableApi[this.opCode]['dataType']
      },
      // 个性化设置的模板信息
      personalSetInfo(){
        //console.log(this.$store.state.retrieveTableApi[this.opCode]['personset'],'this.$store.state.retrieveTableApi[this.opCode]')
        return this.$store.state.retrieveTableApi[this.opCode]['personset']
      },
      // 查询条件
      search(){
        return this.$store.state.retrieveTableApi[this.opCode]['search']
      },
      // 可选查询条件
      filterSearch(){
        return this.$store.state.retrieveTableApi[this.opCode]['filtersearch']
      },
      // 排序字段
      sortColumnsData(){
        return this.$store.state.retrieveTableApi[this.opCode]['sortcols']
      },
      // 是否显示高级查询
      showCondition(){
        return this.$store.state.retrieveTableApi[this.opCode]['personset']['isOpen'];
      },
      // 收藏的检索条件
      collectionList(){
        return this.$store.state.retrieveTableApi[this.opCode]['personset']['searchCondition'];
      },
      // 当前选中的检索收藏
      collectionType(){
        return this.$store.state.retrieveTableApi[this.opCode]['search']['collectionType'];
      }
    },
    created(){
      this.userId = localStorage.getItem("userId");//获取用户id
      this.moduleType =this.opCode;//获取指定模板名
      this.$store.dispatch('findPersonalSet',{res:{userId:this.userId,moduleType:this.moduleType,isDelete:0},opcode:this.opCode});
    },
    mounted(){
      this.getMarginRight();
      if(this.loaded){//空间加载完执行
        this.loaded();
      }
      //this.insertRetrieveItem();
    },
    watch:{
      /*
      personalSetInfo(val){
        debugger
        console.log(this.personalSetInfo,'personalSetInfo')
        //根据页面的opCode 去获取查询条件
        this.getCollectionList()
        this.insertRetrieveItem()
        this.$store.dispatch('findWheres',{opCode:this.opCode}).then(res => {
          this.getCollectionList()
          this.insertRetrieveItem()
        })
      }*/
    },
    components:{
      personalSettings
    },
    methods:{
      /*getCollectionList(){
        this.collectionList = [];
        if(this.personalSetInfo.searchCondition && this.personalSetInfo.searchCondition.length){
          this.collectionList = this.personalSetInfo.searchCondition
        }
      },*/
      sendParams(callback){
        let sendBody=this.getSearchParam('search');
        callback(sendBody);
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
        if(type == 'search') return  {'order':this.search.order,'sort':this.search.sortBy,'sqlWhere':JSON.stringify(sendConditions)};
        return  {'order':this.search.order,'sort':this.search.sortBy,'sqlWhere':JSON.stringify(sendConditions),'sendConditions':sendConditions};
      },
      /** 检索过滤 */
      changeRetrieveItem(item,index){
        this.$store.dispatch('changeRetrieveItems',{opCode:this.opCode,item:item,index:index,isload:false});
      },

      /** 重置查询条件 */
      emptyCondition(){
        this.search.conditions=[];
        Vue.set(this.search.conditions,0,$.extend({}, this.conditionDef));
      },

      settingCallback(personalSet){
        this.userId = localStorage.getItem("userId");//获取用户id
        // this.moduleType =this.getModuleType('moduleType');//获取指定模板名
        this.moduleType =this.opCode;//获取指定模板名
        this.isSetting=false;
        this.$store.state.retrieveTableApi[this.opCode].isload=false;
        this.$store.dispatch('findPersonalSet',{res:{userId:this.userId,moduleType:this.moduleType,isDelete:0},opcode:this.opCode}).then(res => {
          if(this.callback){
            let sendBody=this.getSearchParam('search');
            this.callback(personalSet,sendBody);
          }
        });
      },



      /**
       * 获取当前页面的标记位
       * @return {[type]} [description]
      getModuleType(){
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
      /** 打开个性化设置 */
      settingShow(flag,func){
          if(flag){
            this.isSetting=true;
            if(func){
              this.callback=func;
            }
          }else{
            this.isSetting=false;
          }
      },

      /**
       *  新增一条检索项
       */
      addRetrieveItem(){
        this.$store.commit('ADDSEARCH',{res:$.extend({}, this.conditionDef),opcode:this.opCode,type:'add'})
      },

      /**
       * 删除一条检索项
       * @param  {[type]} index [这条检索项的索引]
       * @return {[type]}       [description]
       */
      delRetrieveItem(index){
        /*删除一条检索项 用conditions维护*/
        if(this.search.conditions.length==1 && !this.search.conditions[0]['w_id']){
          this.$message.error("首行禁止删除，系统自动清空查询条件！");
        }
        this.$store.commit('DELETESEARCH',{index:index,opcode:this.opCode})
        // this.search.conditions.splice(index,1);
        // if(this.search.conditions.length==0){
        //   Vue.set(this.search.conditions,0,$.extend({}, this.conditionDef));
        // }
      },

      /**
       * 设置初始化进入页面时搜索条件的默认值
      setDefaultSearch(){
        // 暂时没有默认值 先取第一个
        let tempColumns = [],
            tempSearch = {};
        if(this.filterColumns.length>0){
          tempColumns = this.filterColumns[0]
        }else if(this.columns.length>0){
          tempColumns = this.columns[0]
        }
        tempSearch = {
          conditions: [{
            'w_id':tempColumns['w_id'],
            'nameCode':tempColumns['name_cn'],
            'aliases':tempColumns['aliases'],
            'component':tempColumns['component'],
            'temp_compare':tempColumns['data_source']['comparis'],
            'temp_data':tempColumns['data_source']['data'],
            'temp_format':!tempColumns['data_source']['format']?'yyyy-MM-dd hh:mm:ss':tempColumns['data_source']['format'],
            'value':null,
            'logicalValue':0,
            'comparison':tempColumns['data_source']['comparis'][0]['code'],
          }],
          sortBy:this.personalSetInfo.defOrder && this.personalSetInfo.defOrder.sort,
          order:this.personalSetInfo.defOrder && this.personalSetInfo.defOrder.order
        }
        this.$store.commit('UPDATESEARCH',{res:tempSearch,opcode:this.opCode});
      },
      */
      /******************************************************高级检索 收藏操作*************************************************/
      /**
       * 是否打开收藏的提示框 修改则不需要打开
       * @return {[type]} [description]
       */
      handleOpen(){
        // let type = this.getModuleType();
        let type = this.opCode;
        let userId = localStorage.getItem("userId");
        let searchParam=this.getSearchParam();
        if(searchParam.sqlWhere == '[]') {
          this.$message.error("请至少选择一条检索项！");
          return false
        }
        if(this.collectionType){
          let curCondition = $.extend(true,[],this.collectionList);
          curCondition.forEach(v=>{
            if(v.name==this.collectionType){
              v.value=searchParam;
            }
          });
          let param={
            v_user_id:userId,//用户id
            v_module_type:type,//模板类型
            v_search_condition:JSON.stringify(curCondition),//收藏检索条件
          };
          ajaxProxyRequest('post','/njmind/exeProc/personalSet',param,(res)=>{
            if(res && res['v_msg'] && res['v_msg']=='success'){
              this.$store.commit("SET_SEARCH_CONDITION",{opcode:this.opCode,res:curCondition});
              //this.collectionList=curCondition;
              this.$message.success("修改成功!");
            }else if(res['v_msg']){
              this.$message.error(res['v_msg']);
            }else{
              this.$message.error("修改失败！");
            }
          });
          return false
        }else{
          return true
        }
      },
      /**
       * 处理收藏保存的操作
       * @return {[type]} [description]
       */
      handleCollect(_this){
        let value = '';
        if(_this['_data'].flag3) value = _this['_data'].flag3;

        if(value==''||value==null){
          this.$message({
            type: 'error',
            message: '收藏名称不能为空'
          });
          return true
        }

        let flag=false;
        this.collectionList.forEach(v=>{
          if(v.name==value){
            flag=true;
          }
        })
        if(flag){
          this.$message({
            type: 'error',
            message: '收藏名称重复'
          });
          return true
        }

        // let type = this.getModuleType();
        let type = this.opCode;
        let userId = localStorage.getItem("userId");
        let searchParam=this.getSearchParam();
        let curCondition=$.extend(true,[],this.collectionList);
        curCondition.unshift({name:value,value:searchParam});
        let param={
            v_user_id:userId,//用户id
            v_module_type:type,//模板类型
            v_search_condition:JSON.stringify(curCondition),//收藏检索条件
        };
        ajaxProxyRequest('post','/njmind/exeProc/personalSet',param,(res)=>{
          if(res && res['v_msg'] && res['v_msg']=='success'){
            this.$store.commit("UPDATE_SEARCH_COLLECTION_TYPE",{opcode:this.opCode,res:value});
            this.$store.commit("SET_SEARCH_CONDITION",{opcode:this.opCode,res:curCondition});
            //this.collectionList=curCondition;
            this.$message.success("收藏成功！");
          }else if(res['v_msg']){
            this.$message.error(res['v_msg']);
          }else{
            this.$message.error("收藏失败！");
          }
        });
      },
      /**
       * 获取收藏按钮的位置（位于增加删除的中心位置）
       * @return {[type]} [description]
       */
      getMarginRight(){
        let width = $(this.$refs['retrieve-td'][0]).width();
        this.marginRight=(width-56)/2+'px';
      },
      /**
       * 收藏下拉的change事件
       * @param  {[type]} value [description]
       * @return {[type]}       [description]
       */
      handleCollectionChange(value){
        if(value!=='-1'){
          this.$store.commit("UPDATE_SEARCH_COLLECTION_TYPE",{opcode:this.opCode,res:value});
          let arr =$.extend(true,[],this.collectionList);
          arr.forEach((v)=>{
            if(v.name===value){
              this.search.conditions = [];
              v.value.sendConditions.forEach((val,index) => {
                this.$store.dispatch('changeRetrieveItems',{opCode:this.opCode,item:val,index:index,isload:true})
              })
              this.search.sortBy = v.value.sort
              this.search.order = v.value.order
            }
          })
        }else{
          this.$store.commit("UPDATE_SEARCH_COLLECTION_TYPE",{opcode:this.opCode,res:null});
          this.search.conditions = [{}];
          this.search.sortBy = null
          this.search.order = null
        }
      },
      /**
       * 删除收藏的事件
       * @param  {[type]} ev [description]
       * @return {[type]}    [description]
       */
      deleteCollect(){
        event.stopPropagation();
        // let type = this.getModuleType();
        let type = this.opCode;
        let userId = localStorage.getItem("userId");
        let curCondition = $.extend(true,[],this.collectionList);
        curCondition = curCondition.filter(v=>{return v.name!=this.collectionType});
        let param={
            v_user_id:userId,//用户id
            v_module_type:type,//模板类型
            v_search_condition:JSON.stringify(curCondition),//收藏检索条件
        };
        ajaxProxyRequest('post','/njmind/exeProc/personalSet',param,(res)=>{
          if(res && res['v_msg'] && res['v_msg']=='success'){
            this.$store.commit("UPDATE_SEARCH_COLLECTION_TYPE",{opcode:this.opCode,res:null});
            this.$store.commit("SET_SEARCH_CONDITION",{opcode:this.opCode,res:curCondition});
            this.$message.success("删除成功!");
          }else if(res['v_msg']){
            this.$message.error(res['v_msg']);
          }else{
            this.$message.error("删除成功!");
          }
        });
      },
      handleCollectOpen(){
        event.stopPropagation();
        if(this.collectionType){
           return true
         }else{
          return false
         }
      },
      /******************************************************高级检索 收藏操作*************************************************/
    },
  }
</script>

<style scoped lang="scss">
  .th-normal{
    font-weight:normal;
    color:#606266;
  }
  .second{
    text-align:center;
    font-size:14px;
    color:#606266;
    margin:10px 0;
    overflow: hidden
  }
</style>
