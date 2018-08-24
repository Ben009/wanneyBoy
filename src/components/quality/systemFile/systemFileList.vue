<template>
  <div>
    <div class="certificateLeftMenu">
      <fileTree
        ref="fileListTree"
        :dataList="dataList"
        :keyId="keyId"
        :treePid="treePid"
        :propsKey="propsKey"
        :isLazy="isLazy"
        @leftClick="leftClick"
      />
    </div>
    <div class="certificateContent">



    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import fileTree from './fileTree';
  import Clickoutside from '@/common-el/src/utils/clickoutside';

  import {ajaxRequest, ajaxSyncRequest} from '../../util/base';
  import '../../util/Base.css';

  export default {
    name: "admin",
    components: {
      fileTree
    },
    data() {
      //rentun中的变量仅针对当前组件有效
      return {
        /** sidtran:"兄弟组件间交互缓存变量",*/
        dataList: [],
        keyId: "id",
        treePid: "parentId",
        propsKey: {label: 'label', children: 'children', isLeaf: 'isLeaf'},
        isLazy: true,
        id:null,
        type:null,
        edit:null,
        pdfSrc:null,
        pageCount:0,
        currentPage:0
      }
    },
    watch: {},
    methods: {
      leftClick(data) {
        this.id = data.id;
        this.type = data.type;
        const h = this.$createElement;
        //文件
        if(data.type==1){
          let isDownload = data.isDownload;//是否可下载
          let fileExt = data.label.substring(data.label.lastIndexOf("."),data.label.length);//后缀名
          let isOffice = fileExt == ".doc" || fileExt == ".docx" || fileExt == ".xlsx" || fileExt == ".xls";
          let isPdf = fileExt == ".pdf";
          if(isDownload==1){
            //表示为可下载 或 非 excle,world 的可直接下载
            window.open(data.url);
          }else if(isDownload ==0 && isOffice) {
            //不可下载的word,excel 在 office中显示
            //设置Excel打开参数
            var jsonParam = new Object();
            jsonParam.winWidth="1000";//excel宽度，从右下角向左算
            jsonParam.winHeight="800";//excel高度，从右下角向上算
            jsonParam.excelId="A00000004081";//附件表id
            CsharpObject().ConExcelListOpen("",JSON.stringify(jsonParam));//name/string：Excel标志名, json/string：初始化参数

            //world打开方法
//            CsharpObject().ConWordListOpen("",JSON.stringify(jsonParam));//name/string：Excel标志名, json/string：初始化参数
            

//            this.$notify({
//              title: '标题名称',
//              message: h('i', { style: 'color: teal'}, '右侧显示office')
//            });

          }else if(isPdf){
            this.$notify({
              title: '标题名称',
              message: h('i', { style: 'color: teal'}, '右侧显示pdf')
            });
          }
        }else{
          this.getDataList(data.id);
        }
      },
      //从后台获得数据
      getDataList(mlId) {
        //重命名进来的
        if (mlId) {
        }
        //第一次进来的
        else {
          mlId = 0;
          this.dataList = [{"label": "目录结构", "id": "0", "parentId": "-1"}];
          this.$nextTick(() => {
            //点击第一个文件夹
            this.$refs.fileListTree.$refs.tree.$children[0].handleClick();
          })
          return;
        }
        ajaxSyncRequest('get', 'back/systemDirectory/getFileList', {pid: mlId,isDelete:0}, (res) => {
          this.dataList = res;
        });
      },
    },
    created() {
      this.getDataList();
    },
  }
</script>

<style lang="scss" scoped>
  .certificateLeftMenu {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 350px;
    bottom: 0px;
    overflow: auto;
  }

  .certificateContent {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 350px;
    overflow: auto;
  }

  .right-click-menu {
    position: fixed;
    border: 1px solid #ccc;
    padding: 2px 0;
    background: #fff;
    width: 120px;
    z-index: 9999;
  }

  .right-click-menu li {
    padding: 3px 10px;
    cursor: default;
    font-size: 14px;
    color: #606266;
  }

  .right-click-menu li:hover {
    color: #409eff;
  }

  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .btn {
    text-align: center;
    margin: 4% !important;
  }
</style>
