import $ from 'jquery';
import store from '../../store'; // vuex仓库
/**
 * 打印工具类
 * @param {*} templet_name  模板名称
 * @param {*} data 数据
 * @param {*} rq 是否容器打印  0容器打印，1预览，2页面打印
 */
function printHtml(templet_name,data,rq){
        rq="1"||rq;
        var printIframe =document.createElement('div');
        printIframe.setAttribute('id', "printHtmlDivId");
        printIframe.setAttribute('style'," background: white; margin: 0px;  padding: 0px;width: 100%; height: 100%; position: absolute; z-index: "+store.state.admin.z_index+"; ")

        var iframe = document.createElement('iframe');
        iframe.setAttribute('id', "printHtmlIframeId");
        iframe.setAttribute('scrolling', "yes");
        iframe.setAttribute('frameborder', "0");
        iframe.setAttribute('style'," width: 100%; height: 99%;");

        printIframe.appendChild(iframe);
        document.body.appendChild(printIframe);

        var iwind=document.getElementById('printHtmlIframeId').contentWindow;

        var iframeDoc= iwind.document;
        //debugger
        $.ajax({
            url:"/static/print-templet/"+templet_name+".html",
            type:"get",
            xhrFields:{
              withCredentials:true
            },
            crossDomain:true,
            success:(res)=>{
                $(iframeDoc.body).html(res);
            },
            async:false
          });

        //document.getElementById('printHtmlIframeId').src="";
        //debugger
        //如果页面中有接收方法则调用方法
        if(iwind.receive){
            iwind.receive(data);
        }else{
            setPrintParam(iframeDoc.body,data);
        }
        //临时双击关闭预览界面
        $(iframeDoc.body).append("<div>临时双击关闭预览界面</div>");
        $(iframeDoc.body).dblclick(function(){
            document.body.removeChild(printIframe);
        });
        //alert($(iframeDoc.body).html());
        //document.body.removeChild(printIframe);
};

/**
 * 设定打印参数
 * @param {*} data
 */
function setPrintParam (obj,data){
    if(data && data!=null){
        $(obj).find("span").each(function(i,row){
            if($(this).attr("id")){
                if(data[$(this).attr("id")]){
                    $(this).html(data[$(this).attr("id")]);
                }else{
                    $(this).html("");
                }
            }
        });
    }
}


export { printHtml, };
