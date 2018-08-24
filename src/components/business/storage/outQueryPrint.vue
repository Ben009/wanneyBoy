<template>
  <div>
    <div style="width:100%;text-align: center;">
      <el-button type="primary" @click="print">打印</el-button>
      <el-button type="primary" @click="backupPrint">备份打印</el-button>
      <el-button type="primary" @click="printReview">打印预览</el-button>
      <el-button type="primary" @click="setSignature">设置签名</el-button>
      <el-button @click="close">关闭</el-button>
    </div>
    <div style="width:1000px;margin:0 auto;margin-top:10px;" class="bigDiv">
      <table border="0" cellspacing="0" cellpadding="0" style="width: 1005px; border-collapse: collapse; border: medium none">
        <tbody>
        <tr>
          <td colspan="3" valign="middle" style="border:medium none black;    padding-top: 0cm; padding-bottom: 0cm">
            <p class="MsoNormal" style="text-align: center">
              <span style="font-size: 18.0pt; font-family: '华文新魏'">
                <b>综合版</b>
                <br>送货单(客户联)
              </span>
            </p>
          </td>
        </tr>
        <tr style="text-align: left;">
          <td colspan="2" width="70%">
            <span style="font-family: '宋体'; font-size: 11pt">客户名称：啊啊啊</span>　
          </td>
          <td width="30%">
            <span style="font-family: '宋体'; font-size: 11pt">联 系 人：</span>　
          </td>
        </tr>
        <tr style="text-align: left;">
          <td colspan="2">
            <span style="font-family: '宋体'; font-size: 11pt">地&nbsp;&nbsp;&nbsp;&nbsp;址：</span>　
          </td>
          <td>
            <span style="font-family: '宋体'; font-size: 11pt">电&nbsp;&nbsp;&nbsp;&nbsp;话：</span>　
          </td>
        </tr>
        <tr style="text-align: left;">
          <td style="text-align: right;" colspan="3">
            2180711001<img style="width:4.0cm;height:1.1cm;" align="center" src="/jlzj/upload/qrcode/2180711001.gif">
          </td>
        </tr>
        </tbody>
      </table>
      <table style="width:100%;" class="borderColor tableCenter">
        <thead class="borderBottomColor">
          <th class="borderRightColor">序号</th>
          <th class="borderRightColor">登记号</th>
          <th class="borderRightColor">送检日期</th>
          <th class="borderRightColor">仪器名称</th>
          <th class="borderRightColor">规格型号</th>
          <th class="borderRightColor">证书数量</th>
          <th class="borderRightColor">样品数量</th>
          <th class="borderRightColor">退套数</th>
          <th>备注</th>
        </thead>
        <tbody>
          <tr class="borderBottomColor textCenter"  v-for="(item,index) in list">
            <td class="borderRightColor">{{index+1}}</td>
            <td class="borderRightColor">{{item.registrationNo}}</td>
            <td class="borderRightColor">{{item.date}}</td>
            <td class="borderRightColor">{{item.applianceName}}</td>
            <td class="borderRightColor">{{item.model}}</td>
            <td class="borderRightColor">{{item.zsNo}}</td>
            <td class="borderRightColor">{{item.sampleNo}}</td>
            <td class="borderRightColor">{{item.returnNum}}</td>
            <td class="borderRightColor">{{item.remark}}</td>
          </tr>
        </tbody>
      </table>
      <table class="MsoNormalTable" cellspacing="0" cellpadding="0" align="center" style="border-collapse: collapse; border: medium none;table-layout:fixed;word-wrap:break-word;overflow:auto !important;" width="1005px">
        <tbody>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="10">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">出库合计：&nbsp;&nbsp;&nbsp;&nbsp;证书：1&nbsp;&nbsp;&nbsp;&nbsp;;&nbsp;&nbsp;&nbsp;&nbsp; 样品：0</span>
            </p>
          </td>
        </tr>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="10">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
            <span style="font-size:15px">供应商：&nbsp; 综合版</span>
            </p>
          </td>
        </tr>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="10">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">地址：&nbsp; 苏州市吴中区文曲路69号</span>
            </p>
          </td>
        </tr>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="10">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">电  话：&nbsp;0512-65120073/65154065    &nbsp;&nbsp;&nbsp;&nbsp;    传  真：&nbsp;0512-65223973</span>
            </p>
          </td>
        </tr>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="5">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">送货人:</span>
            </p>
          </td>
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="5">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">客户确认:</span>
            </p>
          </td>
        </tr>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="5">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
               <span style="font-size:15px">&nbsp;&nbsp;&nbsp;&nbsp;日期:</span>
            </p>
          </td>
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="5">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期:</span>
            </p>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div style="width:1000px;margin:0 auto;margin-top:10px;" class="bigDiv">
      <table border="0" cellspacing="0" cellpadding="0" style="width: 1005px; border-collapse: collapse; border: medium none">
        <tbody>
        <tr>
          <td colspan="3" valign="middle" style="border:medium none black;    padding-top: 0cm; padding-bottom: 0cm">
            <p class="MsoNormal" style="text-align: center">
              <span style="font-size: 18.0pt; font-family: '华文新魏'">
                <b>综合版</b>
                <br>送货单(存根联)
              </span>
            </p>
          </td>
        </tr>
        <tr style="text-align: left;">
          <td colspan="2" width="70%">
            <span style="font-family: '宋体'; font-size: 11pt">客户名称：啊啊啊</span>　
          </td>
          <td width="30%">
            <span style="font-family: '宋体'; font-size: 11pt">联 系 人：</span>　
          </td>
        </tr>
        <tr style="text-align: left;">
          <td colspan="2">
            <span style="font-family: '宋体'; font-size: 11pt">地&nbsp;&nbsp;&nbsp;&nbsp;址：</span>　
          </td>
          <td>
            <span style="font-family: '宋体'; font-size: 11pt">电&nbsp;&nbsp;&nbsp;&nbsp;话：</span>　
          </td>
        </tr>
        <tr style="text-align: left;">
          <td style="text-align: right;" colspan="3">
            2180711001<img style="width:4.0cm;height:1.1cm;" align="center" src="/jlzj/upload/qrcode/2180711001.gif">
          </td>
        </tr>
        </tbody>
      </table>
      <table style="width:100%;" class="borderColor tableCenter">
        <thead class="borderBottomColor">
        <th class="borderRightColor">序号</th>
        <th class="borderRightColor">登记号</th>
        <th class="borderRightColor">送检日期</th>
        <th class="borderRightColor">仪器名称</th>
        <th class="borderRightColor">规格型号</th>
        <th class="borderRightColor">证书数量</th>
        <th class="borderRightColor">样品数量</th>
        <th class="borderRightColor">退套数</th>
        <th>备注</th>
        </thead>
        <tbody>
        <tr class="borderBottomColor textCenter"  v-for="(item,index) in list">
          <td class="borderRightColor">{{index+1}}</td>
          <td class="borderRightColor">{{item.registrationNo}}</td>
          <td class="borderRightColor">{{item.date}}</td>
          <td class="borderRightColor">{{item.applianceName}}</td>
          <td class="borderRightColor">{{item.model}}</td>
          <td class="borderRightColor">{{item.zsNo}}</td>
          <td class="borderRightColor">{{item.sampleNo}}</td>
          <td class="borderRightColor">{{item.returnNum}}</td>
          <td class="borderRightColor">{{item.remark}}</td>
        </tr>
        </tbody>
      </table>
      <table class="MsoNormalTable" cellspacing="0" cellpadding="0" align="center" style="border-collapse: collapse; border: medium none;table-layout:fixed;word-wrap:break-word;overflow:auto !important;" width="1005px">
        <tbody>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="10">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">出库合计：&nbsp;&nbsp;&nbsp;&nbsp;证书：1&nbsp;&nbsp;&nbsp;&nbsp;;&nbsp;&nbsp;&nbsp;&nbsp; 样品：0</span>
            </p>
          </td>
        </tr>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="10">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">供应商：&nbsp; 综合版</span>
            </p>
          </td>
        </tr>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="10">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">地址：&nbsp; 苏州市吴中区文曲路69号</span>
            </p>
          </td>
        </tr>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="10">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">电  话：&nbsp;0512-65120073/65154065    &nbsp;&nbsp;&nbsp;&nbsp;    传  真：&nbsp;0512-65223973</span>
            </p>
          </td>
        </tr>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="5">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">送货人:</span>
            </p>
          </td>
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="5">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">客户确认:</span>
            </p>
          </td>
        </tr>
        <tr style="page-break-inside:avoid;">
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="5">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">&nbsp;&nbsp;&nbsp;&nbsp;日期:</span>
            </p>
          </td>
          <td style="  padding-middle: 0cm; padding-bottom: 0cm" colspan="5">
            <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
              <span style="font-size:15px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期:</span>
            </p>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.borderColor{
  border:1px solid #000;
}
 .borderRightColor{
   border-right:1px solid #000;
 }
.borderBottomColor{
  border-bottom:1px solid #000;
}
.textCenter{
  text-align: center;
}
</style>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";

    export default {
      name:"outQueryPrint",//出库单补打
        data() {
            return {
              list:[{"index":"1","registrationNo":"812002094","date":"2017-10-17","applianceName":"测试器具","model":"/","zsNo":"1","sampleNo":"0","returnNum":"0","remark":""}]}
        },
      methods:{
        print(){//打印

        },
        backupPrint(){//备份打印

        },
        printReview(){//打印预览

        },
        setSignature(){//设置签名

        },
        close(){//关闭

        }
      },
      mounted(){

      },
      created(){

      }
    }
</script>
