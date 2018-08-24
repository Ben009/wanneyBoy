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

let dateComparison='1,2,3,5,6',inputComparsion='0,1,2,3,4,5,6,7,8,9',selectComparison='1,4';
let yesOrNoOption=[{remark:'是',code:1},{remark:'否',code:0}];
let detectionMethodOption=[{remark:'送检',code:1},{remark:'上门',code:0}];
let institutionalNatureOption=[{remark:'系统外',code:'系统外'},{remark:'系统内',code:'系统内'},{remark:'内传',code:'内传'}]
let paramJson = [
  {sqlSeg:'s.REGISTRATION_NO',name:'登记号',nameCode:'REGISTRATION_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'w.ORDER_NO',name:'委托单号',nameCode:'ORDER_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'w.COMPANY_NAME',name:'委托单位',nameCode:'COMPANY_NAME',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'s.APPLIANCE_NAME',name:'器具名称',nameCode:'APPLIANCE_NAME',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'s.DEPART_ID',name:'检测部门',nameCode:'DEPART_NAME',component:'select',comparison:selectComparison,ajaxUrl:'/njmind/findParam/departmentList',isQueryCondition:1,isQueryResult:1,isSort:1},
  {sqlSeg:'po.POST_NAME',name:'检测岗位',nameCode:'POST_NAME',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'s.ORDER_SINGLE_NO',name:'流转单号',nameCode:'ORDER_SINGLE_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.SET_NUMBER',name:'套数',nameCode:'SET_NUMBER',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'s.PIECE_NUMBER',name:'件/套',nameCode:'PIECE_NUMBER',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.CERTIFICATE_NUMBER',name:'证书数量',nameCode:'CERTIFICATE_NUMBER',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.SERVICE_DATE',name:'受理日期',nameCode:'SERVICE_DATE',component:'date',comparison:dateComparison,dateFormat:'yyyy-MM-dd',isQueryCondition:1,isQueryResult:1,isSort:1},
  {sqlSeg:'w.ENTRUST_DATE',name:'委托日期',nameCode:'ENTRUST_DATE',component:'date',comparison:dateComparison,dateFormat:'yyyy-MM-dd',isQueryCondition:1,isQueryResult:1,isSort:1},
  {sqlSeg:'s.DETECTION_DEADLINE',name:'检测期限',nameCode:'DETECTION_DEADLINE',component:'date',comparison:dateComparison,dateFormat:'yyyy-MM-dd',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.FINISH_DATE',name:'完成日期',nameCode:'FINISH_DATE',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isSort:1},
  {sqlSeg:'s.SETTLEMENT_DATE',name:'结算日期',nameCode:'SETTLEMENT_DATE',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.SETTLE_ACCOUNTS_DATE',name:'结账日期',nameCode:'SETTLE_ACCOUNTS_DATE',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isSort:1,isTableDefault:1},
  {sqlSeg:"(s.is_urgent||'@@'||s.urgent_proportions)",name:'是否加急',nameCode:'IS_URGENT',component:'select',comparison:selectComparison,ajaxUrl:'/njmind/findParam/urgentDays',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.CERTIFICATE_TYPE',name:'服务类型',nameCode:'CERTIFICATE_TYPE',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/certificateType'},
  {sqlSeg:'c.COMMISSIONER_NAME',name:'检测人员',nameCode:'COMMISSIONER_NAME',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:0,isTableDefault:1},
  {sqlSeg:'c.JDF_ACTUAL',name:'检定费',nameCode:'JDF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:0,isTableDefault:1},
  {sqlSeg:'c.FJF_ACTUAL',name:'附加费',nameCode:'FJF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:0,isTableDefault:1},
  {sqlSeg:'c.XLF_ACTUAL',name:'修理费',nameCode:'XLF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:0,isTableDefault:1},
  {sqlSeg:'c.JJF_ACTUAL',name:'加急费',nameCode:'JJF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:0,isTableDefault:1},
  {sqlSeg:'c.FWF_ACTUAL',name:'服务费',nameCode:'FWF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:0,isTableDefault:1},
  {sqlSeg:'c.QTF_ACTUAL',name:'其他费',nameCode:'QTF_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:0,isTableDefault:1},
  {sqlSeg:'c.WORKLOAD_ACTUAL',name:'工作量',nameCode:'WORKLOAD_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:0,isTableDefault:1},
  {sqlSeg:'c.INTENSIVE_WORKLOAD_ACTUAL',name:'强检工作量',nameCode:'INTENSIVE_WORKLOAD_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:0,isTableDefault:1},
  {sqlSeg:'c.TOTAL_ACTUAL',name:'费用合计',nameCode:'TOTAL_ACTUAL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:0,isTableDefault:1},
  {sqlSeg:'c.DISCOUNT',name:'折扣',nameCode:'DISCOUNT',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.TICKET_NO',name:'发票号',nameCode:'TICKET_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.DETECTION_METHOD',name:'检测方式',nameCode:'DETECTION_METHOD',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,options:detectionMethodOption},
  {sqlSeg:'w.TASK_SOURCE',name:'任务来源',nameCode:'TASK_SOURCE',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.INSTITUTIONAL_NATURE',name:'机构性质',nameCode:'INSTITUTIONAL_NATURE',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,options:institutionalNatureOption},
  {sqlSeg:'w.CREDIT_CODE',name:'统一社会信用代码',nameCode:'CREDIT_CODE',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.CONTRACT_NO',name:'合同号',nameCode:'CONTRACT_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.CERTIFICATE_FIRST_PRINT_TIME',name:'证书打印日期',nameCode:'CERTIFICATE_FIRST_PRINT_TIME',component:'date',comparison:dateComparison,dateFormat:'yyyy-MM-dd',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.ADDRESS',name:'委托单位地址',nameCode:'ADDRESS',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.ADMINISTRATIVE_AREA',name:'行政区划',nameCode:'ADMINISTRATIVE_AREA',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.CONTACTER',name:'联系人',nameCode:'CONTACTER',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.TELEPHONE',name:'联系电话',nameCode:'TELEPHONE',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.MOBILE_PHONE',name:'手机号码',nameCode:'MOBILE_PHONE',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'w.SPECIAL_REQUIREMENT',name:'整单备注',nameCode:'SPECIAL_REQUIREMENT',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.MODEL',name:'型号规格',nameCode:'MODEL',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.DETECTION_PARAMETER',name:'检测参数',nameCode:'DETECTION_PARAMETER',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.FACTORY_NO',name:'出厂编号',nameCode:'FACTORY_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.EQUIPMENT_NO',name:'设备编号',nameCode:'EQUIPMENT_NO',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.MANUFACTURER',name:'制造厂商',nameCode:'MANUFACTURER',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.POWER_TYPES',name:'电源类型',nameCode:'POWER_TYPES',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/powerTypes'},
  {sqlSeg:'s.IS_REPAIR',name:'是否调修',nameCode:'IS_REPAIR',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/isRepair'},
  {sqlSeg:'s.IS_DOUBLE_NUMBER',name:'是否双编号',nameCode:'IS_DOUBLE_NUMBER',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,options:yesOrNoOption},
  {sqlSeg:'s.SUBCONTRACT_AREA',name:'是否分包',nameCode:'SUBCONTRACT_AREA',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/subcontractAreas'},
  {sqlSeg:'s.REMARK',name:'备注',nameCode:'REMARK',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'s.IS_COMPULSORY_VERIFY',name:'是否强检',nameCode:'IS_COMPULSORY_VERIFY',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,options:yesOrNoOption},
  {sqlSeg:'s.APPLIANCE_USE',name:'器具用途',nameCode:'APPLIANCE_USE',component:'select',comparison:selectComparison,isQueryCondition:1,isQueryResult:1,ajaxUrl:'/njmind/findParam/applianceUse'},
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

