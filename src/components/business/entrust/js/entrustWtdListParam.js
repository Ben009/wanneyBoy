let dateComparison='1,2,3,5,6',inputComparsion='0,1,2,3,4,5,6,7,8,9',selectComparison='1,4';
let yesOrNoOption=[{remark:'是',code:1},{remark:'否',code:0}]
let detectionMethodOption=[{remark:'送检',code:1},{remark:'上门',code:0}]
let institutionalNatureOption=[{remark:'系统外',code:'系统外'},{remark:'系统内',code:'系统内'},{remark:'内传',code:'内传'}]
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
* */
let entrustWtdListParam = [
  {sqlSeg: 'e.company_name', name: '委托单位', nameCode: 'companyName', component: 'input', comparison:inputComparsion,
    isSpecial: 0, purpose: 0, isDefault: 1, isSort: 0},
  {sqlSeg: 'e.order_no', name: '委托单编号', nameCode: 'orderNo', component: 'input', comparison:inputComparsion,
    isSpecial: 0, purpose: 0, isDefault: 1, isSort: 1},
  {sqlSeg:'e.detection_method',name:'检测方式',nameCode:'detectionMethod',component:'select',comparison:selectComparison,
    isSpecial:0,purpose:1,isDefault:1,isSort:0,options:detectionMethodOption},
  {sqlSeg:'e.detection_method_name',name:'检测方式',nameCode:'detectionMethodName',
    isSpecial:0,purpose:2,isDefault:1,isSort:0},
  {sqlSeg:'e.institutional_nature',name:'机构性质',nameCode:'institutionalNature',component: 'select', comparison:selectComparison,
    isSpecial:0,purpose:0,isDefault:1,isSort:0,options:institutionalNatureOption},
  {sqlSeg:'e.contacter',name:'联系人',nameCode:'contacter',component:'input',comparison:inputComparsion,
    isSpecial:0,purpose:0,isDefault:1},
  {sqlSeg:'e.telephone',name:'联系电话',nameCode:'telephone',component: 'input', comparison:inputComparsion,
    isSpecial:0,purpose:0,isDefault:1},
  {sqlSeg:'e.mobile_phone',name:'手机号码',nameCode:'mobilePhone',component: 'input', comparison:inputComparsion,
    isSpecial:0,purpose:0,isDefault:0},
  {sqlSeg:'trunc(e.entrust_date)',name:'客户委托日期',nameCode:'entrustDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,
    isSpecial:0,purpose:0,isDefault:1,isSort: 1},
  {sqlSeg:'trunc(e.service_date)',name:'业务受理日期',nameCode:'serviceDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,
    isSpecial:0,purpose:0,isDefault:0,isSort: 1},
  {sqlSeg:'e.task_source',name:'任务来源',nameCode:'taskSource',component: 'input', comparison:inputComparsion,
    isSpecial:0,purpose:0,isDefault:1},
  // {sqlSeg:'suser.user_name',name:'受理人',nameCode:'taskSource',component: 'input', comparison:inputComparsion, isSpecial:0,purpose:0,isDefault:1},
// {sqlSeg:'e.controlled',name:'是否受控',nameCode:'controlled',component:'select',comparison:selectComparison,isSpecial:0,purpose:0,isDefault:1,isSort:0,options:yesOrNoOption},
]
export default entrustWtdListParam
