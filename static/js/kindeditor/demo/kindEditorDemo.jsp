<%--
  Created by IntelliJ IDEA.
  �û�: dqm
  ���ʱ��: dqm(2015-09-26 09:30)
  ����ʱ��: dqm(2015-09-26 09:30)
  ����: kindEditor��ʾ
--%>
<!DOCTYPE html>
<%@ page contentType="text/html;charset=GBK" language="java" %>
<%@ include file="/include/taglib.jsp" %>
<html>
<head>
    <title>kindEditor��ʾ</title>

    <script charset="utf-8" src="${realPath}/utilJs/common/kindeditor/kindeditor-min.js"></script>
    <script charset="utf-8" src="${realPath}/utilJs/common/kindeditor/lang/zh_CN.js"></script>
</head>
<body>
<textarea name="content1" style="width:800px;height:350px;"></textarea>

<input type="button" value="����1" onclick="toTest1()">
<input type="button" value="����2" onclick="toTest2()">
<input type="button" value="����3" onclick="toTest3()">
<input type="button" value="����4" onclick="toTest4()">

<script>
    //����kindEditor���
    window.kindEditor1 = KindEditor.create('textarea[name="content1"]', {
        //�ļ��ϴ�jsp��savePath�ϴ�·����Ĭ���ϴ���upload�ļ����£�fileMaxSize�ϴ��ļ�����С��fileTypes�����ϴ����ļ���չ����imageTypes�����ϴ���ͼƬ��չ����
        uploadJson: realPath + "/utilJs/common/kindeditor/jsp/fileUpload.jsp?savePath=upload",

        //�ļ����jsp��savePath�ļ����Ŀ¼��Ĭ��uploadĿ¼��
        fileManagerJson: realPath + "/utilJs/common/kindeditor/jsp/fileManager.jsp?savePath=upload",
        //�ļ���������Ƿ�����Ĭ�ϲ�������
        allowFileManager: true
    });

    function toTest1() {
        //���ñ༭����HTML����
        kindEditor1.html('<strong>��ð�</strong>');
        //ȡ�ñ༭����HTML����
        alert(kindEditor1.html());

        //���ñ༭�������ݣ�ֱ����ʾHTML����
        kindEditor1.text('<strong>��ð�3</strong>');
        //ȡ�ñ༭���Ĵ��ı�����
        alert(kindEditor1.text());
    }

    function toTest2() {
        //ȡ�õ�ǰ��ѡ�е�HTML����
        alert(kindEditor1.selectedHtml());

        //��ָ����HTML���ݲ��뵽�༭������Ĺ�괦
        kindEditor1.insertHtml('<strong>��������</strong>');

        //��ָ����HTML������ӵ��༭�������λ��
        kindEditor1.appendHtml('<strong>��β׷������</strong>');
    }

    function toTest3() {
        var $_content1 = $('textarea[name="content1"]');
        $_content1.text("");

        kindEditor1.html('��ʼ<span id="userId">�û�ID</span>����');
        alert($_content1.text());

        //���༭�����������õ�ԭ����textarea�ؼ���
        kindEditor1.sync();
        alert($_content1.text());
    }

    function toTest4() {
        //����KCmd����KCmd���ڲ������ӻ��༭�����DOM
        var cmd1 = kindEditor1.cmd;

        //��ȡkindEditor������ӻ��༭�����window����
        var kindEditorWindow1 = cmd1.win;

        //��ȡkindEditor������ӻ��༭�����document����
        var kindEditorDocument1 = cmd1.doc;


        kindEditor1.html('��ʼ<span id="userId">�û�ID</span>����');
        alert(kindEditorDocument1.getElementById("userId").outerHTML);

        //������ӡ����
        cmd1.print();
    }
</script>
</body>
</html>