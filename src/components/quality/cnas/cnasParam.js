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
  {sqlSeg: 't.NAME', name: '项目名称', nameCode: 'name', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 'T.NAME_E', name: '项目名称(英)', nameCode: 'nameE', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 0, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 'T.type', name: '项目类别', nameCode: 'type', component: 'select', comparison: selectComparison, isSort: 0, ajaxUrl: '/njmind/findParam/cnasType', isQueryCondition: 1, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 'T.department', name: '维护部门', nameCode: 'department', component: 'select', comparison: inputComparsion, isSort: 1, ajaxUrl: '/njmind/findParam/departmentList', isQueryCondition: 1, isQueryResult: 1},
  {sqlSeg: 'T.APPROVAL_NUM', name: '认可表中序号', nameCode: 'approvalNum', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 0, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 'TRUNC(T.LAUNCH_DATE)', name: '开展日期', nameCode: 'launchDate', component: 'date', dateFormat: 'yyyy-MM-dd', comparison: dateComparison, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 0, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 'TRUNC(T.EFFECTIVE_DATE)', name: '有效日期 ', nameCode: 'effectiveDate', dateFormat: 'yyyy-MM-dd', component: 'date', comparison: dateComparison, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 0, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 'T.CALIBRATION_TIMES', name: '已校准次数', nameCode: 'calibrationTimes', component: 'input', comparison: inputComparsion, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 0, isQueryResult: 1, isTableDefault: 1},
  {sqlSeg: 'T.REMARK', name: '备注', nameCode: 'remark', component: 'input', comparison: inputComparsion, isSort: 0, isQueryCondition: 1, isQueryConditionDefault: 0, isQueryResult: 1},
  {sqlSeg: 'trunc(t.ADD_TIME)', name: '创建时间', nameCode: 'addTime', component: 'date', dateFormat: 'yyyy-MM-dd', comparison: dateComparison, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 0, isQueryResult: 1},
  {sqlSeg: 'trunc(t.UPDATE_TIME)', name: '更新时间', nameCode: 'updateTime', component: 'date', dateFormat: 'yyyy-MM-dd', comparison: dateComparison, isSort: 1, isQueryCondition: 1, isQueryConditionDefault: 0, isQueryResult: 1}

]
export default paramJson
