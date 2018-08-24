let dateComparison='1,2,3,5,6',inputComparsion='0,1,2,3,4,5,6,7,8,9',selectComparison='1,4';
let yesOrNoOption=[{remark:'是',code:1},{remark:'否',code:0}]
let detectionMethodOption=[{remark:'送检',code:1},{remark:'上门',code:0}]
let institutionalNatureOption=[{remark:'系统外',code:'系统外'},{remark:'系统内',code:'系统内'},{remark:'内传',code:'内传'}]
let discountTypeOption=[{remark:'打折',code:0},{remark:'总收',code:1}]
let chargeTypeOption=[{remark:'整单收费',code:0},{remark:'样品收费',code:1}]
/*json数据
* sqlSeg      数据库sql查询结果字段
* name        字段中文名称
* nameCode    字段英文名称
* component   组件类型 input输入框 date日期选择框  select下拉框
* comparison  比较项  0  ["like", "包含"],1  ["=", "等于"],2  [">", "大于"],3  ["<", "小于"],4  ["<>", "不等于"],5  [">=", "大于等于"],
*                     6  ["<=", "小于等于"],7  ["not like", "不包含"],8  ["is null", "为空"],9  ["is not null", "不为空"]
* dateFormat  component为date类型时的日期格式
* ajaxUrl     component为select类型时的数据来源
* isQueryCondition 是否查询条件 1是 0否   （可不配置此字段，默认为否）
* isQueryResult  是否查询结果  1是 0否  （可不配置此字段，默认为否）
* isSort      是否排序字段 1是 0否    （可不配置此字段，默认为否）
*
* isQueryConditionDefault  查询条件未设置时的默认值     1是 0否  （可不配置此字段，默认为否）
* isSortDefault   排序未设置时的默认值    1是 0否  （可不配置此字段，默认为否）
* isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
* isSpecial   是否为特殊处理字段，后台不进行sql拼接，使用场景比如not exist其它表数据时   1是 0否   （可不配置此字段，默认为否）
* */
let entrustWtdListParam = [
  {sqlSeg:'sjd.registration_no',name:'登记号',nameCode:'registrationNo',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isQueryConditionDefault:1,isTableDefault:1,isSort:1},
  {sqlSeg:'wtd.order_no',name:'委托单编号',nameCode:'orderNo',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isSort:1,isQueryConditionDefault1:1},
  {sqlSeg: 'wtd.company_name', name: '委托单位', nameCode: 'companyName', component: 'input', comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {sqlSeg: 'nvl(sjd.appliance_actual_name,sjd.appliance_name)', name: '器具名称', nameCode: 'applianceName', component: 'input', comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {sqlSeg: 'sjd.depart_id', name: '检测部门', nameCode: 'departName', component: 'select', comparison:selectComparison,ajaxUrl:'/njmind/findParam/departmentList',isQueryCondition:1,isQueryResult:1,isTableDefault:1,isSort:1,isQueryConditionDefault1:1},
  {sqlSeg: 'pst.post_name', name: '检测岗位', nameCode: 'postName', component: 'input', comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {sqlSeg:'sjd.order_single_no',name:'流转单号',nameCode:'orderSingleNo',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg: 'sjd.set_number', name: '套数', nameCode: 'setNumber', component: 'input', comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {sqlSeg:'sjd.piece_number',name:'件/套',nameCode:'pieceNumber',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'sjd.certificate_number',name:'证书数量',nameCode:'certificateNumber',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'trunc(wtd.service_date)',name:'受理日期',nameCode:'serviceDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isSort: 1,isQueryConditionDefault1:1},
  {sqlSeg:'trunc(wtd.entrust_date)',name:'委托日期',nameCode:'entrustDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1, isSort: 1},
  {sqlSeg:'trunc(sjd.detection_deadline)',name:'检测期限',nameCode:'detectionDeadline',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isQueryConditionDefault1:1},
  {sqlSeg:'trunc(sjd.settlement_date)',name:'结算日期',nameCode:'settlementDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'trunc(sjd.settle_accounts_date)',name:'结账日期',nameCode:'settleAccountsDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isSort:1,isQueryConditionDefault1:1},
  {sqlSeg:'charge.total_actual',name:'费用合计',nameCode:'totalActual',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {sqlSeg:'charge.jdf_actual',name:'检测费',nameCode:'jdfActual',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {sqlSeg:"(sjd.is_urgent||'@@'||sjd.urgent_proportions)",name:'是否加急',nameCode:'isUrgents',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/urgentDays'},
  {sqlSeg:'sjd.certificate_type',name:'服务类型',nameCode:'certificateType',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/certificateType'},
  {sqlSeg:'charge.fjf_actual',name:'附加费',nameCode:'fjfActual',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'charge.xlf_actual',name:'修理费',nameCode:'xlfActual',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'charge.jjf_actual',name:'加急费',nameCode:'jjfActual',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'charge.fwf_actual',name:'服务费',nameCode:'fwfActual',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'charge.qtf_actual',name:'其他费',nameCode:'qtfActual',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'charge.workload_actual',name:'工作量',nameCode:'workloadActual',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'charge.intensive_workload_actual',name:'强检工作量',nameCode:'intensiveWorkloadActual',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'trunc(sjd.finish_date)',name:'完成日期',nameCode:'finishDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {sqlSeg:'charge.discount',name:'折扣',nameCode:'discount',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'wtd.detection_method',name:'检测方式',nameCode:'detectionMethod',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,options:detectionMethodOption},
  {sqlSeg:'wtd.task_source',name:'任务来源',nameCode:'taskSource',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'wtd.institutional_nature',name:'机构性质',nameCode:'institutionalNature',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,options:institutionalNatureOption},
  {sqlSeg:'wtd.credit_code',name:'统一社会信用代码',nameCode:'creditCode',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'wtd.CONTRACT_NO',name:'合同号',nameCode:'contractNo',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'con_usr.user_name',name:'合同签署人',nameCode:'contractSignatory',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'trunc(sjd.CERTIFICATE_FIRST_PRINT_TIME)',name:'证书打印日期',nameCode:'certificateFirstPrintTime',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,options:discountTypeOption,isTableDefault:1,isQueryConditionDefault1:1},
  {sqlSeg:'wtd.address',name:'委托单位地址',nameCode:'address',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'wtd.ADMINISTRATIVE_AREA',name:'行政区划',nameCode:'administrativeArea',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'wtd.contacter',name:'联系人',nameCode:'contacter',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'wtd.telephone',name:'联系电话',nameCode:'telephone',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'wtd.mobile_phone',name:'手机号码',nameCode:'mobilePhone',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'wtd.special_requirement',name:'整单备注',nameCode:'specialRequirement',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'sjd.model',name:'型号规格',nameCode:'model',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'sjd.detection_parameter',name:'检测参数',nameCode:'detectionParameter',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'sjd.factory_no',name:'出厂编号',nameCode:'factoryNo',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'sjd.equipment_no',name:'设备编号',nameCode:'equipmentNo',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'sjd.manufacturer',name:'制造厂商',nameCode:'manufacturer',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'sjd.accessory',name:'器具附件',nameCode:'accessory',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'powerdict.code',name:'电源类型',nameCode:'powerTypess',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/powerTypes'},
  {sqlSeg:'repairdict.code',name:'是否调修',nameCode:'isRepairs',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/isRepair'},
  {sqlSeg:'sjd.is_double_number',name:'是否双编号',nameCode:'isDoubleNumbers',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,options:yesOrNoOption},
  {sqlSeg:'sjd.SUBCONTRACT_AREA',name:'分包区域',nameCode:'subcontractAreaName',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/subcontractAreas'},
  {sqlSeg:'sjd.remark',name:'备注',nameCode:'remark',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'sjd.is_compulsory_verify',name:'是否强检',nameCode:'isCompulsoryVerifys',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,options:yesOrNoOption},
  {sqlSeg:'sjd.appliance_use',name:'器具用途',nameCode:'applianceUse',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/applianceUse'},


  // {sqlSeg:'wtd.is_message',name:'是否发送短信',nameCode:'isMessage',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'wtd.free_check',name:'是否免费',nameCode:'freeCheck',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'wtd.is_conclusion',name:'是否出具结论',nameCode:'isConclusion',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'wtd.is_recheck',name:'是否复检',nameCode:'isRecheck',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'wtd.certificate_print_time',name:'要求证书日期',nameCode:'certificatePrintTime',component:'date',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'wtd.certificate_company_name',name:'证书单位名称',nameCode:'certificateCompanyName',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'wtd.certificate_company_address',name:'证书单位地址',nameCode:'certificateCompanyAddress',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'usr.USER_NAME',name:'添加人',nameCode:'addPersonName',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.add_time',name:'添加时间',nameCode:'addTime',component:'date',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isSort:1,isSortDefault:1},
  // {sqlSeg:'sjd.quotation_no',name:'报价单编号',nameCode:'quotationNo',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.is_authorise',name:'是否授权',nameCode:'isAuthorise',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.appearance',name:'器具外观',nameCode:'appearance',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.urgent_proportions',name:'加急比例',nameCode:'urgentProportions',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.executor',name:'执行人',nameCode:'executor',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.executive_confirm_type',name:'执行人确认状态',nameCode:'executiveConfirmType',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.certificate_count',name:'已出证数量',nameCode:'certificateCount',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.original_count',name:'已出原始记录数量',nameCode:'originalCount',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.approve_certificate_count',name:'已完成批准证书数量',nameCode:'approveCertificateCount',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.return_flag',name:'是否有退回',nameCode:'returnFlag',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.delay_flag',name:'是否延期',nameCode:'delayFlag',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.fee_status',name:'是否已录费',nameCode:'feeStatus',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.is_settlement',name:'是否结算',nameCode:'isSettlement',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.is_settle_account',name:'是否结账',nameCode:'isSettleAccount',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.finish_by_hand',name:'是否手工完成',nameCode:'finishByHand',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.finish_flag',name:'是否完成',nameCode:'finishFlag',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.expire_flag',name:'是否超期',nameCode:'expireFlag',component:'select',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.expire_date',name:'超期日期',nameCode:'expireDate',component:'date',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.appliance_warehouse_flag',name:'器具库房状态',nameCode:'applianceWarehouseFlag',component:'select',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.certificate_warehouse_flag',name:'证书库房状态',nameCode:'certificateWarehouseFlag',component:'select',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  // {sqlSeg:'sjd.is_guarantor',name:'是否担保',nameCode:'isGuarantor',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  // {sqlSeg:'sjd.charge_type',name:'收费类型',nameCode:'chargeType',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:chargeTypeOption},
  // {sqlSeg:'sjd.subcontract_fee',name:'分包费',nameCode:'subcontractFee',component:'input',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1},




]
export default entrustWtdListParam
