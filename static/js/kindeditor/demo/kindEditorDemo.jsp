<%--
  Created by IntelliJ IDEA.
  用户: dqm
  添加时间: dqm(2015-09-26 09:30)
  更新时间: dqm(2015-09-26 09:30)
  功能: kindEditor演示
--%>
<!DOCTYPE html>
<%@ page contentType="text/html;charset=GBK" language="java" %>
<%@ include file="/include/taglib.jsp" %>
<html>
<head>
    <title>kindEditor演示</title>

    <script charset="utf-8" src="${realPath}/utilJs/common/kindeditor/kindeditor-min.js"></script>
    <script charset="utf-8" src="${realPath}/utilJs/common/kindeditor/lang/zh_CN.js"></script>
</head>
<body>
<textarea name="content1" style="width:800px;height:350px;"></textarea>

<input type="button" value="测试1" onclick="toTest1()">
<input type="button" value="测试2" onclick="toTest2()">
<input type="button" value="测试3" onclick="toTest3()">
<input type="button" value="测试4" onclick="toTest4()">

<script>
    //加载kindEditor组件
    window.kindEditor1 = KindEditor.create('textarea[name="content1"]', {
        //文件上传jsp（savePath上传路径，默认上传到upload文件夹下，fileMaxSize上传文件最大大小，fileTypes允许上传的文件扩展名，imageTypes允许上传的图片扩展名）
        uploadJson: realPath + "/utilJs/common/kindeditor/jsp/fileUpload.jsp?savePath=upload",

        //文件浏览jsp（savePath文件浏览目录，默认upload目录）
        fileManagerJson: realPath + "/utilJs/common/kindeditor/jsp/fileManager.jsp?savePath=upload",
        //文件浏览功能是否开启（默认不开启）
        allowFileManager: true
    });

    function toTest1() {
        //设置编辑器的HTML内容
        kindEditor1.html('<strong>你好啊</strong>');
        //取得编辑器的HTML内容
        alert(kindEditor1.html());

        //设置编辑器的内容，直接显示HTML代码
        kindEditor1.text('<strong>你好啊3</strong>');
        //取得编辑器的纯文本内容
        alert(kindEditor1.text());
    }

    function toTest2() {
        //取得当前被选中的HTML内容
        alert(kindEditor1.selectedHtml());

        //将指定的HTML内容插入到编辑区域里的光标处
        kindEditor1.insertHtml('<strong>输入文字</strong>');

        //将指定的HTML内容添加到编辑区域最后位置
        kindEditor1.appendHtml('<strong>结尾追加文字</strong>');
    }

    function toTest3() {
        var $_content1 = $('textarea[name="content1"]');
        $_content1.text("");

        kindEditor1.html('开始<span id="userId">用户ID</span>结束');
        alert($_content1.text());

        //将编辑器的内容设置到原来的textarea控件里
        kindEditor1.sync();
        alert($_content1.text());
    }

    function toTest4() {
        //创建KCmd对象，KCmd用于操作可视化编辑区域的DOM
        var cmd1 = kindEditor1.cmd;

        //获取kindEditor组件可视化编辑区域的window对象
        var kindEditorWindow1 = cmd1.win;

        //获取kindEditor组件可视化编辑区域的document对象
        var kindEditorDocument1 = cmd1.doc;


        kindEditor1.html('开始<span id="userId">用户ID</span>结束');
        alert(kindEditorDocument1.getElementById("userId").outerHTML);

        //弹出打印窗口
        cmd1.print();
    }
</script>
</body>
</html>