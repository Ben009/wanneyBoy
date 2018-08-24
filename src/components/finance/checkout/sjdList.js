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

import {ajaxSyncProxyRequest} from "../../util/base";

let dateComparison='1,2,3,5,6',inputComparsion='0,1,2,3,4,5,6,7,8,9',selectComparison='1,4';
let yesOrNoOption=[{remark:'是',code:1},{remark:'否',code:0}];
let applianceWarehouserFlag=[{remark:'送检在收发',code:0},{remark:'未检在实验室',code:1},{remark:'已检在实验室',code:2},{remark:'已入库',code:3},{remark:'已出库',code:4}];
let certificateWarehouserFlag=[{remark:'未入库',code:0},{remark:'已入库',code:3},{remark:'已出库',code:4}];

let paramJson = [
  {sqlSeg:'b.ORDER_NO',name:'委托单号',nameCode:'ORDER_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'b.COMPANY_NAME',name:'委托单位',nameCode:'COMPANY_NAME',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isSort:1},
  {sqlSeg:'b.CONTRACT_NO',name:'合同号',nameCode:'CONTRACT_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'e.REGISTRATION_NO',name:'登记号',nameCode:'REGISTRATION_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isSort:1,isTableDefault:1},
  {sqlSeg:'e.ORDER_SINGLE_NO',name:'流转单号',nameCode:'ORDER_SINGLE_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'e.APPLIANCE_NAME',name:'器具名称',nameCode:'APPLIANCE_NAME',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isSort:1,isTableDefault:1},
  {sqlSeg:'e.SET_NUMBER',name:'套数',nameCode:'SET_NUMBER',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'b.ENTRUST_DATE',name:'委托日期',nameCode:'ENTRUST_DATE',component:'date',comparison:dateComparison,dateFormat:'yyyy-MM-dd',isQueryCondition:1,isQueryResult:1,isSort:1,isTableDefault:1},
  {sqlSeg:'e.FINISH_DATE',name:'完成日期',nameCode:'FINISH_DATE',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isSort:1,isTableDefault:1},
  {sqlSeg:'e.IS_COMPULSORY_VERIFY',name:'是否强检',nameCode:'IS_COMPULSORY_VERIFY',component:'select',comparison:selectComparison,options:[{code:0,remark:'否'},{code:1,remark:'是'}],isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'e.DEPART_ID',name:'检测部门',nameCode:'DEPART_NAME',component:'select',comparison:selectComparison,ajaxUrl:'/njmind/findParam/departmentList',isQueryCondition:1,isQueryResult:1,isSort:1,isTableDefault:1},
  {sqlSeg:'po.POST_NAME',name:'检测岗位',nameCode:'POST_NAME',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.COMMISSIONER_NAME',name:'检测人员',nameCode:'COMMISSIONER_NAME',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'b.TASK_SOURCE',name:'任务来源',nameCode:'TASK_SOURCE',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'p.BUSINESS_STAFF',name:'业务员',nameCode:'BUSINESS_STAFF',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'e.APPLIANCE_WAREHOUSE_FLAG',name:'样品库房状态',nameCode:'APPLIANCE_WAREHOUSE_FLAG',component: 'select', comparison:selectComparison, isQueryCondition:1,isQueryResult:1,options:applianceWarehouserFlag},
  {sqlSeg:'e.CERTIFICATE_WAREHOUSE_FLAG',name:'证书库房状态',nameCode:'CERTIFICATE_WAREHOUSE_FLAG',component: 'select', comparison:selectComparison, isQueryCondition:1,isQueryResult:1,options:certificateWarehouserFlag},
  {sqlSeg:'e.IS_DISCOUNT',name:'是否允许打折',nameCode:'IS_DISCOUNT',component: 'select', comparison:selectComparison, isQueryCondition:1,isQueryResult:1,options:yesOrNoOption},
  {sqlSeg:'c.JDF_ACTUAL',name:'检定费',nameCode:'JDF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.FJF_ACTUAL',name:'附加费',nameCode:'FJF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.XLF_ACTUAL',name:'修理费',nameCode:'XLF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.JJF_ACTUAL',name:'加急费',nameCode:'JJF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.FWF_ACTUAL',name:'服务费',nameCode:'FWF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.QTF_ACTUAL',name:'其他费',nameCode:'QTF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.WORKLOAD_ACTUAL',name:'工作量',nameCode:'WORKLOAD_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.INTENSIVE_WORKLOAD_ACTUAL',name:'强检工作量',nameCode:'INTENSIVE_WORKLOAD_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'c.TOTAL_ACTUAL',name:'费用合计',nameCode:'TOTAL_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'c.DISCOUNT',name:'折扣',nameCode:'DISCOUNT',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
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
