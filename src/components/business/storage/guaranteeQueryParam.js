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
  {isSpecial:0,sqlSeg:'a.ORDER_SINGLE_NO',name:'流转单号',nameCode:'lzdh',component:'input',comparison:'0,1',isQueryCondition:1},//
  {isSpecial:0,sqlSeg:'w.ORDER_NO',name:'委托单号',nameCode:'wtdh',component:'input',comparison:'0,1',isQueryCondition:1},//
  {isSpecial:0,sqlSeg:'u2.user_name',name:'操作人',nameCode:'creatorName',component:'input',comparison:'0,1',isQueryCondition:1},//
  {isSpecial:0,sqlSeg:'trunc(g.ADD_TIME)',name:'操作时间',nameCode:'creatorName',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,5,6',isQueryCondition:1},//
  {isSpecial:0,sqlSeg:'f.TOTAL_ACTUAL',name:'费用合计',nameCode:'fyhj',component:'input',comparison:'0,1',isQueryCondition:1},//
  {isSpecial:1,sqlSeg:'feeStatus',name:'费用状态',nameCode:'feeStatus',component:'select',options:[{code:0,remark:'未结帐'},{code:1,remark:'已结账'},{code:2,remark:'未录费'},{code:3,remark:'已录费'},{code:4,remark:'已结算'}],comparison:'1,4',isQueryCondition:1},//
  {isSpecial:0,sqlSeg:'a.APPLIANCE_NAME',name:'器具名称',nameCode:'applianceName',component:'input',comparison:'0,1',isQueryCondition:1},
  {isSpecial:0,sqlSeg:'c.COMPANY_NAME',name:'委托单位',nameCode:'companyName',component:'input',comparison:'0,1',isQueryCondition:1},
  {isSpecial:0,sqlSeg:'g.GUARANTEE_TYPE',name:'担保类型',nameCode:'guaranteeType',component:'select',options:[{code:1,remark:'货证齐担'},{code:2,remark:'仅担保货'},{code:3,remark:'仅担保证'}],comparison:'1',isQueryCondition:1},
  {isSpecial:0,sqlSeg:'u1.user_name',name:'担保人',nameCode:'guaranteePerson',component:'input',comparison:'0,1',isQueryCondition:1},
  {isSpecial:0,sqlSeg:'g.GUARANTEE_TIME',name:'担保期限',nameCode:'guaranteeTime',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:1,isSort:1},
  // {isSpecial:0,sqlSeg:'a.IS_SETTLEMENT',name:'是否到账',nameCode:'isSettlement',component:'select',options:[{code:0,remark:'否'},{code:1,remark:'是'}],comparison:'1,4',isQueryCondition:0,isQueryResult:1},
  // {isSpecial:0,sqlSeg:'a.IS_SETTLE_ACCOUNT',name:'是否结账',nameCode:'isSettleAccount',component:'select',options:[{code:0,remark:'否'},{code:1,remark:'是'}],comparison:'1,4',isQueryCondition:1,isQueryResult:1},
  {isSpecial:0,sqlSeg:'g.ADD_TIME',name:'操作时间',nameCode:'addTime',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:0,isSort:1},
  {isSpecial:0,sqlSeg:'a.REGISTRATION_NO',name:'登记号',nameCode:'registrationNo',component:'input',comparison:'0,1',isQueryCondition:1,isSort:1},
];
export default paramJson


