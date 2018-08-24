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
* isQueryResult  是否查询结果  1是 0否  （可不配置此字段，默认为否）c
* isSort      是否排序字段 1是 0否    （可不配置此字段，默认为否）
*
* isQueryConditionDefault  查询条件未设置时的默认值     1是 0否  （可不配置此字段，默认为否）
* isSortDefault   排序未设置时的默认值    1是 0否  （可不配置此字段，默认为否）
* isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
* isSpecial   是否为特殊处理字段，后台不进行sql拼接，使用场景比如not exist其它表数据时   1是 0否   （可不配置此字段，默认为否）
* */
let dateComparison = '1,2,3,5,6'
let inputComparsion = '0,1,4,7,8,9'
let selectComparison = '1,4'
let paramJson = [
  {sqlSeg: 'inst.instrumentation_name', name: '设备名称', nameCode: 'instrumentationName', component: 'input', comparison: inputComparsion, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 0},
  {sqlSeg: 'inst.model', name: '型号规格', nameCode: 'model', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 0, isQueryResult: 1, isTableDefault: 0},
  {sqlSeg: 'inst.mearsuring_range', name: '测量范围', nameCode: 'mearsuringRange', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 0},
  {sqlSeg: 'inst.instructions_no', name: '出厂编号', nameCode: 'instructionsNo', component: 'input', comparison: inputComparsion, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 'inst.device_number', name: '设备编号', nameCode: 'deviceNumber', component: 'input', comparison: inputComparsion, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 'T.departName', name: '所属部门', nameCode: 'departName', component: 'select', comparison: selectComparison, isSort: 0, ajaxUrl: '/njmind/findParam/departmentList', isQueryCondition: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 'trunc(aud.effective_Date)', name: '有效日期', nameCode: 'effectiveDate', component: 'date', dateFormat: 'yyyy-MM-dd', comparison: dateComparison, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 0},
  {sqlSeg: 't.status', name: '设备状态', nameCode: 'status', component: 'select', comparison: selectComparison, ajaxUrl: '/njmind/findParam/instrumentationStatus', isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1},
  {sqlSeg: 't.trace_way', name: '溯源方式', nameCode: 'traceWay', component: 'select', comparison: selectComparison, ajaxUrl: '/njmind/findParam/instrumentationStatus', isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1},
  {sqlSeg: 't.user_Name', name: '保管人', nameCode: 'userName', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 0},
  {sqlSeg: 't.zsbh', name: '证书编号', nameCode: 'zsbh', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 0, isTableDefault: 0},
  {sqlSeg: 'trunc(T.use_date)', name: '使用日期', nameCode: 'useDate', component: 'date', dateFormat: 'yyyy-MM-dd', comparison: dateComparison, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 't.use_location', name: '使用地点', nameCode: 'useLocation', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 't.use_person', name: '使用人', nameCode: 'usePerson', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 't.temperature', name: '温度', nameCode: 'temperature', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 't.humidity', name: '湿度', nameCode: 'humidity', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 't.other', name: '其它', nameCode: 'other', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 't.status_before', name: '使用前状态', nameCode: 'statusBefore', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 't.status_after', name: '使用后状态', nameCode: 'statusAfter', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 't.remark', name: '备注', nameCode: 'remark', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1}
]
export default paramJson

