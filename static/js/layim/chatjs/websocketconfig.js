//ws://{ip}:{端口}/{java后端websocket配置的上下文}
var reconnectflag = false;//避免重复连接
var socket,callbackFun;

function createWebSocket(callbak) {
   try {
	  let url = localStorage.getItem("layim-ws");
	  if(url==null && url==""){
      console.log("websocke服务获取异常：url",url,callbak);
      return ;
	  }
      if (!window.WebSocket) {
  	      window.WebSocket = window.MozWebSocket;
  	  }
  	  if (window.WebSocket) {
  		  socket = new WebSocket(url);
        socket.binaryType = "arraybuffer";
        callbak();
      }else{
        layer.msg("你的浏览器不支持websocket，无法使用即时通讯！");
      }

      /*
      else {
         // layer.msg("你的浏览器不支持websocket！");
  	     //当浏览器不支持websocket时 降级为http模式
  	    var isClose =false;
        window.onbeforeunload =function() {
          if(!isClose){
            return "确定要离开当前聊天吗?";
          }else{
            return "";
          }
        }
        window.onunload =function() {
          if(!isClose){
            Imwebserver.closeconnect();
          }
        }
  	   // dwr.engine.setActiveReverseAjax(true);
  	   // dwr.engine.setNotifyServerOnPageUnload(true);
  	   // dwr.engine.setErrorHandler(function(){
  	   // });
  	   // dwr.engine._errorHandler = function(message, ex) {
  	       //alert("服务器出现错误");
  	       //dwr.engine._debug("Error: " + ex.name + ", " + ex.message, true);
  	   // };
  	    Imwebserver.serverconnect();
      }  */
    } catch (e) {
      console.log("异常，重新登录，及时通讯！")
      reconnect(callbak);
    }
}


function reconnect(callbak) {
    if(reconnectflag) return;
	 reconnectflag = true;
	 reLogin(callbak);
	 reconnectflag = false;
}


function reLogin(callbak){
	var $ = layui.$;
	$.ajax({ url: "/back/sys/loginLayim"
		,type: 'post'
		,data: {}
		,dataType: 'json'
		,cache: false
		,async: false
		,success: function(res){
			localStorage.setItem("layim-token",res['layimToken']) ;
			localStorage.setItem("layim-ws",res['layimWs']);
			localStorage.setItem("layim-web",res['layimWeb']);
			createWebSocket(callbak);
		},error: function(err, msg){
			console.log("即时通讯，登录异常！")
			//没连接上会一直重连，设置延迟避免请求过多
			/* setTimeout(function () {
				createWebSocket(callbak);
			}, 2000); */
		}
	});

}
