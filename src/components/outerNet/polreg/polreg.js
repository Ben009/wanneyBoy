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
* isQueryResult  是否查询结果  1是 0否  （可不配置此字段，默认为否）
* isSort      是否排序字段 1是 0否    （可不配置此字段，默认为否）
*
* isQueryConditionDefault  查询条件未设置时的默认值     1是 0否  （可不配置此字段，默认为否）
* isSortDefault   排序未设置时的默认值    1是 0否  （可不配置此字段，默认为否）
* isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
* isSpecial   是否为特殊处理字段，后台不进行sql拼接，使用场景比如not exist其它表数据时   1是 0否   （可不配置此字段，默认为否）
* */

let paramJson = [
  {
    sqlSeg: 'a.title',
    name: '标题',
    nameCode: 'title',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 1,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.lb',
    name: '类别',
    nameCode: 'lb',
    component: 'select',
    comparison: '1,4',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    options: [{remark: '政策法规', code: '政策法规'}, {remark: '通知', code: '通知'}],
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.versionflag',
    name: '发布平台',
    nameCode: 'versionflag',
    component: 'select',
    comparison: '1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    options: [{remark: '公共服务平台', code: '2'}, {remark: '强检平台', code: '1'}, {remark: '公共服务平台、强检平台', code: '2、1'}],
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.author',
    name: '发布人',
    nameCode: 'author',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.djsj',
    name: '发布时间',
    nameCode: 'djsj',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: '1,2,3,4,5,6',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 1,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.czr',
    name: '实际发布人',
    nameCode: 'czr',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.sysdjsj',
    name: '实际发布时间',
    nameCode: 'sysdjsj',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: '1,2,3,4,5,6',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.disflag',
    name: '是否生效',
    nameCode: 'disflag',
    component: 'select',
    comparison: '1,4',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    options: [{remark: '未生效', code: '0'}, {remark: '已生效', code: '1'}],
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.disczr',
    name: '生效操作人',
    nameCode: 'disczr',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.disdjsj',
    name: '生效时间',
    nameCode: 'disdjsj',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: '1,2,3,4,5,6',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  }
]
export default paramJson
