let userJson = [{
	sqlSeg:'u.USER_NO',
	name:'登录账号',
	nameCode:'userNo',
	component:'input',
	comparison:'0,1,4',
  isQueryCondition:1,
  isQueryResult:1,
  isQueryConditionDefault:1,
  isTableDefault:1,
  isSort:1,
  isSortDefault:1,
  isSpecial:0,
},{
	sqlSeg:'u.USER_NAME',
	name:'用户姓名',
	nameCode:'userName',
	component:'input',
	comparison:'0,1,4',
  isQueryCondition:1,
  isQueryResult:1,
  isSort:1,
  isTableDefault:1,
  isSpecial:0,
},{
	sqlSeg:'u.DEPART_ID',
	name:'所属部门',
	nameCode:'departId',
	component:'select',
	comparison:'1,4',
  isQueryCondition:1,
  isQueryResult:1,
  isSort:1,
  isTableDefault:1,
  ajaxUrl:'/njmind/findParam/departmentList',
  isSpecial:0,
},{
	sqlSeg:'u.POST_ID',
	name:'所属检测岗位',
	nameCode:'postName',
	component:'select',
	comparison:'0,7',
  isQueryResult:1,
  isTableDefault:1,
  /*ajaxUrl:'/back/post/getPostsList',
  toRex:{code:'id',remark:'postName'},*/
  isSpecial:1,
},{
	sqlSeg:'u.ALLOW_POST_NAME',
	name:'所属授权岗位',
	nameCode:'allowPostName',
	component:'select',
	comparison:'0,7',
  isQueryResult:1,
  isTableDefault:1,
 /* ajaxUrl:'/back/post/getPostsList',
  toRex:{code:'id',remark:'postName'},*/
  isSpecial:1,
},{
	sqlSeg:'u.ROLE_ID',
	name:'角色',
	nameCode:'roleName',
	component:'select',
	comparison:'0,7',
  isQueryResult:1,
  isTableDefault:1,
  /*ajaxUrl:'/back/role/getRolesList',
  toRex:{code:'id',remark:'roleName'},*/
  isSpecial:1,
},{
	sqlSeg:'u.CERTIFICATE_FLAG',
	name:'是否授权签字人',
	nameCode:'certificateFlag',
	component:'select',
	comparison:'1,4',
	options:[{remark:'是',code:0},{remark:'否',code:1},{remark:'全部证书',code:2}],
  isQueryCondition:1,
  isQueryResult:1,
  isSort:1,
  isTableDefault:1,
  isSpecial:0,
},{
	sqlSeg:'u.POSITION',
	name:'职务',
	nameCode:'position',
	component:'input',
	comparison:'0,1,4',
  isQueryCondition:1,
  isQueryResult:1,
  isTableDefault:1,
  isSpecial:0,
},{
	sqlSeg:'u.EMAIL',
	name:'邮箱地址',
	nameCode:'email',
	component:'input',
	comparison:'0,1,4',
  isQueryCondition:1,
  isQueryResult:1,
  isTableDefault:1,
  isSpecial:0,
},{
	sqlSeg:'u.MOBILE_PHONE',
	name:'手机',
	nameCode:'mobilePhone',
	component:'input',
	comparison:'0,1,4',
  isQueryCondition:1,
  isQueryResult:1,
  isTableDefault:1,
  isSpecial:0,
},{
	sqlSeg:'u.OFFICE_PHONE',
	name:'办公电话',
	nameCode:'officePhone',
	component:'input',
	comparison:'0,1,4',
  isQueryCondition:1,
  isQueryResult:1,
  isTableDefault:1,
  isSpecial:0,
}];
export default userJson