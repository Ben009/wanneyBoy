
/** 登录后获取到的token */
var websocketurl=""; //socket 服务
var showmsg,lm,getLayimWebPrefix,callToMenu,initEventHandle,findMyMsg;
var logout_flag=false;



/** 创建客户端 */
function createLayIm(){
    //调用登录 登录成功后生成 客户端
    console.log("createLayIm 创建客户端",localStorage.getItem("userId"),localStorage.getItem("layim-token"));
    if(localStorage.getItem("userId")==null || localStorage.getItem("userId")==""
    || localStorage.getItem("layim-ws")==null || localStorage.getItem("layim-ws")==""){
        //登录失败
        return ;
    }
    //一般直接写在一个js文件中
    layui.use(['layer', 'jquery'], function(){
      var layer = layui.layer ,$ = layui.jquery;
       //发送消息
       var sendMsg=function(msg,receiver,group){
           var message = new proto.Model();
           var content = new proto.MessageBody();
           let token = localStorage.getItem("layim-token");
           let loginid = localStorage.getItem("userId");
           message.setMsgtype(4);
           message.setCmd(5);
           message.setGroupid(group);//系统用户组
           message.setToken(token);
           message.setSender(loginid);
           message.setReceiver(receiver);//好友ID
           content.setContent(msg);
           content.setType(0)
           message.setContent(content.serializeBinary())
           socket.send(message.serializeBinary());
    }
   //拉取离线消息
     var showOfflineMsg = function (layim){
      let token = localStorage.getItem("layim-token");
      let loginid = localStorage.getItem("userId");
      let prefix = localStorage.getItem("layim-web");
       $.ajax({
        type : "post",
        url : prefix+"getofflinemsg",
        async : true,
        data:{apptoken:loginid+"-"+token},
        success : function(data){
          var dataObj=eval("("+data+")");
            if(dataObj!=null&&dataObj.length>0){
              for(var i =0;i<dataObj.length;i++){
                layim.getMessage({
                     username: dataObj[i].sendusername
                     ,avatar: dataObj[i].avatar+"?"+new Date().getTime()
                     ,id: dataObj[i].senduser
                     ,type: "friend"
                     ,content: dataObj[i].content
                     ,timestamp: dataObj[i].createdate
                  });
              }
          }
        }
      });
     }

     showmsg = function(data){
          let loginid = localStorage.getItem("userId");
          var msg = eval("("+data.user+")");
          var content = eval("("+data.content+")");
          var cache = layui.layim.cache();
          var local = layui.data('layim')[cache.mine.id];
          var username = "",avatar="",friend=false;
          layui.each(cache.friend, function(index1, item1){
            layui.each(item1.list, function(index, item){
                  if(item.id == msg.sender){
                    username = item.username;
                    avatar = item.avatar;
                    return friend = true;
                  }
            });
            if(friend) return true;
          });

          if(msg.cmd==3){
               if(msg.sender!=loginid){
               layer.msg(username+"上线了");
               lm.setFriendStatus(msg.getSender(), 'online');
               }
          }else if(msg.cmd==4){
               if(msg.sender!=loginid){
                 layer.msg(username+"下线了");
                 lm.setFriendStatus(msg.getSender(), 'offline');
                }
         }else if(msg.cmd==5){
                //显示非自身消息
                 if(msg.sender!=loginid){
                   var time = (new Date(msg.timeStamp)).getTime();
                   //不显示用户组消息
                   if(msg.groupId==null||msg.groupId.length<1){
                    lm.getMessage({
                        username: username
                        ,avatar: avatar+"?"+new Date().getTime()
                        ,id: msg.sender
                        ,type: "friend"
                        ,content: content.content
                        ,timestamp:time
                      });
                   }else{
                      lm.getMessage({
                        username: username
                        ,avatar: avatar+"?"+new Date().getTime()
                        ,id: msg.groupId
                        ,type: "group"
                        ,content: content.content
                        ,timestamp: time
                      });
                   }
                }
          }
          /*
      以下代码只适合ie10以上浏览器  无法兼容低版本浏览器
      var  msgmodel =  proto.Model.deserializeBinary(data);
      var  msgbody = proto.MessageBody.deserializeBinary(msgmodel.getContent());
      alert(msgbody.getContent())
      */

      }


       layui.use('layim', function(layim){
          //基础配置
          layim.config({
            title:"消息"
            ,notice:true,
            init: {
              url: 'getusers' //接口地址（返回的数据格式见layim文档）
              ,type: 'post' //默认get，一般可不填
              ,data:{}, //额外参数
            }, //获取主面板列表信息
            //获取群员接口  请自行实现获取群用户
            members: {
              url: '' //接口地址
              ,type: 'get' //默认get，一般可不填
              ,data: {} //额外参数
            },
            //上传图片接口（返回的数据格式见下文）
             uploadImage: {
              url: '/njmind/attachment/upload' //接口地址
              ,type: 'post' //默认post
              ,data: {}
            },
            //上传文件接口（返回的数据格式见下文）
            uploadFile: {
              url: '/njmind/attachment/upload' //接口地址
              ,type: 'post' //默认post
              ,data: {}
            },
            isAudio: true, //开启聊天工具栏音频
            isVideo: true, //开启聊天工具栏视频
            brief: false,
            min: true,//初始为最小化在右下角
            isgroup: true,
            voice: true,
            copyright: true
            ,msgbox: 'message' //消息盒子页面地址，若不开启，剔除该项即可
            //,find: layui.cache.dir + 'css/modules/layim/html/find.html' //发现页面地址，若不开启，剔除该项即可
            ,chatLog: 'historymessage' //聊天记录页面地址，若不开启，剔除该项即可
          });

          layim.on('ready', function(res){
            let loginid = localStorage.getItem("userId");
            lm = layui.layim;
            //添加客服
            layim.addList({
              type: 'friend' //列表类型，只支持friend和group两种
                ,avatar: "layui/images/0.jpg" //好友头像
                ,username: '琪琪IM智能客服' //好友昵称
                ,groupid: 1 //所在的分组id
                ,id: "0" //好友id
                ,sign: "有什么问题尽管问我把" //好友签名
            });
            //layim.msgbox(2); //模拟消息盒子有新消息，实际使用时，一般是动态获得
            //取得离线消息
            showOfflineMsg(layim)
            layim.setFriendStatus(loginid, 'online');
           });
          //监听发送消息
          layim.on('sendMessage', function(data){
             var To = data.to;
             var my = data.mine;
             var message = my.content;
             var receiver =To.id+"";
             let loginid = localStorage.getItem("userId");
             if($.trim(loginid)=='' ){
               return;
             }
             if($.trim(message)==''){
               layer.msg("请输入要发送的消息!");
               return;
             }
             if (socket.readyState == WebSocket.OPEN) {
                 //判断是发送好友消息还是群消息
                if(To.type=="friend"){
                   sendMsg(message,receiver,null)
                }else{
                   sendMsg(message,null,receiver)
                }
             } else {
                layer.confirm('即时通讯连接失效，是否重新连接?', function(index){
                  reconnect(initEventHandle);
                  layer.close(index);
                });
             }
          });

          layim.on('online', function(status){
            console.log("当前状态",status); //获得online或者hide
            //websocket发送在线或离线消息给好友
          });
          /**
           * 获取消息数量
           */
          findMyMsg = function(){
            let token = localStorage.getItem("layim-token");
            let loginid = localStorage.getItem("userId");
            let prefix = localStorage.getItem("layim-web");
            $.post(prefix+"messageCount",{
                      apptoken:loginid+"-"+token,
                      },function(_data){
                let data=JSON.parse(_data);
                if(data.success=="1"){
                  if(data.count>0){
                    layim.msgbox(data.count); //模拟消息盒子有新消息，实际使用时，一般是动态获得
                  }
                }
            });
          }

          initEventHandle = function () {
                //收到消息后
                socket.onmessage = function(event) {
                    let loginid = localStorage.getItem("userId");
                    if (event.data instanceof ArrayBuffer){
                    var msg =  proto.Model.deserializeBinary(event.data);      //如果后端发送的是二进制帧（protobuf）会收到前面定义的类型
                    var msgCon =  proto.MessageBody.deserializeBinary(msg.getContent());
                    var cache = layui.layim.cache();
                    var local = layui.data('layim')[cache.mine.id];
                    var username = "",avatar="",friend=false;
                      layui.each(cache.friend, function(index1, item1){
                        layui.each(item1.list, function(index, item){
                          if(item.id == msg.getSender()){
                            username = item.username;
                            avatar =item.avatar;
                            return friend = true;
                          }
                        });
                        if(friend) return true;
                      });
                    findMyMsg();
                         //心跳消息
                         if(msg.getCmd()==2){
                           //发送心跳回应
                           var message1 = new proto.Model();
                             message1.setCmd(2);
                             message1.setMsgtype(4);
                             socket.send(message1.serializeBinary());
                         }else if(msg.getCmd()==3){
                           //上线
                           if(msg.getSender()!=loginid){
                              //layer.msg(username+"上线了！");
                              layim.setFriendStatus(msg.getSender(), 'online');
                           }
                         }else if(msg.getCmd()==4){
                           //下线
                           if(msg.getSender()!=loginid){
                             //layer.msg(username+"已下线！");
                             layim.setFriendStatus(msg.getSender(), 'offline');
                           }
                         } else{
                           //显示非自身消息
                           if(msg.getSender()!=loginid){
                             //不显示用户组消息
                             var time = (new Date(msg.getTimestamp())).getTime();
                             if(msg.getGroupid()==null||msg.getGroupid().length<1){
                                lm.getMessage({
                                  username: username
                                  ,avatar: avatar+"?"+new Date().getTime()
                                  ,id: msg.getSender()
                                  ,type: "friend"
                                  ,content: msgCon.getContent()
                                  ,timestamp: time
                                });
                             }else{
                                lm.getMessage({
                                  username: username
                                  ,avatar: avatar+"?"+new Date().getTime()
                                  ,id: msg.getGroupid()
                                  ,type: "group"
                                  ,content: msgCon.getContent()
                                  ,timestamp: time
                                });
                             }
                           }
                         }
                    }else {
                          var data = event.data;                //后端返回的是文本帧时触发
                    }
                };
                //连接后
                socket.onopen = function(event) {
                   var message = new proto.Model();
                   var browser=BrowserUtil.info();
                   let token = localStorage.getItem("layim-token");
                   let loginid = localStorage.getItem("userId");
                   let prefix = localStorage.getItem("layim-web");
                    message.setVersion("1.0");
                    message.setDeviceid("")
                    message.setCmd(1);
                    message.setSender(loginid);
                    message.setMsgtype(5);
                    message.setFlag(1);
                    message.setPlatform(browser.name);
                    message.setPlatformversion(browser.version);
                    message.setToken(token);
                    var bytes = message.serializeBinary();
                    socket.send(bytes);
                    layim.reloadInfo();
                    findMyMsg();
                    $.get(prefix+"loginList",{},function(_data){
                      console.log("连接时系统中的im》session》",_data)
                  });
                };
                //连接关闭
                socket.onclose = function(event) {
                  /* let layuiDom= document.getElementById("layui-layer1");
                  if(layuiDom){
                    document.body.removeChild(layuiDom);
                  } */
                  let prefix = localStorage.getItem("layim-web");
                  $.get(prefix+"loginList",{},function(_data){
                      console.log("退出时系统中的im》session》",_data)
                  });

                  let loginid = localStorage.getItem("userId");
                  layim.setFriendStatus(loginid, 'offline');
                  if(logout_flag){
                    console.log("即时通讯退出！");
                    layim.loginOut();//销毁页面标签信息
                    logout_flag=false;
                  }else{
                    console.log("即时通讯掉线！");
                    layer.confirm('您已下线，重新上线?', function(index){
                      setTimeout(function () {
                        console.log("延时重新上线！");
                        reconnect(initEventHandle);
                      }, 500);
                      layer.close(index);
                    });
                  }
              };
              socket.onerror = function () {
                console.log("websocket错误，重新连接！");
                reconnect(initEventHandle);
              };
          }
          //初始化layIm后开始连接
          createWebSocket(initEventHandle);
       });
     });
   }


//dwr推送消息方法
function showMessage(data) {
        showmsg(data);
}

/** 退出 */
function quitLayim(msg){
  console.log("即时通讯退出原因：",msg);
  try{
      logout_flag=true;
      var message = new proto.Model();
      var browser=BrowserUtil.info();
      let token = localStorage.getItem("layim-token");
      let loginid = localStorage.getItem("userId");
      message.setVersion("1.0");
      message.setDeviceid("")
      message.setCmd(1);
      message.setSender(loginid);
      message.setMsgtype(6);
      message.setFlag(1);
      message.setPlatform(browser.name);
      message.setPlatformversion(browser.version);
      message.setToken(token);
      var bytes = message.serializeBinary();
      socket.send(bytes);
      //销毁 layim对象
    }catch(e){

    }
};

/** 用于vue 和 js交互 */
function callBackToRouterMenu(vl){
  callToMenu=vl;
};
/** 执行跳转 */
function callRouter(msg){
  if(callToMenu){
    callToMenu(msg);
  }else{
    console.log("callToMenu 为空");
  }
}



