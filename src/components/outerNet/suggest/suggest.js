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
    sqlSeg: 'b.dwMc',
    name: '单位名称',
    nameCode: 'dwmc',
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
    sqlSeg: 'a.sugtype',
    name: '范围',
    nameCode: 'sugtype',
    component: 'select',
    comparison: '1,4',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    options: [{remark: '业务相关', code: '0'}, {remark: '系统使用', code: '1'}],
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.sugclass',
    name: '类别',
    nameCode: 'sugclass',
    component: 'select',
    comparison: '1,4',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    options: [
      {remark: '业务', code: '业务'},
      {remark: '咨询', code: '咨询'},
      {remark: '投诉', code: '投诉'},
      {remark: '建议', code: '建议'},
      {remark: '系统错误', code: '系统错误'},
      {remark: '改进建议', code: '改进建议'},
      {remark: '功能需求', code: '功能需求'}
    ],
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'a.title',
    name: '标题',
    nameCode: 'title',
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
    name: '提交时间',
    nameCode: 'djsj',
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
    sqlSeg: 'a.replayflag',
    name: '是否回复',
    nameCode: 'replayflag',
    component: 'select',
    comparison: '1,4',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    options: [{remark: '未回复', code: '0'}, {remark: '已回复', code: '1'}],
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  }
]
export default paramJson
