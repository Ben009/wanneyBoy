/* json数据
* sqlSeg      数据库依据查询语句
* name        字段中文名称
* nameCode    字段英文名称
* component   组件类型 input输入框 date日期选择框  select下拉框
* comparison  比较项  0  ["like", "包含"],1  ["=", "等于"],2  [">", "大于"],3  ["<", "小于"],4  ["<>", "不等于"],5  [">=", "大于等于"],
*                     6  ["<=", "小于等于"],7  ["not like", "不包含"],8  ["is null", "为空"],9  ["is not null", "不为空"]
* isSpecial   是否为特殊字段标识
* dateFormat  component为date类型时的日期格式
* ajaxUrl     component为select类型时的数据来源
* purpose     用途 0既是检索项也是查询结果 1仅用作检索项 2仅用作查询结果
* */

let paramJson = [
  {
    sqlSeg: 'a.id',
    name: '报检编号',
    nameCode: 'id',
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
    sqlSeg: 'u.dw_mc',
    name: '单位名称',
    nameCode: 'dwMc',
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
    sqlSeg: 'a.lxdh',
    name: '联系电话',
    nameCode: 'lxdh',
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
  }

]
export default paramJson
