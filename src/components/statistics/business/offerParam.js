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
  {sqlSeg:'a.APPLIANCE_NAME',name:'上期报价套数',nameCode:'qts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'上期现场占比',nameCode:'qxczb',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'加急占比',nameCode:'qjjzb',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'报价件数',nameCode:'qjs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'报价总金额',nameCode:'qzje',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'报价应收',nameCode:'qys',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'平均折扣率',nameCode:'qzkl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'上期报价套数',nameCode:'czts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'上期现场占比',nameCode:'czxczb',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'加急占比',nameCode:'czjjzb',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'报价件数',nameCode:'czjs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'报价总金额',nameCode:'czzje',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'报价应收',nameCode:'czys',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'平均折扣率',nameCode:'czzkl',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值


];
export default paramJson


