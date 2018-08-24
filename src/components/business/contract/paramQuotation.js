/* json数据
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

let dateComparison='1,2,3,5,6',inputComparsion='0,1,2,3,4,5,6,7,8,9',selectComparison='1,4';
let paramJson = [
  {
    sqlSeg: 'q.COMPANY_NAME',
    name: '委托单位',
    nameCode: 'companyName',
    component: 'input',
    comparison:inputComparsion,
    isQueryCondition: 1,
    isQueryConditionDefault: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'q.CONTRACT_NO',
    name: '合同编号',
    nameCode: 'contractNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryConditionDefault: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'q.QUOTATION_NO',
    name: '报价单编号',
    nameCode: 'quotationNo',
    component: 'input',
    comparison: inputComparsion,
    isQueryCondition: 1,
    isQueryConditionDefault: 1,
    isQueryResult: 1,
    isTableDefault:1
  },

  {
    sqlSeg: 'c.ADD_TIME',
    name: '合同日期',
    nameCode: 'addTime',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: dateComparison,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault:1
  },

  {
    sqlSeg: 'q.TOTAL_COST',
    name: '合同金额',
    nameCode: 'totalCost',
    component: 'input',
    comparison:inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault:1
  },

  {
    sqlSeg: 'c.CONTRACT_TYPE',
    name: '合同类别',
    nameCode: 'contractType',
    component: 'select',
    comparison: selectComparison,
    options: [{remark: '普通合同', code: 0}, {remark: '年度合同', code: 1}],
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'c.AUDIT_FLAG',
    name: '合同是否审核',
    nameCode: 'auditFlag',
    component: 'select',
    comparison: selectComparison,
    options: [{remark: '是', code: 1}, {remark: '否', code: 0}],
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'u2.USER_NAME',
    name: '合同审核人',
    nameCode: 'auditUserName',
    component: 'input',
    comparison:inputComparsion,
    isQueryCondition: 1,
  },
  {
    sqlSeg: 'u.USER_NAME',
    name: '业务员',
    component: 'input',
    nameCode: 'businessStaffName',
    comparison:inputComparsion,
    isQueryCondition: 1,
    isQueryResult: 1,
    isTableDefault:1
  },
  {
    sqlSeg: 'q.CUSTOMER_ADDRESS',
      name: '客户联系人',
    component: 'input',
    nameCode: 'customerAddress',
    comparison:inputComparsion,
    isQueryCondition: 1
  },
  {
    sqlSeg: 'q.CUSTOMER_ADDRESS',
    name: '客户地址',
    component: 'input',
    nameCode: 'customerAddress',
    comparison:inputComparsion,
    isQueryCondition: 1
  },
  {
    sqlSeg: 'q.CUSTOMER_TELEPHONE',
    name: '客户电话',
    component: 'input',
    nameCode: 'customerTelephone',
    comparison:inputComparsion,
    isQueryCondition: 1
  },
  {
    sqlSeg: 'q.CUSTOMER_FOX',
    name: '客户传真',
    component: 'input',
    nameCode: 'customerFox',
    comparison:inputComparsion,
    isQueryCondition: 1
  },
  {
    sqlSeg: 'q.STATUS',
    name: '完成状态',
    component: 'select',
    comparison: selectComparison,
    options: [{remark: '是', code: 1}, {remark: '否', code: 0}],
    isQueryCondition: 1,
  },
  {
    sqlSeg: 'MAKEPLAN(q.id)',
    name: '是否安排',
    nameCode: 'arrange',
    component: 'select',
    comparison: '1,4',
    options: [{remark: '未安排', code: 0}, {remark: '已安排', code: 1}],
    isQueryCondition: 1,
  }
]
export default paramJson
