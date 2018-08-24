// json数据
// sqlSeg      数据库sql查询结果字段
// name        字段中文名称
// nameCode    字段英文名称
// component   组件类型 input输入框 date日期选择框  select下拉框
// comparison  比较项  0  ["like", "包含"],1  ["=", "等于"],2  [">", "大于"],3  ["<", "小于"],4  ["<>", "不等于"],5  [">=", "大于等于"],
//                     6  ["<=", "小于等于"],7  ["not like", "不包含"],8  ["is null", "为空"],9  ["is not null", "不为空"]
// dateFormat  component为date类型时的日期格式
// ajaxUrl     component为select类型时的数据来源
// isQueryCondition 是否查询条件 1是 0否   （可不配置此字段，默认为否）
// isQueryResult  是否查询结果  1是 0否  （可不配置此字段，默认为否）
// isSort      是否排序字段 1是 0否    （可不配置此字段，默认为否）
//
// isQueryConditionDefault  查询条件未设置时的默认值     1是 0否  （可不配置此字段，默认为否）
// isSortDefault   排序未设置时的默认值    1是 0否  （可不配置此字段，默认为否）
// isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
// isSpecial   是否为特殊处理字段，后台不进行sql拼接，使用场景比如not exist其它表数据时   1是 0否   （可不配置此字段，默认为否）

let paramJson = [
  {
    sqlSeg: 'a.dw_mc',
    name: '单位名称',
    nameCode: 'dwMc',
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
    sqlSeg: 'a.zzjgdm',
    name: '统一社会信用代码',
    nameCode: 'zzjgdm',
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
    sqlSeg: 'a.mobile',
    name: '手机号',
    nameCode: 'mobile',
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
    sqlSeg: 'a.login_name',
    name: '登录名',
    nameCode: 'loginName',
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
    sqlSeg: 'a.source',
    name: '注册来源',
    nameCode: 'source',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 0,
    isQueryResult: 1,
    isSort: 0,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.lxr',
    name: '联系人',
    nameCode: 'lxr',
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
    sqlSeg: 'a.dh',
    name: '联系电话',
    nameCode: 'dh',
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
    sqlSeg: 'a.shflag',
    name: '审核状态',
    nameCode: 'shflag',
    component: 'select',
    comparison: '1',
    options: [{code: '0', remark: '未审核'}, {code: '1', remark: '已通过'}, {code: '2', remark: '未通过'}],
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.lastlogindate',
    name: '最后登录时间',
    nameCode: 'lastlogindate',
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
    sqlSeg: 'a.logintimes',
    name: '登录次数',
    nameCode: 'logintimes',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 1,
    isTableDefault: 1,
    isSpecial: 0
  }
]
export default paramJson
