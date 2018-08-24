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
* isSort      是否排序字段 1是 0否    （可不配置此字段，默认为否）
*
* isQueryConditionDefault  查询条件未设置时的默认值     1是 0否  （可不配置此字段，默认为否）
* isSortDefault   排序未设置时的默认值    1是 0否  （可不配置此字段，默认为否）
* isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
* isSpecial   是否为特殊处理字段，后台不进行sql拼接，使用场景比如not exist其它表数据时   1是 0否   （可不配置此字段，默认为否）
* */


let paramJson = [
  {sqlSeg:'a.qjyt',name:'使用领域',nameCode:'qjyt',component:'input',comparison:'0,1',isQueryCondition:1,isQueryConditionDefault:1,isSort:1,isQueryResult:1},
  {sqlSeg:'a.sbmc',name:'器具名称',nameCode:'sbmc',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},

  {sqlSeg:'a.ccbh',name:'出厂编号',nameCode:'ccbh',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'a.xhgg',name:'型号规格',nameCode:'xhgg',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isSort:1,isQueryResult:1},
  {sqlSeg:'a.zqddj',name:'准确度等级',nameCode:'zqddj',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'a.qjmlXb',name:'强检目录项别',nameCode:'qjmlXb',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isSort:1,isQueryResult:1},
  {sqlSeg:'a.qjml',name:'强检目录种别',nameCode:'qjml',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isSort:1,isQueryResult:1},
  {sqlSeg:'a.jddw',name:'检定机构',nameCode:'jddw',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},

];
export default paramJson
