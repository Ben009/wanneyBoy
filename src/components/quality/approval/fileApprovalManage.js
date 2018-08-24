/*var $table
var tableObj;
var tCheckboxes = {'checked': false, items: {}};
var selectedItemIdList = [];*/

$(document).ready(function () {
    var $wrapper = $('.dataTables_wrapper');
   /*  $table = $('#fileApprovalTable');*/
    tableObj = $table.DataTable($.extend(true, {}, CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
        ajax: function (data, callback, settings) {//ajax配置为function,手动调用异步查询
            //封装请求参数
            var param = getQueryCondition(data);
            dataService.queryList("../../fileApproval/list", param, function (result) {
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
                                    data: "addTime",
                                    width: "120px",
                                    render: CONSTANT.DATA_TABLES.RENDER.DATE
                                    },
                                    {
                                    data: "updateTime",
                                    width: "120px",
                                    render: CONSTANT.DATA_TABLES.RENDER.DATE
                                    },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "fileCode",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "fileName",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "approvalUser",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "reason",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "remark",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "approvalOpinion",
                                width: "150px",
                                render: CONSTANT.DATA_TABLES.RENDER.ELLIPSIS//会显示省略号的列，需要用title属性实现划过时显示全部文本的效果
                                },
                                {
                                className: "ellipsis", //文字过长时用省略号显示，CSS实现
                                data: "departCode",
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
        tableManage.deleteItem(item.id,"../../fileApproval/");
    });
    /*增加一条记录*/
    $(".btn-add").click(function (e) {
        tableManage.addItem(e,"添加",addItemInit);
    });

    /*批量删除记录*/
    $(".btn-batch-del").click(function (e) {
        e.preventDefault();
        var selectedItemIds = idArrayToString(selectedItemIdList);
        tableManage.batchDeleteItem(selectedItemIds,"../../fileApproval/list/");
    });

    $('#fileApprovalForm').validator().on('submit', function (e) {
        if(!e.isDefaultPrevented()){
            e.preventDefault();
            var item=getItemValue();
            tableManage.saveItem(item,"../../fileApproval/");
        }
    });

});



function addItemInit() {

    $("#addTime").val("");
    $("#fileCode").val("");
    $("#fileName").val("");
    $("#approvalUser").val("");
    $("#reason").val("");
    $("#remark").val("");
    $("#approvalOpinion").val("");
    $("#departCode").val("");
}
function editItemInit() {

    $("#addTime").val(tableManage.currentItem.addTime);
    $("#fileCode").val(tableManage.currentItem.fileCode);
    $("#fileName").val(tableManage.currentItem.fileName);
    $("#approvalUser").val(tableManage.currentItem.approvalUser);
    $("#reason").val(tableManage.currentItem.reason);
    $("#remark").val(tableManage.currentItem.remark);
    $("#approvalOpinion").val(tableManage.currentItem.approvalOpinion);
    $("#departCode").val(tableManage.currentItem.departCode);
}
function showItemDetail(item) {
    $(".row-detail").fadeIn();
    $(".row-list").fadeOut();

    $("#addTime-view").html(item.addTime);
    $("#fileCode-view").html(item.fileCode);
    $("#fileName-view").html(item.fileName);
    $("#approvalUser-view").html(item.approvalUser);
    $("#reason-view").html(item.reason);
    $("#remark-view").html(item.remark);
    $("#approvalOpinion-view").html(item.approvalOpinion);
    $("#departCode-view").html(item.departCode);
}
function getItemValue(){
    if(tableManage.currentItem!=null){

                    tableManage.currentItem.addTime = $("#addTime").val();
                    tableManage.currentItem.fileCode = $("#fileCode").val();
                    tableManage.currentItem.fileName = $("#fileName").val();
                    tableManage.currentItem.approvalUser = $("#approvalUser").val();
                    tableManage.currentItem.reason = $("#reason").val();
                    tableManage.currentItem.remark = $("#remark").val();
                    tableManage.currentItem.approvalOpinion = $("#approvalOpinion").val();
                    tableManage.currentItem.departCode = $("#departCode").val();
        return tableManage.currentItem;
    }else{
        var item = new Object();

        item.addTime = $("#addTime").val();
        item.fileCode = $("#fileCode").val();
        item.fileName = $("#fileName").val();
        item.approvalUser = $("#approvalUser").val();
        item.reason = $("#reason").val();
        item.remark = $("#remark").val();
        item.approvalOpinion = $("#approvalOpinion").val();
        item.departCode = $("#departCode").val();
        return item;
    }
}

function  getQueryCondition(data) {
    var param = {};
    //组装排序参数
    if (data.order && data.order.length && data.order[0]) {
        switch (data.order[0].column) {


            case 1:
                param.orderColumn = "addTime";
                break;
            case 2:
                param.orderColumn = "fileCode";
                break;
            case 3:
                param.orderColumn = "fileName";
                break;
            case 4:
                param.orderColumn = "approvalUser";
                break;
            case 5:
                param.orderColumn = "reason";
                break;
            case 6:
                param.orderColumn = "remark";
                break;
            case 7:
                param.orderColumn = "approvalOpinion";
                break;
            case 8:
                param.orderColumn = "departCode";
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