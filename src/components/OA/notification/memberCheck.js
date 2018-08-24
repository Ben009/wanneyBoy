const memberCheck = [{
	sqlSeg:'u.USER_NAME',
	name:'收阅人姓名',
	nameCode:'userName',
	component:'input',
	comparison:'0,1,4',
    isQueryCondition:1,
},{
    sqlSeg:'d.id',
    name:'收阅人部门',
    nameCode:'departName',
    component:'select',
    ajaxUrl:'/njmind/findParam/departmentList',
    comparison:'1,4',
    isQueryCondition:1,
    isQueryResult:1,
    isSort:1,
    isTableDefault:1,
}]
export default memberCheck;