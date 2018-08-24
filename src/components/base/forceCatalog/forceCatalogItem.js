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
* isDefault   未设置模板时表格默认显示的字段 1是 0否
* isSort      排序字段 1是 0否
* isSearchDefault  检索条件的默认值     boolean   默认false      判断检索项的初始化默认值 （只能设置一个默认值,如果设置多个默认取第一个）
* */

let paramJson = [
  {
    sqlSeg: 'f.item_num',
    name: '项别号',
    nameCode: 'itemNum',
    component: 'input',
    comparison: '0,1,4,7',
    isSpecial: 0,
    purpose: 0,
    isDefault: 1,
    isSort: 1,
    isSearchDefault: true
  },
  {
    sqlSeg: 'f.item_name',
    name: '项别名称',
    nameCode: 'itemName',
    component: 'input',
    comparison: '0,1,4,7',
    isSpecial: 0,
    purpose: 0,
    isDefault: 1,
    isSort: 1,
    isSearchDefault: false
  },
  // {
  //   sqlSeg: 'f.item_english_name',
  //   name: '项别英文名称',
  //   nameCode: 'itemEnglishName',
  //   component: 'input',
  //   comparison: '0,1,4,7',
  //   isSpecial: 0,
  //   purpose: 0,
  //   isDefault: 1,
  //   isSort: 1,
  //   isSearchDefault: false
  // },
  {
    sqlSeg: 'f.item_realm',
    name: '强检范围',
    nameCode: 'itemRealm',
    component: 'select',
    ajaxUrl: '/njmind/findParam/applianceUse',
    comparison: '0,7',
    isSpecial: 0,
    purpose: 0,
    isDefault: 1,
    isSort: 1,
    isSearchDefault: false
  }

]
export default paramJson
