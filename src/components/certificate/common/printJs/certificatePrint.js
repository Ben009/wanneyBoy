import $ from 'jquery';
// import {CsharpObject,AlertMessage} from "@/components/util/chromeUtil.js";
export default {
  data(){
  },
  mounted() {
    Cmessage = this.$message;
  },
  methods: {
    //获得打印机列表
    getPrinterList()
    {
      CsharpObject().GetPrinterList();
      //Microsoft XPS Document Writer`Microsoft Print To PDF`Fax
      return CsharpReturnValue.split("`");
    },
    //获得默认打印机
    getDefaultPrinterName()
    {
      CsharpObject().GetDefaultPrinterName();
      //Microsoft XPS Document Writer`Microsoft Print To PDF`Fax
      return CsharpReturnValue;
    },
    //获得默认打印机
    getDefaultPrinterName()
    {
      CsharpObject().GetDefaultPrinterName();
      //Microsoft XPS Document Writer`Microsoft Print To PDF`Fax
      return CsharpReturnValue;
    },
    //获得容器根目录
    getCuttentDirectory(){
      CsharpObject().GetCuttentDirectory();
      return CsharpReturnValue;
    },
    //打开PDF
    openPDF(path){
      CsharpObject().ShowPdfWithotSave(path);
    },
    //下载服务器文件
    //isBatch 是否批量打印
    //backPrint 是否备用打印
    //printCopies 打印份数
    //callBackFunction 回调
    //下载完毕后回调方法名称
    fileDownlodByFileId(fileName,printer,isBatch,backPrint,printCopies,callBackName,callBackFunction,zsbh){
      var path = this.getCuttentDirectory() ;
      window.njmindTools.fileDownlodByFileId(fileName,path+"/" + fileName+"_"+zsbh+".pdf",callBackName)
      console.log("pdf下载完毕"+callBackName)
      //打印PDF
      njmindTools.toPrintPDF=()=>{
        this.printPDF(path,fileName,printer,isBatch,backPrint,printCopies,callBackFunction,zsbh);
      };
      //打开PDF
      njmindTools.toOpenPDF=()=>{
        this.openPDF(path+"/" + fileName+"_"+zsbh+".pdf");
      };
    },
    //打印PDF
    //isBatch 是否批量打印
    //backPrint 是否备用打印
    //printCopies 打印份数
    //callBack 回调
    printPDF(path,fileName,printer,isBatch,backPrint,printCopies,callBackFunction,zsbh){
      var json = {
        "fPath": path,  //文件路径
        "fFlieName": fileName+"_"+zsbh+".pdf",   ///文件名
        "printerName": printer,  //打印机名
        "fromPage": "1",//从第几页起
        "toPage": ""	//至第几页
      };
      console.log(json,'json')
      for(var i=0;i<printCopies;i++){
        if(i != (printCopies-1) ){
          window.njmindTools.printPDF(json, "");
        }else {
          window.njmindTools.printPDF(json, "printCallBack");
        }
      }
      njmindTools.printCallBack=()=>{
        if(typeof callBackFunction == "function"){
          callBackFunction(isBatch,backPrint);
        }
      };

    },
  },
  // created(){
  //   //获得检定周期
  //   this.CsharpObject = CsharpObject();
  // },
}
