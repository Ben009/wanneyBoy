import $ from 'jquery';
import router from '@/router';
import { Base64 } from 'js-base64'; // TODO 案例 base64 https://blog.csdn.net/qq_35844177/article/details/70597597
//TODO 20180503 后台地址端口配置
// let server="http://192.168.1.110:8081/";
//let server="http://localhost:8081/";
//全部转到index.jsp 代理中配置

Date.prototype.format = function (format) {
  if(isNaN(this.getMonth())){
    return null;
  }
  let o = {
    "M+": this.getMonth() + 1,
    "D+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};


/*获取url参数*/
function getParamFromUrl(str,name){
  let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  let r = str.substr(1).match(reg);
  if(r!=null) return r[2];
  return null;
}
/**
 * TODO 案例 代理访问 proxy 20180509 异步调用 {在\config\index.js中配制 proxyTable["/njmind"]}
 * /njmind/url
 * @param {*} type
 * @param {*} url
 * @param {*} data
 * @param {*} callback
 * @param {*} codeType   base64 | unicode
 */
function ajaxProxyRequest(type,url,data,callback,codeType){
  if(codeType=="base64"&& data!=null){
    //在后台 com.njmind.common.util.Util.base64ToString(para)反向转成字符串 自己解析
    data=jsonValToBase64(data);
    data["isBase64"]='1';
  }else if(codeType=="unicode" && data!=null){
    data=jsonValToUnicode(data);
    data["isUnicode"]='1';
  }
  $.ajax({
    url:url,
    type:type,
    data:data,
    xhrFields:{
      withCredentials:true
    },
    crossDomain:true,
    success:callback
  });
}

/**
 * TODO 案例 代理访问 proxy 20180509 同步调用 {在\config\index.js中配制 proxyTable["/njmind"]}
 *  /njmind/url
 * @param {*} type
 * @param {*} url
 * @param {*} data
 * @param {*} callback
 * @param {*} codeType base64 | unicode
 */
function ajaxSyncProxyRequest(type,url,data,callback,codeType){
  if(codeType=="base64"&& data!=null){
    //在后台 com.njmind.common.util.Util.base64ToString(para)反向转成字符串 自己解析
    data=jsonValToBase64(data);
    data["isBase64"]='1';
  }else if(codeType=="unicode" && data!=null){
    data=jsonValToUnicode(data);
    data["isUnicode"]='1';
  }
  $.ajax({
    url:url,
    type:type,
    data:data,
    xhrFields:{
      withCredentials:true
    },
    crossDomain:true,
    success:callback,
    async:false
  });
}
/**
 * 异步调用 默认代理  指向的服务 {在\config\index.js中配制 proxyTable["/back"]}
 * 不用传 原url不变
 * @param {*} type
 * @param {*} url
 * @param {*} data
 * @param {*} callback
 * @param {*} codeType base64 | unicode
 */
function ajaxRequest(type,url,data,callback,codeType){
  if(codeType=="base64"&& data!=null){
    //在后台 com.njmind.common.util.Util.base64ToString(para)反向转成字符串 自己解析
    data=jsonValToBase64(data);
    data["isBase64"]='1';
  }else if(codeType=="unicode" && data!=null){
    data=jsonValToUnicode(data);
    data["isUnicode"]='1';
  }
  $.ajax({
    url:url,
    type:type,
    data:data,
    xhrFields:{
      withCredentials:true
    },
    crossDomain:true,
    success:callback,
  });
}

/**
 * 发起请求 可指定请求头
 */
function ajaxRequestHeader(type,url,data,callback,codeType,header){
  
  if(codeType=="base64"&& data!=null){
    //在后台 com.njmind.common.util.Util.base64ToString(para)反向转成字符串 自己解析
    data=jsonValToBase64(data);
    data["isBase64"]='1';
  }else if(codeType=="unicode" && data!=null){
    data=jsonValToUnicode(data);
    data["isUnicode"]='1';
  }

  if(header==undefined||header==null){
    header="application/x-www-form-urlencoded";
  }
  $.ajax({
    url:url,
    type:type,
    data:data,
    contentType:header,
    xhrFields:{
      withCredentials:true
    },
    crossDomain:true,
    success:callback,
  });
}


/**
 * 同步调用 默认代理  指向的服务 {在\config\index.js中配制 proxyTable["/back"]}
 * 不用传 原url不变
 * @param {*} type
 * @param {*} url
 * @param {*} data 
 * @param {*} callback
 * @param {*} codeType  base64 | unicode
 */
function ajaxSyncRequest(type,url,data,callback,codeType){
  if(codeType=="base64"&& data!=null){
    //在后台 com.njmind.common.util.Util.base64ToString(para)反向转成字符串 自己解析
    data=jsonValToBase64(data);
    data["isBase64"]='1';
  }else if(codeType=="unicode" && data!=null){
    data=jsonValToUnicode(data);
    data["isUnicode"]='1';
  }
  $.ajax({
    url:url,
    type:type,
    data:data,
    xhrFields:{
      withCredentials:true
    },
    crossDomain:true,
    success:callback,
    async:false
  });
}

/*cookie*/


function setCookie(name,value) {
  let Days = 30;
  let exp = new Date();
  exp.setTime(exp.getTime() + Days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
  let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

  if(arr=document.cookie.match(reg))
    return decodeURI(arr[2]);
  else
    return null;
}


function browserRedirect() {
  let DEVICE_TYPE;
  let sUserAgent = navigator.userAgent.toLowerCase();
  let bIsIpad = sUserAgent.match(/ipad/i) === "ipad";
  let bIsIphoneOs = sUserAgent.match(/iphone os/i) === "iphone os";
  let bIsMidp = sUserAgent.match(/midp/i) === "midp";
  let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === "rv:1.2.3.4";
  let bIsUc = sUserAgent.match(/ucweb/i) === "ucweb";
  let bIsAndroid = sUserAgent.match(/android/i) === "android";
  let bIsCE = sUserAgent.match(/windows ce/i) === "windows ce";
  let bIsWM = sUserAgent.match(/windows mobile/i) === "windows mobile";
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    DEVICE_TYPE="phone";
  } else {
    DEVICE_TYPE="pc";
  }
  return DEVICE_TYPE;
}

function formatArrayToTree(array, target, pid, parents){
  for(let i=0,len=array.length;i<len;i++){
    let curr=array[i];
    if(curr.pid===pid){
      target.push(curr);
      curr.parents=parents;
      let children=formatArrayToTree(array, [], curr.id, parents.concat([curr]));
      if(children.length>0){
        curr.children=children;
      }
    }
  }
  return target;
}
//TODO 20180509
let tablePopover={};

function formatDate(val,pattern){
  if (val != null && val != "") {
    var date = new Date(val);
    return date.format(pattern);
  } else {
    return null;
  }
}


//-------------------------base64转码--------------unicode转码--------------------
/**
 * 判断是否是json对象
 * @param  obj
 */
function isJson(obj){
  let isjson = false;
  try{
    if(typeof(obj) == 'string'){
      isjson=false;
    }else if(typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length){
      isjson=true;
    }else{
      isjson=false;
    }
  }catch(e){

  }
  return isjson;
}

/**
 * 字符串转Unicode字符串 [一次转Unicode]
 * @param {,字符串,Json对象} para
 */
function objToUnicode(para){
  if(isJson(para)){
    return encodeUnicode(JSON.stringify(para));
  }else{
    return encodeUnicode(para);
  }
}

/**
 * 将json对象的value 转换成Unicode编码 [一次转Unicode]
 * @param 【Json对象】 jsonObj
 */
function jsonValToUnicode(jsonObj){
  let tmp ={};
  //遍历json对象的每个key/value对,p为key
  for(let p in jsonObj){
    tmp[p]=objToUnicode(jsonObj[p]);
  }
  return tmp;
}

/**
 * 字符串转Base64字符串 [第一次转Unicode，第二次转base64]
 * @param {,字符串,Json对象} para
 */
function objToBase64(para){
  if(!para){
    return null;
  }else if(isJson(para)){
    let str=JSON.stringify(para);
    return Base64.encode(encodeUnicode(str));
  }else{
    return Base64.encode(encodeUnicode(para));
  }
}

/**
 * 将json对象的value 转换成Base64编码 [第一次转Unicode，第二次转base64]
 * @param 【Json对象】 jsonObj
 */
function jsonValToBase64(jsonObj){
  let tmp ={};
  //遍历json对象的每个key/value对,p为key
  for(let p in jsonObj){
    tmp[p]=objToBase64(jsonObj[p]);
  }
  return tmp;
}

/**
 * str 转为unicode 编码
 * typeof的运算数未定义,返回的就是 “undefined”.
 * 运算数为数字 typeof(x) = “number”
 * 字符串 typeof(x) = “string”
 * 布尔值 typeof(x) = “boolean”
 * 对象,数组和null typeof(x) = “object”  json判断已以处理  formatDate(val,"YYYY-MM-DD hh:mm:ss");
 * 函数 typeof(x) = “function”
 * typeof 运算符返回一个用来表示表达式的数据类型的字符串。
 * 可能的字符串有：”number”、”string”、”boolean”、”object”、”function” 和 “undefined”。
 * @param  str
 */
function encodeUnicode(str) {
  str=str+'';
  if($.trim(str).length>0 ){
    str=$.trim(str);
    var res = [];
    for ( var i=0; i<str.length; i++ ) {
      res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);
    }
    return "\\u" + res.join("\\u");
  }
}
/**
 * array 数据类型转换
 * @param {*} opt 被转对象     [{a:'1',b:1,c:'3'},{a:'1',b:1,c:'3'}]
 * @param {*} types 指定类型    {'a属性':'integer','b属性':'string'}  integer|string|float
 * @return [{a:1,b:'1',c:'3'},{a:1,b:'1',c:'3'}]
 * 测试代码
 * let pp=[{a:'1',b:1,c:'3'},{a:'1',b:1,c:'3'}];
 *      console.log('字符转换前',pp);
 *      let rex={'a':'integer','b':'string'};//转换格式
 *      transToType(pp,rex);
 *      console.log('字符转换后',pp);
 */
function transToType(opt,types){
  if(opt.length>0){
    opt.forEach((item,i) => {
      for(let t in item) {
          if(types[t]=="string"){
            item[t]=''+item[t];
          }else if(types[t]=="integer"){
            if(!Number.isNaN(item[t]) && typeof(item[t]) == 'string' ){
              item[t]=Number.parseInt(item[t]);
            }
          }else if(types[t]=="float"){
            if(!Number.isNaN(item[t]) && typeof(item[t]) == 'string' ){
              item[t]=Number.parseFloat(item[t]);
            }
          }
      }
    });
  }
}

/**
 * array 数据属性转换
 * @param {*} opt 被转对象  [{a:'1',b:1,c:'3'},{a:'1',b:1,c:'3'}]
 * @param {*} keys 转换关系  {code:'a',remark:'b',c:'3'}
 * @return [{code:'1',remark:1,c:'3'},{code:'1',remark:1,c:'3'}]
 */
function transTokey(opt,keys){
  if(opt.length>0){
    opt.forEach((item,i) => {
      for(let t in item) {
        for(let j in keys){
          if(t==keys[j]){
            item[j]=item[t];
            delete item[t];
          }
        }
        /* if(keys[t] && keys[t].length>0){
          item[keys[t]]=item[t];
          delete item[t];
        } */
      }
    });
  }
}
/**
 *  数组 转 map 用于取出 键 > 下标 
 * @param obj 
 */
function arrayToMap(obj){
  let p={};
  for(let s=0;s<obj.length;s++){
    p[obj[s]]=s;
  }
  return p;
}


/**
 * changeWriteSource
 * 补充dom对象值变更反写到Html source 标签中
 */
var changeWS = function(id){
  //TODO 20180702
  //获取select控件值
  $(id).find("select").each(function(i, row){
    let opts = row;//每个select标签
      opts.onchange=function(){
        for(let j=0;j<opts.options.length;j++){//遍历select标签下的option标签，先移除所有option的selected属性
          opts.options[j].removeAttribute("selected");
        }
        var index = opts.options.selectedIndex;
        opts.options[index].setAttribute("selected","true");//给选中的option添加selected属性
      }
  });
  
  $(id).find("input").each(function(i, row){
      let obj=row;
  if(obj.type=='checkbox'){//checkbox
          obj.onclick=function(){
              if(obj.checked){
                obj.setAttribute("checked","checked");
              }else{
                obj.removeAttribute("checked");
              }
          }
  }else if(obj.type=='radio'){//radio
    obj.onclick=function(){
              for(let j=0;j<inputs.length;j++){//同一组（相同name）radio所有选项移除checked属性
                let myname=inputs[j];
                if (myname.name==obj.name){
                  myname.removeAttribute("checked");
                }
              }
              obj.setAttribute("checked","checked");//当前选中的加上checked属性
          }
    }
  });
};


export { 
  ajaxRequest,
  ajaxSyncRequest,
  ajaxProxyRequest,
  ajaxSyncProxyRequest,
  ajaxRequestHeader, 
  tablePopover, 
  formatArrayToTree,
  formatDate,
  transToType,
  transTokey,
  arrayToMap,
  changeWS};
