/*var $table
var tableObj;
var tCheckboxes = {'checked': false, items: {}};
var selectedItemIdList = [];*/

$(document).ready(function () {
    var $wrapper = $('.dataTables_wrapper');
   /*  $table = $('#salesmanTable');*/
    tableObj = $table.DataTable($.extend(true, {}, CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
        ajax: function (data, callback, settings) {//ajax配置为function,手动调用异步查询
            //封装请求参数
            var param = getQueryCondition(data);
            dataService.queryList("../../salesman/list", param, function (result) {
                setTimeout(function () {
                    //异常判断与处理
                    if (result.errorCode) {
                        $.dialog.alert("查询失败。错误码：" + result.errorCode);
                        return;
                    }
                    //封装返回数据，这里仅演示了修改属性名
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.total;
                    returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.rows;
                    callback(returnData);
                }, 200);
            });
        },
        columns: [
            CONSTANT.DATA_TABLES.COLUMN.CHECKBOX,


                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "staffName",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "businessGroupName",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "chargeName",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                    {
                                    data: "businessGroupId",
                                    width: "80px"
                                    },
                                    {
                                    data: "charge",
                                    width: "80px"
                                    },
                                    {
                                    data: "staff",
                                    width: "80px"
                                    },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "mobilePhone",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "telephone",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "fax",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "companyName",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "address",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "email",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },

            CONSTANT.DATA_TABLES.COLUMN.OPERATIONS
        ],

        "createdRow": function (row, data, index) {
            if (tCheckboxes.items[data.id]) {
                $('td', row).eq(0).find("input[type='checkbox']").prop("checked", true);
            }

        },
        "drawCallback": function (settings) {
            //渲染完毕后的回调
            //清空全选状态
            $(":checkbox[name='checkAll']", $wrapper).prop('checked', false);
            $(":checkbox[name='checkAll']", $table).parent().removeClass("checked");

        }
    }));//此处需调用api()方法,否则返回的是JQuery对象而不是DataTables的API对象


    /***********************表格相关操作**********************************/
    $table.on("click", ".btn-edit", function (event) {
        //点击编辑按钮
        var item = tableObj.row($(this).closest('tr')).data();
        tableManage.editItem(event,"编辑用户",item,editItemInit);
    }).on("click", ".btn-del", function () {
        //点击删除按钮
        var item = tableObj.row($(this).closest('tr')).data();
        tableManage.deleteItem(item.id,"../../salesman/");
    });
    /*增加一条记录*/
    $(".btn-add").click(function (e) {
        tableManage.addItem(e,"添加",addItemInit);
    });

    /*批量删除记录*/
    $(".btn-batch-del").click(function (e) {
        e.preventDefault();
        var selectedItemIds = idArrayToString(selectedItemIdList);
        tableManage.batchDeleteItem(selectedItemIds,"../../salesman/list/");
    });

    $('#salesmanForm').validator().on('submit', function (e) {
        if(!e.isDefaultPrevented()){
            e.preventDefault();
            var item=getItemValue();
            tableManage.saveItem(item,"../../salesman/");
        }
    });

});



function addItemInit() {

    $("#staffName").val("");
    $("#businessGroupName").val("");
    $("#chargeName").val("");
    $("#businessGroupId").val("");
    $("#charge").val("");
    $("#staff").val("");
    $("#mobilePhone").val("");
    $("#telephone").val("");
    $("#fax").val("");
    $("#companyName").val("");
    $("#address").val("");
    $("#email").val("");
}
function editItemInit() {

    $("#staffName").val(tableManage.currentItem.staffName);
    $("#businessGroupName").val(tableManage.currentItem.businessGroupName);
    $("#chargeName").val(tableManage.currentItem.chargeName);
    $("#businessGroupId").val(tableManage.currentItem.businessGroupId);
    $("#charge").val(tableManage.currentItem.charge);
    $("#staff").val(tableManage.currentItem.staff);
    $("#mobilePhone").val(tableManage.currentItem.mobilePhone);
    $("#telephone").val(tableManage.currentItem.telephone);
    $("#fax").val(tableManage.currentItem.fax);
    $("#companyName").val(tableManage.currentItem.companyName);
    $("#address").val(tableManage.currentItem.address);
    $("#email").val(tableManage.currentItem.email);
}
function showItemDetail(item) {
    $(".row-detail").fadeIn();
    $(".row-list").fadeOut();

    $("#staffName-view").html(item.staffName);
    $("#businessGroupName-view").html(item.businessGroupName);
    $("#chargeName-view").html(item.chargeName);
    $("#businessGroupId-view").html(item.businessGroupId);
    $("#charge-view").html(item.charge);
    $("#staff-view").html(item.staff);
    $("#mobilePhone-view").html(item.mobilePhone);
    $("#telephone-view").html(item.telephone);
    $("#fax-view").html(item.fax);
    $("#companyName-view").html(item.companyName);
    $("#address-view").html(item.address);
    $("#email-view").html(item.email);
}
function getItemValue(){
    if(tableManage.currentItem!=null){

                    tableManage.currentItem.staffName = $("#staffName").val();
                    tableManage.currentItem.businessGroupName = $("#businessGroupName").val();
                    tableManage.currentItem.chargeName = $("#chargeName").val();
                    tableManage.currentItem.businessGroupId = $("#businessGroupId").val();
                    tableManage.currentItem.charge = $("#charge").val();
                    tableManage.currentItem.staff = $("#staff").val();
                    tableManage.currentItem.mobilePhone = $("#mobilePhone").val();
                    tableManage.currentItem.telephone = $("#telephone").val();
                    tableManage.currentItem.fax = $("#fax").val();
                    tableManage.currentItem.companyName = $("#companyName").val();
                    tableManage.currentItem.address = $("#address").val();
                    tableManage.currentItem.email = $("#email").val();
        return tableManage.currentItem;
    }else{
        var item = new Object();

        item.staffName = $("#staffName").val();
        item.businessGroupName = $("#businessGroupName").val();
        item.chargeName = $("#chargeName").val();
        item.businessGroupId = $("#businessGroupId").val();
        item.charge = $("#charge").val();
        item.staff = $("#staff").val();
        item.mobilePhone = $("#mobilePhone").val();
        item.telephone = $("#telephone").val();
        item.fax = $("#fax").val();
        item.companyName = $("#companyName").val();
        item.address = $("#address").val();
        item.email = $("#email").val();
        return item;
    }
}

function  getQueryCondition(data) {
    var param = {};
    //组装排序参数
    if (data.order && data.order.length && data.order[0]) {
        switch (data.order[0].column) {


            case 1:
                param.orderColumn = "staffName";
                break;
            case 2:
                param.orderColumn = "businessGroupName";
                break;
            case 3:
                param.orderColumn = "chargeName";
                break;
            case 4:
                param.orderColumn = "businessGroupId";
                break;
            case 5:
                param.orderColumn = "charge";
                break;
            case 6:
                param.orderColumn = "staff";
                break;
            case 7:
                param.orderColumn = "mobilePhone";
                break;
            case 8:
                param.orderColumn = "telephone";
                break;
            case 9:
                param.orderColumn = "fax";
                break;
            case 10:
                param.orderColumn = "companyName";
                break;
            case 11:
                param.orderColumn = "address";
                break;
            case 12:
                param.orderColumn = "email";
                break;
            default:
                param.orderColumn = "updateTime";
                break;
        }
        param.orderDir = data.order[0].dir;
    }
    //组装查询参数
    param.fuzzySearch = tableManage.fuzzySearch;
    param.isDelete = 0;
    if (tableManage.fuzzySearch) {
        param.fuzzy = $("#fuzzy-search").val();
    } else {
        param.name = $("#name-search").val();
    }
    //组装分页参数
    param.page = data.start / data.length + 1;
    param.rows = data.length;

    return param;
}
