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


// 以溯源确认表结构为基本；仅列出：类型为模式一的记录；
// 高级查询及条件
// 设备名称、型号规格、测量范围、出厂编号、设备编号、归属部门、有效日期、设备状态、溯源方式、保管人、审核意见、审核人、加入人、加入时间、
// 默认结果：设备名称 出厂编号、设备编号、归属部门、有效日期、设备状态、溯源方式 审核意见、审核人
// 排序：
// 加入时间、审核时间、审核意见、所属部门
// 有权限查所有；无权限查本部门

// 缺失 有效日期 审核意见 审核人、加入人、加入时间
//
let paramJson = [{
    sqlSeg: 't.INSTRUMENTATION_NAME',
    name: '设备名称',
    nameCode: 'instrumentationName',
    component: 'input',
    comparison: '0,1',
    isSortDefault: 1,
    isQueryCondition: 1,
    isQueryConditionDefault: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 't.MODEL',
    name: '型号规格',
    nameCode: 'model',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
  },
  {
    sqlSeg: 't.MEARSURING_RANGE',
    name: '测量范围',
    nameCode: 'mearsuringRange',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
  },
  {
    sqlSeg: 't.MANUFACTURING_CODE',
    name: '出厂编号',
    nameCode: 'manufacturingCode',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
  },
  {
    sqlSeg: 't.DEVICE_NUMBER',
    name: '设备编号',
    nameCode: 'deviceNumber',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
  },
  {
    sqlSeg: 't.DEPARTMENT',
    name: '所属部门',
    nameCode: 'departName',
    component: 'select',
    comparison: '1,4',
    isQueryCondition: 1,
    isQueryResult: 1,
    ajaxUrl: '/njmind/findParam/departmentList',
  },
  {
    sqlSeg: 't.STATUS',
    name: '设备状态',
    nameCode: 'status',
    component: 'select',
    ajaxUrl: "/njmind/findParam/instrumentationStatus",
    comparison: '1,4',
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
  },
  {
    sqlSeg: 't.TRACE_WAY',
    name: '溯源方式',
    nameCode: 'traceWay',
    component: 'select',
    comparison: '1,4',
    ajaxUrl: "/njmind/findParam/instrumentationtraceWay",
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
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
    sqlSeg: 'i.EFFECTIVE_DATE',
    name: '有效日期',
    nameCode: 'effectiveDate',
    component: 'date',
    comparison: '1,2,3',
    dateFormat: 'yyyy-MM-dd',
    isQueryResult: 1,
    isQueryCondition: 1,
    isTableDefault: 1,
    isSort: 1,
    isSortDefault: 1
  },
  {
    sqlSeg: 'i.DEPARTMENT_REVIEW_ADVISE',
    name: '审核意见',
    nameCode: 'departmentReviewAdvise',
    component: 'input',
    comparison: '0,1',
    isQueryResult: 1,
    isQueryCondition: 1,
    isSort: 1,
  },
  {
    sqlSeg: 'u2.user_name',
    name: '审核人',
    nameCode: 'reviewerName',
    component: 'input',
    comparison: '0,1',
    isQueryResult: 1,
    isQueryCondition: 1,
    isSort: 1,
  },
  {
    sqlSeg: 'u3.user_name',
    name: '加入人',
    nameCode: 'addUserName',
    component: 'input',
    comparison: '0,1',
    isQueryResult: 1,
    isQueryCondition: 1,
    isSort: 1
  },
  {
    sqlSeg: 'trunc(i.ADD_TIME)',
    name: '加入时间',
    nameCode: 'addTime',
    component: 'date',
    comparison: '1,2,3',
    dateFormat: 'yyyy-MM-dd',
    isQueryResult: 1,
    isQueryCondition: 1,
    isSort: 1
  },
  // { sqlSeg: 'a.plan_item', name: '计划项目', nameCode: 'planItem', component: 'input', comparison: '0,1', isQueryCondition: 1, isQueryResult: 1 },
  // { sqlSeg: 'q.instrumentation_name', name: '设备名称', nameCode: 'instrumentation.instrumentationName', component: 'input', comparison: '0,1', isQueryCondition: 1, isQueryResult: 1 },
  // { sqlSeg: 'q.department', name: '所属部门', nameCode: 'departName', component: 'select', comparison: '1,4', ajaxUrl: '/njmind/findParam/departmentList', isQueryCondition: 1 },
  // { sqlSeg: 'q.device_number', name: '设备编号', nameCode: 'instrumentation.deviceNumber', component: 'input', comparison: '0,1', isQueryCondition: 1, isQueryResult: 1 },
  // { sqlSeg: 'q.model', name: '型号规格', nameCode: 'instrumentation.model', component: 'input', comparison: '0,1', isQueryCondition: 1, isQueryResult: 1 },
  // { sqlSeg: 'q.MANUFACTURING_CODE', name: '出厂编号', nameCode: 'instrumentation.manufacturingCode', component: 'input', comparison: '0,1', isQueryCondition: 1, isQueryResult: 1 },
  // { sqlSeg: 'q.Calibration_Date', name: '实际检校日期', nameCode: 'instrumentation.calibrationDate', dateFormat: 'yyyy-MM-dd', component: 'date', comparison: '1,2,3,4,5,6', isQueryCondition: 1 },
  // { sqlSeg: 'q.Effective_Date', name: '有效期', nameCode: 'instrumentation.effectiveDate', dateFormat: 'yyyy-MM-dd', component: 'date', comparison: '1,2,3,4,5,6', isQueryCondition: 1 },
  // { sqlSeg: 'tra.send_date', name: '预计外送日期', nameCode: 'sendDate', dateFormat: 'yyyy-MM-dd', component: 'date', comparison: '1,2,3,4,5,6', isQueryCondition: 1, isQueryResult: 1 },
  // { sqlSeg: 'tra.return_date', name: '预计返库日期', nameCode: 'returnDate', dateFormat: 'yyyy-MM-dd', component: 'date', comparison: '1,2,3,4,5,6', isQueryCondition: 1, isQueryResult: 1 },
];

export default paramJson
