<template>
  <mind-dialog
    title="个性化设置"
    v-dialogDrag
    :visible="true"
    dialogSize="mid"
    appendToBody
    center
    @close="handleClose">
  <div >
    <div class="right-content">
      <div class="default-start">
        <span style="font-size:16px;margin-right: 10px;vertical-align: middle">是否默认开启高级查询</span>
        <el-switch
          v-model="personalSet.isOpen"
          class="default-switch"
          active-color="#409EFF"
          inactive-color="#cacaca">
        </el-switch>
        <el-button type="primary" round @click="savePersonalSet('isOpen')" style="float:right;margin-right:20px;margin-top:12px">保存</el-button>
      </div>

      <div v-if="findWheres.length" class="conditions">
        <div class="title-item">
          <span>查询条件设置</span>
        </div>
        <div class="conditions-content">
          <div class="all-conditions">
            <div class="flex">
              <el-checkbox  :indeterminate="isDefNotAll"  v-model="isLeftAll"  @change="checkAllDef"></el-checkbox>
              <p class="ml10">所有条件</p>
            </div>
            <ul>
              <el-checkbox-group v-model="perDefWhere.checkList" @change="ckConditons">
                <li v-for="(items,index) in perDefWhere.show" :key="index">
                  <div>
                    <el-checkbox :label="items.w_id" >{{items.name_cn}}</el-checkbox>
                  </div>
                </li>
              </el-checkbox-group>
            </ul>
          </div>
          <div class="action">
            <div :class="'moveRight '+(isRight?'active':'')" @click="moveRight">
              <i class="iconfont el-icon-arrow-right"></i>
            </div>
            <div :class="'moveLeft ' +(isLeft?'active':'')" @click="moveLeft">
              <i class="iconfont el-icon-arrow-left"></i>
            </div>
          </div>
          <div class="set-conditions">
            <div class="flex">
              <el-checkbox :indeterminate="isSetNotAll" v-model="isRightAll"  @change="checkAllSet"></el-checkbox>
              <p class="ml10">设置条件</p>
            </div>
            <ul>
              <el-checkbox-group v-model="perSetWhere.checkList" @change="ckConditons">
                <li v-for="(items,index) in perSetWhere.show" v-if="items.purpose!=2" :key="index">
                  <div class="flex conditionsSetItem">
                    <el-checkbox :label="items.w_id" >{{items.name_cn}}</el-checkbox>
                    <p>
                      <span class="el-icon-sort-up" @click="moveUp(index)"></span>
                      <span class="el-icon-sort-down" @click="moveDown(index)"></span>
                    </p>
                  </div>
                </li>
              </el-checkbox-group>
            </ul>
          </div>
            <el-button type="primary" round @click="savePersonalSet('conditions')" style="float:right;margin-right:20px;">保存</el-button>
        </div>

      </div>

      <div v-if="sortCondition.length" class="rank">
        <div class="title-item">
          <span>默认排序</span>
        </div>
        <div class="rank-content">
          <span class="dot"></span>
          <span>查询结果默认排序方式：</span>
          <el-select v-model="personalSet.defOrder.sort" placeholder="请选择"  >
            <el-option
              v-for="item in sortCondition"
              :key="item.name"
              :label="item.name_cn"
              :value="item.name">
            </el-option>
          </el-select>
          <el-select v-model="personalSet.defOrder.order" placeholder="请选择"  >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" round @click="savePersonalSet('sort')" style="float:right;margin-right:20px;">保存</el-button>
          <div class="mark">
            注：您可在查询结果中点击相应表头进行相应的排序！
          </div>
        </div>
      </div>

      <div v-if="findCols.length" class="result">
        <div class="title-item">
          <span>查询结果</span>
        </div>
        <div class="result-content">
          <el-tabs v-model="moduleName" type="card" closable @tab-remove="removeTab" @tab-click="clickTab" class="module-out" ref="module-out">
            <el-tab-pane :key="item.name" v-for="(item) in personalSet.content"
              :label="item.name"
              :name="item.name"   >

              <div class="search-title">
                <el-checkbox-group v-model="checkList" @change="handleResultTitle" >
                  <el-checkbox v-for="(items,key) in findCols" :label="items.name" :key="key">{{items.name_cn}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-tab-pane>
          </el-tabs>

          <div class='content-btn'>
             <p style="float:left;">
                  <el-button type="primary"  @click="CheckAllMould(true)">全选</el-button>
                  <el-button type="warning"  @click="CheckAllMould(false)">清空</el-button>
             </p>
            <el-button type="success" round @click="editMould(false)">保存</el-button>
            <el-button type="primary" round @click="handleSaveMould(false)">新增</el-button>
            <el-button type="primary" round @click="editMould(true)" v-if="setDefault">设为默认</el-button>
          </div>
          <div class="mark">
            注：您可将常用结果保存为常用模板，查询时可选择切换！
          </div>
        </div>
      </div>
    </div>
  </div>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import {ajaxRequest,ajaxSyncRequest,ajaxProxyRequest,ajaxSyncProxyRequest,formatArrayToTree} from '@/components/util/base';
  //个人配置默认项
  const personalDef={
    id:null,           //主键id
    addTime:null,      //新增时间
    updateTime:null,   //更新时间
    status:null,       //状态
    name:null,         //模板名称
    userId:null,       //用户id
    category:null,     //模板分类
    moduleType:null,   //模板类别
    content:null,      //输出列模板
    findWhere:[],      //查询条件
    defOrder:null,     //默认排序  //{ order:'',  //排序方式 asc desc sort:'',   //排序字段  },
    isDefModule:null,  //默认模板名
    isOpen:true,       //默认是否打开
    isDelete:null      //是否删除
  };

  /*父组件需要传一个字段rowsCondition 实为父组件对应json信息*/
    export default {
      name: "mind-personal-settings",
      props:{
        opCode:{//用于控件 基础数据加载
          type:String,
          required:true
        },
        callback:{
          type:Function,
          required:true
        }
      },
      data() {
        return {
          sortCondition:[],
          options: [{
            value: 'desc',
            label: '降序'
          }, {
            value: 'asc',
            label: '升序'
          }],

          userId:"",       //当前登录人id------------当前登录人-------------
          moduleType:'',   //url解析的模板类型--------当前菜单url-------------
          personalSet:{},  //个人设置-----------------个人个性化维护------------
          findCols:[],     //默认展现模板 -------------数据库中配置维护------------
          selIndex:-1,      //选中模板序号---------------------------页面临时变量---------
          checkList:[],     //选中模板-------------------------------页面临时变量---------
          perDefWhere:{show:[],checkList:[]},  //未选条件-----------页面临时变量---------
          perSetWhere:{show:[],checkList:[]},  //已选条件-----------页面临时变量---------
          preDefShow:{show:[],chenkList:[]}, //默认展示条件-----------页面临时变量---------
          DefModuleName:null,
          moduleName:'',//默认显示模板名
        }
      },
      created(){
        this.personLoad();
      },
      mounted(){
        // this.moduleType = this.getModuleType();
        this.moduleType = this.opCode;
        this.userId = localStorage.getItem("userId");
        this.handleDefColor()
      },
      computed:{
        /** 默认模板如果与当前显示模板不一样，则显示设为模板按钮 */
        setDefault(){
          if(this.personalSet.content && this.personalSet.content.length>0 && this.selIndex>=0){
            return this.personalSet.content[this.selIndex]["name"]!=this.personalSet.isDefModule
          }else{
            return true;
          }
        },
        isRight(){//右移动
            return this.perDefWhere.checkList.length>0;
        },
        isLeft(){//左移动
          return this.perSetWhere.checkList.length>0;
        },
        isDefNotAll(){//是否全选判断
            if(this.perDefWhere.checkList.length==this.perDefWhere.show.length){
              return false;
            }else if(this.perDefWhere.checkList.length>0){
              return true;
            }else{
              return false;
            }
        },
        isSetNotAll(){//是否全选判断
            if(this.perSetWhere.checkList.length==this.perSetWhere.show.length){
              return false;
            }else if(this.perSetWhere.checkList.length>0){
              return true
            }else{
              return false;
            }
        },
        isRightAll(){//右部全选
          if(this.perSetWhere.checkList.length>0){
            return this.perSetWhere.checkList.length==this.perSetWhere.show.length;
          }else{
            return false;
          }
        },
        isLeftAll(){//左部全选
          if(this.perDefWhere.checkList.length>0){
            return this.perDefWhere.checkList.length==this.perDefWhere.show.length;
          }else{
            return false;
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
        // 所有字段的类型
        findWheres(){
          return this.$store.state.retrieveTableApi[this.opCode]['dataType']
        }
      },
      updated(){
        this.handleDefColor()
      },
      methods: {
        handleDefColor(){
          this.$nextTick(val => {
            if(!$.isEmptyObject(this.$refs)){
              $(this.$refs['module-out'].$el).find('#tab-'+this.personalSet.isDefModule).siblings().css({'backgroundColor':"#fff",color:'#333'});
              $(this.$refs['module-out'].$el).find('#tab-'+this.personalSet.isDefModule).siblings('.el-tabs__item.is-active').css({'backgroundColor':"#56BC4E",color:'#fff'});
              $(this.$refs['module-out'].$el).find('#tab-'+this.personalSet.isDefModule).css({'backgroundColor':"#1a68a5",color:'#fff'});
            }
          })
        },
        /** 初始化个性化设置 */
        personLoad(){
            if(this.cols.length > 0){
              this.sortCondition=[];
              this.cols.forEach(val=>{
                if(!val.hidden){
                  this.findCols.push(val);
                }
                if(val.sortable){//字段是否允许排序
                  this.sortCondition.push({name:val.name,name_cn:val.name_cn});
                }
              })
            }
            if(this.personalSetInfo && this.personalSetInfo.moduleType){
              this.personalSet=  $.extend({},personalDef,this.personalSetInfo);
              let perSet=this.personalSet;
              if(!this.findWheres || this.findWheres.length==0 ){
                this.$message('无法配置检索条件，默认检索条件为空！')
              }else{
                let mp = perSet.findWhere;
                this.findWheres.forEach((item,index)=>{
                  if(mp.includes(item['w_id'])){
                    this.perSetWhere.show.push({"w_id":item['w_id'],"name_cn":item['name_cn']});
                  }else{
                    this.perDefWhere.show.push({"w_id":item['w_id'],"name_cn":item['name_cn']});
                  }
                });
              }
              this.moduleName=perSet.isDefModule;
              this.DefModuleName=perSet.isDefModule;
              this.selIndex=0;
              if(perSet.content && perSet.content.length>0){
                perSet.content.forEach((val,index)=>{
                  if(perSet.isDefModule && perSet.isDefModule==val['name']){
                    this.selIndex = index;
                    this.moduleName = val['name'];
                    this.checkList = val['checkList'];
                  }else{
                    if(!this.moduleName){
                      this.checkList=perSet.content[this.selIndex]['checkList'];
                      this.moduleName=perSet.content[this.selIndex]["name"];
                    }
                  }
                })
              }else{
                let tmp=[];
                this.findCols.forEach(val=>{
                    tmp.push(val.name);
                })
                perSet.content.push({name:"默认（原始）",checkList:tmp})
                this.checkList=this.personalSet.content[0]['checkList'];
                this.moduleName="默认（原始）";
              }
            }else{
              this.personalSet={
                isDefModule:"",
                content:[],
                defOrder:{order:"",sort:""},
                findWhere:[],
                isOpen:true,
                searchCondition:[]
              };
              this.selIndex=0;
              let tmp=[];
              this.findCols.forEach(val=>{
                if(val['def_show'] == 1){
                  tmp.push(val.name);
                }
              })
              Vue.set(this.personalSet.content, 0,{name:"默认（原始）",checkList:tmp});
              this.checkList=this.personalSet.content[0]['checkList'];
              this.moduleName="默认（原始）";
              this.findWheres.forEach((item,index)=>{
                if(item['def_show'] == 1){
                  this.perSetWhere.show.push({"w_id":item['w_id'],"name_cn":item['name_cn']})
                }else{
                  this.perDefWhere.show.push({"w_id":item['w_id'],"name_cn":item['name_cn']})
                }
              });
            }
        },
        /** 保存【更新，新增调同一个方法】个性化设置  this.personalSet */
        savePersonalSet(slug){
          //取出当前选中条件
          let find_where=[];
          this.perSetWhere.show.forEach((item,i)=>{
            find_where.push(item["w_id"]);
          });
          this.personalSet.findWhere=find_where;
          let param={
            v_user_id:this.userId,//用户id
            v_module_type:this.moduleType,//模板类型
          };
          if(slug=="module"){ //模板
            if(this.personalSet.content[this.selIndex]['checkList'].length == 0){
              this.$message.error('请至少选择一个查询结果！');
              return
            } 
            param['v_content']=this.personalSet.content.length>0?JSON.stringify(this.personalSet.content):'';//模板内容字段
            param['v_is_def_module']=this.personalSet.isDefModule?this.personalSet.isDefModule:'';//是否默认模板
          }
          if(slug=="isOpen"){ //是否开启
            param['v_is_open']=this.personalSet.isOpen?'1':'0';//是否开启
          }
          if(slug=="sort"){ //默认排序字段
            if(!this.personalSet.defOrder.sort || !this.personalSet.defOrder.order){
              this.$message.error('请选择排序条件！')
              return
            }
            param['v_def_order']=this.personalSet.defOrder?JSON.stringify(this.personalSet.defOrder):'';//默认排序字段
          }
          if(slug=="conditions"){ //查询条件
            if(this.perSetWhere.show.length == 0){
              this.$message.error('请至少选择一个检索项！');
              return
            }
            param['v_find_where']=this.personalSet.findWhere.length>0?JSON.stringify(this.personalSet.findWhere):'';//查询条件
          }

          if(!(this.personalSetInfo && this.personalSetInfo.moduleType)){
            if(!param['v_is_open']) param['v_is_open']=this.personalSet.isOpen?'1':'0';//是否开启
            if(!param['v_find_where']) param['v_find_where']=this.personalSet.findWhere.length>0?JSON.stringify(this.personalSet.findWhere):'';//查询条件
            if(!param['v_content']) param['v_content']=this.personalSet.content.length>0?JSON.stringify(this.personalSet.content):'';//模板内容字段
          }

          ajaxProxyRequest('post','/njmind/exeProc/personalSet',param,(res)=>{
             if(res && res['v_msg'] && res['v_msg']=='success'){
               this.$message.success("保存成功！");
             }else if(res['v_msg']){
               this.$message.error(res['v_msg']);
             }else{
               this.$message.error("保存失败！");
             }
          });
        },
        /** 模板输出变化时 */
        handleResultTitle(value){
          this.personalSet.content[this.selIndex]['checkList']=value;
        },
        /** 切换模板 */
        clickTab(tab){
          let tabs = this.personalSet.content;
          tabs.forEach((item, index) => {
            if (tab.name === item.name) {
              this.selIndex=index;
              this.checkList=item.checkList;
            }
          });
        },
        /** 移除模板 */
        removeTab(tab){
          this.$confirm('确定删除模板【'+tab+'】?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let tabs = this.personalSet.content;
            for(let i=0;i<tabs.length;i++){
              if(tabs[i].name==tab){//默认模板
                if(tab=="默认（原始）"){
                  this.$message({
                    type:'error',
                    message:'原始模板不可删除'
                  });
                  return
                }else{
                  this.selIndex=0;
                  tabs.splice(i,1);
                  if(tab==this.personalSet.isDefModule){
                    this.personalSet.isDefModule='';
                  }
                  if(tabs.length==0){
                      let tmp=[];
                      this.findCols.forEach(val=>{
                        if(val['def_show'] == 1){
                          tmp.push(val.name);
                        }
                      })
                      Vue.set(this.personalSet.content, 0,{name:"默认（原始）",checkList:tmp});
                      this.moduleName="默认（原始）";
                      this.personalSet.isDefModule="默认（原始）";
                      this.checkList=tmp;
                  }else{
                    this.checkList=this.personalSet.content[this.selIndex]['checkList'];
                    this.moduleName=this.personalSet.content[this.selIndex]['name'];
                  }
                  this.savePersonalSet('module');
                }
              }
            }
          }).catch(() => {

          });
        },
        /** 编辑模板 保存 */
        editMould(slug){
          if(this.personalSet.content[this.selIndex]['name']=='默认（原始）'){ //若是原始模板保存 即为新增模板并设为默认模板
            this.moduleName='默认';
            this.personalSet.content[this.selIndex]["name"]='默认';
            this.personalSet.isDefModule='默认';
            this.savePersonalSet('module');
            // this.handleSaveMould(true);
            return
          }
          if(slug && slug==true){
            this.personalSet.isDefModule = this.personalSet.content[this.selIndex]['name'];
          }
          this.savePersonalSet('module');
        },
        /** 新增模板 */
        handleSaveMould(flag){ //flag是否将新增模板设为默认模板
          const _this = this;
          if(this.personalSet.content[this.selIndex]['checkList'].length == 0){
            this.$message.error('请至少选择一个查询结果！');
            return
          }
            this.$prompt('请输入模板名称', '提示',{
              confirmButtonText: '保存',
              center:true,
              confirmButtonPosition:'left',
              beforeClose(action, instance, done){
                if(action == 'confirm'){
                  var value = instance.$refs.input.$vnode.data.props.value;
                  if(value==null){
                    this.$message({
                      type: 'error',
                      message: '模板名称不能为空'
                    });
                    return
                  }

                  let arr = _this.personalSet.content.filter(v=>{return v.name==value});
                  if(arr.length>0){
                    _this.$message({
                      type: 'error',
                      message: '模板名称重复'
                    });
                  }else{
                    _this.moduleName=value;
                    if(flag==true){//保存 默认模板保存时触发
                      _this.personalSet.content[_this.selIndex]["name"]=value;
                      _this.personalSet.isDefModule=value;
                    }else{//新增
                      let ckList=_this.personalSet.content[_this.selIndex]['checkList'];
                      _this.personalSet.content.push({"name":value, "checkList":ckList});
                      _this.selIndex=(_this.personalSet.content.length-1)
                    }
                    _this.savePersonalSet('module');
                    done();
                  }
                }else{
                  done();
                }
              }
            }).then(({ value }) => {
            },(rej)=>{
            });
        },
        /** 全选模板所有列 */
        CheckAllMould(flag){
          this.checkList=[];
          if(flag){
            this.findCols.forEach(v=>{
              this.checkList.push(v.name)
            })
          }
          this.personalSet.content[this.selIndex]['checkList']=this.checkList;
        },
        /** 选中查询条件 */
        ckConditons(vlaue){
          //console.log(vlaue);
          //console.log("未选条件",this.perDefWhere);
          //console.log("已选条件",this.perSetWhere);
        },
        /**
         * [moveLeft 查询条件设置 取消设置条件]
         * @return {[type]} [description]
         */
        moveLeft(){
          this.moveParam(this.perSetWhere,this.perDefWhere);
        },
        /**
         * [moveLeft 查询条件设置 设置为设置条件]
         * @return {[type]} [description]
         */
        moveRight(){
          this.moveParam(this.perDefWhere,this.perSetWhere);
        },
        /** 左右数据转移 */
        moveParam(fromVal,targetVal){
          if(fromVal.checkList && fromVal.checkList.length>0){
            let shows = fromVal.show;
            let ckList = fromVal.checkList;
            //debugger
            ckList.forEach((item,index)=>{
              for(let i=(shows.length-1);i>=0;i--){
                if(shows[i]["w_id"]==item){
                  targetVal.show.push(shows[i]);
                  fromVal.show.splice(i,1);
                }
              }
            });
            fromVal.checkList=[];
          }
        },
        /** 全选/全取消 */
        checkAllDef(value){
          this.checkAll(value,this.perDefWhere);
        },
        /** 全选/全取消 */
        checkAllSet(value){
          this.checkAll(value,this.perSetWhere);
        },
        /** 全选/全取消 */
        checkAll(value,pp){
          if(value){
            pp.checkList=[];//重置全部选中
            pp.show.forEach((item,i) => {
              pp.checkList.push(item['w_id']);
            });
          }else{
            pp.checkList=[];//置空
          }
        },
        moveUp(index){//上移
          if(index!=0){
            var temp = this.perSetWhere.show[index];
            Vue.set(this.perSetWhere.show, index, this.perSetWhere.show[index-1]);
            Vue.set(this.perSetWhere.show, index-1, temp);
          }
        },
        moveDown(index){//下移
          if(index < this.perSetWhere.show.length-1){
            var temp = this.perSetWhere.show[index];
            Vue.set(this.perSetWhere.show, index, this.perSetWhere.show[index+1]);
            Vue.set(this.perSetWhere.show, index+1, temp);
          }
        },
        // getModuleType(){
        //   //通过路径获取调用当前组件的父组件名称【文件名.vue】
        //   let currentRouter = this.$route,
        //       currentType = '';
        //   if(currentRouter.matched && currentRouter.matched.length){
        //     currentRouter.matched.forEach(val => {
        //       if(val.path == currentRouter.path){
        //         currentType = val.components.default['__file']
        //       }
        //     })
        //   }
        //   let index = currentType.lastIndexOf('\\');
        //   currentType = currentType.substring(index+1)
        //   currentType = currentType.substring(-1,currentType.lastIndexOf('.'))
        //   this.currentType = currentType;
        //   return currentType
        // },
        handleClose(){
          if(this.callback){
            this.callback(this.personalSet);
          }
        },

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

      }
    }
</script>

<style scoped lang="scss">
  .module-out.el-tabs--card>.el-tabs__header .el-tabs__item.is-active.is-closable{
    background-color:#fff;
    color:#333;
  }
  .moveLeft{
    margin-bottom: 20px;
  }
  .conditionsSetItem{
    justify-content: space-between;
    p{
      span{
        cursor:pointer;
      }
    }
  }
  body,p{
    margin:0;
    padding:0;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
  .left-menu{
    width:190px;
    display:inline-block;
    padding: 10px 10px 40px;
  }
  .right-content{
    /*position: absolute;
    left:200px;
    top:0;
    right:0;*/
    width:auto;
    /*display:inline-block;*/
    padding: 0px 20px 20px 20px;
    bottom:0;
    overflow: auto;
  }
  .default-start{
    text-align: center;
    height:40px;
    line-height:40px;
    /*padding-top:42px;
    box-sizing: border-box;*/
  }

  .setting{
    background: #1fbba6;
    color:#fff;
    text-align: center;
    height:42px;
    font-size:16px;
    line-height: 42px;
  }
  .conditions{
  }

  .conditions .conditions-content{
    width:100%;
    margin:0 auto;
    overflow: hidden;
    position:relative;
  }

  .conditions-content >.action{
    display:inline-block;
    margin-top: 235px;
    vertical-align: top;
    width:15%;
    float: left;
    text-align: center;
    color: #409EFF;
    font-size:30px;
    font-weight:bold;
    cursor: pointer;
  }
  .conditions .all-conditions,
  .conditions .set-conditions{
    width:42%;
    height:530px;
    display:inline-block;
    float:left;
  }
  .conditions .all-conditions>ul,
  .conditions .set-conditions>ul{
    height:420px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    overflow-y: auto;
    padding-left:20px;
    padding-top:10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .conditions .all-conditions>ul li,
  .conditions .set-conditions>ul li{
    list-style: none;
    font-size:16px;
    height:29px;
    line-height:29px;
    padding-right:20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .conditions .all-conditions>div,
  .conditions .set-conditions>div{
    justify-content: center;
    align-items: center;
    color: #333;
    font-size:16px;
    margin: 40px 0 16px;
  }
  .conditions .all-conditions>ul{
    background: #f3f3f3;
  }
  .conditions .set-conditions>ul{
    border:1px #409EFF solid;
  }
  .conditions .set-conditions>ul li>p:nth-of-type(1){
    float:left;
    margin:0;
    min-width: 88px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width:63%;
  }
  @media screen and (max-width:1200px) and (min-width: 1100px){
    /*.conditions .conditions-content{
      width:80%;
    }*/
  }
  @media screen and (max-width:1100px) and (min-width: 768px){
    .conditions .conditions-content{
      width:100%;
    }
    .conditions .set-conditions>ul li>p:nth-of-type(1){
      max-width:50%;
      min-width:50px;
    }
  }
  .conditions .set-conditions>ul li>p:nth-of-type(2){
    float:right;
    margin:0;
    width:60px;
  }
  .conditions .set-conditions>ul li>p>span{
    cursor:pointer;
    font-weight:bold;
  }

  span.dot{
    width:10px;
    height:10px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background:#409EFF;
    display:inline-block;
  }
  .rank-content{
    margin: 30px 0 50px;
  }
  .rank-content span{
    font-size:16px;
  }
  .rank-content .el-select{
    width:180px;
  }
  .rank-content .el-select .el-input{
    height:35px;
  }
 .mark{
    box-sizing:border-box;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    background: #e1f5fe;
    height:40px;
    line-height:40px;
    color:#333;
    padding-left:8%;
    border:1px #c8e4e8 solid;
    font-size:14px;
    margin:20px 0 15px;
    width:100%;
  }

  @media screen and (max-width:1100px) and (min-width: 768px) {
    .rank .mark{
      width:100%;
    }
  }
  .mould-item{
    display:inline-block;
    position:relative;
    background:#21b9aa;
    line-height: 30px;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    border-radius: 30px;
    color:#fff;
    text-align: center;
    font-size:14px;
    padding: 0 20px;
    margin-right:25px;
    margin-bottom:20px;
    cursor:pointer;
  }
  .mould-item.active{
    background: #c1c1c1;
  }
  .mould-item >span{
    position: absolute;
    top:-5px;
    right:-5px;
    font-size:20px;
    color:#8b8b8b;
    background: #fff;
    cursor:pointer;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .dot-box{
    margin-bottom:15px;
    font-size:16px;
  }
  .search-title{
    box-sizing: border-box;
    width:100%;
    min-height:100px;
    height:auto;
    background: #f2f2f2;
    margin:20px 0;
    padding: 20px;
  }
  .search-title .el-checkbox{
    margin-left:5px;
    margin-bottom:10px;
    width:160px;
  }
  .result .actions-btn{
    text-align: right;
  }
  .right-content{
    position: relative;
    /*height:600px;
    overflow:auto;*/
  }

  .moveRight,.moveLeft{
    margin: 15px auto;
    width: 35px;
    height: 35px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background: #f5f7fa;
    color:#c0c4cc;
    border: 1px #c0c4cc solid;
  }
  .moveRight i,.moveLeft i{
    font-size:20px;
  }
  .moveRight.active,.moveLeft.active{
    background: #00b6ff;
    color:#fff;
  }
  .content-btn{
    text-align: right;
  }
  .but-qx{background: none!important;
    border: none!important;
    color: #333!important;
    font-size: 14px!important;
    left: 5px!important;
    margin-left: -15px!important}

    .but-qk{background: none!important;
    border: none!important;
    color: #ff8585!important;
    font-size: 14px!important;
    left: 5px!important;
    margin-left: -15px!important}
    .el-button--success{color: #ffffff;
    border: none;
    background: #67c23a;}
</style>
