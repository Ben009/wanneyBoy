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
import {ajaxSyncProxyRequest} from '../../util/base';
let paramJson = [
  {sqlSeg:'w.ORDER_NO',name:'委托单号',nameCode:'orderNo',component:'input',comparison:'0,1',isQueryCondition:1,isQueryConditionDefault:1,isQueryResult:1,isSort:1,isTableDefault:1},
  {sqlSeg:'w.COMPANY_NAME',name:'委托单位',nameCode:'companyName',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isSort:1,isTableDefault:1},
  {sqlSeg:'c.REGISTRATION_NO',name:'登记号',nameCode:'registrationNo',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isSort:1,isSortDefault:0,isTableDefault:1},
  {sqlSeg:'s.APPLIANCE_ACTUAL_NAME',name:'器具名称',nameCode:'applianceName',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1,isSort:1,isTableDefault:1},
  {sqlSeg:'s.SET_NUMBER',name:'套数',nameCode:'setNumber',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isSort:1,isTableDefault:1},
  {sqlSeg:'s.IS_DISCOUNT',name:'是否允许打折',nameCode:'isDiscount',component:'select',comparison:'1,4',isQueryCondition:1,isQueryResult:1,options:[{remark:'可打折',code:1},{remark:'不可打折',code:0}]},
  {sqlSeg:'s.IS_COMPULSORY_VERIFY',name:'是否强检',nameCode:'isCompulsoryVerify',component:'select',comparison:'1,4',isQueryCondition:1,isQueryResult:1,options:[{remark:'强检',code:1},{remark:'非强检',code:0}]},
  {sqlSeg:'a.DETECTION_FEE',name:'收费标准',nameCode:'detectionFee',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.TOTAL_FEE',name:'应收费合计',nameCode:'totalFee',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.discount',name:'折扣',nameCode:'discount',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.JDF_ACTUAL',name:'检测费',nameCode:'JDF_ACTUAL',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.FJF_ACTUAL',name:'附加费',nameCode:'FJF_ACTUAL',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.XLF_ACTUAL',name:'修理费',nameCode:'XLF_ACTUAL',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.JJF_ACTUAL',name:'加急费',nameCode:'JJF_ACTUAL',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.FWF_ACTUAL',name:'服务费',nameCode:'FWF_ACTUAL',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.QTF_ACTUAL',name:'其他费',nameCode:'QTF_ACTUAL',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.WORKLOAD_ACTUAL',name:'工作量',nameCode:'WORKLOAD_ACTUAL',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.INTENSIVE_WORKLOAD_ACTUAL',name:'强检工作量',nameCode:'INTENSIVE_WORKLOAD_ACTUAL',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.TOTAL_ACTUAL',name:'小计',nameCode:'TOTAL_ACTUAL',component:'input',comparison:'1,2,3,4,5,6',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
];
export default paramJson


ajaxSyncProxyRequest('get','/njmind/findParam/CW',{},(res)=> {
  console.log(res,"++++++++++++++++++++++");
  var list = res.list;
  list.forEach((v, i) => {
    paramJson.forEach(item => {
      if (v.code == item.nameCode) {
        item.name = v.remark
      }
    })
  });
});
