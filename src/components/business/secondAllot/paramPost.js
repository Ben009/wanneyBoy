/* json数据
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

let dateComparison = '1,2,3,5,6', inputComparsion = '0,1,2,3,4,5,6,7,8,9', selectComparison = '1,4';
let yesOrNoOption = [{remark: '是', code: 1}, {remark: '否', code: 0}]
let detectionMethodOption = [{remark: '送检', code: 1}, {remark: '上门', code: 0}]
let institutionalNatureOption = [{remark: '系统外', code: '系统外'}, {remark: '系统内', code: '系统内'}, {remark: '内传', code: '内传'}]

let paramJson = [
  {
    sqlSeg: 'sjd.REGISTRATION_NO',
    name: '登记号',
    nameCode: 'registrationNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryConditionDefault: 1,
    isQueryResult: 1,
    isSort: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'wtd.ORDER_NO',
    name: '委托单号',
    nameCode: 'orderNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'wtd.COMPANY_NAME',
    name: '委托单位',
    nameCode: 'companyName',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },

  {
    sqlSeg: 'wtd.CERTIFICATE_COMPANY_NAME',
    name: '证书单位',
    nameCode: 'certificateCompanyName',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'sjd.APPLIANCE_NAME',
    name: '器具名称',
    nameCode: 'applianceName',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },

  {
    sqlSeg: 'p.POST_NAME',
    name: '检测岗位',
    nameCode: 'postName',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },


  {
    sqlSeg: 'sjd.IS_COMPULSORY_VERIFY',
    name: '是否强检',
    nameCode: 'isCompulsoryVerify',
    component: 'select',
    comparison: selectComparison,
    options: yesOrNoOption,
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1
  },

  {
    sqlSeg: 'sjd.ORDER_SINGLE_NO',
    name: '流转单号',
    nameCode: 'orderSingleNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'sjd.SET_NUMBER',
    name: '套数',
    nameCode: 'setNumber',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },

  {
    sqlSeg: 'sjd.PIECE_NUMBER',
    name: '套/件',
    nameCode: 'pieceNumber',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'sjd.CERTIFICATE_NUMBER',
    name: '证书数量',
    nameCode: 'certificateNumber',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'sjd.IS_URGENT',
    name: '是否加急',
    nameCode: 'isUrgent',
    component: 'select',
    comparison: selectComparison,
    options: yesOrNoOption,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },

  {
    sqlSeg: 'sjd.certificate_type',
    name: '服务类型',
    nameCode: 'certificateType',
    component: 'select',
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    ajaxUrl: '/njmind/findParam/certificateType'
  },

  {
    sqlSeg: 'trunc(wtd.SERVICE_DATE)',
    name: '受理日期',
    nameCode: 'serviceDate',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: dateComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },

  {
    sqlSeg: 'trunc(wtd.entrust_date)',
    name: '委托日期',
    nameCode: 'entrustDate',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: dateComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1
  },

  {
    sqlSeg: 'trunc(s.detection_deadline)',
    name: '检测期限',
    nameCode: 'detectionDeadline',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: dateComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },

  {
    sqlSeg: 'g.TOTAL_ACTUAL',
    name: '合计费用',
    nameCode: 'totalActual',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1
  },

  {
    sqlSeg: 'e.CERTIFICATE_WAREHOUSE_NO',
    name: '证书库房',
    nameCode: 'certificateWarehouseNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
  },
  {
    sqlSeg: 'e.SAMPLE_WAREHOUSE_NO',
    name: '样品库房',
    nameCode: 'sampleWarehouseNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1
  },

  {
    sqlSeg: 'wtd.detection_method',
    name: '检测方式',
    nameCode: 'detectionMethod',
    component: 'select',
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    options: detectionMethodOption
  },

  {
    sqlSeg: 'wtd.task_source',
    name: '任务来源',
    nameCode: 'taskSource',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'wtd.institutional_nature',
    name: '机构性质',
    nameCode: 'institutionalNature',
    component: 'select',
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    options: institutionalNatureOption
  },

  {
    sqlSeg: 'wtd.CREDIT_CODE',
    name: '统一社会信用代码',
    nameCode: 'creditCode',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'c.CONTRACT_NO',
    name: '合同号',
    nameCode: 'contractNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'c.CONTRACT_SIGNATORY',
    name: '合同签署人',
    nameCode: 'contractSignatory',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'trunc(sjd.CERTIFICATE_FIRST_PRINT_TIME)',
    name: '证书打印日期',
    nameCode: 'certificateFirstPrintTime',
    component: 'date',
    dateFormat: 'yyyy-MM-dd hh:mi:ss',
    comparison: dateComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
  },

  {
    sqlSeg: 'wtd.address',
    name: '委托单位地址',
    nameCode: 'address',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'wtd.ADMINISTRATIVE_AREA',
    name: '行政区划',
    nameCode: 'administrativeArea',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'wtd.contacter',
    name: '联系人',
    nameCode: 'contacter',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'wtd.telephone',
    name: '联系电话',
    nameCode: 'telephone',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'wtd.mobile_phone',
    name: '手机号码',
    nameCode: 'mobilePhone',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'wtd.special_requirement',
    name: '整单备注',
    nameCode: 'specialRequirement',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'sjd.model',
    name: '型号规格',
    nameCode: 'model',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'sjd.detection_parameter',
    name: '检测参数',
    nameCode: 'detectionParameter',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'sjd.factory_no',
    name: '出厂编号',
    nameCode: 'factoryNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'sjd.equipment_no',
    name: '设备编号',
    nameCode: 'equipmentNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'sjd.manufacturer',
    name: '制造厂商',
    nameCode: 'manufacturer',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'sjd.accessory',
    name: '器具附件',
    nameCode: 'accessory',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'sjd.power_types',
    name: '电源类型',
    nameCode: 'powerTypes',
    component: 'select',
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    ajaxUrl: "/njmind/findParam/powerTypes"
  },

  {
    sqlSeg: 'sjd.is_repair',
    name: '是否调修',
    nameCode: 'isRepair',
    component: 'select',
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    options: yesOrNoOption
  },

  {
    sqlSeg: 'sjd.is_double_number',
    name: '是否双编号',
    nameCode: 'isDoubleNumber',
    component: 'select',
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    options: yesOrNoOption
  },

  {
    sqlSeg: 'sjd.SUBCONTRACT_AREA',
    name: '分包区域',
    nameCode: 'subcontractAreaName',
    component: 'select',
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    ajaxUrl: '/njmind/findParam/subcontractAreas'
  },

  {
    sqlSeg: 'sjd.remark',
    name: '备注',
    nameCode: 'remark',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },


  {
    sqlSeg: 'sjd.appliance_use',
    name: '器具用途',
    nameCode: 'applianceUe',
    component: 'select',
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    ajaxUrl: '/njmind/findParam/applianceUse'
  },

  {
    sqlSeg: 'sjd.APPLIANCE_WAREHOUSE_FLAG',
    name: '样品是否入库',
    nameCode: 'applianceWarehouseFlag',
    component: 'select',
    comparison: selectComparison,
    options: yesOrNoOption,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'sjd.CERTIFICATE_WAREHOUSE_FLAG',
    name: '证书是否入库',
    nameCode: 'certificateWarehouseFlag',
    component: 'select',
    comparison: selectComparison,
    options: yesOrNoOption,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'sjd.RETURN_FLAG',
    name: '异常状态',
    nameCode: 'returnFlag',
    component: 'select',
    comparison: selectComparison,
    options: yesOrNoOption,
    isQueryCondition: 1,
    isSpecial: 1
  },
  {
    sqlSeg: 'sjd.CERTIFICATE_COUNT',
    name: '是否已出证',
    nameCode: 'certificateCount',
    component: 'select',
    comparison: selectComparison,
    options: yesOrNoOption,
    isQueryCondition: 1,
    isSpecial: 1
  }
]
export default paramJson
