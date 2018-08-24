<template>
    <div id="main">

        <div style="margin-bottom: 10px" v-if="(form.source == 0) && submitHidden">
            <el-button type="primary" @click="contractForInspection">合同送检要号</el-button>
            <el-button type="primary" @click="historySjdInspection">历史数据要号</el-button>
            <!-- <el-button type="primary" @click="">单位台帐</el-button> -->
            <!-- <el-button type="primary" @click="">器具导入</el-button> -->
        </div>

        <ContractForInspection
                v-if="showContractForInspection"
                ref="contractForInspectionInfo"
                :companyName="this.form.companyName"
                :alreadyAddId="alreadyAddId"
                :callback="handleContractForInspectionCallback"></ContractForInspection>

        <historySjdInspection
                v-if="showHistorySjdInspection"
                ref="historySjdInspectionInfo"
                :companyName="this.form.companyName"
                :alreadyAddId="alreadyAddId"
                :callback="handleHistorySjdInspectionCallback"></historySjdInspection>

        <preQuotedPrice
                v-if="showPreQuotedPrice"
                ref="preQuotedPrice"
                :wtdId="this.form.wtdId"
                :callback="handlePreQuotedPriceCallback"></preQuotedPrice>

        <companyForm
                v-if="showCompanyForm"
                ref="companyForm"
                :callback="handleHistorySjdInspectionCallback"></companyForm>

        <entrustWtdDraftBox
                v-if="showEntrustWtdDraftBox"
                ref="entrustWtdDraftBoxInfo"
                :callback="handleEntrustWtdDraftBoxCallback"></entrustWtdDraftBox>

        <!-- TODO 案例 form 组件 验证 label统一宽度 等 ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <div style="background:#f5f5f5; padding-top:10px;">
                <div>
                    <el-Row>
                        <el-col :span="6" class="entrust-small">
                            <el-form-item prop="orderNo">
                                <template slot="label">
                                    <span>委托单编号</span>
                                    <el-tooltip class="item" effect="dark" content="委托单编号可由系统自动生成（7位），或可输入纸质委托单上的委托单号">
                                        <i class="el-icon-info ft12"></i>
                                    </el-tooltip>
                                </template>
                                <!--单行文本 v-model 绑定数据  -->
                                <el-input v-model="form.orderNo"
                                          :disabled="form.isAutoWtdh || !(form.source == 0)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="entrust-small" style="line-height: 49px">
                            &nbsp;
                            <el-checkbox v-model="form.isAutoWtdh" v-show="submitHidden && (form.source == 0)"
                                         @change="changeOrderNo">自动配置
                            </el-checkbox>
                            &nbsp;
                            <el-button type="primary" @click="getOrderNo" v-show="submitHidden && (form.source == 0)"
                                       size="mini" class="but-yywtd">预要委托单号
                            </el-button>
                            <el-button type="success" size="mini" class="but-tmdy" @click="printOrderTxm">委托单条码打印
                            </el-button>
                            <!-- &nbsp;&nbsp;&nbsp; -->
                            <el-checkbox v-model="form.isChangeDetectionMethod"
                                         v-if="(form.source == 2 || form.source == 3)" @change="changeDetectionMethod">
                                <span>{{changeDetectionMethodName}}</span>
                                <el-tooltip class="item" effect="dark"
                                            content="原现场检测器具带回机构检测；（实际按送检受理；登记号按送检的登记号、是否现场：否）">
                                    <i class="el-icon-info ft12"></i>
                                </el-tooltip>
                            </el-checkbox>
                        </el-col>
                        <el-col :span="6" class="entrust-small">
                            <el-form-item prop="detectionMethod">
                                <!--单选 -->
                                <el-radio-group v-model="form.detectionMethod" @change="changeDetectionMethodRadio">
                                    <el-radio :label="'1'">送检</el-radio>
                                    <el-radio :label="'0'">现场</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="entrust-small">
                            <el-form-item v-show="form.detectionMethod === '0'" prop="executor">
                                <template slot="label">
                                    <span>执行人</span>
                                    <el-tooltip class="item" effect="dark" content="现场检测需输入现场检测人员">
                                        <i class="el-icon-info ft12"></i>
                                    </el-tooltip>
                                </template>
                                <span v-if="!!form.executor && form.executor.indexOf(',') != -1">{{form.executor}}</span>
                                <el-autocomplete v-else style="width: 100%"
                                                 v-model="form.executor"
                                                 :fetch-suggestions="querySearchPerson"
                                                 @select="handleExecutorSelect"
                                                 placeholder="请输入执行人"
                                                 :trigger-on-focus="flag"
                                                 onKeypress="return (/[^,]/.test(String.fromCharCode(event.keyCode)))"
                                ></el-autocomplete>
                            </el-form-item>
                        </el-col>
                    </el-Row>
                </div>
            </div>

            <div class="title-item" style="margin-top:10px;"><span>客户信息</span>&nbsp;&nbsp;&nbsp;(受理人：{{userName}})
                <div class="el-icon-info  shuoming">
                    <el-row class="el-sm">
                        <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">
                            事项说明</p>
                        <dl style="padding:6px 10px; ">
                            <p>1、 若有权限，可在本页面添加新的委托单位信息；</p>
                            <p>2、 委托单位：（单位类别），红色：未审核，[客户对接部门]；</p>
                            <p>3、 若有权限，可在本页面添加新的计量器具信息；</p>
                            <p>4、 当器具实际名称、型号规格有值时，重新输入器具名称系统将不重新带入；</p>
                            <p>5、 若该登记号无需出具证书报告，可点击证书数量后方无需出证按钮；</p>
                            <p>6、 系统依据器具岗位自动按工作量计算检测期限，若计算有误，通常为节假日未维护；</p>
                            <p>7、 器具名称：Y为资质项目，J：价格，B：检测部门，F：服务类型，X：型号规格，C：测量范围；</p>
                            <p>8、 当通过EXCEL导入时，系统依据器具名称与计量器具库中器具名称、别名进行匹配，若匹配中系统自动带入相应信息，匹配不中时需手动输入器具名称；</p>
                            <p>9、 若计量器具库信息维护完善，录入器具名称后，系统自动带入器具实际名称、检测部门、检测岗位、型号规格、检测参数、是否强检、器具用途等信息。</p>
                        </dl>
                    </el-row>
                </div>
            </div>
            <div v-show="specialDwRemark" style="margin-left:10px;margin-bottom: 10px;color:red;font-size:14px">
                <p>
                    <!--上门特殊要求：-->
                    {{visitSpecialRequirement}}
                </p>
                <p>
                    <!--其他特殊要求：-->
                    {{otherSpecialRequirement}}
                </p>
                <p>
                    {{contractRequireNo}}
                </p>

            </div>
            <el-row style="margin-top:10px;">
                <el-col :span="submitHidden&&hasAddCompanyPower&&(form.source == 0)?16:18">
                    <el-form-item prop="companyName">
                        <template slot="label">
                            <el-checkbox v-has="'M16704'" v-model="form.isSaveCompanyInfo">委托单位</el-checkbox>
                            <el-tooltip v-notHas="'M16704'" class="item" effect="dark" content="仅可调用委托单位库中的记录，不支持直接输入">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                            <el-tooltip v-has="'M16704'" class="item" effect="dark"
                                        content="仅可调用委托单位库中的记录，不支持直接输入；本次单位信息与委托单位库不一致且有权限，可勾选前方复选框同步保存至委托单位库中；若不勾中，单位信息仅对本次委托生效；">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>

                        <el-autocomplete style="width: 100%"
                                         v-model="form.companyName"
                                         :fetch-suggestions="querySearchEntrust"
                                         placeholder="请输入委托单位"
                                         @select="handleSelect"
                                         :trigger-on-focus="flag"
                                         :disabled="!(form.source == 0)"
                                         ref="companyName"
                                         v-focus-next-on-enter="{value:'address',index:1}">
                            <template slot-scope='scope'>
                                <div>
                  <span style="margin-left:0" :style="{color:scope.item.status == 0 ? 'red' : 'green'}">({{scope.item.companyType}}) {{scope.item.companyName}}
                      <!--  ({{scope.item.status == 0 ? '未审核' : '已审核'}}) -->
                     {{!!scope.item.companyDepart ? '['+scope.item.companyDepart+']' : ''}}
                     {{!!scope.item.contacter ? '['+scope.item.contacter+']' : ''}}
                     {{!!scope.item.mobilePhone ? '['+scope.item.mobilePhone+']' : ''}}
                  </span>
                                </div>
                            </template>
                        </el-autocomplete>
                    </el-form-item>

                </el-col>

                <!-- <span :span="hasAddCompanyPower&&(form.source == 0)?2:0" style="position:absolute; top:5px; margin-left:-10px;">
                   <el-button type="primary" @click="addCompany" size="mini" class="but-yywtd" style="border:none!important;">添加单位</el-button>
                </span> -->
                <el-col :span="submitHidden&&hasAddCompanyPower&&(form.source == 0)?2:0"
                        style="text-align: center;padding:6px;">
                    <el-button type="primary" @click="addCompany" size="mini" class="but-tjdw">添加单位</el-button>
                </el-col>

                <el-col :span="5" class="entrust-small">
                    <el-form-item prop="contractNo">
                        <template slot="label">
                            <span>合同号</span>
                            <el-tooltip class="item" effect="dark"
                                        content="若该客户有有效的合同信息，系统自动合同号，费用录入时系统将自动打折；若本笔页面无需打折，可清空合同号">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="form.contractNo" disabled></el-input>
                    </el-form-item>
                </el-col>

                <!-- <span :span="2" style="position:absolute; top:5px; margin-left:-10px;">
                  <el-button type="primary" @click="clearHtbh" size="mini"  class="but-qk" style="border:none;">清空</el-button>
                </span> -->
                <el-col :span="1" style="width:4.16667%;text-align: center;padding:6px;">
                    <el-button type="primary" v-if="submitHidden" @click="clearHtbh" size="mini" class="but-qk">清空
                    </el-button>
                </el-col>

            </el-row>

            <el-row>
                <el-col :span="18" class="entrust-small">
                    <el-form-item label="单位地址" prop="address">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.address" ref="address"
                                  v-focus-next-on-enter="{value:'contacter',index:1}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="entrust-small">
                    <el-form-item label="统一社会信用代码" prop="creditCode">
                        <!--单行文本 v-model 绑定数据   -->
                        <el-input v-model="form.creditCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="18" class="entrust-small">
                    <el-form-item label="证书单位名称" prop="certificateCompanyName">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.certificateCompanyName" placeholder="不录入默认委托单位名称"></el-input>
                    </el-form-item>
                </el-col>


                <el-col :span="6" class="entrust-small">
                    <el-form-item label="邮编" prop="postCode">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.postCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="18" class="entrust-small">
                    <el-form-item label="证书单位地址" prop="certificateCompanyAddress">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.certificateCompanyAddress" placeholder="不录入默认委托单位地址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="entrust-small">
                    <el-form-item label="机构性质" prop="institutionalNature">
                        <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
                        <el-select
                                placeholder="请选择"
                                value-key="name"
                                v-model="form.institutionalNature" style="width:100%;">
                            <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
                            <el-option
                                    v-for="item in institutionalNatures"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="6" class="entrust-small">
                    <el-form-item label="联系人" prop="contacter">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.contacter" ref="contacter"
                                  v-focus-next-on-enter="{value:'telephone',index:1}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="entrust-small">
                    <el-form-item label="联系电话" prop="telephone">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.telephone" ref="telephone"
                                  v-focus-next-on-enter="{value:'specialRequirement',index:1}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="entrust-small">
                    <el-form-item label="邮箱" prop="email">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="entrust-small">
                    <el-form-item label="省/市/区" prop="administrativeArea">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.administrativeArea" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="6" class="entrust-small">
                    <el-form-item prop="entrustDate">
                        <template slot="label">
                            <span>客户委托日期</span>
                            <el-tooltip class="item" effect="dark"
                                        content="当检测方式为送检时，为客户送样日期，若为现场时，该日期为客户与本单位联系需现场检测的日期">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-date-picker
                                v-model="form.entrustDate"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="6" style="width:25%;" v-if="form.source != 1" class="entrust-small">
                    <el-form-item prop="certificatePrintTime">
                        <template slot="label">
                            <span>证书日期</span>
                            <el-tooltip class="item" effect="dark" content="客户要求出具证书的校检日期">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-date-picker
                                v-model="form.certificatePrintTime"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="6" class="entrust-small">
                    <el-form-item prop="isConclusion">
                        <template slot="label">
                            <span>是否出具结论</span>
                            <el-tooltip class="item" effect="dark" content="若服务类型为检测或校准时，是否出具结论">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-radio-group style="display:inline-block; line-height:1;" v-model="form.isConclusion">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="6" class="entrust-small">
                    <el-form-item prop="isRecheck">
                        <template slot="label">
                            <span>是否复校</span>
                            <el-tooltip class="item" effect="dark" content="若服务类型为检测或校准时，是否出具复校日期">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-radio-group style="display:inline-block; line-height:1;" v-model="form.isRecheck">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" class="entrust-small">
                    <el-form-item prop="mobilePhone">
                        <template slot="label">
                            <span>短信号码</span>
                            <el-tooltip class="item" effect="dark" content="用于通过短信通知客户检测进展">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="form.mobilePhone" placeholder="输入短信号码用于发送短消息"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="18" class="entrust-small">
                    <el-form-item label="整单备注" prop="specialRequirement">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.specialRequirement" ref="specialRequirement"
                                  v-focus-next-on-enter="{value:'applianceName',index:2}"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="6" class="entrust-small">
                    <el-form-item v-show="form.detectionMethod === '0'" prop="serviceDate">
                        <template slot="label">
                            <span>业务受理日期</span>
                            <el-tooltip class="item" effect="dark" content="现场检测后的配号时间；通常为现场检测时间加一天核算">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-date-picker
                                v-model="form.serviceDate"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <!-- <el-col :span="6" style="text-align: center">
                  <el-checkbox v-model="form.isMessage">若需系统发送短消息，请勾选</el-checkbox>
                </el-col> -->
                <el-col :span="6" class="entrust-small">
                    <el-form-item label="是否免费检测" prop="freeCheck">
                        <el-radio-group style="display:inline-block; line-height:1;" v-model="form.freeCheck">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>


                <el-col :span="6" class="entrust-small">
                    <el-form-item prop="taskSource">
                        <template slot="label">
                            <span>任务来源</span>
                            <el-tooltip class="item" effect="dark" content="按任务组与业务员组合">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="form.taskSource"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="entrust-small">
                    <el-form-item prop="attachment">
                        <template slot="label">
                            <span>附件</span>
                            <el-tooltip class="item" effect="dark" content="仅可上传一个附件">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <!--  -->
                        <mind-upload ref="upFiles" :limitNumb="limitNumb" :disabled="!submitHidden"
                                     :callBack="fileUploadCallBack" class="but-djsc"></mind-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 添加委托单位 -->
        <addCompanyCommon v-if="showCompanyForm" :callback="setCompanyInfo"></addCompanyCommon>
        <show-more-list v-if="visable" :data="companyMany" :callback="handleCallBack"></show-more-list>
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button>取 消</el-button>-->
        <!--&lt;!&ndash; 绑定form提交事件&ndash;&gt;-->
        <!--<el-button type="primary" @click="handleSubmit">确 定</el-button>-->
        <!--</span>-->
        <!-- 添加计量器具 -->

        <div class="title-item"><span>器具信息</span>
        </div>
        <InstrumentInfo ref="instrumentinfo"
                        v-if="!isRefresh"
                        :callback="handleApplianceEditCallback"
                        :columnsInfo="columnsInfo"
                        :batchInfo="batchInfo"
                        :header="header"
                        :defaultList="defaultList"
                        :tableData="tableData"
                        :wtdInfo="wtdInfo"
                        :instrumentAddCopyShow="instrumentAddCopyShow"
                        :instrumentDelShow="instrumentDelShow"
                        @focusCompanyName="focusCompanyName"
                        :moduleFlag="2"
        ></InstrumentInfo>
        <br/>

        <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
      <el-button type="primary" v-show="submitHidden" @click="handleSubmit">提 交</el-button>
      <el-button type="primary" v-show="submitHidden && this.form.source == 0" @click="addDraftBox">添加草稿箱</el-button>
      <el-button type="warning" v-show="submitHidden && this.form.source == 0" @click="queryDraftBox">查看草稿箱</el-button>
       <el-button type="danger" v-show="this.form.source == 2 || this.form.source == 3"
                  @click="backToXcDh">返 回</el-button>

      <el-button type="success" v-show="!submitHidden" @click="printOrderList">打印委托单</el-button>
      <el-button type="success" v-show="!submitHidden" @click="printOrderSingleList">打印流转单</el-button>
      <el-button type="success" v-show="!submitHidden" @click="printDetailCode">打印明细条码</el-button>
      <el-checkbox v-show="!submitHidden" v-model="form.detailCodeZsdw">明细条码使用证书单位名称</el-checkbox>
      <el-button type="success" v-show="!submitHidden" @click="printWtCode">打印委托条码</el-button>
      <el-button type="success" v-show="!submitHidden" @click="printAttachCode">打印附件条码</el-button>
      <el-button type="warning" v-show="!submitHidden" @click="backToEntrust">继续受理</el-button>
      <el-button type="danger" v-show="!submitHidden"
                 v-mindPopover="{message:'确认撤销?',success:cancelEntrust.bind(this)}">撤销本次录入</el-button>
      <el-button type="primary" v-show="!submitHidden" @click="preQuotedPrice">预报价</el-button>

      <div id="wtdTxmDy"></div>
    </span>
        <br/>
    </div>
</template>

<script>
    import Vue from "vue";
    // 引入封装的ajax控件
    import {ajaxRequest, ajaxProxyRequest, formatDate} from "../../util/base";
    //引入jquery
    import $ from "jquery";
    //引入右击事件 可自行绑定到输入框
    import rightclick from "../../../directives/rightcilck";
    import rightClick from "../../../mixins/FormRightClick";
    import showMoreList from "../plan/showMoreList";
    import InstrumentInfo from "../plan/InstrumentInfo.vue";
    import ContractForInspection from "./ContractForInspection";
    import historySjdInspection from "./historySjdInspection";
    import companyForm from "../../base/company/companyForm";
    import preQuotedPrice from "./preQuotedPrice";
    import addCompanyCommon from "../quotation/addCompanyCommon";
    import entrustWtdDraftBox from "./entrustWtdDraftBox";
    import VueBarcode from 'vue-barcode';
    import {
        header,
        headerCallback,
        headerSelfCheck,
        headerSelfCheckCallback,
        defaultList,
        batchInfo,
        columnsInfo
    } from "@/components/business/entrust/js/entrustTableJson";


    /* import {
      Button,
      Checkbox,
      CheckboxGroup,
      Col,
      Form,
      FormItem,
      Input,
      Radio,
      RadioGroup,
      Row,
      Select
    } from "element--ui";
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(RadioGroup);
    Vue.use(Radio);
    Vue.use(CheckboxGroup);
    Vue.use(Checkbox); */
    // 回车焦点事件
    Vue.directive('focusNextOnEnter', {
        bind: function (el, {value}, vnode) {
            el.addEventListener('keyup', (ev) => {
                if (ev.keyCode === 13) {
                    let nextInput = null;
                    if (value.index == 1) {//委托单信息互跳
                        nextInput = vnode.context.$refs[value.value]
                    } else if (value.index == 2) {//委托单信息跳器具组件
                        nextInput = vnode.context.$refs.instrumentinfo.$refs["form0"][0].$refs[value.value][0]
                    } else if (value.index == 3) {//器具组件信息互跳
                        nextInput = vnode.context.$refs[value.value][0]
                    } else if (value.index == 4) {//器具组件跳委托单信息
                        vnode.context.$emit('focusCompanyName');
                        return;
                    }

                    if (nextInput && typeof nextInput.focus === 'function') {
                        nextInput.focus()
                        nextInput.select()
                    }
                }
            })
        }
    });

    const defaults = {
        // isMessage: true,
        detectionMethod: "1",
        //-- 是否免费检测，0否，1是的数据配置，注意要修改上面的配置项
        freeCheck: 0,
        //-- 是否出具结论，0否，1是的数据配置，注意要修改上面的配置项
        isConclusion: 0,
        //-- 是否复检，0否，1是的数据配置，注意要修改上面的配置项
        isRecheck: 0,
        institutionalNature: "系统外",
        entrustDate: formatDate(new Date(), "YYYY-MM-DD"),
        serviceDate: formatDate(new Date(), "YYYY-MM-DD"),
        isAutoWtdh: false,
        source: 0
    };
    export default {
        name: "entrustWtdForm",
        props: {
            //用于接收从父组件中传来的数据
            data: {
                type: Object
            },
            callback: {
                type: Function
            }
        },
        data() {
            //input框中不输入字符，value为undefined
            var validateOrderNo = (rule, value, callback) => {
                if (
                    !this.form.isAutoWtdh &&
                    (value === "" || value == null || value === undefined)
                ) {
                    callback(new Error("请输入委托单号"));
                } else {
                    callback();
                }
            };
            var validateExecutor = (rule, value, callback) => {
                if (this.form.detectionMethod === "0") {
                    if (!value) {
                        callback(new Error("请输入执行人"));
                    }

                    if (!!this.form.executorId) {
                        if (this.executorName != this.form.executor) {
                            callback(new Error('必须选用给定的数据！'))
                        } else {
                            callback();
                        }
                    } else {
                        callback(new Error('必须选用给定的数据！'))
                    }
                } else {
                    callback();
                }
            };
            var validateMobilePhone = (rule, value, callback) => {
                if (!!!value) {
                    callback();
                } else {
                    let ruleRex = /^\d{11}$/;
                    if (ruleRex.test(value)) {
                        callback();
                    } else {
                        callback(new Error("请输入正确的手机号"));
                    }
                }
            };
            let telephoneCheck = (rule, value, callback) => {
                let reg = /([0-9]{3,4}-)?[0-9]{7,8}/
                if (value && !reg.test(value)) {
                    callback(new Error('请输入正确的办公电话'));
                } else {
                    callback();
                }
            };
            let emailCheck = (rule, value, callback) => {
                let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
                if (value && !reg.test(value)) {
                    callback(new Error('请输入正确的邮箱格式'));
                } else {
                    callback();
                }
            };
            var validateServiceDate = (rule, value, callback) => {
                if (
                    this.form.detectionMethod === "0" &&
                    (value === "" || value == null || value === undefined)
                ) {
                    callback(new Error("请选择业务受理日期"));
                } else {
                    callback();
                }
            };
            let hasAddCompanyPower = false;
            //按钮权限判断
            let buttonpermsStr = window.localStorage.getItem("btnPower");
            if (buttonpermsStr == null || buttonpermsStr == undefined) {
                //没有权限，所有涉及权限的按钮都不展示
                hasAddCompanyPower = false;
            } else if (buttonpermsStr.indexOf("@M16701@") != -1) {
                //有该按钮权限
                hasAddCompanyPower = true;
            }

            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {
                    //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
                    companyName: [
                        {type: "string", required: true, message: "单位名称不能为空"}
                    ],
                    address: [
                        {type: "string", required: true, message: "单位地址不能为空"}
                    ],
                    entrustDate: [
                        {type: "date", required: true, message: "请选择客户委托日期"}
                    ],
                    mobilePhone: [{validator: validateMobilePhone, trigger: "blur"}],
                    telephone: [{validator: telephoneCheck, trigger: "blur"}],
                    email: [{validator: emailCheck, trigger: "blur"}],
                    orderNo: [{validator: validateOrderNo, trigger: "blur"}],
                    executor: [{validator: validateExecutor, trigger: "change", required: true}],
                    serviceDate: [{validator: validateServiceDate, trigger: "blur", required: true}]
                },
                loading: false,
                remoteOptions: [],
                institutionalNatures: [
                    {value: "系统外"},
                    {value: "系统内"},
                    {value: "内传"}
                ],
                userName: window.localStorage.userName,
                hasAddCompanyPower: hasAddCompanyPower,
                submitHidden: true,

                //文件上传参数
                fileList: [],
                limitNumb: 1, //附件上传个数限制
                fdata: {//附件上传额外参数
                    caseId: "", //登记号       [非必填]  业务相关的登记号
                    serverId: "", //服务id     [非必填]  分布式附件服务可以用默认不用配制
                    flowId: "", //流程id      [非必填]  流程相关
                    execType: "", //操作类型   [非必填]  业务相关
                },
                up_url: "", //自定义上传路径 [非必填]  默认不用修改

                //器具组件
                header: header,
                defaultList: defaultList,
                batchInfo: batchInfo,
                columnsInfo: columnsInfo,
                tableData: null,
                isRefresh: false,

                //autoComplete 是否不输入值就可匹配
                flag: false,
                //单位更多信息弹出框是否显示
                visable: false,
                //更多单位传入id
                companyMany: null,

                specialDwRemark: false,
                visitSpecialRequirement: "",
                otherSpecialRequirement: "",
                contractRequireNo: "",
                changeDetectionMethodName: "",
                paramObj: {},
                //合同送检要号
                showContractForInspection: false,
                //历史数据要号
                showHistorySjdInspection: false,
                //添加委托单位
                showCompanyForm: false,
                //预报价
                showPreQuotedPrice: false,
                //已经添加过的器具id
                alreadyAddId: "",
                //控制器具添加、复制按钮是否显示
                instrumentAddCopyShow: '0',
                instrumentDelShow: '0',
                cancelData: [],//撤回按钮点击后显示的器具信息
                cancelForm: {},//撤回按钮点击后显示的单位信息
                executorName: "",//执行人名称，用于判断是否是选中的数据
                //查看草稿箱
                showEntrustWtdDraftBox: false
            };
        },
        mounted() {
            //页面渲染完成后，ajax请求加载数据
            this.remoteMethod();
            this.getIsAutoOrderNo();
            this.getFromData();
            this.focusCompanyName();

        },
        directives: {rightclick},
        mixins: [rightClick],
        components: {
            InstrumentInfo,
            showMoreList,
            ContractForInspection,
            historySjdInspection,
            companyForm,
            preQuotedPrice,
            addCompanyCommon,
            entrustWtdDraftBox
        },
        computed: {
            wtdInfo: function () {
                let obj = new Object();
                obj.companyId = this.form.companyId;
                obj.serviceDate = formatDate(this.form.serviceDate, "YYYY-MM-DD");
                obj.planApplianceId = "";
                console.log(this.$refs.instrumentinfo, 'this.$refs.instrumentinfo')
                if (this.$refs.instrumentinfo) {
                    let data = this.$refs.instrumentinfo.data;
                    console.log(data)

                    data.forEach((v, i) => {
                        if (!!data[i].planApplianceId && data[i].source == 4) {
                            obj.planApplianceId += data[i].planApplianceId + ",";
                        }
                    });
                    if (obj.planApplianceId) {
                        obj.planApplianceId = obj.planApplianceId.substr(0, obj.planApplianceId.length - 1);
                    }
                }
                obj.source = this.form.source;
                obj.submitHidden = this.submitHidden ? 0 : 1;
                return obj;
            },
            params() {
                return this.$route.params
            }
        },
        methods: {
            selectFirst() {
                //选中第一个
            },
            focusCompanyName() {
                this.$refs.companyName.focus();
            },
            //方法定义  1送检，0上门
            //修改检测方式时同步修改是否现场转带回，是否带回转现场
            changeDetectionMethodRadio() {
                let value = this.form.source == 2 ? "0" : "1";
                if (this.form.detectionMethod === value) {
                    this.form.isChangeDetectionMethod = false;
                    this.form.entrustDate = formatDate(this.form.addTime, "YYYY-MM-DD");
                } else {
                    this.form.isChangeDetectionMethod = true;
                    this.form.entrustDate = formatDate(new Date(), "YYYY-MM-DD");
                }
            },
            //修改是否带回转现场，是否现场转带回同步修改检测方式
            changeDetectionMethod() {
                let value =
                    this.form.source == 2
                        ? this.form.isChangeDetectionMethod
                        : !this.form.isChangeDetectionMethod;
                if (value) {
                    this.form.detectionMethod = "1";
                    this.form.entrustDate = formatDate(new Date(), "YYYY-MM-DD");
                } else {
                    this.form.detectionMethod = "0";
                    this.form.entrustDate = formatDate(this.form.addTime, "YYYY-MM-DD");
                }
            },
            getFromData() {
                let _this = this;
                let source = _this.$route.params.source;
                this.paramObj = _this.$route.params.obj;
                console.log(this.paramObj, "this.paramObj");
                console.log(source, "this.source");
                if (source) {
                    this.form.source = source;
                    console.log(this.form.source, '111111')
                    if (source == 2 || source == 3) {
                        //根据总单编号查询是否已保存到t_b_wtd中
                        ajaxRequest(
                            "get",
                            "back/entrustWtd/",
                            {orderNo: this.paramObj.orderNo},
                            res => {
                                if (res.code == 404) {
                                    //查询现场任务委托单信息
                                    ajaxRequest(
                                        "get",
                                        "back/plan/",
                                        {id: this.paramObj.planId, orderNo: this.paramObj.orderNo},
                                        res => {
                                            console.log(res, "wtdInfo");
                                            if (res.code == 200) {
                                                // if (res.daoResult.isMessage === 1) {
                                                //   res.daoResult.isMessage = true;
                                                // }
                                                this.form = res.daoResult;
                                                //因为plan表的source与这边的source值不一样，重新赋予form表单source值
                                                this.form.source = source;
                                                this.form.detectionMethod = source == 2 ? "0" : "1";
                                                this.changeDetectionMethodName =
                                                    source == 2 ? "是否现场转带回" : "是否带回转现场";
                                                if (this.paramObj.qjIds) {
                                                    this.form.executor = res.daoResult.inspector;
                                                    this.form.executorId = res.daoResult.inspectorId;
                                                    this.executorName = res.daoResult.inspector;
                                                } else {
                                                    //否则为追号
                                                    //设置执行人为当前追号人
                                                    this.form.executorId = window.localStorage.userId;
                                                    this.form.executor = window.localStorage.userName;
                                                    this.executorName = window.localStorage.userName;
                                                }
                                                this.form.orderNo = this.paramObj.orderNo;
                                                // this.form.isMessage = true;
                                                this.form.freeCheck = 0;
                                                this.form.isConclusion = res.daoResult.isConclusion * 1;
                                                this.form.isRecheck = res.daoResult.isRecheck * 1;
                                                this.form.serviceDate = formatDate(
                                                    new Date(),
                                                    "YYYY-MM-DD"
                                                );
                                                this.form.entrustDate = formatDate(
                                                    res.daoResult.addTime,
                                                    "YYYY-MM-DD"
                                                );
                                                if (this.form.certificatePrintTime) {
                                                    this.form.certificatePrintTime = formatDate(
                                                        this.form.certificatePrintTime,
                                                        "YYYY-MM-DD"
                                                    );
                                                }

                                                this.$set(
                                                    this.form,
                                                    "creditCode",
                                                    res.daoResult.creditCode
                                                );
                                                this.$set(
                                                    this.form,
                                                    "contractNo",
                                                    res.daoResult.contractNo
                                                );
                                                this.$set(
                                                    this.form,
                                                    "mobilePhone",
                                                    res.daoResult.mobilePhone
                                                );

                                                //任务来源
                                                let taskSource = "";
                                                if (!!res.daoResult.businessGroupName) {
                                                    taskSource += res.daoResult.businessGroupName;
                                                }
                                                if (!!res.daoResult.businessStaffName) {
                                                    taskSource += res.daoResult.businessStaffName;
                                                }
                                                this.$set(this.form, "taskSource", taskSource);
                                                //判断是否加载特殊需求备注
                                                if (!!res.daoResult.visitSpecialRequirement) {
                                                    this.visitSpecialRequirement =
                                                        "上门特殊要求：" +
                                                        res.daoResult.visitSpecialRequirement;
                                                    this.specialDwRemark = true;
                                                }
                                                if (!!res.daoResult.otherSpecialRequirement) {
                                                    this.otherSpecialRequirement =
                                                        "其他特殊要求：" +
                                                        res.daoResult.otherSpecialRequirement;
                                                    this.specialDwRemark = true;
                                                }

                                                // 加载附件
                                                if (res.daoResult.attachment) {
                                                    this.$refs.upFiles.loadAttacheIds(
                                                        res.daoResult.attachment
                                                    );
                                                }
                                            }
                                        }
                                    );
                                } else if (res.code == 200) {
                                    // if (res.daoResult.isMessage === 1) {
                                    //   res.daoResult.isMessage = true;
                                    // }
                                    this.changeDetectionMethodName =
                                        source == 2 ? "是否现场转带回" : "是否带回转现场";
                                    this.form = res.daoResult;
                                    //无器具id时为追号
                                    if (!this.paramObj.qjIds) {
                                        //设置执行人为当前追号人
                                        this.form.executorId = window.localStorage.userId;
                                        this.form.executor = window.localStorage.userName;
                                    }
                                    this.form.serviceDate = formatDate(
                                        this.form.serviceDate,
                                        "YYYY-MM-DD"
                                    );
                                    this.form.entrustDate = formatDate(
                                        this.form.entrustDate,
                                        "YYYY-MM-DD"
                                    );
                                    if (this.form.certificatePrintTime) {
                                        this.form.certificatePrintTime = formatDate(
                                            this.form.certificatePrintTime,
                                            "YYYY-MM-DD"
                                        );
                                    }

                                    //判断是否加载特殊需求备注
                                    if (!!res.daoResult.visitSpecialRequirement) {
                                        this.visitSpecialRequirement =
                                            "上门特殊要求：" + res.daoResult.visitSpecialRequirement;
                                        this.specialDwRemark = true;
                                    }
                                    if (!!res.daoResult.otherSpecialRequirement) {
                                        this.otherSpecialRequirement =
                                            "其他特殊要求：" + res.daoResult.otherSpecialRequirement;
                                        this.specialDwRemark = true;
                                    }
                                    // 加载附件
                                    if (res.daoResult.attachment) {
                                        this.$refs.upFiles.loadAttacheIds(res.daoResult.attachment);
                                    }
                                }
                            }
                        );

                        //如果有器具列表，则为要号
                        if (this.paramObj.qjIds) {
                            //查询器具列表
                            ajaxRequest(
                                "get",
                                "back/planAppliance/list/" + this.paramObj.qjIds,
                                {},
                                res => {
                                    console.log(res, "qjInfoList");
                                    if (res.code == 200) {
                                        this.tableData = res.rows;
                                        //移出、移入刷新器具组件
                                        this.isRefresh = true;
                                        this.$nextTick(() => {
                                            this.isRefresh = false;
                                        });
                                    }
                                }
                            );
                        }
                    } else if (source == 1) {
                        this.instrumentAddCopyShow = '1';
                        console.log(this.paramObj, 'paramObj')
                        this.form.institutionalNature = "内传";
                        this.header = headerSelfCheck;

                        //单位信息设置
                        let defaultCompanyName = "";
                        ajaxProxyRequest("get", "/njmind/findParam/defaultCompanyName", {}, res => {
                            defaultCompanyName = res.value;
                            console.log(defaultCompanyName, '22222222222222')
                            if (defaultCompanyName) {
                                let params = defaultCompanyName
                                    ? {
                                        companyName: defaultCompanyName,
                                        fuzzySearch: 1
                                    }
                                    : "";
                                ajaxRequest("get", "back/company/matchCompanysByName", params, res => {
                                    if (res.code == 200) {
                                        console.log(res.rows, 'danweixinxi ')
                                        if (res.rows.length > 0) {
                                            this.handleSelect(res.rows[0]);
                                            this.form.certificateCompanyName = res.rows[0].companyName + "(" + this.paramObj[0].departName + ")";
                                        } else {
                                            this.$message.error("请先维护本单位对应的单位信息！");
                                        }
                                    }
                                });
                            } else {
                                this.$message.error("请先维护本单位名称！");
                            }
                        });


                        let rowInfo = [];
                        //查询时根据仪器设备id查询上次自检要号的器具信息，或者关联器具表，like%%查询计量器具信息
                        this.paramObj.forEach((v, i) => {
                            let object = new Object();
                            object.correlationId = this.paramObj[i].id;
                            object.source = 1;
                            if (this.paramObj[i].applianceId) {
                                object.id = this.paramObj[i].applianceId;
                            }
                            if (this.paramObj[i].applianceName) {
                                object.applianceName = this.paramObj[i].applianceName;
                            }
                            object.applianceActualName = this.paramObj[i].instrumentationName;
                            if (this.paramObj[i].departId) {
                                object.departId = this.paramObj[i].departId;
                            }
                            if (this.paramObj[i].postId) {
                                object.postId = this.paramObj[i].postId;
                            }
                            object.isCompulsoryVerify = this.paramObj[i].isCompulsoryVerify;
                            object.applianceUse = this.paramObj[i].applianceUse;
                            if (object.applianceUse && object.applianceUse.indexOf(',') != -1) {
                                object.applianceUse = object.applianceUse.split(',')[0];
                            }
                            object.certificateType = this.paramObj[i].applianceCertificateType;
                            object.model = this.paramObj[i].model;
                            object.equipmentNo = this.paramObj[i].deviceNumber;
                            object.manufacturer = this.paramObj[i].manufacturer;
                            object.factoryNo = this.paramObj[i].manufacturingCode;
                            object.urgentDayPercent = "0@@0";
                            object.isUrgent = "0";
                            object.urgentProportions = "0";
                            object.subcontractArea = "0";
                            object.setNumber = 1;
                            object.pieceNumber = 1;
                            object.certificateNumber = 1;
                            rowInfo.push(object)
                        });

                        this.tableData = rowInfo;
                    } else if (source == 4) {
                        this.instrumentDelShow = '1';
                        ajaxRequest("get", "back/olBooking/findMergeInfo", {
                            xh: this.paramObj.mergeXh,
                            source: '0'
                        }, res => {
                            if (res.code == 200) {
                                console.log(res, 'wsbj ')
                                let map = res.map;
                                let wtdInfo = map.olBookingTotal;
                                let companyInfo = map.company;
                                //0送检，1现场
                                this.form.detectionMethod = wtdInfo.bjType === "1" ? "0" : "1";
                                this.form.onlineInspectionId = wtdInfo.bjdId;
                                this.form.onlineInspectionType = wtdInfo.source;
                                this.form.companyId = companyInfo.companyId ? companyInfo.companyId : wtdInfo.erpDwId;
                                this.form.companyName = companyInfo.companyName ? companyInfo.companyName : wtdInfo.dwMc;
                                if (companyInfo.administrativeArea) {
                                    this.form.administrativeArea = companyInfo.administrativeArea;
                                }
                                if (companyInfo.postCode) {
                                    this.form.postCode = companyInfo.postCode;
                                }
                                if (companyInfo.institutionalNature) {
                                    this.form.institutionalNature = companyInfo.institutionalNature;
                                }
                                this.form.contacter = wtdInfo.lxr ? wtdInfo.lxr : companyInfo.contacter;
                                this.form.telephone = wtdInfo.lxdh ? wtdInfo.lxdh : companyInfo.telephone;
                                this.form.address = wtdInfo.dz ? wtdInfo.dz : companyInfo.address;
                                this.form.certificateCompanyName = wtdInfo.zsdw;
                                this.form.certificateCompanyAddress = wtdInfo.zsdz;

                                //是否维修，0否，1是，2咨询，外网中0不维修，1
                                let isRepair = wtdInfo.ycxl == '1' ? '2' : wtdInfo.ycxl == '2' ? '1' : '0';
                                this.form.isRecheck = wtdInfo.fjrq * 1;
                                this.form.isConclusion = wtdInfo.jdjl * 1;

                                this.form.creditCode = companyInfo.creditCode;
                                this.form.mobilePhone = companyInfo.mobilePhone;
                                //任务来源
                                let taskSource = wtdInfo.source === "2" ? "公共服务平台" : wtdInfo.source === "1" ? "强检平台" : "";
                                this.$set(this.form, "taskSource", taskSource);
                                //判断是否加载特殊需求备注
                                this.specialDwRemark = false;
                                if (!!companyInfo.visitSpecialRequirement) {
                                    this.visitSpecialRequirement =
                                        "上门特殊要求：" + companyInfo.visitSpecialRequirement;
                                    this.specialDwRemark = true;
                                }
                                if (!!companyInfo.otherSpecialRequirement) {
                                    this.otherSpecialRequirement =
                                        "其他特殊要求：" + companyInfo.otherSpecialRequirement;
                                    this.specialDwRemark = true;
                                }

                                let rowInfo = [];
                                let wsMergeDetailList = map.wsMergeZd.wsMergeDetailList;
                                wsMergeDetailList.forEach((v, i) => {
                                    let object = new Object();
                                    object.correlationId = wsMergeDetailList[i].qjidNew;
                                    object.source = 9;
                                    if (wsMergeDetailList[i].applianceId) {
                                        object.id = wsMergeDetailList[i].applianceId;
                                    }
                                    if (wsMergeDetailList[i].applianceName) {
                                        object.applianceName = wsMergeDetailList[i].applianceName;
                                    }
                                    object.applianceActualName = wsMergeDetailList[i].qjmcNew;
                                    if (wsMergeDetailList[i].departId) {
                                        object.departId = wsMergeDetailList[i].departId;
                                    }
                                    if (wsMergeDetailList[i].postId) {
                                        object.postId = wsMergeDetailList[i].postId;
                                    }
                                    object.isCompulsoryVerify = wtdInfo.source === "1" ? true : false;
                                    object.applianceUse = wsMergeDetailList[i].applianceUse;
                                    if (object.applianceUse && object.applianceUse.indexOf(',') != -1) {
                                        object.applianceUse = object.applianceUse.split(',')[0];
                                    }
                                    object.certificateType = wsMergeDetailList[i].applianceCertificateType;
                                    object.model = wsMergeDetailList[i].xhggNew;
                                    object.equipmentNo = wsMergeDetailList[i].sbbhNew;
                                    object.manufacturer = wsMergeDetailList[i].zzcsNew;
                                    object.factoryNo = wsMergeDetailList[i].ccbhNew;
                                    object.urgentDayPercent = "0@@0";
                                    object.isUrgent = "0";
                                    object.urgentProportions = "0";
                                    object.subcontractArea = "0";
                                    object.setNumber = wsMergeDetailList[i].tsNew;
                                    object.pieceNumber = wsMergeDetailList[i].jsNew;
                                    object.certificateNumber = wsMergeDetailList[i].tsNew;
                                    object.remark = wsMergeDetailList[i].bzNew;
                                    object.accessory = wsMergeDetailList[i].fj;
                                    object.isRepair = isRepair;
                                    rowInfo.push(object)
                                });
                                this.tableData = rowInfo;
                                //移出、移入刷新器具组件
                                this.isRefresh = true;
                                this.$nextTick(() => {
                                    this.isRefresh = false;
                                });
                            }
                        });
                    }
                }
            },
            contractForInspection() {
                if (!this.form.companyName) {
                    this.$message.error("请先输入委托单位！");
                } else {
                    //过滤当前页面已选择的器具id
                    this.alreadyAddId = "";
                    let data = this.$refs.instrumentinfo.data;
                    this.tableData = data;
                    data.forEach((v, i) => {
                        if (!!data[i].planApplianceId && data[i].source == 4) {
                            this.alreadyAddId += data[i].planApplianceId + ",";
                        }
                    });
                    if (this.alreadyAddId) {
                        this.alreadyAddId = this.alreadyAddId.substr(0, this.alreadyAddId.length - 1);
                    }


                    this.showContractForInspection = true;
                }
            },
            handleContractForInspectionCallback(rowInfo) {
                this.showContractForInspection = false;
                if (rowInfo) {
                    //加载单位信息
                    this.form.companyId = rowInfo[0].companyId;
                    this.form.companyName = rowInfo[0].companyName;
                    if (rowInfo[0].administrativeArea) {
                        this.form.administrativeArea = rowInfo[0].administrativeArea;
                    }
                    if (rowInfo[0].postCode) {
                        this.form.postCode = rowInfo[0].postCode;
                    }
                    if (rowInfo[0].institutionalNature) {
                        this.form.institutionalNature = rowInfo[0].institutionalNature;
                    }
                    this.form.contacter = rowInfo[0].contacter;
                    this.form.telephone = rowInfo[0].telephone;
                    this.form.address = rowInfo[0].address;
                    this.form.certificateCompanyName = rowInfo[0].certificateCompanyName;
                    this.form.certificateCompanyAddress =
                        rowInfo[0].certificateCompanyAddress;
                    this.form.certificatePrintTime = rowInfo[0].certificatePrintTime;
                    this.form.isConclusion = rowInfo[0].isConclusion * 1;
                    this.form.isRecheck = rowInfo[0].isRecheck * 1;
                    this.form.specialRequirement = rowInfo[0].specialRequirement;
                    this.form.creditCode = rowInfo[0].creditCode;
                    this.form.mobilePhone = rowInfo[0].mobilePhone;
                    this.form.quotationNo = rowInfo[0].quotationNo;
                    //任务来源
                    let taskSource = "";
                    if (!!rowInfo[0].businessGroupName) {
                        taskSource += rowInfo[0].businessGroupName;
                    }
                    if (!!rowInfo[0].businessStaffName) {
                        taskSource += rowInfo[0].businessStaffName;
                    }
                    this.$set(this.form, "taskSource", taskSource);
                    //判断是否加载特殊需求备注
                    this.specialDwRemark = false;
                    if (!!rowInfo[0].visitSpecialRequirement) {
                        this.visitSpecialRequirement =
                            "上门特殊要求：" + rowInfo[0].visitSpecialRequirement;
                        this.specialDwRemark = true;
                    }
                    if (!!rowInfo[0].otherSpecialRequirement) {
                        this.otherSpecialRequirement =
                            "其他特殊要求：" + rowInfo[0].otherSpecialRequirement;
                        this.specialDwRemark = true;
                    }
                    // 加载附件
                    if (rowInfo[0].attachment) {
                        this.$refs.upFiles.loadAttacheIds(rowInfo[0].attachment);
                    }

                    //加载器具列表
                    if (this.tableData) {
                        this.tableData = this.tableData.concat(rowInfo);
                    } else {
                        this.tableData = rowInfo;
                    }
                    //移出、移入刷新器具组件
                    this.isRefresh = true;
                    // this.$nextTick(() => {
                    this.isRefresh = false;
                    // });
                }
            },
            //历史数据要号按钮点击事件
            historySjdInspection() {
                if (!this.form.companyName) {
                    this.$message.error("请先输入委托单位！");
                } else {
                    //过滤当前页面已选择的器具id
                    this.alreadyAddId = "";
                    let data = this.$refs.instrumentinfo.data;
                    this.tableData = data;
                    data.forEach((v, i) => {
                        if (!!data[i].correlationId && data[i].source == 6) {
                            this.alreadyAddId += data[i].correlationId + ",";
                        }
                    });
                    if (this.alreadyAddId) {
                        this.alreadyAddId = this.alreadyAddId.substr(0, this.alreadyAddId.length - 1);
                    }
                    this.showHistorySjdInspection = true;
                }
            },
            //历史数据要号回调方法
            handleHistorySjdInspectionCallback(rowInfo) {
                this.showHistorySjdInspection = false;
                if (rowInfo) {
                    //加载器具列表
                    if (this.tableData) {
                        this.tableData = this.tableData.concat(rowInfo);
                    } else {
                        this.tableData = rowInfo;
                    }
                    //移出、移入刷新器具组件
                    this.isRefresh = true;
                    // this.$nextTick(() => {
                    this.isRefresh = false;
                    // });
                }
            },
            //获取是否自动配置委托单编号配置文件
            getIsAutoOrderNo() {
                ajaxProxyRequest("get", "/njmind/findParam/isAutoOrderNo", {}, res => {
                    Vue.set(this.form, "isAutoWtdh", Boolean(res.value));
                });
            },
            //自动配置时清空委托单号
            changeOrderNo() {
                if (this.form.isAutoWtdh) {
                    Vue.set(this.form, "orderNo", "");
                }
            },
            //预要委托单号
            getOrderNo() {
                ajaxRequest("get", "back/entrustWtd/getOrderNo", "", res => {
                    if (res.code == 200) {
                        console.log(res);
                        if (this.form.isAutoWtdh) {
                            this.form.isAutoWtdh = false;
                        }
                        Vue.set(this.form, "orderNo", res.daoResult);
                    }
                });
            },
            addCompany() {
                this.showCompanyForm = true;
            },
            //回写单位信息
            setCompanyInfo(data) {
                console.log(data);
                //带入单位信息到表单中
                this.showCompanyForm = false;

                this.$set(this.form, "companyId", data.id);
                this.$set(this.form, "companyName", data.companyName);
                this.$set(this.form, "contractNo", data.contractNo);
                //省市区
                let administrativeArea = "";
                if (!!data.province) {
                    administrativeArea += data.province + "/";
                }
                if (!!data.city) {
                    administrativeArea += data.city + "/";
                }
                if (!!data.area) {
                    administrativeArea += data.area;
                }
                this.$set(this.form, "administrativeArea", administrativeArea);
                this.$set(this.form, "postCode", data.postCode);
                this.$set(this.form, "creditCode", data.creditCode);
                this.$set(this.form, "mobilePhone", data.mobilePhone);


                this.$set(this.form, "address", data.address);
                this.$set(this.form, "contacter", data.contacter);
                this.$set(this.form, "telephone", data.telephone);

                //任务来源
                let taskSource = "";
                if (!!data.businessGroupName) {
                    taskSource += data.businessGroupName;
                }
                if (!!data.businessStaffName) {
                    taskSource += data.businessStaffName;
                }
                this.$set(this.form, "taskSource", taskSource);

                this.specialDwRemark = false;
                if (!!data.visitSpecialRequirement) {
                    this.visitSpecialRequirement =
                        "上门特殊要求：" + data.visitSpecialRequirement;
                    this.specialDwRemark = true;
                }
                if (!!data.otherSpecialRequirement) {
                    this.otherSpecialRequirement =
                        "其他特殊要求：" + data.otherSpecialRequirement;
                    this.specialDwRemark = true;
                }
            },
            //执行人autoComplete
            querySearchPerson(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                let params = queryString
                    ? {
                        userName: queryString,
                        isDelete: "0",
                        fuzzySearch: 1
                    }
                    : "";
                ajaxRequest("get", "back/user/retrieve", params, res => {
                    if (res.code == 200) {
                        this.handleExecutorResult(res.rows);
                        cb(res.rows);
                    }
                });
            },
            handleExecutorResult(res) {
                console.log(res, "userInfo");
                for (let key in res) {
                    Vue.set(res[key], "value", res[key].userName);
                }
            },
            handleExecutorSelect(item) {
                this.executorName = item.userName;
                this.$set(this.form, "executor", item.userName);
                this.$set(this.form, "executorId", item.userNo);
            },

            //委托单位autoComplete
            querySearchEntrust(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                let params = queryString
                    ? {
                        companyName: queryString,
                        fuzzySearch: 1
                    }
                    : "";
                ajaxRequest("get", "back/company/matchCompanysByName", params, res => {
                    if (res.code == 200) {
                        this.handleResult(res.rows);
                        cb(res.rows);
                    }
                });
            },
            handleResult(res) {
                for (let key in res) {
                    Vue.set(res[key], "value", res[key].companyName);
                }
            },
            handleSelect(item) {
                this.visable = false;

                // Object.assign({},this.form,{
                //   contractNo: 123
                // })
                console.log(item, "companyInfo");
                this.$set(this.form, "companyId", item.id);
                this.$set(this.form, "companyName", item.companyName);
                this.$set(this.form, "contractNo", item.contractNo);
                //省市区
                let administrativeArea = "";
                if (!!item.province) {
                    administrativeArea += item.province + "/";
                }
                if (!!item.city) {
                    administrativeArea += item.city + "/";
                }
                if (!!item.area) {
                    administrativeArea += item.area;
                }
                this.$set(this.form, "administrativeArea", administrativeArea);
                this.$set(this.form, "postCode", item.postCode);
                this.$set(this.form, "creditCode", item.creditCode);
                this.$set(this.form, "mobilePhone", item.mobilePhone);
                this.$set(this.form, "email", item.email);

                if (item.many == "1") {
                    this.companyMany = item.id;
                    this.visable = true;
                } else {
                    this.$set(this.form, "address", item.address);
                    this.$set(this.form, "contacter", item.contacter);
                    this.$set(this.form, "telephone", item.telephone);
                    this.$set(
                        this.form,
                        "certificateCompanyName",
                        item.certificateCompanyName
                    );
                }
                //任务来源
                let taskSource = "";
                if (!!item.businessGroupName) {
                    taskSource += item.businessGroupName;
                }
                if (!!item.businessStaffName) {
                    taskSource += item.businessStaffName;
                }
                this.$set(this.form, "taskSource", taskSource);

                this.specialDwRemark = false;
                if (!!item.visitSpecialRequirement) {
                    this.visitSpecialRequirement =
                        "上门特殊要求：" + item.visitSpecialRequirement;
                    this.specialDwRemark = true;
                }
                if (!!item.otherSpecialRequirement) {
                    this.otherSpecialRequirement =
                        "其他特殊要求：" + item.otherSpecialRequirement;
                    this.specialDwRemark = true;
                }
                if (item.inspectionCount > 0) {
                    this.contractRequireNo =
                        "该客户为协议单位，请优先从合同送检要号中进行配号从而跟踪合同！";
                    this.specialDwRemark = true;
                }
            },
            handleCallBack(val) {
                if (val) {
                    //判断选中的单位信息是多单位地址还是基本信息，用于后台更新单位信息用
                    if (val.contactSource == 2) {
                        this.$set(this.form, "companyContactId", val.id);
                    } else {
                        this.$set(this.form, "companyContactId", null);
                    }
                    this.$set(this.form, "address", val.address);
                    this.$set(this.form, "contacter", val.contacter);
                    this.$set(this.form, "telephone", val.telephone);
                    this.$set(
                        this.form,
                        "certificateCompanyName",
                        val.certificateCompanyName
                    );
                }
                this.visable = false;
            },
            //清空合同编号
            clearHtbh() {
                Vue.set(this.form, "contractNo", "");
            },
            //callBack上传组件数据发生变化回调
            fileUploadCallBack(file, list) {
                this.fileList = list;
                this.form.attachment = this.fileList[0].id;
                // console.log(this.fileList[0].id);
                // console.log("调用上传页面收到的 附件列表", this.fileList);
            },
            handleSubmit() {
                //-- 表单提交处理 --
                delete this.form["addTime"];
                delete this.form["updateTime"];
                if (this.form.serviceDate) {
                    this.form.serviceDate = new Date(this.form.serviceDate);
                }
                if (this.form.entrustDate) {
                    this.form.entrustDate = new Date(this.form.entrustDate);
                }
                //非自检要号时，证书日期统一，自检要号时每个器具都有证书日期
                if (this.form.source != 1) {
                    if (this.form.certificatePrintTime) {
                        this.form.certificatePrintTime = new Date(this.form.certificatePrintTime);
                    }
                }
                this.$refs.form.validate(valid => {
                    //校验成功则回调提交数据
                    if (valid) {
                        //对器具信息进行校验
                        let data = this.$refs.instrumentinfo.data, errFlag = true;
                        this.cancelData = data;
                        this.cancelForm = this.form;
                        data.forEach((v, i) => {
                            var flag = this.$refs.instrumentinfo.$refs["form" + i][0].test();
                            if (!flag) {
                                errFlag = false;
                            } else {
                                data[i].isCompulsoryVerify = data[i].isCompulsoryVerify ? 1 : 0;
                                data[i].isUrgent = data[i].urgentDayPercent.split("@@")[0];
                                data[i].urgentProportions = data[i].urgentDayPercent.split(
                                    "@@"
                                )[1];
                                data[i].isDoubleNumber = data[i].isDoubleNumber ? 1 : 0;

                                data[i].executor = data[i].inspector ? data[i].inspector : data[i].executor;
                                data[i].executorId = data[i].inspectorId ? data[i].inspectorId : data[i].executorId;

                                data[i].correlationId = data[i].linkId ? data[i].linkId : data[i].correlationId;
                                data[i].quotationNo = this.form.quotationNo;
                                //是否授权
                                if (
                                    data[i].isCalibrationAuth === "1" ||
                                    data[i].isCnasAuth === "1" ||
                                    data[i].isVerifyAuth === "1"
                                ) {
                                    data[i].isAuthorise = "1";
                                } else {
                                    data[i].isAuthorise = "0";
                                }
                                //非自检要号时，取委托单的证书日期
                                if (this.form.source != 1) {
                                    data[i].certificatePrintTime = this.form.certificatePrintTime;
                                }

                                //source值处理
                                // if(this.form.source == 0){
                                //   if(data[i].source){}
                                // }else if(this.form.source == 1){

                                // }else if(this.form.source == 2){

                                // }else if(this.form.source == 3){

                                // }else if(this.form.source == 4){

                                // }

                            }
                        });
                        console.log(data, "器具信息");
                        if (errFlag) {
                            // var httpMethod;//http请求方式
                            // if(!this.form.id||this.form.id==''){//新增 注意:通过id是否存在来判断是新增还是编辑
                            //     httpMethod = 'post';
                            // }else {//更新
                            //     httpMethod = 'put';
                            // }
                            // this.form.isMessage = this.form.isMessage ? 1 : 0;
                            console.log(this.form.source, '33333')
                            this.form.source = this.form.source ? this.form.source : 0;
                            console.log(this.form.source, '22222')
                            delete this.form["entrustSjdList"];
                            for (var key in this.form) {
                                if (this.form[key] == null) {
                                    delete this.form[key];
                                }
                            }
                            console.log(this.form, "wtdInfo");
                            if (!!this.form.orderNo && this.form.source == 0) {
                                ajaxRequest("post", "back/entrustWtd/getOrderNoCount", {orderNo: this.form.orderNo}, res => {
                                    if (res.code == 200) {
                                        if (res.total > 0) {
                                            this.$message.error("委托单编号已存在，请重新输入");
                                        } else {
                                            if (this.form.freeCheck == 1) {
                                                this.$confirm('委托单为免费检测，确认提交?', '提示', {
                                                    confirmButtonText: '确定',
                                                    cancelButtonText: '取消',
                                                    type: 'warning'
                                                }).then(() => {
                                                    this.submitAjaxRequest(data);
                                                }).catch(() => {
                                                })
                                            } else {
                                                this.submitAjaxRequest(data);
                                            }
                                        }
                                    }
                                })
                            } else {
                                console.log('cccccccccccccc')
                                if (this.form.freeCheck == 1) {
                                    this.$confirm('委托单为免费检测，确认提交?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        this.submitAjaxRequest(data);
                                    }).catch(() => {
                                    })
                                } else {
                                    this.submitAjaxRequest(data);
                                }
                            }

                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                });

            },
            submitAjaxRequest(data) {
                ajaxRequest(
                    "post",
                    "back/entrustWtd/",
                    {
                        customer: JSON.stringify(this.form),
                        appliances: JSON.stringify(data)
                    },
                    res => {
                        if (res.code == 200) {
                            this.$message.success("提交成功");
                            console.log(res, "提交成功");
                            console.log(this.form);
                            if (this.form.source == 2 || this.form.source == 3) {
                                this.$router.push({
                                    name: this.form.source == 2 ? "399" : "401",
                                    params: {
                                        obj: this.paramObj
                                        // qjIds:ids,
                                        // planId:this.planData.id,
                                        // orderNo:this.orderNo,
                                        // source:2
                                    }
                                });
                            } else {
                                if (this.form.source == 1) {
                                    this.header = headerSelfCheckCallback;
                                } else {
                                    this.header = headerCallback;
                                }
                                this.form = res.daoResult;
                                // this.form.isMessage =
                                //   this.form.isMessage == 1 || this.form.isMessage;
                                this.tableData = res.daoResult.entrustSjdList;
                                this.submitHidden = false;
                                this.$refs.upFiles.loadAttacheIds(this.form.attachment);
                            }
                        }
                    }
                );
            },
            addDraftBox() {
                //-- 表单提交处理 --
                delete this.form["addTime"];
                delete this.form["updateTime"];
                if (this.form.serviceDate) {
                    this.form.serviceDate = new Date(this.form.serviceDate);
                }
                if (this.form.entrustDate) {
                    this.form.entrustDate = new Date(this.form.entrustDate);
                }
                //非自检要号时，证书日期统一，自检要号时每个器具都有证书日期
                if (this.form.source != 1) {
                    if (this.form.certificatePrintTime) {
                        this.form.certificatePrintTime = new Date(this.form.certificatePrintTime);
                    }
                }
                this.$refs.form.validate(valid => {
                    //校验成功则回调提交数据
                    if (valid) {
                        //对器具信息进行校验
                        let data = this.$refs.instrumentinfo.data, errFlag = true;
                        this.cancelData = data;
                        this.cancelForm = this.form;
                        data.forEach((v, i) => {
                            var flag = this.$refs.instrumentinfo.$refs["form" + i][0].test();
                            if (!flag) {
                                errFlag = false;
                            } else {
                                data[i].isCompulsoryVerify = data[i].isCompulsoryVerify ? 1 : 0;
                                data[i].isUrgent = data[i].urgentDayPercent.split("@@")[0];
                                data[i].urgentProportions = data[i].urgentDayPercent.split(
                                    "@@"
                                )[1];
                                data[i].isDoubleNumber = data[i].isDoubleNumber ? 1 : 0;

                                data[i].executor = data[i].inspector ? data[i].inspector : data[i].executor;
                                data[i].executorId = data[i].inspectorId ? data[i].inspectorId : data[i].executorId;

                                data[i].correlationId = data[i].linkId ? data[i].linkId : data[i].correlationId;
                                data[i].quotationNo = this.form.quotationNo;
                                //是否授权
                                if (
                                    data[i].isCalibrationAuth === "1" ||
                                    data[i].isCnasAuth === "1" ||
                                    data[i].isVerifyAuth === "1"
                                ) {
                                    data[i].isAuthorise = "1";
                                } else {
                                    data[i].isAuthorise = "0";
                                }
                                //非自检要号时，取委托单的证书日期
                                if (this.form.source != 1) {
                                    data[i].certificatePrintTime = this.form.certificatePrintTime;
                                }
                            }
                        });
                        console.log(data, "器具信息");
                        if (errFlag) {

                            this.form.source = this.form.source ? this.form.source : 0;

                            delete this.form["entrustSjdList"];
                            for (var key in this.form) {
                                if (this.form[key] == null) {
                                    delete this.form[key];
                                }
                            }

                            ajaxRequest(
                                "post",
                                "back/entrustWtd/addDraftBox",
                                {
                                    customer: JSON.stringify(this.form),
                                    appliances: JSON.stringify(data)
                                },
                                res => {
                                    if (res.code == 200) {
                                        this.$message.success("保存草稿箱成功");
                                    }
                                }
                            );
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                });
            },
            //查看草稿箱
            queryDraftBox() {
                this.showEntrustWtdDraftBox = true;
            },
            //草稿箱回调事件
            handleEntrustWtdDraftBoxCallback(obj) {
                console.log(obj)
                this.showEntrustWtdDraftBox = false;
                if (obj !== undefined && obj !== null) {
                    console.log("obj", obj)
                    this.form = obj;
                    if (!!!obj.orderNo) {
                        this.form.isAutoWtdh = true;
                    }
                    this.tableData = obj.entrustSjdList;
                    delete this.form.wtdId;
                    //移出、移入刷新器具组件
                    this.isRefresh = true;
                    // this.$nextTick(() => {
                    this.isRefresh = false;
                    // });
                }
            },
            backToXcDh() {
                this.$router.push({
                    name: this.form.source == 2 ? "399" : "401",
                    params: {
                        obj: this.paramObj
                        // qjIds:ids,
                        // planId:this.planData.id,
                        // orderNo:this.orderNo,
                        // source:2
                    }
                });
            },
            //委托单条码打印
            printOrderTxm() {
                if (!!this.form.orderNo) {
                    var newstr = '';
                    let MyComponent = Vue.extend({
                        template: `<vue-barcode style="display:none" id="wtdTxmDy" value="${this.form.orderNo}" :width="2" :height="40" :displayValue="true" tag="canvas"></vue-barcode>`,
                        components: {
                            VueBarcode
                        }
                    })
                    new MyComponent().$mount('#wtdTxmDy')
                    newstr += document.getElementById('wtdTxmDy').innerHTML
                    // sessionStorage.setItem('printHtml',newstr)
                    this.printHtml("wtdTxmPrint", {key1: newstr}, 1);
                } else {
                    this.$message.error('请先输入委托单编号！')
                }

            },
            //打印委托单
            printOrderList() {
                var newstr = '';
                let MyComponent = Vue.extend({
                    template: `<vue-barcode style="display:none" id="wtdTxmDy" value="${this.form.orderNo}" :width="1.6" :height="36" :displayValue="false" tag="canvas"></vue-barcode>`,
                    components: {
                        VueBarcode
                    }
                });
                new MyComponent().$mount('#wtdTxmDy')
                newstr += document.getElementById('wtdTxmDy').innerHTML
                //
                ajaxRequest('get', 'back/entrustWtd/getWtdCompany', {orderNo: this.form.orderNo}, res => {
                    if (res.code === 200) {
                        this.printHtml("wtdPrint", {key1: newstr, wtdId: res.daoResult.wtdId}, 1);
                    } else {
                        this.$message.error("获取打印数据错误");
                    }
                })
            },
            //流转单打印
            printOrderSingleList() {
                ajaxRequest('get', 'back/entrustWtd/getOSByOrderNo', {orderNo: this.form.orderNo}, res => {
                    if (res.code === 200) {
                        let arr = res.rows;
                        this.printHtml("orderSingle", {key1: '', arr: arr}, 1);
                    }
                });
            },
            //打印明细条码
            printDetailCode() {
                this.printHtml("wtdDetailTxmPrint", {key1: '', arr: this.tableData, detailCodeZsdw:this.form. detailCodeZsdw}, 1);
            },
            //打印委托条码
            printWtCode() {
                this.printHtml("wtTxmPrint", {key1: '',arr: this.tableData}, 1);
            },
            //打印附件条码
            printAttachCode() {
            },
            cancelEntrust() {
                ajaxRequest('post', 'back/entrustWtd/list/' + this.form.wtdId, {
                    _method: 'delete',
                    source: "1"
                }, function (res) {
                    if (res.code === 200) {
                        this.$message.success('撤销成功')
                        this.header = header;
                        this.form = this.cancelForm;
                        this.tableData = this.cancelData;
                        this.submitHidden = true;
                        //移出、移入刷新器具组件
                        // this.isRefresh = true;
                        // this.$nextTick(() => {
                        // this.isRefresh = false;
                        // });
                    } else {
                        this.$message.error('撤销失败')
                    }
                }.bind(this))
            },
            //预报价
            preQuotedPrice() {
                this.showPreQuotedPrice = true;
            },
            //预报价回调
            handlePreQuotedPriceCallback() {
                this.showPreQuotedPrice = false;
            },
            backToEntrust() {
                this.$refs["form"].resetFields();
                this.$refs.upFiles.loadAttacheIds("");
                this.getIsAutoOrderNo();
                this.submitHidden = true;
                this.specialDwRemark = false;
                //修改器具组件表头，清空器具组件数据
                this.header = header;
                this.tableData = null;

                //移出、移入刷新器具组件
                this.isRefresh = true;
                this.$nextTick(() => {
                    this.isRefresh = false;
                })
            },
            remoteMethod() {
                //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
                this.loading = true;
                ajaxRequest("get", "back/", null, res => {
                    if (res.code == 200) {
                        this.institutionalNatures = res.rows;
                        this.loading = false;
                    }
                });
            },
            handleApplianceEditCallback(applianceList) {
                //获取器具信息
                this.applianceUsedList = applianceList;
            },
        }
    };
</script>

<style scoped>
    /*
      右键菜单样式设置
    */
    .right-click-menu {
        position: fixed;
        border: 1px solid #ccc;
        padding: 2px 0;
        background: #fff;
        width: 100px;
        z-index: 9999;
    }

    .right-click-menu li {
        padding: 3px 10px;
        cursor: default;
        font-size: 14px;
        color: #606266;
    }

    .right-click-menu li:hover {
        color: #409eff;
    }

    ul,
    li {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .but-yywtd {
        border: 1px solid #3094e0 !important;
        background: none !important;
        color: #3094e0 !important;
    }

    /*.but-yywtd:hover{background:#3094e0!important;color:#fff!important;}*/
    .but-tmdy {
        border: 1px solid #67c23a !important;
        background: none !important;
        color: #67c23a !important;
    }

    .but-tmdy:hover {
        background: #67c23a !important;
        color: #fff !important;
    }

    .but-qk {
        background: none !important;
        color: #f56c6c !important;
        border-color: #f56c6c !important;
    }

    /*.but-qk:hover{background: #f56c6c!important; color:#fff!important;}*/

    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
        float: right;
        cursor: pointer;
    }

    .shuoming::after {
        content: "";
        position: absolute;
        z-index: 999;
    }

    .el-sm {
        background: #ffffff;
        position: absolute;
        z-index: 999;
        -webkit-box-shadow: 1px 7px 33px -9px #969696;
        box-shadow: 1px 7px 33px -9px #969696;
        border: 1px solid #56bc4e8c;
        border-radius: 5px;
        color: dimgrey;
        margin-left: -345px;
        margin-right: 15px;
        word-break: break-all;
        margin-top: 5px;
        padding: 4px 5px;
        font-size: 14px;
        opacity: 50;
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    @media screen and (max-width: 1500px) {
        .entrust-small {
            width: 50% !important;
        }
    }
</style>
