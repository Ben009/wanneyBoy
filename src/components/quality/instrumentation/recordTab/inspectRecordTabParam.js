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


//通: 缺少有效日期
//专: 核查日期 examineScheduleDate  核查周期 examineCycle 核查证书日期 certificateDate
//    计划核查日期 nextDate         操作人   updateUser   操作时间     updateTime
let dateComparison = '1,2,3,5,6', inputComparsion = '0,1,2,3,4,5,6,7,8,9', selectComparison = '1,4';
let paramJson = [
  {
    sqlSeg: 'n.INSTRUMENTATION_NAME',
    name: '设备名称',
    nameCode: 'instrumentationName',
    component: 'input',
    comparison: inputComparsion,
    isSort: 1,
    isSortDefault: 1,
    isQueryCondition: 1,
    isQueryConditionDefault: 1,
    isQueryResult: 1,
    isTableDefault: 1
  },
  {
    sqlSeg: 'n.MODEL',
    name: '型号规格',
    nameCode: 'model',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isSort: 1,
    isQueryResult: 1,
  },
  {
    sqlSeg: 'n.MEARSURING_RANGE',
    name: '测量范围',
    nameCode: 'mearsuringRange',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1
  },
  {
    sqlSeg: 'n.MANUFACTURING_CODE',
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
    sqlSeg: 'n.DEVICE_NUMBER',
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
    sqlSeg: 'n.DEPARTMENT',
    name: '所属部门',
    nameCode: 'departName',
    component: 'select',
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    ajaxUrl: '/njmind/findParam/departmentList',
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 'n.STATUS',
    name: '设备状态',
    nameCode: 'status',
    component: 'select',
    ajaxUrl: "/njmind/findParam/instrumentationStatus",
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 'n.TRACE_WAY',
    name: '溯源方式',
    nameCode: 'traceWay',
    component: 'select',
    comparison: selectComparison,
    ajaxUrl: "/njmind/findParam/instrumentationtraceWay",
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault: 1,
    isSort: 1
  },
  {
    sqlSeg: 'u.USER_NAME',
    name: '保管人',
    nameCode: 'userName',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1
  },

  {
    sqlSeg: 'i.EXAMINE_WAY',
    name: '核查方法',
    nameCode: 'examineWay',
    component: 'select',
    comparison: selectComparison,
    ajaxUrl: "/njmind/findParam/instrumentationtraceWay",
    isQueryResult: 1,
    isTableDefault: 1,
    isQueryCondition: 1
  },
  {
    sqlSeg: 'trunc(i.EXAMINE_SCHEDULE_DATE)',
    name: '核查日期',
    nameCode: 'examineScheduleDate',
    component: 'date',
    comparison: dateComparison,
    dateFormat: 'yyyy-MM-dd',
    isQueryResult: 1,
    isTableDefault: 1,
    isQueryCondition: 1
  },
  {
    sqlSeg: 'i.EXAMINE_CYCLE',
    name: '核查周期',
    nameCode: 'examineCycle',
    component: 'input',
    comparison: inputComparsion,
    isQueryResult: 1,
    isTableDefault: 1,
    isQueryCondition: 1
  },
  {
    sqlSeg: 'trunc(i.NEXT_DATE)',
    name: '下次核查日期',
    nameCode: 'nextDate',
    component: 'date',
    comparison: dateComparison,
    dateFormat: 'yyyy-MM-dd',
    isQueryResult: 1,
    isTableDefault: 1,
    isQueryCondition: 1
  },
  {
    sqlSeg: 'trunc(i.CERTIFICATE_DATE)',
    name: '核查证书日期',
    nameCode: 'certificateDate',
    component: 'date',
    comparison: dateComparison,
    dateFormat: 'yyyy-MM-dd',
    isQueryResult: 1,
    isTableDefault: 1,
    isQueryCondition: 1
  },

];

export default paramJson
