<template>
    <div class="notification">
        <!-- 通知通告起草页面 -->
        <!-- <div class="head">通知通告</div> -->
        <div style="float:right;">
          <global-tootips>
            <template v-if="infoId">
            <p>1、当通知通告已发布或已审核之后不能修改</p>
            <p>2、当审核之后跳回查询页面</p>
            <p>3、已收阅人员:当前通知通告的收阅人信息</p>
            <p>4、未收阅人员:当前通知通告的未收阅信息</p>
            <P>5、常用组可在基础数据-其他参数-用户分组处进行维护</P>
            </template>
            <template v-else>
            <p>1、设为常用组可将查看范围人员新增为新的用户分组</p>
            <P>2、用户分组可在基础数据-其他参数-用户分组处进行维护</P>
            <P>3、有审核权限保存自动通过</P>
            </template>
          </global-tootips>
        </div>
        <el-form class="notiform" ref="form" label-width="100px" :model="info" :rules="rules">
            <el-form-item  label="标题:" prop="noticeTitle">
                <el-input class="inputform" v-model="info.noticeTitle"></el-input>
            </el-form-item>
            <el-form-item label="查看范围:" prop="userIds">
              <template slot="label">
                <span>查看范围</span>
                <el-tooltip content="若需部分人查看该内容，可选择相应的人员;不选择默认所有的均可查看">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
                <!-- <el-input type="textarea" class="inputform" v-model="info.userIds" autosize></el-input> -->
                <div class="inputform peopleSelect ">
                    <el-tag
                    v-for="item in items"
                    :closable="true"
                    size="mini"
                    type="info"
                    disable-transitions
                    @close="deleteTag($event,item)"
                    >
                    <span class="el-select__tags-text">{{item.userName}}</span>
                  </el-tag>
                </div>
                <el-button type="warning" class="el-icon-warning" @click="clearPeopleSelect">清空</el-button>
                <el-button type="primary" :disabled="!idsArr.length" @click="setUsusalGroup">设为常用组</el-button>
            </el-form-item>
            <el-row style="border: dashed 1px gray;display: flex;justify-content: flex-start;width: 82%;">
              <el-col style="width:50%;">
                <el-form-item label="部门选择:">
                    <el-select class="inputform" v-model="departId" @change="departSelect" style="width:100%">
                        <el-option v-for="item in departs"
                        :value="item.id"
                        :key="item.id"
                        :label="item.departName">
                        </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col style="width:50%;">
                <el-form-item label="人员选择:" style="position: relative;left: -3%;">
                    <el-select class="inputform" v-model="visitor" @change="visitorSelect" style="width:100%">
                        <el-option
                        v-for="item in departPeo"
                        :value="item.id"
                        :label="item.userName"
                        :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="用户分组:">
                <el-select class="inputform" v-model="groupId" @change="groupSelect">
                  <el-option
                  v-for="item in receGroup"
                  :value="item.id"
                  :key="item.id"
                  :label="item.groupName"
                  >
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="附件:">
                <mind-upload  @getFileList="handleGetFileList" :limitNumb="limitNumb" ref="upFiles" :callBack="callBack" :before-upload="handleFileUploading"></mind-upload>
            </el-form-item>
            <el-row style="margin:20px 0;">
              <p class="infopeo">
                  <span>录入人:</span>
                  {{info.createPersonName}}
              </p>
              <p class="infodate">
                  <span>录入日期:</span>
                  {{info.createTime}}
              </p>
            </el-row>
        </el-form>
        <el-row style="text-align:center;margin:20px 0;padding:0 20% 0 10%;">
            <el-button type="primary" v-has="'M57504'" v-if="infoId && info.auditingStatus == 0" @click="audit(1)">通 过</el-button>
            <el-button type="primary" v-has="'M57504'" v-if="infoId && info.auditingStatus == 0" @click="audit(2)">拒 绝</el-button>
            <el-button type="primary"  @click="handleSubmit" v-if="(info.auditingStatus == 0 && info.isShow == 0) || !infoId">保 存</el-button>
            <!-- 在搜索入口进入的时候会有查看收阅情况的按钮 -->
            <el-button type="primary" size="mini" v-if="infoId" class="button" title="已收阅人员"  @click="view(true)">
                <!-- <i class="el-icon-success"></i> style="color:#00AA90;font-size:16px;"-->
                已收阅人员
            </el-button>
            <el-button type="primary" size="mini" v-if="infoId" class="button" title="未收阅人员"  @click="view(false)">
                <!-- <i class="el-icon-success"></i> style="color:#656765;font-size:16px;"-->
                未收阅人员
            </el-button>
            <el-button @click="back"  v-if="infoId">返 回</el-button>
        </el-row>
        <member-check v-if="status"></member-check>
        <message-group-edit v-if="isAdd" @back="cancelAdd" :userIds="idsArr"></message-group-edit>
        <div class="editpo">
            <textarea name="kindeditor"  class="editor"v-model="info.noticeContent" style="resize: vertical;"></textarea>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
import Vuex from "vuex";
import { ajaxRequest } from "../../util/base";
import $ from "jquery";
import memberCheck from "./memberCheck.vue";
import messageGroupEdit from "./messageGroupEdit";

// 富文本编辑器选项
const DEFAULT_OPTIONS = {
  items:[
      'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'cut', 'copy', 'paste', 'plainpaste', '|',
      'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist',
      'indent', 'outdent', 'subscript', 'superscript', 'selectall', '|', 'formatblock', 'fontname', 'fontsize', '|',
      'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|',
      'image', 'multiimage', 'table', 'hr', 'pagebreak' , '|' , 'njmindFontInsert'
  ]
}
export default {
  name: "notification-edit",
  props: {
    infoId: {
      type: Number
    }
  },
  data() {
    let defaultInfo = {
      createTime: null,
      createPersonName: null,
      noticeTitle: null
    };
    return {
      /**创建人 创建时间 标题 通知人 附件 */
      info: $.extend({}, defaultInfo),
      rules: {
        noticeTitle: [
          {
            type: "string",
            required: true,
            message: "标题不能为空",
            trigger: "blur"
          },
          { max: 30, message: "标题不能超过30个字符", trigger: "blur" }
        ]
      },
      // 上传文件的限制
      limitNumb: 4,
      fileList: [],
      // 富文本编辑器
      kindEditor: null,
      // 部门、人员选项
      departs: [],
      departPeo: null,
      // 人员选择
      departId: null,
      visitor: null,
      // 收件组
      receGroup: [],
      items: [],
      groupId: null,
      // 便于通知人去重
      idsArr: [],
      test: "",
      // 添加默认常用组
      isAdd: false
    };
  },
  components: { memberCheck, messageGroupEdit },
  mounted() {
    let that = this;
    if (this.infoId) {
      this.getInfoById(this.infoId);
    }
    this.loadJS();
    this.getBaseInfo();

    window.KindEditor.lang({
        njmindFontInsert: '插入特殊字符',
    });
    //console.log(window.KindEditor.lang,'kindeditor')
    this.$nextTick(() => {
      if (!this.info.createTime) {
        let date = new Date();
        Vue.set(this.info, "createTime", new Date(date).format("YYYY-MM-DD"));
      }
      if (!this.info.createPersonName) {
        Vue.set(
          this.info,
          "createPersonName",
          window.localStorage.getItem("userName")
        );
      }
    });
  },
  // 页面销毁回到查询页面，并将id值置空
  destroyed() {
    this.$store.commit("SET_ID", null);
  },
  computed: {
    status() {
      return this.$store.state.Notification.viewStatus;
    }
  },
  methods: {
    // 加载富文本编辑器
    loadJS(callBackFunction) {
      var _this = this;
      _this.kindEditor = window.KindEditor.create(
        'textarea[name="kindeditor"]',DEFAULT_OPTIONS);
      // _this.kindEditor.style.resize='vertical'

      if (typeof callBackFunction == "function") {
        callBackFunction();
      }
    },
    // 根据id获取数据
    getInfoById(id) {
      this.$store.dispatch("get_info", id).then(res => {
        this.info = res.daoResult;
        this.info.createTime = new Date(this.info.createTime).format(
          "YYYY-MM-DD"
        );
        console.log(res.daoResult.noticeContent, "获取html");
        this.kindEditor.html(res.daoResult.noticeContent);
        this.idsArr = res.daoResult.userIds.split(",");
        let userNames = res.daoResult.userNames.split(",");
        let arr = [];
        for (let i = 0; i < userNames.length; i++) {
          arr.push({ userName: userNames[i], userId: this.idsArr[i] });
        }
        this.items = arr;
        if (this.info.attachment) {
          let fileId = this.info.attachment.slice(
            0,
            this.info.attachment.length - 1
          );
          this.$refs.upFiles.loadAttacheIds(fileId);
        }
      });
    },
    // 获取部门、收件组
    getBaseInfo() {
      let that = this;
      ajaxRequest("get", "back/depart/retrieve", { isDelete: 0 }, function(
        res
      ) {
        if (res.code === 200) {
          that.departs = res.rows;
        }
      });
      ajaxRequest("get", "back/group/retrieve", { isDelete: 0 }, res => {
        if (res.code === 200) {
          that.receGroup = res.rows;
        }
      });
    },
    // 上传文件的回调函数
    callBack(file, list) {
      this.fileList = list;
    },
    handleGetFileList(data) {
      this.fileList = data;
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
    // 保存信息
    handleSubmit() {
      let auditStatus = 0;
      let html = this.kindEditor.html();
      this.info.noticeContent = html;
      console.log(html, "html");
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm("是否保存").then(() => {
          // html的通知内容，限制4000个字符
          let html = this.kindEditor.html(),
            text = this.kindEditor.text();
          if (html.length > 4000) {
            this.$message.error("通知内容过长！");
            return;
          }
          console.log(html.length, html, "==========");
          // 标题不能为空
          if (!text.length) {
            this.$message.error("通知内容不能为空！");
            return;
          }
          // 添加上传文件的id
          if (!!this.fileList.length) {
            let attachment = "";
            for (let i = 0; i < this.fileList.length; i++) {
              if (!!this.fileList[i].response) {
                attachment += this.fileList[i].response.v_attach_id + ",";
              } else {
                attachment += this.fileList[i].id + ",";
              }
            }
            this.info.attachment = attachment;
          }
          if (!this.idsArr.length) {
            this.info.type = 0;
          } else {
            this.info.type = 1;
          }
          this.info.auditingStatus = auditStatus;
          this.info.userIds = this.idsArr.join();
          this.info.noticeContent = html;

            delete this.info.createTime;
            this.info.isShow = 0;
            this.info.isTop = 0;
            if (this.infoId) {
              ajaxRequest("put", "back/notice/", this.info, res => {
                if (res.code === 200) {
                  this.$message.success("保存成功！");
                  this.back();
                }
              });
            } else {
              ajaxRequest("post", "back/notice/", this.info, res => {
                if (res.code === 200) {
                  this.$message.success("保存成功！");
                  this.info = {};
                  this.clearPeopleSelect();
                  this.kindEditor.html(" ");
                  let date = new Date();
                  Vue.set(
                    this.info,
                    "createTime",
                    new Date(date).format("YYYY-MM-DD")
                  );
                  Vue.set(
                    this.info,
                    "createPersonName",
                    window.localStorage.getItem("userName")
                  );
                  this.departId = this.groupId = this.visitor = null;
                  this.fileList = [];
                  this.$refs["upFiles"].$refs["upFiles"].clearFiles();
                }
              });
            }
          });
        }
      });
    },
    // 根据部门选择相关人员
    departSelect() {
      ajaxRequest(
        "get",
        "back/user/listUserByDeptId/" + this.departId,
        {},
        res => {
          this.departPeo = res.rows;
          this.visitor = "";
        }
      );
    },
    // 选择部门下具体的通知人员
    visitorSelect(item) {
      this.visitor = item;
      if (!this.idsArr.length) {
        this.idsArr.push(item);
        this.departPeo.forEach((value, index, array) => {
          if (value.id == item) {
            this.items.push(value);
          }
        });
        return;
      }
      this.departPeo.forEach((value, index, array) => {
        if (value.id === item) {
          let flag = true;
          this.idsArr.forEach((v, i, a) => {
            if (v == value.id) {
              flag = false;
            }
          });
          if (flag) {
            this.idsArr.push(value.id);
            this.items.push(value);
          }
        }
      });
    },
    // 选择收件组
    groupSelect() {
      ajaxRequest(
        "get",
        "back/group/retrieveGroupPersons",
        { groupId: this.groupId },
        res => {
          if (res.code === 200) {
            if (!this.idsArr.length) {
              this.items = this.items.concat(res.rows);
              res.rows.forEach((v, i, a) => {
                this.idsArr.push(v.userId);
              });
              return;
            }
            res.rows.forEach((value, index, arr) => {
              let flag = true;
              this.idsArr.forEach((v, i, a) => {
                if (value.userId == v) {
                  flag = false;
                }
              });
              if (flag) {
                this.idsArr.push(value.userId);
                this.items = this.items.concat(value);
              }
            });
          }
        }
      );
    },
    // 删除点击标签
    deleteTag(event, tag) {
      let index = this.items.indexOf(tag);
      if (index > -1) {
        this.items.splice(index, 1);
        this.idsArr.forEach((v, i, a) => {
          if (v == tag.userId) {
            a.splice(i, 1);
          }
        });
      }
    },
    // 清空按钮
    clearPeopleSelect() {
      this.items = [];
      this.idsArr = [];
      this.groupIdsArr = [];
    },
    // 返回
    back() {
      this.$store.commit("SET_ID", null);
    },
    // 查阅情况的查看
    view(flag) {
      this.$store.commit("SET_NOTICEDID", this.infoId);
      if (flag) {
        this.$store.commit("SET_VIEWSTAUTS", "viewed");
      } else {
        this.$store.commit("SET_VIEWSTAUTS", "unviewed");
      }
    },
    // 设为常用组
    setUsusalGroup() {
      this.isAdd = true;
    },
    // 关闭弹窗
    cancelAdd() {
      this.isAdd = false;
    },
    //审核功能
    audit(ele) {
      ajaxRequest(
        "put",
        "back/notice/updateNoticeStatus",
        { auditingStatus: ele, id: this.infoId },
        res => {
          console.log(res)
          if (res.code == 200) {
            this.$message.success('审核成功！');
            this.back();
          }
        }
      );
    }
  }
};
</script>
<style scoped>
/*****头部样式*****/
.head {
  text-align: center;
  vertical-align: middle;
  font-size: 20px;
  padding: 10px 0;
  background-color: rgb(30, 187, 167);
  color: white;
}
/*****表单样式*****/
.notiform {
  /* text-align: center; */
  padding: 0 10vw;
}
.inputform {
  width: 80%;
}
/*****文本编辑器******/
.editor {
  margin-top: 20px;
  text-align: center;
  height: 400px;
  /* outline: solid 1px #969696; */
  outline: solid 1px black;
  /* border: solid 1px black; */
}
.editpo {
  margin: 0 10%;
  outline: solid 1px gray;
}
/************/
.infopeo,
.infodate {
  display: inline-block;
  width: 40%;
  color: #606266;
}
.infopeo span,
.infodate span {
  display: inline-block;
  width: 100px;
  text-align: right;
}
.el-form-item__error {
  left: 100px !important;
}
.peopleSelect {
  border: solid 1px #bbb;
  border-radius: 4px;
  padding: 4px;
  min-height: 50px;
  line-height: 20px;
  margin-top: 8px;
}
</style>


