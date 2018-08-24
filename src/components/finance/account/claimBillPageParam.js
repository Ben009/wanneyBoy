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
let paramJson = [
  {sqlSeg: 'b.BILL_NO', name: '缴费单编号', nameCode: 'billNo', component: 'input', comparison: inputComparsion },
  {sqlSeg: 'b.BILL_NAME', name: '缴费单名称', nameCode: 'billName', component: 'input', comparison: inputComparsion},
  {sqlSeg: 'u.USER_NAME', name: '添加人', nameCode: 'userName', component: 'input', comparison: inputComparsion},
  {sqlSeg: "to_char(trunc(b.ADD_TIME),'YYYY-MM-DD')", name: '添加时间', nameCode: 'addTime', component: 'date', dateFormat: 'yyyy-MM-dd', comparison: dateComparison},
  {sqlSeg: 'b.BILL_MONEY', name: '缴费单金额', nameCode: 'billMoney', component: 'input', comparison: inputComparsion},
  {sqlSeg: 'b.REMARK', name: '备注', nameCode: 'remark', component: 'input', comparison: inputComparsion}
]
export default paramJson
