/*json数据
* sqlSeg      数据库依据查询语句
* name        字段中文名称
* nameCode    字段英文名称
* component   组件类型 input输入框 date日期选择框  select下拉框
* comparison  比较项  0  ["like", "包含"],1  ["=", "等于"],2  [">", "大于"],3  ["<", "小于"],4  ["<>", "不等于"],5  [">=", "大于等于"],
*                     6  ["<=", "小于等于"],7  ["not like", "不包含"],8  ["is null", "为空"],9  ["is not null", "不为空"]
* isSpecial   是否为特殊字段标识
* dateFormat  component为date类型时的日期格式
* ajaxUrl     component为select类型时的数据来源
* purpose     用途 0既是检索项也是查询结果 1仅用作检索项 2仅用作查询结果
* */


let paramJson = [
  {sqlSeg:'c.COMPANY_NAME',name:'单位名称',nameCode:'companyName',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryConditionDefault:1},
  {sqlSeg:'c.COMPANY_NAME_EN',name:'单位名称(英文)',nameCode:'companyNameEn',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.ADDRESS',name:'地址',nameCode:'address',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isSort:1},
  {sqlSeg:'c.ADDRESS_EN',name:'地址(英文)',nameCode:'addressEn',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.CERTIFICATE_COMPANYNAME',name:'证书单位名称',nameCode:'certificateCompanyName',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.SCENETESTING_ADDRESS',name:'现场检测地址',nameCode:'sceneTestingAddress',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.MOBILE_PHONE',name:'手机号码',nameCode:'mobilePhone',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.COMPANY_DEPART',name:'客户对接部',nameCode:'companyDepart',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.COMPANY_CHARGE',name:'客户负责人',nameCode:'companyCharge',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.CREDIT_CODE',name:'统一社会信用代码',nameCode:'creditCode',component:'input',comparison:'0,1',isQueryCondition:1,isTableDefault:1},
  {sqlSeg:'c.CONTACTER',name:'客户联系人',nameCode:'contacter',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'c.COMPANY_TYPE',name:'单位类别',nameCode:'companyType',component:'select',comparison:'1,4',isQueryCondition:1,options:[{remark:'第一类别',code:1},{remark:'第二类别',code:2},{remark:'第三类别',code:3},{remark:'第四类别',code:4},{remark:'第五类别',code:5},{remark:'第六类别',code:6}],isTableDefault:1,isSort:1},
  {sqlSeg:'c.BUSINESS_GROUP',name:'业务组',nameCode:'businessGroup',component:'select',comparison:'1,4',ajaxUrl:'/back/businessStaff/getBusinessGroupName',isQueryCondition:1,toRex:{code:'businessGroup',remark:'businessGroupName'},isTableDefault:1,isSort:1},
  {sqlSeg:'SUSER.USER_NAME',name:'业务员',nameCode:'businessStaff',component:'input',comparison:'0,1',isQueryCondition:1,isTableDefault:1},
  {sqlSeg:'c.TELEPHONE',name:'联系电话',nameCode:'telephone',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.FAX',name:'传真',nameCode:'fax',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.EMAIL',name:'邮箱',nameCode:'email',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.POST_CODE',name:'邮编',nameCode:'postCode',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.CERTIFICATE_REQUIREMENT',name:'证书要求',nameCode:'certificateRequirement',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.VISIT_SPECIAL_REQUIREMENT',name:'上门特殊要求',nameCode:'visitSpecialRequirement',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.SPECIAL_CERTIFICATE_REQUIRE',name:'证书特殊要求',nameCode:'specialCertificateRequire',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.OTHER_SPECIAL_REQUIREMENT',name:'其他特殊要求',nameCode:'otherSpecialRequirement',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.BUSINESS_PROMOTION',name:'业务提成(%)',nameCode:'businessPromotion',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.CONTRACT_REMARK',name:'备注',nameCode:'contractRemark',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.INVOICE_COMPANY',name:'名称',nameCode:'invoiceCompany',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.TAX_NO',name:'纳税人识别号',nameCode:'taxNo',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.INVOICE_ADDRESS_TEL',name:'地址、电话',nameCode:'invoiceAddressTel',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.ACCOUNT_BANK_NO',name:'开户行及账号',nameCode:'accountBankNo',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.CONTRACT_NO',name:'合同号',nameCode:'contractNo',component:'input',comparison:'0,1',isQueryCondition:1,isTableDefault:1,isSort:1},
  {sqlSeg:'c.CONTRACT_DISCOUNT',name:'合同折扣',nameCode:'contractDiscount',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.CONTRACT_VALIDATE_BEGIN',name:'合同有效期开始日期',nameCode:'contractValidateBegin',component:'date',comparison:'1',isQueryResult:1,isSort:1},
  {sqlSeg:'c.CONTRACT_VALIDATE_END',name:'合同有效期结束日期',nameCode:'contractValidateEnd',component:'date',comparison:'1',isQueryResult:1,isSort:1},
  {sqlSeg:'c.CONTRACT_SIGNATORY',name:'合同签署人',nameCode:'contractSignatory',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.CONTRACT_SIGN_DATE',name:'合同签署日期',nameCode:'contractSignDate',component:'date',comparison:'1',isQueryResult:1},
  // {sqlSeg:'c.CONTRACT_REMARK',name:'合同备注',nameCode:'contractRemark',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {name:'行政区域',nameCode:'region',isQueryResult:1},
  {sqlSeg:'c.ADD_TIME',name:'添加时间',nameCode:'addTime',component:'date',comparison:'1,2,3',isQueryResult:1,isSort:1,isSortDefault:1},
  {sqlSeg:'c.AUDITOR_NAME',name:'审核人',nameCode:'auditorName',component:'input',comparison:'0,1',isQueryResult:1,isSort:1},
  {sqlSeg:'c.ADD_USER',name:'添加人',nameCode:'addUser',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isSort:1},
  {sqlSeg:'c.AUDIT_TIME',name:'审核时间',nameCode:'auditTime',component:'date',comparison:'1',isQueryResult:1,isSort:1},
];
export default paramJson
