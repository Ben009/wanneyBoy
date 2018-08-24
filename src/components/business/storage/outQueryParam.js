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
  {sqlSeg:'t.BILL_NO',name:'出库单编号',nameCode:'billNo',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isQueryCondition:1,isSort:1},
  {sqlSeg:'t.dw_mc',name:'单位名称',nameCode:'dwmc',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isQueryCondition:1},
  {sqlSeg:'c.wtdh',name:'委托单号',nameCode:'orderNo',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isQueryCondition:1,isQueryResult:1},//sqlSeg
  {sqlSeg:'c.lzdh',name:'流转单号',nameCode:'orderSingelNo',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isQueryCondition:1,isQueryResult:1},//sqlSeg
  // {sqlSeg:'d.REGISTRATION_NO',name:'登记号',nameCode:'registrationNo',component:'input',comparison:'0,1,2,3,4,5,6,7,8,9',isQueryCondition:1},
  {sqlSeg:'t.war_out_style',name:'出库类型',nameCode:'warOutStyle',component:'select',options:[{code:1,remark:'样品出库'},{code:2,remark:'证书出库'},{code:3,remark:'综合出库'}],comparison:'1',isQueryCondition:1},
  {sqlSeg:'t.war_out_type',name:'出库方式',nameCode:'warOutType',component:'select',options:[{code:1,remark:'快递'},{code:2,remark:'客户自取'},{code:3,remark:'样管员送样'}],comparison:'1',isQueryCondition:1},
  // {sqlSeg:'c.PROJECT_NAME',name:'出库时间',nameCode:'cksj',component:'date',dateFormat:'yyyy-MM-dd',comparison:'1,2,3,4,5,6',isQueryCondition:0,isSort:1},//namecode
];
export default paramJson


