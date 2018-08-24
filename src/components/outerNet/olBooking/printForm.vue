<template>
    <div style="margin-bottom: 30px">
        <div align=center>
            <el-button type="primary" @click="printit">打印</el-button>
            <el-button type="primary" @click="printold">备份打印</el-button>
            <el-button type="primary" @click="printpreview">打印预览</el-button>
            <el-button  @click="cancel">返 回</el-button>
        </div>
        <div align=center>
            <!-- 头部 -->
            <table border="0" cellspacing="0" cellpadding="0" style="width: 1005px; border-collapse: collapse; border: medium none">
                <tr>
                    <td colspan="11" valign="middle" style="border:medium none black; padding-top: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center">
                            <span style="font-size: 18.0pt; font-family: '华文新魏'">
                                <b>{{defaultCompanyName}}</b>
                            </span>
                        </p>
                    </td>
                </tr>

                <tr>
                    <td width="20%">&nbsp;</td>
                    <td>
                        <p align="center">
                            <span style="font-size: 13.0pt; font-family: '宋体'">检校委托单（网络报检）</span>
                        </p>
                    </td>
                    <td width="20%" align="right">
                        <span style="font-size: 13.0pt; font-family: '宋体'">报检编号：{{olBookingTotal.id}}</span>
                    </td>
                </tr>
            </table>

            <table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" align="center" style="border-collapse: collapse; border: medium none;table-layout:fixed;word-wrap:break-word;overflow:auto !important;" width="1005px">
                <tr style="page-break-inside:avoid;height:23.0pt;">
                    <td style="width: 80px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">委托单位：</span>
                        </p>
                    </td>
                    <td style="width: 600px; border: 1.0pt solid windowtext; margin-left: 4pt; padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal">
                            <span class="fon">{{olBookingTotal.dwMc}}</span>
                        </p>
                    </td>
                    <td style=" width: 80px;border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span class="fon">联系人：</span>
                        </p>
                    </td>
                    <td style=" border: 1.0pt solid windowtext; padding-middle: 0cm; padding-bottom: 0cm" colspan="3">
                        <p class="MsoNormal" style="text-align: center; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span class="fon">{{olBookingTotal.lxr}}</span>
                        </p>
                    </td>
                </tr>

                <tr style="page-break-inside:avoid;height:23.0pt;">
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">证书单位：</span>
                        </p>
                    </td>
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal">
                            <span class="fon">{{olBookingTotal.zsdw}}</span>
                        </p>
                    </td>
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm;">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span class="fon">联系电话：</span>
                        </p>
                    </td>
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm;" colspan="3">
                        <p class="MsoNormal" style="text-align: center;  margin-middle: 0cm; margin-bottom: .0001pt">
                            <span class="fon">{{olBookingTotal.lxdh}}</span>
                        </p>
                    </td>
                </tr>

                <tr style="page-break-inside:avoid;height:23.0pt;">
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm;border-bottom:medium none">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">联系地址：</span>
                        </p>
                    </td>
                    <td style=" border: 1.0pt solid windowtext; margin-left: 4pt; padding-middle: 0cm; padding-bottom: 0cm;border-bottom:medium none">
                        <p class="MsoNormal">
                            <span class="fon">{{olBookingTotal.dz}}</span>
                        </p>
                    </td>
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm;">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span class="fon">委托日期：</span>
                        </p>
                    </td>
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm;" colspan="3">
                        <p class="MsoNormal" style="text-align: center;  margin-middle: 0cm; margin-bottom: .0001pt">
                            <span class="fon">{{olBookingTotal.localDate}}</span>
                        </p>
                    </td>
                </tr>

                <tr style="page-break-inside:avoid;height:23.0pt;">
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm;border-bottom:medium none">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">异常是<br>否修理：</span>
                        </p>
                    </td>
                    <td style=" border: 1.0pt solid windowtext; margin-left: 4pt; padding-middle: 0cm; padding-bottom: 0cm;border-bottom:medium none">
                        <p class="MsoNormal">
                            <span class="fon">{{olBookingTotal.ycxl}}</span>
                        </p>
                    </td>
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm;border-bottom:medium none">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">业务员：</span>
                        </p>
                    </td>
                    <td style=" border: 1.0pt solid windowtext; margin-left: 4pt; padding-middle: 0cm; padding-bottom: 0cm;border-bottom:medium none" colspan="3">
                        <p class="MsoNormal">
                            <span align="center" class="fon">
                                <div align="center">{{olBookingTotal.ywy}}</div>
                            </span>
                        </p>
                    </td>
                </tr>
            </table>

            <table class="MsoNormalTable" border="0" cellspacing="0" cellpadding="0" align="center" style="border-collapse: collapse; border: medium none;table-layout:auto;word-wrap:break-word;overflow:auto !important;" width="1005px">
                <!--表头-->
                <tr style="page-break-inside:avoid;height:23.0pt;">
                    <td style="width: 40px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">序号</span>
                        </p>
                    </td>
                    <td style="width: 150px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">器具名称</span>
                        </p>
                    </td>
                    <td style="width: 130px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">型号规格</span>
                        </p>
                    </td>
                    <td style="width: 122px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">设备编号</span>
                        </p>
                    </td>
                    <td style="width: 122px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">出厂编号</span>
                        </p>
                    </td>
                    <td style="width: 40px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">套数</span>
                        </p>
                    </td>
                    <td style="width: 40px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">件数</span>
                        </p>
                    </td>
                    <td style="width: 40px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">是否<br>加急</span>
                        </p>
                    </td>
                    <td style="width: 60px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">报告<br>形式</span>
                        </p>
                    </td>
                    <td style="width: 250px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">备注(若使用非220V电压，请明示)</span>
                        </p>
                    </td>
                </tr>
                <!--数据-->
                <template v-if="applianceList.length <= 10">
                    <tr v-for="(appliance,index) in applianceList" style="page-break-inside:avoid;height:23.0pt;">
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{index+1}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{appliance.qjmc}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{appliance.xhgg}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{appliance.sbbh}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{appliance.ccbh}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{appliance.ts}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{appliance.js}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">□</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">
                                    {{appliance.bgxs=='4'?'测试':(appliance.bgxs=='3'?'检测':(appliance.bgxs=='2'?'校准':(appliance.bgxs=='1'?'检定':'')))}}
                                </span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{appliance.fj | toStr}}  {{appliance.bz | toStr}}</span>
                            </p>
                        </td>
                    </tr>

                    <tr v-for="n in (10 - applianceList.length)" style="page-break-inside:avoid;height:23.0pt;">
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{n+applianceList.length}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon"></span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon"></span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon"></span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon"></span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon"></span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon"></span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">□</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon"></span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon"></span>
                            </p>
                        </td>
                    </tr>
                </template>

                <template v-else>
                    <tr v-for="n in 10" style="page-break-inside:avoid;height:23.0pt;">
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{n}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{applianceList[n-1].qjmc}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{applianceList[n-1].xhgg}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{applianceList[n-1].sbbh}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{applianceList[n-1].ccbh}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{applianceList[n-1].ts}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{applianceList[n-1].js}}</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">□</span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">
                                    {{applianceList[n-1].bgxs=='4'?'测试':(applianceList[n-1].bgxs=='3'?'检测':(applianceList[n-1].bgxs=='2'?'校准':(applianceList[n-1].bgxs=='1'?'检定':'')))}}
                                </span>
                            </p>
                        </td>
                        <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                            <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                <span align="center" class="fon">{{applianceList[n-1].fj | toStr}}  {{applianceList[n-1].bz | toStr}}</span>
                            </p>
                        </td>
                    </tr>
                </template>

                <!--表尾-->
                <tr style="page-break-inside:avoid;height:23.0pt;">
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm" colspan="11">
                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span align="center" class="fon">
                                若报告形式为校准或检测时，是否出具结论：{{olBookingTotal.jdjl}}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                若报告形式为校准或检测时，是否出具复检/校日期：{{olBookingTotal.fjrq}}
                            </span>
                        </p>
                    </td>
                </tr>

                <tr style="page-break-inside:avoid;height:23.0pt;">
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm" colspan="11">
                        <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span class="fon">
                                委托人确认无误后，签字：
                            </span>
                        </p>
                    </td>
                </tr>

                <tr style="page-break-inside:avoid;height:23.0pt;">
                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm" colspan="11">
                        <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                            <span style="font-size:11pt">
                            本{{defaultLevel}}收发复核员只对送检仪器的外观进行核查，缺陷在备注栏中说明，仪器性能由实验室待查！本{{defaultLevel}}复核员签字:
                            </span>
                        </p>
                    </td>
                </tr>
            </table>

            <!--底部-->
            <table border="0" cellspacing="0" cellpadding="0" style="width: 1005px; border-collapse: collapse; ">
                <tr>
                    <td width="10%" align="left"><b>重要提示：</b></td>
                    <td width="54%" align="left"><b>1、工作电压为110V的电源请向受理人员说明。</b></td>
                    <td rowspan="2" align="left">客户提货验收无误请确认签字：_________________</td>
                </tr>
                <tr>
                    <td></td>
                    <td align="left"><b>2、此单为取证凭证，请妥善保管，提取器具时请当面验收、签字确认。</b></td>
                </tr>
            </table>

            <table border="0" cellspacing="0" cellpadding="0" style="width: 1005px;font-size:12px; border-collapse: collapse; ">
                <tr>
                    <td align="left">检测单位：{{defaultCompanyName}}</td>
                    <td align="left">地址：{{defaultAddress}}</td>
                    <td align="left">查询电话：{{defaultSearchphone}}</td>
                    <td align="right">业务拓展部电话：{{defaultMarketphone}}</td>
                    <td rowspan="3" align="right">网址：{{defaultOfficialwebsite}}</td>
                </tr>
                <tr>
                    <td align="left">银行帐号：{{defaultBankAccount}}</td>
                    <td align="left">邮编：{{defaultZipcode}}</td>
                    <td align="left">收发电话：{{defaultSendReceivephone}}</td>
                    <td align="right">{{defaultMarketphoneSecond}}</td>
                </tr>
                <tr>
                    <td align="left">开户银行：{{defaultBank}}</td>
                    <td align="left">&nbsp;</td>
                    <td align="left">投诉电话：{{defaultComplaintphone}}</td>
                    <td align="right">业务拓展部传真：{{defaultMarketFax}}</td>
                </tr>
            </table>

            <template v-if="applianceList.length > 10">
                <template v-for="n in Math.ceil((applianceList.length-10)/18)">

                    <br style="PAGE-BREAK-BEFORE: always" clear=all>
                    <table border="0" cellspacing="0" cellpadding="0" style="width: 1005px; border-collapse: collapse; border: medium none">
                        <tr>
                            <td colspan="11" valign="middle" style="border:medium none black; padding-top: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center">
                                        <span style="font-size: 18.0pt; font-family: '华文新魏'">
                                            <b>{{defaultCompanyName}}</b>
                                        </span>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td width="20%">&nbsp;</td>
                            <td>
                                <p align="center">
                                        <span style="font-size: 13.0pt; font-family: '宋体'">
                                            器具检定/校准/检测委托单续页
                                        </span>
                                </p>
                            </td>
                            <td width="20%" align="right">
                                <span style="font-size: 13.0pt; font-family: '宋体'">报检编号：{{olBookingTotal.id}}</span>
                            </td>
                        </tr>
                    </table>
                    <table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" align="center" style="border-collapse: collapse; border: medium none;table-layout:auto;word-wrap:break-word;overflow:auto !important;" width="1005px">
                        <tr style="page-break-inside:avoid;height:23.0pt;">
                            <td style="width: 40px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span align="center" class="fon">序号</span>
                                </p>
                            </td>
                            <td style="width: 150px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span align="center" class="fon">器具名称</span>
                                </p>
                            </td>
                            <td style="width: 130px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span align="center" class="fon">型号规格</span>
                                </p>
                            </td>
                            <td style="width: 122px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span align="center" class="fon">设备编号</span>
                                </p>
                            </td>
                            <td style="width: 122px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span align="center" class="fon">出厂编号</span>
                                </p>
                            </td>
                            <td style="width: 40px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span align="center" class="fon">套数</span>
                                </p>
                            </td>
                            <td style="width: 40px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span align="center" class="fon">件数</span>
                                </p>
                            </td>
                            <td style="width: 40px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span align="center" class="fon">是否<br>加急</span>
                                </p>
                            </td>
                            <td style="width: 60px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span align="center" class="fon">报告<br>形式</span>
                                </p>
                            </td>
                            <td style="width: 250px; border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span align="center" class="fon">备注(若使用非220V电压，请明示)</span>
                                </p>
                            </td>
                        </tr>

                        <template v-if="n < Math.ceil((applianceList.length-10)/18)">
                            <template v-for="i in 18">
                                <tr style="page-break-inside:avoid;height:23.0pt;">
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{10+i+(n-1)*18}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{n}}-{{i}}{{applianceList[10+i+(n-1)*18-1].qjmc}}</span>
                                        </p>
                                    </td>
                                    <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].xhgg}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].sbbh}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].ccbh}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].ts}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].js}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">□</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].bgxs=='4'?'测试':(applianceList[10+i+(n-1)*18-1].bgxs=='3'?'检测':(applianceList[10+i+(n-1)*18-1].bgxs=='2'?'校准':(applianceList[10+i+(n-1)*18-1].bgxs=='1'?'检定':'')))}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18].fj | toStr}}  {{applianceList[10+i+(n-1)*18].bz | toStr}}</span>
                                        </p>
                                    </td>
                                </tr>
                            </template>
                        </template>

                        <template v-if="n == Math.ceil((applianceList.length-10)/18)">
                            <template v-for="i in (applianceList.length-10-(n-1)*18)">
                                <tr style="page-break-inside:avoid;height:23.0pt;">
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{10+i+(n-1)*18}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].qjmc}}</span>
                                        </p>
                                    </td>
                                    <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].xhgg}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].sbbh}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].ccbh}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].ts}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].js}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">□</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].bgxs=='4'?'测试':(applianceList[10+i+(n-1)*18-1].bgxs=='3'?'检测':(applianceList[10+i+(n-1)*18-1].bgxs=='2'?'校准':(applianceList[10+i+(n-1)*18-1].bgxs=='1'?'检定':'')))}}</span>
                                        </p>
                                    </td>
                                    <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                        <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                            <span align="center" class="fon">{{applianceList[10+i+(n-1)*18-1].fj | toStr}}  {{applianceList[10+i+(n-1)*18-1].bz | toStr}}</span>
                                        </p>
                                    </td>
                                </tr>
                            </template>

                            <template v-for="i in 18 - (applianceList.length-10-(n-1)*18)">
                                <tr style="page-break-inside:avoid;height:23.0pt;">
                                <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                    <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                        <span align="center" class="fon">{{(10+i+(n-1)*18)+(applianceList.length-10-(n-1)*18)}}</span>
                                    </p>
                                </td>
                                <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                    <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                        <span align="center" class="fon"></span>
                                    </p>
                                </td>
                                <td style="border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                    <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                        <span align="center" class="fon"></span>
                                    </p>
                                </td>
                                <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                    <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                        <span align="center" class="fon"></span>
                                    </p>
                                </td>
                                <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                    <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                        <span align="center" class="fon"></span>
                                    </p>
                                </td>
                                <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                    <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                        <span align="center" class="fon"></span>
                                    </p>
                                </td>
                                <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                    <span align="center" class="fon"></span>
                                </td>
                                <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                    <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                        <span align="center" class="fon">□</span>
                                    </p>
                                </td>
                                <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                    <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                        <span align="center" class="fon"></span>
                                    </p>
                                </td>
                                <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm">
                                    <p class="MsoNormal" style="text-align: center;margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                        <span align="center" class="fon"></span>
                                    </p>
                                </td>
                            </tr>
                            </template>
                        </template>

                        <tr style="page-break-inside:avoid;height:23.0pt;">
                            <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm" colspan="11">
                                <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span class="fon">委托人确认无误后，签字：</span>
                                </p>
                            </td>
                        </tr>

                        <tr style="page-break-inside:avoid;height:23.0pt;">
                            <td style=" border: 1.0pt solid windowtext;  padding-middle: 0cm; padding-bottom: 0cm" colspan="11">
                                <p class="MsoNormal" style="margin-left: 4pt; margin-middle: 0cm; margin-bottom: .0001pt">
                                    <span style="font-size:11pt">
                                        本{{defaultLevel}}收发复核员只对送检仪器的外观进行核查，缺陷在备注栏中说明，仪器性能由实验室待查！本{{defaultLevel}}复核员签字:
                                    </span>
                                </p>
                            </td>
                        </tr>
                    </table>

                </template>
            </template>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
    import $ from 'jquery';

    const defaults = {
        hoho: ''
    };
    export default {
        name: "print-Form",
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                form: $.extend({}, defaults, this.data || {}),
                olBookingTotal: {},
                applianceList: [],

                defaultCompanyName:"",         //系统默认单位名称
                defaultAddress:"",             //系统默认单位地址

                defaultLevel:"",               //系统默认单位等级
                defaultZipcode:"",             //系统默认单位邮编
                defaultSearchphone:"",         //系统默认单位查询电话
                defaultMarketphone:"",         //系统默认单位业务拓展部电话
                defaultMarketphoneSecond:"",   //系统默认单位业务拓展部电话2
                defaultMarketFax:"",           //系统默认单位业务拓展部传真
                defaultSendReceivephone:"",    //系统默认单位收发电话
                defaultComplaintphone:"",      //系统默认单位投诉电话
                defaultOfficialwebsite:"",     //系统默认单位网址
                defaultBank:"",                //系统默认单位开户银行
                defaultBankAccount:"",          //系统默认单位银行账号
            }
        },
        mounted() {
            this.remoteMethod();
        },
        filters: {
            toStr : function (value) {
                if(value == "" || value == null || value == undefined){
                    return "";
                }else{
                    return value
                }
            }
        },
        methods: {
            formatterDate: function () {
                if(this.applianceList[0].bgxs == null) {
                    this.applianceList[0].bgxs = "";
                }

                if(this.olBookingTotal.ycxl == null) {
                    this.olBookingTotal.ycxl = "0";
                }
                if(this.olBookingTotal.ycxl == "2"){
                    this.olBookingTotal.ycxl = "不修理 ■ 修理前电话联系 □ 全权委托修理 □";
                }else if(this.olBookingTotal.ycxl == "1") {
                    this.olBookingTotal.ycxl = "不修理 □ 修理前电话联系 ■ 全权委托修理 □";
                }else{
                    this.olBookingTotal.ycxl = "不修理 □ 修理前电话联系 □ 全权委托修理 ■";
                }

                if(this.olBookingTotal.fjrq == null) {
                    this.olBookingTotal.fjrq = "";
                }
                if(this.olBookingTotal.fjrq == "1"){
                    this.olBookingTotal.fjrq = "是 ■ 否 □";
                }else{
                    this.olBookingTotal.fjrq = "是 □ 否 ■";
                }


                if(this.olBookingTotal.jdjl == null){
                    this.olBookingTotal.jdjl = "";
                }
                if(this.olBookingTotal.jdjl == "1"){
                    this.olBookingTotal.jdjl = "是 ■ 否 □";
                }else{
                    this.olBookingTotal.jdjl = "是 □ 否 ■";
                }
            },

            cancel: function () {
                window.history.go(-1);
            },

            printit: function () {
                console.log("printit");
            },

            printold: function () {
                console.log("printold");
            },

            printpreview: function () {
                console.log("printpreview");
            },

            getOlBookingInfo:function () {
                var _this = this;
                ajaxRequest('get', 'back/olBooking/findById', {
                    id: _this.$route.query.id,
                }, (res) => {
                    if (res.code == 200) {
                        _this.olBookingTotal = res.t || {};
                        _this.applianceList = _this.olBookingTotal.applianceList || [];
                        _this.formatterDate();
                    } else {
                        _this.$message.error(res.msg);
                    }
                });
            },

            getDefaultCompanyName:function () {
                let _this = this
                //系统默认单位名称
                ajaxProxyRequest('get', "/njmind/findParam/defaultCompanyName", null, (res) => {
                    _this.defaultCompanyName = res.value;
                });
            },

            getDefaultAddress:function () {
                let _this = this
                //系统默认单位地址
                ajaxProxyRequest('get', "/njmind/findParam/defaultAddress", null, (res) => {
                    _this.defaultAddress = res.value;
                });
            },

            getDefaultLevel:function () {
                let _this = this
                //系统默认单位邮编
                ajaxProxyRequest('get', "/njmind/findParam/defaultLevel", null, (res) => {
                    _this.defaultLevel = res.value;
                });
            },

            getDefaultZipcode:function () {
                let _this = this
                //系统默认单位邮编
                ajaxProxyRequest('get', "/njmind/findParam/defaultZipcode", null, (res) => {
                    _this.defaultZipcode = res.value;
                });
            },

            getDefaultSearchphone:function () {
                let _this = this
                //系统默认单位查询电话
                ajaxProxyRequest('get', "/njmind/findParam/defaultSearchphone", null, (res) => {
                    _this.defaultSearchphone = res.value;
                });
            },

            getDefaultMarketphone:function () {
                let _this = this
                //系统默认单位业务拓展部电话
                ajaxProxyRequest('get', "/njmind/findParam/defaultMarketphone", null, (res) => {
                    _this.defaultMarketphone = res.value;
                });
            },

            getDefaultMarketphoneSecond:function () {
                let _this = this
                //系统默认单位业务拓展部电话2
                ajaxProxyRequest('get', "/njmind/findParam/defaultMarketphoneSecond", null, (res) => {
                    _this.defaultMarketphoneSecond = res.value;
                });
            },

            getDefaultMarketFax:function () {
                let _this = this
                //系统默认单位业务拓展部传真
                ajaxProxyRequest('get', "/njmind/findParam/defaultMarketFax", null, (res) => {
                    _this.defaultMarketFax = res.value;
                });
            },

            getDefaultSendReceivephone:function () {
                let _this = this
                //系统默认单位收发电话
                ajaxProxyRequest('get', "/njmind/findParam/defaultSendReceivephone", null, (res) => {
                    _this.defaultSendReceivephone = res.value;
                });
            },

            getDefaultComplaintphone:function () {
                let _this = this
                //系统默认单位投诉电话
                ajaxProxyRequest('get', "/njmind/findParam/defaultComplaintphone", null, (res) => {
                    _this.defaultComplaintphone = res.value;
                });
            },

            getDefaultOfficialwebsite:function () {
                let _this = this
                //系统默认单位网址
                ajaxProxyRequest('get', "/njmind/findParam/defaultOfficialwebsite", null, (res) => {
                    _this.defaultOfficialwebsite = res.value;
                });
            },


            getDefaultBank:function () {
                let _this = this
                //系统默认单位开户银行
                ajaxProxyRequest('get', "/njmind/findParam/defaultBank", null, (res) => {
                    _this.defaultBank = res.value;
                });
            },

            getDefaultBankAccount:function () {
                let _this = this
                //系统默认单位银行账号
                ajaxProxyRequest('get', "/njmind/findParam/defaultBankAccount", null, (res) => {
                    _this.defaultBankAccount = res.value;
                });
            },

            remoteMethod() {
                this.getOlBookingInfo();
                this.getDefaultCompanyName();
                this.getDefaultAddress();
                this.getDefaultLevel();
                this.getDefaultZipcode();
                this.getDefaultSearchphone();
                this.getDefaultMarketphone();
                this.getDefaultMarketphoneSecond();
                this.getDefaultMarketFax();
                this.getDefaultSendReceivephone();
                this.getDefaultComplaintphone();
                this.getDefaultOfficialwebsite();
                this.getDefaultBank();
                this.getDefaultBankAccount();
            }
        },
    }
</script>


<style media="print">
    .Noprint {
        display: none;
    }

    .PageNext {
        page-break-after: always;
    }
</style>
<style media="print">
    .Noprint {
        display: none;
    }

    .PageNext {
        page-break-after: always;
    }
</style>
<style>
    table.MsoNormalTable {
        mso-style-parent: "";
        font-size: 10.5pt;
        font-family: "Calibri", "sans-serif";
    }

    p.MsoNormal {
        mso-style-parent: "";
        margin-bottom: .0001pt;
        text-align: justify;
        text-justify: inter-ideograph;
        font-size: 10.5pt;
        font-family: "Calibri", "sans-serif";
        margin-left: 0cm;
        margin-right: 0cm;
        margin-top: 0cm
    }

    .fon {
        font-size: 11.0pt;
        font-family: '宋体'
    }
</style>

