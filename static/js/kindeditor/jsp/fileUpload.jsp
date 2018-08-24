<%--
  Created by IntelliJ IDEA.
  用户: dqm
  添加时间: dqm(2015-10-07 09:30)
  更新时间: dqm(2015-10-07 09:30)
  功能: kindEditor文件上传
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.*,java.io.*" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="org.apache.commons.fileupload.*" %>
<%@ page import="org.apache.commons.fileupload.disk.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.*" %>
<%@ page import="org.json.simple.*" %>
<%
    response.setContentType("text/html; charset=UTF-8");
    if (!ServletFileUpload.isMultipartContent(request)) {
        out.println(getError("请选择文件！"));
        return;
    }


    //上传文件保存目录路径
    String savePath = request.getParameter("savePath");
    if (savePath == null) {
        savePath = "upload";//默认保存在upload路径下
    } else {
        savePath = "upload/" + savePath;
    }
    savePath += "/";
    savePath = savePath.replaceAll("//", "/");

    //上传文件最大大小
    String fileMaxSizeStr = request.getParameter("fileMaxSize");
    long fileMaxSize = 100 * 1024 * 1024;//默认最大100M
    if (fileMaxSizeStr != null) {
        try {
            fileMaxSize = Long.parseLong(fileMaxSizeStr);
        } catch (Exception e) {
        }
    }

    //定义允许上传的文件扩展名
    Map<String, String> extMap = new HashMap<String, String>();
    extMap.put("image", request.getParameter("imageTypes") != null ? request.getParameter("imageTypes") : "gif,jpg,jpeg,png,bmp");//图片类型
    extMap.put("flash", request.getParameter("flashTypes") != null ? request.getParameter("flashTypes") : "swf,flv");//flash类型
    extMap.put("media", request.getParameter("mediaTypes") != null ? request.getParameter("mediaTypes") : "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb");//媒体类型
    extMap.put("file", request.getParameter("fileTypes") != null ? request.getParameter("fileTypes") : "doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2");//文件类型


    String dirName = request.getParameter("dir");
    if (dirName == null) {
        dirName = "image";
    }
    if (!extMap.containsKey(dirName)) {
        out.println(getError("目录名不正确！"));
        return;
    }


    //文件保存目录路径
    String saveRealPath = pageContext.getServletContext().getRealPath("/") + savePath;
    //文件保存目录URL
    String saveUrl = request.getContextPath() + "/" + savePath;


    //检查目录
    File uploadDir = new File(saveRealPath);
    if (!uploadDir.isDirectory()) {
        uploadDir.mkdirs();
        //out.println(getError("上传目录不存在！"));
        //return;
    }else{
        //检查目录写权限
        if (!uploadDir.canWrite()) {
            out.println(getError("上传目录没有写权限！"));
            return;
        }
    }


    //创建文件夹
    saveRealPath += dirName + "/";
    saveUrl += dirName + "/";
    File saveDirFile = new File(saveRealPath);
    if (!saveDirFile.exists()) {
        saveDirFile.mkdirs();
    }

    //创建日期文件夹
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
    String ymd = sdf.format(new Date());

    saveRealPath += ymd + "/";
    saveUrl += ymd + "/";
    File dirFile = new File(saveRealPath);
    if (!dirFile.exists()) {
        dirFile.mkdirs();
    }


    FileItemFactory factory = new DiskFileItemFactory();
    ServletFileUpload upload = new ServletFileUpload(factory);
    upload.setHeaderEncoding("UTF-8");
    List items = upload.parseRequest(request);
    Iterator itr = items.iterator();
    while (itr.hasNext()) {
        FileItem item = (FileItem) itr.next();
        String fileName = item.getName();
        if (!item.isFormField()) {
            //检查文件大小
            if (item.getSize() > fileMaxSize) {
                out.println(getError("上传文件大小超过限制！"));
                return;
            }
            //检查扩展名
            String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
            if (!Arrays.<String>asList(extMap.get(dirName).split(",")).contains(fileExt)) {
                out.println(getError("上传文件扩展名是不允许的扩展名。\n只允许" + extMap.get(dirName) + "格式！"));
                return;
            }

            SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
            String newFileName = df.format(new Date()) + "_" + UUID.randomUUID().toString().replaceAll("-", "") + "." + fileExt;
            try {
                File uploadedFile = new File(saveRealPath, newFileName);
                item.write(uploadedFile);
            } catch (Exception e) {
                out.println(getError("上传文件失败！"));
                return;
            }

            JSONObject obj = new JSONObject();
            obj.put("error", 0);
            obj.put("url", saveUrl + newFileName);
            out.println(obj.toJSONString());
        }
    }
%>
<%!
    private String getError(String message) {
        JSONObject obj = new JSONObject();
        obj.put("error", 1);
        obj.put("message", message);
        return obj.toJSONString();
    }
%>