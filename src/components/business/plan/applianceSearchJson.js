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
* isSort      是否排序 1是 0否    （可不配置此字段，默认为否）
*
* isQueryConditionDefault  查询条件未设置时的默认值     1是 0否  （可不配置此字段，默认为否）
* isSortDefault   排序未设置时的默认值    1是 0否  （可不配置此字段，默认为否）
* isTableDefault   查询结果未设置模板时，表格默认显示的字段   1是 0否   （可不配置此字段，默认为否）
* isSpecial   是否为特殊处理字段，后台不进行sql拼接，使用场景比如not exist其它表数据时   1是 0否   （可不配置此字段，默认为否）
* */


let paramJson = [{
  sqlSeg:'appliance.appliance_name',
  name:'器具名称',
  nameCode:'applianceName',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isQueryResult:1
},{
  sqlSeg:'appliance.model',
  name:'型号规格',
  nameCode:'model',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isQueryResult:1
},{
  sqlSeg:'appliance.set_number',
  name:'套数',
  nameCode:'setNumber',
  component:'input',
  comparison:'0,1',
  isQueryResult:1
},{
  sqlSeg:'appliance.detection_method',
  name:'检测方式',
  nameCode:'detectionMethod',
  component:'select',
  comparison:'0,1',
  isQueryCondition:1,
  isQueryResult:1
},{
  sqlSeg:'appliance.equipment_no',
  name:'设备编号',
  nameCode:'equipmentNo',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isQueryResult:1
},{
  sqlSeg:'appliance.factory_no',
  name:'出厂编号',
  nameCode:'factoryNo',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isQueryResult:1
},{
  sqlSeg:'appliance.inspector',
  name:'执行人',
  nameCode:'inspector',
  component:'select',
  comparison:'1',
  isQueryResult:1
},{
  sqlSeg:'appliance.estimated_workload',
  name:'预计工作量',
  nameCode:'estimatedWorkload',
  component:'input',
  comparison:'0,1',
  isQueryResult:1
},{
  sqlSeg:'i.status',
  name:'状态',
  nameCode:'status',
  component:'input',
  comparison:'0,1',
  isQueryCondition:1,
  isQueryResult:1
}
];

export default paramJson
