<template>
  <div className="box">
    <div class="box-top" >
      <TopMenu @changMenuEvent="refreshLeftMenu"   /> <!-- :sid0="sidtran" -->
        <div class="userInfo" style="font-size:20px; padding-top:8px;" >
            <span style="position:relative;">
            <i  class="el-icon-other-code" @mouseenter="enter" @mouseleave="leave" style="font-size:45px;" ></i>
            <div class="fontBoxes"  v-show="displayBox" @mouseleave="leaveSpan" @mouseenter="enterSpan">
              <div>
                  <span class="fontBiao but editorClass" @click="changeFont(1)">上标</span>
                  <span class="fontBiao but editorClass" @click="changeFont(2)">下标</span>
                  <span class="fontBiao but editorClass" @click="changeFont(3)">换行</span>
                  <span class="fontBiao but editorClass" @click="changeFont(4)">斜体</span>
              </div>
                 <p style="font-size:14px;padding:15px 0px;">通用特殊字符</p>
              <div style="overflow: auto;">
                <!-- <el-scrollbar style="height:100%"> -->
                <span  v-for="(myFont,index) in currencyFonts" :key="index" class="fontBox but editorClass commonFont" @click="copyMe($event)">{{myFont.myFont}}</span>
                <!-- </el-scrollbar> -->
              </div>
               <p style="font-size:14px;padding: 15px 0px;">自有特殊字符</p>
              <div>
                <span  v-for="(myFont,index) in selfFonts" :key="index" class="fontBox but editorClass diyFont" @click="copyText($event)">{{myFont.remark}}</span>
              </div>
            </div>

          </span>

            <!-- <el-badge :value="200" :max="99" class="msg">
              <el-button icon="el-icon-msgs" @click="checkMessage" style="background: transparent; color: #ffffff; font-size: 47px; padding: 0px;  border: 0px;"></el-button>
            </el-badge> -->

          <div class="el-icon-oa-zxry introduce" style="font-size:26px;" >
          <el-row class="el-introduce">
              <p style="text-align:center; color:#565656;">
                <img src="../../assets/name-img.png" style="width:25%;">
                <p style="color: rgb(86, 86, 86);
    padding-top: 7px;
    font-size: 14px;
    text-align: center;
    overflow: hidden;
    height: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;">{{username}}</p>
              <div style="text-align:center;margin-top:8px;">
               <!-- <div>
                <span style="font-size:12px; cursor:pointer;" @click="colorShow = !colorShow" >背景切换</span>
                  <div v-show="colorShow" style="margin-top: 10px;margin-bottom: 10px; color:#fff;">
                  <span style="width:50px;height:50px;background:#1d74b7;padding:8px 11px; border-radius:20px;color:#fff;font-size: 1px;">1</span>&nbsp;&nbsp;
                  <span style="width:50px;height:50px;background:#41414d;padding:8px 11px; border-radius:20px;color:#fff;font-size: 1px;">2</span>&nbsp;&nbsp;
                  <span style="width:50px;height:50px;background:#aa3e3e;padding:8px 11px; border-radius:20px;color:#fff;font-size: 1px;">3</span>&nbsp;&nbsp;
                  </div>
                </div>

                <div style="margin-top:6px;">
                  <span class="" style="font-size:12px; cursor:pointer;" @click="zfShow = !zfShow">字符切换</span>
                   <div v-show="zfShow" style="margin-top: 8px; color:#fff;">
                  <span style="color:#565656;">符号</span>&nbsp;&nbsp;
                  <span  style="color:#565656;" >文字</span>&nbsp;&nbsp;
                  </div>
                </div>
                <div><el-button type="text" @click="reconnectLogin" style="color: #3094e0;">登录即时通讯</el-button></div>-->
                <div><el-button type="text" @click="logOut" style="color: #3094e0;">退出</el-button></div>

              </div>
          </el-row>
         </div>



        </div>
    </div>
    <div class="box-left" :class="!!isCollapse ? 'autoSizeLeft': ''" style=" transition: all 0.3s;">
      <LeftMenu :menu="leftMenu" /><!-- :sid1="sidtran" -->
    </div>
    <div class="box-right" v-loading="adminLoading" element-loading-spinner="el-icon-loading" :class="!!isCollapse ? 'autoSize': ''" style=" transition: all 0.3s;">
      <tabs-views></tabs-views>
      <div class="tbs_info" >
      <transition name="fade" mode="out-in" >
        <!-- cachedViews不起作用，原因：需要组件名，目前组件全部匿名 -->
        <keep-alive :include="cachedViews">
          <router-view v-if="refrenceTagComp" :src="$route.meta.id"></router-view>
        </keep-alive>
      </transition>
      </div>
    </div>

    <MessageInfoList v-if="isCheckMessage" :callback="handleMessageCallback"></MessageInfoList>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import TopMenu from '../framework/TopMenu';
  import LeftMenu from '../framework/LeftMenu';
  import Tabs from '../framework/Tabs';
  import TabsViews from '../framework/tabviews';
  import {ajaxRequest,ajaxProxyRequest, formatArrayToTree} from '../util/base';
  import vueBus from 'vue-bus';
  import '../util/Base.css';
  import MessageInfoList from '../message/MessageInfoList';

  //import {Badge,Button, Menu,MenuItem,Switch,Icon,CheckboxGroup,Checkbox} from 'element--ui';

/*
  //通过菜单动态加载的
  import WorkMould from '../mould/WorkMould';
  import ResourceTable from '../resource/ResourceTable';
  import ResourceManagement from '../resources/ResourceManagement';
  import ParameterTableTemplate from '../parameter/ParameterTableTemplate';
  import LogTable from '../log/LogTable';
  import UserTable from '../user/UserTable';
  import TimeTable from '../time/TimeTable';
  import DictTable from '../dict/DictTable';
  import Retrieve from '../Retrieve';
  import DepartTable from '../base/departPost/DepartTable';
  import Iframe from '../framework/Iframe';
*/
  let tabIndex=0;

  let map={

        /**
           key是菜单项的id，import的参数是要加载的模块
           在加载菜单时完善该部分根据后台的配置的菜单项处理 具体方法见  loadMenuMap
           该页面中引入的模块要
           1、import 引入，components 模板引用 只需要本页面中使用到的 vue模板引入即可，菜单使用的是动态加载方式无需在本页面手动引入
           2、菜单路径在》资源管理中》修改菜单的url配置
                注意：无需输入  ../  路径是 components 下的路径
        -------------------------------------------------------------------------------------
          '40':() => import('../resources/ResourceManagement'),
          //'41':() => import('../resource/ResourceTable.vue'),
          '42':() => import('../parameter/ParameterTableTemplate.vue'),
          '43':() => import('../log/LogTable'),
          '44':() => import('../user/UserTable'),
          '45':() => import('../time/TimeTable'),
          '46':() => import('../dict/DictTable'),
	  '58':() => import('../outerNet/register/registerList'),
          '41' :() => import('../base/role/RoleTable'),
          '61':() => import('../base/company/businessGroupList'),
          '101' :() => import('../base/departPost/DepartTable'),
          '68':() => import('../quality/technicalBasis/technicalBasisForm'),
          '69':() => import('../quality/technicalBasis/technicalBasisList'),
          '47':'<template><div style="height:100%"><div style="height:100%"><iframe src=\'http://192.168.1.110:8081/back/druid/weburi.html\'/></div></div></template>'
          */
    };
  let exist={ //key是菜单项的id，value是打开的tab的name

  };

/*   Vue.use(Button);

 ;
  Vue.use(Menu);
  Vue.use(MenuItem);
  Vue.use(Switch);
  Vue.use(Icon);
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup);
  Vue.use(Badge); */
  Vue.use(vueBus);
  import Layout from '@/components/integration/admin'
  import Router from '@/router'
  import Cookies from 'js-cookie';




    export default {
        name: "admin",
        components:{
          /** 模块对象 import 进来 后的别名  */
          //WorkMould,ResourceTable,Retrieve,ParameterTableTemplate,LogTable,UserTable,ResourceManagement,TimeTable,DictTable,Iframe
          TopMenu,LeftMenu,Tabs,TabsViews,MessageInfoList
        },
      data(){
          return{
            colorShow:false,
            zfShow:false,
            isSetting:0,
            menuIndex:7,
            tempValue:null,
            /** sidtran:"兄弟组件间交互缓存变量",*/
            leftMenu:[],
            username:"",
            isCheckMessage:0,
            messageNum:0,
            displayBox:false,
            adminLoading:false,
            myTime:"",//定时器
            currencyFonts:[{myFont:"Ａ"},{myFont:"Ｂ"},{myFont:"Ｃ"},{myFont:"Ｄ"},{myFont:"Ｅ"},
              {myFont:"Ｆ"},{myFont:"Ｇ"},{myFont:"Ｈ"},{myFont:"Ｉ"},{myFont:"Ｊ"},{myFont:"Ｋ"},
              {myFont:"Ｌ"},{myFont:"Ｍ"},{myFont:"Ｎ"},{myFont:"Ｏ"},{myFont:"Ｐ"},{myFont:"Ｑ"},
              {myFont:"Ｒ"},{myFont:"Ｓ"},{myFont:"Ｔ"},{myFont:"Ｕ"},{myFont:"Ｖ"},{myFont:"Ｗ"},
              {myFont:"Ｘ"},],//通用字list
           selfFonts:[],//自造字list
          }
      },
      computed:{
        routers(){
          /**
           * TODO 案例 VUEX 参数调用 this.$store.state.**
           * 具体全局有哪些 vuex 存储变量
           * 见 src/modules/index.js 文件中的申明
           *
           */
          return this.$store.state.admin.routers
        },
        isCollapse(){
          return this.$store.state.admin.sidebarSlug
        },
        cachedViews(){
          return this.$store.state.tagViews.cachedViews
        },
        refrenceTagComp(){
          return this.$store.state.tagViews.refrenceTagComp
        },
        iframeHeight(){
          return this.$store.state.admin.window_innerHeight-110;
        },
      },
      watch:{
        routers(){
          this.leftMenu = this.routers;
        },
      },
      methods:{
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
          }, 500);
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
        getTabName(node,index){
          if(node != null){
              if(node.id == index){
                return node;
              }else{
                var children = node.children;
                if(children != null && children.length > 0){
                  for(var i = 0; i < children.length; i ++){
                    var child = this.getTabName(children[i],index);
                    if(child != null) return child;
                  }
                }
              }
          }
        },
        getMenuName(index){
          //console.log(this.leftMenu);
          if(this.leftMenu != null && this.leftMenu.length > 0){
            for(var i = 0 ; i < this.leftMenu.length; i ++){
              var node = this.getTabName(this.leftMenu[i],index);
              if(node != null) {
                return node.name;
              }
            }
          }
          return '标签页';
        },
        openNewTab(index){
          /*index就是菜单的id，然后需要自己搜索到菜单的数据，panel变量的title需要修改*/
          if(exist[index]){
            this.$refs.tab.editableTabsValue=exist[index];
          }
          else{
            var menuItem = map[index].vueObj;
            if(Object.prototype.toString.call(menuItem) === "[object Function]"){
                var name = this.getMenuName(index);
               // debugger;
 				      /*动态加载模板，此处返回Promise，拿到模板实例，放入tab标签页里*/
              map[index].vueObj().then((res) => {
                //console.log(res)
                let panel = {
                  title: name,
                  name: (tabIndex++) + '',
                  content: Vue.extend(res.default),
                  surl:map[index].menu.url
                };
                //debugger;
                console.log(panel);
                //调用 Tabs.vue 子组件
                this.$refs.tab.handleTabsAdd(panel);
                exist[index] = panel.name;
                /**
                // TODO 20180509 因<Tabs.vue> 组件直接传值 已经调通顾舍弃该方式
                if(map[index].menu.url!=null && map[index].menu.url.indexOf("http")==0){
                    //准备http url
                    this.tempValue=map[index].menu.url;
                }
                */
              });
            }else{
              let panel = {
                title: name,
                name: (tabIndex++) + '',
                content: Vue.extend({template:"<div>没有模块</div>"})
              };
              this.$refs.tab.handleTabsAdd(panel);
              exist[index] = panel.name;
            }
          }
        },
        /** 加载即时通讯 */
        loadLayIm(){
          //debugger
          //import "./static/js/layim/layimIndex.js";//及时通讯实例化js
          // let list=document.getElementsByTagName("script");
          // let hasLayim=false;
          // //debugger
          // if(list){
          //   for(let i=0;i<list.length;i++){
          //      //后缀匹配“static/js/layim/layimIndex.js”
          //     let src= list[i].src;
          //     if(src.lastIndexOf("static/js/layim/layimIndex.js")!=-1){
          //       hasLayim=true;
          //       break;
          //     }
          //   }
          // }
          // let _this=this;
          //   //脚本是否存在
          //   if(!hasLayim){
          //     //判断是否已经存在 该方法如果不存在则 创建
          //     let script=document.createElement('script');
          //     script.src='./static/js/layim/layimIndex.js';
          //     document.body.appendChild(script);

          //     script.onload=function(){
          //       //调用 客户端 登录 TODO 20180628
          //       window.createLayIm();
          //       window.callBackToRouterMenu((msg)=>{
          //         _this.jumperMenu(msg);
          //       });
          //     }
          //   }else{
          //     //localStorage.setItem("layim-id", data.id);
          //     //localStorage.setItem("layim-token", data.token);
          //     window.createLayIm();
          //     window.callBackToRouterMenu((msg)=>{
          //         _this.jumperMenu(msg);
          //     });
          //   }
            window.createLayIm();
            window.callBackToRouterMenu((msg)=>{
              this.jumperMenu(msg);
            });
        },
        /** 跳转菜单 */
        jumperMenu(msg){
          this.adminLoading = true;
          this.$store.dispatch('handleRoutes',{mPid:msg.parentId}).then(res => {
            sessionStorage.setItem('topMenuId', msg.parentId)
            this.$store.commit('SET_ACTIVE', msg.parentId)
            this.$router.push(msg.path)
            this.adminLoading = false;
          })
        },
        /** 登录即时通讯 */
        reconnectLogin(){
          window.quitLayim("重新登录连接！");
          window.reconnect(window.initEventHandle);
        },
    //     handleClosePanel(name){
 			// /*关闭标签页时，删掉对应关系*/
    //       for(let i in exist){
    //         if(exist[i]===name){
    //           delete exist[i];
    //         }
    //       }
    //     },
    //     personalSetting(flag){
    //       this.isSetting=flag;
    //     },
    //     traveTree(node){//element--ui 树节点children[]长度未0设为null
    //       if(node.children.length == 0){
    //         node.children = null;
    //       }else{
    //         var children = node.children;
    //         for(var i = 0 ; i < children.length; i ++){
    //           this.traveTree(children[i]);
    //         }
    //       }
    //     },
    //     toTreeData(data){//闭包遍历
    //       var pos={};
    //       var tree=[];
    //       var i=0;
    //       while(data.length!=0){
    //         if(data[i].pid==0){
    //           tree.push({
    //             id:data[i].id,
    //             name:data[i].name,
    //             icon:data[i].icon,
    //             children:[]
    //           });
    //           pos[data[i].id]=[tree.length-1];
    //           data.splice(i,1);
    //           i--;
    //         }else{
    //           var posArr=pos[data[i].pid];
    //           if(posArr!=undefined){

    //             var obj=tree[posArr[0]];
    //             for(var j=1;j<posArr.length;j++){
    //               obj=obj.children[posArr[j]];
    //             }
    //             obj.children.push({
    //               id:data[i].id,
    //               name:data[i].name,
    //               icon:data[i].icon,
    //               children:[]
    //             });
    //             pos[data[i].id]=posArr.concat([obj.children.length-1]);
    //             data.splice(i,1);
    //             i--;
    //           }
    //         }
    //         i++;
    //         if(i>data.length-1){
    //           i=0;
    //         }
    //       }

    //       for(var j = 0; j < tree.length; j ++) {
    //         this.traveTree(tree[j]);
    //       }
    //       return tree;
    //     },
        /** 顶部一级菜单 点击触发该方法 */
        refreshLeftMenu(id){
          /**
           * TODO 案例 VUEX 通讯  使用  this.$store.dispatch 调用自定义 store中actions 内申明的方法体
           * 例如，该处调用的是  src/modules/admin/admin.js 中 actions 内 handleRoutes 方法
           */
          this.$store.dispatch('handleRoutes',{mPid:id})
        },
        //初始化二级菜单模块指向 通过监控  watch 》 leftMenu 变化
      //   loadMenuMap:function(param){
      //    let rows=( param==null ? this.leftMenu : param );
      //     for(let i=0;i<rows.length;i++){
      //         let row=  rows[i];
      //         //console.log("加载菜单："+row.name+">"+row.url);
      //         //加载components 路径下的组件 数据库存储存相对地址即可
      //         if(row.id!=null && row.url!=null && row.url.indexOf("http")==-1){
      //           *  ()=> {代码段}  是   ES6的Lambda表达式
      //            * var p1 = document.getElementById('test1');
      //            * ES5写法
      //            *     p1.addEventListener( 'click',
      //            *        function(){ //this指向其调用着p1；
      //            *          this.style.color = "red";
      //            *        },
      //            *        false );
      //            * ES6写法
      //            *     p1.addEventListener( 'click',
      //            *       () => { //this 就是定义时所在的对象，而不是使用时所在的对象。
      //            *          this.style.color = "red";
      //            *        },
      //            *        false );
      //            *
      //            * 在ES5语法中，this指向其调用着p1；
      //            * 在ES6语法中，函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
      //            * 普通函数中，this对象的指向是可变的；
      //            * 箭头函数中，this对象的指向是固定的。
      //            * this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。
      //            * 由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向。
      //            *

      //             //TODO 20180509 修复上级菜单路径为‘/’或‘\’ 不加入可点目录
      //             if(row.url!="/" && row.url!="\\" ){
      //               map[row.id] ={ vueObj:() => import("../"+row.url) ,menu: row} ;
      //             }
      //             //id:{ obj:() => import('../resources/ResourceManagement'),menu:{}}
      //             if(row.children!=null){
      //               this.loadMenuMap(row.children);
      //             }
      //         }else if(row.id!=null && row.url!=null && row.url.indexOf("http")==0){
      //             //map[row.id] =  () => import('../framework/Iframe') ;
      //              map[row.id] ={ vueObj: () => import('../framework/Iframe') ,menu: row} ;
      //             //'<template><div style="height:100%"><div style="height:100%"><iframe src=\''+row.url+'\'/></div></div></template>';
      //         }
      //     }
      //     //debugger;
      //   }
      // },
        //退出
        logOut() {
          window.quitLayim("退出系统！");
          ajaxRequest('get','back/sys/logout',{
            }, (res) => {

            }
          );
          this.$store.commit('CLEARVIEWS');
          $(`.tbs_info .iframeClass`).each(function(index,val) {
            setTimeout(value => {
              try{
                if($(val)[0].contentWindow.globalEvents){
                  let tempEvents = $(val)[0].contentWindow.globalEvents;
                  tempEvents['_destroyed'](tempEvents['_this'])
                }
              }catch(e){
              }finally{
                $(val).remove()
              }
            },0)
          })
          setTimeout(val => {
            localStorage.clear();//清除当前保存的登录信息
            sessionStorage.clear();//清除当前保存的登录信息
            this.$router.push("/login");
          },0)
        },
        checkMessage(){
          this.isCheckMessage=1;
        },
        handleMessageCallback(){
          this.isCheckMessage=0;
        },
        getWbInfo(){
          //连接websocket
          /* if(!window.WebSocket){
            window.WebSocket = window.MozWebSocket;
          }
          if(window.WebSocket){
            let socket = new WebSocket("ws://192.168.1.110:8081/websocket/1");
            //发送消息回调
            socket.onmessage =(event) =>{
              console.log(event.data);
              let odata = event.data?JSON.parse(event.data):{};
              this.messageNum = !$.isEmptyObject(odata)?odata.content:0;
              //console.log(odata,this.messageNum)

            };
            //握手成功回调
            socket.onopen = function (event) {

            };
          } */
        },
      },
      mounted(){
        //debugger
        //console.group('%c%s', 'color:blue', 'mounted 挂载状态===============组件1》')
        //菜单初始化默认加载


        //this.loadLayIm();
          /**
           * TODO 案例 VUE-BUS 使用案例A 【A组件与B组件通讯】注意：bus监听 this.$bus.on 申明必须在（mounted中）组件加载完成后
           * 主要有两个方法
           *      1、申明监听响应方法名  this.$bus.on('监听响应的方法名',(res)=>{this.url=res.param; });
           *      2、发送信息给指定监听  this.$bus.emit('监听响应的方法名',{参数})
           *
           * amdin.vue 申明一个bus监听【bus-admin】接收其他组件发送过来的信息
           *  res 为 其他组件调用 bus-admin 时传入的参数。
           *  约定参数规范
           *  res={
           *    source:'来源标识',
           *    fun:'来源组件接收的bus监听编码，用于回调',
           *    param:'相关传入参数'
           *  }

          // TODO 20180509 因<Tabs.vue> 组件直接传值 已经调通顾舍弃该方式
          let monitor_code='bus-admin';
          this.$bus.on(monitor_code,(res)=>{
            // 确认是哪个组件已经加载完成 可以根据差异 区别处理
            if("Iframe.vue"==res.source){//iframe 引入其他来源页面 tempValue 当前组件中创建的一个临时变量
              console.log("向 Iframe.vue 传值："+this.tempValue);
              //发送消息：回调 来源组件的监听编码,同时传入参数
              this.$bus.emit(res.fun, {source:"admin.vue",fun:"",param:this.tempValue}  );
            }
          })
          */

      },

      activated(){
        this.leftMenu=this.routers;
        let name = window.localStorage.getItem("userName");
        if(name== undefined || name == null) {
          this.username = "";
        }else {
          this.username = name;
        }

        this.loadLayIm();
      },
      created(){
        this.getWbInfo();
        this.getFonts();
      },
      update(){
        this.getWbInfo();
      }
      /*,
      beforeCreate () {
                //console.group('%c%s', 'color:blue', 'beforeCreate 创建前状态===============组件1》')
      },
      created () {
               //console.group('%c%s', 'color:blue', 'created 创建完毕状态===============组件1》')
      },
      beforeMount () {
                //console.group('%c%s', 'color:blue', 'beforeMount 挂载前状态===============组件1》')
      },
      beforeUpdate () {
                //console.group('%c%s', 'color:blue', 'beforeUpdate 更新前状态===============组件1》')
      },
      updated () {
                //console.group('%c%s', 'color:blue', 'updated 更新状态===============组件1》')
      },
      beforeDestroy () {
                //console.group('%c%s', 'color:blue', 'beforeDestroy 破前状态===============组件1》')
      },
      destroyed () {
                //console.group('%c%s', 'color:blue', 'destroyed 破坏状态===============组件1》')
      }*/
    }
</script>

<style scoped >
  .fontBoxes{
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
  .fontBox{
    font-family: "njmindFont";
    margin: 1px;
    cursor: pointer;
    font-size: 20px;
    float: left;
    border: 1px solid #eaeaea;
    padding: 2px;
    width: 42px;
    text-align: center; height: 23px;
    overflow:hidden;
}
  .fontBox:hover{
    background-color: rgb(143,197,239);
  }
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸
.tbs_info:first-of-type ::-webkit-scrollbar   {
    display: block;
    width: 5px;
    height: 8px;
    background-color: #F5F5F5;
}
.tbs_info>div{
  overflow: auto;
}
*/

.custom-1d74b7 p{line-height: 0!important;}
.userInfo{
    position: absolute;
    top: 0px;
    right: 0px;
    /*background: red;*/
    height: 60px;
    width: 250px;
    font-size: 45px;
    color: #fff;
    border-left: 1px solid white;
    padding-left: 17px;
}
.custom-1d74b7 .box-top .msg {
    margin-top: -25px!important;
    margin-right: 15px!important;
    margin-left: 13px!important;
}

::-webkit-scrollbar   {
    display: none;
}
.el-icon-oa-zxry:before{ content: "\E718";position: relative;
    top: -6px;
    left: 15px; }
  .el-introduce{
  position: absolute;
    z-index: 999;
    background: #ffffff;
    border: 1px solid #3094e0;
    border-radius: 5px;
    color: #3094e0;
    width: 66%;
    margin-left: -57px;
    word-break: break-all;
    margin-top: 12px;
    font-size: 14px;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
    /* text-align: center; */
    padding: 5px 10px;}

    .introduce::after {
  content: "";
    width: 41px;
    height: 46px;
    position: absolute;
    /* z-index: 999; */
    /* top: 0; */
    /* left: -65px; */
    margin-left: -28px;}

/* .shuoming .el-sm{
    display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
   }
*/
  .introduce .el-introduce{
    display: none;
   }
  .introduce:hover  .el-introduce{
    display: block;
   }
</style>
