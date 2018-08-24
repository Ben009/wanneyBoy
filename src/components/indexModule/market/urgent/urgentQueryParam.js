let dateComparison='1,2,3,5,6',inputComparsion='0,1,2,3,4,5,6,7,8,9',selectComparison='1,4';
let yesOrNoOption=[{remark:'是',code:1},{remark:'否',code:0}];
let isLocale=[{remark:'是',code:0},{remark:'否',code:1}];
let cetificateStatus=[{remark:'出证中',code:'0'},{remark:'待检定',code:'1'},
    {remark:'待核验',code:'2'},{remark:'待批准',code:'3'}];
let detectionMethodOption=[{remark:'送检',code:1},{remark:'上门',code:0}];
let institutionalNatureOption=[{remark:'系统外',code:'系统外'},{remark:'系统内',code:'系统内'},{remark:'内传',code:'内传'}]
let discountTypeOption=[{remark:'打折',code:0},{remark:'总收',code:1}]
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
  {isSpecial:0, sqlSeg:'sjd.registration_no',name:'登记号',nameCode:'registrationNo',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isQueryConditionDefault:1,isTableDefault:1,isSort:1},
  {isSpecial:0, sqlSeg:'wtd.order_no',name:'委托单编号',nameCode:'orderNo',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isSort:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'wtd.company_name', name: '委托单位', nameCode: 'companyName', component: 'input', comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'sjd.appliance_name', name: '器具名称', nameCode: 'applianceName', component: 'input', comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'sjd.appliance_actual_name', name: '器具实际名称', nameCode: 'applianceActualName', component: 'input', comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'trunc(wtd.entrust_date)',name:'委托日期',nameCode:'entrustDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1, isSort: 1},
  {isSpecial:0, sqlSeg:'sjd.fee_status',name:'是否录费',nameCode:'feeStatus',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  {isSpecial:1, sqlSeg:'certificate',name:'证书状态',nameCode:'certificateStatus',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:cetificateStatus},
  {isSpecial:1, sqlSeg:'isException',name:'是否异常',nameCode:'isException',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:yesOrNoOption},
  {isSpecial:0, sqlSeg:'house.sample_warehouse_no',name:'样品库房',nameCode:'sampleRoom',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {isSpecial:0, sqlSeg:'house.certificate_warehouse_no',name:'证书库房',nameCode:'certificateRoom',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {isSpecial:0, sqlSeg:'wtd.detection_method',name:'是否现场',nameCode:'isLocale',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,isTableDefault:1,options:isLocale},
  {isSpecial:0, sqlSeg:'wtd.contacter',name:'联系人',nameCode:'contact',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {isSpecial:0, sqlSeg: 'sjd.depart_id', name: '检测部门', nameCode: 'departName', component: 'select', comparison:selectComparison,ajaxUrl:'/njmind/findParam/departmentList',isQueryCondition:1,isQueryResult:1,isTableDefault:1,isSort:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg: 'pst.post_name', name: '检测岗位', nameCode: 'postName', component: 'input', comparison:inputComparsion,isQueryCondition:0,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'sjd.order_single_no',name:'流转单号',nameCode:'orderSingleNo',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg: 'sjd.set_number', name: '套数', nameCode: 'setNumber', component: 'input', comparison:inputComparsion,isQueryCondition:0,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'sjd.piece_number',name:'件/套',nameCode:'pieceNumber',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:0},
  {isSpecial:0, sqlSeg:'sjd.certificate_number',name:'证书数量',nameCode:'certificateNumber',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:0},
  {isSpecial:0, sqlSeg:'trunc(wtd.service_date)',name:'受理日期',nameCode:'serviceDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:0,isQueryResult:1,isTableDefault:1,isSort: 1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'trunc(sjd.detection_deadline)',name:'检测期限',nameCode:'detectionDeadline',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:0,isQueryResult:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'trunc(sjd.settlement_date)',name:'结算日期',nameCode:'settlementDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'trunc(sjd.settle_accounts_date)',name:'结账日期',nameCode:'settleAccountsDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:0,isQueryResult:1,isTableDefault:1,isSort:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'charge.total_actual',name:'费用合计',nameCode:'totalActual',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'charge.jdf_actual',name:'检测费',nameCode:'jdfActual',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'sjd.certificate_type',name:'服务类型',nameCode:'certificateType',component:'select',comparison:selectComparison,isQueryCondition:0,isQueryResult:1,ajaxUrl:'/njmind/findParam/certificateType'},
  {isSpecial:0, sqlSeg:'charge.fjf_actual',name:'附加费',nameCode:'fjfActual',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'charge.xlf_actual',name:'修理费',nameCode:'xlfActual',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'charge.jjf_actual',name:'加急费',nameCode:'jjfActual',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'charge.fwf_actual',name:'服务费',nameCode:'fwfActual',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'charge.qtf_actual',name:'其他费',nameCode:'qtfActual',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'charge.workload_actual',name:'工作量',nameCode:'workloadActual',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'charge.intensive_workload_actual',name:'强检工作量',nameCode:'intensiveWorkloadActual',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'trunc(sjd.finish_date)',name:'完成日期',nameCode:'finishDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:0,isQueryResult:1,isTableDefault:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'charge.discount',name:'折扣',nameCode:'discount',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'wtd.detection_method',name:'检测方式',nameCode:'detectionMethod',component:'select',comparison:selectComparison,isQueryCondition:0,isQueryResult:0,options:detectionMethodOption},
  {isSpecial:0, sqlSeg:'wtd.task_source',name:'任务来源',nameCode:'taskSource',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'wtd.institutional_nature',name:'机构性质',nameCode:'institutionalNature',component:'select',comparison:selectComparison,isQueryCondition:0,isQueryResult:1,options:institutionalNatureOption},
  {isSpecial:0, sqlSeg:'wtd.credit_code',name:'统一社会信用代码',nameCode:'creditCode',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'wtd.CONTRACT_NO',name:'合同号',nameCode:'contractNo',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'con_usr.user_name',name:'合同签署人',nameCode:'contractSignatory',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'trunc(sjd.CERTIFICATE_FIRST_PRINT_TIME)',name:'证书打印日期',nameCode:'certificateFirstPrintTime',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:0,isQueryResult:1,options:discountTypeOption,isTableDefault:1,isQueryConditionDefault1:1},
  {isSpecial:0, sqlSeg:'wtd.address',name:'委托单位地址',nameCode:'address',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'wtd.ADMINISTRATIVE_AREA',name:'行政区划',nameCode:'administrativeArea',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'wtd.telephone',name:'联系电话',nameCode:'telephone',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'wtd.mobile_phone',name:'手机号码',nameCode:'mobilePhone',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'wtd.special_requirement',name:'整单备注',nameCode:'specialRequirement',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'sjd.model',name:'型号规格',nameCode:'model',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'sjd.detection_parameter',name:'检测参数',nameCode:'detectionParameter',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'sjd.factory_no',name:'出厂编号',nameCode:'factoryNo',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'sjd.equipment_no',name:'设备编号',nameCode:'equipmentNo',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'sjd.manufacturer',name:'制造厂商',nameCode:'manufacturer',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'sjd.accessory',name:'器具附件',nameCode:'accessory',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'powerdict.code',name:'电源类型',nameCode:'powerTypess',component:'select',comparison:selectComparison,isQueryCondition:0,isQueryResult:1,ajaxUrl:'/njmind/findParam/powerTypes'},
  {isSpecial:0, sqlSeg:'repairdict.code',name:'是否调修',nameCode:'isRepairs',component:'select',comparison:selectComparison,isQueryCondition:0,isQueryResult:1,ajaxUrl:'/njmind/findParam/isRepair'},
  {isSpecial:0, sqlSeg:'sjd.is_double_number',name:'是否双编号',nameCode:'isDoubleNumbers',component:'select',comparison:selectComparison,isQueryCondition:0,isQueryResult:1,options:yesOrNoOption},
  {isSpecial:0, sqlSeg:'sjd.SUBCONTRACT_AREA',name:'分包区域',nameCode:'subcontractAreaName',component:'select',comparison:selectComparison,isQueryCondition:0,isQueryResult:1,ajaxUrl:'/njmind/findParam/subcontractAreas'},
  {isSpecial:0, sqlSeg:'sjd.remark',name:'备注',nameCode:'remark',component:'input',comparison:inputComparsion,isQueryCondition:0,isQueryResult:1},
  {isSpecial:0, sqlSeg:'sjd.is_compulsory_verify',name:'是否强检',nameCode:'isCompulsoryVerifys',component:'select',comparison:selectComparison,isQueryCondition:0,isQueryResult:1,options:yesOrNoOption},
  {isSpecial:0, sqlSeg:'sjd.appliance_use',name:'器具用途',nameCode:'applianceUse',component:'select',comparison:selectComparison,isQueryCondition:0,isQueryResult:1,ajaxUrl:'/njmind/findParam/applianceUse'},

];
export default entrustWtdListParam
