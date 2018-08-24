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
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比实收',nameCode:'qss',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比应收',nameCode:'qys',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比套数',nameCode:'qts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比件数',nameCode:'qjs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比客户数',nameCode:'qkhs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比委托数',nameCode:'qwts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'对比计量器具种数',nameCode:'qzs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//同比上年，环比上月
  {sqlSeg:'a.APPLIANCE_NAME',name:'实收差值',nameCode:'czss',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'应收差值',nameCode:'czys',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'套数差值',nameCode:'czts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'件数差值',nameCode:'czjs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'客户数差值',nameCode:'czkhs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'委托数差值',nameCode:'czwts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'计量器具种数差值',nameCode:'czzs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值
  {sqlSeg:'a.APPLIANCE_NAME',name:'实收差值（百分比）',nameCode:'dbss',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值（百分比）
  {sqlSeg:'a.APPLIANCE_NAME',name:'应收差值（百分比）',nameCode:'dbys',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值（百分比）
  {sqlSeg:'a.APPLIANCE_NAME',name:'套数差值（百分比）',nameCode:'dbts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值（百分比）
  {sqlSeg:'a.APPLIANCE_NAME',name:'件数差值（百分比）',nameCode:'dbjs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值（百分比）
  {sqlSeg:'a.APPLIANCE_NAME',name:'客户数差值（百分比）',nameCode:'dbkhs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值（百分比）
  {sqlSeg:'a.APPLIANCE_NAME',name:'委托数差值（百分比）',nameCode:'dbwts',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值（百分比）
  {sqlSeg:'a.APPLIANCE_NAME',name:'计量器具种数差值（百分比）',nameCode:'dbzs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},//差值（百分比）
];
export default paramJson


