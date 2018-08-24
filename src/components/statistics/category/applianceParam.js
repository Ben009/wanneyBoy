/*json数据
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
  {sqlSeg:'a.APPLIANCE_NAME',name:'修理费',nameCode:'xlf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//修理费
  {sqlSeg:'a.APPLIANCE_NAME',name:'服务费',nameCode:'fwf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//服务费
  {sqlSeg:'a.APPLIANCE_NAME',name:'其他费',nameCode:'qtf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//其他费
  {sqlSeg:'a.APPLIANCE_NAME',name:'套数',nameCode:'qts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'现场占比',nameCode:'qxczb',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'检测费',nameCode:'qjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'实收',nameCode:'qss',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'应收',nameCode:'qys',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'工作量',nameCode:'qgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'强检工作量',nameCode:'qysqjgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'单价均值',nameCode:'qdjjz',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'套数',nameCode:'czts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'现场占比',nameCode:'czxvzb',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'检测费',nameCode:'czjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'实收',nameCode:'czss',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'应收',nameCode:'czys',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'工作量',nameCode:'czgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'强检工作量',nameCode:'czysqjgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'单价均值',nameCode:'czdjjz',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'套数',nameCode:'dbts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值百分百
  {sqlSeg:'a.APPLIANCE_NAME',name:'现场占比',nameCode:'dbxczb',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值百分百
  {sqlSeg:'a.APPLIANCE_NAME',name:'检测费',nameCode:'dbjcf',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值百分百
  {sqlSeg:'a.APPLIANCE_NAME',name:'实收',nameCode:'dbss',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值百分百
  {sqlSeg:'a.APPLIANCE_NAME',name:'应收',nameCode:'dbys',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值百分百
  {sqlSeg:'a.APPLIANCE_NAME',name:'工作量',nameCode:'dbgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值百分百
  {sqlSeg:'a.APPLIANCE_NAME',name:'强检工作量',nameCode:'dbysqjgzl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值百分百
  {sqlSeg:'a.APPLIANCE_NAME',name:'单价均值',nameCode:'dbdjjz',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值百分百
];
export default paramJson


