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
const processApplyType = [{'remark':'退','code':'1'},{'remark':'延期','code':'2'}],//申请类型type
      shFlag = [{'remark':'未审核','code':'0'},{'remark':'通过','code':'1'},{'remark':'退回','code':'2'}];//审核状态type
// 登记号、委托单号、委托单位、器具名称、异常类型、检测部门、检测岗位、申请人、申请日期、申请原因、备注、一级审核、二级审核
let paramJson = [{
  sqlSeg:'p.REGISTRATION_NO',
  name:'登记号',
  nameCode:'registrationNo',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isQueryConditionDefault:1,
  isTableDefault:1,
  isSortDefault:1,
  isQueryResult:1,
},{
  sqlSeg:'w.COMPANY_NAME',
  name:'委托单位',
  nameCode:'companyName',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isTableDefault:1,
  isQueryResult:1,
},{
  sqlSeg:'p.APPLY_DATE',
  name:'申请日期',
  nameCode:'applyDate',
  dateFormat:'yyyy-MM-dd',
  component:'date',
  comparison:'1',
  isQueryCondition:1,
  isTableDefault:1,
  isQueryResult:1,
  isSort:1,
  isSortDefault:1,
},{
  sqlSeg:'t.APPLIANCE_NAME',
  name:'器具名称',
  nameCode:'applianceName',
  component:'input',
  comparison:'0,1',
  isSort:1,
  isQueryCondition:1,
  isTableDefault:1,
  isQueryResult:1,
},{
  sqlSeg:'w.ORDER_NO',
  name:'委托单号',
  nameCode:'orderNo',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isTableDefault:1,
  isSort:1,
  isQueryResult:1,
},{
  sqlSeg:'p.APPLYTYPE',
  name:'异常类型',
  nameCode:'applyType',
  component:'select',
  options:processApplyType,
  comparison:'0,1',
  isQueryCondition:1,
  isTableDefault:1,
  isQueryResult:1,
},{
  sqlSeg:'p.ADD_USER_NAME',
  name:'申请人',
  nameCode:'addUserName',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isTableDefault:1,
  isQueryResult:1,
},{
  sqlSeg:'p.BM_SH_FLAG',
  name:'一级审核',
  nameCode:'bmShFlag',
  component:'select',
  options:shFlag,
  comparison:'0,1',
  isQueryCondition:1,
  isTableDefault:1,
  isQueryResult:1,
},{
  sqlSeg:'p.BM_SH_TIME',
  name:'一审时间',
  nameCode:'bmShTime',
  isSort:1,
},{
  sqlSeg:'p.SH_FLAG',
  name:'二级审核',
  nameCode:'shFlag',
  component:'select',
  options:shFlag,
  comparison:'0,1',
  isQueryCondition:1,
  isTableDefault:1,
  isQueryResult:1,
},{
  sqlSeg:'p.SH_TIME',
  name:'二审时间',
  nameCode:'shTime',
  isSort:1,
},/***新增 */
{
  sqlSeg:'d.id',
  name:'检测部门',
  nameCode:'departName',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isQueryResult:1,
},{
  sqlSeg:'post.id',
  name:'检测岗位',
  nameCode:'postName',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isQueryResult:1,
},{
  sqlSeg:'p.APPLY_REASON',
  name:'申请原因',
  nameCode:'applyReason',
  isQueryResult:1,
},{
  sqlSeg:'p.APPLY_REASON',
  name:'申请原因(延期)',
  nameCode:'delay',
  component:'select',
  comparison:'1,4',
  isQueryCondition:1,
  ajaxUrl:'/njmind/findParam/delayReason',
},{
  sqlSeg:' p.APPLY_REASON',
  name:'申请原因(退件)',
  nameCode:'refund',
  component:'select',
  comparison:'1,4',
  isQueryCondition:1,
  ajaxUrl:'/njmind/findParam/returnReason',
},{
  sqlSeg:'p.APPLY_BZ',
  name:'备注',
  nameCode:'applyBz',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isQueryResult:1,
},{
  sqlSeg:'t.APPLIANCE_ACTUAL_NAME',
  name:'器具实际名称',
  nameCode:'applianceActualName',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
}
];
// 申请原因
// 备注
// 审核意见
// 排序  申请日期 、 部门
export default paramJson
