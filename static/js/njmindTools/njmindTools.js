/**
 * @author dqm
 * @description C#容器交互脚本
 * @date 2018-06-06
 */
//控件对象
var njmindTools = new Object();

//文件下载地址 (目前由数据字典维护)
njmindTools.fileDownloadUrl = localStorage.getItem("fileDownloadUrl" );//"/njmind/attachment/down/";

//文件上传地址 (目前由数据字典维护)
njmindTools.fileUploadUrl = localStorage.getItem("fileUploadUrl" );//"/njmind/attachment/upload/";

//证书文件服务ID
njmindTools.serverIdCertificate = "http6";

/**
 * 文件下载 dqm 2018-06-05 add
 * @param fileId 文件ID
 * @param savePathLocal 本地保存路径
 * @param callBackFunctionName 回调方法名称
 */
// njmindTools.fileDownlod = function (fileId, savePathLocal, callBackFunctionName) {
//   let attachIds = "'" + fileId + "'";
//   ajaxProxyRequest('post', '/njmind/findParam/findAttachDownUrl', {
//     attach_ids: attachIds,
//     cache: "false"
//   }, (fileList) => {
//     if (fileList && fileList.list) {
//       for (let i = 0; i < fileList.list.length; i++) {
//         let fileObject = fileList.list[i];
//         //code 下载地址（优先级外网地址>>内网地址）无外网地址显示内网地址
//         //remark 文件名
//         //pcode 内网下载地址
//         //premark 附件id
//         CsharpObject().DownloadFile(fileObject.code, savePathLocal, "njmindTools." + callBackFunctionName);
//       }
//     }
//   });
// }

/**
 * 文件下载 dqm 2018-06-06 add
 * @param fileId 文件ID
 * @param savePathLocal 本地保存路径
 * @param callBackFunctionName 回调方法名称
 */
njmindTools.fileDownlodByFileId = function (fileId, savePathLocal, callBackFunctionName) {
  let fileUrlServer = '';//服务器文件地址 由数据字典维护
  if(localStorage.getItem("fileDownloadUrl")){
    fileUrlServer = localStorage.getItem("fileDownloadUrl") + fileId
  }else{
    throw new Error('未配置下载地址')
  }
  CsharpObject().DownloadFile(fileUrlServer, savePathLocal, "njmindTools." + callBackFunctionName);
}

/**
 * 文件下载 dqm 2018-06-06 add
 * @param fileUrlServer 服务器文件地址
 * @param savePathLocal 本地保存路径
 * @param callBackFunctionName 回调方法名称
 */
njmindTools.fileDownlodByFileUrl = function (fileUrlServer, savePathLocal, callBackFunctionName) {
  CsharpObject().DownloadFile(fileUrlServer, savePathLocal, "njmindTools." + callBackFunctionName);
}

/**
 * 文件下载 yjt 2018-06-06 add
 * @param printJson json格式如下：
 *              fPath 文件路径
 *              fFlieName 文件名
 *              printerName 打印机名
 *							fromPage 开始页码
 *							toPage 终止页码
 * @param callBackFunctionName 回调方法名称
 */
njmindTools.printPDF = function (printJson, callBackFunctionName) {
  CsharpObject().SpirePrintPdfOrder(JSON.stringify(printJson),"njmindTools." + callBackFunctionName);
}


/**
 * 文件上传 dqm 2018-06-06 add
 * @param filePathLocal 本地文件路径
 * @param serverId 服务ID
 * @param caseId 登记号ID
 * @param flowId 流程ID
 * @param execType 操作ID
 */
njmindTools.fileUpload = function (filePathLocal, serverId, caseId, flowId, execType) {
  if (!serverId) {
    serverId = "{server_id}";
  }
  if (!caseId) {
    caseId = "{case_id}";
  }
  if (!flowId) {
    flowId = "{flow_id}";
  }
  if (!execType) {
    execType = "{exec_type}";
  }

  var fileUploadUrl = njmindTools.fileUploadUrl;//文件上传地址
  fileUploadUrl += serverId;
  fileUploadUrl += "/" + caseId;
  fileUploadUrl += "/" + flowId;
  fileUploadUrl += "/" + execType;

  CsharpObject().FileUpload(fileUploadUrl, filePathLocal, "");
  return CsharpReturnValue;
}

/**
 * 文件上传
 * @param  {[type]} name [文件的标记位]
 * @return {[type]}               [description]
 */
njmindTools.certificateFileUpload = function (name) {
  let jsonparam = {
        serverId:'http6',//服务id     [非必填]  分布式附件服务可以用默认不用配制
        flowId:'', //流程id      [非必填]  流程相关
        execType:'证书',//操作类型   [非必填]  业务相关
        caseId:'',//登记号       [非必填]  业务相关的登记号
        childPath:"证书编号/@yyyyMMdd@", //例如 证书指定路径  【1】@yyyyMMdd@  会自动替换成当前日期 yyyyMMdd
      },
      fileUploadUrl = '';//服务器文件地址 由数据字典维护
  if(localStorage.getItem("fileUploadUrl")){
    fileUploadUrl = localStorage.getItem("fileUploadUrl")
  }else{
    throw new Error('未配置上传地址')
  }
  return new Promise((resolve,reject) => {
    CsharpObject().FileUpload(fileUploadUrl, name, JSON.stringify(jsonparam))
    CsharpReturnValue = CsharpReturnValue ? JSON.parse(CsharpReturnValue) : ''
    if(CsharpReturnValue && CsharpReturnValue.success == 1){
      resolve()
    }else{
      reject(new Error('上传失败'))
    }
  })
}
