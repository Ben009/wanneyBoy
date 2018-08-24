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

let paramJson = [
  {
    sqlSeg: 'c.COMPANY_NAME',
    name: '单位名称',
    nameCode: 'companyName',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 1,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.ADDRESS',
    name: '地址',
    nameCode: 'address',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.POST_CODE',
    name: '邮编',
    nameCode: 'postCode',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.TELEPHONE',
    name: '联系电话',
    nameCode: 'telephone',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.FAX',
    name: '传真',
    nameCode: 'fax',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.CONTACTER',
    name: '联系人',
    nameCode: 'contacter',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.CONTRACT_NO',
    name: '合同号',
    nameCode: 'contractNo',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.CONTRACT_VALIDATE_END',
    name: '合同有效期',
    nameCode: 'contractValidateEnd',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: '1,2,3,4,5,6',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'trunc(c.ADD_TIME)',
    name: '委托单位添加时间',
    nameCode: 'addTime',
    component: 'date',
    dateFormat: 'yyyy-MM-dd',
    comparison: '1,2,3,4,5,6',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.CONTRACT_REMARK',
    name: '备注',
    nameCode: 'contractRemark',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.COMPANY_CHARGE',
    name: '客户负责人',
    nameCode: 'companyCharge',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.COMPANY_TYPE',
    name: '单位类别',
    nameCode: 'companyType',
    component: 'select',
    comparison: '1,4',
    isQueryCondition: 1,
    options: [
      {remark: '第一类别', code: 1},
      {remark: '第二类别', code: 2},
      {remark: '第三类别', code: 3},
      {remark: '第四类别', code: 4},
      {remark: '第五类别', code: 5},
      {remark: '第六类别', code: 6}
    ],
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.INDUSTRY_VALUE',
    name: '行业名称',
    nameCode: 'industryValue',
    component: 'select',
    comparison: '1,4',
    ajaxUrl: '/njmind/findParam/industryCategory',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.BUSINESS_GROUP',
    name: '业务组',
    nameCode: 'businessGroup',
    component: 'select',
    comparison: '1,4',
    ajaxUrl: '/back/businessStaff/getBusinessGroupName',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0,
    toRex: {code: 'businessGroup', remark: 'businessGroupName'}
  },
  {
    sqlSeg: 'c.BUSINESS_STAFF',
    name: '业务员',
    nameCode: 'businessStaff',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.STATUS',
    name: '是否审核',
    nameCode: 'status',
    component: 'select',
    comparison: '1',
    options: [{code: 0, remark: '否'}, {code: 1, remark: '是'}],
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.CERTIFICATE_REQUIREMENT',
    name: '客户证书要求',
    nameCode: 'certificateRequirement',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.VISIT_SPECIAL_REQUIREMENT',
    name: '客户下厂要求',
    nameCode: 'visitSpecialRequirement',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  },
  {
    sqlSeg: 'c.OTHER_SPECIAL_REQUIREMENT',
    name: '客户特殊要求',
    nameCode: 'otherSpecialRequirement',
    component: 'input',
    comparison: '0,1',
    isQueryCondition: 1,
    isQueryResult: 1,
    isSort: 1,
    isQueryConditionDefault: 0,
    isSortDefault: 0,
    isTableDefault: 1,
    isSpecial: 0
  }
]
export default paramJson
