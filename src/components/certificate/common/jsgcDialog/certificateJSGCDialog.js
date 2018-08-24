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
let yesOrNoOption = [{remark: '是', code: 1}, {remark: '否', code: 0}]
let paramJson = [
  {sqlSeg: 'c.BASIS_NO || c.NAME', name: '技术依据名称', nameCode: 'jsgcName', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 0, isTableDefault: 0},
  {sqlSeg: 'c.BASIS_NO_E || c.NAME_E', name: '依据英文名称', nameCode: 'jsgcNameEng', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 0, isTableDefault: 0}
  // {sqlSeg: 'T.basis_type', name: '依据类型', nameCode: 'basisType', component: 'select', comparison: selectComparison, isSort: 0, ajaxUrl: '/njmind/findParam/basisType', isQueryCondition: 1, isQueryResult: 0, isTableDefault: 0},
  // {sqlSeg: 'T.department', name: '维护部门', nameCode: 'department', component: 'select', comparison: selectComparison, isSort: 1, ajaxUrl: '/njmind/findParam/departmentList', isQueryCondition: 1, isQueryResult: 0, isTableDefault: 0},
  // {sqlSeg: 'trunc(t.add_Time)', name: '添加时间', nameCode: 'addTime', component: 'date', dateFormat: 'yyyy-MM-dd', comparison: dateComparison, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 0, isTableDefault: 1},
  // {sqlSeg: 'trunc(T.release_date)', name: '发布日期', nameCode: 'releaseDate', component: 'date', dateFormat: 'yyyy-MM-dd', comparison: dateComparison, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 0, isTableDefault: 0},
  // {sqlSeg: 'trunc(T.implementation_date)', name: '实施日期', nameCode: 'implementationDate', component: 'date', dateFormat: 'yyyy-MM-dd', comparison: dateComparison, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 0, isTableDefault: 0},
  // {sqlSeg: 'trunc(t.expire_date)', name: '作废日期', nameCode: 'expireDate', component: 'date', dateFormat: 'yyyy-MM-dd', comparison: dateComparison, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 0, isTableDefault: 0},
  // {sqlSeg: 't.controlled', name: '是否受控', nameCode: 'controlled', component: 'select', comparison: selectComparison, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 0, isTableDefault: 0, options: yesOrNoOption},
  // {sqlSeg: 't.controlled_no', name: '受控编号', nameCode: 'controlledNo', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 0, isTableDefault: 0}
]
export default paramJson
