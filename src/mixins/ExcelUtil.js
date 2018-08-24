// author:huangli
import Vue from 'vue';
import $ from 'jquery';
export default {
    data(){
        return{
          excelRedRange:'', // 证书保存时记录的红色区域
          excelBlueRange:'',// 证书保存时记录的蓝色区域
          existsExcel:false, // 标记excel是否存在 如果不存在则不走保存excel的流程
          upLoadEmf:false,
          activeLabel: '', // 激活标识名
          excelInfo: {
            excelId: null, // excel下载Id
            excelName: null, // 本地excel路径 （名与意不一样）
            rangeVersion: 'new', // 画框版本  new \old
            redWidth: null, // 红框宽度
            redHeight: null, // 红框高度
            redRange: null, // 红框坐标
            blueWidth: null, // 蓝框宽度
            blueHeight: null, // 蓝框高度
            blueRange: null, // 蓝框坐标
            btnType: '1', // 按钮类型 0禁用 1启用
            savePicture: '0', // 保存图片 0不保存 1保存
            winWidth: null, // excel窗宽
            winHeight: null, // excel窗高
            downLoadExcel: '0', // 下载excel 0 不可以 1可以
            excelType: null,
            isSaveRange: false,  //是否保存红蓝区域
            isSaveExcel: false,  //保存excel
            isSaveEmf:false,     //保存emf
            needSaveEmfCallBack: false  //保存emf需要回调
          }
        }
    },
    methods: {
      /**
       * excel下载的方法
       * 下载成功之后才能执行打开excel的操作 注意：文件id应为动态
       */
      ExcelDownLoad(fileId,savePathLocal){
        njmindTools.fileDownlodByFileId(fileId, savePathLocal, "fileDownlodCallBack");
        njmindTools.fileDownlodCallBack = (resultValue) => {
          // 当回调返回的是100 则表示下载成功 -1 则表示下载失败
          if (resultValue == 100) {
            this.openExcel();
            this.addCloseAction();
          }else{
            throw new Error('下载失败'+resultValue)
          }
        }
      },
      /**
       * 为excel添加关闭的行为（单纯关闭不保存）
       * 通过容器的ConExcelListAddButton的方法可以为excel添加额外的行为
       */
      addCloseAction(){
        CsharpObject().ConExcelListAddButton(this.activeLabel,'close','njmindTools.closeAction','关闭');
        njmindTools.closeAction = (...values) => {
          this.closeExcel();
        }
      },
      /**
       * 异步处理保存和文件上传操作
       * 操作不骤：保存excel => 保存emf => 关闭excel不占用 => 上传excel、上传emf压缩文件
       */
      async handleExcelUpload(){
        await this.awaitFunction();
        let upLoadFileType = this.upLoadEmf ? [njmindTools.certificateFileUpload(this.activeLabel),njmindTools.certificateFileUpload(this.zipfile)] : [njmindTools.certificateFileUpload(this.activeLabel)];
        await Promise.all(upLoadFileType)
      },
      /**
       * excel关闭之前的操作（包括保存excel、保存emf、关闭excel） 这些方法都是同步执行的
       * @return {[type]} [description]
       */
      awaitFunction(){
        return new Promise((resolve) => {
          CsharpObject().ConExcelListSave(this.activeLabel);
          if(CsharpReturnValue == false) throw new Error('excel保存失败');
          CsharpObject().ConExcelListSaveEmf(this.activeLabel,this.excelRedRange,this.excelBlueRange,this.zipfile);
          this.upLoadEmf = CsharpReturnValue == '' ? false : true;
          this.closeExcel();
          resolve()
        })
      },
      /**
       * 打开excel文件
       * excelInfo 自行设置打开参数。
       */
      openExcel(excelParam) {
        console.log("openExcel")
        if (navigator.userAgent.indexOf("CefSharp") == -1 && navigator.userAgent.indexOf("IECsharp") == -1) { //未在容器中
          this.$message.error("此功能依赖于容器，请在容器中进行操作。");
          return;
        }
        this.existsExcel = true;
        var jsonParam = {};

        if(!!excelParam && typeof excelParam == "object"){
          jsonParam = excelParam;
        }else{
          jsonParam = this.excelInfo;
        }
        // callBack不存在时调用默认的callBack方法
        if(!jsonParam["rangeCallBack"]){
          jsonParam["rangeCallBack"] = "njmindTools.rangeCallBack";
        }
        if(!jsonParam["operationCallBack"]){
          jsonParam["operationCallBack"] = "njmindTools.operationCallBack";
        }

        //设置窗口默认大小
        if(!jsonParam["winWidth"] || jsonParam["winWidth"]== '0'){
          jsonParam["winWidth"] = parseInt(document.documentElement.clientWidth * 0.7) + '';
        }

        if(!jsonParam["winHeight"] || jsonParam["winHeight"]== '0'){
          jsonParam["winHeight"] = parseInt(document.documentElement.clientHeight * 0.7) + '';
        }
        // 设置iframe名称
        console.log(window.parent.$routerNow,"当前路由")
        jsonParam["iframeName"] = window.parent.$routerNow.name;

        //初始化 红蓝框默认值
        this.excelRedRange = jsonParam["redRange"]
        this.excelBlueRange = jsonParam["blueRange"]

        console.log(jsonParam);
        CsharpObject().ConExcelListOpen(
          this.activeLabel,
          JSON.stringify(jsonParam)
        );
      },
      /**
       * 保存并上传excel
       *   {
       *      "msg": "上传成功！",
       *      "v_attach_id": "A00000002477",
       *      "v_stream_url": "http://192.168.99.118:7900/attachment/outputStream/",
       *      "success": "1", //1 上传成功 0 上传失败
       *      "v_server_url": "http://192.168.99.118:7900/attachment/down/",
       *      "v_orig_name": "7b92caa9881b4e569bd2670b6fc0ca34.xlsx"
       *    }
       */
      saveAndUploadExcel(){
         CsharpObject().ConExcelListSave(this.activeLabel);
        var jsonObject = {};
         if(!!CsharpReturnValue){
           try {
             jsonObject = JSON.parse(CsharpReturnValue);
           } catch (e) {
             jsonObject.success = false;
             console.log(e);
           }

           jsonObject.success =  jsonObject.success == '1';
           // 关闭excel
           // this.closeExcel();
         }else {
           jsonObject.success = false;
         }
        return jsonObject;
      },
      /**
       * 处理提交是保存Excel
       * 将保存后的excel参数同步至excelInfo中
       */
      handleSubmitSaveExcel(){
        //处理excel Start
        if (!!this.existsExcel) {
          let saveExcelResult = this.saveAndUploadExcel()
          if (!saveExcelResult.success) {
            this.$message.error('Excel保存失败！')
            return false ;
          }
          // 红蓝框信息
          if(this.excelInfo.isSaveRange){
            this.excelInfo.redRange = this.excelRedRange
            this.excelInfo.blueRange = this.excelBlueRange
          }
          this.excelInfo.excelId = saveExcelResult.v_attach_id
          this.excelInfo.isSaveExcel = true
          if (saveExcelResult.v_orig_name) {
            this.excelInfo.excelType = saveExcelResult.v_orig_name.substr(saveExcelResult.v_orig_name.lastIndexOf('.') + 1)
          }
        }
        return true;
        // 处理excel End
      },
      /**
       * 关闭excel的操作
       */
      closeExcel() {
        this.existsExcel = false;
        this.excelInfo.isSaveRange = false;
        CsharpObject().ConExcelListClose(this.activeLabel)
      },
      /**
       * 显示excel的操作
       */
      showExcel() {
        javascript: CsharpObject().ConExcelListShow(this.activeLabel);
      },
      /**
       * 隐藏excel的操作
       * 进入其他页面不直接关闭excel而是隐藏，下次进入的时候在显示，缓存
       */
      hideExcel() {
        javascript: CsharpObject().ConExcelListHide();
      },
      /**
       * 修改Excel窗口状态
       * @param state -1 最小化，0 正常状态，1 最大化
       */
      setExcelWinState(state) {
        CsharpObject().ConExcelListWindowState(this.activeLabel,state)
      },
      /**
       * 格式化坐标范围  （C#要求格式）
       * @param rangeArr //坐标列表。后台返回的List
       */
      formatterPositionRange (rangeArr) {
        let jsonString = '{}'
        if (!!rangeArr && rangeArr.length > 0) {
          let tempObj = {}
          // 将数据处理成c#容器所需格式
          rangeArr.forEach((item, index) => {
            if (tempObj[item.sheetName]) { // 值存在
              tempObj[item.sheetName] += (item.rangePosition + '##')
            } else {
              tempObj[item.sheetName] = item.rangePosition + '##'
            }
          })
          jsonString = JSON.stringify(tempObj)
        }
        console.log(jsonString)
        return jsonString
      },
      /**
       * 初始化Excel参数
       * @param info
       */
      initExcelInfo(info) {
        console.log("info")
        console.log(info)
        this.excelInfo.excelId = info.excelPath
        this.excelInfo.caseId = !!info.caseId ? info.caseId : info.mbId     // 登记号\模版ID       [非必填]  业务相关的登记号
        this.excelInfo.excelType = info.excelType
        this.activeLabel = !info.excelPath ? info.mbId + '' : info.excelPath

        // 将数据处理成c#容器所需格式
        this.excelInfo.rangeVersion = 'new'
        this.excelInfo.redWidth = info.redWidth + ''
        this.excelInfo.redHeight = info.redHeight + ''
        this.excelInfo.redRange = this.formatterPositionRange(info.excelRedList)

        this.excelInfo.blueWidth = info.blueWidth + ''
        this.excelInfo.blueHeight = info.blueHeight + ''
        this.excelInfo.blueRange = this.formatterPositionRange(info.excelBlueList)
      },
      /**
       * 获取excelInfo
       */
      getExcelInfo () {
        return this.excelInfo
      },
      /**
       * 打开excel窗口
       */
      openExcelDialog(){
        this.openExcel();
        // if(!this.existsExcel){ //excel不存在
        //   this.openExcel();
        // }else { //显示excel
        //   this.setExcelWinState(0);
        // }
      },
      /**
       * 创建结果页
       * @param item      截图返回值
       * @param createType 创建类型：0 红框/ 1篮框
       */
      createResultPage(item,createType){
        let src = "/njmind/attachment/down/";
        let color = "";
        let jqueryObject = "";
        try {
          if(createType == 1){
            color = "blue";
            jqueryObject = $(this.blueResultPageHtml);
          }else{
            color = "red";
            jqueryObject = $(this.redResultPageHtml);
          }
          let divName = "zs_jgy_" + color;
          let imgName = divName + "_img";

          let imgHtml = ' <!--' + imgName + '_start--> ' +
            ' <img name="' + imgName + '" src=" ' + src + item["pngId"] + '" ' +
            ' style="width: ' + item["pictureWidth"] + 'pt;height: ' + item["pictureHeight"] + 'pt;"' +
            ' data-png-file-id="' + item["pngId"] + '" data-emz-file-id="' + item["emfId"] + '"> ' +
            ' <!--' + imgName + '_end--> ';
          jqueryObject.find("[name='"+divName+"']").eq(0).html(imgHtml);
          return jqueryObject.prop("outerHTML");
        }catch (e) {
          console.log("createResultPageError:"+e)
          return ""
        }
      },
      clearRange(){
        this.excelRedRange = "{}";
        this.excelBlueRange = "{}";
        this.excelInfo.isSaveRange = true;
      }
    },
    mounted() {
      window.globalEvents = {
        _this:this,
        _destroyed(that){
          if (navigator.userAgent.indexOf("CefSharp") > -1 || navigator.userAgent.indexOf("IECsharp") > -1) {
            that.closeExcel();
          }
        },
        _activated(that){
          if (navigator.userAgent.indexOf("CefSharp") > -1 || navigator.userAgent.indexOf("IECsharp") > -1) {
            that.showExcel();
          }
        },
        _deactivated(that){
          if (navigator.userAgent.indexOf("CefSharp") > -1 || navigator.userAgent.indexOf("IECsharp") > -1) {
            that.hideExcel();
          }
        }
      }
      Cmessage = this.$message;
      /**
       * 页面初始化时 为全局对象定义一个方法 用于处理画框的操作回调
       * 接受回调返回的参数 name：excel的标记、range：画框的数据、color：框的类型、type：是添加框还是删除框
       * 判断类型为定义好的变量赋值，为保存操作做准备
       */
      if (navigator.userAgent.indexOf("CefSharp") > -1 || navigator.userAgent.indexOf("IECsharp") > -1) {
        /**
         * 默认的Excel画框回调
         * @param name    // Excel标识名
         * @param range   // 坐标
         * @param color   // 颜色(即画框类型 red、blue)
         * @param optType // 操作类型 delete、save
         */
        njmindTools.rangeCallBack = (name,range,color,optType) => {
          console.log("rangeCallBack:"+range)
          if(!this.excelInfo.isSaveRange){
            this.excelInfo.isSaveRange = true;
          }
          if(color == 'red'){
            this.excelRedRange = range
          }else{
            this.excelBlueRange = range
          }
        };
        /**
         * 默认的excel 操作 回调方法
         * @param paramStr  jsonString
         *    关闭：{"excelId":"excel1","operation":"close"}
         *    excelId : Excel标志名  operation:操作类型
         *    emfJSON : 上传emz压缩文件时返回的参数，关闭时没有此参数
         *    "emfJson": {
         *      "zipId": "A00000002472", //上传的zipId
         *      "emz": [{
         *              "emfId": "A00000002473", //zip解压后 emfId
         *              "pngId": "A00000002474", //zip解压后 pngId
         *              "pictureWidth": "486",
         *              "pictureHeight": "634.5",
         *              "fileType": "red"  red 红框，blue 蓝框，null 无框
         *          }
         */
        njmindTools.operationCallBack = (paramStr) => {
          var jsonObject = JSON.parse(paramStr);
          if( !!jsonObject ){
            var operation = jsonObject.operation;
            console.log(operation)
            if (operation == 'close'){ //关闭
              this.existsExcel = false;
              this.excelInfo.isSaveRange = false;
              this.excelInfo.isSaveExcel = false;

              if(!!this.isShowExcel){
                this.isShowExcel = false;
              }
            }else if (operation == 'saveEmf'){

                if(!jsonObject.excelJson || jsonObject.excelJson.success != '1'){
                  this.$message.error("操作失败!")
                  return ;
                }

                this.excelInfo.excelId = jsonObject.excelJson.v_attach_id;
                this.excelInfo.emfJson = jsonObject.emfJson;
                this.excelInfo.isSaveEmf = true;
                console.log("saveEmfCallBack："+this.excelInfo.needSaveEmfCallBack)
                if(!!this.excelInfo.needSaveEmfCallBack){
                  try {
                    this.saveEmfCallBack();
                  }catch (e) {
                    console.log("saveEmfCallBack回调失败:"+e)
                  }
                }
            }else if (operation == 'clearRange' ){ //清空红蓝框
              this.clearRange();
            }else if(operation == 'openLocalExcel'){ //打开本地excel，暂时只需要清除红蓝框参数
              this.clearRange();
            }
          } else {
            console.log(paramStr);
          }

        }
      }
    },
    destroyed() {
      /**
       * 如果用户直接关闭页面 则关闭excel 避免重复打开excel过度占用系统资源
       */
      if (navigator.userAgent.indexOf("CefSharp") > -1 || navigator.userAgent.indexOf("IECsharp") > -1) {
        this.closeExcel();
      }
    },
    activated(to, from, next){
      console.log('1111111111111111111111111111111111111')
      next(vm => {
       /**
         * 当用户没有关闭页面的时候，并从其他页面进入的时候则显示excel
         */
        if (navigator.userAgent.indexOf("CefSharp") > -1 || navigator.userAgent.indexOf("IECsharp") > -1) {
          vm.showExcel();
        }
      })
    },
    /**
     * 当用户没有关闭页面的时候，并从该页面离开的时候则隐藏excel
     */
    deactivated(to, from, next){
      console.log('2222222222222222222222222222222222222222')
      if (navigator.userAgent.indexOf("CefSharp") > -1 || navigator.userAgent.indexOf("IECsharp") > -1) {
        this.hideExcel();
      }
      next()
    }
}
