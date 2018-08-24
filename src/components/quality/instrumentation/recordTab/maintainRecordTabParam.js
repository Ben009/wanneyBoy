let dateComparison = '1,2,3,5,6',
  inputComparsion = '0,1,2,3,4,5,6,7,8,9',
  selectComparison = '1,4';
let paramJson = [{
    sqlSeg: 't.INSTRUMENTATION_NAME',
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
    sqlSeg: 't.MODEL',
    name: '型号规格',
    nameCode: 'model',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isSort: 1,
    isQueryResult: 1,
  },
  {
    sqlSeg: 't.MEARSURING_RANGE',
    name: '测量范围',
    nameCode: 'mearsuringRange',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1
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
    sqlSeg: 'dt.id',
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
    sqlSeg: 't.STATUS',
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
    sqlSeg: 't.TRACE_WAY',
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
    nameCode: 'keeperName',
    component: 'input',
    comparison: selectComparison,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 't.MANUFACTURER',
    name: '制造厂商',
    nameCode: 'manufacturer',
    component: 'input',
    comparison: selectComparison,
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.MAINTAIN_WAY',
    name: '维护方式',
    nameCode: 'maintainWay',
    component: 'select',
    options: [{
      code: '1',
      remark: '厂家维护保养'
    }, {
      code: '2',
      remark: '自行维护保养'
    }, {
      code: '3',
      remark: '厂家进行维修'
    }],
    comparison: selectComparison,
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.VALIDATE_WAY',
    name: '验证方式',
    nameCode: 'validateWay',
    component: 'select',
    comparison: selectComparison,
    options: [{
      'remark': '校准/检定',
      code: '1'
    }, {
      'remark': '自校准/验证',
      code: '2'
    }],
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'u.user_name',
    name: '经手人',
    nameCode: 'userName',
    component: 'input',
    comparison: inputComparsion,
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'trunc(i.MAINTAIN_DATE)',
    name: '保养日期',
    nameCode: 'maintainDate',
    component: 'date',
    comparison: dateComparison,
    dateFormat: 'yyyy-MM-dd',
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.MAINTAIN_CYCLE',
    name: '保养周期(月)',
    nameCode: 'maintainCycle',
    component: 'input',
    comparison: inputComparsion,
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'trunc(i.ESTIMATED_TIME)',
    name: '预计下次保养日期',
    nameCode: 'estimatedTime',
    component: 'date',
    comparison: dateComparison,
    dateFormat: 'yyyy-MM-dd',
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1
  },
  {
    sqlSeg: 'i.REMARK',
    name: '备注',
    nameCode: 'remark',
    component: 'input',
    comparison: inputComparsion,
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1
  },

];

export default paramJson
