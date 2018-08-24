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
const inputComparison='0,1,2,3,4,5,6,7,8,9';
const dateComparison='1,2,3,4,5,6';
const selectComparison='1,4';
const options=[{code:'0',remark:'未结账'},{code:'1',remark:'已结账'},{code:'2',remark:'未录费'},{code:'3',remark:'已录费'},{code:'4',remark:'已结算'}];
let paramJson = [
  {isSpecial:0,sqlSeg:'a.REGISTRATION_NO',name:'登记号',nameCode:'registrationNo',component:'input',comparison:inputComparison,isQueryCondition:1,isSort:1},
  {isSpecial:0,sqlSeg:'a.ORDER_SINGLE_NO',name:'流转单号',nameCode:'orderSingleNo',component:'input',comparison:inputComparison,isQueryCondition:1,isSort:0,isQueryResult:1},
  {isSpecial:0,sqlSeg:'w.ORDER_NO',name:'委托单号',nameCode:'orderNo',component:'input',comparison:inputComparison,isQueryCondition:1,isSort:0,isQueryResult:1},
  {isSpecial:0,sqlSeg:'bill.BILL_NO',name:'缴费单编号',nameCode:'billNo',component:'input',comparison:inputComparison,isQueryCondition:1,isSort:0},
  {isSpecial:0,sqlSeg:'outbill.BILL_NO',name:'出库单编号',nameCode:'outBillNo',component:'input',comparison:inputComparison,isQueryCondition:1,isSort:0},
  {isSpecial:0,sqlSeg:'w.COMPANY_NAME',name:'委托单位',nameCode:'companyName',component:'input',comparison:inputComparison,isQueryCondition:1,isSort:1},
  {isSpecial:0,sqlSeg:'a.APPLIANCE_NAME',name:'器具名称',nameCode:'applianceName',component:'input',comparison:inputComparison,isQueryCondition:1,isSort:0},
  {isSpecial:0,sqlSeg:'b.SAMPLE_WAREHOUSE_IN_DATE',name:'样品入库时间',nameCode:'appilanceEntryDate',dateFormat:'yyyy-MM-dd',component:'date',comparison:dateComparison,isQueryCondition:1,isSort:1},
  {isSpecial:0,sqlSeg:'b.SAMPLE_WAREHOUSE_NO',name:'样品货架号',nameCode:'appilanceRoomNo',component:'input',comparison:inputComparison,isQueryCondition:1,isSort:0},
  {isSpecial:0,sqlSeg:'b.CERTIFICATE_WAREHOUSE_IN_DATE',name:'证书入库时间',nameCode:'certificateEntryDate',dateFormat:'yyyy-MM-dd',component:'date',comparison:dateComparison,isQueryCondition:1,isSort:1},
  {isSpecial:0,sqlSeg:'b.CERTIFICATE_WAREHOUSE_NO',name:'证书货架号',nameCode:'certificateRoomNo',component:'input',comparison:inputComparison,isQueryCondition:1,isSort:0},
  {isSpecial:1,sqlSeg:'feeStatus',name:'费用状态',nameCode:'feeStatus',component:'select',comparison:selectComparison,options:options,isQueryCondition:1,isSort:0},
  {isSpecial:0,sqlSeg:'w.ENTRUST_DATE',name:'委托日期',nameCode:'entrustDate',dateFormat:'yyyy-MM-dd',component:'date',comparison:dateComparison,isQueryResult:0},
  {isSpecial:0,sqlSeg:'a.SET_NUMBER',name:'套数',nameCode:'setNumber',component:'input',comparison:inputComparison,isQueryCondition:0,isSort:0},


];
export default paramJson


