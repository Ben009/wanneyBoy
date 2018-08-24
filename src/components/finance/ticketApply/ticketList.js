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
let dateComparison='1,2,3,5,6',inputComparsion='0,1,2,3,4,5,6,7,8,9',selectComparison='1,4';
let paramJson = [
  {sqlSeg:'t.ticket_company',name:'开票单位',nameCode:'ticketCompany',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'t.ticket_money',name:'开票金额',nameCode:'ticketMoney',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg: 't.TICKET_TYPE', name: '票种', nameCode: 'ticketTypeName', component: 'select', comparison: selectComparison, ajaxUrl: '/njmind/findParam/ticketType',isQueryCondition: 1,  isQueryResult: 1, isTableDefault: 1},
  {sqlSeg:'t.ticket_code',name:'发票号',nameCode:'ticketCode',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg: 't.check_way', name: '结账方式', nameCode: 'checkWayName', component: 'select', comparison: selectComparison, ajaxUrl: '/njmind/findParam/checkWay',isQueryCondition: 1,  isQueryResult: 1, isTableDefault: 1},
  {sqlSeg:'depart.id',name:'开票部门',nameCode:'departName',component:'select',comparison:selectComparison,isQueryCondition:1,ajaxUrl:'/njmind/findParam/departmentList',isQueryCondition:1,isQueryResult:1,isTableDefault:1},
  {sqlSeg:'u2.user_name',name:'申请人',nameCode:'applyPerson',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'apply.add_time',name:'申请时间',nameCode:'applyTime',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'t.check_date',name:'到款日期',nameCode:'checkDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isQueryCondition:1,isQueryResult:1,isSort:1},
  {sqlSeg:'t.ticket_balance',name:'余额',nameCode:'ticketBalance',component:'input',comparison:inputComparsion,isQueryCondition:1,isQueryResult:1},

];
export default paramJson
