/*json数据
* sqlSeg      数据库sql查询结果字段
* name        字段中文名称
* nameCode    字段英文名称
* component   组件类型 input输入框 date日期选择框  select下拉框
* comparison  比较项  0  ["like", "包含"],1  ["=", "等于"],2  [">", "大于"],3  ["<", "小于"],4  ["<>", "不等于"],5  [">=", "大于等于"],
*                     6  ["<=", "小于等于"],7  ["not like", "不包含"],8  ["is null", "为空"],9  ["is not null", "不为空"]
* dateFormat  component为date类型时的日期格式
* ajaxUrl     component为select类型时的数据来源
* option      component为select类型时使用的数据
* isQueryCondition 是否查询条件 1是 0否   （可不配置此字段，默认为否）
* isQueryResult  是否查询结果（在模板中进行设置）  1是 0否  （可不配置此字段，默认为否）
* isSort      是否排序字段 1是 0否    （可不配置此字段，默认为否）
*
* isQueryConditionDefault  查询条件未设置时的默认值     1是 0否  （可不配置此字段，默认为否）
* isSortDefault   排序未设置时的默认值    1是 0否  （可不配置此字段，默认为否）
* isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
* isSpecial   是否为特殊处理字段，后台不进行sql拼接，使用场景比如not exist其它表数据时   1是 0否   （可不配置此字段，默认为否）
* */
import {ajaxSyncProxyRequest} from '../../util/base';
//折扣
let isDiscountOptions=[{remark:'未打折',code:0},{remark:'折扣审核',code:1},{remark:'已打折',code:2}];
let dateComparison='1,2,3,5,6',inputComparsion='0,1,2,3,4,5,6,7,8,9',selectComparison='1,4';
let paramJson = [
  {sqlSeg:'b.BILL_NO',name:'缴费单编号',nameCode:'BILL_NO',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'b.BILL_NAME',name:'缴费单名称',nameCode:'BILL_NAME',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'w.ORDER_NO',name:'委托单号',nameCode:'ORDER_NO',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'sjd.REGISTRATION_NO',name:'登记号',nameCode:'REGISTRATION_NO',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isTableDefault:1,
    isSpecial:1},
  {sqlSeg:'sjd.APPLIANCE_NAME',name:'器具名称',nameCode:'APPLIANCE_NAME',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isTableDefault:1,
    isSpecial:1},
  {sqlSeg:'b.ADD_TIME',name:'添加时间',nameCode:'ADD_TIME',component:'data',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isSort:1,isQueryResult:1},
  {sqlSeg:'u.USER_NAME',name:'添加人',nameCode:'USER_NAME',component:'input',comparison:'1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'u.BUSINESS_STAFF',name:'业务员',nameCode:'BUSINESS_STAFF',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'b.TICKET_DATE',name:'结算日期',nameCode:'TICKET_DATE',component:'data',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'b.CHECK_DATE',name:'到账日期',nameCode:'CHECK_DATE',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'b.JDF_ACTUAL',name:'检测费',nameCode:'JDF_ACTUAL',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'b.BILL_MONEY',name:'总金额',nameCode:'BILL_MONEY',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'b.IS_DISCOUNT',name:'折扣',nameCode:'IS_DISCOUNT',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,options:isDiscountOptions},
  {sqlSeg:'b.STATUS',name:'状态',nameCode:'STATUS',component:'input',comparison:'input',isQueryResult:1},
  //发票信息
   ];
export default paramJson

ajaxSyncProxyRequest('get','/njmind/findParam/CW',{},(res)=> {
  var list = res.list;
  list.forEach((v, i) => {
    paramJson.forEach(item => {
      if (v.code == item.nameCode) {
        item.name = v.remark
      }
    })
  });
});
