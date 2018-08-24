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
let dateComparison = '1,2,3,5,6'
let inputComparsion = '0,1,4,7,8,9'
let selectComparison = '1,4'
let status = [{remark: '未审核', code: 0}, {remark: '审核撤销', code: 1}, {remark: '退回', code: 2},{remark: '已审核', code: 3}];
let paramJson = [
  {sqlSeg:'p.person_name',name:'姓名',nameCode:'personName',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1, isSort: 1},
  {sqlSeg:'p.education',name:'学历',nameCode:'education',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'p.certificate_category',name:'证件类别',nameCode:'certificateCategory',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1},
  {sqlSeg:'p.certificate_no',name:'证件编号',nameCode:'certificateNo',component:'input',comparison:'0,1',isQueryCondition:1,isQueryResult:1, isSort: 1},
  {sqlSeg:'p.certificate_name',name:'证件名称',nameCode:'certificateName',component:'input',comparison:'0,1',isQueryCondition:1, isSort: 1},
  {sqlSeg:'p.CERTIFICATE_DATE',name:'发证日期',nameCode:'certificateDate',component: 'date',dateFormat: 'yyyy-MM-dd',comparison:'1,3',isQueryCondition:1, isSort: 1},
  {sqlSeg:'p.certificate_depart',name:'发证单位',nameCode:'certificateDepart',component:'input',comparison:'0,1',isQueryCondition:1, isSort: 1},
  {sqlSeg:'project.PROJECT_EFECTIVE_DATE',name:'项目有效期',nameCode:'effectiveDate',component: 'date', dateFormat: 'yyyy-MM-dd',comparison:'1,3',isQueryCondition:1, isSort: 1},
  {sqlSeg:'p.STATUS',name:'状态',nameCode:'status',component: 'select', comparison:selectComparison,options: status,isQueryCondition:1}
];
export default paramJson
