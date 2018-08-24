<!-- <template>
	<div id="certApp" >
		<keep-alive :include="['mycontent']">
			<mycontent :content="pp" />
		</keep-alive>
	</div>
</template> -->
<script>
import Vue from 'vue';
import mycontent from "./components/framework/CeriticateIframe.vue"

const URLS={
"500" :{"component": () => import("@/components/certificate/certificate/certificateAdd/certificateAdd.vue"),"url":"certificate/certificate/certificateAdd/certificateAdd","name":"/证书/记录/证书添加/证书添加"} ,
"504" :{"component": () => import("@/components/certificate/certificate/certificateAuditHyy/certificateAuditHyy.vue"),"url":"certificate/certificate/certificateAuditHyy/certificateAuditHyy","name":"/证书/记录/证书审核/证书核验"} ,
"503" :{"component": () => import("@/components/certificate/certificate/certificateAuditJdy/certificateAuditJdy.vue"),"url":"certificate/certificate/certificateAuditJdy/certificateAuditJdy","name":"/证书/记录/证书审核/证书检定"} ,
"505" :{"component": () => import("@/components/certificate/certificate/certificateAuditPzr/certificateAuditPzr.vue"),"url":"certificate/certificate/certificateAuditPzr/certificateAuditPzr","name":"/证书/记录/证书审核/证书主管"} ,
"511" :{"component": () => import("@/components/certificate/certificate/certificateBddyQuery/certificateBddyQuery.vue"),"url":"certificate/certificate/certificateBddyQuery/certificateBddyQuery","name":"/证书/记录/证书打印/补打打印"} ,
"501" :{"component": () => import("@/components/certificate/certificate/certificateEidtBeforePz/certificateEidtBeforePz.vue"),"url":"certificate/certificate/certificateEidtBeforePz/certificateEidtBeforePz","name":"/证书/记录/证书修改/批准前修改"} ,
"508" :{"component": () => import("@/components/certificate/certificate/certificateFsdyQuery/certificateFsdyQuery.vue"),"url":"certificate/certificate/certificateFsdyQuery/certificateFsdyQuery","name":"/证书/记录/证书打印/分散打印"} ,
"509" :{"component": () => import("@/components/certificate/certificate/certificateJzdyQuery/certificateJzdyQuery.vue"),"url":"certificate/certificate/certificateJzdyQuery/certificateJzdyQuery","name":"/证书/记录/证书打印/集中打印"} ,
"73" :{"component": () => import("@/components/certificate/certificate/certificateMainTemp/certificateMainTempMain.vue"),"url":"certificate/certificate/certificateMainTemp/certificateMainTempMain","name":"/证书/记录/证书模板/证书主模板"} ,
"512" :{"component": () => import("@/components/certificate/certificate/certificateQuery/certificateQueryList.vue"),"url":"certificate/certificate/certificateQuery/certificateQueryList","name":"/证书/记录/证书查询/证书查询"} ,
"54" :{"component": () => import("@/components/certificate/certificate/certificateTemp/certificateTempMain.vue"),"url":"certificate/certificate/certificateTemp/certificateTempMain","name":"/证书/记录/证书模板/证书模板"} ,
"314" :{"component": () => import("@/components/certificate/certificate/certificateTemplateFirstAudit/certificateTempMainFirstAudit.vue"),"url":"certificate/certificate/certificateTemplateFirstAudit/certificateTempMainFirstAudit","name":"/证书/记录/证书模板/模板一级审核"} ,
"349" :{"component": () => import("@/components/certificate/certificate/certificateTemplateTwoAudit/certificateTempMainTwoAudit.vue"),"url":"certificate/certificate/certificateTemplateTwoAudit/certificateTempMainTwoAudit","name":"/证书/记录/证书模板/模板二级审核"} ,
"701" :{"component": () => import("@/components/certificate/originalLog/originalLogMainTempMain/originalLogMainTempMain.vue"),"url":"certificate/originalLog/originalLogMainTempMain/originalLogMainTempMain","name":"/证书/记录/记录模板/记录主模板"} ,
"702" :{"component": () => import("@/components/certificate/originalLog/originalLogTempMain/originalLogTempMain.vue"),"url":"certificate/originalLog/originalLogTempMain/originalLogTempMain","name":"/证书/记录/记录模板/记录模板"} ,
"703" :{"component": () => import("@/components/certificate/originalLog/originalLogTemplateFirstAudit/originalLogTempMainFirstAudit.vue"),"url":"certificate/originalLog/originalLogTemplateFirstAudit/originalLogTempMainFirstAudit","name":"/证书/记录/记录模板/模板一级审核"} ,
"704" :{"component": () => import("@/components/certificate/originalLog/originalLogTemplateTwoAudit/originalLogTempMainTwoAudit.vue"),"url":"certificate/originalLog/originalLogTemplateTwoAudit/originalLogTempMainTwoAudit","name":"/证书/记录/记录模板/模板二级审核"} ,
"702": {"component": () => import("@/components/certificate/originalLog/originalLogTempMain/originalLogTempMain.vue"), "url": "certificate/originalLog/originalLogTempMain/originalLogTempMain", "name": "/证书/记录/记录模板/记录模板" },
"703": { "component": () => import("@/components/certificate/originalLog/originalLogTemplateFirstAudit/originalLogTempMainFirstAudit.vue"), "url": "certificate/originalLog/originalLogTemplateFirstAudit/originalLogTempMainFirstAudit", "name": "/证书/记录/记录模板/模板一级审核" },
"704": { "component": () => import("@/components/certificate/originalLog/originalLogTemplateTwoAudit/originalLogTempMainTwoAudit.vue"), "url": "certificate/originalLog/originalLogTemplateTwoAudit/originalLogTempMainTwoAudit", "name": "/证书/记录/记录模板/模板二级审核" },
"711": { "component": () => import("@/components/certificate/originalLog/originalLogAdd/originalLogAdd.vue"), "url": "certificate/originalLog/originalLogAdd/originalLogAdd.vue", "name": "/证书/记录/记录添加/记录添加" },
"721": { "component": () => import("@/components/certificate/originalLog/originalLogAuditJdy/originalLogAuditJdy.vue"), "url": "certificate/originalLog/originalLogAuditJdy/originalLogAuditJdy.vue", "name": "/证书/记录/记录审核/记录检定" },
"722": { "component": () => import("@/components/certificate/originalLog/originalLogAuditHyy/originalLogAuditHyy.vue"), "url": "certificate/originalLog/originalLogAuditHyy/originalLogAuditHyy.vue", "name": "/证书/记录/记录审核/记录核验" },
"726": { "component": () => import("@/components/certificate/originalLog/originalLogUploadCertificate/originalLogUploadCertificate.vue"), "url": "certificate/originalLog/originalLogUploadCertificate/originalLogUploadCertificate.vue", "name": "/证书/记录/记录审核/记录核验" },



  "275" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/证书打印"} ,
"274" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/证书PDF"} ,
"273" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/证书审核"} ,
"272" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/证书修改"} ,
"271" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/证书添加"} ,
"276" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/证书查询"} ,
"291" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/记录添加"} ,
"292" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/记录修改"} ,
"293" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/记录审核"} ,
"294" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/证书上传"} ,
"295" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/记录查询"} ,
"290" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/记录模板"} ,
"270" :{"component": () => import("@/components/log/LogTable.vue"),"url":"log/LogTable","name":"/证书/记录/证书模板"} ,
"506": { "component": () => import("@/components/certificate/certificate/certificatePdf/certificatePdfQueryList.vue"), "url": "certificate/certificate/certificatePdf/certificatePdfQueryList", "name": "/证书/记录/证书PDF/PDF生成" },
"69": { "component": () => import("@/components/quality/tecBas/TecBasList.vue"), "url": "quality/tecBas/TecBasList", "name": "/质量控制/技术依据/查询" },
}

var URLS_path=null;
function TrunUrl() {
  URLS_path={};
  for(let p in URLS){
    //console.log("URLS >> "+p,URLS[p]["component"]);
    URLS_path[URLS[p]['url']]=URLS[p]["component"];
  }
}



function GetRequest(url) {
   //var url = location.search; //获取url中"?"符后的字串
   var theRequest = {};
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}


export default {
  name: 'certApp',
  data(){
    return {
      url:"",
    };
  },
  components:{  mycontent  },
  // mounted(){
  // 	if(URLS_path==null){
  //     TrunUrl();
  //   }
  //   let urls=GetRequest(location.search);
  //   this.pp.push( URLS_path[urls["url"]] );
  // }
  render: function(h) {
  	///console.log(window,'11111111111111')
    if(URLS_path==null){
      TrunUrl();
    }
      //certificate.html
      //let urls=location.href;
      //解析 location.href;
      //取出 组件路径
      let urls=GetRequest(location.search);
      // let pp=[];//certificate/certificate/certificateAdd/certificateAdd.vue
      //pp.push(() => import('./components/'+urls["url"])) ;
      //console.log('loadUrl',urls)
      // pp.push( URLS_path[urls["url"]] );
      let pp = URLS_path[urls["url"]];
      return <div id="certApp" ><mycontent content={pp}  /></div>
  },

}




</script>
