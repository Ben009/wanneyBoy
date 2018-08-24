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
        @showRightClickMenu="showRightClickMenu"
      />
    </div>
    <div class="certificateContent">
      <systemFileUpload :id="id" :type="type"></systemFileUpload>

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
  import systemFileUpload from './systemFileUpload';

  export default {
    name: "admin",
    components: {
      fileTree, systemFileUpload
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
        id: null,
        type: null,

        edit: null,
        /**  右击事件  **/
        folderFirst: [
          {"operation": "1", "name": "增加下级目录"}
        ],
        folderSecond: [
          {"operation": "1", "name": "增加下级目录"},
          {"operation": "3", "name": "删除"},
          {"operation": "5", "name": "重命名"},
        ]
      }
    },
    watch: {},
    methods: {

      leftClick(data) {
        this.id = data.id + '';
        this.type = data.type;
        this.getDataList(data.id + '');
      },
      //从后台获得数据
      getDataList(mlId) {
        if (mlId) {

        }else {
          mlId = 0;
          this.dataList = [{"label": "目录结构", "id": "0", "parentId": "-1"}];
          this.$nextTick(() => {
            //点击第一个文件夹
            this.$refs.fileListTree.$refs.tree.$children[0].handleClick();
          })
          return;
        }
        ajaxSyncRequest('get', 'back/systemDirectory/getFileTree', {pid: mlId, isDelete: 0}, (res) => {
          this.dataList = res;
        });
      },
      handleEdit(rowInfo, op, _value) {
        //重命名
        if (_value.flag3 == '') {
          this.$message.error('目录名称不能为空')
          return true
        }
        if (op == 5) {
          ajaxSyncRequest('put', 'back/systemDirectory/', {id: rowInfo.id, name: _value.flag3}, (res) => {
            if (res.code === 200) {
              let form = res.daoResult;
              let obj = new Object();
              obj.label = form.name;
              obj.isLeaf = (form.type != 0)
              obj.children = []
              obj.id = form.id;
              obj.parentId = form.parentId;
              obj.type = form.type;
              this.$refs.fileListTree.appenTreeNode(obj);
              this.$message.success('修改成功')
            } else {
              this.$message.error('修改失败')
            }
          })
        } else if (op == 1) {
          //新增
          let obj = new Object();
          obj.isDownload = 0;
          obj.isDelete = 0;
          obj.isControl = 0;
          obj.parentId = rowInfo.id;
          obj.name = _value.flag3;
          obj.type = 0;
          //this.$refs.fileListTree.appenTreeNode(obj);
          ajaxSyncRequest('post', 'back/systemDirectory/', obj, (res) => {
            if (res.code === 200) {
              this.$message.success('添加成功');
              let form = res.daoResult;
              let obj = new Object();
              obj.label = form.name;
              obj.isLeaf = (form.type != 0)
              obj.children = []
              obj.id = form.id;
              obj.parentId = form.parentId;
              obj.type = form.type;
              this.$refs.fileListTree.appenTreeNode(obj);
              // console.log(form,'TREE')
            } else {
              this.$message.error('添加失败');
            }
          })
        }
      },
      // 操作
      handleOperation(obj, node, op, _this) {
        //
        //删除
        if (op == 3) {
          this.deleteFun(obj.id);
        } else {
          this.handleEdit(obj, op, _this);
        }
      },

      handleClose() {
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },
      handleRightClickOperation(op, _this) {
        this.handleClose();
        handleOperation(obj, node, op, _this)
      },
      //右击事件
      showRightClickMenu(event, obj, node) {
        let handleOperation = this.handleOperation;
        let ops = [];
        if (obj.id == 0) {
          //固定数据
          ops = this.folderFirst
        } else if (obj.type == 0) {
          //文件夹
          ops = this.folderSecond;
        }
        let RightClickMenu = Vue.extend({
          data() {
            return {
              ops: ops
            }
          },
          methods: {
            handleClose() {
              this.$destroy(true);
              if (this.$el.parentNode) {
                this.$el.parentNode.removeChild(this.$el);
              }
            },
            handleRightClickOperation(op, _this) {
              this.handleClose();
              handleOperation(obj, node, op, _this)
            },
            handleOpen() {
              this.$el.style.visibility = 'hidden'
              return true
            }
          },
          directives: {Clickoutside},
          template: `<ul class="right-click-menu" v-clickoutside="handleClose">
                      <li v-mindPopover="{message:'<div>新增下级目录</div><div><el-input v-model=flag3 v-focusSelectFull></el-input></div>',success:handleRightClickOperation.bind(this,1),info:'',placement:'bottom',isOpen:handleOpen.bind(this)}">新增下级目录</li>
                      <li v-if="${obj.id} != 0" v-mindPopover="{message:'<div>重命名</div><div><el-input v-model=flag3 v-focusSelectFull></el-input></div>',success:handleRightClickOperation.bind(this,5),info:'${obj.label}',isOpen:handleOpen.bind(this)}">重命名</li>
                      <li v-if="${obj.id} != 0" v-mindPopover="{message:'是否删除?',success:handleRightClickOperation.bind(this,3),isOpen:handleOpen.bind(this)}">删除</li>
                    </ul>`
        });
        let instance = new RightClickMenu().$mount();

        document.body.appendChild(instance.$el);
        let windowWidth = document.documentElement.clientWidth,
          windowHeight = document.documentElement.clientHeight,
          eventX = event.clientX,
          eventY = event.clientY;
        let dom = instance.$el,
          menu = dom.getBoundingClientRect();
        let left = eventX + menu.width > windowWidth ? eventX - menu.width : eventX,
          top = eventY + menu.height > windowHeight ? eventY - menu.height : eventY;
        dom.style.top = top + 'px';
        dom.style.left = left + 'px';
      },

      //删除目录或者文件
      deleteFun(id) {
        ajaxRequest('put', 'back/systemDirectory/', {id: id, isDelete: 1}, (res) => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.$refs.fileListTree.delTreeNode(id);
          } else {
            this.$message.error('删除失败')
          }
        })
      }
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
