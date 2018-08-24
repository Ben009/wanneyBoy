/**
 * @author dqm
 * @description C#容器Chrome端提供的脚本
 * @date 2018-06-06
 */
//以下脚本都是容器端提供的

//****最下方的 export请在需要时自行解除注释****
//更新说明
//20180604 修改userAgent，增加判断标志，在非容器中使用时不产生错误
//20180606 增加方法ConvertEmfToPNG（emf/emz转png）
//20180608 增加方法PrintHtmlByUrl（接收url在ie中打印）
//20180629 增加方法	saveWord(),openWord()方法增加"ff"模式：不能编辑不能复制粘贴
//20180806 修改ConExcelListOpen并完善参数说明
//         增加SignHWESP370(),用于调用签名板（汉王ESP370）
//20180807 增加方法GetDefaultPrinterName 获取默认打印机名
//20180813 增加容器中打开word功能,excel容器增加位置参数
//20180816 增加方法 PrintPdfToDev 打印pdf，无特殊要求的请使用此方法打印pdf
//				 增加方法 Print 打印主页面，使用chrome浏览器打印，效果好
//20180821 修改方法PrintHtmlByUrl、PrintHtmlBySource参数
var CsharpObject=function(){
  return new CsharpObject1();

}
//提示信息输出方法
//如果希望使用自定义或系统提示而不使用alert，请为其赋值
//例如： Cmessage = this.$message;，可参考ExcelUtil.js
var Cmessage;

function errorInfo(msg){
  try{
    Cmessage.error(msg)
  }catch (e) {
    alert(msg);
  }
}
function warning(msg){
  try{
    Cmessage.warning(msg)
  }catch (e) {
    alert(msg);
  }
}


function successInfo(msg){
  try{
    Cmessage.success(msg)
  }catch (e) {
    alert(msg);
  }
}

browserType=0;//浏览器类型 0 ie；1 chrome
CsharpReturnValue ="";//返回值

//取得浏览器的userAgent字符串
if (navigator.userAgent.indexOf("CefSharp") > -1){
  CefSharp.BindObjectAsync("jsObj");//绑定C#对象，此句不能删除
}

var CsharpObject1=function(){

  //取得浏览器的userAgent字符串
  if (navigator.userAgent.indexOf("CefSharp") > -1){
    browserType=1;//alert("Chrome");
	// CefSharp.BindObjectAsync("jsObj");//绑定C#对象，此句不能删除
  }
  else if(navigator.userAgent.indexOf("IECsharp") >-1){
    browserType=0;//ie
  }else{
    warning("此功能依赖于容器，请在容器中进行操作。")
    browserType=-1;
  }
  //重置结果值
  CsharpReturnValue ="";

  //测试方法
  this.TestAlert= function ()
  {
    if(browserType == 1){
      jsObj.TestMethod();
    }
    else if(browserType == 0){
      window.external.TestMethod();
    }
    alert(browserType)
  };

  //excel容器：打开excel
  //参数：
  //name/string：Excel标志名
  //json/string：初始化参数
  /*
       参数 json：
               *json
        {
            "excelId":"A00000001794"                	//excel下载id
            "excelName": "",                       	//excel文件名
            "rangeVersion": "new",                  	//红蓝框数据格式(new|old)
            "redWidth": "520",                      	//红框宽度
            "redHeight": "640",                     	//红框高度
            "redRange": "{}",                       	//红框数据
            "blueWidth": "520",                     	//蓝框宽度
            "blueHeight": "320",                    	//蓝框高度
            "blueRange": "{}",                      	//蓝框数据
            "rangeCallBack": "rangeCallBack",       	//画红蓝框回调js方法名
            "btnType": "1",                         	//画红蓝框按钮显示控制参数:0 不显示，1 显示
            "operationCallBack": "operationCallBack", //保存emf、删除等时的回调
            "savePicture": "1",                     	//是否显示保存emf按钮
            "winWidth": "1200",                     	//excel显示大小-宽度
            "winHeight": "1200",                    	//excel显示大小-高度
            "downLoadExcel":"1",                        //是否显示下载按钮:0 不显示，1 显示
            "caseId":"" ,        //证书或证书模板id，用于文件存储路径的创建，若为空则使用默认值
	          "winX":"200",                               //左顶点x坐标
            "winY":"200",                               //左顶点y坐标
            "isNotZS":"0" ,                              //非证书标志
            "mode":"ff",                     //打开方式： 只读 "r",读写 "rw", 浏览（不能修改保存）"ff" 不区分大小写
        }
        *
        (新增)mode：打开模式
        (新增)winX，winY：新增位置信息，若两个值都大于0，则根据x，y信息设置word位置；否则默认在右下角显示。
        (新增)isNotZS：证书报告模块以外的地方调用此方法需传入值"1"。
        excelId：用于从后台下载文件的id；
        excelName：本地excel文件名；
            打开文件时优先判断excelName，如果存在excelName且本地文件真实存在，则打开excelName文件；否则判断excelId，如下载（下载路径：截取浏览器主地址的ip及port，后拼接"njmind/attachment/down/"+ excelId）成功则打开下载好的文件；如果之前操作条件皆不符合或最终文件不存在则新建excel文件并打开。
        rangeVersion：3.0默认为new；
        redRange、blueRange数据格式样例：{"Sheet1":"216,40.5,520,640##","Sheet2":"162,27,520,640##"} 蓝框有且只有一个；
        rangeCallBack：画红蓝框时回调方法，参数为object数组，共四个参数
            new object[] { this.Name, redrangeJson, "red" ,"save"}
            第一个参数：Excel标志名
            第二个参数：红蓝框最新数据,为json字符串
            第三个参数："red"/"blue"区分红蓝框
            第四个参数："save"：新画框，"delete"：删除框
        btnType：控制画红蓝框按钮是否可用，"1"可用，"0"不可用

        operationCallBack：保存emf、删除等时回调方法
            保存Emf ：
        {
            "excelId": "excel1",
            "operation": "saveEmf",
            "emfJson": {
                "zipId": "A00000002559",
                "emz": [
                    {
                        "emfId": "A00000002560",
                        "pngId": "A00000002561",
                        "pictureWidth": "486",
                        "pictureHeight": "729",
                        "fileType": "null"
                    },
                    {
                        "emfId": "A00000002566",
                        "pngId": "A00000002567",
                        "pictureWidth": "486",
                        "pictureHeight": "729",
                        "fileType": "null"
                    },
                    {
                        "emfId": "A00000002564",
                        "pngId": "A00000002565",
                        "pictureWidth": "486",
                        "pictureHeight": "729",
                        "fileType": "null"
                    },
                    {
                        "emfId": "A00000002562",
                        "pngId": "A00000002563",
                        "pictureWidth": "486",
                        "pictureHeight": "729",
                        "fileType": "null"
                    }
                ]
            }
        }
            第一个参数：Excel标志名
            第二个参数："saveEmf"：截图
            第三个参数：上传图片压缩文件时后台返回值，关闭时没有此参数
                zipId：zip压缩文件路径id，表ATTACHMENT中attach_id字段
                picture：zip解压后存储信息
                picture- emfId：emf文件路径id，表ATTACHMENT中attach_id字段
                picture - pngId：emf文件路径id，表ATTACHMENT中attach_id字段
                picture- pictureWidth、picture- pictureHeight：图片实际大小信息
                picture- fileType：red 红框，blue 蓝框，null 无框
        关闭：{"excelId":"excel1","operation":"close"}
            第一个参数：Excel标志名
            第二个参数： "close"：关闭excel
        保存excel：string  ConExcelListSave(string name)
        参数 name：Excel标志名 用于区分多个打开的excel，贯穿excel容器操作的大部分方法
        返回值：json字符串
        {
            "msg": "上传成功！",
            "v_attach_id": "A00000002579",
            "v_stream_url": "http://192.168.99.118:7900/attachment/outputStream/",
            "success": "1",
            "v_server_url": "http://192.168.99.118:7900/attachment/down/",
            "v_orig_name": "4b086e306cf141158788c4703847be58.xlsx"
        }
            msg：上传返回消息
            success： 1 上传成功 0 上传失败
            v_attach_id：存储路径id，表ATTACHMENT中attach_id字段
  */
  this.ConExcelListOpen =	function(){
    if(browserType == 1){
      jsObj.ConExcelListOpen(arguments[0],arguments[1])
    }
    else if(browserType == 0){
      window.external.ConExcelListOpen(window,arguments[0],arguments[1])
    }
  };
  //excel容器：显示excel
  //参数：
  //name/srting：Excel标志名
  this.ConExcelListShow = function(){
    if(browserType == 1){
      jsObj.ConExcelListShow(arguments[0])
    }
    else if(browserType == 0){
      window.external.ConExcelListShow(arguments[0])
    }
  }

  //excel容器：关闭excel
  //参数：
  //name/srting：Excel标志名
  this.ConExcelListClose = function(){
    if(browserType == 1){
      jsObj.ConExcelListClose(arguments[0]);
    }
    else if(browserType == 0){
      window.external.ConExcelListClose(arguments[0]);
    }
  };
  //excel容器：隐藏excel（所有excel都将隐藏）
  //参数：无
  this.ConExcelListHide = function(){
    if(browserType == 1){
      jsObj.ConExcelListHide();
    }
    else if(browserType == 0){
      window.external.ConExcelListHide();
    }
  };
  //excel容器：关闭所有excel容器
  //参数：无
  this.ConExcelListCloseAll = function(){
    if(browserType == 1){
      jsObj.ConExcelListCloseAll();
    }
    else if(browserType == 0){
      window.external.ConExcelListCloseAll();
    }
  };

  //excel容器：保存excel
  //参数：
  //name/srting：Excel标志名
  /* *  返回：json
         {
            "msg": "上传成功！",                                                            //上传返回消息
            "v_attach_id": "A00000002579",                                                  // 存储路径id，表ATTACHMENT中attach_id字段
            "v_stream_url": "http://192.168.99.118:7900/attachment/outputStream/",
            "success": "1",                                                                 // 1 上传成功 0 上传失败
            "v_server_url": "http://192.168.99.118:7900/attachment/down/",
            "v_orig_name": "4b086e306cf141158788c4703847be58.xlsx"
        }
    * */
  this.ConExcelListSave = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.ConExcelListSave(arguments[0]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.ConExcelListSave(arguments[0]);
    }
  };
  //excel容器：保存emf
  //参数：
  //name/srting：Excel标志名
  //hasRange/bool：true　有框截图，false　无框截图
  //返回值：json 请参照ConExcelListOpen中保存Emf 回调参数emfJson
  this.ConExcelListSaveEmf = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.ConExcelListSaveEmf(arguments[0],arguments[1]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.ConExcelListSaveEmf(arguments[0],arguments[1]);
    }
  };
  //excel容器：画框按钮是否可用控制
  //参数：
  //name/srting：Excel标志名
  //btnType/string：0 不显示（画、删红蓝框），1 显示
  this.ConExcelListBtnTypeSetting = function (){
    if(browserType == 1){
      jsObj.ConExcelListBtnTypeSetting(arguments[0],arguments[1]);
    }
    else if(browserType == 0){
      window.external.ConExcelListBtnTypeSetting(arguments[0],arguments[1]);
    }
  };
  //excel容器：excel容器大小设置
  //参数：
  //name/srting：Excel标志名
  //winWidth/int：宽度
  //winHeight/int：高度
  this.ConExcelListReSetSize = function (){
    if(browserType == 1){
      jsObj.ConExcelListReSetSize(arguments[0],Number(arguments[1]),Number(arguments[2]));
    }
    else if(browserType == 0){
      window.external.ConExcelListReSetSize(arguments[0],Number(arguments[1]),Number(arguments[2]));
    }
  };

  //excel容器：excel容器位置大小设置
  //参数：
  //name/srting：Excel标志名
  //winX/int：左顶点x坐标
  //winY/int：左顶点y坐标
  //winWidth/int：宽度
  //winHeight/int：高度
  this.ConExcelListReSetLocation = function (){
    if(browserType == 1){
      jsObj.ConExcelListReSetLocation(arguments[0],Number(arguments[1]),Number(arguments[2]),Number(arguments[3]),Number(arguments[4]));
    }
    else if(browserType == 0){
      window.external.ConExcelListReSetLocation(arguments[0],Number(arguments[1]),Number(arguments[2]),Number(arguments[3]),Number(arguments[4]));
    }
  };
  //excel容器：状态设置
  //参数：
  //name/srting：Excel标志名
  //i/int：-1 最小化，0 正常状态，1 最大化
  this.ConExcelListWindowState = function(){
    if(browserType == 1){
      jsObj.ConExcelListWindowState(arguments[0],Number(arguments[1]));
    }
    else if(browserType == 0){
      window.external.ConExcelListWindowState(arguments[0],Number(arguments[1]));
    }
  };
  //配置按钮状态(C#中定义的按钮)
  //参数：
  //name/srting：Excel标志名
  //controlNames/srting：控件名称（以 ^ 分隔）
  //operation/srting（不区分大小写） ：DisVisible, Visible, Enabled , DisEnabled
  this.ConExcelListSetControlsStatus = function(){
    if(browserType == 1){
      jsObj.ConExcelListSetControlsStatus(arguments[0],arguments[1],arguments[2]);
    }
    else if(browserType == 0){
      window.external.ConExcelListSetControlsStatus(arguments[0],arguments[1],arguments[2]);
    }
  };

  //添加图片按钮
  //参数：
  //name/srting：Excel标志名
  //btnName/string：按钮名称(如果为空，则自动生成一个名称，但不会返回这个名称)
  //jsName/jsName：ie端js方法名称（C#调用时传入一个参数：Excel标志名）
  //picPath/string：pic路径
  //toolTip/string：提示
  this.ConExcelListAddpicButton = function(){
    if(browserType == 1){
      jsObj.ConExcelListAddpicButton(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
    }
    else if(browserType == 0){
      window.external.ConExcelListAddpicButton(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
    }
  };
  //添加按钮
  //参数：
  //name/srting：Excel标志名
  //btnName/string：按钮名称(如果为空，则自动生成一个名称，但不会返回这个名称)
  //jsName/jsName：ie端js方法名称（C#调用时传入一个参数：Excel标志名）
  //text/string：按钮显示的内容
  this.ConExcelListAddButton = function(){
    if(browserType == 1){
      jsObj.ConExcelListAddButton(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    else if(browserType == 0){
      window.external.ConExcelListAddButton(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
  };

  //获取excel对象（chrome端没有此方法）
  //参数：
  //name/srting：Excel标志名
  this.ConExcelListGetExcelApp = function(){
    if(browserType == 1){
      consloe.log("no method")
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.ConExcelListGetExcelApp(arguments[0]);
    }
  }
  //控制单元格变化记录是否打开
  //参数：
  //name/srting：Excel标志名
  //onOff/string：是否启用
  this.ConExcelListSwitchChanged = function(){
    if(browserType == 1){
      jsObj.ConExcelListSwitchChanged(arguments[0],arguments[1]);
    }
    else if(browserType == 0){
      window.external.ConExcelListSwitchChanged(arguments[0],arguments[1]);
    }
  };

  //获取变化的记录
  //参数：
  //name/srting：Excel标志名
  this.ConExcelListGetChangeJson = function(){
    if(browserType == 1){
      CsharpReturnValue = jsObj.ConExcelListGetChangeJson(arguments[0]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.ConExcelListGetChangeJson(arguments[0]);
    }
  };

  //下载文件
  //参数：
  //url/string：网路文件路径
  //filePath/string：本地文件保存地址
  //callback/string：回调 下载失败 -1，下载成功 100
  this.DownloadFile =function (){
    if(browserType == 1){
      jsObj.DownloadFile(arguments[0],arguments[1],arguments[2]);
    }
    else if(browserType == 0){
      window.external.DownloadFile(arguments[0],arguments[1],arguments[2]);
    }
  };
  //上传文件
  //参数：
  //address/string：上传url
  //filePath/string：本地文件名
  //jsonStr/string：上传参数
  //
  //返回值/string：服务端返回内容或空字符串
  this.FileUpload = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.FileUpload(arguments[0],arguments[1],arguments[2]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.FileUpload(arguments[0],arguments[1],arguments[2]);
    }
  }
  //从剪贴板保存emf
  //参数：无
  //返回值/string：保存后的文件名或空
  this.SaveClipboardDataToEMF = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.SaveClipboardDataToEMF();
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.SaveClipboardDataToEMF();
    }
  }
  //从剪贴板保存png
  //参数：无
  //返回值/string：保存后的文件名或空
  this.SaveClipboardDataToImage = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.SaveClipboardDataToImage("png");
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.SaveClipboardDataToImage("png");
    }
  }

  //创建文件夹
  //参数：
  //dirPath/string：文件夹路径
  //返回值/bool：是否成功
  this.CreateDir = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.CreateDir(arguments[0]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.CreateDir(arguments[0]);
    }
  }
  //创建文件
  //参数：
  //filePath/string：文件路径
  //fileData/string：数据内容
  //返回值/bool：是否成功，若文件夹不存在则创建文件夹，若无数据则创建空文件
  this.CreateFile = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.CreateFile(arguments[0],arguments[1]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.CreateFile(arguments[0],arguments[1]);
    }
  }
  //删除文件
  //参数：
  //deleteFilePath/string：文件路径
  //返回值/bool：是否成功
  this.DeleteFile = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.DeleteFile(arguments[0]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.DeleteFile(arguments[0]);
    }
  }
  //压缩单个文件
  //参数：
  //zipfilePath/string：文件名
  //返回值/string：压缩后的文件名
  this.ZipFile =	function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.ZipFile(arguments[0]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.ZipFile(arguments[0]);
    }
  }
  //删除文件夹中非当天的文件
  //参数：
  // dirPath/string：文件夹路径
  this.DeleteFileNotToday =function (){
    if(browserType == 1){
      jsObj.DeleteFileNotToday(arguments[0]);
    }
    else if(browserType == 0){
      window.external.DeleteFileNotToday(arguments[0]);
    }
  }
  //删除文件夹中指定时间范围内的文件
  //参数：
  //dirPath/string：文件夹
  //startTime/string：开始时间(yyyy-MM-dd HH:mm:ss)
  //endTimeString/string：结束时间(yyyy-MM-dd HH:mm:ss)
  this.DeleteFilesByTime =function (){
    if(browserType == 1){
      jsObj.DeleteFilesByTime(arguments[0],arguments[1],arguments[2]);
    }
    else if(browserType == 0){
      window.external.DeleteFilesByTime(arguments[0],arguments[1],arguments[2]);
    }
  }
  //读取txt文件，每行数据以分隔符分开
  //参数：
  //fileName/string：文件名
  //interval/string：行分隔字符串
  //encoding/string：编码格式（默认"GB2312"）
  //返回值/string：读取的内容
  this.ReadTxtFile =	function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.ReadTxtFile(arguments[0],arguments[1],arguments[2]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.ReadTxtFile(arguments[0],arguments[1],arguments[2]);
    }
  }
  //拷贝文件
  //参数：
  //sourceFile/string：源文件
  //outPath/string：输出路径
  //callback/string：回调 （1，成功；0，失败）
  this.CopyFile = function (){
    if(browserType == 1){
      jsObj.CopyFile(arguments[0],arguments[1],arguments[2])
    }
    else if(browserType == 0){
      window.external.CopyFile(arguments[0],arguments[1],arguments[2])
    }
  }
  //压缩文件夹
  //参数：
  //fPath/string：文件夹路径
  //fileName/string：压缩后文件
  //返回值/string：是否成功
  this.CompressDirectory = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.CompressDirectory(arguments[0],arguments[1]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.CompressDirectory(arguments[0],arguments[1]);
    }
  }
  //打开文件
  //参数：
  //fileName/string：文件名
  //callback/string：回调 成功 1，出错 -1, 文件不存在 0
  this.OpenFile = function (){
    if(browserType == 1){
      jsObj.OpenFile(arguments[0],arguments[1])
    }
    else if(browserType == 0){
      window.external.OpenFile(arguments[0],arguments[1])
    }
  }
  //打开文件并在文件关闭时上传文件
  //参数：
  //fileName/string：文件名
  //address/string：上传路径
  //jsonStr/string：上传时参数
  //callback/string：回调 打开成功 1，打开出错 -1, 文件不存在 0,上传成功 2，上传失败 -2
  this.OpenFileWithUpload = function (){
    if(browserType == 1){
      jsObj.OpenFileWithUpload(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    else if(browserType == 0){
      window.external.OpenFileWithUpload(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
  }
  //以windows进程形式打印文件
  //参数：
  //fileName：文件名
  //printerName：打印机名
  //callback：回调  成功 1，出错 -1, 文件不存在 0
  this.PrintFile = function (){
    if(browserType == 1){
      jsObj.PrintFile(arguments[0],arguments[1],arguments[2]);
    }
    else if(browserType == 0){
      window.external.PrintFile(arguments[0],arguments[1],arguments[2]);
    }
  }
  //打开excel
  //参数：
  //filePath/string：文件名
  //mode/string：打开模式 只读 "r",读写 "rw" 不区分大小写
  //callback/string：回调 文件不存在 0， 打开成功 1，读写方式保存 2，关闭 4 ，发生错误 -1
  this.openExcel = function (){
    if(browserType == 1){
      jsObj.openExcel(arguments[0],arguments[1],arguments[2]);
    }
    else if(browserType == 0){
      window.external.openExcel(arguments[0],arguments[1],arguments[2]);
    }
  }
  //关闭excel（与openExcel配合使用）
  //参数：无
  this.closeExcel = function (){
    if(browserType == 1){
      jsObj.closeExcel();
    }
    else if(browserType == 0){
      window.external.closeExcel();
    }
  }
  //保存excel（与openExcel配合使用）
  //参数：
  //fileName/string:保存文件名
  //返回值/bool：是否成功
  this.saveAsExcel = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.saveAsExcel(arguments[0]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.saveAsExcel(arguments[0]);
    }
  }
  //打开word
  //参数：
  //filePath/string：文件名
  //mode/string：打开模式 只读 "r",读写 "rw" 不区分大小写
  //callback/string：回调 文件不存在 0， 打开成功 1，读写方式保存 2，关闭 4 ，发生错误 -1
  this.openWord = function (){
    if(browserType == 1){
      jsObj.openWord(arguments[0],arguments[1],arguments[2])
    }
    else if(browserType == 0){
      window.external.openWord(arguments[0],arguments[1],arguments[2])
    }
  }
  //关闭word（与openWord配合使用）
  //参数：
  this.closeWord = function (){
    if(browserType == 1){
      jsObj.closeWord();
    }
    else if(browserType == 0){
      window.external.closeWord();
    }
  }
  //另存为word（与openWord配合使用）
  //参数：
  //fileName/string:保存文件名
  //返回值/bool：是否成功
  this.saveAsWord = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.saveAsWord(arguments[0])
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.saveAsWord(arguments[0])
    }
  }
  //excel转为pdf
  //参数：
  //filePath/string：excel文件名
  //outfileName/string：输出文件名
  //sheetIndex/int：转换页，此参数小于1或大于excel的sheet页数则转换全部
  //callback/string：回调 0 文件不存在，1 成功，-1 失败
  this.ExcelSaveAsPdf = function (){
    if(browserType == 1){
      jsObj.ExcelSaveAsPdf(arguments[0],arguments[1],arguments[2],arguments[3])
    }
    else if(browserType == 0){
      window.external.ExcelSaveAsPdf(arguments[0],arguments[1],arguments[2],arguments[3])
    }
  }
  //word转为pdf
  //参数：
  //filePath/string：word文件名
  //outfileName/string：输出文件名
  //callback/string：回调 0 文件不存在，1 成功，-1 失败
  this.WordSavwAsPdf = function (){
    if(browserType == 1){
      jsObj.WordSavwAsPdf(arguments[0],arguments[1],arguments[2])
    }
    else if(browserType == 0){
      window.external.WordSavwAsPdf(arguments[0],arguments[1],arguments[2])
    }
  }
  //获取指定word文件的页数
  //参数：
  //filePath/string：word文件名
  this.GetPagecountOfWORD =	function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.GetPagecountOfWORD(arguments[0]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.GetPagecountOfWORD(arguments[0]);
    }
  }

  //获取EXCEL第一个sheet页数
  //参数：
  //filePath/string：excel文件名
  this.GetPageCountOfExcel = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.GetPageCountOfExcel(arguments[0]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.GetPageCountOfExcel(arguments[0]);
    }
  }
  //打印word/excel(sheetIndex)
  //参数：
  //parames/string：json字符串
  /*json格式如下：
  *          flieType 1表示excel,2表示word；
  *          flieName 文件名；
  *          printerName 打印机名；
  *          sheetIndex 如果是excel,打印第几个sheet；
  *          copies 份数
  */
  //callback/string：回调 文件不存在 0，打印成功 1，文件类型不正确 2，sheetIndex 超出范围：3，打印出错 -1
  this.PrintOfficeFile = function (){
    if(browserType == 1){
      jsObj.PrintOfficeFile(arguments[0], arguments[1]);
    }
    else if(browserType == 0){
      window.external.PrintOfficeFile(arguments[0], arguments[1]);
    }
  }
  //打印excel所有sheet页
  //参数：
  //parames/string：json字符串
  /*json格式如下：
   *              fileName 文件名；
   *              copies 份数；
   *              printerName 打印机名
   */
  //callback/string：回调 文件不存在 0，打印成功 1，打印出错 -1
  this.PrintExcelAll = function (){
    if(browserType == 1){
      jsObj.PrintExcelAll(arguments[0], arguments[1]);
    }
    else if(browserType == 0){
      window.external.PrintExcelAll(arguments[0], arguments[1]);
    }
  }
  //获取excel文件真实格式所对应的扩展名
  //参数：
  //fileName/string：文件名
  //返回值/string："","xls","xlsx"
  this.GetExtNameOfExcelFile = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.GetExtNameOfExcelFile(arguments[0])
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.GetExtNameOfExcelFile(arguments[0])
    }
  }
  //合并（拼接）pdf文件
  //参数：
  //_sourceFile/string：待合并文件(以逗号分隔)
  //_outFile/string：合并后输出文件
  //callback/string：回调(可为空),0 有文件不存在，不转换；1 结束
  this.UnionPdf = function (){
    if(browserType == 1){
      jsObj.UnionPdf(arguments[0],arguments[1],arguments[2])
    }
    else if(browserType == 0){
      window.external.UnionPdf(arguments[0],arguments[1],arguments[2])
    }
  }
  //Spire.Pdf:小册子形式打印pdf
  //参数：
  //settingParams/string：json字符串
  /*json格式如下：
   *              fPath 文件路径
   *              fFlieName 文件名
   *              printerName 打印机名
   *							fromPage 开始页码
   *							toPage 终止页码
   */
  //callback/string：回调(1,结束)
  this.SpirePrintPdfBook = function (){
    if(browserType == 1){
      jsObj.SpirePrintPdfBook(arguments[0],arguments[1]);
    }
    else if(browserType == 0){
      window.external.SpirePrintPdfBook(arguments[0],arguments[1]);
    }
  }
  //Spire.Pdf:顺序打印pdf
  //参数：
  //settingParams/string：json字符串
  /*json格式如下：
   *              fPath 文件路径
   *              fFlieName 文件名
   *              printerName 打印机名
   *							fromPage 开始页码
   *							toPage 终止页码
   */
  //callback/string：回调(1,结束)
  this.SpirePrintPdfOrder = function (){
    if(browserType == 1){
      jsObj.SpirePrintPdfOrder(arguments[0],arguments[1]);
    }
    else if(browserType == 0){
      window.external.SpirePrintPdfOrder(arguments[0],arguments[1]);
    }
  }
  //pdf任务
  //参数：
  //urlParams/string：json格式参数
  /*	urlParams
              {
          "uploadUrl": "",  //pdf上传路径
          "pdfList": "",   ///获取打印任务url
          "handleFailureUrl": "",  //错误处理结果url
          "showZsDetailUrl": "",   //证书详情查询url
                      "customerId": "1002",
      }
   */
  //callback/string：回调
  this.generatePdfTask = function (){
    if(browserType == 1){
      jsObj.generatePdfTask(arguments[0],arguments[1]);
    }
    else if(browserType == 0){
      window.external.generatePdfTask(arguments[0],arguments[1]);
    }
  }
  //照相机窗体
  //参数：
  //callback/string：回调
  this.Camera = function (){
    if(browserType == 1){
      jsObj.Camera(arguments[0]);
    }
    else if(browserType == 0){
      window.external.Camera(arguments[0]);
    }
  }
  //设置默认打印机
  //参数：
  //printerName/string：打印机名
  this.SetDefaultPrinter = function (){
    if(browserType == 1){
      jsObj.SetDefaultPrinter(arguments[0]);
    }
    else if(browserType == 0){
      window.external.SetDefaultPrinter(arguments[0]);
    }
  }
  //打印主页面
  this.PrintMainHtml = function (){
    if(browserType == 1){
      jsObj.PrintMainHtml(arguments[0],arguments[1]);
    }
    else if(browserType == 0){
      if(arguments[0] == 0){
        window.external.DirectPrintHtml();
      }
      else if(arguments[0] == 1){
        window.external.PrintPreviewHtml();
      }
      else if(arguments[0] == 2){
        window.external.NormalPrintHtml();
      }
    }
  }
  //获取打印机列表
  //参数：
  //返回值/string：打印机列表（以 ` 分隔）
  this.GetPrinterList = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.GetPrinterList()
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.GetPrinterList()
    }
  }


  //chrome:打印源码（ie不存在此方法）
			//参数：
			//source/string：源码
      //json/string：参数
      /*
      {
            "isprintView":"true",		//是否是打印预览
            "callback":"callback",		//回调 1 打印结束，0 打印失败，-1 打印超时
						"marginleft":"5.05",		//左边踞
						"marginright":"5.05",		//右边踞
						"margintop":"5.05",			//上边踞
						"marginbottom":"5.05",	//下边踞
						"landscape":"false",		//是否横向打印
            "printer":"zsdy"				//打印机名称（可空）
            }				
      */
		this.PrintHtmlBySource = function(){
			if(browserType == 1){
				jsObj.PrintHtmlBySource(arguments[0],arguments[1]);
			}
			else if(browserType == 0){
				consloe.log("no method")
			}
		};
  //IE:打开iframe空窗体
  this.IframeOpenIE=function(){
    if(browserType == 1){
      consloe.log("no method")
    }
    else if(browserType == 0){
      window.external.IframeOpen_w(window,arguments[0]);
    }
  };
  //IE:获取iframe空窗体的window对象
  this.IframeGetWindowIE=function(){
    if(browserType == 1){
      consloe.log("no method")
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.IframeGetWindow(arguments[0]);
    }
  };
  //IE:打印iframe
  this.IframePrintIE=function(){
    if(browserType == 1){
      consloe.log("no method")
    }
    else if(browserType == 0){
      window.external.IframePrint_w(window,arguments[0],arguments[1]);
    }
  };
  //IE:打印预览iframe
  this.IframePreviewIE=function(){
    if(browserType == 1){
      consloe.log("no method")
    }
    else if(browserType == 0){
      window.external.IframePreview(arguments[0]);
    }
  };
  //IE:显示打印弹框
  this.IframeShowPrintDialogIE=function(){
    if(browserType == 1){
      consloe.log("no method")
    }
    else if(browserType == 0){
      window.external.IframeShowPrintDialog();
    }
  };
  //设置打印机参数
  //参数：
  //jsonString/string：设置参数
  /*

           {
          "printerName": "HP Officejet 100 Mobile L411",
          "marginRight": "0.198819",//约5.08mm,右边距
          "marginTop": "0.198819",//约5.08mm,上边距
          "marginLeft": "0.198819",//约5.08mm，左边距
          "marginRight": "0.198819",//约5.08mm，右边距
          "footer": "",//页脚，
          "header": ""//页眉，
      };
   */
  this.setPrinterSettings=function(){
    if(browserType == 1){
      jsObj.setPrinterSettings(arguments[0]);
    }
    else if(browserType == 0){
      window.external.setPrinterSettings(arguments[0]);
    }
  };

  //chrome:操作ie副窗体
  //参数：
  //methodName/string：方法名
  //objParame/Array：参数数组
  //返回值：0 ie未打开，-1 执行出错，js返回值
  this.ieFormOperation = function(){
    if(browserType == 1){
      CsharpReturnValue = jsObj.ieFormOperation(arguments[0],arguments[1])
    }
    else if(browserType == 0){
      consloe.log("no method")
    }
  };
  //数据交互窗体显示
  this.DataCollectShow = function(){
    if(browserType == 1){
      jsObj.DataCollectShow();
    }
    else if(browserType == 0){
      window.external.DataCollectShow();
    }
  };
  //数据采集更新本地配置文件
  this.DataCollectUpdate = function(){
    if(browserType == 1){
      CsharpReturnValue = jsObj.DataCollectUpdate(arguments[0],arguments[1])
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.DataCollectUpdate(arguments[0],arguments[1])
    }
  };

  //显示pdf
  //参数：
  //address/string：pdfurl
  this.ShowPdfWithotSave = function(){
    if(browserType == 1){
      CsharpReturnValue = jsObj.ShowPdf(arguments[0])
    }
    else if(browserType == 0){
      consloe.log("no method")
    }
  };

  //emz/emf转png
  //参数：
  //filePath/string：原文件路径
  //返回值/string：png文件名或空
  this.ConvertEmfToPNG = function (){
    if(browserType == 1){
      CsharpReturnValue = jsObj.ConvertEmfToPNG(arguments[0]);
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.ConvertEmfToPNG(arguments[0]);
    }
  };

  //chrome:打印url（ie不存在此方法）
	//参数：
	//source/string：url
  //json/string：参数
  /*
  {
        "isprintView":"true",		//是否是打印预览
        "callback":"callback",		//回调 1 打印结束，0 打印失败，-1 打印超时
				"marginleft":"5.05",		//左边踞
				"marginright":"5.05",		//右边踞
				"margintop":"5.05",			//上边踞
				"marginbottom":"5.05",	//下边踞
				"landscape":"false",		//是否横向打印
        "printer":"zsdy"				//打印机名称（可空）
        }				
  */
	this.PrintHtmlByUrl = function(){
		if(browserType == 1){
			jsObj.PrintHtmlByUrl(arguments[0],arguments[1]);
		}
		else if(browserType == 0){
			consloe.log("no method")
		}
	};
  //保存word（与openWord配合使用）
  //参数：
  //fileName/string:保存文件名
  //成功 回调返回2，失败回调返回-1
  this.saveWord = function (){
    if(browserType == 1){
      jsObj.saveWord(arguments[0])
    }
    else if(browserType == 0){
      window.external.saveWord(arguments[0])
    }
  };

  //签名版调用
  //参数：
  //callback/string:回调方法
  /*
    回调返回参数信息如下：
    保存图片（上传）：
    {
        "operation": "saveImage",
        "signJosn": {
            "msg": "上传成功！",
            "v_attach_id": "A00000002799",
            "v_stream_url": "http://192.168.99.118:7900/attachment/outputStream/",
            "success": "1",
            "v_server_url": "http://192.168.99.118:7900/attachment/down/",
            "v_orig_name": "hwsign.png"
        }
    }
        operation：saveImage	动作信息，表示保存为图片
        signJosn：json格式信息
            msg：上传返回消息
            success： 1 上传成功 0 上传失败
            v_attach_id：存储路径id，表ATTACHMENT中attach_id字段

    关闭：
    { "operation":"close"}
        operation：动作信息，表示关闭签名窗口，且关闭设备
    重复打开：
    { "operation":" repeatedOpen "}
        operation：动作信息，表示已经打开签名界面且未退出，不能同时打开多个界面。
      */
  this.SignHWESP370 = function(){
    if(browserType == 1){
      jsObj.SignHWESP370(arguments[0])
    }
    else if(browserType == 0){
      window.external.SignHWESP370(window,arguments[0])
    }
  };
  //获取默认打印机名
  //参数: 无
  //返回值:默认打印机名
  this.GetDefaultPrinterName = function(){
    if(browserType == 1){
      CsharpReturnValue = jsObj.GetDefaultPrinterName()
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.GetDefaultPrinterName()
    }
  };
  //返回当前运行目录
  this.GetCuttentDirectory = function(){
    if(browserType == 1){
      CsharpReturnValue = jsObj.GetCuttentDirectory()
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.GetCuttentDirectory()
    }
  };
  /*

   在容器中打开word
   name：Word标志名
   json:字符串

      var jsonparm ={
       {
          "fileId":"A00000004080",        //文件id
          "fileName": "",                 //文件名
          "winWidth": "1200",             //打开宽度
          "winHeight": "1000",            //打开高度
          "caseId":"",                    //可空
          "mode":"ff",                     //打开方式： 只读 "r",读写 "rw", 浏览（不能修改保存）"ff" 不区分大小写
          "isNotZS":"0"                   //非证书标志（预留）
              }
      */
  this.ConWordListOpen = function(){
    if(browserType == 1){
      jsObj.ConWordListOpen(arguments[0],arguments[1])
    }
    else if(browserType == 0){
      window.external.ConWordListOpen(window,arguments[0],arguments[1])
    }
  };
  /*
      关闭容器中word
   name：Word标志名
      */
  this.ConWordListClose = function(){
    if(browserType == 1){
      jsObj.ConWordListClose(arguments[0])
    }
    else if(browserType == 0){
      window.external.ConWordListClose(arguments[0])
    }
  };
  /*
      关闭所有容器中word
   name：Word标志名
      */
  this.ConWordListCloseAll = function(){
    if(browserType == 1){
      jsObj.ConWordListCloseAll()
    }
    else if(browserType == 0){
      window.external.ConWordListCloseAll()
    }
  };
  /*
         * 保存word
         * name:word标志名
         */
  this.ConWordListSave = function(){
    if(browserType == 1){
      CsharpReturnValue = jsObj.ConWordListSave(arguments[0])
    }
    else if(browserType == 0){
      CsharpReturnValue = window.external.ConWordListSave(arguments[0])
    }
  };
  /*
         * 设置word容器大小（位置取内存中值）
         * name:word标志名
         * winWidth:宽度
         * winHeight:高度
         */
  this.ConWordListReSetSize = function(){
    if(browserType == 1){
      jsObj.ConWordListReSetSize(arguments[0],Number(arguments[1]),Number(arguments[2]))
    }
    else if(browserType == 0){
      window.external.ConWordListReSetSize(arguments[0],Number(arguments[1]),Number(arguments[2]))
    }
  };
  /*
         * 设置word容器位置大小
         * name:word标志名
         * winX:左顶点x坐标
         * winY:左顶点y坐标
         * winWidth:宽度
         * winHeight:高度
         */
  this.ConWordListReSetLocation = function(){
    if(browserType == 1){
      jsObj.ConWordListReSetLocation(arguments[0],Number(arguments[1]),Number(arguments[2]),Number(arguments[3]),Number(arguments[4]))
    }
    else if(browserType == 0){
      window.external.ConWordListReSetLocation(arguments[0],Number(arguments[1]),Number(arguments[2]),Number(arguments[3]),Number(arguments[4]))
    }
  };

   /*
         * 打印pdf
         * fileName：文件名
         * printerName：打印机名，空则取默认打印机
         * 返回值：整型值
            OK = 0,
            FILE_DOESNT_EXIST = 1,
            CANNOT_PRINT_FILE = 2,
            PRINTER_DOESNT_EXIST = 3,
            INVALID_DEVMOD = 4,
            NOT_AVAILABLE_PRINTER_PROPERTIES = 5,
            CANT_INITIALIZE_PRINTER = 6,
            INVALID_PDF = 7,
            FILENAME_NOT_SET = 8,
            PASSWORD_NOT_PROVIDED = 9,
            PASSWORD_INVALID = 10,
            UNKNOWN_ERROR = 11,
            INVALID_PRINT_RANGE = 12,
            PAGE_NUMBER_DOESNT_EXIST = 13
         */
  this.PrintPdfToDev = function(){
    if(browserType == 1){
      CsharpReturnValue = jsObj.PrintPdfToDev(arguments[0],arguments[1])
    }
    else if(browserType == 0){
      consloe.log("no method")
    }
  };
  /*
         * 主页面打印
         *
         * pstJson:{"marginleft":"5.05","marginright":"5.05","margintop":"5.05","marginbottom":"5.05","landscape":"false"}
         *      单位：mm ,默认值：5.05 ,false  不区分大小写
         * isPrintView: 0 打印,1 打印预览
         */
  this.Print = function(){
    if(browserType == 1){
      CsharpReturnValue = jsObj.Print(arguments[0],arguments[1])
    }
    else if(browserType == 0){
      consloe.log("no method")
    }
  }


}

//v3.0请自行解除注释
//export { CsharpObject,CsharpObject1,AlertMessage,CsharpReturnValue};
