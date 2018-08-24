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
let techBasListParam = [
  {sqlSeg: 't.name', name: '技术依据名称', nameCode: 'name', component: 'input', comparison:inputComparsion, isSpecial: 0, purpose: 0, isDefault: 1, isSort: 0},
  {sqlSeg: 't.base_no', name: '技术依据编号', nameCode: 'baseNo', component: 'input', comparison:inputComparsion, isSpecial: 0, purpose: 0, isDefault: 1, isSort: 1},
  {sqlSeg:'t.basis_type',name:'依据类型',nameCode:'basisType',component:'select',comparison:selectComparison,isSpecial:0,purpose:1,isDefault:1,isSort:0,ajaxUrl:'/njmind/findParam/basisType'},
  {sqlSeg:null,name:'依据类型',nameCode:'basisTypeName',component: 'input', comparison:inputComparsion, isSpecial:0,purpose:2,isDefault:1,isSort:0},
  {sqlSeg:'t.department',name:'所属部门',nameCode:'department',component:'select',comparison:selectComparison,isSpecial:0,purpose:1,isDefault:1,isSort:0,ajaxUrl:'/njmind/findParam/departmentList'},
  {sqlSeg:'t.departName',name:'所属部门',nameCode:'departName',component: 'input', comparison:inputComparsion, isSpecial:0,purpose:2,isDefault:1,isSort:0},
  {sqlSeg:'trunc(t.add_Time)',name:'添加时间',nameCode:'addTime',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isSpecial:0,purpose:0,isDefault:1,isSort: 1},
  {sqlSeg:'t.release_date',name:'发布日期',nameCode:'releaseDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isSpecial:0,purpose:0,isDefault:1,isSort: 1},
  {sqlSeg:'t.implementation_date',name:'实施日期',nameCode:'implementationDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isSpecial:0,purpose:1,isDefault:1,isSort: 1},
  {sqlSeg:'t.expire_date',name:'作废日期',nameCode:'expireDate',component:'date',dateFormat:'yyyy-MM-dd',comparison:dateComparison,isSpecial:0,purpose:0,isDefault:1,isSort: 1},
  {sqlSeg:'t.controlled',name:'是否受控',nameCode:'controlled',component:'select',comparison:selectComparison,isSpecial:0,purpose:0,isDefault:1,isSort:0,options:yesOrNoOption},
  {sqlSeg:'t.controlled_no', name: '受控编号', nameCode: 'controlledNo', component: 'input', comparison:inputComparsion, isSpecial: 0, purpose: 0, isDefault: 1, isSort: 1}
]
export default techBasListParam