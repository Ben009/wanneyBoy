/*json数据
* sqlSeg      数据库sql查询结果字段
* name        字段中文名称
* nameCode    字段英文名称
* component   组件类型 input输入框 date日期选择框  select下拉框
* comparison  比较项  0  ["like", "包含"],1  ["=", "等于"],2  [">", "大于"],3  ["<", "小于"],4  ["<>", "不等于"],5  [">=", "大于等于"],
*                     6  ["<=", "小于等于"],7  ["not like", "不包含"],8  ["is  null", "为空"],9  ["is not null", "不为空"]
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


let paramJson = [
    { sqlSeg: 'a.plan_item', name: '计划名称', nameCode: 'planItem', component: 'input', comparison: '0,1', isSort: 1, isQueryCondition: 1, isQueryResult: 1 ,isQueryConditionDefault:1,isSortDefault:1},
    { sqlSeg: 'a.plan_type', name: '周检类型', nameCode: 'planType', component: 'select', comparison: '1', isQueryCondition: 1, isQueryResult: 1,options:[{code:'0',remark:'周检'},{code:'1',remark:'自检'},{code:'2',remark:'外送'},{code:'3',remark:'核查'}] },
    { sqlSeg: 'q.instrumentation_name', name: '设备名称', nameCode: 'instrumentation.instrumentationName', component: 'input', comparison: '0,1', isQueryCondition: 1 },
    { sqlSeg: 'q.device_number', name: '设备编号', nameCode: 'instrumentation.deviceNumber', component: 'input', comparison: '0,1', isQueryCondition: 1, isQueryResult: 1 },
    { sqlSeg: 'q.department', name: '所属部门', nameCode: 'departName', component: 'select', comparison: '1,4', ajaxUrl: '/njmind/findParam/departmentList', isQueryCondition: 1 },
    { sqlSeg: 'q.MANUFACTURING_CODE', name: '出厂编号', nameCode: 'instrumentation.manufacturingCode', component: 'input', comparison: '0,1', isQueryCondition: 1, isQueryResult: 1 },
    { sqlSeg: 'u.user_name', name: '保管人', nameCode: 'userName', component: 'input', comparison: '0,1', isQueryCondition: 1 },
    { sqlSeg: 'a.registration_no', name: '自检登记号', nameCode: 'registrAtioNo', component: 'input', comparison: '0,1', isSort: 1, isQueryCondition: 1, isQueryResult: 1 },
    { sqlSeg: 'sjd.finish_flag', name: '登记号是否完成', nameCode: 'finishFlag', component: 'select', comparison: '1', isSort: 1, isQueryCondition: 1,options:[{code:'0',remark:"否"},{code:'1',remark:'是'}]},
    { sqlSeg: 'd.is_finish', name: '周检是否完成', nameCode: 'isFinish', component: 'select', comparison: '1', isQueryCondition: 1,options:[{code:'0',remark:"否"},{code:'1',remark:'是'}]},

];

export default paramJson
