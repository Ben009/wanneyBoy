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
  {sqlSeg:'c.company_name',name:'客户名称',nameCode:'kjmc',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'z.zsqjmc',name:'证书器具名称',nameCode:'zsqjmc',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'z.zsdwmc',name:'证书单位',nameCode:'zsdwmc',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'w.CERTIFICATE_COMPANY_NAME',name:'证书要求单位',nameCode:'wtdw',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'z.zsbh',name:'证书编号',nameCode:'zsbh',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'z.xhgg',name:'型号规格',nameCode:'xhgg',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'z.ccbh',name:'出厂编号',nameCode:'ccbh',component:'input',comparison:'0,1',isQueryCondition:1},
  {sqlSeg:'z.zsjdrq',name:'检定日期',nameCode:'jdrq',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:1},
  {sqlSeg:'z.zsyxq',name:'有效期',nameCode:'yxq',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:1},
  {sqlSeg:'z.qjyt',name:'器具用途',nameCode:'qjyt',component:'select',comparison:'1,4',ajaxUrl:'/njmind/findParam/applianceUse',toRex:{code:'code',remark:'remark'},isQueryCondition:1},
  {sqlSeg:'s.depart_id',name:'检测部门',nameCode:'departName',component:'select',comparison:'1,4',ajaxUrl:'/back/statistics/getDepartList',toRex:{code:'departId',remark:'departName'},isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.detection_method',name:'是否现场',nameCode:'isScene',component:'select',options:[{code:0,remark:'否'},{code:1,remark:'是'},{code:1,remark:'全部'}],comparison:'1,4',isQueryCondition:1},

  {sqlSeg:'',name:'制造厂商',nameCode:'zzcs',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},
  {sqlSeg:'',name:'检测岗位',nameCode:'postName',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},
  {sqlSeg:'',name:'检定员',nameCode:'qjdy',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},
  {sqlSeg:'',name:'委托单号',nameCode:'orderNo',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},
  {sqlSeg:'',name:'委托日期',nameCode:'entrustData',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:0,isQueryResult:1},
  {sqlSeg:'',name:'检测地点',nameCode:'jddd',component:'input',comparison:'0,1',isQueryCondition:0,isQueryResult:1},
];
export default paramJson


