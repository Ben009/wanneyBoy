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
  {sqlSeg:'t.ticket_company',name:'开票单位',nameCode:'ticketCompany',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'t_bill.bill_no',name:'缴费单编号',nameCode:'billNo',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'t.ticket_money',name:'开票金额',nameCode:'ticketMoney',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'t.payback_periods',name:'回款周期',nameCode:'paybackPeriods',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'t.add_time',name:'申请时间',nameCode:'addTime',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isSort:1},
  {sqlSeg:'t.ticket_depart',name:'开票部门',nameCode:'ticketDepart',component:'select',comparison:'1,4',isQueryCondition:1,ajaxUrl:'/njmind/findParam/departmentList',isQueryResult:1,isTableDefault:1},
  {sqlSeg:'u.user_name',name:'申请人',nameCode:'userName',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'t.status',name:'状态',nameCode:'status',component:'select',comparison:'1,4',isQueryCondition:1,options:[{remark:'待审核',code:0},{remark:'审核通过',code:1},{remark:'已开票',code:2},{remark:'已结账',code:3},{remark:'退回',code:-1},{remark:'取消',code:-2}],isQueryResult:1,isTableDefault:1}
];
export default paramJson
