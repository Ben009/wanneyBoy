/*json数据
* sqlSeg      数据库sql查询结果字段
* name        字段中文名称
* nameCode    字段英文名称
* component   组件类型 input输入框 date日期选择框  select下拉框
* comparison  比较项  0  ["like", "包含"],1  ["=", "等于"],2  [">", "大于"],3  ["<", "小于"],4  ["<>", "不等于"],5  [">=", "大于等于"],
*                     6  ["<=", "小于等于"],7  ["not like", "不包含"],8  ["is  null", "为空"],9  ["is not null", "不为空"]
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

// 1、查询条件
// 设备名称、型号规格、测量范围、出厂编号、设备编号、归属部门、有效日期、登记号、设备状态、溯源方式、保管人、周检类型（自检计划、外送计划）、计划名称、更新状态、加入人、更新人、更新时间、

// 2、查询结果
// 设备名称、型号规格、测量范围、出厂编号、设备编号、归属部门、有效日期、登记号、设备状态、溯源方式、保管人、周检类型（自检计划、外送计划）、计划名称、更新状态、加入人、更新人、更新时间、
// 完成状态（未完成、登记号的完成日期）、加入时间、操作

// 默认查询结果 设备名称 出厂编号、设备编号、归属部门、有效日期、登记号、完成状态（未完成、登记号的完成日期）、设备状态、溯源方式 周检类型 更新状态

// 3、排序：
// 更新状态、出厂编号、设备编号、加入时间

let dateComparison = '1,2,3,5,6', inputComparsion = '0,1,2,3,4,5,6,7,8,9', selectComparison = '1,4';
let paramJson = [
  {
    sqlSeg: 't.instrumentation_name',
    name: '设备名称',
    nameCode: 'instrumentationName',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryConditionDefault: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 't.model',
    name: '型号规格',
    nameCode: 'model',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 't.MEARSURING_RANGE',
    name: '测量范围',
    nameCode: 'mearsuringRange',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 't.MANUFACTURING_CODE',
    name: '出厂编号',
    nameCode: 'manufacturingCode',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 't.DEVICE_NUMBER',
    name: '设备编号',
    nameCode: 'deviceNumber',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 't.DEPARTMENT',
    name: '归属部门',
    nameCode: 'departName',
    component: 'select',
    comparison: selectComparison,
    ajaxUrl: '/njmind/findParam/departmentList',
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'trunc(aud.EFFECTIVE_DATE)',
    name: '有效日期',
    nameCode: 'effectiveDate',
    component: 'date',
    comparison: dateComparison,
    dateFormat: 'yyyy-MM-dd',
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'sjd.registration_no',
    name: '登记号',
    nameCode: 'registrationNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryResult: 1,
    isQueryCondition: 1,
    isTableDefault: 1
  },
  // 设备状态应该是一个select框，由于不知道remark值，因此此处先省略
  {
    sqlSeg: 't.status',
    name: '设备状态',
    nameCode: 'status',
    component: 'select',
    comparison: selectComparison,
    ajaxUrl: "/njmind/findParam/instrumentationStatus",
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 't.TRACE_WAY',
    name: '溯源方式',
    nameCode: 'traceWay',
    component: 'select',
    comparison: selectComparison,
    ajaxUrl: "/njmind/findParam/instrumentationtraceWay",
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'u3.user_name',
    name: '保管人',
    nameCode: 'keeperName',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  // 周检类型的code值不明确
  {
    sqlSeg: 'd.source',
    name: '周检类型',
    nameCode: 'source',
    component: 'select',
    options: [{code: 0, remark: '自检计划'}, {code: 1, remark: '外送计划'}],
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'tra.plan_item',
    name: '计划名称',
    nameCode: 'planItem',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'd.IS_UPDATE',
    name: '更新状态',
    nameCode: 'isUpdate',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1,
    isSortDefault: 1
  },
  {
    sqlSeg: 'u.user_name',
    name: '加入人',
    nameCode: 'addUserName',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'u2.user_name',
    name: '更新人',
    nameCode: 'updateUserName',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'trunc(d.UPDATE_TIME)',
    name: '更新日期',
    nameCode: 'updateTime',
    component: 'date',
    comparison: dateComparison,
    dateFormat: 'yyyy-MM-dd',
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'd.add_time',
    name: '加入时间',
    nameCode: 'addTime',
    comparison: dateComparison,
    isQueryResult: 1,
    isSort: 1
  },
  {
    name: '完成状态',
    sqlSeg: 'd.IS_FINISH',
    nameCode: 'isFinish',
    component: 'select',
    options: [{code: 0, remark: '未完成'}, {code: 1, remark: '已完成'}],
    comparison: selectComparison,
    isQueryResult: 1,
    isTableDefault: 1
  },


  // { sqlSeg: 'i.INSTRUMENTATION_NAME', name: '仪器设备名称', nameCode: 'instrumentationName', component: 'input', comparison: '0,1', isSort: 1, isSortDefault: 1, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1 },
  // { sqlSeg: 'i.MODEL', name: '型号规格', nameCode: 'model', component: 'input', comparison: '0,1', isQueryCondition: 1, isSort: 1, isQueryResult: 1 },
  // { sqlSeg: 'i.DEVICE_NUMBER', name: '设备编号', nameCode: 'deviceNumber', component: 'input', comparison: '0,1', isQueryCondition: 1, isQueryResult: 1 },
  // { sqlSeg: 'i.MANUFACTURING_CODE', name: '出厂编号', nameCode: 'manufacturingCode', component: 'input', comparison: '0,1', isQueryCondition: 1, isSort: 1, isQueryResult: 1 },
  // { sqlSeg: 'i.DEPARTMENT', name: '所属部门', nameCode: 'department', component: 'select', comparison: '1,4', isQueryCondition: 1, ajaxUrl: '/njmind/findParam/departmentList'},
  // { sqlSeg: 'u1.USER_NAME', name: '保管人', nameCode: 'keeper', component: 'input', comparison: '0,1', isQueryCondition: 1},
  // { sqlSeg: 'i.CALIBRATION_DATE', name: '实际检校日期', nameCode: 'calibrationDate', dateFormat: 'yyyy-MM-dd', component: 'date', comparison: '1,2,3,4,5,6', isQueryCondition: 1, isQueryResult: 1 },
  // { sqlSeg: 'i.SCHEDULE_DATE', name: '计划检校日期', nameCode: 'scheduleDate', dateFormat: 'yyyy-MM-dd', component: 'date', comparison: '1,2,3,4,5,6', isQueryCondition: 1, isQueryResult: 1 },
  // { sqlSeg: 'i.EFFECTIVE_DATE', name: '证书有效期', nameCode: 'effectiveDate', dateFormat: 'yyyy-MM-dd', component: 'date', comparison: '1,2,3,4,5,6', isQueryCondition: 1, isQueryResult: 0}
];


export default paramJson
