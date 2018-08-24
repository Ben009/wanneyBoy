let dateComparison='1,2,3,5,6',inputComparsion='0,1,2,3,4,5,6,7,8,9',selectComparison='1,4';
let yesOrNoOption=[{remark:'是',code:1},{remark:'否',code:0}]
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
* */
let quficationListParam = [
  {sqlSeg:'p.person_name', name: '姓名', nameCode: 'personName', component: 'input', comparison:inputComparsion, isSpecial: 0, purpose: 0, isDefault: 1, isSort: 0},
  {sqlSeg:'p.education', name: '学历', nameCode: 'education', component: 'input', comparison:inputComparsion, isSpecial: 0, purpose: 0, isDefault: 1, isSort: 1},
  {sqlSeg:'p.certificate_category',name:'证件类别',nameCode:'certificateCategory',component:'select',comparison:selectComparison,isSpecial:0,purpose:1,isDefault:1,isSort:0,ajaxUrl:'/back/certificationType/list'},
  {sqlSeg:'p.certificate_no',name:'证件编号',nameCode:'certificateNo',component: 'input', comparison:inputComparsion, isSpecial:0,purpose:2,isDefault:1,isSort:0},
  {sqlSeg:'p.certificate_name',name:'证件名称',nameCode:'certificateName',component:'input',comparison:selectComparison,isSpecial:0,purpose:1,isDefault:1,isSort:0},
  {sqlSeg:'p.certificate_date',name:'发证日期',nameCode:'certificateDate',component: 'date', dateFormat:'yyyy-MM-dd', comparison:inputComparsion, isSpecial:0,purpose:2,isDefault:1,isSort:1},
  {sqlSeg:'p.certificate_depart',name:'发证单位',nameCode:'certificateDepart',component:'input',comparison:dateComparison,isSpecial:0,purpose:0,isDefault:1,isSort: 1},
]
export default quficationListParam
