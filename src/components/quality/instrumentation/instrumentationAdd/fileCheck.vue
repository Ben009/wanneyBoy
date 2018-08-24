<template>
    <!-- 图文信息tab页 -->
    <div :class="{eventPause:info == 'traceabilityConfirm'}">
        <div class="file_tootip special">
            <global-tootips>
                <p>本页面用于上传设备的图片、或电子技术资料等；</p>
            </global-tootips>
        </div>
        <div class="title-item mb20"><span>上传图片</span></div>
        <div class="file_image">
            <mind-upimage ref="upImage1"  :callBack="imageCallBack.bind(this,1)"   ></mind-upimage>
            <mind-upimage ref="upImage2"  :callBack="imageCallBack.bind(this,2)"   ></mind-upimage>
            <mind-upimage ref="upImage3"  :callBack="imageCallBack.bind(this,3)"   ></mind-upimage>
            <mind-upimage ref="upImage4"  :callBack="imageCallBack.bind(this,4)"   ></mind-upimage>
            <mind-upimage ref="upImage5"  :callBack="imageCallBack.bind(this,5)"   ></mind-upimage>
        </div>
        <div class="title-item mb20"><span>上传文件</span></div>
        <mind-upload ref="upFiles" :multiple="false" :callBack="fileCallback" :before-upload='handleFileUploading'></mind-upload>
        <div class="file_bottom">
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button type="warning" @click="clear">清空</el-button>
        </div>
    </div>
</template>
<script>
import { ajaxRequest } from "../../../util/base";
import $ from "jquery";
const defaultImageList = [
  { file: null },
  { file: null },
  { file: null },
  { file: null },
  { file: null }
];
export default {
  name: "fileCheck",
  data() {
    return {
      form: { attachment: null, picture: null },
      imageList: defaultImageList, //为五个图片的上传进行单独处理
      fileList: []
    };
  },
  props: {
    // 接收新增时返回的id值
    instId: {
      required: false,
      default: ""
    },
    // 从查询页面进入时传入的设备id值
    standardId: {
      required: false,
      default: undefined
    },
    // 传入表单数据
    formData: {
      type: Object,
      default: {}
    },
    info:{
      type:String,
      default:'',
    }
  },
  watch: {
    // instId(n,o){
    //     // 新增时获取输入的数据进行更新
    //     console.log(n,'新增id值')
    //     if(n){
    //         this.getlist(n)
    //     }
    // },
    // 防止在基本信息中的修改无法检测到
    // formData(n, o) {
    //   if (!$.isEmptyObject(n)) {
    //     this.form = $.extend({}, this.formData);
    //   }
    // }
  },
  mounted() {
    if (this.standardId) {
      this.getlist(this.standardId);
    }
  },
  methods: {
    // 图片上传回调函数
    imageCallBack(index, file, list) {
      this.imageList[index - 1].file = list[0];
      // this.$set(this.imageList[index - 1],'file',file)
      // this.imageList[index].file = file;
    },
    // 文件上传回调函数
    fileCallback(file, list) {
      this.fileList = list;
    },
    submit() {
      this.$confirm("确认保存", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        type: "warning"
      }).then(() => {
        let tempFile = [];
        this.fileList.forEach((v, i) => {
          if (v) {
            tempFile.push(v.id);
          }
        });
        let tempImg = [];
        this.imageList.forEach((v, i) => {
          if (v.file) {
            tempImg.push(v.file.id);
          }
        });

        this.form.attachment = tempFile.join(",");
        this.form.picture = tempImg.join(",");
        this.form.instId = this.standardId;
        console.log(this.form, 'this.form');
        ajaxRequest("PUT","back/instrumentation/saveInstrumentationFile",  this.form, res => {
            if (res.code === 200) {
              this.$message.success("保存成功");
            }
          }
        );
      });
    },
    clear() {
      this.$refs.upFiles.deleteFile();
      for (let i = 0; i < 5; i++) {
        this.$refs["upImage" + (i + 1)].deleteFile();
      }
      this.fileList = [];
      this.imageList = [
        { file: null },
        { file: null },
        { file: null },
        { file: null },
        { file: null }
      ];
    },
    handleFileUploading(file) {
      if (!!file.name) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (file.uid != this.fileList[i].uid) {
            if (file.name == this.fileList[i].name) {
              return new Promise((resolve, reject) => {
                this.$confirm("文件名已存在，是否覆盖？")
                  .then(() => {
                    this.$refs.upFiles.setDeleteIds(this.fileList[i].id);
                    resolve(true);
                  })
                  .catch(() => {
                    reject(false);
                  });
              });
            }
          }
        }
      } else {
        return true;
      }
    },
    getlist(id) {
      ajaxRequest( "get", "back/instrumentation/getInstrumentationFile", { id: id },  res => {
          if (res.code === 200) {
            this.form = res.daoResult;
            if (res.daoResult && res.daoResult.attachment) {
              let temp = res.daoResult.attachment.split(",");
              temp.forEach((v, i) => {
                this.fileList.push({ id: v });
              });
              this.$refs.upFiles.loadAttacheIds(res.daoResult.attachment);
            }
            if (res.daoResult && res.daoResult.picture) {
              let tempArr = res.daoResult.picture.split(",");
              tempArr.forEach((v, i) => {
                this.imageList[i].file = { id: v };
                this.$refs["upImage" + (i + 1)].loadAttacheIds(v);
              });
            }
          }
        }
      );
    }
  }
};
</script>
<style scoped>
.file_tootip {
  float: right;
}
.file_image {
  display: flex;
}
.file_bottom {
  text-align: center;
}
.eventPause{
  pointer-events: none;
}
.special{
  pointer-events: all;
}
</style>
