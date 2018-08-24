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


let paramJson = [
  {sqlSeg:'tc.COMPANY_NAME',name:'客户名称',nameCode:'companyName',component:'input',comparison:'0,1',purpose:0,isDefault:1,isQueryCondition:1,isQueryConditionDefault:1,isSort:1,isSortDefault:1,},
  {sqlSeg:'c.VISITOR',name:'拜访人',nameCode:'visitor',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,},
  {sqlSeg:'c.VISIT_DATE',name:'拜访日期',nameCode:'visitDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3',isSort:1,},
  {sqlSeg:'c.NEXT_VISIT_DATE',name:'下次拜访日期',nameCode:'nextVisitDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3',isSort:1,isQueryResult:1},
  {sqlSeg:'c.WAY_OF_VISITING',name:'拜访方式',nameCode:'wayOfVisiting',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'c.RECEPTIONIST',name:'接待人',nameCode:'receptionist',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'c.CONTACT_INFORMATION',name:'联系方式',nameCode:'contactInformation',comparison:'0,1',isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'c.VISIT_SITUATION',name:'拜访情况',nameCode:'visitSituation',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.HANDLE_ADVICE',name:'处理意见',nameCode:'handleAdvice',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.IS_HANDLE',name:'处理状态',nameCode:'isHandle',component:'input',comparison:'0,1',isQueryCondition:1,},
  {sqlSeg:'c.HANDLE_TIME',name:'处理日期',nameCode:'handleTime',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3',isSort:1,},
  // 这个处理人字段出现错误
  {sqlSeg:'u1.user_name',name:'处理人',nameCode:'handleUserName',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1,},
  {sqlSeg:'c.ADD_TIME',name:'添加时间',nameCode:'addTime',component:'date',comparison:'1',isSort:1,isSortDefault:1}

];
export default paramJson
