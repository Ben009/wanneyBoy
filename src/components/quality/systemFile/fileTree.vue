<template>
  <div>
    <!--
    data:传入的数据（自动加载模式下生效）
    node-key:tree的主键ID（需唯一）
    check-strictly：在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
    highlight-current:选中节点高亮
    auto-expand-parent:展开子节点的时候是否自动展开父节点
    props:生成tree的一些参数
    {
      label	指定节点标签为节点对象的某个属性值
      children	指定子树为节点对象的某个属性值
      disabled	指定节点选择框是否禁用为节点对象的某个属性值
      isLeaf	指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
    }
    default-expanded-keys:默认展开的节点的 key 的数组
    node-click：左击
    lazy：是否lazy模式，默认false
    load：lazy模式生效，加载子节点时执行的方法
    node-contextmenu：右击
    -->
    <el-tree
      ref="tree"
      :data="dataTreeList"
      :node-key="keyId"
      check-strictly
      highlight-current
      :auto-expand-parent="true"
      :props="propsKey"
      :default-expanded-keys="defaultExpandedKeys"
      @node-click="handleNodeClick"
      :lazy="isLazy"
      @node-contextmenu="handleRightClick"
      :load="loadChildNode"
      :default-expand-all="expandAll"
      :show-checkbox="showCheckbox"
    >

      <span class="custom-tree-node" slot-scope="{ node, data }">
        <!-- 文件夹 -->
        <span v-if="node.data.type == 0">
          <span><i class="el-icon-edit-outline">{{ node.data[propsKey.label] }}</i></span>
        </span>

        <!-- 文件 -->
        <span v-else-if="node.data.type == 1">
          <i class="el-icon-document">{{ node.data[propsKey.label] |fileName }}</i>
        </span>

        <span v-else>
          <i class="el-icon-edit-outline">{{ node.data[propsKey.label] }}</i>
        </span>

      </span>
    </el-tree>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';

  import {ajaxRequest, ajaxSyncRequest } from '../../util/base';
  import WorkMould from '../../mould/WorkMould';

  import $ from 'jquery';
  import '../../util/Base.css';
  import '../../util/CustomTable.css';
  import ElTabs from '@/common-el/packages/tabs/src/tabs.vue'


    export default {
      name: "CertificateListTree",
      components:{
        ElTabs,
        WorkMould,
      },
      props: {
        //获得父页面传进来的参数
        dataList: {required: true},
        keyId: {required: true},
        propsKey: {required: true},
        currentKey: {default: null},
        treePid:{required: true},
        isLazy:{default: false},
//        updateNode:{default: null},
        expandAll:{default: false},
        showCheckbox:{default: false}
      },
      mounted() {

      },
      filters:{
        //获取文件名称
        fileName: function(value) {
          return value.substring(0,value.lastIndexOf("."));
        }
      },
      data(){
          return{
            dataTreeList: [],
            pid: null,
            subData: {},
            showPid: [],
            selectedInfo: {},
            multipleSelection:[],
            fuzzySearch:0,
            isSetting:0,
            showBtnMore: true,
            //默认被打开的节点
            defaultExpandedKeys: [],
            //默认被选中的节点
            checkedKeys:[],
            checkedKeysTemp:null,
          }
        },
      watch:{
        //监听参数的变化
        dataList(){
          this.getDataList();
        },
//        updateNode(){
//          this.appenTreeNode();
//        },
        currentKey(){
          this.checkedKeysTemp = this.currentKey;
        },
      },
      methods:{
        setTreeCurrentKey(){
          //设置选中的节点
          if(this.currentKey != null){
            this.$refs.tree.setCurrentKey(this.currentKey);
          }
          //设置选中的checkbox
          if(this.checkedKeys.length>0){
            this.$refs.tree.setCheckedKeys(this.checkedKeys);
          }
        },
        //调用父组件获得list，刷新tree
        getDataList() {
          //获得需要默认选中的key
          this.checkedKeys = this.$refs.tree.getCheckedKeys();
          //将需要选中的节点放在默认打开的菜单中
          this.defaultExpandedKeys[0]=this.currentKey;
          if(this.isLazy){

          }else {
            this.dataTreeList = this.formatArrayToTree(this.dataList, [], 0, []);
            //将设置选中的方法放在js执行队列的最后再执行
            this.$nextTick(()=>{
              this.setTreeCurrentKey();
            })
          }
        },
        //左击
        handleNodeClick(data, node, comp) {
          //(懒加载 && 目前无子节点) || 是根节点
          console.log("调用handleNodeClick方法了")
          if((!this.isLazy && node.childNodes.length==0) || node.isLeaf){
            this.leftClick(data, node, comp );
          }else if(node.childNodes.length >0 ){
            this.leftClick(data, node, comp );
          }
        },
        //将数字组装成tree的格式
        formatArrayToTree(array, target, pid, parents){
          for(let i=0,len=array.length;i<len;i++){
            let curr=array[i];
            if(curr[this.treePid]===pid){
              target.push(curr);
              curr.parents=parents;
              let children=this.formatArrayToTree(array, [], curr[this.keyId], parents.concat([curr]));
              if(children.length>0){
                curr.children=children;
              }
            }
          }
          return target;
        },
        handleRightClick (event,obj,node) {
          this.$emit('showRightClickMenu', event,obj,node );
        },
        //左击调用父组件方法
        leftClick(data, node, comp) {
          /** 调用父级模块相应的方法 <LeftMenu @openNewTab="父级方法名"> */
          this.$emit('leftClick', data, node, comp );
        },
        loadChildNode(node, resolve){
          //懒加载的list直接用传进来的
          if (node.level === 0) {
            console.log(this.dataList,'this.dataList')
            return resolve(this.dataList);
          }
          //非主节点，进行查询
          if (node.level > 0){
            this.$emit('leftClick',node.data );
            var _this = this;
            //通过settimeout将该线程放置线程队列最后。
            // 200毫秒是为了将加载的动画效果显示出来，效果更好些
            setTimeout(() => {
              resolve(_this.dataList);
            },200);
          }
        },
        getTreeNode(keyId){
          return this.$refs.tree.getNode(keyId)
        },

        appenTreeNode(updateNode){
          if(this.$refs.tree.getNode(updateNode[this.keyId])){
            this.$refs.tree.getNode(updateNode[this.keyId]).setData(updateNode);
            this.$refs.tree.getNode(updateNode[this.keyId]).loaded = false ;
            this.$refs.tree.getNode(updateNode[this.keyId]).expanded = false ;
          }else {
            if(this.$refs.tree.getNode(updateNode[this.treePid]).loaded){
              this.$refs.tree.append(updateNode,updateNode[this.treePid]);
            }
          }
        },
        delTreeNode(key){
          this.$refs.tree.remove(key)
        },
        updateNode(key,data){
          this.$refs.tree.updateKeyChildren(key,data);
        }
      },

    }

</script>

<style>

</style>
