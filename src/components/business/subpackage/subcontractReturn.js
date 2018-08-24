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


let paramJson = [
    {
        sqlSeg: 'sjd.REGISTRATION_NO',
        name: '登记号',
        nameCode: 'registrationNo',
        component: 'input', comparison: '0,1',
        isQueryCondition: 1,
        isQueryResult: 1,
        isTableDefault: 1,
        isQueryConditionDefault: 1
    }, {
        sqlSeg: 'sjd.APPLIANCE_NAME',
        name: '器具名称',
        nameCode: 'applianceName',
        component: 'input', comparison: '0,1',
        isQueryCondition: 1,
    }, {
        sqlSeg: 'sjd.APPLIANCE_ACTUAL_NAME',
        name: '器具实际名称',
        nameCode: 'applianceActualName',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isTableDefault: 1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'sjd.SET_NUMBER',
        name: '套数',
        nameCode: 'setNumber',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'wtd.COMPANY_NAME',
        name: '委托单位',
        nameCode: 'companyName',
        component: 'input', comparison: '0,1',
        isQueryCondition: 1,
        isTableDefault: 1,
        isQueryResult: 1
    }, {
        sqlSeg: 'sjd.SUBCONTRACT_AREA',
        name: '分包区域',
        nameCode: 'subcontractArea',
        component: 'select', comparison: '1,4',
        ajaxUrl: '/njmind/findParam/subcontractAreas',
        isQueryResult: 1,
        isTableDefault: 1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'trunc(sub.DELIVERY_WAREHOUSE_DATE)',
        name: '分包时间',
        nameCode: 'deliveryDate',
        component: 'date',
        dateFormat: 'yyyy-MM-dd',
        comparison: '1,2,3,4,5,6',
        isQueryCondition: 1,
        isQueryResult: 1,
        isTableDefault: 1,
        isSort: 1
    }, {
        sqlSeg: 'trunc(sub.ENTRY_WAREHOUSE_DATE)',
        name: '返库时间',
        nameCode: 'entryDate',
        component: 'date',
        dateFormat: 'yyyy-MM-dd',
        comparison: '1,2,3,4,5,6',
        isQueryCondition: 1,
        isQueryResult: 1,
        isTableDefault: 1,
        isSort: 1
    }, {
        sqlSeg: 'sub.DELIVERY_WAREHOUSE_PERSON',
        name: '操作人',
        nameCode: 'deliveryWarehousePerson',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isTableDefault: 1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'sub.ENTRY_WAREHOUSE_WAY',
        name: '入库方式',
        nameCode: 'entryWarehouseWay',
        component: 'select', comparison: '1,4',
        options: [{code: 1, remark: '自取'}, {code: 2, remark: '快递'}, {code: 3, remark: '检测机构送'}],
        isQueryResult: 1,
        isTableDefault: 1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'sub.DELIVERY_WAREHOUSE_WAY',
        name: '分包出库方式',
        component: 'select', comparison: '1,4',
        options: [{'remark': '送去检测机构', 'code': '1'}, {'remark': '快递', 'code': '2'}, {'remark': '检测机构来取', 'code': '3'}],
        nameCode: 'deliveryWarehouseWay',
        isQueryResult: 1,
        isQueryCondition: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'sub.DELIVERY_REMARK',
        name: '出库备注',
        component: 'input',
        comparison: '0,1,4,7',
        nameCode: 'deliveryRemark',
        isQueryCondition: 1,
        isQueryResult: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'sub.ENTRY_REMARK',
        name: '返库备注',
        component: 'input',
        comparison: '0,1,4,7',
        nameCode: 'entryRemark',
        isQueryCondition: 1,
        isQueryResult: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'expressType',
        name: '快递',
        component: 'select', comparison: '1,4',
        ajaxUrl: '/njmind/findParam/express',
        nameCode: 'expressType',
        isQueryCondition: 1,
        isQueryResult: 1,
        isTableDefault: 1,
        isSpecial: 1
    }, {
        sqlSeg: 'sub.DELIVERY_EXPRESS_NO',
        name: '分包快递单号',
        component: 'input',
        comparison: '0,1,4,7',
        nameCode: 'deliveryExpressNo',
        isQueryResult: 1,
        isQueryCondition: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'sub.ENTRY_WAREHOUSE_PERSON',
        name: '返库接收人',
        omponent: 'input',
        comparison: '0,1,4,7',
        nameCode: 'entryWarehousePerson',
        isQueryResult: 1,
        isQueryCondition: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'trunc(sjd.DETECTION_DEADLINE)',
        name: '检测期限',
        nameCode: 'detectionDate',
        component: 'date',
        dateFormat: 'yyyy-MM-dd',
        comparison: '1,2,3,4,5,6',
        isQueryCondition: 1,
        isTableDefault: 1,
        isSort: 1
    }

];


export default paramJson