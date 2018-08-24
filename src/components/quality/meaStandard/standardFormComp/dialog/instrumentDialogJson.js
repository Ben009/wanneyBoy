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
		sqlSeg:'i.INSTRUMENTATION_NAME',
		name:'仪器设备名称',
		nameCode:'instrumentationName',
		component:'input',
		comparison:'0,1',
		isQueryCondition:1,
		isQueryResult:1
 	},{
 		sqlSeg:'i.MODEL',
 		name:'型号规格',
 		nameCode:'model',
 		component:'input',
 		comparison:'0,1',
 		isQueryCondition:1,
 		isQueryResult:1
 	},{
 		sqlSeg:'i.DEVICE_NUMBER',
 		name:'设备编号',
 		nameCode:'deviceNumber',
 		component:'input',
 		comparison:'0,1',
 		isQueryCondition:1,
 		isQueryResult:1
 	},{
 		sqlSeg:'i.MANUFACTURING_CODE',
 		name:'出厂编号',
 		nameCode:'manufacturingCode',
 		component:'input',
 		comparison:'0,1',
 		isQueryCondition:1,
 		isQueryResult:1
 	},{
 		sqlSeg:'i.DEPARTMENT',
 		name:'所属部门',
 		nameCode:'department',
 		component:'select',
 		comparison:'1',
 		ajaxUrl:'/njmind/findParam/departmentList',
 	},{
 		sqlSeg:'i.CERTIFICATE_NO',
 		name:'证书编号',
 		nameCode:'certificateNo',
 		component:'input',
 		comparison:'0,1',
 		isQueryCondition:1,
 		isQueryResult:1
 	},{
 		sqlSeg:'i.ACCURACY_CLASS',
 		name:'准确度等级',
 		nameCode:'accuracyClass',
 		component:'input',
 		comparison:'0,1',
 		isQueryCondition:1,
 		isQueryResult:1
 	},{
 		sqlSeg:'i.MEARSURING_RANGE',
 		name:'测量范围',
 		nameCode:'mearsuringRange',
 		component:'input',
 		comparison:'0,1',
 		isQueryCondition:1,
 		isQueryResult:1
 	},{
 		sqlSeg:'i.MANUFACTURER',
 		name:'制造厂商',
 		nameCode:'manufacturer',
 		component:'input',
 		comparison:'0,1',
 		isQueryCondition:1,
 		isQueryResult:1
 	},{
 		sqlSeg:'i.CALIBRATION_DATE',
 		name:'检定日期',
 		nameCode:'calibrationDate',
		dateFormat:'yyyy-MM-dd',
    component:'date',
 		comparison:'1',
 		isQueryCondition:1,
 		isQueryResult:1
 	},{
 		sqlSeg:'i.EFFECTIVE_DATE',
 		name:'有效日期',
 		nameCode:'effectiveDate',
 		dateFormat:'yyyy-MM-dd',
    component:'date',
 		comparison:'1',
 		isQueryCondition:1,
 		isQueryResult:1
 	}
];

export default paramJson