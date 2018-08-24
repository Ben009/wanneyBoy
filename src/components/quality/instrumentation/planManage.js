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

// 查询条件：
// 计划类型（周检计划、核查计划）、计划名称、要求、专业部门、备注、添加人、添加时间、审核人、审核时间；
// 查询结果：
// 计划名称、要求、专业部门、计划类型、备注、添加人、添加时间、审核人、审核时间；
// 排序字段：
// 1、添加日期 、2、专业部门
let dateComparison = '1,2,3,5,6',
  inputComparsion = '0,1,2,3,4,5,6,7,8,9',
  selectComparison = '1,4';
let paramJson = [
  // { sqlSeg: 'categoryName', name: '计量器具类别', nameCode: 'categoryName', component: 'input', comparison: '0,1', isSort: 1, isQueryCondition: 1,isQueryResult:1},
  {
    sqlSeg: 'a.PLAN_TYPE',
    name: '计划类型',
    nameCode: 'planClass',
    component: 'select',
    comparison: selectComparison,
    isSort: 1,
    isSortDefault: 1,
    isQueryCondition: 1,
    options: [{
      code: "0",
      remark: '周检计划'
    }, {
      code: '3',
      remark: '核查计划'
    }]
  },
  {
    sqlSeg: 'a.plan_item',
    name: '计划名称',
    nameCode: 'planItem',
    component: 'input',
    comparison: '1',
    isQueryCondition: 1,
    isQueryConditionDefault: 1,
    comparison: inputComparsion
  },
  {
    sqlSeg: 'a.plan_require',
    name: '要求',
    nameCode: 'planRequire',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
  },
  {
    sqlSeg: 'a.DEPART_MENT',
    name: '专业部门',
    component: 'select',
    comparison: selectComparison,
    ajaxUrl: '/njmind/findParam/departmentList',
    isQueryCondition: 1,
    isSort: 1
  },
  // {sqlSeg: '', name: '备注', component: 'input', comparison: '0,1', isQueryCondition: 1},
  {
    sqlSeg: 'u.user_name',
    name: '添加人',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1
  },
  {
    sqlSeg: 'trunc(a.ADD_TIME)',
    name: '添加日期',
    component: 'date',
    comparison: dateComparison,
    dateFormat: 'yyyy-MM-dd',
    isQueryCondition: 1,
    isSort: 1,
    isSortDefault: 1
  },
  {
    sqlSeg: 'u2.userName',
    name: '审核人',
    component: 'input',
    comparison: inputComparsion,
  },
  {
    sqlSeg: 'trunc(a.auditDate)',
    name: '审核日期',
    component: 'date',
    comparison: dateComparison,
    dateFormat: 'yyyy-MM-dd'
  },
];
export default paramJson
