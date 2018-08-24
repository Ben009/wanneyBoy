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
        sqlSeg: 'ws.REGISTRATION_NO',
        name: '登记号',
        nameCode: 'registrationNo',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isTableDefault:1,
        isQueryCondition: 1,
        isQueryConditionDefault: 1
    }, {
        sqlSeg: 'ws.ORDER_SINGLE_NO',
        name: '流转单号',
        nameCode: 'orderSingleNo',
        component: 'input', comparison: '0,1',
        isQueryCondition: 1
    }, {
        sqlSeg: 'w.ORDER_NO',
        name: '委托单号',
        nameCode: 'entrustNumber',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isTableDefault:1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'w.COMPANY_NAME',
        name: '委托单位',
        nameCode: 'companyName',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isTableDefault:1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'ws.APPLIANCE_NAME',
        name: '器具名称',
        nameCode: 'applianceName',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isQueryCondition: 1,
        isTableDefault:1
    }, {
        sqlSeg: 'ws.APPLIANCE_ACTUAL_NAME',
        name: '器具实际名称',
        nameCode: 'applianceActualName',
        component: 'input', comparison: '0,1',
        isQueryCondition: 1
    }, {
        sqlSeg: 'depart.ID',
        name: '检测部门',
        nameCode: 'detectionDepart',
        component: 'select', comparison: '1,4',
        ajaxUrl: '/back/depart/list',
        toRex: {code: 'id', remark: 'departName'},
        isQueryCondition: 1
    }, {
        sqlSeg: 'post.ID',
        name: '检测岗位',
        nameCode: 'detectionPosition',
        ajaxUrl: '/back/post/retrieve',
        toRex: {code: 'id', remark: 'postName'},
        component: 'select', comparison: '1,4',
        isQueryCondition: 1
    }, {
        sqlSeg: 'ws.SUBCONTRACT_AREA',
        name: '分包区域',
        nameCode: 'subcontractArea',
        isQueryResult: 1,
        isTableDefault: 1
    },/* {
        sqlSeg: 'deliveryWarehousePerson',
        name: '分包操作人',
        nameCode: 'deliveryWarehousePerson',
        isQueryResult: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'deliveryDate',
        name: '分包操作人',
        nameCode: 'deliveryDate',
        isQueryResult: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'deliveryWarehouseWay',
        name: '分包出库方式',
        nameCode: 'deliveryWarehouseWay',
        isQueryResult: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'deliveryExpressNo',
        name: '分包快递单号',
        nameCode: 'deliveryExpressNo',
        isQueryResult: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'entryWarehousePerson',
        name: '返库接收人',
        nameCode: 'entryWarehousePerson',
        isQueryResult: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'entryDate',
        name: '返库签收时间',
        nameCode: 'entryDate',
        isQueryResult: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'entryWarehouseWay',
        name: '返库接收方式',
        nameCode: 'entryWarehouseWay',
        isQueryResult: 1,
        isTableDefault: 1
    }, {
        sqlSeg: 'entryExpressNo',
        name: '返库接收快递单号',
        nameCode: 'entryExpressNo',
        isQueryResult: 1,
        isTableDefault: 1
    }*/, {
        sqlSeg: 'ws.SET_NUMBER',
        name: '套数',
        nameCode: 'setNumber',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isTableDefault: 1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'ws.PIECE_NUMBER',
        name: '件/套',
        nameCode: 'unit',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'w.TASK_SOURCE',
        name: '任务来源',
        nameCode: 'source',
        component: 'input', comparison: '0,1',
        isQueryCondition: 1
    }, {
        sqlSeg: 'w.ENTRUST_DATE',
        name: '委托日期',
        nameCode: 'entrustDate',
        component: 'date',
        dateFormat: 'yyyy-MM-dd',
        comparison: '1,2,3,4,5,6',
        isQueryResult: 1,
        isQueryCondition: 1,
        isTableDefault: 1,
        isSort: 1
    }, {
        sqlSeg: 'ws.DETECTION_DEADLINE',
        name: '检测期限',
        nameCode: 'detectionDate',
        component: 'date',
        dateFormat: 'yyyy-MM-dd',
        comparison: '1,2,3,4,5,6',
        isQueryCondition: 1,
        isTableDefault: 1,
        isSort: 1
    }, {
        sqlSeg: 'ws.SETTLE_ACCOUNTS_DATE',
        name: '到账日期',
        nameCode: 'settleAccountDate',
        component: 'date',
        dateFormat: 'yyyy-MM-dd',
        comparison: '1,2,3,4,5,6',
        isQueryCondition: 1,
        isQueryResult: 1
    }, {
        sqlSeg: 'ws.SETTLEMENT_DATE',
        name: '结算日期',
        nameCode: 'settlementDate',
        component: 'date',
        dateFormat: 'yyyy-MM-dd',
        comparison: '1,2,3,4,5,6',
        isQueryCondition: 1,
        isQueryResult: 1
    }, {
        sqlSeg: 'ws.IS_SETTLEMENT',
        name: '是否收费',
        nameCode: 'isFee',
        component: 'select', comparison: '1',
        options: [{code: 0, remark: '否'}, {code: 1, remark: '是'}],
        isQueryCondition: 1
    }, {
        sqlSeg: 'ws.IS_SETTLE_ACCOUNT',
        name: '是否到账',
        nameCode: 'isSettleAccount',
        component: 'select', comparison: '1,4',
        options: [{code: 0, remark: '否'}, {code: 1, remark: '是'}],
        isQueryCondition: 1
    }, {
        sqlSeg: 'ws.CERTIFICATE_WAREHOUSE_FLAG',
        name: '库房状态',
        nameCode: 'storageStatus',
        component: 'select', comparison: '1,4',
        options: [{code: 0, remark: '未入库'}, {code: 1, remark: '已入库'}, {code: 3, remark: '已出证'}, {
            code: 4,
            remark: '确认送达'
        }],
        isQueryCondition: 1
    }, {
        sqlSeg: 'charge.COMMISSIONER_NAME',
        name: '工程师',
        nameCode: 'engineer',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'w.CONTACTER',
        name: '联系人',
        nameCode: 'contacter',
        component: 'input', comparison: '0,1',
        isQueryResult: 1,
        isQueryCondition: 1
    }, {
        sqlSeg: 'ws.CERTIFICATE_TYPE',
        name: '报告形式',
        nameCode: 'reportType',
        component: 'input', comparison: '0,1',
        isQueryCondition: 1
    }, {
        sqlSeg: 'ws.IS_DOUBLE_NUMBER',
        name: '是否双编号',
        nameCode: 'isDoubleNo',
        component: 'select', comparison: '1,4',
        options: [{code: 0, remark: '否'}, {code: 1, remark: '是'}],
        isQueryCondition: 1
    }, {
        sqlSeg: 'totalFee',
        name: '费用合计',
        nameCode: 'totalFee',
        isQueryResult: 1
    }, {
        sqlSeg: 'jdf',
        name: '检测费',
        nameCode: 'jdf',
        isQueryResult: 1
    }, {
        sqlSeg: 'xlf',
        name: '修理费',
        nameCode: 'xlf',
        isQueryResult: 1
    }, {
        sqlSeg: 'pjf',
        name: '配件费',
        nameCode: 'pjf',
        isQueryResult: 1
    }, {
        sqlSeg: 'jtf',
        name: '交通费',
        nameCode: 'jtf',
        isQueryResult: 1
    }, {
        sqlSeg: 'valueAddTax',
        name: '增值税',
        nameCode: 'valueAddTax',
        isQueryResult: 1
    }, {
        sqlSeg: 'otherFee',
        name: '其他费',
        nameCode: 'otherFee',
        isQueryResult: 1
    }, {
        sqlSeg: 'workload',
        name: '工作量',
        nameCode: 'workload',
        isQueryResult: 1
    }, {
        sqlSeg: 'companyAddress',
        name: '单位地址',
        nameCode: 'companyAddress',
        isQueryResult: 1
    }, {
        sqlSeg: 'telephone',
        name: '电话',
        nameCode: 'telephone',
        isQueryResult: 1
    }, {
        sqlSeg: 'contractNo',
        name: '协议号',
        nameCode: 'contractNo',
        isQueryResult: 1
    }, {
        sqlSeg: 'w.SPECIAL_REQUIREMENT',
        name: '备注',
        nameCode: 'remark',
        isQueryCondition: 1,
        isTableDefault: 1,
        isQueryResult: 1
    }, {
        sqlSeg: 'w.CERTIFICATE_COMPANY_NAME',
        name: '客户要求证书委托单位',
        nameCode: 'customerRequireCompany',
        component: 'input', comparison: '0,1',
        isQueryCondition: 1,
        isQueryResult: 1
    }
    , {
        sqlSeg: 'w.INSTITUTIONAL_NATURE',
        name: '机构性质',
        nameCode: 'institutionalNature',
        component: 'select', comparison: '0,1',
        options: [{code: '内传', remark: '内传'}, {code: '系统内', remark: '系统内'}, {code: '系统外', remark: '系统外'}],
        isQueryCondition: 1
    }

];


export default paramJson
