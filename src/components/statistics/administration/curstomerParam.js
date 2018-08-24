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
  {sqlSeg:'c.company_name',name:'客户名称',nameCode:'khmc',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'w.ENTRUST_DATE',name:'委托日期',nameCode:'wtrq',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:1},
  {sqlSeg:'s.SETTLEMENT_DATE',name:'结算日期',nameCode:'jsrq',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:1},
  {sqlSeg:'s.SETTLE_ACCOUNTS_DATE',name:'结账日期',nameCode:'jzrq',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:1},
  {sqlSeg:'s.FINISH_DATE',name:'完成日期',nameCode:'wcrq',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:1},
  {sqlSeg:'c.PROVINCE_ID',name:'行政区',nameCode:'xzq',component:'select',comparison:'1,4',ajaxUrl:'/back/company/getRegion?type=0',toRex:{code:'provinceIds',remark:'provinceName'},isQueryCondition:1},
  {sqlSeg:'c.CONTACTER',name:'联系人',nameCode:'lxr',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'c.MOBILE_PHONE',name:'联系方式',nameCode:'lxfs',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'c.INDUSTRY_VALUE',name:'行业',nameCode:'hy',component:'select',comparison:'1,4',ajaxUrl:'/njmind/findParam/industryCategory',toRex:{code:'code',remark:'remark'},isQueryCondition:1},
];
export default paramJson


