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

let paramJson = [
  {sqlSeg:'categoryName',name:'类别代码',nameCode:'categoryName',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'applianceName',name:'器具名称',nameCode:'applianceName',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:1},
  {sqlSeg:'applianceRealname',name:'器具别名',nameCode:'applianceRealname',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:1},
  {sqlSeg:'model',name:'型号规格',nameCode:'model',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'measureRange',name:'测量范围',nameCode:'measureRange',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'accuracyDegree',name:'准确度等级',nameCode:'accuracyDegree',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'departName',name:'检测部门',nameCode:'departName',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'postName',name:'检测岗位',nameCode:'postName',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'detectionMethod',name:'检测方式',nameCode:'detectionMethod',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'detectionFee',name:'检测费',nameCode:'detectionFee',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'chargeUnit',name:'收费单位',nameCode:'chargeUnit',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:1,isSort:0},
  {sqlSeg:'isDiscount',name:'是否可打折',nameCode:'isDiscount',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'isVerifyAuth',name:'授权检定',nameCode:'isVerifyAuth',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'isCalibrationAuth',name:'授权校准',nameCode:'isCalibrationAuth',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'isCnasAuth',name:'授权cnas',nameCode:'isCnasAuth',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'certificateType',name:'服务类型',nameCode:'certificateType',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'isCompulsoryVerify',name:'是否强检',nameCode:'isCompulsoryVerify',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'applianceType',name:'类型',nameCode:'applianceType',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'status',name:'状态',nameCode:'status',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:0,isSort:0},
  {sqlSeg:'compulsoryVerifyName',name:'强检类别',nameCode:'compulsoryVerifyName',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isSpecial:0,purpose:0,isDefault:0,isSort:0}
];
export default paramJson
