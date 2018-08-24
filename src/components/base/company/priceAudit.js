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
* */
// trunc是什么意思不太明白
// isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
// isQueryResult    设置是否在个性化设置中出现模板选项
let paramJson = [
  {sqlSeg:'company.COMPANY_NAME',name:'单位名称',nameCode:'companyName',component:'input',comparison:'0,1',isQueryCondition:1,isQueryConditionDefault:1,isSort:1},
  {sqlSeg:'c.APPLIANCE_NAME',name:'器具标准名称',nameCode:'applianceName',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'c.APPLIANCE_REALNAME',name:'器具实际名称',nameCode:'applianceRealname',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1},
  {sqlSeg:'c.MODEL',name:'型号规格',nameCode:'model',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,},
  {sqlSeg:'c.MEASURE_RANGE',name:'测量范围',nameCode:'measureRange',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'c.STANDARD_PRICE',name:'收费标准',nameCode:'standardPrice',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,},
  {sqlSeg:'c.SPECIAL_PRICE',name:'特殊价格',nameCode:'specialPrice',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'c.SPECIAL_PRICE_EXPLAIN',name:'特殊价格说明',nameCode:'specialPriceExplain',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'c.STATUS',name:'状态',nameCode:'status',component:'select',comparison:'1',options:[{code:1,remark:'未审核'},{code:2,remark:'已启用'},{code:3,remark:'已暂停'}],isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'c.ADD_TIME',name:'添加时间',nameCode:"addTime",component:'date',comparison:'1',isSort:1},
  {sqlSeg:'bgroup.business_area',name:'业务组',nameCode:'businessGroupName',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'u2.user_name',name:'业务员',nameCode:'businessStaffName',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1},
  {sqlSeg:'company.CONTACTER',name:'联系人',nameCode:'contacter',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'u1.user_name',name:'添加人',nameCode:'addUserName',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
];
export default paramJson


