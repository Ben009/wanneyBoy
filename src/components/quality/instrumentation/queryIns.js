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
* isSort      是否排序 1是 0否    （可不配置此字段，默认为否）
*
* isQueryConditionDefault  查询条件未设置时的默认值     1是 0否  （可不配置此字段，默认为否）
* isSortDefault   排序未设置时的默认值    1是 0否  （可不配置此字段，默认为否）
* isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
* isSpecial   是否为特殊处理字段，后台不进行sql拼接，使用场景比如not exist其它表数据时   1是 0否   （可不配置此字段，默认为否）
* */


// 1、查询条件、查询结果按基本信息页面从上往下，全部带过来（含溯源信息所有字段）；

// 设备名称* instrumentationName  设备名称(英) instrumentationNameE  型号规格* model  测量范围* mearsuringRange  出厂编号* manufacturingCode
// 制造厂家 manufacturer 设备编号* deviceNumber  使用条件 servicesCondition  准确度等级 accuracyClass  所属部门*(select) department
// 保管人 keeper  准确度等级(英) accuracyClassE  购入单位 supplier 单位 unit  购入日期(date) purchaseDate
//  数量 quantity  金额 money  发票号 invoice  存放地点 location  产权单位  propertyUnit
// 经办人 operator 验收人 accepter  设备类别(select) type  设备类型 modelType 设备状态*(select) status
// 是否固定资产(是/否) isAssets   资产编号 assetsNo  确认方式(select) confirmedWay  设备能力确认(是/否) isCapacityConfirme  是否标物/标样(是/否) isSubjectMatter
// 所属认可项目号 itemNo 所属认可项目名称 itemName  溯源方式* traceWay 是否授权使用(是/否) isAuthorization 仪器说明书编号 instructionsNo
// 维护项目 maintenanceItem 维护周期(月) maintenanceCycle  是否监控使用记录(是/否) isMonitorUse  控制措施 controlMeasures 备注 bz

// 2、默认查询结果：同上，但下方字段默认；
// 设备名称、型号规格、测量范围、出厂编号、设备编号、归属部门、有效日期(?)、设备状态、溯源方式

// 3、排序字段：
// 设备编号、设备名称、型号规格、出厂编号、证书编号(?)、所属部门、检校机构(?)、
// 设备状态、检校周期(?)、实际检校周期(?)、证书有效期(没有查询结果)、是否固定资产、资产编号、
// 溯源方式、是否核查(?)、核查计划日期(?)、核查报告日期(?)、测量范围、准确度等级
let paramJson = [
  {
    sqlSeg: 'i.INSTRUMENTATION_NAME',
    name: '设备名称',
    nameCode: 'instrumentationName',
    component: 'input',
    comparison: '0,1',
    isSort: 1,
    isSortDefault: 1,
    isQueryCondition: 1,
    isQueryConditionDefault: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'i.MODEL',
    name: '型号规格',
    nameCode: 'model',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isSort: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'i.INSTRUMENTATION_NAME_E',
    name: '设备名称(英)',
    nameCode: 'instrumentationNameE',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.MEARSURING_RANGE',
    name: '测量范围',
    nameCode: 'mearsuringRange',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 'i.MANUFACTURING_CODE',
    name: '出厂编号',
    nameCode: 'manufacturingCode',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 'i.MANUFACTURER',
    name: '制造厂家',
    nameCode: 'manufacturer',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.DEVICE_NUMBER',
    name: '设备编号',
    nameCode: 'deviceNumber',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 'i.SERVICES_CONDITION',
    name: '使用条件',
    nameCode: 'servicesCondition',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.ACCURACY_CLASS',
    name: '准确度等级',
    nameCode: 'accuracyClass',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1
  },
  {
    sqlSeg: 'i.DEPARTMENT',
    name: '所属部门',
    nameCode: 'departName',
    component: 'select',
    comparison: '1,4',
    isQueryCondition: 1,
    isQueryResult: 1,
    ajaxUrl: '/njmind/findParam/departmentList',
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 'u1.USER_NAME',
    name: '保管人',
    nameCode: 'keeperName',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.ACCURACY_CLASS_E',
    name: '准确度等级(英)',
    nameCode: 'accuracyClassE',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.SUPPLIER',
    name: '购入单位',
    nameCode: 'supplier',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.UNIT',
    name: '单位',
    nameCode: 'unit',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'trunc(i.PURCHASE_DATE)',
    name: '购入日期',
    nameCode: 'purchaseDate',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.QUANTITY',
    name: '数量',
    nameCode: 'quantity',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.MONEY',
    name: '金额',
    nameCode: 'money',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.INVOICE',
    name: '发票号',
    nameCode: 'invoice',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.LOCATION',
    name: '存放地点',
    nameCode: 'location',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.PROPERTY_UNIT',
    name: '产权单位',
    nameCode: 'propertyUnit',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.OPERATOR',
    name: '经办人',
    nameCode: 'operator',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.ACCEPTER',
    name: '验收人',
    nameCode: 'accepter',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.TYPE',
    name: '设备类别',
    nameCode: 'type',
    component: 'select',
    comparison: '1,4',
    ajaxUrl: "/njmind/findParam/instrumentationtype",
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.MODEL_TYPE',
    name: '设备类型',
    nameCode: 'modelType',
    component: 'select',
    comparison: '1,4',
    ajaxUrl:'/njmind/findParam/instrumentationmodelType',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.STATUS',
    name: '设备状态',
    nameCode: 'status',
    component: 'select',
    ajaxUrl: "/njmind/findParam/instrumentationStatus",
    comparison: '1,4',
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 'i.IS_ASSETS',
    name: '是否固定资产',
    nameCode: 'isAssets',
    component: 'select',
    comparison: '1',
    options: [{code: 1, remark: '是'}, {code: 0, remark: '否'}],
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1
  },
  {
    sqlSeg: 'i.IS_SUBJECT_MATTER',
    name: '是否标物/标样',
    nameCode: 'isSubjectMatter',
    component: 'select',
    comparison: '1',
    options: [{code: 1, remark: '是'}, {code: 0, remark: '否'}],
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.IS_CAPACITY_CONFIRME',
    name: '设备能力确认',
    nameCode: 'isCapacityConfirme',
    component: 'select',
    comparison: '1',
    options: [{code: 1, remark: '是'}, {code: 0, remark: '否'}],
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.IS_AUTHORIZATION',
    name: '是否授权使用',
    nameCode: 'isAuthorization',
    component: 'select',
    comparison: '1',
    options: [{code: 1, remark: '是'}, {code: 0, remark: '否'}],
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.IS_MONITOR_USE',
    name: '是否监控使用记录',
    nameCode: 'isMonitorUse',
    component: 'select',
    comparison: '1',
    options: [{code: 1, remark: '是'}, {code: 0, remark: '否'}],
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.ASSETS_NO',
    name: '资产编号',
    nameCode: 'assetsNo',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1
  },
  {
    sqlSeg: 'i.CONFIME_WAY',
    name: '确认方式',
    nameCode: 'confirmedWay',
    component: 'select',
    comparison: '1,4',
    ajaxUrl: "/njmind/findParam/confirmedWay",
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.ITEM_NO',
    name: '所属认可项目号',
    nameCode: 'itemNo',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.ITEM_NAME',
    name: '所属认可项目名称',
    nameCode: 'itemName',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.TRACE_WAY',
    name: '溯源方式',
    nameCode: 'traceWay',
    component: 'select',
    comparison: '1,4',
    ajaxUrl: "/njmind/findParam/instrumentationtraceWay",
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 'i.INSTRUCTION_NO',
    name: '仪器说明书编号',
    nameCode: 'instructionsNo',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.MAINTEANCE_ITEM',
    name: '维护项目',
    nameCode: 'maintenanceItem',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.MAINTENANCE_CYCLE',
    name: '维护周期(月)',
    nameCode: 'maintenanceCycle',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.CONTROL_MEASURES',
    name: '控制措施',
    nameCode: 'controlMeasures',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.BZ',
    name: '备注',
    nameCode: 'bz',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  // 页面上以下的数据
  {
    sqlSeg: 'trunc(AUD.CALIBRATION_DATE)',
    name: '实际检校日期',
    nameCode: 'calibrationDate',
    dateFormat: 'yyyy-MM-dd',
    component: 'date',
    comparison: '1,2,3,4,5,6',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'trunc(AUD.SCHEDULE_DATE)',
    name: '计划检校日期',
    nameCode: 'scheduleDate',
    dateFormat: 'yyyy-MM-dd',
    component: 'date',
    comparison: '1,2,3,4,5,6',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  // 证书有效期在页面上是跳转进来后在mounted中自动判断
  {
    sqlSeg: 'trunc(AUD.EFFECTIVE_DATE)',
    name: '证书有效期',
    nameCode: 'effectiveDate',
    dateFormat: 'yyyy-MM-dd',
    component: 'date',
    comparison: '1,2,3',
    isQueryCondition: 1,
    isSort: 1,
    isQueryResult:1,
  }
];

export default paramJson
