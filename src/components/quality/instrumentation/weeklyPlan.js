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

// 查询条件：
// 计划类型（自检计划、外送计划）、计划名称、要求、专业部门、备注、添加人、添加时间、状态；
// 查询结果：
// 计划名称、要求、专业部门、计划类型、备注、添加人、添加时间、审核人、审核时间、状态（仅针对外送：正常、关闭）；
// 排序字段：
// 1、添加日期 、2、专业部门
let dateComparison = '1,2,3,5,6', inputComparsion = '0,1,2,3,4,5,6,7,8,9', selectComparison = '1,4';
let paramJson = [
  {
    sqlSeg: 'a.trace_way',
    name: '计划类型',
    nameCode: 'planTypes',
    component: 'select',
    comparison: selectComparison,
    options: [{remark: '自检计划', code: 1}, {remark: '外送计划', code: 2}],
    isQueryCondition: 1,
    isQueryResult: 1,
    isQueryConditionDefault: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'a.plan_item',
    name: '计划名称',
    nameCode: 'planItem',
    component: 'input',
    comparison: inputComparsion,
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'a.planRequire',
    name: '备注',
    nameCode: 'planRequire',
    component: 'input',
    comparison: inputComparsion,
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1,
    isSortDefault: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'u.user_name',
    name: '添加人',
    nameCode: 'userName',
    component: 'input',
    comparison: inputComparsion,
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'trunc(a.ADD_TIME)',
    name: '添加时间',
    nameCode: 'addTime',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: dateComparison,
    isSort: 1,
    isQueryCondition: 1,
    isQueryResult: 1,
    isSortDefault: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'u2.auditUserName',
    name: '审核人',
    nameCode: 'auditUserName',
    component: 'input',
    comparison: inputComparsion,
    isSort: 1,
    isQueryResult: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'trunc(u2.AUDIT_DATE)',
    name: '审核时间',
    nameCode: 'auditDate',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: dateComparison,
    isSort: 1,
    isQueryResult: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'u2.CLOSE_STATE',
    name: '状态',
    nameCode: 'closeState',
    component: 'select',
    comparison: selectComparison,
    options: [{remark: '关闭', code: 0}, {remark: '正常', code: 1}],
    isSort: 1,
    isQueryResult: 1,
    isTableDefault:1
  },


];

export default paramJson
